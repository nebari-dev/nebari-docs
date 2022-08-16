# Frequently asked questions

### Why is the `NEBARI_KUBECONFIG` file in `/tmp`?

Nebari regenerates this file on every run. Yes, it will be removed by the operating system during its cleanup process, but running the `qhub deploy` command again as Nebari will update/create a `NEBARI_KUBECONFIG` file for you.

