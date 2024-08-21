---
id: plugins
title: Plugins (Extensions)
description: List of Nebari plugins
---

Nebari plugins (sometimes referred to as extensions) allow developers to add new features relatively easily without the need to modify the core Nebari code base. At the moment, there are two types of plugins `stages` and `subcommands`. Stage plugins allow users to deploy new features alongside the existing the Nebari features whereas subcommand plugins allow users to extend or modify the existing Nebari CLI.

You can learn to use and create Nebari extensions in the [extension mechanism documentation](/docs/how-tos/nebari-extension-system).

## Verified community extensions

The following community-developed extensions are recognized and verified by the Nebari development team.

- The **[ML Flow extension for AWS](https://github.com/MetroStar/nebari-mlflow-aws)** is designed to integrate [MLFlow](https://mlflow.org/) into Nebari deployments utilizing AWS (Amazon Web Services) as the provider. It provides a robust, collaborative environment for AI/ML professionals to manage experiments, track metrics, and deploy models.
- The **[Label Studio](https://github.com/MetroStar/nebari-label-studio)** integrates [Label Studio](https://labelstud.io/) into the Nebari platform, allowing seamless labeling functionality within Nebari. Utilizing Python, Terraform, Kubernetes, and Helm charts, the plugin provides a configurable deployment and authentication through Keycloak.
- The **[Self Registration](https://github.com/nebari-dev/nebari-self-registration)** extension allows potential new users of a Nebari deployment to self-register through a coupon code. A new self-registration page is generated on the Nebari server where users can input their information and a coupon code. Once the form is validated, the new user will be auto-generated on the Nebari deployment. It can also be configured to give new users a set expiration date.
