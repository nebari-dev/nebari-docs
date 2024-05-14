---
id: configure-gitops
title: Setup Nebari GitOps
description: Setting up IaC via GitHub Actions or GitLab CI
---

# Setup Nebari gitops

## What is GitOps / Infrastructure as Code (IaC)?

GitOps also known as Infrastructure as Code(Iac) is the practice of using git for
managing the state of your infrastructure. This allows for easy
auditing and discovering the current state of your system.

## Setting up IaC on Github-Actions

Configuring Neabri to render the appropriate workflows for
github-actions can be configured via the following settings in your
`nebari-config.yaml`.

```yaml
ci_cd:
  type: github-actions
  branch: main
  commit_render: true
```

It is possible for your deployment that you will need to run arbitrary
steps before and after the deployment. These are exposed via the
`before_script` and `after_script` keys.

```yaml
ci_cd:
  before_script:
    - name: Before Script
      run: |
        echo "Hello World"
    - uses: actions/setup-node@v3
      with:
        node-version: '14'
  after_script:
    - name: After Script
      run: |
        echo "Bye World"
```

## Setting up Iac on Gitlab CI

Configuring Neabri to render the appropriate workflows for
github-ci can be configured via the following settings in your
`nebari-config.yaml`.

```yaml
ci_cd:
  type: gitlab-ci
  branch: main
  commit_render: true
```

It is possible for your deployment that you will need to run arbitrary
commands before and after the deployment. These are exposed via the
`before_script` and `after_script` keys.

```yaml
ci_cd:
  before_script:
    - 'echo "Hello World"'
    - 'echo "Another command"'
  after_script:
    - 'echo "Bye World"'
```




