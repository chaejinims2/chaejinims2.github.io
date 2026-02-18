---
layout: page
title: Extending NVMe Host Driver from SPF to MPF
permalink: /projects/nvme-spf-mpf/
nav_group: projects
---

# Extending NVMe Host Driver from SPF to MPF

Extended an existing NVMe host driver to support Multi Physical Functions (MPF) as well as Single Physical Function (SPF). By redesigning the static array-based global variable model of the legacy driver into a reference-counting-based list structure, I reduced the module size and increased scalability.

**Highlights:** Kernel 5.9.16, Significantly Reduced Module Size, Increased Maximum Supported PF Count

**Tech:** Linux Kernel, PCIe, NVMe, Debug
