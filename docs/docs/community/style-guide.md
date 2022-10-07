---
id: style-guide
title: Documentation style guide
description: Guidelines for writing consistent technical documentation.
---

As an open source project, we understand the many people with a variety of different backgrounds contribute to Nebari's documentation. A style guide helps us maintain consistency in the language used and allows us to clearly communicate our accessibility standards. We want all our users to find the documentation helpful and get the information they need without hurdles.

Nebari's documentation follows the [Google developer documentation style guide](https://developers.google.cn/style). This style guide is very thorough, and therefore very large. We have a shorter list of guidelines in the following sections for a quick reference.

## Guiding principle :sparkles:

**Stay conversational, and use friendly yet formal language, that readers from all backgrounds can understand.**

## Quick reference

- **Use second person** instead of first person. Address the reader directly with "you" instead of "the user/they". For example, "In this tutorial, you learn how to use Dask from within Nebari".
- If *absolutely necessary* - use first person plural like "we recommend."
- Prefer **present tense**. For example: "nebari-config.yaml is created." instead of "nebari-config.yaml will be created".
- Use **active voice** throughout the documentation. For example: "" instead of "."
- If necessary, always capitalized \*_use gender-neutral pronouns_.
- **Avoid unnecessary jargon, memes, jokes** or any other type of content that will not be widely applicable for a global audience.
- **Avoid abbreviations** like "e.g.", "i.e.", and "etc.". Use full words like "for example", "that is", and "and so on" respectively.
- Use **serial commas**, also known as Oxford comma. For example: "Nebari brand uses purple, yellow, and green."
- Leave **only one black space between sentences**.

### Date and time

Use unambiguous and explicit styles:

- Time: **12 hour** clock with AM/PM capitalized. Include a timezone (preferably in UTC or GMT) when relevant. For example, "2 PM UTC".
- Date: Write **full dates** and spell out the months, for example: "July 8, 2022".

### Accessibility

- Use "plain english" to write for users of all levels and background. Never assume your reader’s technical or English level. See [MSFT guidelines on writing for all abilities](https://docs.microsoft.com/en-gb/style-guide/accessibility/writing-all-abilities).
- Practice [inclusive](https://developers.google.com/style/inclusive-documentation) and [bias-free](https://learn.microsoft.com/en-gb/style-guide/bias-free-communication) communication.
- Take the time to [write good alt-text](https://developers.google.com/style/images#text-associated-with-images) for images, diagrams, and graphics. The alt text should describe the setting (for example, "A JupyterLab window showing ...") as well as the overarching message that the graphic conveys (for example, "... denotes consistency across the Dask dashboard plots".)

### Captalization

- **Use sentence case** for page and section titles - only the first letter of the first word is capitalized.
- Some terms and libraries have special capitalization preferences:

| TERM             | CAPITALIZATION                                                    |
| ---------------- | ----------------------------------------------------------------- |
| Nebari           | First letter always capitalized, unless referring to CLI commands |
| Dask             | First letter always capitalized, unless referring to CLI commands |
| DataFrame        | 'D' and 'F' always capitalized                                    |
| pandas           | never capitalized                                                 |
| Conda            | First letter capitalized only at the beginning of sentences       |
| Panel            | TBD                                                               |
| VS Code          | TBD                                                               |
| Jupyter          | First letter always capitalized, unless referring to CLI commands |
| Jupyter Notebook | TBD                                                               |
| JupyterLab       | 'J' and 'L' always capitalized, unless referring to CLI commands  |
| Kubernetes       | TBD                                                               |
| Docker           | TBD                                                               |
| Terraform        | TBD                                                               |

## Additional resources

- The [Microsoft Writing Style Guide](https://learn.microsoft.com/en-gb/style-guide/welcome/) is also a very thorough style guide. The A-Z word list is a handy reference if you're unsur about a specific term.
- [Write the Docs collection of accessibility resources](https://www.writethedocs.org/guide/writing/accessibility/).
- [Digital Ocean tutorail style guide](https://www.digitalocean.com/community/tutorials/digitalocean-s-technical-writing-guidelines)
- Google technical guide - [accessibility considerations](https://developers.google.com/style/accessibility)
- Apple guidelines [on inclusive gender identity](https://help.apple.com/applestyleguide/#/apd2a7af8d36)
