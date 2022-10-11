---
id: code-contributions
title: Contribute to Nebari's codebase
description: Guidelines and instruction for contributing to Nebari
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Thanks for contributing to Nebari's codebase. If you're new to open source software and looking to start your journey or a seasoned contributor with an issue in mind, we're glad you're here!

Nebari development happens on GitHub, at [nebari-dev/nebari][nebari-repo].

## Select an issue to work on

New to Nebari? The issues marked with the [type: good first issue][https://github.com/nebari-dev/nebari/labels/type%3A%20good%20first%20issue] label are an excellent place to start. These bugs reports and feature requests have a low entry-barrier, need little historical context, and are self-contained. Select a "good first issue" that matches your interest and skill set.

If you feel comfortable contributing the fix/feature directly, write a comment to let the community know that you are working on it. If you need more context or help with the issue (at any point in your contribution), feel free to ask questions on the same issue. The project maintainers are always happy to support you! Keep in mind that many developers and maintainers are volunteers, so be patient while they get back to your questions. You can drop a reminder after about 4 working days if no one has replied. :)

## Set up your local Nebari repository

1. Go to the [Nebari repository][nebari-repo] and click the `fork` button on the top-right corner to create your own copy of the project.

2. Clone the forked project to your local computer:

   ```bash
   git clone https://github.com/your-username/nebari.git
   ```

3. Change into the directory:

   ```bash
   cd nebari
   ```

4. Add the upstream repository:

   ```bash
   git remote add upstream https://github.com/nebari-dev/nebari.git
   ```

Now using the command `git remote -v` will show two remote repositories:

- `upstream`: which refers to the `nebari` repository on Github.
- `origin`: which refers to your personal fork.

## Set up your development environment

1. You can use `conda` to create an isolated environment to work on Nebari. The `environment-dev.yaml` file in the root directory lists the required dependencies.

```bash
conda env create -f environment-dev.yaml
```

You may need to press "Y" + "Enter"/"Return" to complete the environment build.

2. Activate the environment with:

```bash
conda activate nebari-dev
```

### Pre-commit hooks

The `nebari` repository uses [pre-commit hooks](https://pre-commit.com/) to lint and format your code before each commit. We encourage regular contributors to install the hooks.

1. Before you can run the hooks, you need to install the pre-commit package manager:

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

2. Create a branch for the bug or feature you want to work on. Since the branch name will appear in the merge message, use a sensible, self-explanatory name:

   ```bash
   git branch feature/<feature name>
   git switch feature/<feature name>
   # this is an alternative to the git checkout -b feature/<feature name> command
   ```

3. Commit locally as you progress (`git add` and `git commit`). Use an adequately formatted commit message, write tests that fail before your change and pass afterwards, run all the tests locally. Be sure to document any changed behaviour in docstrings.

## Submitting your contribution

1. Push your changes back to your fork on GitHub:

   ```bash
   git push origin feature/<feature name>
   ```

2. Enter your GitHub username and password (repeat contributors or advanced users can remove this step by connecting to GitHub with SSH).

3. Go to GitHub. The new branch will show a green **Pull Request** button. Make sure the title and message are clear, concise, and self-explanatory. Complete the checklist and read the notes in the PR template, then click the button to submit it.

<!-- TODO: Update the following warning -->

:::warning
If your commit introduces a new feature or changes functionality, first create an open Pull Request with `WIP` (work in progress) in the
title and marked as draft, explaining what you want to do. That way we can discuss it to be sure it makes sense for nebari. Or start by creating an issue and indicate that you would be interested in solving the problem yourself. This is generally not necessary for bug fixes, and documentation updates. However, if you do not get any reaction, feel free to ask for a review.
:::

## Review process

Reviewers (the other developers and interested community members) will write inline and general comments on your Pull Request (PR) to help you improve its implementation,
documentation and style. Every developer working on the project has their code reviewed, and we've come to see it as a friendly conversation from which we all learn and the overall
code quality benefits. Therefore, please don't let the review discourage you from contributing: its only aim is to improve the quality of the project, not to criticize (we are,
after all, very grateful for the time you're donating!).

To update your PR to incorporate the suggestions, make your changes on your local repository, commit them, run tests, and only if they succeed, push to your fork. The PR will update automatically as soon as those
changes are pushed up (to the same branch as before). If you have no idea how to fix the test failures, you may push your changes anyway and ask for help in a PR comment.

## CI

Various continuous integration (CI) pipelines are triggered after each PR update to build artefacts, run unit tests, and check the coding style of your branch. The CI tests must
pass before your PR can be merged. If CI fails, you can find why by clicking on the "failed" icon (red cross) and inspecting the build and test log. To avoid overuse and waste of
this resource, test your work locally before committing.

Before merging, a PR must be approved by at least one core team member. Approval means the core team member has carefully reviewed the changes, and the PR is ready for merging.

## Document changes

Beyond changes to a function's docstring and possible description in the general documentation, if your change introduces any user-facing modifications, they may need to be mentioned in the release notes.

<!-- TODO: Add link to release notes -->

TODO: Since we have a separate documentation repo, link to docs guidelines.

## Cross referencing issues

If the PR relates to any issues, you can add the text `xref gh-xxxx` where `xxxx` is the issue number to GitHub comments. Likewise, if the PR solves an issue, replace the `xref`
with `closes`, `fixes` or any other flavours [github accepts](https://help.github.com/en/articles/closing-issues-using-keywords).

In the source code, be sure to preface any issue or PR reference with gh-xxxx.

## Additional resources

- [GitHub documentation on Contributing to projects](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)

<!-- Links -->

[nebari-repo]: https://github.com/nebari-dev/nebari
