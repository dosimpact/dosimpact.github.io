// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

function gtagSafeFallbackPlugin() {
  return {
    name: "gtag-safe-fallback-plugin",
    getClientModules() {
      return [require.resolve("./src/client-modules/gtagSafe.js")];
    },
  };
}

function mermaidCytoscapeCompatPlugin() {
  return {
    name: "mermaid-cytoscape-compat-plugin",
    configureWebpack() {
      return {
        resolve: {
          alias: {
            // Mermaid 9's mindmap bundle imports a Cytoscape UMD subpath that
            // newer Cytoscape package exports do not expose to ESM resolution.
            "cytoscape/dist/cytoscape.umd.js": require.resolve(
              "cytoscape/dist/cytoscape.cjs.js",
            ),
          },
        },
      };
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "DoDo(도도)의 개발 블로그",
  tagline: "Drink Coffee, Make Code",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://dosimpact.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "dosimpact", // Usually your GitHub org/user name.
  projectName: "dosimpact.github.io", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-WKPFKPLJJC",
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
      }),
    ],
  ],
  plugins: [gtagSafeFallbackPlugin, mermaidCytoscapeCompatPlugin],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      metadata: [
        {
          name: "keywords",
          content:
            "frontend, 취업가이드, 개발자 취업, 포트폴리오, 코테 공부, 개발자 현실, 프론트 개발자",
        },
        {
          name: "google-site-verification",
          content: "Ov_hk6LqaaE5KiwXnqF2gTKwPxBE3qG5Zr3o5UWZXc8",
        },
        {
          name: "google-adsense-account",
          content: "ca-pub-7124760459431977",
        },
      ],
      navbar: {
        title: "DoDo",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "frontEnd",
            position: "left",
            label: "👒Front End",
          },
          {
            type: "docSidebar",
            sidebarId: "backEnd",
            position: "left",
            label: "🛰️Backend End",
          },
          {
            type: "docSidebar",
            sidebarId: "devOps",
            position: "left",
            label: "🚧DevOps",
          },
          {
            type: "docSidebar",
            sidebarId: "dataAnalytics",
            position: "left",
            label: "💎DA",
          },
          {
            type: "docSidebar",
            sidebarId: "hardSkill",
            position: "left",
            label: "💻Hard Skill",
          },
          {
            type: "docSidebar",
            sidebarId: "softSkill",
            position: "left",
            label: "🔅Soft Skill",
          },
          {
            href: "https://github.com/dosimpact",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with themeConfig`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "ME6STB8MA7",
        // Public API key: it is safe to commit it
        apiKey: "f22d766a491d0522be28b77a4836eef7",
        indexName: "dosimpactio",
        // Optional: see doc section below
        // contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: "/docs/", // or as RegExp: /\/docs\//
        //   to: "/",
        // },
        // Optional: Algolia search parameters
        // searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: "search",
        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        // insights: false,
      },
    }),
};

module.exports = config;
