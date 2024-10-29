---
id: style-guide
title: Documentation style guide
description: Guidelines for writing consistent technical documentation.
---

As an open source project, we understand the many people with a variety of different backgrounds contribute to Nebari's documentation.
A style guide helps us maintain consistency in the language used and allows us to clearly communicate our accessibility standards.
We want all our users to find the documentation helpful and get the information they need without hurdles.

Nebari's documentation follows the [Google developer documentation style guide](https://developers.google.cn/style).
This style guide is very thorough, and therefore very large.
We have a shorter list of guidelines in the following sections for a quick reference.

These are not rules but rather best practices we have built over time.
Follow your best judgment, and feel free to add to this document following our contribution guidelines!

## Guiding principle :sparkles:

**Stay conversational, and use friendly yet formal language, that readers from all backgrounds can understand.**

## Quick reference

- **Use second person** instead of first person. Address the reader directly with "you" instead of "the user/they". For example, "In this tutorial, you learn how to use Dask from within Nebari".
- If *absolutely necessary* - use first-person plural like "we recommend."
- Prefer **present tense**. For example: "nebari-config.yaml is created." instead of "nebari-config.yaml will be created".
- Use **active voice** throughout the documentation. For example: "Save the file" instead of "The file is saved".
- If necessary, always **use gender-neutral pronouns**.
- **Avoid unnecessary jargon, memes, jokes** or any other type of content that will not be widely applicable for a global audience.
- **Avoid abbreviations** like "e.g.", "i.e.", and "etc.". Use full words like "for example", "that is", and "and so on" respectively.
- Use **serial commas**, also known as Oxford comma. For example: "Nebari brand uses purple, yellow, and green."
- Leave **only one blank space between sentences**.
- **Break up long lines in code snippets** with "`\`" for better readability. For example, see the code block in [Automatic DNS provision][automatic-dns-provision].
- Try and **use [semantic line breaks](https://sembr.org/)** to help with documentation and contribution reviews.
- **Prefer American English** over British or other English variant to keep spelling consistency.

### Date and time

Use unambiguous and explicit styles:

- Time: **12-hour** clock with AM/PM capitalized. Include a timezone (preferably in UTC or GMT) when relevant. For example, "2 PM UTC".
- Date: Write **full dates** and spell out the months, for example: "July 8, 2022".

### Accessibility

- Write in **"plain English" for users of all levels and backgrounds**. Never assume your readers' technical or English level. Learn more: [Microsoft's guidelines on writing for all abilities](https://docs.microsoft.com/en-gb/style-guide/accessibility/writing-all-abilities).
- Make sure your documentation page has **appropriate headings and a consistent hierarchy of header tags** (`<h1>` or `#`, followed by `<h2>` or `##`, and so on). People who use screen readers rely on headings to navigate the page.
- Always use **text to describe where links go**. For example, instead of "read more", write "read more about accessible writing in the style guide".
- Take the time to **write good alt-text** for images, diagrams, and graphics. The alt text should describe the setting (for example, "A JupyterLab window showing ...") as well as the overarching message that the graphic conveys (for example, "... denotes consistency across the Dask dashboard plots"). Read the [Text associated with images section of the Google Developer Style Guide](https://developers.google.com/style/images#text-associated-with-images) for more details.
- Practice **inclusive and bias-free communication**. Learn more in:
  - [Write inclusive documentation, Google developer documentation style guide](https://developers.google.com/style/inclusive-documentation)
  - [Bias-free communication, Microsoft writing style guide](https://learn.microsoft.com/en-gb/style-guide/bias-free-communication)
  - [Gender identity, Apple style guide](https://support.apple.com/en-gb/guide/applestyleguide/apd2a7af8d36/web)
- When using acronyms, always **introduce the full term on first use**. For example, "The Domain Name System (DNS)..."
- **Avoid using alienating terms** like "simply", "just", "trivial", "merely", "naturally", or "obviously" (this goes hand in hand with not assuming your reader's technical level).

Go through the [Write accessible documentation section of the Google developer documentation style guide](https://developers.google.com/style/accessibility) for a more detailed set of accessibility guidelines.

### Capitalization

**Use sentence case** for page and section titles - only the first letter of the first word is capitalized.

Some terms and libraries have specific capitalization preferences:

| TERM             | CAPITALIZATION                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Nebari           | First letter always capitalized                                                          |
| Dask             | First letter always capitalized                                                          |
| DataFrame        | 'D' and 'F' always capitalized                                                           |
| pandas           | Never capitalized                                                                        |
| NumPy            | 'N' and 'P' always capitalized                                                           |
| conda            | First letter capitalized only at the beginning of sentences                              |
| pip              | Never capitalized                                                                        |
| Panel            | First letter always capitalized                                                          |
| VS Code          | 'V', 'S', and 'C' always capitalized; always use one blank space between 'VS' and 'Code' |
| Jupyter          | First letter always capitalized                                                          |
| Jupyter Notebook | 'J' and 'N' always capitalized                                                           |
| JupyterLab       | 'J' and 'L' always capitalized                                                           |
| Kubernetes       | First letter always capitalized                                                          |
| Docker           | First letter always capitalized                                                          |
| Terraform        | First letter always capitalized                                                          |
| Ansible          | First letter always capitalized                                                          |
| YAML             | Always capitalized                                                                       |
| conda-store      | Never capitalized                                                                        |
| CPU              | Always capitalized                                                                       |
| RAM              | Always capitalized                                                                       |
| GB               | Always capitalized                                                                       |
| open source      | First letter capitalized only at the beginning of sentences; Never hyphenated            |
| data science     | First letter capitalized only at the beginning of sentences; Never hyphenated            |

:::note
The capitalization guidelines only apply to narrative documentation. When referring to the API, use the appropriate module names, which are all lowercase alphabets most of the time.

For example: "To start JupyterLab, you run `jupyter lab`."
:::

## Additional resources

- The [Microsoft Writing Style Guide](https://learn.microsoft.com/en-gb/style-guide/welcome/) is also a very thorough style guide. The included A-Z word list is a handy reference if you're unsure about a specific term.
- [Digital Ocean's tutorial style guide](https://www.digitalocean.com/community/tutorials/digitalocean-s-technical-writing-guidelines).
- [Write the Docs collection of resources for accessible writing](https://www.writethedocs.org/guide/writing/accessibility/).

<!-- Internal links -->

[automatic-dns-provision]: /docs/how-tos/domain-registry#automatic-dns-provision
