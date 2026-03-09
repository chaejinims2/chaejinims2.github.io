---
layout: page
title: 파일 검색 (grep / find)
---

리눅스마스터 1급에서 **`grep` / `find`** 문제는 매우 자주 출제됩니다.
특히 다음 네 가지 유형이 핵심입니다.

1️⃣ **명령어 의미 해석**
2️⃣ **옵션 기능**
3️⃣ **출력 결과 추론**
4️⃣ **명령어 조합 (grep + find)**

아래는 **개념 → 주요 옵션 → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. grep

## 기본 개념

`grep`은 **파일에서 특정 문자열을 검색하는 명령어**입니다.

구조

```bash
grep [옵션] 패턴 파일
```

예

```bash
grep root /etc/passwd
```

→ `/etc/passwd`에서 **root 문자열 검색**

---

# 2. grep 주요 옵션

| 옵션 | 의미         |
| -- | ---------- |
| -i | 대소문자 무시    |
| -v | 패턴 제외      |
| -n | 줄 번호 표시    |
| -r | 하위 디렉터리 검색 |
| -w | 단어 단위 검색   |
| -c | 매칭 개수      |

---

# 예

```bash
grep -i linux file.txt
```

→ Linux / linux / LINUX 모두 검색

---

```bash
grep -v root file.txt
```

→ root 포함 라인 제외

---

```bash
grep -n error log.txt
```

→ 줄 번호 출력

---

# 3. grep 실전 문제

## 문제 1

다음 명령어 의미

```bash
grep -v root file
```

### 정답

root 문자열 **포함되지 않은 행 출력**

---

## 문제 2

다음 명령어 의미

```bash
grep -i linux file
```

### 정답

대소문자 구분 없이 linux 검색

---

## 문제 3

다음 명령어 의미

```bash
grep -c error log.txt
```

### 정답

error 포함 라인 개수 출력

---

# 4. find

## 기본 개념

`find`는 **파일을 조건으로 검색하는 명령어**

구조

```bash
find 경로 조건
```

예

```bash
find /home -name file.txt
```

---

# 5. find 주요 옵션

| 옵션     | 의미    |
| ------ | ----- |
| -name  | 파일 이름 |
| -type  | 파일 타입 |
| -size  | 파일 크기 |
| -user  | 소유자   |
| -perm  | 권한    |
| -mtime | 수정 시간 |
| -exec  | 명령 실행 |

---

# 예

## 이름 검색

```bash
find /home -name "*.txt"
```

---

## 파일 타입

```bash
find /home -type f
```

타입

| 값 | 의미        |
| - | --------- |
| f | file      |
| d | directory |
| l | link      |

---

## 크기 검색

```bash
find / -size +100M
```

의미

```text
100MB 이상 파일
```

---

## 권한 검색

```bash
find / -perm 755
```

---

# 6. exec 옵션

파일 발견 후 명령 실행

예

```bash
find /home -name "*.log" -exec rm {} \;
```

의미

```text
log 파일 삭제
```

구조

```bash
-exec command {} \;
```

---

# 7. grep + find 조합

시험에서 가끔 나옵니다.

예

```bash
find /etc -name "*.conf" | grep http
```

의미

```text
http 포함 conf 파일
```

---

또는

```bash
find / -name "*.log" -exec grep error {} \;
```

의미

```text
log 파일에서 error 검색
```

---

# 8. find 시간 옵션

| 옵션     | 의미    |
| ------ | ----- |
| -mtime | 수정 시간 |
| -atime | 접근 시간 |
| -ctime | 상태 변경 |

예

```bash
find /home -mtime -3
```

의미

```text
3일 이내 수정 파일
```

---

# 9. 시험 문제 패턴

## 문제 1

다음 명령어 의미

```bash
find /home -type d
```

정답

```text
디렉터리 검색
```

---

## 문제 2

다음 명령어 의미

```bash
find / -size +10M
```

정답

```text
10MB 이상 파일
```

---

## 문제 3

다음 명령어 의미

```bash
grep -r error /var/log
```

정답

```text
하위 디렉터리 포함 error 검색
```

---

# 10. 시험 함정

## 함정 1

```bash
grep -v
```

의미

```text
패턴 제외
```

많이 헷갈립니다.

---

## 함정 2

```bash
find -name
```

대소문자 구분

---

대소문자 무시

```bash
find -iname
```

---

## 함정 3

```bash
find -type d
```

디렉터리

```bash
find -type f
```

파일

---

# 11. 시험 직전 암기

grep 핵심

```text
-i 대소문자 무시
-v 제외
-n 줄번호
-c 개수
-r 하위 검색
```

---

find 핵심

```text
-name 이름
-type 타입
-size 크기
-user 사용자
-perm 권한
-exec 실행
```

---

# 12. 시험에서 가장 많이 나오는 명령어

리눅스마스터 기준 TOP 5

```text
grep
find
chmod
ps
kill
```

---

# 핵심 요약

```text
grep = 문자열 검색
find = 파일 검색
```

---

원하시면 다음 단계로
**리눅스마스터 1급 시험에서 가장 많이 틀리는**

* **ps / kill / top 문제**
* **네트워크 명령어 문제 (netstat / ss / ping)**
* **압축 명령어 문제 (tar / gzip)**

도 **시험 대비용으로 정리**해 드리겠습니다.
