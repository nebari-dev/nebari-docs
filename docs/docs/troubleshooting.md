# Nebari Troubleshooting

:::warning
:construction: Please pardon our dust as we build out our new docs :) :construction:
:::

### Can't find my KUBECONFIG_FILE on /temp, what should I do?

Due to the fact that the `KUBECONFIG_FILE` is stored in `/temp`, system will remove that file when you turn off the computer. If you want to re-generate the file again, you can do so by running the `qhub deploy` command again as Nebari will update/create a `KUBECONFIG_FILE` in for you for each deployment.