import ProfessionalTemplate from "./ProfessionalTemplate";
import FlagTemplate from "./FlagTemplate";
import BrazilUsaTemplate from "./BrazilUsaTemplate";
import SolidHeaderTemplate from "./SolidHeaderTemplate";
import BlueSidebarImageHeaderTemplate from "./BlueSidebarImageHeaderTemplate";

export const TEMPLATE_REGISTRY = [
  {
    id: "template1",
    title: "Template 1 — Clean Sidebar",
    description:
      "Template com faixa colorida à esquerda. Funciona para H2-A e H2-B.",
    component: ProfessionalTemplate,
    accents: ["blue", "red"],
    thumbTitle: "Template 1 — Clean Sidebar",
  },
  {
    id: "template2",
    title: "Template 2 — Decorative sidebar",
    description: "Template com 2 faixas à esquerda e estrelas.",
    component: FlagTemplate,
    accents: ["blue", "red"],
    thumbTitle: "Template 2 — Decorative sidebar",
  },
  {
    id: "template3",
    title: "Template 3 — Brazil/USA Header",
    description:
      "Template com cabeçalho em imagem (Brasil + EUA) e sidebar cinza com foto circular.",
    component: BrazilUsaTemplate,
    accents: ["blue", "red"],
    thumbTitle: "Template 3 — Brazil/USA Header",
  },

  {
    id: "template4",
    title: "Template 4 — Solid Header",
    description:
      "Template com cabeçalho sólido, foto quadrada, contato em linha e layout corporativo.",
    component: SolidHeaderTemplate,
    accents: ["blue", "red"],
    thumbTitle: "Template 4 — Solid Header",
  },
  {
    id: "template5",
    title: "Template 5 — Blue Sidebar + Image Header",
    description:
      "Sidebar azul sólida com foto, profile/skills/language na esquerda e header com imagem de fundo.",
    component: BlueSidebarImageHeaderTemplate,
    accents: ["blue", "red"],
    thumbTitle: "Template 5 — Blue Sidebar + Image Header",
  },
];

export function getTemplateById(id) {
  return TEMPLATE_REGISTRY.find((t) => t.id === id) || TEMPLATE_REGISTRY[0];
}

export function getTemplatePreviewSrc(templateId, accent) {
  return `/assets/${templateId}-${accent}.png`;
}
