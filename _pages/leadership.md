---
layout: page
title: "Leadership"
permalink: /leadership/
---

# Leadership

I lead not by control, but through structure, empathy, and design.
My leadership style centers on building systems, documents, and workflows that empower others to grow within clear, well-designed environments.
I translate complexity into clarity and ideas into architecture — whether in code, people, or processes.

---

{% for leadership in site.data.leadership %}
{% include cards/leadership-card.html leadership=leadership %}
{% endfor %}
