# Visitor count API (DIY)

Startup 페이지 푸터의 **Today / Total** 방문자 수는 `_config.yml`의 `visitor_count_api`에 넣은 URL로만 요청합니다.  
직접 구현한 서비스가 다음 계약만 지키면 됩니다.

## API 계약

- **요청**: `GET {visitor_count_api}` (쿼리/헤더 없어도 됨)
- **응답**: JSON `{ "today": number, "total": number }`
  - `today`: 오늘 방문 수 (날짜 바뀌면 리셋)
  - `total`: 전체 방문 수
- 동작: 요청 시 1씩 증가 후 위 형식으로 반환 (또는 증가만 하고 별도 조회로 반환해도 됨)

## 설정

`_config.yml`에 다음을 추가하거나 수정:

```yaml
visitor_count_api: "https://your-api.example.com/count"
```

비우거나 없으면 카운터는 요청하지 않고 숫자 자리에 `-`가 표시됩니다.

---

## 예시 1: Cloudflare Worker + KV

1. [Cloudflare](https://dash.cloudflare.com)에서 Worker와 KV 네임스페이스 생성.
2. Worker에 아래 코드 배포 후, Worker URL을 `visitor_count_api`에 넣기.

```js
// Cloudflare Worker (예: /count 라우트)
const KEY_TOTAL = 'total';
const KEY_TODAY_PREFIX = 'daily:';

export default {
  async fetch(req, env) {
    if (new URL(req.url).pathname !== '/count') return new Response('', { status: 404 });
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const keyToday = KEY_TODAY_PREFIX + today;
    const total = (await env.KV.get(KEY_TOTAL)) || '0';
    const day = (await env.KV.get(keyToday)) || '0';
    const newTotal = parseInt(total, 10) + 1;
    const newDay = parseInt(day, 10) + 1;
    await Promise.all([
      env.KV.put(KEY_TOTAL, String(newTotal)),
      env.KV.put(keyToday, String(newDay)),
    ]);
    return new Response(JSON.stringify({ today: newDay, total: newTotal }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};
```

Worker 설정에서 KV 네임스페이스를 `KV`라는 변수로 바인딩하면 됩니다.

---

## 예시 2: Netlify Function

Netlify에 배포하는 경우 `netlify/functions/count.js` (또는 `count.ts`)에서 같은 계약으로 응답하면 됩니다.  
저장소는 Netlify Blobs, Upstash Redis, Supabase 등 아무 것이나 사용 가능합니다.

---

## CORS

브라우저에서 다른 도메인으로 요청하므로, 응답에 다음 헤더가 필요합니다.

- `Access-Control-Allow-Origin: *` (또는 사이트 도메인)
