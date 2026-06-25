# Personas

Nebari Kubernetes Platform (NKP) is designed around three primary roles. Understanding these roles clarifies who is responsible for each layer of the platform and what each group needs from the documentation.

---

## Platform admin

**Who they are:** Infrastructure engineers, DevOps practitioners, or IT administrators responsible for standing up and maintaining the platform. They are comfortable with Kubernetes, cloud providers, and infrastructure-as-code tooling such as OpenTofu or Terraform. They may work within a central platform team or provide services to multiple internal teams.

**What they do:**

- Provision clusters across cloud providers (AWS, GCP, Azure, Hetzner) or on-premises using the `nic` CLI
- Manage the foundational services bundled with every deployment: identity (Keycloak), API gateway (Envoy), observability, and GitOps (ArgoCD)
- Install, update, and remove software packs to extend the platform's capabilities
- Control user access, quotas, and security policies
- Monitor cluster health, costs, and resource utilization

**What they need from the docs:** Step-by-step deployment guides, configuration reference for the `nic` CLI and its YAML schema, upgrade and migration procedures, troubleshooting guides for infrastructure-level issues, and clear explanations of how packs integrate with the foundational services.

---

## Pack developer

**Who they are:** Software engineers or platform specialists who build and publish reusable capabilities for the platform. They understand Kubernetes custom resources, Helm charts, and how the Nebari Operator works. They may be internal to an organization building proprietary tooling, or open-source contributors publishing packs for the broader community.

**What they do:**

- Author `NebariApp` custom resources that define a software pack's components, dependencies, and configuration
- Package tools (notebook environments, model serving, experiment tracking, dashboards) so they integrate automatically with SSO, TLS, routing, and telemetry
- Test packs against different cluster configurations and platform versions
- Publish packs to a registry for platform admins to discover and install

**What they need from the docs:** The `NebariApp` CRD specification, the operator's reconciliation model, integration contracts for SSO and routing, pack authoring guides, and versioning and publishing conventions.

---

## End user

**Who they are:** Data scientists, ML engineers, researchers, and analysts who use the tools and environments the platform provides. They are proficient in Python or R and work daily with Jupyter notebooks, ML frameworks, and data pipelines. They are generally not responsible for infrastructure and expect the platform to simply work.

**What they do:**

- Log in through the platform landing page and launch notebook environments or other deployed tools
- Run experiments, train models, and analyze data using pre-configured environments
- Collaborate with colleagues by sharing notebooks, dashboards, and results
- Scale computation to cluster resources without managing infrastructure themselves

**What they need from the docs:** Getting-started guides for their specific tools (JupyterHub, VS Code, Argo Workflows, etc.), how to request access or additional resources, and troubleshooting guides for common environment issues.
