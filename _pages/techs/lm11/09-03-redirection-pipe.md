---
layout: page
title: 입출력 제어 (리다이렉션 / 파이프)
---

리눅스마스터 1급에서 **리다이렉션(redirection)과 파이프(pipe)**는 기본 쉘 기능 문제로 자주 출제됩니다.
핵심은 **표준 입출력 구조 이해 → 기호 의미 → 명령 조합 해석**입니다.

아래는 **개념 → 기호 → 예제 → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. 표준 입출력 (Standard I/O)

리눅스 프로그램은 기본적으로 3개의 입출력 채널을 사용합니다.

| 번호 | 이름     | 의미    |
| -- | ------ | ----- |
| 0  | stdin  | 표준 입력 |
| 1  | stdout | 표준 출력 |
| 2  | stderr | 표준 에러 |

예

```bash
ls
```

출력은 기본적으로

```text
stdout (1)
```

으로 나옵니다.

---

# 2. 리다이렉션 (Redirection)

리다이렉션은 **입출력 방향을 변경하는 기능**입니다.

---

# 출력 리다이렉션

## `>`

파일로 출력

```bash
ls > file.txt
```

의미

```text
stdout → file.txt
```

기존 파일

```text
덮어쓰기
```

---

## `>>`

추가 출력

```bash
ls >> file.txt
```

의미

```text
stdout → file.txt (append)
```

기존 내용 유지

---

# 입력 리다이렉션

## `<`

파일을 입력으로 사용

```bash
wc < file.txt
```

---

# 오류 리다이렉션

stderr 리다이렉션

```bash
2> error.txt
```

예

```bash
ls /test 2> error.log
```

---

# stdout + stderr

```bash
command > file 2>&1
```

의미

```text
stdout + stderr → file
```

---

# `/dev/null`

출력을 버림

```bash
command > /dev/null
```

또는

```bash
command 2> /dev/null
```

---

# 3. 파이프 (Pipe)

파이프는 **한 명령어의 출력 → 다른 명령어의 입력**으로 연결합니다.

기호

```text
|
```

---

## 기본 구조

```bash
command1 | command2
```

의미

```text
command1 output → command2 input
```

---

# 예

```bash
ls | wc -l
```

의미

```text
파일 개수 계산
```

---

```bash
ps -ef | grep ssh
```

의미

```text
ssh 프로세스 검색
```

---

# 4. 파이프 + 리다이렉션

예

```bash
ps -ef | grep ssh > result.txt
```

의미

```text
ssh 프로세스 결과 파일 저장
```

---

# 5. 실전 시험 문제

---

# 문제 1

다음 명령어 의미

```bash
ls > file.txt
```

정답

```text
ls 출력 file.txt 저장
```

---

# 문제 2

다음 명령어 의미

```bash
ls >> file.txt
```

정답

```text
file.txt에 출력 추가
```

---

# 문제 3

다음 명령어 의미

```bash
cat file | grep linux
```

정답

```text
file에서 linux 검색
```

---

# 문제 4

다음 명령어 의미

```bash
ps -ef | grep ssh
```

정답

```text
ssh 프로세스 검색
```

---

# 문제 5

다음 명령어 의미

```bash
ls /test 2> error.log
```

정답

```text
에러 출력 파일 저장
```

---

# 6. 시험 함정

## 함정 1

```text
> = append
```

❌ 틀림

정답

```text
덮어쓰기
```

---

## 함정 2

```text
>> = overwrite
```

❌ 틀림

정답

```text
append
```

---

## 함정 3

```text
| = 파일 저장
```

❌ 틀림

정답

```text
명령어 연결
```

---

# 7. 시험 직전 암기

리다이렉션

```text
>  출력 저장
>> 출력 추가
<  입력
2> 에러
```

---

파이프

```text
|
```

의미

```text
명령어 출력 → 다음 명령어 입력
```

---

# 핵심 요약

```text
>  overwrite
>> append
|  command chain
```

---

원하시면 지금까지 정리한 내용을 기반으로
**리눅스마스터 1급 1차 시험 대비 "기출 패턴 모의고사 30문제"**도 만들어 드릴 수 있습니다.
실제 시험 난이도에 맞춰 구성해 드리겠습니다.
