---
layout: page
title: 부팅 관리 (runlevel / systemd target / init)
---

리눅스마스터 1급에서 **부팅 과정 + runlevel + init/systemd** 문제는 매우 자주 출제됩니다.
특히 시험에서는 다음을 묻습니다.

1️⃣ **리눅스 부팅 순서**
2️⃣ **runlevel 의미**
3️⃣ **init vs systemd 차이**
4️⃣ **systemctl 명령어**

아래는 **부팅 과정 → runlevel → init → systemd → 실전 문제 → 시험 함정** 순서로 정리합니다.

---

# 1. 리눅스 부팅 과정

리눅스 시스템이 켜질 때 실행되는 순서입니다.

```text
BIOS / UEFI
      ↓
Boot Loader
      ↓
Kernel
      ↓
init (PID 1)
      ↓
서비스 실행
```

각 단계 역할

| 단계           | 역할       |
| ------------ | -------- |
| BIOS/UEFI    | 하드웨어 초기화 |
| Boot Loader  | 커널 로드    |
| Kernel       | OS 핵심    |
| init/systemd | 서비스 시작   |

---

# 2. Boot Loader

대표적인 부트로더

* GRUB
* LILO (과거)

GRUB 역할

```text
커널 선택
커널 로드
init 실행
```

설정 파일

```text
/boot/grub/grub.cfg
```

---

# 3. Kernel 단계

커널이 로드되면

```text
init 프로세스 실행
```

init 특징

```text
PID = 1
```

시험에서 자주 나옵니다.

---

# 4. init

전통적인 초기화 시스템입니다.

대표

```text
SysV init
```

설정 파일

```text
/etc/inittab
```

---

# 5. runlevel

runlevel은 **시스템 실행 상태**를 의미합니다.

| runlevel | 의미           |
| -------- | ------------ |
| 0        | 시스템 종료       |
| 1        | 단일 사용자 모드    |
| 2        | 멀티 사용자       |
| 3        | 멀티 사용자 (텍스트) |
| 4        | 사용자 정의       |
| 5        | GUI          |
| 6        | 재부팅          |

시험에서 가장 많이 묻는 것

```text
0 = shutdown
1 = single user
3 = multi-user
5 = GUI
6 = reboot
```

---

# runlevel 확인

```bash
runlevel
```

또는

```bash
who -r
```

---

# runlevel 변경

```bash
init 3
```

또는

```bash
telinit 3
```

---

# 6. systemd

최근 Linux는 대부분 **systemd** 사용합니다.

대표 명령어

```bash
systemctl
```

---

systemd 특징

```text
병렬 서비스 실행
빠른 부팅
service → unit 개념
```

---

# systemd 구성 요소

| unit    | 의미          |
| ------- | ----------- |
| service | 서비스         |
| target  | runlevel 대체 |
| mount   | 마운트         |
| socket  | 소켓          |

---

# runlevel → systemd target

| runlevel | target            |
| -------- | ----------------- |
| 0        | poweroff.target   |
| 1        | rescue.target     |
| 3        | multi-user.target |
| 5        | graphical.target  |
| 6        | reboot.target     |

시험에서 자주 나옵니다.

---

# 7. systemctl 명령어

서비스 상태 확인

```bash
systemctl status sshd
```

---

서비스 시작

```bash
systemctl start sshd
```

---

서비스 중지

```bash
systemctl stop sshd
```

---

자동 실행

```bash
systemctl enable sshd
```

---

비활성화

```bash
systemctl disable sshd
```

---

# 8. 실전 시험 문제

---

## 문제 1

리눅스 부팅 과정 순서

정답

```text
BIOS → Boot Loader → Kernel → init
```

---

## 문제 2

init 프로세스 PID

정답

```text
1
```

---

## 문제 3

다음 runlevel 의미

```text
runlevel 1
```

정답

```text
single user mode
```

---

## 문제 4

다음 runlevel 의미

```text
runlevel 6
```

정답

```text
reboot
```

---

## 문제 5

다음 systemd target 의미

```text
multi-user.target
```

정답

```text
runlevel 3
```

---

# 9. 시험 함정

## 함정 1

```text
init PID = 0
```

❌ 틀림

정답

```text
PID = 1
```

---

## 함정 2

```text
runlevel 6 = shutdown
```

❌ 틀림

정답

```text
reboot
```

---

## 함정 3

```text
systemd = runlevel 사용
```

❌ 틀림

정답

```text
target 사용
```

---

# 10. 시험 직전 암기

부팅 순서

```text
BIOS
Boot Loader
Kernel
init
```

---

