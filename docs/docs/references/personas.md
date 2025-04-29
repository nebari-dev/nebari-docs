---
# Display h2 to h3 headings
toc_min_heading_level: 2
toc_max_heading_level: 3
---

# Personas

A variety of people interact with Nebari deployments. The personas below represent the core user groups we support, guiding platform development and UX improvements.

## 👩‍💻 Data Scientist (End User)

### 🤔 Who They Are

* Researchers / analysts / data scientists working with datasets and models.  
* Found in research labs, academia, startups or enterprise teams.  
* Use tools like Jupyter Notebooks, Python/R libraries and ML frameworks (TensorFlow, PyTorch, Scikit-learn).  
* Often collaborate with teammates, share notebooks, or publish results.  
* Focused on analysis and experimentation , not infrastructure.

### 🔁 Key Workflows

* Explore and analyze data using notebooks.  
* Share notebooks / results / dashboards with teammates.  
* Use cloud resources when local compute isn’t enough.

### 🤕 Pain Points

* Struggle to set up the right environment (package conflicts, inconsistent installs).  
* Installing libraries on institutional machines is often restricted.   
* Hit compute/memory limits on local or free-tier systems.  
* Collaboration is difficult. Version control and sharing notebooks is not seamless.  
* Difficult to reproduce results across machines/environments.  
* Limited tools for debugging crashes, package errors or environment issues.  
    
Aside from internal discussions, these pain points are derived from the following sources:  
* [Deploying JupyterHub at your institution \- discuss \- Jupyter Community Forum](https://discourse.jupyter.org/t/deploying-jupyterhub-at-your-institution/723)   
* [What's Wrong with Computational Notebooks? Pain Points, Needs, and Design Opportunities](https://austinhenley.com/pubs/Chattopadhyay2020CHI_NotebookPainpoints.pdf)   
* [Old tools, new tricks: Improving the computational notebook experience for data scientists \- Microsoft Research](https://www.microsoft.com/en-us/research/blog/old-tools-new-tricks-improving-the-computational-notebook-experience-for-data-scientists/) 

### 📋 What They Need

* On-demand, easy access to scalable compute (larger instances, GPUs).  
* Simplified, stable environment management.  
* Easy ways to share notebooks and collaborate with others.  
* Built-in version tracking for notebooks, code and experiments.  
* Tools to make work reproducible \- track data, code, environments versions and settings.  
* Clear error logs and troubleshooting help when things break.

## 🛡️ Platform Manager (Admin)

### 🤔 Who They Are

* Admins or IT managers responsible for user access and governance.  
* Found in enterprise teams or research institutions.  
* Use admin tools to manage users, monitor usage or enforce policies.  
* May not have deep technical knowledge.  
* Focused on keeping the platform running smoothly and securely for End Users.

### 🔁 Key Workflows

* Onboard new users, manage roles and permissions.  
* Monitor system usage, resource consumption and user activity.  
* Enforce data access, security and compliance policies.  
* Manage costs and track resource use.

### 🤕 Pain Points

* Managing users manually.  
* Integrating existing identity auth systems (OAuth, SSO etc.).  
* Limited visibility into platform usage or resource consumptions.  
* Hard to track and manage cloud costs across users/projects.  
* Lack of tools to enforce quotas or shut down idle resources.  
* Managing permissions for sensitive data is complex.

### 📋 What They Need

* Easy integration with existing identity providers.  
* User-friendly dashboard for managing users, roles and permissions.  
* Clear insights into usage \- who is using what, how much and when.  
* Tools for cost tracking, setting limits and alerts.  
* Ability to enforce quotas and shut down idle resources.  
* Tools for managing shared environments and secure data access.

## 🛠️ DevOps / SysAdmin

### 🤔 Who They Are

* Engineers responsible for deploying and maintaining the platform’s infrastructure.  
* Work with Kubernetes, Terraform, cloud services and CI/CD tools.  
* May be part of a central IT/infra team or external maintainers.  
* Focused on reliability, scaling, security and maintenance.

### 🔁 Key Workflows

* Deploy and configure the platform.  
* Set up authentication, storage and compute resources.  
* Manage upgrades, scaling, backups and system monitoring.  
* Troubleshoot issues with platform stability or user environments.  
* Implement security policies and ensure compliance.

### 🤕 Pain Points

* Deployment is complex \- there are many moving parts and a steep learning curve.  
* Updates can break things, need testing and staging.  
* Diverse user needs lead to environment sprawl and maintenance headaches.  
* Integrating with enterprise tools (auth, storage, CI/CD) can be difficult.  
* Limited visibility into resource usage or platform health.

### 📋 What They Need

* Automated deployment tools.  
* Easy integration with auth, storage and CI/CD systems.  
* Tools to manage user environments at scale, avoiding manual fixes.  
* Logs, metric and dashboards for monitoring and troubleshooting.  
* Resource controls and alerts for system health.
