---
id: code-contributions
title: Contribute to Nebari's codebase
description: Guidelines and instruction for contributing to Nebari
---

Thanks for contributing to Nebari's codebase.
If you're new to open source software and looking to start your journey, or a seasoned contributor with an issue in mind, we're glad you're here!

Nebari development happens on GitHub and the codebase is hosted at [nebari-dev/nebari][nebari-repo].

:::note
Nebari's documentation is hosted on a different repository [`nebari-dev/nebari-docs`][nebari-docs-repo].
To contribute to the documentation, read [Contribute to Nebari's documentation](doc-contributions.md).
:::

## Select an issue to work on

<!-- TODO: Add link to "good first issue" labels after the qhub -> Nebari rename -->

New to Nebari?
The issues marked with the [good first issue] label are an excellent place to start.
These bug reports and feature requests have a low entry-barrier, need little historical context, and are self-contained.
Select a "good first issue" that matches your interest and skill set.

If you feel comfortable contributing the fix/feature directly, write a comment on the issue to let the community know that you are working on it.
If you need more context or help with the issue (at any point in your contribution), feel free to ask questions on the same issue.
The project maintainers are always happy to support you!
Keep in mind that many developers and maintainers are volunteers, so be patient while they get back to your questions.
You can drop a reminder after about 4 working days if no one has replied. :)

:::warning
If you know what you want to work on and it involves significant API changes, start by [creating a new issue](issues.md) or commenting on an existing issue related to it.
This allows us to discuss the details and confirm the changes beforehand, and respect the time and energy you spend contributing to Nebari.
:::

## Set up your local Nebari repository

1. Create a personal copy of the [Nebari repository][nebari-repo] by clicking the `fork` button on the top-right corner.

2. Clone the forked project to your local computer:

   ```bash
   git clone https://github.com/<your-username>/nebari.git
   ```

3. Navigate to the project directory:

   ```bash
   cd nebari
   ```

4. Add the upstream repository:

   ```bash
   git remote add upstream https://github.com/nebari-dev/nebari.git
   ```

Now the command `git remote -v` shows two remote repositories:

- `upstream`: which refers to the `nebari` repository on GitHub.
- `origin`: which refers to your personal fork.

## Set up your development environment

### Prerequisites

1. Operating System: Currently, Nebari supports developemnt on **macOS and Linux operating** systems. Windows is NOT supported, however we would welcome contributions that add and improve support for Windows.

2. Python: You need **Python >= 3.7** on your local machine, or in your virtual environment to work on Nebari.

