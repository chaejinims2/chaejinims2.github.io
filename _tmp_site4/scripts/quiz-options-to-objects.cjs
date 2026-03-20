#!/usr/bin/env node
/**
 * quiz.json 의 options 를 문자열 배열에서
 * { "option": "", "description": "" } 형태의 객체 배열로 변환합니다.
 *
 * 사용: node scripts/quiz-options-to-objects.cjs [입력파일] [출력파일]
 *       node scripts/quiz-options-to-objects.cjs --dry-run  (저장 없이 샘플만)
 * 기본: _data/lm11/quiz.json → 덮어쓰기
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const args = process.argv.filter((a) => !a.startsWith('--'));
const dataDir = path.join(__dirname, '..', '_data', 'lm11');
const defaultPath = path.join(dataDir, 'quiz.json');
const inputPath = path.resolve(args[2] || defaultPath);
const outputPath = path.resolve(args[3] || inputPath);

function transformOptions(options) {
  if (!Array.isArray(options)) return options;
  return options.map((item) => {
    if (item && typeof item === 'object' && 'option' in item) {
      return {
        option: item.option ?? '',
        description: item.description ?? '',
      };
    }
    const text = typeof item === 'string' ? item : String(item ?? '');
    return { option: text, description: '' };
  });
}

function run() {
  const json = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(json);

  if (!Array.isArray(data)) {
    console.error('입력 JSON은 배열이어야 합니다.');
    process.exit(1);
  }

  let changed = 0;
  const out = data.map((item) => {
    if (!item.options) return item;
    const next = transformOptions(item.options);
    if (JSON.stringify(item.options) !== JSON.stringify(next)) changed++;
    return { ...item, options: next };
  });

  console.log(`처리: ${data.length}문항, options 변환: ${changed}문항`);

  if (DRY_RUN) {
    console.log('--dry-run: 출력 파일 미저장');
    console.log(JSON.stringify(out.slice(0, 1), null, 4));
    return;
  }

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 4), 'utf8');
  console.log('저장:', outputPath);
}

run();
