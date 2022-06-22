---
id: domain-registry
title: How to set Nebari's DNS Domain Registry
---

# Nebari domain registry setup

This domain will be where your application will be exposed.

Currently, Nebari only supports CloudFlare for automatic DNS registration. If an alternate DNS provider is desired, change the `--dns-provider` flag from **cloudflare** to **none** on the Nebari deploy command. The deployment then will be paused when it asks for an IP address (or CNAME, if using AWS) and prompt to register the desired URL.

Setting a DNS record heavily depends on the provider thus it’s not possible to have detailed docs on how to create a record on your provider. Googling setting **A/CNAME** record on your requested cloud provider should yield good results on doing it for your specific provider.