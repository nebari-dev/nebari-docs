---
id: domain-registry
title: Setup Nebari domain registry
description: Setting a custom DNS Domain Registry
---

# Setup Nebari domain registry

## What is a DNS?

The Domain Name System (DNS) turns domain names into IP addresses, which browsers use to load internet pages.
Every device connected to the internet has its IP address, which other devices use to locate the device.
DNS name servers are used to locate the IP address of a domain name using words or instead of direct IP addresses.

## Setting up a DNS

During deployment, Qhub will generate an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) IP for connection with the Kubernetes cluster and all related services that Qhub runs. If not automatically handled, Qhub will request the user to generate the necessary [DNS records](https://www.cloudflare.com/en-gb/learning/dns/dns-records/) and update the domain within the newly created IP:

```bash
Take IP Address 12.312.312.312 and update DNS to point to "your.domain" [Press Enter when Complete]
```

Once the IP is generated, you will need to grab it and create the necessary records within the DNS provider of your choice.

## Cloudflare

QHub supports Cloudflare as a DNS provider. If you choose to use Cloudflare, first create an account, then there are two possible following options:

1. You can register your application domain name on it, using the [Cloudflare nameserver](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup) (recommended).

2. You can purchase a new domain with Cloudflare.

To generate a token follow the steps below. For additional information, see the [CloudFlare docs](https://developers.cloudflare.com/api/tokens/create).

### Setting up an API token on CloudFlare

- Under Profile, select the API Tokens menu and click on Create API Token.

- On Edit zone DNS click on Use Template.![screenshot Cloudflare edit Zone DNS](/img/how-tos/cloudflare_auth_1.png).

- Configure Permissions such as the image below:![screenshot Cloudflare Permissions edit](/img/how-tos/cloudflare_permissions_2.1.1.png)

- On Account Resources set the configuration to include your desired account.![screenshot Cloudflare account resources](/img/how-tos/cloudflare_account_resources_scr.png)

- On Zone Resources set it to Include | Specific zone and your domain name.![screenshot Cloudflare zone resources](/img/how-tos/cloudflare_zone_resources.png)

- Click continue to summary.![screenshot Cloudflare summary](/img/how-tos/cloudflare_summary.png)

- Click on the Create Token button and set the token generated as an environment variable on your machine.

### Setup API token locally

Finally, set the token value as an environment variable:

```bash
 export CLOUDFLARE_TOKEN="cloudflaretokenvalue"
```

Also, add the flag `--dns-provider=cloudflare` to the [Qhub deploy command.](https://www.nebari.dev/how-tos/nebari-gcp#deploying-nebari)

## Using other DNS providers

Currently, QHub only supports CloudFlare for [automatic DNS registration](link to automatic section below). If an alternate DNS provider is desired, change the `--dns-provider` flag from `cloudflare` to `none` on the qhub deploy command.

Below are the links to detailed documentation on how to create and manage DNS records on a few providers:

- [Cloud DNS](https://cloud.google.com/dns/docs/tutorials/create-domain-tutorial) provider
- [Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html) DNS provider
- [Azure DNS](https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal) provider
- [Digital Ocean DNS](https://docs.digitalocean.com/products/networking/dns/quickstart/) provider

:::note
Once your new DNS domain is created, it might take time for the records and related certificates to fully propagate.
The amount of time this takes varies for each DNS provider. Validate such information in the related documentation for your chosen provider.
:::

## Automatic DNS provision

Qhub has an extra flag for deployments that grants management and the creation of the DNS records for you automatically. For automatic DNS provision add `--dns-auto-provision` to your qhub deploy command:

`qhub deploy -c qhub-config --dns-provider cloudflare --dns-auto-provision`
This will set the DNS provider as Cloudflare and automatically handle the creation or updates to the Qhub domain DNS records on Cloudflare.

:::warning
The usage of `--dns-auto-provision` is restricted to Cloudflare as it is the only fully integrated DNS provider that Qhub currently supports.
:::

When you are done setting up the domain name, you can refer back to the [Nebari deployment documentation](https://www.nebari.dev/how-tos/nebari-gcp#deploying-nebari) and continue the remaining steps.