3. Environment managers: You can use tools like [`conda`](https://docs.conda.io/en/latest/), [`pipenv`](https://pipenv.pypa.io/en/latest/), or [`venv`](https://docs.python.org/3/library/venv.html) to create an isolated environment for developing Nebari.

### Create a virtual environment

The requirements for developing Nebari are listed in the `environment-dev.yaml` file in the repository's root directory.
The following steps describe how to create and use a `conda` environment.

1. If you don't have `conda` installed, you can follow the [installation instructions in the conda user guide](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html).

2. Create an new environment using `environment-dev.yaml`:

```bash
conda env create -f environment-dev.yaml
```

You may need to press <kbd>Y</kbd> + <kbd>Enter/Return</kbd> to complete the environment build.

2. Activate the environment with:

```bash
conda activate nebari-dev
```

### Install Nebari in "editable" mode

With an "editable" installation, all the changes you make to the Nebari codebase will be available in your developmnet environment in real-time.

You can do this with:

```bash
python -m pip install -e .[dev]
```

:::note
If you use `zsh`, you may need to escape the square brackets: `\[dev\]`.
:::

### Pre-commit hooks

The `nebari` repository uses [pre-commit hooks](https://pre-commit.com/) to keep the code format consistent across the codebase.
We encourage regular contributors to install the pre-commit hooks to help with development workflows.

1. Before you can run the hooks, you need to install the `pre-commit` package manager:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
   <TabItem value="conda" label="conda">

   ```
   conda install -c conda-forge pre-commit
   ```
  </TabItem>

  <TabItem value="pip" label="pip" default>

   ```bash
   python -m pip install pre-commit
   ```
  </TabItem>
</Tabs>

2. Install the pre-commit hooks:

   ```bash
   pre-commit install
   ```

3. (Optional) Run the hooks against the files in this repository:

   ```bash
   pre-commit run --all-files
   ```

Once installed, the pre-commit hooks will run automatically when you make a commit in version control.

## Develop your contribution

1. Before you start, make sure to pull the latest changes from upstream.

   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a branch for the bug or feature you want to work on. The branch name will appear in the merge message, so use a sensible, self-explanatory name:

   ```bash
   git branch feature/<feature name>
   git switch feature/<feature name>
   # this is an alternative to the git checkout -b feature/<feature name> command
   ```

3. Commit locally as you progress (`git add` and `git commit`), and make sure to use an adequately formatted commit message.

### Testing

Tests are an important part of development.
In your contributions, always include tests that fail before your change and pass afterwards.
Run all the tests locally and make sure that they pass before submitting your contribution.
If you need help with a test case, you can create a draft pull request and message the maintainers for help.

[For tips and best practices, read Test your Nebari contribution ->](nebari-tests)

### Document changes

Prioritize including relevant documentation with your contributions to help your code reviewers, Nebari users, as well as other contributors who may interact with your code.

* Add **comments** to explain intricacies in your code and share "why" it is needed. If you reference a particular GitHub issue or PR, use `gh-xxxx` (where `xxxx` indicated the issue/PR number.)
* If your contribution changes the behaviour of a function, be sure to document it in the **function's docstring**. As a reminder, we follow the [Google Style Guide](https://google.github.io/styleguide/pyguide.html#381-docstrings) for docstrings formatting.
* Update any relevant pages on narrative documentation on `nebari.dev`. Read [Contribute to Nebari's documentation](doc-contributions.md) for more details.
* If your change introduces any user-facing modifications, mention in the release notes.

<!-- TODO: Add link to release notes and guidelines for how to update it. -->

## Submitting your contribution

When you feel comforatble with your contribution, you can open a Pull Request (PR) to submit it for review!

You can also submit partial work to get early feedback on your contribution or discuss some implementation details.
If you do so, add `WIP` (work in progress) in the PR title and mark it as a draft.

1. Push your changes back to your fork on GitHub:

   ```bash
   git push origin feature/<feature name>
   ```

2. Enter your GitHub username and password (repeat contributors or advanced users can remove this step by connecting to GitHub with SSH).

3. Go to the [Nebari repository on GitHub][nebari-repo]. You will see a green **Pull Request** button. Make sure the title and message are clear, concise, and self-explanatory. Complete the checklist and read the notes in the PR template, then click the button to submit it.

:::note
If the PR relates to any issues, you can add the text `xref gh-xxxx` where `xxxx` is the issue number to GitHub comments.
Likewise, if the PR solves an issue, replace the `xref` with `closes`, `fixes` or any other flavours [GitHub accepts](https://help.github.com/en/articles/closing-issues-using-keywords).
GitHub will automatically close the corresponding issue(s) when youy PR gets merged.
:::

## Review process

Reviewers (the other developers and interested community members) will write inline and general comments on your Pull Request (PR) to help you improve its implementation, documentation, and style.
Every developer working on the project has their code reviewed, and we've come to see it as a friendly conversation from which we all learn and the overall code quality benefits.
Therefore, please don't let the review discourage you from contributing: its only aim is to improve the quality of the project, not to criticize (we are, after all, very grateful for the time you're donating!).

To update your PR to incorporate the suggestions, make your changes on your local repository, commit them, run tests, and only if they succeed, push to your fork.
The PR will update automatically as soon as those changes are pushed up (to the same branch as before).

## Continuous Integration

Various continuous integration (CI) pipelines are triggered after each PR update to build artefacts, run unit tests, and check the coding style of your branch.
To avoid overuse of this resource, test your work locally before committing.
We require the CI tests to pass before your PR can be merged.
If CI fails, you can find why by clicking on the "failed" icon (red cross) and inspecting the build and test log.
If you need help to fix the test failures, you may push your changes anyway and ask for help in a PR comment.

<!-- TODO: Add link to our governance docs @trallard -->
We also require a PR to be approved by at least one core team member.
Approval means the core team member has carefully reviewed the changes, and the PR is ready for merging.

## Additional resources

* [GitHub documentation on Contributing to projects](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)

<!-- Links -->

[nebari-repo]: https://github.com/nebari-dev/nebari
[nebari-docs-repo]: https://github.com/nebari-dev/nebari-docs
[nebari-docs]: https://www.nebari.dev/
