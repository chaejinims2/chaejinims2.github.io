파일 / 디렉터리

ls
cp
mv
rm
mkdir
rmdir
touch

핵심 옵션

-r  recursive
-f  force
-i  interactive


⸻

파일 내용 확인

cat
head
tail

핵심

head = 앞
tail = 뒤
tail -f = 로그


⸻

검색

grep
find

예

grep pattern file
find / -name file


⸻

위치 검색

which
whereis
locate

핵심

which  → PATH 기반 실행 파일
whereis → 실행 + man
locate → DB 검색


⸻

2️⃣ 디스크 / 파일 시스템

디스크 사용량

df -h
du -sh

핵심

df = 파일 시스템
du = 디렉터리 용량


⸻

파일 시스템

inode = 파일 메타데이터
journal = 빠른 복구
ext4 = 대표 FS


⸻

3️⃣ 링크

명령

ln file1 file2
ln -s file1 link

핵심

유형	특징
Hard	inode 동일
Symbolic	경로 링크


⸻

4️⃣ 권한

권한 구조

r = 4
w = 2
x = 1

예

755


⸻

특수 권한

권한	의미
SUID	실행 시 owner 권한
SGID	그룹 권한 유지
Sticky	삭제 제한


⸻

5️⃣ 프로세스

확인

ps
top

종료

kill PID
kill -9 PID

시그널

SIGTERM = 15
SIGKILL = 9
SIGSTOP
SIGCONT


⸻

6️⃣ 네트워크

확인

ping
ip addr
netstat -tuln
ss -tuln

핵심 파일

/etc/hosts
/etc/resolv.conf


⸻

7️⃣ 패키지

RedHat

rpm
yum
dnf

Debian

dpkg
apt

핵심

rpm → 패키지 관리
yum/apt → 의존성 해결


⸻

8️⃣ 사용자 관리

useradd
userdel
passwd
groupadd

핵심 파일

/etc/passwd
/etc/shadow
/etc/group

root UID

0


⸻

9️⃣ 로그

로그 위치

/var/log

대표 로그

messages
secure
boot.log

확인

tail -f
last
lastb


⸻

🔟 서비스 관리

systemctl start
systemctl stop
systemctl restart
systemctl status

자동 실행

systemctl enable
systemctl disable


⸻

1️⃣1️⃣ runlevel

핵심

0 shutdown
1 single user
3 multi-user CLI
5 GUI
6 reboot

systemd

3 → multi-user.target
5 → graphical.target


⸻

1️⃣2️⃣ 쉘 / 환경 변수

변수

VAR=value
echo $VAR

환경 변수

export PATH

PATH

명령어 검색 경로


⸻

1️⃣3️⃣ 리다이렉션 / 파이프

리다이렉션

>
>>
<
2>

파이프

|

예

ps -ef | grep ssh


⸻

1️⃣4️⃣ 스케줄

cron

crontab -e

구조

분 시 일 월 요일

예

0 2 * * *


⸻

⭐ 시험에서 제일 많이 틀리는 것 TOP 10

df vs du
which vs whereis vs locate
Hard link vs Symbolic link
runlevel 3 vs 5
SUID / SGID / Sticky
tail -f
SIGTERM vs SIGKILL
PATH 의미
/var/log 위치
/etc/passwd vs /etc/shadow


⸻

🔑 마지막 기억 (시험용)

df = 파일 시스템
du = 디렉터리

Hard = inode 동일
Symbolic = 경로

runlevel 3 = CLI
runlevel 5 = GUI

SIGTERM 15
SIGKILL 9
리눅스마스터 1급에서 **쉘(Shell)** 문제는 다음 영역에서 반복적으로 출제됩니다.

1️⃣ **쉘 종류**
2️⃣ **쉘 변수 / 환경 변수**
3️⃣ **쉘 메타 문자**
4️⃣ **쉘 스크립트 기본 문법**

시험에서는 대부분 **개념 + 간단한 코드 해석** 형태입니다.

아래는 **쉘 개념 → 쉘 종류 → 변수 → 메타 문자 → 쉘 스크립트 → 실전 문제** 순서로 정리합니다.

