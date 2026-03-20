#!/usr/bin/env node
/**
 * questions.json(또는 quiz.json)에서 options[].description 이 빈 문자열인 항목을
 * 지정한 placeholder로 채웁니다.
 *
 * 사용:
 *   node scripts/fill-empty-option-descriptions.cjs [파일경로] [placeholder]
 *   node scripts/fill-empty-option-descriptions.cjs --dry-run [파일경로]
 *
 * 기본: _data/lm11/questions.json, placeholder "-"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DRY_RUN = process.argv.includes('--dry-run');
const defaultPath = path.join(__dirname, '..', '_data', 'lm11', 'questions.json');
const inputPath = path.resolve(args[0] || defaultPath);
const placeholder = args[1] !== undefined ? args[1] : '-';

function fillDescriptions(data) {
  if (!Array.isArray(data)) return { data, filled: 0 };
  let filled = 0;
  const out = data.map((item) => {
    if (!item.options || !Array.isArray(item.options)) return item;
    const options = item.options.map((opt) => {
      if (opt && typeof opt === 'object' && (opt.description === '' || opt.description == null)) {
        filled++;
        return { ...opt, description: placeholder };
      }
      return opt;
    });
    return { ...item, options };
  });
  return { data: out, filled };
}

function run() {
  const json = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(json);
  const { data: out, filled } = fillDescriptions(data);

  console.log('파일:', inputPath);
  console.log('채운 빈 description 개수:', filled);

  if (DRY_RUN) {
    console.log('--dry-run: 저장하지 않음');
    return;
  }

  fs.writeFileSync(inputPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('저장 완료.');
}

run();
