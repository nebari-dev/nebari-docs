---
title: Glossary
description: Definitions of the core terms used across the Nebari docs, such as platform, Deploy Target, Software Pack, and Capability.
---

These are the core terms used across the Nebari docs.

## Capability

Useful work your users can do, such as chatting with an LLM or analyzing documents. Different tools can provide the same Capability.

Learn more: [Software Packs catalog](/docs/software-packs/)

## Cluster

One running instance of a [Deploy Target](#deploy-target), such as EKS on AWS or kind on your laptop.

## Deploy Target

A kind of environment Nebari can be deployed to. Kubernetes is the only Deploy Target today. Bare metal, edge devices, and HPC clusters are possible future targets.

Learn more: [NKP architecture](/docs/explanations/nkp-architecture/)

## Ecosystem

Everything that makes up Nebari: the [Deploy Targets](#deploy-target) it supports, the [platforms](#platform) built for them, the [Software Packs](#software-pack) that run on those platforms, and the community that builds and shares those packs.

## Foundational software

What Nebari installs on your [cluster](#cluster) before any [Software Pack](#software-pack): the shared services every pack relies on, such as login, routing, TLS, and observability. Like an operating system for packs.

## Infrastructure

What your [cluster](#cluster) runs on, plus everything around it: machines, networking, storage, and access permissions. Your [Cluster Provider](#provider) supplies it, for example an AWS account, a Hetzner server, or your laptop.

## Landing page

The home page of your platform, where users sign in and open its [Services](#service).

## NIC

Nebari Infrastructure Core (NIC) is the command-line tool, run as `nic`, that creates, updates, and removes your [platform](#platform).

Learn more: [Install NIC](/docs/get-started/install/)

## NKP

Nebari Kubernetes Platform (NKP) is Nebari's [platform](#platform) for the Kubernetes [Deploy Target](#deploy-target).

Learn more: [NKP architecture](/docs/explanations/nkp-architecture/)

## Platform

What your team builds on: the [infrastructure](#infrastructure), the [cluster](#cluster), and the [foundational software](#foundational-software). You install [Software Packs](#software-pack) on top of it.

## Provider

An outside service that [NIC](#nic) connects to while setting up your [platform](#platform). There are three kinds:

- **Cluster Provider:** supplies your [infrastructure](#infrastructure) and [cluster](#cluster), such as AWS, Hetzner, or your laptop.
- **DNS Provider:** manages the web addresses for your platform, such as Cloudflare.
- **Repository Provider:** hosts the Git repository your platform's setup is synced from.

Learn more: [Providers](/docs/how-tos/providers/)

## Service

What you end up with after installing a [Software Pack](#software-pack): an app your users work in, such as JupyterHub or Grafana. Services provide [Capabilities](#capability).

## Software Pack

What you install on your [platform](#platform) to add one or more [Services](#service). For example, the MLflow Pack installs the MLflow web app (a Service), which provides experiment tracking and a model registry (Capabilities).

Learn more: [Pack architecture](/docs/explanations/software-packs/)
