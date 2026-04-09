---
layout: default
title: Design preview
intro: |
  This is a design preview for the Chaejin Im portfolio website.
tags:
  - design-md
  - dark-ui
  - portfolio
# 섹션 순서는 이 배열만 바꾸면 됩니다. kind는 preview.html의 case와 매칭.
preview_sections:
  - id: colors
    kind: colors
    nav_label: Colors
    nav_icon: paint-brush
    section_title: "01 / Color palette"
    heading: Semantic colors
  - id: buttons
    kind: variants_foundations
    nav_label: Buttons
    nav_icon: bolt
    section_title: "02 / Buttons"
    heading: Variants
  - id: typos
    kind: typos
    nav_label: Typography
    nav_icon: book
    section_title: "03 / Typography"
    heading: Type Scale
  - id: cards
    kind: layout_cards
    nav_label: Cards
    nav_icon: squares-2x2
    section_title: "04 / Cards"
    heading: Cards & Containers
  - id: terminal
    kind: terminal
    nav_label: Terminal
    nav_icon: command-line
    section_title: "05 / Terminal"
    heading: Log & CLI viewer
    note: |
      Optional fixed height: set `style="--terminal-height: 220px"` on `.terminal-pre-wrap` so the inner `pre` scrolls (`flex: 1; min-height: 0`).
  - id: icons
    kind: icons
    nav_label: Icons
    nav_icon: squares-plus
    section_title: "09 / Icons"
    heading: SVG library (inlined)
  # - id: logos
  #   kind: logos
  #   nav_label: Logos
  #   nav_icon: photo
  #   section_title: "10 / Logo library"
  #   heading: Marks & paths
  # - id: images
  #   kind: images
  #   nav_label: Images
  #   nav_icon: film
  #   section_title: "11 / Image library"
  #   heading: Figures & photos
  #   heading_class: image-library-heading
---
{% assign dp = site.data.design_preview %}
{% for sec in page.preview_sections %}
{% unless forloop.first %}
<hr class="section-divider">
{% endunless %}
{% case sec.kind %}
{% when 'colors' %}
{% include preview/sections/colors.html section=sec %}
{% when 'variants_foundations' %}
{% include preview/sections/variants_foundations.html section=sec %}
{% when 'typos' %}
{% include preview/sections/typos.html section=sec %}
{% when 'layout_cards' %}
{% include preview/sections/layout_cards.html section=sec %}
{% when 'terminal' %}
{% include preview/sections/terminal.html section=sec %}
{% when 'icons' %}
{% include preview/sections/icons.html section=sec %}
{% when 'logos' %}
{% include preview/sections/logos.html section=sec %}
{% when 'images' %}
{% include preview/sections/images.html section=sec %}
{% endcase %}
{% endfor %}