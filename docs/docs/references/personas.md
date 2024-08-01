---
# Display h2 to h3 headings
toc_min_heading_level: 2
toc_max_heading_level: 3
---

# Personas

There are a variety of people which may interact with Nebari deployments. Below is a list of fabricated personas intended to cover most people who interact with Nebari.

## User groups

Each persona is placed in a Nebari user group:

**End users** are the folks who are doing their daily work on Nebari. They are using Nebari as a platform to complete a variety of tasks from software development to dashboard creation to machine learning training and evaluation. Our end users are [Alia](#alia), [Noor](#noor), [Robin](#robin), and [Skyler](#skyler).

**Super users**, like end users may also be using Nebari for their daily work, but they do so with elevated privileges. These folks are in charge of managing teams of people and as such may be managing environments for their team. Our super users are [Blake](#blake), [Enzo](#enzo), [Jacob](#jacob), and [Sam](#sam).

**Customer** represents the person at an organization making the high level decision to adopt Nebari as a platform for their employees. Our customer is [Jordan](#jordan).

**Admin** represents the people who are in charge of deploying Nebari. They are responsible for maintaining and running the day to day maintenance. This may include cloud account management, conda-store maintenance, kubernetes cluster management and adding/removing end users from the deployment. Our admin is [Taylor](#taylor)


## Personas

---

### Alia

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 25-35</p> 
            <p>Role: Data scientist </p> 
            <p>Reports to: Head of Data Science</p>  
            <p>Nebari user group: end user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/alia.png" alt="cartoon image of persona alia" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As a Data scientist I want to investigate, extract and report meaningful insights with my organisation’s data.
- As a DS I want to build self-serving internal data products to make data simple within the company.

#### :wrench: Software tools

- Python - NumPy, Pandas, scikit-learn, etc.
- Airflow
- GCP buckets
- SQL
- Data viz and dashboarding tools like Plotly, Panel, Altair...
- VSCode, Jupyter notebooks

#### 🌮 Core needs

N/A

#### 🐛 Pain points or biggest challenges

- Poor data quality and quantity
- High friction in collaborative projects

- Ability to experiment with new methods, libraries, and datasets in an efficient and quick way
- Access to multiple data sources with minimal friction
- Clear communication channels with software engineering, infrastructure, and other departments
- Need to communicate results to non-technical people

---

### Blake

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 25-35 </p> 
            <p>Role: Software Engineer/ ML Engineer </p> 
            <p>Reports to: Head of Software Engineering </p>  
            <p>Nebari user group: super user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/blake.png" alt="cartoon image of persona blake" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- Nebari is a place I go to do my everyday programming work. I use conda envs, jupyter, and write code in vscode. I deploy dashboards with cds dashboards. I create packages and I need to pip install the dev versions into my environment.
- As a SWE I want to be able to collaborate with the Data and Engineering teams to build new prototypes for products

#### :wrench: Software tools

- VSCode
- Jupyter notebooks
- conda, pip
- Python and stack
- Plotly, Altair, etc.

#### 🐛 Pain points or biggest challenges

N/A

#### 🌮 Core needs

- Need to be able to create prototypes efficiently and run experiments with product and data teams
- ability to ship products without being held up in the process
- ability to manage my environment and tooling

---

### Enzo

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 30-40</p> 
            <p>Role: Staff Machine learning engineer at a startup </p> 
            <p>Reports to: Head of Software Engineering</p>  
            <p>Nebari user group: super user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/enzo.png" alt="cartoon image of persona enzo" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As an ML Engineer in a startup, I have good modeling and coding skills, but I want to build MLOps pipelines as easily as possible, without having to learn DevOps first, so that I can efficiently test and productionize my models.

#### :wrench: Software tools

- Python, PyTorch
- Git, GitHub
- AWS, GCP
- Argo
- DVC, ClearML, Tensorboard
- CI/CD platform
- K8s, Dask

#### 🐛 Pain points or biggest challenges

- Lack of DevOps experience makes pipeline implementation difficult, time consuming, and error prone.
- Limited high-level access to pipeline tools means that they are essentially black boxes to me (can’t see logs, not sure what’s happening when something breaks)

#### 🌮 Core needs

- Safe and efficient access to infrastructure without breaking things
- Elevated privileges to experiment with different configurations and for transparency into background tasks
- Documentation that shows how to implement common pipeline configurations
- Templates/base configurations with several different scenarios

---

### Jacob

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 30-40  </p> 
            <p>Role: Staff Machine learning engineer  </p> 
            <p>Reports to: Head of Software Engineering</p>  
            <p>Nebari user group: super user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/jacob.png" alt="cartoon image of persona jacob" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As an ML Engineer with good DevOps skills and not much time, I want to build MLOps pipelines efficiently so that I don’t waste time on tedious tasks.

#### :wrench: Software tools

- Python, PyTorch
- Git, GitHub
- AWS, GCP
- Argo
- DVC, ClearML, Tensorboard
- CI/CD platform
- K8s, Dask

#### 🐛 Pain points or biggest challenges

- Rigid pipelining tools limit flexibility to build pipelines that meet my specific constraints.
- Limited or incomplete documentation (just hello world examples) doesn’t give me enough information to build the complex configuration I need without a lot of trial and error testing.

#### 🌮 Core needs

- Efficient access to infrastructure
- Elevated privileges to experiment with different configurations and for transparency into background tasks
- Documentation that shows how to implement common pipeline configurations
- Templates/base configurations with several different scenarios
- Flexible pipelining platform that allows experimentation and custom solutions

---

### Jordan

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 45-60</p> 
            <p>Role: CEO</p> 
            <p>Reports to: &mdash; </p>  
            <p>Nebari user group: customer</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/jordan.png" alt="cartoon image of persona jordan" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As a CEO I am interested in knowing how the data teams are helping us improve our processes and revenue streams.
- I don’t know anything about programming or jupyter. As the CEO I want to click on a button or email, sign in, and see informative dashboards and metrics.
- I want to have a clear breakdown of costs from my departments.

#### :wrench: Software tools

- Spreadsheets
- Email
- Data dashboards

#### 🐛 Pain points or biggest challenges

- there is big churn in the industry right now - how can we easily bring up new hires to speed?

#### 🌮 Core needs

- low-barrier access to data insights and outputs
- easy to track budgets and costs
- please stop the fights on data and swe departments

---

### Noor

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 16-25</p> 
            <p>Role: Student Python Programmer  </p> 
            <p>Reports to: &mdash; </p>  
            <p>Nebari user group: end user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/noor.png" alt="cartoon image of persona noor" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As a student, I want to learn how to use Python to get a job in software development after I graduate.
- I’m learning how to code. I know I need an environment, but someone else creates and manages them. I never modify an environment myself (either through conda or pip)

#### :wrench: Software tools

- Python
- VScode and Jupyter notebooks
- conda, pip

#### 🌮 Core needs

- simple and intuitive platform
- easy sharing and collaboration
- ability to experiment without worrying about “breaking things”

#### 🐛 Pain points or biggest challenges

- I do not know how to share my work with friends and peers

---

### Robin

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 45-55 </p> 
            <p>Role: Head of Data Science  </p> 
            <p>Reports to: CTO</p>  
            <p>Nebari user group: end user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/robin.png" alt="cartoon image of persona robin" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As the head of Data Science I want to make sure my team has all the tools and data needed to be successful in their job.
- As the HDS I want to have executive buy-in to grow the data practice in house to improve our internal processes and better serve our customers.
- As the HDS I want to not have to spend half of my budget in proprietary platforms.
- As the HDS I want to work with organisation leadership to help establish long-term vision, strategy and roadmap for one or more teams

#### :wrench: Software tools

- Git/ GitHub
- R and Python
- Dhasboarding and data viz tools
- Spark, SQL
- VSCode, Jupyter notebooks

#### 🌮 Core needs

- Low friction tooling to make my team more productive
- Foster collaboration, mentorship and peer-programming
- A platform that “just works”
- An easy way to share insights with non-technical executives and folks at the company

#### 🐛 Pain points or biggest challenges

- Lack of alignment across departments and lack of OKRs
- Often get caught on discussions between my team, software engineering, and infrastructure to move items to production
- Another resignation - need to offboard and onboard people seamlessly

---

### Sam

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 30-40  </p> 
            <p>Role: Research Data Scientist </p> 
            <p>Reports to: Head of Data Science  </p>  
            <p>Nebari user group: super user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/sam.png" alt="cartoon image of persona sam" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As a research data scientist I want to use ML to measure and optimise the costs, performance, efficiency and reliability of our company’s infrastructure to deliver the best experience to our customers.
- As a research data scientist I want to implement and test out new approaches both on toy test tasks as well as on actual application scenarios.

#### :wrench: Software tools

- Python
- Machine Learning frameworks
- SQL
- Dask
- VSCode, Jupyter notebooks

#### 🌮 Core needs

- Collaboration with engineering, product and the rest of the DS team
- Ability to track experiments, models, data, accuracy, metrics reliably
- Ability to access scalable compute on-demand

#### 🐛 Pain points or biggest challenges

- Cannot scale the compute resources without having to go through infrastructure approval
- Not easy way to track experiments, data lineage, and workflow artefacts
- Do not understand git well enough

---

### Skyler

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 35-45  </p> 
            <p>Role: Staff Machine learning engineer  </p> 
            <p>Reports to: Head of Software Engineering  </p>  
            <p>Nebari user group: end user</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/skyler.png" alt="cartoon image of persona skyler" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- As a ML engineer I want to work across teams and functions -- software engineers, ML engineers, data scientists, researchers, and product managers to understand user problems and build engineering solutions.
- As a ML Engineer I want to work with ML engineers and related teams to integrate ML components into the system and solve their performance issues

#### :wrench: Software tools

- Docker
- CI/CD platforms
- Python, Go, bash
- VSCode and Vim
- Flyte, Kubeflow
- GCP, Azure, AWS, DO
- Dask
- Git, GitHub, GitLab

#### 🌮 Core needs

- highly collaborative and extensible tooling and platform
- enforcement of best practices
- safe and efficient access to both the data and the infrastructure
- elevated privileges to experiment in “staging or pre-production” environments

#### 🐛 Pain points or biggest challenges

- Lack of best practices across other sides of the organisation makes my job really hard
- I am not sure if the models in production have bugs or the data is no longer accurate, need better monitoring tools

---

### Taylor

<table>
    <tr>
        <td style={{border: 'none'}}>
            <p>Age bracket: 30-45 </p> 
            <p>Role: Sr. Dev Ops Engineer  </p> 
            <p>Reports to: Head of Software Engineering  </p>  
            <p>Nebari user group: admin</p>  
        </td>
        <td style={{border: 'none'}}>
            <img src="/img/references/taylor.png" alt="cartoon image of persona taylor" style={{ border: 'none', 'background-color' : 'var(--ifm-color-background-3)', height: 300}}  />
        </td>
    </tr>
</table>

#### 📣 Story

- I maintain my org’s Nebari deployment. I make sure the infrastructure as code is maintained and that everyone has the conda environments or other resources they need.
- As a DevOps engineer I want to automate away as much of the day to day as possible - “Run By Robots” is the goal to minimise issues and make out team more efficient.
- Identify, respond to and collaborate with support and product teams to resolve production and customer issues and incidents.

#### :wrench: Software tools

- GCP, Azure, AWS, DO
- GNU/Linux
- Scripting - bash
- Terraform, Ansible, Docker...
- Kubernetes
- Grafana, Prometheus, Elastic

#### 🐛 Pain points or biggest challenges

- The organisation still relies on many manual operations
- There is so much technical debt - we can lose all of our infrastructure easily

#### 🌮 Core needs

- Rely on automation as much as needed
- Have a product and security first approach to data and SWE
- Have organisation wide best practices for monitoring, alerting and incident management
- Ensure the whole company adheres to best practices
