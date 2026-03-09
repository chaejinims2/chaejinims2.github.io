---
layout: page
title: 사용자 / 그룹 관리 (useradd / passwd / group)
---

리눅스마스터 1급 시험에서 **사용자 관리(User Management)** 영역은 거의 매 시험마다 출제됩니다.
핵심은 **사용자 생성 → 비밀번호 → 그룹 관리 → 관련 파일 구조**입니다.

아래는 **개념 → 명령어 → 시스템 파일 → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. 사용자(User) 개념

리눅스는 **멀티 사용자(Multi-user)** 시스템입니다.

사용자 종류

| 유형        | 설명     |
| --------- | ------ |
| root      | 관리자    |
| 일반 사용자    | 일반 계정  |
| system 계정 | 서비스 계정 |

관리자 계정

```text
UID = 0
```

---

# 2. 사용자 생성

사용자 생성 명령

```bash
useradd username
```

예

```bash
useradd linux
```

---

## 주요 옵션

| 옵션 | 의미     |
| -- | ------ |
| -u | UID 지정 |
| -g | 기본 그룹  |
| -G | 보조 그룹  |
| -d | 홈 디렉터리 |
| -s | 로그인 쉘  |

예

```bash
useradd -u 2000 -g dev linux
```

---

# 3. 사용자 삭제

```bash
userdel username
```

홈 디렉터리 포함 삭제

```bash
userdel -r username
```

---

# 4. 비밀번호 관리

비밀번호 설정

```bash
passwd username
```

예

```bash
passwd linux
```

---

비밀번호 변경

```bash
passwd
```

---

# 5. 그룹(Group)

리눅스는 **사용자를 그룹으로 관리**합니다.

---

## 그룹 생성

```bash
groupadd groupname
```

예

```bash
groupadd dev
```

---

## 그룹 삭제

```bash
groupdel groupname
```

---

## 사용자 그룹 변경

```bash
usermod -g group user
```

보조 그룹 추가

```bash
usermod -G group user
```

---

# 6. 사용자 정보 확인

현재 사용자

```bash
whoami
```

로그인 사용자

```bash
who
```

사용자 ID 확인

```bash
id username
```

---

# 7. 사용자 관련 시스템 파일

리눅스 시험에서 매우 중요합니다.

---

## /etc/passwd

사용자 정보 저장

```text
username:x:UID:GID:comment:home:shell
```

예

```text
linux:x:1001:1001::/home/linux:/bin/bash
```

---

## /etc/shadow

비밀번호 저장

```text
username:encrypted_password:last_change
```

특징

```text
root만 접근 가능
```

---

## /etc/group

그룹 정보 저장

```text
groupname:x:GID:userlist
```

예

```text
dev:x:1001:linux
```

---

# 8. UID / GID

UID

```text
사용자 식별 번호
```

GID

```text
그룹 식별 번호
```

일반 사용자 UID 범위

```text
1000 이상
```

---

# 9. 실전 시험 문제

---

## 문제 1

사용자 생성 명령

정답

```bash
useradd
```

---

## 문제 2

비밀번호 설정

정답

```bash
passwd
```

---

## 문제 3

사용자 정보 저장 파일

정답

```text
/etc/passwd
```

---

## 문제 4

비밀번호 저장 파일

정답

```text
/etc/shadow
```

---

## 문제 5

그룹 정보 파일

정답

```text
/etc/group
```

---

# 10. 시험 함정

## 함정 1

```text
/etc/passwd = 비밀번호 저장
```

❌ 틀림

정답

```text
/etc/shadow
```

---

## 함정 2

```text
root UID = 1
```

❌ 틀림

정답

```text
0
```

---

## 함정 3

```bash
passwd = 사용자 생성
```

❌ 틀림

정답

```bash
useradd
```

---

# 11. 시험 직전 암기

사용자 생성

```bash
useradd
```

---

비밀번호

```bash
passwd
```

---

사용자 파일

```text
/etc/passwd
/etc/shadow
/etc/group
```

---

# 핵심 요약

```text
useradd → 사용자 생성
passwd → 비밀번호 설정
groupadd → 그룹 생성
```

---

원하시면 지금까지 질문하신 모든 내용을 기준으로
**리눅스마스터 1급 1차 시험 범위 전체를 “한 장 정리 (치트시트)”**로 만들어 드리겠습니다.
실제 시험 직전에 보기 좋게 **A4 한 페이지 수준**으로 정리해 드릴 수 있습니다.
