import { create } from "zustand";
const STORAGE_KEY = "cv_generator_state_v1";

const initialState = {
  step: 1,
  visaType: null, // "H2A" | "H2B"
  data: {
    personalInfo: {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      photoDataUrl: "",
    },
    languages: [],
    educationText: "", // NOVO (texto livre)
    skills: [], // max 16
    profileText: "",
    experiences: [],
    templateId: "template1", // "template1" | "template2" | "template3"
    accent: "blue", // "blue" | "red"
  },
};

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useCVStore = create((set, get) => {
  const persisted = loadPersistedState();

  return {
    ...(persisted || initialState),

    actions: {
      setVisaType: (visaType) => set({ visaType }),

      setTemplateId: (templateId) => {
        set((state) => ({
          data: { ...state.data, templateId },
        }));
      },

      setAccent: (accent) => {
        set((state) => ({
          data: { ...state.data, accent },
        }));
      },

      goToStep: (step) => {
        const safeStep = Math.max(1, Math.min(4, Number(step) || 1));
        set({ step: safeStep });
      },

      nextStep: () => {
        const { step } = get();
        set({ step: Math.min(step + 1, 4) });
      },

      prevStep: () => {
        const { step } = get();
        set({ step: Math.max(step - 1, 1) });
      },

      updatePersonalInfo: (patch) => {
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...patch },
          },
        }));
      },

      setPhotoDataUrl: (photoDataUrl) => {
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, photoDataUrl },
          },
        }));
      },

      updateProfileText: (value) => {
        set((state) => ({
          data: { ...state.data, profileText: value },
        }));
      },

      updateEducationText: (value) => {
        set((state) => ({
          data: { ...state.data, educationText: value },
        }));
      },

      addLanguage: (name) => {
        const { data } = get();
        const exists = data.languages.some(
          (l) => l.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) return;

        const newLang = { id: makeId("lang"), name, level: "Basic" };
        set((state) => ({
          data: {
            ...state.data,
            languages: [...state.data.languages, newLang],
          },
        }));
      },

      updateLanguage: (id, patch) => {
        set((state) => ({
          data: {
            ...state.data,
            languages: state.data.languages.map((l) =>
              l.id === id ? { ...l, ...patch } : l
            ),
          },
        }));
      },

      removeLanguage: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            languages: state.data.languages.filter((l) => l.id !== id),
          },
        }));
      },

      toggleSkill: (skillId) => {
        set((state) => {
          const has = state.data.skills.includes(skillId);

          if (has) {
            return {
              data: {
                ...state.data,
                skills: state.data.skills.filter((id) => id !== skillId),
              },
            };
          }

          if (state.data.skills.length >= 16) return state;

          return {
            data: { ...state.data, skills: [...state.data.skills, skillId] },
          };
        });
      },

      addExperience: () => {
        const { data } = get();
        if (data.experiences.length >= 4) return;

        const exp = {
          id: makeId("exp"),
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          descriptionText: "",
        };

        set((state) => ({
          data: {
            ...state.data,
            experiences: [...state.data.experiences, exp],
          },
        }));
      },

      updateExperience: (id, patch) => {
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.map((e) =>
              e.id === id
                ? {
                    ...e,
                    ...patch,
                    endDate: patch.isCurrent ? "" : patch.endDate ?? e.endDate,
                  }
                : e
            ),
          },
        }));
      },

      removeExperience: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.filter((e) => e.id !== id),
          },
        }));
      },

      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ ...initialState });
      },
    },
  };
});
useCVStore.subscribe((state) => {
  const { actions, ...persistable } = state;
  try {
    localStorage.setItem("cv_generator_state_v1", JSON.stringify(persistable));
  } catch {}
});
