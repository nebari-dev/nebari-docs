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
            label: "Overview",
            type: "doc",
            id: "overview",
        },
        {
            label: "Installation",
            type: "doc",
            id: "installation",
        },
        {
            label: "Configuration",
            type: "doc",
            id: "configuration",
        },
        {
            label: "Benchmark",
            type: "doc",
            id: "benchmark"
        },
        {
            label: "Slurm",
            type: "doc",
            id: "slurm"
        },
        {
            label: "Development",
            type: "doc",
            id: "development"
        },
        {
            label: "Comparison with Nebari",
            type: "doc",
            id: "comparison"
        },
        {
            label: "FAQ",
            type: "doc",
            id: "faq"
        },
    ],
}
