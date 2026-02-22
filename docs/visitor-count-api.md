# Visitor count API

Startup 페이지 푸터의 **Today / Total** 방문자 수를 위한 API가 이 레포에 포함되어 있습니다.

## Netlify 배포 시 (권장)

이 레포에는 **Netlify Function** (`netlify/functions/count.mjs`)이 포함되어 있습니다.  
**Netlify**로 배포하면 방문자 수 API가 자동으로 올라갑니다.

1. 이 레포를 Netlify에 연결하고 배포한다.
2. 배포 후 함수 URL: `https://YOUR_SITE.netlify.app/.netlify/functions/count`
3. `_config.yml`에 다음을 추가한다 (YOUR_SITE를 실제 Netlify 사이트 이름으로 변경):

   ```yaml
   visitor_count_api: "https://YOUR_SITE.netlify.app/.netlify/functions/count"
   ```

4. 사이트를 **Netlify에서 서빙**하면 같은 도메인에서 API를 쓰므로 CORS 이슈가 없다.  
   **GitHub Pages**에서만 서빙하고 Netlify는 함수용으로만 쓰는 경우, 위 URL을 넣으면 다른 도메인이지만 CORS 헤더가 있어 동작한다.

### 동작 방식

- **Netlify Blobs**에 `total`(전체)과 `daily:YYYY-MM-DD`(당일) 값을 저장한다.
- GET 요청 시 두 값 모두 1 증가시킨 뒤 `{ "today": number, "total": number }` JSON을 반환한다.
- `package.json`에 `@netlify/blobs`가 있으므로 빌드 시 `npm ci`로 설치된다.

### 로컬에서 함수 테스트

```bash
npm ci
npx netlify dev
```

브라우저 또는 curl: `http://localhost:8888/.netlify/functions/count`

---

## GitHub Pages만 사용하는 경우

Netlify에 배포하지 않으면 이 함수는 사용할 수 없다. 그 경우:

- `visitor_count_api`를 비워 두면 레이아웃에서 **CountAPI**를 fallback으로 호출한다 (광고 차단기 등에서 막힐 수 있음).
- 또는 [docs/visitor-count-api.md](visitor-count-api.md)에 있던 **Cloudflare Worker** 예시처럼 다른 서비스에 API를 만들어 두고, 그 URL을 `visitor_count_api`에 넣어 사용하면 된다.
