---
layout: page
title: 03-03 파일 출력 (cat / head / tail)
---

리눅스마스터 1급 시험에서 **파일 내용 확인 명령어**는 다음 세 가지가 핵심입니다.

```text
cat
head
tail
```

시험에서는 보통

1️⃣ 명령어 역할
2️⃣ 옵션 의미
3️⃣ 출력 위치 차이

를 묻습니다.

---

# 1. `cat`

`cat`은 **파일 내용을 전체 출력**하는 명령어입니다.

기본 사용

```bash
cat file.txt
```

출력

```text
파일의 모든 내용
```

---

## 여러 파일 출력

```bash
cat file1 file2
```

두 파일 내용이 **연속으로 출력**됩니다.

---

## 파일 생성

```bash
cat > file.txt
```

입력 내용이 파일로 저장됩니다.

종료

```text
Ctrl + D
```

---

# 2. `head`

`head`는 **파일의 앞부분**을 출력합니다.

기본

```bash
head file.txt
```

기본 출력

```text
앞 10줄
```

---

## 줄 수 지정

```bash
head -n 5 file.txt
```

출력

```text
앞 5줄
```

---

# 3. `tail`

`tail`은 **파일의 끝부분**을 출력합니다.

기본

```bash
tail file.txt
```

출력

```text
마지막 10줄
```

---

## 줄 수 지정

```bash
tail -n 5 file.txt
```

출력

```text
마지막 5줄
```

---

## 로그 확인 (매우 중요)

실시간 로그 확인

```bash
tail -f file.log
```

로그 파일에서 매우 많이 사용됩니다.

예

```bash
tail -f /var/log/messages
```

---

# 4. 명령어 비교

| 명령어  | 기능     |
| ---- | ------ |
| cat  | 전체 출력  |
| head | 앞부분 출력 |
| tail | 끝부분 출력 |

---

# 5. 시험에서 자주 나오는 문제

### 문제 1

파일의 앞 10줄 출력

정답

```bash
head file.txt
```

---

### 문제 2

파일의 마지막 10줄 출력

정답

```bash
tail file.txt
```

---

### 문제 3

파일 전체 출력

정답

```bash
cat file.txt
```

---

### 문제 4

로그 실시간 확인

정답

```bash
tail -f
```

---

# 6. 시험 함정

### 함정 1

```text
head = 마지막 출력
```

❌ 틀림

---

### 함정 2

```text
tail = 처음 출력
```

❌ 틀림

---

### 함정 3

```text
cat = 앞 10줄
```

❌ 틀림

---

# 7. 시험 직전 암기

핵심

```text
cat  전체 출력
head 앞부분
tail 뒷부분
```

---

대표 옵션

```bash
head -n
tail -n
tail -f
```

---

# 핵심 요약

```text
head = first
tail = last
cat = all
```

---

지금까지 질문 흐름을 보면 **리눅스마스터 1급 1차 시험 범위를 거의 완전히 커버했습니다.**

다만 시험에서 **의외로 자주 나오는 마지막 유형 하나**가 남아 있습니다.

```text
which / whereis / locate
```

이 세 개는 **거의 항상 비교 문제로 출제**됩니다.
원하시면 이걸 **시험 기준으로 아주 명확하게 정리**해 드리겠습니다.
