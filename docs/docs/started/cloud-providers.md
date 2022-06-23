---
id: cloud-providers
---

# Cloud providers

A selection of Nebari supported cloud providers

Now that Nebari is successfully installed we can move forward with choosing the best suitable cloud provider to help you effectively deploy and start your projects within Nebari.

To deploy Nebari, each cloud provider requires fairly wide permissions to create all the necessary cloud resources provided in the form of `access keys`. Hence, once the Cloud provider has been chosen, follow the steps described in their respectful How-to guides to move forward to the deployment.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="gcp" label="Google GCP" default>

<div class="text--center">
  <img src="/img/started-google-cloud-logo.png" width={420} />
</div>

[Google GCP](https://docs.qhub.dev/en/latest/source/installation/setup.html#google-cloud-platform) (also known as Google Cloud Platform or GCP) is a provider of computing resources for developing, deploying, and operating computing services.

For more information on how to set Nebari for **GCP** please visit [How to deploy Nebari on GCP](/how-tos/nebari-gcp)
</TabItem>
<TabItem value="do" label="Digital Ocean">

<div class="text--center">
  <img src="/img/started-digital-ocean-logo.png" width={420} />
</div>

[DigitalOcean](https://docs.qhub.dev/en/latest/source/installation/setup.html#digital-ocean) is a cloud hosting provider that offers cloud computing services and Infrastructure as a Service (IaaS) known for its pricing and scalability.

For more information on how to set Nebari for **Digital Ocean** please visit [How to deploy Nebari on Digital Ocean](/how-tos/nebari-do)
</TabItem>
<TabItem value="aws" label="Amazon AWS">

<div class="text--center">
  <img src="/img/started-amazon-web-services-logo.png" width={420} />
</div>

[Amazon AWS](https://docs.qhub.dev/en/latest/source/installation/setup.html#amazon-web-services-aws) (also know as Amazon Web Services or AWS) is a comprehensive, evolving cloud computing platform provided by Amazon that includes a mixture of infrastructure as a service (IaaS), platform as a service (PaaS) and packaged software as a service (SaaS) offerings.

For more information on how to set Nebari for **AWS** please visit [How to deploy Nebari on AWS](/how-tos/nebari-aws)
</TabItem>
<TabItem value="azure" label="Azure">

<div class="text--center">
  <img src="/img/started-azure-logo.png" width={420}/>
</div>

[Azure](https://docs.qhub.dev/en/latest/source/installation/setup.html#microsoft-azure) (also know as Microsoft Azure, formerly known as Windows Azure), is Microsoft's public cloud computing platform. It provides a range of cloud services, including compute, analytics, storage and networking.

For more information on how to set Nebari for **Azure** please visit [How to deploy Nebari on Azure](/how-tos/nebari-azure)
</TabItem>
</Tabs>

:::warning Warning
While all of the above cloud providers have a `free-tier` account available for use, some of Nebari infrastructure resources may lie outside the scope of the `free-tier` quotas. Therefore, if your intention is to try out Nebari with a quick-install to see how it works we heavily recommend to use the [Local version of Nebari](/how-tos/nebari-local).
:::