/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = {
  sidebar: [
    {
      label: "Introduction",
      type: "doc",
      id: "introduction",
    },
    {
      type: "category",
      label: "Get started",
      link: { type: "doc", id: "get-started/index" },
      items: [
        // Add get started docs here
      ],
    },
    {
      type: "category",
      label: "Explanations",
      link: { type: "doc", id: "explanations/index" },
      items: [
        // Add explanation docs here
      ],
    },
        {
      type: "category",
      label: "How-to guides",
      link: { type: "doc", id: "how-tos/index" },
      items: [
        // Add how-to guides here
      ],
    },
    {
      type: "category",
      label: "References",
      link: { type: "doc", id: "references/index" },
      items: [
        // Add reference docs here
      ],
    },
    {
      type: "category",
      label: "Software packs",
      link: { type: "doc", id: "software-packs/index" },
      items: [
        // Add software pack docs here
      ],
    },
  ]
}
