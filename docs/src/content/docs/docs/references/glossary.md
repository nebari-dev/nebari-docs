---
title: Glossary
description: Definitions of the core terms used across the Nebari docs, such as platform, Deploy Target, Software Pack, and Capability.
---

These are the core terms used across the Nebari docs.

## Capability

Something users can do once a [Software Pack](#software-pack) is installed, like running a chat assistant or analyzing documents. Several packs can deliver the same Capability.

Learn more: [Software Packs catalog](/docs/software-packs/)

## Deploy Target

What Nebari installs on your [infrastructure](#infrastructure) before any [Software Pack](#software-pack): the shared services every pack relies on, such as login, routing, TLS, and observability. Like an operating system for packs. [NKP](#nkp) is the only Deploy Target today.

Learn more: [Providers](/docs/how-tos/providers/)

## Ecosystem

Everything that makes up Nebari: the [Deploy Targets](#deploy-target) it installs, the [Software Packs](#software-pack) that run on them, and the community that builds and shares those packs.

## Infrastructure

The cloud, cluster, or hardware that Nebari runs on, such as an AWS account, a Hetzner server, or your laptop.

## Landing page

The home page of your platform, where users find all its [Software Packs](#software-pack).

## NIC

Nebari Infrastructure Core (NIC) is the command-line tool, run as `nic`, that installs, updates, and removes [NKP](#nkp) on your [infrastructure](#infrastructure).

Learn more: [Install NIC](/docs/get-started/install/)

## NKP

Nebari Kubernetes Platform (NKP) is Nebari's Kubernetes-based [Deploy Target](#deploy-target).

Learn more: [NKP architecture](/docs/explanations/nkp-architecture/)

## Platform

What your team ends up with when it uses Nebari: a [Deploy Target](#deploy-target) with the [Software Packs](#software-pack) you chose installed on it.

## Software Pack

An app or tool packaged so you can install it on a [Deploy Target](#deploy-target) in one step. Each pack delivers a [Capability](#capability), like a chat assistant or BI dashboards.

Learn more: [Pack architecture](/docs/explanations/software-packs/)
