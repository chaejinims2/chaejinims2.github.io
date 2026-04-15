---
layout: page
title: Design preview
intro: |
  This is a design preview for the Chaejin Im portfolio website.
tags:
  - design-md
  - dark-ui
  - portfolio
# 섹션 순서는 이 배열만 바꾸면 됩니다. kind는 아래 {% case %}와 매칭.
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
{% assign s = sec %}
{% case sec.kind %}
{% when 'colors' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  {% for group_pair in dp.colors.groups %}
  {% assign group = group_pair[1] %}
  <div class="section-sub">
    <h3 class="section-sub-title">{{ group.label }}</h3>
    <div class="color-grid">
      {% for item in group.items %}
      <div class="color-swatch">
        <div class="color-swatch-block" style="background: var(--{{ item.name }});"></div>
        <div class="color-swatch-info">
          <div class="color-swatch-name">{{ item.label }}</div>
          <div class="color-swatch-hex swatch-hex-live"></div>
          <div class="color-swatch-role">{% if item.desc_html %}{{ item.desc_html }}{% else %}{{ item.desc }}{% endif %}</div>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endfor %}
</section>
{% when 'variants_foundations' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  <div class="section-sub">
    <h3 class="section-sub-title">Buttons &amp; select</h3>
    <div class="button-row">
      {% for group_pair in dp.variants.groups %}
      {% assign g = group_pair[1] %}
      {% for item in g.items %}
      {% if item.options %}
      <div class="control-demo">
        <label class="field-label" for="{{ item.name }}">{{ item.label }}</label>
        <div class="combo-wrap">
          <select id="{{ item.name }}" class="combo">
            {% for option in item.options %}
            <option value="{{ option.key }}">{{ option.value }}</option>
            {% endfor %}
          </select>
        </div>
        <div class="control-demo-hint">{{ item.hint }}</div>
      </div>
      {% else %}
      <div class="button-demo">
        <button type="button" class="{{ item.name }}"{% if item.disabled %} disabled{% endif %}>{{ item.label }}</button>
        <div class="button-demo-label">{% if item.desc_html %}{{ item.desc_html }}{% else %}{{ item.desc }}{% endif %}</div>
      </div>
      {% endif %}
      {% endfor %}
      {% endfor %}
    </div>
  </div>
  <div class="section-sub">
    {% if dp.default.groups.spacing.label %}<h3 class="section-sub-title">{{ dp.default.groups.spacing.label }}</h3>{% endif %}
    <div class="spacing-row">
      {% for item in dp.default.groups.spacing.items %}
      <div class="spacing-item">
        <div class="spacing-box" style="width: var(--{{ item.name }}); height: var(--{{ item.name }});"></div>
        <div class="spacing-label">{{ item.label }}</div>
      </div>
      {% endfor %}
    </div>
  </div>
  <div class="section-sub">
    {% if dp.default.groups.radius.label %}<h3 class="section-sub-title">{{ dp.default.groups.radius.label }}</h3>{% endif %}
    <div class="radius-row">
      {% for item in dp.default.groups.radius.items %}
      <div class="radius-item">
        <div class="radius-box {{ item.name }}"></div>
        <div class="radius-label">{{ item.label }}</div>
        <div class="radius-desc">
          {% if item.desc_html %}
            {{ item.desc_html }}
          {% else %}
            {{ item.desc }}
          {% endif %}</div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>
{% when 'typos' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  <div class="section-sub">
    <h3 class="section-sub-title">{{ dp.default.groups.typos.label }}</h3>
    {% for t in dp.default.groups.typos.items %}
    <div class="type-sample">
      <div class="type-sample-{{ t.name }}">{{ t.label }}</div>
      <div class="type-sample-meta">{% if t.desc_html %}{{ t.desc_html }}{% else %}{{ t.desc }}{% endif %}</div>
    </div>
    {% endfor %}
  </div>
</section>
{% when 'layout_cards' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  {% assign g = dp.layout.groups.cards %}
  <div class="card-grid">
    {% for item in g.items %}
    <div class="card {{ item.name }}">
      <div class="card-label">{{ item.label }}</div>
      <h3>{% if item.desc_html %}{{ item.desc_html }}{% else %}{{ item.desc }}{% endif %}</h3>
    </div>
    {% endfor %}
  </div>
</section>
{% when 'terminal' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  <div class="terminal-box">
    <div class="terminal-pre-wrap" style="--terminal-height: 220px;">
      <pre class="terminal-content">
<span class="log-loading">… Compiling nvme_core v0.2.1</span>
    Finished `release` profile in 42.3s
<span class="term-prompt">$</span> pytest tests/test_mi_basic.py -q
<span class="log-error">FAILED tests/test_mi_basic.py::test_reset_timeout</span> — AssertionError: expected 0, got 5
<span class="term-prompt">$</span> <span class="log-loading">_</span>
      </pre>
    </div>
  </div>
  {% if s.note %}
  <p class="note-box">{{ s.note | markdownify }}</p>
  {% endif %}
</section>
{% when 'icons' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  {% if s.section_lead %}<p class="section-lead">{{ s.section_lead | markdownify }}</p>{% endif %}
  <div class="icon-grid">
    {% for item in dp.assets.groups.icons.items %}
    {% assign icon_id = item.name | replace: '.svg', '' %}
    <div class="icon-cell" role="button" tabindex="0" title="{{ item.name }}" data-copy="{{ item.name }}">
      <svg class="icon-sprite" width="32" height="32" aria-hidden="true"><use href="#i-{{ icon_id }}"/></svg>
      <span class="icon-name">{% if item.label %}{{ item.label }}{% else %}{{ item.name }}{% endif %}</span>
      <span class="icon-feedback" aria-live="polite"></span>
    </div>
    {% endfor %}
  </div>
</section>
{% when 'logos' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading">{{ s.heading }}</h2>
  <div class="logo-grid">
    {% for logo in dp.assets.groups.logos.items %}
    {% assign logo_path = dp.assets.groups.logos.path | append: logo.name %}
    <div class="logo-cell" role="button" tabindex="0" title="{{ logo_path }}" data-copy="{{ logo_path }}">
      <div class="logo-cell-preview"><img src="{{ logo_path | relative_url }}" width="120" height="56" alt="" decoding="async" loading="lazy" /></div>
      <span class="icon-name">{% if logo.label %}{{ logo.label }}{% else %}{{ logo.name }}{% endif %}</span>
      <span class="icon-feedback" aria-live="polite"></span>
    </div>
    {% endfor %}
  </div>
</section>
{% when 'images' %}
<section class="section" id="{{ s.id }}">
  <div class="section-title">{{ s.section_title }}</div>
  <h2 class="section-heading{% if s.heading_class %} {{ s.heading_class }}{% endif %}">{{ s.heading }}</h2>
  <div class="logo-grid logo-grid--tall">
    {% for image in dp.assets.groups.images.items %}
    {% assign image_path = dp.assets.groups.images.path | append: image.name %}
    <div class="logo-cell" role="button" tabindex="0" title="{{ image_path }}" data-copy="{{ image_path }}">
      <div class="logo-cell-preview"><img src="{{ image_path | relative_url }}" width="120" height="68" alt="" decoding="async" loading="lazy" /></div>
      <span class="icon-name">{% if image.label %}{{ image.label }}{% else %}{{ image.name }}{% endif %}</span>
      <span class="icon-feedback" aria-live="polite"></span>
    </div>
    {% endfor %}
  </div>
</section>
{% endcase %}
{% endfor %}
