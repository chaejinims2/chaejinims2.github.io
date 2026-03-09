---
layout: page
title: 디렉터리 구조 (FHS)
---

리눅스마스터 1급에서 **디렉터리 구조(FHS)** 문제는 거의 항상 출제되는 기본 영역입니다.
핵심은 **각 디렉터리의 역할을 구분하는 것**입니다.

여기서 기준이 되는 표준은 **FHS(Filesystem Hierarchy Standard)**입니다.

---

# 1. FHS (Filesystem Hierarchy Standard)

FHS는 **리눅스 파일 시스템 구조를 표준화한 규칙**입니다.

목적

```text
시스템 관리 일관성
프로그램 호환성
파일 위치 표준화
```

---

# 2. 리눅스 디렉터리 구조

루트 디렉터리에서 모든 디렉터리가 시작됩니다.

```text
/
```

---

# 주요 디렉터리

| 디렉터리  | 줄임말(풀네임) | 역할          |
| ----- | -------------- | ----------- |
| /bin  | **bin**ary     | 기본 명령어      |
| /sbin | **s**ystem **bin**ary | 시스템 관리 명령   |
| /etc  | **etc**etera (기타→설정) | 설정 파일       |
| /home | **home**       | 사용자 홈       |
| /root | **root** (슈퍼유저) | root 홈      |
| /usr  | **U**nix **S**ystem **R**esources | 사용자 프로그램    |
| /var  | **var**iable   | 로그 / 가변 데이터 |
| /tmp  | **t**e**mp**orary | 임시 파일       |
| /dev  | **dev**ice     | 장치 파일       |
| /proc | **proc**ess    | 프로세스 정보     |
| /boot | **boot**       | 부팅 파일       |
| /lib  | **lib**rary    | 라이브러리       |

---

# 3. 주요 디렉터리 상세

---

## /bin

기본 명령어 저장

예

```text
ls
cp
mv
cat
```

특징

```text
single user mode에서도 사용
```

---

## /sbin

시스템 관리 명령어

예

```text
fsck
reboot
ifconfig
```

관리자용 명령어입니다.

---

## /etc

시스템 설정 파일

예

```text
/etc/passwd
/etc/shadow
/etc/fstab
```

---

## /home

일반 사용자 홈 디렉터리

예

```text
/home/user1
/home/user2
```

---

## /root

관리자 계정 홈

```text
/root
```

---

## /usr

사용자 프로그램 저장

예

```text
/usr/bin
/usr/sbin
/usr/lib
```

설명

```text
대부분 프로그램 위치
```

---

## /var

변경되는 데이터

예

```text
/var/log
/var/spool
/var/mail
```

특징

```text
로그 저장
```

---

## /tmp

임시 파일 저장

특징

```text
재부팅 시 삭제
```

---

## /dev

장치 파일

예

```text
/dev/sda
/dev/tty
```

---

## /proc

프로세스 정보

예

```text
/proc/cpuinfo
/proc/meminfo
```

특징

```text
가상 파일 시스템
```

---

## /boot

부팅 관련 파일

예

```text
vmlinuz
initramfs
grub
```

---

## /lib

라이브러리 파일

예

```text
shared libraries
kernel modules
```

---

# 4. 시험에서 자주 묻는 매칭

| 질문    | 정답       |
| ----- | -------- |
| 사용자 홈 | /home    |
| 관리자 홈 | /root    |
| 로그 저장 | /var/log |
| 설정 파일 | /etc     |
| 장치 파일 | /dev     |
| 부팅 파일 | /boot    |

---

# 5. 실전 시험 문제

---

## 문제 1

설정 파일 저장 위치

정답

```text
/etc
```

---

## 문제 2

로그 파일 저장

정답

```text
/var/log
```

---

## 문제 3

장치 파일 위치

정답

```text
/dev
```

---

## 문제 4

사용자 홈

정답

```text
/home
```

---

## 문제 5

부팅 파일 저장

정답

```text
/boot
```

---

# 6. 시험 함정

### 함정 1

```text
설정 파일 → /usr
```

❌ 틀림

정답

```text
/etc
```

---

### 함정 2

```text
로그 → /tmp
```

❌ 틀림

정답

```text
/var/log
```

---

### 함정 3

```text
사용자 홈 → /usr/home
```

❌ 틀림

정답

```text
/home
```

---

# 7. 시험 직전 암기

핵심 디렉터리

```text
/bin
/etc
/home
/root
/usr
/var
/dev
/proc
/tmp
/boot
/lib
```

---

# 핵심 요약

```text
/etc  설정
/home 사용자
/var  로그
/dev  장치
/boot 부팅
```

---

원하시면 지금까지 질문하신 모든 영역을 기반으로
**리눅스마스터 1급 1차 시험 “기출 출제율 TOP 30 명령어 + 개념 한 장 정리”**를 만들어 드리겠습니다.
시험 직전에 보면 **전체 범위가 머릿속에 바로 정리되는 요약**입니다.
