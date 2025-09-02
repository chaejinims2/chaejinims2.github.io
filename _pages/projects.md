---
layout: page
title: "Projects"
permalink: /projects/
---

# Projects

Here is a curated list of my personal and professional projects.  
Each project reflects my hands-on experience in system software, storage drivers, and automation tools.

---

{% for project in site.data.projects %}
{% include project-card.html project=project %}
{% endfor %}
