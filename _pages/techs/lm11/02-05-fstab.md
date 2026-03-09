---
layout: page
title: 02-05 파일 시스템 마운트 (fstab)
---

리눅스마스터 1급에서 /etc/fstab 문제는 구조 이해 + 필드 의미 + 옵션 해석을 묻는 형태로 자주 출제됩니다.
효율적으로 풀기 위해 구조 → 각 필드 의미 → 옵션 → 실제 문제 패턴 → 함정 포인트 순으로 정리합니다.

⸻

1. /etc/fstab의 역할

/etc/fstab은 부팅 시 자동으로 마운트할 파일 시스템 정보를 저장하는 설정 파일입니다.

즉,
	•	어떤 장치를
	•	어디에
	•	어떤 파일 시스템으로
	•	어떤 옵션으로

마운트할지 정의합니다.

⸻

2. 기본 구조

fstab 한 줄은 6개의 필드로 구성됩니다.

장치   마운트포인트   파일시스템   옵션   dump   fsck

예

/dev/sda1   /home   ext4   defaults   1   2


⸻

3. 각 필드 의미

① 장치 (device)

마운트할 장치

예

/dev/sda1
/dev/md0
UUID=xxxx
LABEL=DATA

시험에서는 UUID 방식도 자주 등장합니다.

예

UUID=2a7b9c...


⸻

② 마운트 지점 (mount point)

파일 시스템이 연결될 디렉터리

예

/home
/data
/boot


⸻

③ 파일 시스템 타입

대표적인 값

ext4
xfs
swap
vfat
nfs


⸻

④ 마운트 옵션

가장 자주 나오는 필드입니다.

대표 옵션

옵션	의미
defaults	기본 옵션
ro	read only
rw	read write
noexec	실행 금지
nosuid	suid 비활성
nodev	device 파일 무시


⸻

defaults 의미

다음 옵션 묶음입니다.

rw
suid
dev
exec
auto
nouser
async

시험에서 자주 나옵니다.

⸻

⑤ dump 필드

백업 프로그램 dump 사용 여부

0 = dump 사용 안함
1 = dump 사용

실무에서는 거의 0.

⸻

⑥ fsck 순서

부팅 시 파일 시스템 검사 순서

0 = 검사 안함
1 = 루트 파일 시스템
2 = 기타 파일 시스템


⸻

4. 예제 분석

다음 항목을 분석해 봅니다.

/dev/sda1  /home  ext4  defaults  1  2

의미
	•	/dev/sda1
	•	/home에 마운트
	•	파일 시스템 ext4
	•	기본 옵션
	•	dump 사용
	•	fsck 두 번째 검사

⸻

5. UUID 사용 예

현대 리눅스에서는 UUID를 많이 사용합니다.

UUID=2a7b-9c0d  /data  ext4  defaults  0  2

이유
	•	디스크 순서 변경에도 안정적

예

/dev/sda → /dev/sdb


⸻

6. swap 예제

swap 항목

/dev/sda2   none   swap   sw   0   0

특징
	•	mount point 없음
	•	파일 시스템 swap

⸻

7. NFS 예제

네트워크 파일 시스템

server:/data  /mnt/nfs  nfs  defaults  0  0


⸻

8. 시험 문제 패턴

문제 1

다음 중 /etc/fstab 필드 순서

정답

device
mount point
filesystem
options
dump
fsck


⸻

문제 2

다음 중 fsck 순서

정답

1 → root filesystem
2 → 기타 filesystem


⸻

문제 3

다음 중 자동 마운트 설정 파일

정답

/etc/fstab


⸻

문제 4

다음 옵션 의미

noexec

정답

실행 금지


⸻

9. 자주 나오는 옵션

옵션	의미
defaults	기본 옵션
ro	읽기 전용
rw	읽기 쓰기
noexec	실행 금지
nosuid	suid 금지
nodev	device 사용 금지


⸻

10. 시험 함정

함정 1

fstab은 mount 명령을 대신한다

❌ 틀림

mount 정보를 정의하는 파일

⸻

함정 2

fsck 값 1은 모든 파일시스템

❌ 틀림

1 = root
2 = 기타


⸻

함정 3

dump 필드는 파일 시스템 검사 순서

❌ 틀림

⸻

11. 실제 시험 문제 예

문제

다음 중 /etc/fstab 항목 설명으로 옳은 것은?

/dev/sda1 /data ext4 defaults 0 2

정답

부팅 시 /dev/sda1을 /data에 ext4로 마운트


⸻

12. 시험 직전 암기

이 구조만 기억하면 됩니다.

device
mountpoint
filesystem
options
dump
fsck


⸻

13. 실제 리눅스 시스템 구조

보통 시스템은 이렇게 구성됩니다.

/dev/sda1  /      ext4
/dev/sda2  swap   swap
/dev/sda3  /home  ext4

fstab

/dev/sda1  /      ext4  defaults 1 1
/dev/sda2  none   swap  sw       0 0
/dev/sda3  /home  ext4  defaults 1 2


⸻

핵심 요약

시험에서는 이것만 기억하면 됩니다.

fstab = 자동 마운트 설정

구조
device
mountpoint
filesystem
options
dump
fsck


⸻

원하시면 다음도 이어서 정리해 드리겠습니다.
	•	리눅스마스터 1급 “fstab 실제 기출 문제 20개”
	•	mount / df / lsblk 출력 해석 문제
	•	파일 시스템 문제 (inode / journal / ext4)

특히 inode 문제는 거의 매 시험 출제됩니다.