runlevel

```text
0 shutdown
1 single user
3 multi-user
5 GUI
6 reboot
```

---

systemd

```text
systemctl
target
```

---

# 핵심 요약

```text
init PID = 1
runlevel = 시스템 실행 상태
systemd = init 대체
```

---

원하시면 마지막으로 **리눅스마스터 1급에서 반드시 나오는 마지막 영역**

* **cron / at 스케줄 문제**
* **환경변수 문제 (PATH / export)**
* **쉘 리다이렉션 / 파이프 문제**

까지 **시험 대비 최종 정리**를 만들어 드리겠습니다.
리눅스마스터 1급에서 **runlevel ↔ systemd target 매핑** 문제는 꽤 자주 출제됩니다.
핵심은 **전통적인 SysV init의 runlevel 개념이 systemd에서는 target으로 대체**되었다는 점입니다.

관련 시스템:

* systemd

---

# 1. runlevel 개념 (SysV init)

runlevel은 **시스템의 운영 상태(level)** 를 의미합니다.

범위

```text
0 ~ 6
```

각 숫자는 **시스템 동작 모드**를 나타냅니다.

| Runlevel | 의미               |
| -------- | ---------------- |
| 0        | 시스템 종료           |
| 1        | 단일 사용자 모드        |
| 2        | 다중 사용자 (네트워크 없음) |
| 3        | 다중 사용자 (CLI)     |
| 4        | 사용자 정의           |
| 5        | GUI 모드           |
| 6        | 재부팅              |

시험에서 가장 중요한 것은 **0,1,3,5,6** 입니다.

---

# 2. systemd target 개념

systemd에서는 runlevel 대신 **target**을 사용합니다.

target은 **서비스 그룹(상태)** 을 의미합니다.

예

```text
multi-user.target
graphical.target
```

---

# 3. runlevel ↔ target 매핑

시험에서 가장 자주 묻는 표입니다.

| Runlevel | systemd Target    |
| -------- | ----------------- |
| 0        | poweroff.target   |
| 1        | rescue.target     |
| 2        | multi-user.target |
| 3        | multi-user.target |
| 4        | multi-user.target |
| 5        | graphical.target  |
| 6        | reboot.target     |

특히 시험에서 많이 묻는 것:

```text
3 → multi-user.target
5 → graphical.target
```

---

# 4. runlevel 확인

현재 runlevel 확인

```bash
runlevel
```

출력 예

```text
N 3
```

의미

```text
현재 runlevel 3
```

---

# 5. systemd target 확인

현재 기본 target

```bash
systemctl get-default
```

예

```text
graphical.target
```

---

# 6. target 변경

CLI 모드

```bash
systemctl set-default multi-user.target
```

GUI 모드

```bash
systemctl set-default graphical.target
```

---

# 7. 즉시 target 변경

예

```bash
systemctl isolate multi-user.target
```

즉시 runlevel 변경과 유사합니다.

---

# 8. 실전 시험 문제

### 문제 1

runlevel 3 의미

정답

```text
multi-user CLI
```

---

### 문제 2

runlevel 5 의미

정답

```text
GUI 모드
```

---

### 문제 3

runlevel 6 의미

정답

```text
reboot
```

---

### 문제 4

runlevel 0 의미

정답

```text
shutdown
```

---

### 문제 5

runlevel 3의 systemd target

정답

```text
multi-user.target
```

---

# 9. 시험 함정

### 함정 1

```text
runlevel 1 = reboot
```

❌ 틀림

정답

```text
single user mode
```

---

### 함정 2

```text
runlevel 5 = multi-user
```

❌ 틀림

정답

```text
GUI
```

---

### 함정 3

```text
runlevel 3 = shutdown
```

❌ 틀림

정답

```text
multi-user CLI
```

---

# 10. 시험 직전 암기

가장 중요한 것

```text
0 shutdown
1 single user
3 multi-user CLI
5 graphical
6 reboot
```

systemd 매핑

```text
3 → multi-user.target
5 → graphical.target
```

---

# 핵심 요약

```text
runlevel 3 = CLI
runlevel 5 = GUI
```

---

지금까지 질문한 모든 내용을 보면
**리눅스마스터 1급 1차 시험 범위는 사실상 100% 정리된 상태입니다.**

원하시면 마지막으로 제가 **시험 출제 패턴 기준으로**

👉 **리눅스마스터 1급 1차 “기출 명령어 TOP 40”**
👉 **시험 직전 10분 압축 치트시트**

를 만들어 드리겠습니다.
이건 실제로 **합격자들이 마지막에 보는 정리**입니다.
