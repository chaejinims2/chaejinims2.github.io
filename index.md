---
layout: default
title: "This is title!!"
---

# Head 1, Should be changed!
I am a Systems & Platform Engineer with expertise in Linux kernel, storage systems (NVMe), and DevOps-oriented platform design.

My career journey combines deep technical roots (Linux kernel development, NVMe driver feature expansion, system debugging) with cross-disciplinary projects in sensor data collection, AI, and large-scale software engineering.

Highlights:

- Linux Kernel & Storage: NVMe driver feature extension (SPF → MPF), kernel build & migration projects, automated validation pipelines.
- Cross-disciplinary Projects:
    - Sensor data collection & synchronization
    - Enterprise-level semiconductor equipment project
- Leadership & Collaboration: SSAFY (Samsung SW Academy for Youth) class leader, (Exicon) new-hire leader, technical mentor & instructor experience.
- Global Mindset: Exchange student in China (HSK 4), English TOEIC 870 multicultural collaboration and strong communication skills.

I thrive in environments where system reliability, structural problem-solving, and cross-functional collaboration are essential, and I aim to grow into a Platform Architect building resilient and scalable developer ecosystems.
{% for project in site.data.projects %}
  {% include project-card.html project=project %}
{% endfor %}
