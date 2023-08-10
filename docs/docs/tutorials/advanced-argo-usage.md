---
id: advanced-argo-usage
title: Advanced Argo Usage
description: More complex Argo workflows using conda
---

# Advanced Argo Usage

## Introduction

Using a workflow manager can help you automate ETL pipelines, schedule regular
analysis, or just chain together a sequence of functions. Argo is available on
Nebari for workflow management. If you haven't already checked out the
[introductory documentation on Argo](/how-tos/using-argo.md) and
[Argo workflows walkthrough](/tutorials/argo-workflows-walkthrough.md), we
highly recommend you check those out first!

For this tutorial we'll be using the
[Hera](https://hera-workflows.readthedocs.io/) interface to Argo. This will
allow us to write a workflow script in Python.
