import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/Home',
    component: ComponentCreator('/Home', '38e'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e70'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'f92'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '86e'),
            routes: [
              {
                path: '/APPENDIX/ADRs',
                component: ComponentCreator('/APPENDIX/ADRs', '526'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/APPENDIX/FAQ',
                component: ComponentCreator('/APPENDIX/FAQ', '3c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/APPENDIX/Glossary',
                component: ComponentCreator('/APPENDIX/Glossary', 'e48'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ARCHITECTURE/BackendArchitecture',
                component: ComponentCreator('/ARCHITECTURE/BackendArchitecture', '687'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ARCHITECTURE/DomainModel',
                component: ComponentCreator('/ARCHITECTURE/DomainModel', '3cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ARCHITECTURE/EngineeringPrinciples',
                component: ComponentCreator('/ARCHITECTURE/EngineeringPrinciples', '8ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ARCHITECTURE/FrontendArchitecture',
                component: ComponentCreator('/ARCHITECTURE/FrontendArchitecture', 'df9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ARCHITECTURE/SystemArchitecture',
                component: ComponentCreator('/ARCHITECTURE/SystemArchitecture', '1dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/API',
                component: ComponentCreator('/BACKEND/API', 'dad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/BusinessRules',
                component: ComponentCreator('/BACKEND/BusinessRules', '4d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Database',
                component: ComponentCreator('/BACKEND/Database', '468'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Features/AnalyticsAndAudit',
                component: ComponentCreator('/BACKEND/Features/AnalyticsAndAudit', '466'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Features/MediaProcessing',
                component: ComponentCreator('/BACKEND/Features/MediaProcessing', '62c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Features/MessageCreation',
                component: ComponentCreator('/BACKEND/Features/MessageCreation', '3d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Features/RecipientExperience',
                component: ComponentCreator('/BACKEND/Features/RecipientExperience', '15c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Features/StoryGeneration',
                component: ComponentCreator('/BACKEND/Features/StoryGeneration', 'f71'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Security',
                component: ComponentCreator('/BACKEND/Security', 'c1c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/BACKEND/Storage',
                component: ComponentCreator('/BACKEND/Storage', '03e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DESIGN/AnimationBible',
                component: ComponentCreator('/DESIGN/AnimationBible', '612'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DESIGN/DesignSystem',
                component: ComponentCreator('/DESIGN/DesignSystem', '1ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DESIGN/EmotionEngine',
                component: ComponentCreator('/DESIGN/EmotionEngine', 'f62'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DESIGN/StoryEngine',
                component: ComponentCreator('/DESIGN/StoryEngine', 'ee9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DEVOPS/Deployment',
                component: ComponentCreator('/DEVOPS/Deployment', '8e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DEVOPS/Docker',
                component: ComponentCreator('/DEVOPS/Docker', '252'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DEVOPS/GitHubActions',
                component: ComponentCreator('/DEVOPS/GitHubActions', '696'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/DEVOPS/Monitoring',
                component: ComponentCreator('/DEVOPS/Monitoring', '2d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PRODUCT/Personas',
                component: ComponentCreator('/PRODUCT/Personas', '9cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PRODUCT/PRD',
                component: ComponentCreator('/PRODUCT/PRD', 'bf7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PRODUCT/UserJourneys',
                component: ComponentCreator('/PRODUCT/UserJourneys', '799'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ROADMAP/FutureIdeas',
                component: ComponentCreator('/ROADMAP/FutureIdeas', '15b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ROADMAP/MVP',
                component: ComponentCreator('/ROADMAP/MVP', '6bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/ROADMAP/V2',
                component: ComponentCreator('/ROADMAP/V2', '3a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/TESTING/E2E',
                component: ComponentCreator('/TESTING/E2E', '129'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/TESTING/Integration',
                component: ComponentCreator('/TESTING/Integration', '910'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/TESTING/Security',
                component: ComponentCreator('/TESTING/Security', '578'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/TESTING/Unit',
                component: ComponentCreator('/TESTING/Unit', '6b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'f68'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
