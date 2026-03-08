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
