import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '01. Product Specification',
      collapsible: false,
      items: [
        'PRODUCT/Vision',
        'PRODUCT/PRD',
        'PRODUCT/Personas',
        'PRODUCT/UserJourneys',
      ],
    },
    {
      type: 'category',
      label: '02. Architecture & Design',
      collapsible: false,
      items: [
        'ARCHITECTURE/EngineeringPrinciples',
        'ARCHITECTURE/SystemArchitecture',
        'ARCHITECTURE/BackendArchitecture',
        'ARCHITECTURE/FrontendArchitecture',
        'ARCHITECTURE/DomainModel',
      ],
    },
    {
      type: 'category',
      label: '03. Backend & Core APIs',
      collapsible: false,
      items: [
        {
          type: 'category',
          label: 'Features',
          items: [
            'BACKEND/Features/MessageCreation',
            'BACKEND/Features/StoryGeneration',
            'BACKEND/Features/RecipientExperience',
            'BACKEND/Features/MediaProcessing',
            'BACKEND/Features/AnalyticsAndAudit',
          ],
        },
        'BACKEND/Database',
        'BACKEND/Storage',
        'BACKEND/API',
        'BACKEND/Security',
        'BACKEND/BusinessRules',
      ],
    },
    {
      type: 'category',
      label: '04. Emotion & Story Engines',
      collapsible: false,
      items: [
        'DESIGN/EmotionEngine',
        'DESIGN/StoryEngine',
        'DESIGN/DesignSystem',
        'DESIGN/AnimationBible',
      ],
    },
    {
      type: 'category',
      label: '05. DevOps & Infrastructure',
      collapsible: false,
      items: [
        'DEVOPS/Docker',
        'DEVOPS/GitHubActions',
        'DEVOPS/Deployment',
        'DEVOPS/Monitoring',
      ],
    },
    {
      type: 'category',
      label: '06. Quality & Testing',
      collapsible: false,
      items: [
        'TESTING/Unit',
        'TESTING/Integration',
        'TESTING/E2E',
        'TESTING/Security',
      ],
    },
    {
      type: 'category',
      label: '07. Product Roadmap',
      collapsible: false,
      items: [
        'ROADMAP/MVP',
        'ROADMAP/V2',
        'ROADMAP/FutureIdeas',
      ],
    },
    {
      type: 'category',
      label: '08. Reference & Appendices',
      collapsible: false,
      items: [
        'APPENDIX/ADRs',
        'APPENDIX/Glossary',
        'APPENDIX/FAQ',
      ],
    },
  ],
};

export default sidebars;
