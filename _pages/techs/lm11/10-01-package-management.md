---
layout: page
title: 10-01 패키지 관리 (rpm / yum / apt)
---

리눅스마스터 1급에서 **패키지 관리(package management)** 문제는 보통 다음을 묻습니다.

1️⃣ **패키지 개념**
2️⃣ **패키지 형식 (.rpm / .deb)**
3️⃣ **패키지 관리 명령어**
4️⃣ **배포판 계열별 패키지 도구**

아래는 **개념 → 배포판 계열 → 주요 명령어 → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. 패키지 (Package)

패키지는 **소프트웨어 설치 단위**입니다.

구성

```text
프로그램 파일
설정 파일
라이브러리
문서
```

즉 하나의 프로그램을 **설치/업데이트/삭제**할 수 있도록 묶어 둔 형태입니다.

---

# 2. 배포판 계열과 패키지 형식

리눅스 시험에서 매우 중요합니다.

## RedHat 계열

대표 배포판

* Red Hat Enterprise Linux
* CentOS
* Fedora

패키지 형식

```text
.rpm
```

사용 명령어

* RPM Package Manager
* YUM
* DNF

---

## Debian 계열

대표 배포판

* Debian
* Ubuntu

패키지 형식

```text
.deb
```

사용 명령어

* dpkg
* APT

---

# 3. RPM 명령어

RPM은 **패키지 파일 직접 관리** 도구입니다.

## 설치

```bash
rpm -ivh package.rpm
```

옵션 의미

| 옵션 | 의미       |
| -- | -------- |
| i  | install  |
| v  | verbose  |
| h  | progress |

---

## 업그레이드

```bash
rpm -Uvh package.rpm
```

---

## 삭제

```bash
rpm -e package
```

---

## 패키지 확인

```bash
rpm -qa
```

설치 여부

```bash
rpm -q package
```

---

# 4. YUM / DNF

YUM은 **의존성 자동 해결 패키지 관리자**입니다.

설치

```bash
yum install httpd
```

삭제

```bash
yum remove httpd
```

업데이트

```bash
yum update
```

검색

```bash
yum search httpd
```

최근 RedHat 계열은 **DNF** 사용합니다.

---

# 5. dpkg

Debian 계열 패키지 관리

설치

```bash
dpkg -i package.deb
```

삭제

```bash
dpkg -r package
```

설치 목록

```bash
dpkg -l
```

---

# 6. apt

APT는 Debian 계열 **의존성 관리 패키지 관리자**

설치

```bash
apt install nginx
```

삭제

```bash
apt remove nginx
```

패키지 목록 업데이트

```bash
apt update
```

업그레이드

```bash
apt upgrade
```

---

# 7. 실전 시험 문제

## 문제 1

다음 중 RPM 패키지 확장자

정답

```text
.rpm
```

---

## 문제 2

다음 명령어 의미

```bash
rpm -ivh package.rpm
```

정답

```text
패키지 설치
```

---

## 문제 3

다음 중 Debian 패키지 관리자

정답

```text
dpkg
```

---

## 문제 4

다음 중 의존성 자동 해결

정답

```text
yum
apt
```

---

## 문제 5

다음 명령어 의미

```bash
rpm -qa
```

정답

```text
설치된 패키지 목록 출력
```

---

# 8. 시험 함정

## 함정 1

```text
rpm = 의존성 해결
```

❌ 틀림

정답

```text
yum / apt
```

---

## 함정 2

```text
.deb = RedHat
```

❌ 틀림

정답

```text
Debian
```

---

## 함정 3

```text
apt = rpm 패키지
```

❌ 틀림

정답

```text
deb 패키지
```

---

# 9. 시험 직전 암기

패키지 형식

```text
rpm = RedHat
deb = Debian
```

---

패키지 명령

```text
rpm
yum
dnf
dpkg
apt
```

---

# 핵심 요약

```text
RedHat → rpm / yum
Debian → deb / apt
```

---

원하시면 **리눅스마스터 1급에서 패키지 다음으로 많이 나오는**

* **사용자 관리 (useradd / passwd / group)**
* **로그 관리 (/var/log)**
* **디렉터리 구조 (FHS)**

도 시험 대비용으로 정리해 드리겠습니다.
