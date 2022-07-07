---
id: domain-registry
title: How to set Nebari's DNS Domain Registry
description: Setting a custom DNS Domain Registry
---

# Nebari domain registry setup

This domain will be where your application will be exposed.

Currently, Nebari's default configuration is set for CloudFlare for automatic DNS registration. If you prefer an alternate DNS provider, you'll need to change the `--dns-provider` flag from `cloudflare` to `none` on the QHub deploy command.
The deployment process will then pause when it asks for an IP address (or `CNAME`, if using AWS) and prompt you to provide the desired URL.

:::warning
Setting a DNS record heavily depends on the provider, and thus it’s not possible to provide detailed docs here on how to
create a record on all the providers out there. Searching "setting a DNS record" or "setting a CNAME DNS record" on your specific provider should yield good results.
:::
