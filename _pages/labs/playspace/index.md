---
layout: page
title: Playspace
intro: |
  This is a playspace for the Chaejin Im portfolio website.
tags:
  - design-md
  - dark-ui
  - portfolio
---

<div class="cherry-hero-actions">
    {% include parts/image_button.html
    href="https://www.netflix.com/browse"
    title="Netflix"
    image="netflix-3"
    %}
    {% include parts/image_button.html
    href="https://www.disneyplus.com/home"
    title="Disney Plus"
    image="disney--1"
    %}
    {% include parts/image_button.html
    href="https://www.youtube.com"
    title="YouTube"
    image="youtube-6-darkmode"
    %}
    {% include parts/image_button.html
    href="https://www.instagram.com"
    title="Instagram"
    image="instagram-2"
    %}
{% if page.lead %}
    <p class="startup-lead">{{ page.lead }}</p>
{% endif %}
{% assign playspace_about_href = site.baseurl | append: "/labs/playspace/index" %}
{% include parts/icon_href.html
    href=startup_about_href
    title="About"
    image="home" %}
{% include parts/icon_href.html
    href="https://github.com/chaejinims2?tab=repositories"
    title="GitHub Repository"
    image="git" %}
</div>
