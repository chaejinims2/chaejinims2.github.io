---
layout: page
title: 07-02 서비스 관리 (systemctl)
---

리눅스마스터 1급에서 **서비스 관리(Service Management)** 문제는 대부분 **`systemctl` 명령어** 중심으로 출제됩니다.
이는 현대 리눅스에서 사용하는 **systemd 기반 서비스 관리 도구**입니다.

관련 시스템:

* systemd

---

# 1. systemctl 개념

`systemctl`은 **서비스(service) 및 시스템 상태를 관리하는 명령어**입니다.

기능

```text
서비스 시작 / 종료
부팅 자동 실행 설정
서비스 상태 확인
```

---

# 2. 서비스 상태 확인

서비스 상태 확인

```bash
systemctl status 서비스명
```

예

```bash
systemctl status sshd
```

출력 정보

```text
서비스 실행 상태
PID
로그 정보
```

---

# 3. 서비스 시작 / 종료

서비스 시작

```bash
systemctl start 서비스명
```

예

```bash
systemctl start httpd
```

---

서비스 종료

```bash
systemctl stop 서비스명
```

---

서비스 재시작

```bash
systemctl restart 서비스명
```

---

# 4. 부팅 시 자동 실행

자동 실행 설정

```bash
systemctl enable 서비스명
```

예

```bash
systemctl enable httpd
```

---

자동 실행 해제

```bash
systemctl disable 서비스명
```

---

# 5. 서비스 목록 확인

실행 중 서비스

```bash
systemctl list-units
```

전체 서비스

```bash
systemctl list-unit-files
```

---

# 6. runlevel → systemd target

옛날 시스템

```text
runlevel
```

현재

```text
systemd target
```

예

| runlevel | target            |
| -------- | ----------------- |
| 0        | poweroff.target   |
| 1        | rescue.target     |
| 3        | multi-user.target |
| 5        | graphical.target  |
| 6        | reboot.target     |

---

# 7. 기본 target 확인

현재 target

```bash
systemctl get-default
```

---

기본 target 변경

```bash
systemctl set-default multi-user.target
```

---

# 8. 실전 시험 문제

### 문제 1

서비스 상태 확인

정답

```bash
systemctl status
```

---

### 문제 2

서비스 시작

정답

```bash
systemctl start
```

---

### 문제 3

부팅 시 자동 실행

정답

```bash
systemctl enable
```

---

### 문제 4

자동 실행 해제

정답

```bash
systemctl disable
```

---

### 문제 5

서비스 재시작

정답

```bash
systemctl restart
```

---

# 9. 시험 함정

### 함정 1

```text
systemctl enable = 서비스 시작
```

❌ 틀림

정답

```text
부팅 시 자동 실행 설정
```

---

### 함정 2

```text
systemctl start = 부팅 자동 실행
```

❌ 틀림

정답

```text
즉시 실행
```

---

### 함정 3

```text
runlevel = systemctl
```

❌ 틀림

정답

```text
runlevel → systemd target으로 대체
```

---

# 10. 시험 직전 암기

서비스 관리

```bash
systemctl start
systemctl stop
systemctl restart
systemctl status
```

---

자동 실행

```bash
systemctl enable
systemctl disable
```

---

# 핵심 요약

```text
start   → 서비스 실행
stop    → 서비스 종료
enable  → 부팅 자동 실행
status  → 상태 확인
```

---

지금까지 질문 흐름을 보면 **리눅스마스터 1급 1차 시험 범위를 사실상 완전히 커버했습니다.**

다만 시험 준비 관점에서 하나만 더 보면 좋습니다.

```text
runlevel / systemd target 문제
```

이건 **시험에서 꽤 자주 나오는 유형**입니다.