---

# 1. 쉘(Shell)

쉘은 **사용자와 커널 사이에서 명령을 해석하는 인터페이스**입니다.

구조

```text
User
 ↓
Shell
 ↓
Kernel
 ↓
Hardware
```

즉

```text
쉘 = 명령어 해석기
```

---

# 2. 주요 쉘 종류

대표적인 쉘

| 쉘            | 특징        |
| ------------ | --------- |
| Bourne shell | 최초 쉘      |
| Bash         | 가장 많이 사용  |
| C shell      | C 언어 스타일  |
| Korn shell   | Bourne 확장 |

대표 쉘

* Bash

확인 명령

```bash
echo $SHELL
```

또는

```bash
cat /etc/shells
```

---

# 3. 쉘 변수

변수 생성

```bash
VAR=value
```

예

```bash
NAME=linux
```

출력

```bash
echo $NAME
```

---

# 변수 삭제

```bash
unset VAR
```

---

# 환경 변수

환경 변수는 **export로 설정**

```bash
export VAR=value
```

---

# 4. 쉘 메타 문자

쉘 메타 문자는 특별한 의미를 가지는 문자입니다.

| 문자 | 의미 |
| -- | -- |

* | 모든 문자열 |
  ? | 한 문자 |
  [] | 문자 집합 |
  $ | 변수 |
  ~ | 홈 디렉터리 |

---

예

```bash
ls *.txt
```

의미

```text
txt 파일
```

---

# 5. 명령 치환

명령 실행 결과를 변수로 사용

```bash
DATE=$(date)
```

또는

```bash
DATE=`date`
```

---

# 6. 쉘 스크립트

쉘 명령을 파일로 작성

예

```bash
#!/bin/bash

echo hello
```

실행

```bash
chmod +x script.sh
./script.sh
```

---

# 7. 위치 매개 변수

쉘 스크립트에서 사용

| 변수 | 의미      |
| -- | ------- |
| $0 | 스크립트 이름 |
| $1 | 첫 번째 인자 |
| $2 | 두 번째 인자 |
| $# | 인자 개수   |
| $* | 모든 인자   |

예

```bash
echo $1
```

---

# 8. 조건문

기본 구조

```bash
if [ 조건 ]
then
  명령
fi
```

예

```bash
if [ $A -eq 1 ]
then
  echo yes
fi
```

---

# 9. 반복문

for

```bash
for i in 1 2 3
do
 echo $i
done
```

---

while

```bash
while [ $i -lt 5 ]
do
 echo $i
done
```

---

# 10. 실전 시험 문제

---

# 문제 1

쉘의 역할

정답

```text
명령어 해석
```

---

# 문제 2

다음 변수 출력 명령

```bash
VAR=test
```

정답

```bash
echo $VAR
```

---

# 문제 3

다음 의미

```bash
ls *.txt
```

정답

```text
txt 파일 목록
```

---

# 문제 4

다음 변수 의미

```bash
$1
```

정답

```text
첫 번째 인자
```

---

# 문제 5

다음 명령어 의미

```bash
unset VAR
```

정답

```text
변수 삭제
```

---

# 11. 시험 함정

## 함정 1

```text
쉘 = 운영체제
```

❌ 틀림

정답

```text
명령 해석기
```

---

## 함정 2

```bash
VAR = test
```

❌ 틀림

공백 불가

정답

```bash
VAR=test
```

---

## 함정 3

```bash
echo VAR
```

❌ 틀림

정답

```bash
echo $VAR
```

---

# 12. 시험 직전 암기

쉘

```text
명령 해석기
```

---

변수

```bash
VAR=value
echo $VAR
unset VAR
```

---

매개 변수

```text
$0 script
$1 first arg
$# arg count
```

---

# 핵심 요약

```text
Shell = command interpreter
```

---

원하시면 지금까지 정리한 내용을 기반으로
**리눅스마스터 1급 1차 시험 대비 “기출 스타일 모의고사 40문제”**도 만들어 드릴 수 있습니다.
실제 시험 패턴과 거의 동일하게 구성해 드리겠습니다.
