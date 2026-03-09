---
layout: page
title: 09-02 환경 변수 (PATH / export)
---

리눅스마스터 1급에서 **환경 변수(Environment Variable)** 문제는 비교적 단순하지만 **자주 출제되는 영역**입니다.
특히 다음 세 가지가 핵심입니다.

1️⃣ **PATH 의미**
2️⃣ **export 명령어**
3️⃣ **환경 변수 확인 / 설정**

아래는 **환경 변수 개념 → PATH → export → 관련 명령어 → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. 환경 변수 (Environment Variable)

환경 변수는 **셸(shell)이 사용하는 설정 값**입니다.

예

```text
PATH
HOME
USER
SHELL
```

확인 명령

```bash
env
```

또는

```bash
printenv
```

---

# 2. PATH

`PATH`는 **명령어 실행 시 검색할 디렉터리 목록**입니다.

예

```bash
echo $PATH
```

출력 예

```text
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

구조

```text
디렉터리1:디렉터리2:디렉터리3
```

구분자는

```text
:
```

입니다.

---

# PATH 동작 방식

예

```bash
ls
```

셸은 다음 순서로 찾습니다.

```text
1 /usr/local/bin
2 /usr/bin
3 /bin
...
```

---

# PATH 추가

예

```bash
PATH=$PATH:/home/user/bin
```

의미

```text
기존 PATH + 새로운 디렉터리 추가
```

---

# 3. export

`export`는 **셸 변수를 환경 변수로 설정**합니다.

구조

```bash
export 변수=값
```

예

```bash
export PATH=$PATH:/home/user/bin
```

---

# export 필요 이유

쉘 변수

```bash
VAR=test
```

이 경우

```text
현재 shell만 사용 가능
```

---

export 사용

```bash
export VAR=test
```

이 경우

```text
하위 프로세스에서도 사용 가능
```

---

# 4. 환경 변수 확인

| 명령어       | 의미       |
| --------- | -------- |
| env       | 환경 변수 출력 |
| printenv  | 환경 변수 출력 |
| set       | 모든 변수 출력 |
| echo $VAR | 변수 출력    |

---

예

```bash
echo $HOME
```

---

# 5. 주요 환경 변수

| 변수    | 의미        |
| ----- | --------- |
| HOME  | 홈 디렉터리    |
| PATH  | 명령어 검색 경로 |
| USER  | 사용자 이름    |
| SHELL | 로그인 쉘     |
| PWD   | 현재 디렉터리   |

---

# 6. 환경 변수 설정 파일

사용자 환경 설정

```text
~/.bashrc
~/.bash_profile
```

시스템 환경

```text
/etc/profile
```

---

# 7. 실전 시험 문제

---

## 문제 1

다음 중 PATH 의미

정답

```text
명령어 검색 경로
```

---

## 문제 2

다음 명령어 의미

```bash
echo $PATH
```

정답

```text
PATH 변수 출력
```

---

## 문제 3

다음 명령어 의미

```bash
export VAR=test
```

정답

```text
환경 변수 설정
```

---

## 문제 4

다음 중 환경 변수 출력 명령

정답

```bash
env
```

또는

```bash
printenv
```

---

## 문제 5

다음 중 PATH 추가 방법

정답

```bash
PATH=$PATH:/dir
```

---

# 8. 시험 함정

## 함정 1

```text
PATH = 파일 경로
```

❌ 틀림

정답

```text
명령어 검색 경로
```

---

## 함정 2

```bash
export = 변수 출력
```

❌ 틀림

정답

```text
환경 변수 설정
```

---

## 함정 3

PATH 구분자

```text
,
```

❌ 틀림

정답

```text
:
```

---

# 9. 시험 직전 암기

환경 변수 확인

```bash
env
printenv
```

---

PATH

```text
명령어 검색 경로
```

---

export

```text
환경 변수 설정
```

---

# 핵심 요약

```text
PATH = 명령어 검색 경로
export = 환경 변수 설정
```

---

만약 원하시면, 지금까지 정리한 내용을 바탕으로
**리눅스마스터 1급 1차 시험 대비 "실제 시험 난이도 모의고사 30문제"**도 만들어 드릴 수 있습니다.
실제 기출 패턴과 거의 동일한 형태로 구성해 드리겠습니다.
