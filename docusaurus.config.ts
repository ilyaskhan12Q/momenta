import {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Momenta Engineering Specs',
  tagline: 'Your feelings, on a page. Single Source of Truth & Architecture Guide.',
  favicon: 'img/favicon.ico',

  url: 'https://momenta-org.github.io',
  baseUrl: '/',

  organizationName: 'momenta-org',
  projectName: 'momenta-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at root URL
          editUrl: 'https://github.com/momenta-org/momenta-docs/tree/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/momenta-og-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Momenta Docs',
      logo: {
        alt: 'Momenta Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Engineering Manual',
        },
        {
          to: '/',
          label: 'Product',
          position: 'left',
        },
        {
          to: '/ARCHITECTURE/SystemArchitecture',
          label: 'Architecture',
          position: 'left',
        },
        {
          to: '/BACKEND/API',
          label: 'API & Backend',
          position: 'left',
        },
        {
          to: '/DESIGN/EmotionEngine',
          label: 'Design & Emotion Engine',
          position: 'left',
        },
        {
          href: 'https://github.com/momenta-org/momenta',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Vision & PRD',
              to: '/',
            },
            {
              label: 'System Architecture',
              to: '/ARCHITECTURE/SystemArchitecture',
            },
            {
              label: 'API Reference',
              to: '/BACKEND/API',
            },
          ],
        },
        {
          title: 'Eng Core',
          items: [
            {
              label: 'Emotion Engine Specification',
              to: '/DESIGN/EmotionEngine',
            },
            {
              label: 'Story Engine Specification',
              to: '/DESIGN/StoryEngine',
            },
            {
              label: 'Database & Schema',
              to: '/BACKEND/Database',
            },
          ],
        },
        {
          title: 'DevOps & Quality',
          items: [
            {
              label: 'CI/CD & Deployment',
              to: '/DEVOPS/Deployment',
            },
            {
              label: 'Testing Strategy',
              to: '/TESTING/Unit',
            },
            {
              label: 'Roadmap & MVP',
              to: '/ROADMAP/MVP',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Momenta Technologies Inc. Built with Docusaurus for Stripe-grade engineering clarity.`,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript', 'sql', 'docker', 'mermaid'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
