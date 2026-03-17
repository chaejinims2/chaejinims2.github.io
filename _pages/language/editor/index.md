---
layout: page
permalink: /tests/editor/
title: Voca JSON Editor
---

<div class="voca-editor" data-default-json-url="{{ '/assets/data/cvoca/voca.json' | relative_url }}">
  <div class="voca-editor__top">
    <!-- <div class="voca-editor__title">
      <h2 class="voca-editor__h">JSON 단어장 편집기</h2>
      <p class="voca-editor__sub">`voca-sample.json` 스키마(book_id/title/words/entries/examples) 기준. 브라우저만으로 불러오기·편집·내보내기.</p>
    </div> -->
    <div class="voca-editor__io">
      <div class="voca-editor__io-row">
        <!-- <label class="voca-editor__label">
          파일 불러오기
          <input id="ve-file" type="file" accept="application/json,.json" />
        </label> -->
        <!-- <button id="ve-load-default" type="button" class="ve-btn ve-btn--ghost">현재 voca.json 불러오기</button> -->
        <button id="ve-export" type="button" class="ve-btn ve-btn--primary">export .json</button>
      </div>
      <div class="voca-editor__io-row" style="justify-content:flex-start;">
        <div class="ve-colvis" role="group" aria-label="칼럼 표시 옵션">
          <label class="ve-radio"><input type="radio" name="ve-colvis" value="show-all"> 모두 보기</label>
          <label class="ve-radio"><input type="radio" name="ve-colvis" value="custom" checked> 선택</label>
        </div>
        <div class="ve-colchecks" role="group" aria-label="표 칼럼 선택">
          <label class="ve-check"><input type="checkbox" name="ve-col" value="id"> id</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="unit" checked> unit</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="term" checked> term</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="pos" checked> pos</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="gloss" checked> gloss</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="example" checked> example</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="translation"> translation</label>
          <label class="ve-check"><input type="checkbox" name="ve-col" value="actions" checked> actions</label>
        </div>
      </div>
      <!-- <details class="voca-editor__paste">
        <summary>JSON 붙여넣기/불러오기</summary>
        <div class="voca-editor__paste-inner">
          <textarea id="ve-json" class="voca-editor__textarea" rows="8" placeholder='여기에 전체 JSON을 붙여넣고 &quot;붙여넣기 JSON 불러오기&quot;를 누르세요.'></textarea>
          <div class="voca-editor__paste-actions">
            <button id="ve-load-text" type="button" class="ve-btn">붙여넣기 JSON 불러오기</button>
            <button id="ve-copy-json" type="button" class="ve-btn ve-btn--ghost">현재 JSON 복사</button>
          </div>
        </div>
      </details> -->
    </div>
  </div>

  <!-- <div class="voca-editor__meta">
    <div class="voca-editor__meta-grid">
      <label class="voca-editor__field">
        <span>book_id</span>
        <input id="ve-book-id" type="text" class="ve-input" />
      </label>
      <label class="voca-editor__field">
        <span>title</span>
        <input id="ve-title" type="text" class="ve-input" />
      </label>
      <div class="voca-editor__meta-actions">
        <button id="ve-add-word" type="button" class="ve-btn ve-btn--primary">+ 새 단어</button>
        <button id="ve-reindex" type="button" class="ve-btn ve-btn--ghost">id/unit 재정렬</button>
      </div>
    </div>
    <div class="voca-editor__stats" id="ve-stats"></div>
  </div> -->

  <div class="voca-editor__table-wrap">
    <table class="voca-editor__table" aria-label="단어장 편집 표">
      <thead>
        <tr>
          <th class="col-id">id</th>
          <th class="col-unit">unit</th>
          <th class="col-term">term</th>
          <th class="col-pos">pos</th>
          <th class="col-gloss">gloss</th>
          <th class="col-ex-text">example</th>
          <th class="col-ex-tr">translation</th>
          <th class="col-actions">actions</th>
        </tr>
      </thead>
      <tbody id="ve-tbody"></tbody>
    </table>
  </div>
</div>

<script src="{{ '/assets/js/pages/voca-editor.js' | relative_url }}"></script>

