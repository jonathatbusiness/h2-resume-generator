# CV Generator - H2A/H2B Visa Resume Builder

A professional resume generator specifically designed for H2A (agricultural) and H2B (non-agricultural) visa applications to the United States. This tool streamlines the creation of compliant, well-formatted resumes tailored to temporary work visa requirements.

## Overview

This application provides a guided, step-by-step interface for creating professional resumes that meet the specific requirements of H2A and H2B visa applications. It includes multiple professionally designed templates, skill catalogs specific to each visa type, and AI-assisted content improvement prompts.

## Features

### Core Functionality

- **Visa Type Selection**: choose between H2A (agricultural) or H2B (non-agricultural) visa types
- **Step-by-Step Wizard**: guided process through four main stages:
  1. Visa type selection
  2. Data entry (contact info, languages, education, skills, profile, experience)
  3. Template selection with accent color customization
  4. Preview and PDF export

### Data Management

- **Personal Information**: Full name, phone, email, location, and photo upload
- **Languages**: Add multiple languages with proficiency levels (Native, Advanced, Intermediate, Basic)
- **Education**: Free-text field for educational background
- **Skills**: Curated skill lists specific to each visa type (up to 16 selections)
- **Professional Profile**: Summary text with AI prompt assistance
- **Work Experience**: Up to 4 experiences with company, dates, and descriptions

### Template System

Five professionally designed templates with customizable accent colors:

- **Template 1 - Clean Sidebar**: Side-colored stripe layout
- **Template 2 - Decorative Sidebar**: Dual stripes with star decorations
- **Template 3 - Brazil/USA Header**: Image header with circular photo in gray sidebar
- **Template 4 - Solid Header**: Solid header with square photo and inline contact information
- **Template 5 - Blue Sidebar + Image Header**: Solid blue sidebar with background image header

Each template supports multiple accent colors (typically blue and red variants).

### AI-Assisted Content Generation

The application provides ready-to-copy prompts for external AI tools to help improve:

- Professional profile summaries
- Job experience descriptions (formatted as bullet points for H2A, paragraphs for H2B)

Prompts are pre-configured with relevant skills and visa-specific formatting requirements.

### Export Capabilities

- High-quality PDF generation using html2canvas and jsPDF
- Maintains exact template formatting and styling
- Automatic filename generation based on user name and visa type

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 18 with Vite
- **State Management**: Zustand with localStorage persistence
- **Styling**: CSS Modules for component-scoped styles
- **PDF Generation**: html2canvas + jsPDF
- **Icons**: react-icons (Font Awesome)

### Project Structure

```
src/
├── components/
│   ├── template/
│   │   ├── BlueSidebarImageHeaderTemplate.jsx
│   │   ├── BrazilUsaTemplate.jsx
│   │   ├── FlagTemplate.jsx
│   │   ├── ProfessionalTemplate.jsx
│   │   ├── SolidHeaderTemplate.jsx
│   │   ├── TemplatePreview.jsx
│   │   ├── TemplateSelector.jsx
│   │   └── templateRegistry.js
│   └── wizard/
│       ├── CVFormWizard.jsx
│       └── VisaTypeSelector.jsx
├── pages/
│   └── Generator.jsx
├── store/
│   └── useCVStore.js
├── utils/
│   ├── cvDictionaries.js
│   ├── pdfExport.js
│   ├── promptBuilder.js
│   └── validators.js
├── App.jsx
└── main.jsx
```

### Key Components

**useCVStore.js**: Zustand store managing application state with localStorage persistence. Handles all data mutations through centralized actions.

**templateRegistry.js**: Central registry for all resume templates with metadata (title, description, supported accents, component references).

**cvDictionaries.js**: Defines language options, proficiency levels, and skill catalogs for both H2A and H2B visa types. Skills are provided in Portuguese for UI display and English for CV output.

**promptBuilder.js**: Generates AI prompts for profile and experience content improvement, incorporating selected skills and visa-specific formatting requirements.

**pdfExport.js**: Handles PDF generation with proper scaling and formatting preservation.

### State Management

Application state includes:

- Current wizard step (1-4)
- Selected visa type
- Personal information (name, contact details, photo)
- Languages with proficiency levels
- Education text
- Selected skills (maximum 16)
- Professional profile text
- Work experiences (maximum 4)
- Selected template ID
- Accent color preference

State persists automatically to localStorage under the key `cv_generator_state_v1`.

## Skill Catalogs

### H2B Skills (Non-Agricultural)

30 skills covering hospitality, cleaning, maintenance, and general service work including:

- Room cleaning, bathroom sanitation, linen handling
- Time management, teamwork, reliability
- Customer service, guest assistance
- Light maintenance, basic tools handling
- Floor care, vacuuming, glass cleaning
- Safety procedures, organization

### H2A Skills (Agricultural)

29 skills covering farm operations, crop management, and animal care including:

- Planting, harvesting, soil preparation
- Irrigation support, weeding, pruning
- Pest control support, crop handling
- Packing/sorting produce
- Equipment cleaning, basic maintenance
- Animal care support, feeding, watering
- Field sanitation, tool handling

## Data Validation

- Email validation using regex pattern
- Phone validation (minimum 8 characters)
- Maximum limits enforced (16 skills, 4 experiences)
- Required field checking before PDF generation

## Localization

The application interface is in Portuguese (Brazil), while all CV output content is in English to meet US visa application requirements. The bilingual structure includes:

- Portuguese UI labels and instructions
- English CV field values and exports
- Skill catalogs with Portuguese labels and English values

## Usage Workflow

1. Select visa type (H2A or H2B)
2. Fill in personal information and upload photo
3. Add languages with proficiency levels
4. Enter education details
5. Select relevant skills from curated list
6. Write professional profile (with optional AI assistance)
7. Add work experiences with descriptions (with optional AI assistance)
8. Choose template design and accent color
9. Preview final layout
10. Export to PDF

## Browser Requirements

- Modern browser with ES6+ support
- localStorage enabled for state persistence
- File API support for photo uploads
- Clipboard API support for prompt copying (with fallback)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## License

This project is licensed under the MIT License.

Created by Jonatha Teixeira.
