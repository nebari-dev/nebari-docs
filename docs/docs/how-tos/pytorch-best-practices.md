---
id: pytorch-best-practices
title: Best practices for PyTorch on Nebari
description: |
  A guide for working with PyTorch on Nebari
---

# Best practices for installing PyTorch on Nebari
We recommend using the [PyTorch installation matrix][pytorch installation matrix] to generate a conda (or pip) install command and using it to fill out the Conda specification in conda-store.  For example, the following options can be entered into the matrix to get the package options for a Conda environment:
- Stable
- Linux
- Conda
- Python
- CUDA 11.7

![pytorch-matrix](/img/how-tos/pytorch-installation-matrix.png)

Those options produce the following command, which provides the packages and channels we need to build the environment:

```bash
conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia
```

So just go to conda-store and create a new environment by adding `pytorch`, `torchvision`, `torchaudio`, and `pytorch-cuda=11.7` to the list of requested packages and adding `pytorch` and `nvidia` to the list of channels.

![conda-pytorch-specification](/img/how-tos/pytorch-conda-specification.png)

Add any other packages you need and click `Create` to build the environment.

Also see the FAQ answer to [Why doesn't my code recognize the GPU(s) on Nebari?][why gpus not recognized]

[pytorch installation matrix]: https://pytorch.org/get-started
[why gpus not recognized]: ../faq#why-doesnt-my-code-recognize-the-gpus-on-nebari
