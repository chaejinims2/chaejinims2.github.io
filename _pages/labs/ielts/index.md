---
layout: labs-ielts
title: IELTS Lab
intro: |
  책·시험을 고른 뒤 스킬을 선택하면 CBT 스타일로 **지문(좌)** 과 **답안(우)** 을 나란히 봅니다. 좁은 화면에서는 위·아래로 쌓입니다. 아래는 UI 플레이스홀더이며, 이후 `_data/ielts` 데이터와 연결할 수 있습니다.
tags:
  - ielts
  - labs
  - dark-ui
ielts_nav:
  - id: reading
    label: Reading
    icon: book
  - id: writing
    label: Writing
    icon: pen
  - id: speaking
    label: Speaking
    icon: microphone
---
<section id="ielts-workspace" class="ielts-section" aria-labelledby="ielts-workspace-heading">
  <div class="ielts-split" role="region" aria-label="CBT 두 패널">
    <article class="ielts-pane card card-transparent" aria-label="문제 영역">
      <div class="ielts-pane-body ielts-pane-body--muted" id="ielts-passage-body">
        {% capture ielts_reading_passage1 %}{% include ielts/ielts18/test1/reading/passage1.md %}{% endcapture %}
        {{ ielts_reading_passage1 | markdownify }}
      </div>
    </article>
    <article class="ielts-pane card card-transparent" aria-label="답안 영역">
      <div class="ielts-pane-body" id="ielts-questions-body">
        {% capture ielts_reading_q0 %}{% include ielts/ielts18/test1/reading/passage1-questions.md %}{% endcapture %}
        {{ ielts_reading_q0 | markdownify }}
      </div>
    </article>
  </div>
</section>

{%- comment -%}Build-time preload: passages as HTML templates (safe mode friendly){%- endcomment -%}
{% capture __p1 %}{% include ielts/ielts18/test1/reading/passage1.md %}{% endcapture %}
{% capture __p2 %}{% include ielts/ielts18/test1/reading/passage2.md %}{% endcapture %}
{% capture __p3 %}{% include ielts/ielts18/test1/reading/passage3.md %}{% endcapture %}
<template id="tpl-ielts18-test1-reading-passage1">{{ __p1 | markdownify }}</template>
<template id="tpl-ielts18-test1-reading-passage2">{{ __p2 | markdownify }}</template>
<template id="tpl-ielts18-test1-reading-passage3">{{ __p3 | markdownify }}</template>

{% capture __p1q %}{% include ielts/ielts18/test1/reading/passage1-questions.md %}{% endcapture %}
{% capture __p2q %}{% include ielts/ielts18/test1/reading/passage2-questions.md %}{% endcapture %}
{% capture __p3q %}{% include ielts/ielts18/test1/reading/passage3-questions.md %}{% endcapture %}
<template id="tpl-ielts18-test1-reading-passage1-questions">{{ __p1q | markdownify }}</template>
<template id="tpl-ielts18-test1-reading-passage2-questions">{{ __p2q | markdownify }}</template>
<template id="tpl-ielts18-test1-reading-passage3-questions">{{ __p3q | markdownify }}</template>

{% capture __t2p1 %}{% include ielts/ielts18/test2/reading/passage1.md %}{% endcapture %}
{% capture __t2p2 %}{% include ielts/ielts18/test2/reading/passage2.md %}{% endcapture %}
{% capture __t2p3 %}{% include ielts/ielts18/test2/reading/passage3.md %}{% endcapture %}
<template id="tpl-ielts18-test2-reading-passage1">{{ __t2p1 | markdownify }}</template>
<template id="tpl-ielts18-test2-reading-passage2">{{ __t2p2 | markdownify }}</template>
<template id="tpl-ielts18-test2-reading-passage3">{{ __t2p3 | markdownify }}</template>

{% capture __t2p1q %}{% include ielts/ielts18/test2/reading/passage1-questions.md %}{% endcapture %}
{% capture __t2p2q %}{% include ielts/ielts18/test2/reading/passage2-questions.md %}{% endcapture %}
{% capture __t2p3q %}{% include ielts/ielts18/test2/reading/passage3-questions.md %}{% endcapture %}
<template id="tpl-ielts18-test2-reading-passage1-questions">{{ __t2p1q | markdownify }}</template>
<template id="tpl-ielts18-test2-reading-passage2-questions">{{ __t2p2q | markdownify }}</template>
<template id="tpl-ielts18-test2-reading-passage3-questions">{{ __t2p3q | markdownify }}</template>

{% capture __t3p1 %}{% include ielts/ielts18/test3/reading/passage1.md %}{% endcapture %}
{% capture __t3p2 %}{% include ielts/ielts18/test3/reading/passage2.md %}{% endcapture %}
{% capture __t3p3 %}{% include ielts/ielts18/test3/reading/passage3.md %}{% endcapture %}
<template id="tpl-ielts18-test3-reading-passage1">{{ __t3p1 | markdownify }}</template>
<template id="tpl-ielts18-test3-reading-passage2">{{ __t3p2 | markdownify }}</template>
<template id="tpl-ielts18-test3-reading-passage3">{{ __t3p3 | markdownify }}</template>

{% capture __t4p1 %}{% include ielts/ielts18/test4/reading/passage1.md %}{% endcapture %}
{% capture __t4p2 %}{% include ielts/ielts18/test4/reading/passage2.md %}{% endcapture %}
{% capture __t4p3 %}{% include ielts/ielts18/test4/reading/passage3.md %}{% endcapture %}
<template id="tpl-ielts18-test4-reading-passage1">{{ __t4p1 | markdownify }}</template>
<template id="tpl-ielts18-test4-reading-passage2">{{ __t4p2 | markdownify }}</template>
<template id="tpl-ielts18-test4-reading-passage3">{{ __t4p3 | markdownify }}</template>
