---
layout: page
title: 파일 위치 검색 (which / whereis / locate)
---

리눅스마스터 1급 시험에서 **파일 위치 검색 명령어**는 다음 세 가지가 비교 문제로 자주 출제됩니다.

```text
which
whereis
locate
```

핵심 차이는 **검색 방식과 검색 대상**입니다.

---

# 1. which

`which`는 **실행 가능한 명령어의 경로**를 찾습니다.

특징

```text
PATH 환경 변수에 있는 디렉터리만 검색
```

사용 예

```bash
which ls
```

출력 예

```text
/bin/ls
```

즉

```text
실행 명령어 위치 확인
```

에 사용됩니다.

---

# 2. whereis

`whereis`는 **명령어 관련 파일 전체 위치**를 찾습니다.

검색 대상

```text
실행 파일
소스 코드
매뉴얼 파일
```

사용 예

```bash
whereis ls
```

출력 예

```text
ls: /bin/ls /usr/share/man/man1/ls.1.gz
```

특징

```text
명령어 + 문서 위치 확인
```

---

# 3. locate

`locate`는 **파일 이름 기반 검색**입니다.

사용 예

```bash
locate passwd
```

특징

```text
DB 기반 검색
```

즉

```text
updatedb
```

로 생성된 **파일 데이터베이스**를 검색합니다.

그래서

```text
검색 속도 매우 빠름
```

하지만

```text
최신 파일이 반영 안될 수 있음
```

---

# 4. 명령어 비교

| 명령어     | 검색 대상      | 특징      |
| ------- | ---------- | ------- |
| which   | 실행 파일      | PATH 기반 |
| whereis | 실행파일 + man | 시스템 위치  |
| locate  | 파일 이름      | DB 검색   |

---

# 5. 시험에서 자주 나오는 문제

### 문제 1

실행 명령어 위치 확인

정답

```bash
which
```

---

### 문제 2

명령어와 매뉴얼 위치 검색

정답

```bash
whereis
```

---

### 문제 3

파일 이름 빠르게 검색

정답

```bash
locate
```

---

### 문제 4

PATH 기반 검색

정답

```bash
which
```

---

### 문제 5

DB 기반 검색

정답

```bash
locate
```

---

# 6. 시험 함정

### 함정 1

```text
locate = 실시간 검색
```

❌ 틀림

정답

```text
DB 검색
```

---

### 함정 2

```text
which = 모든 파일 검색
```

❌ 틀림

정답

```text
실행 명령어만 검색
```

---

### 함정 3

```text
whereis = PATH만 검색
```

❌ 틀림

정답

```text
명령어 관련 파일 검색
```

---

# 7. 시험 직전 암기

핵심

```text
which   → 실행 파일
whereis → 실행 + man
locate  → DB 파일 검색
```

---

# 핵심 요약

```text
which  PATH 기반
whereis 시스템 위치
locate DB 검색
```

---

지금까지 질문하신 모든 내용을 보면 **리눅스마스터 1급 1차 시험 범위는 거의 완전히 커버된 상태입니다.**

다만 시험 대비 관점에서 마지막으로 하나만 더 보면 좋습니다.

```text
nice / renice (프로세스 우선순위)
```

이건 **시험에서 가끔 1문제 정도 출제되는 영역**입니다.
