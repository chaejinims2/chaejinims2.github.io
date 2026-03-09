---
layout: page
title: 디스크 명령어 정리
---

리눅스마스터 1급 시험에서 디스크 관련 명령어는 크게 네 가지 범주로 나눌 수 있습니다.

1️⃣ 디스크 / 파티션 관리
2️⃣ 파일시스템 생성 및 검사
3️⃣ 디스크 사용량 확인
4️⃣ 장치 정보 확인

시험에서는 보통 명령어 기능을 묻거나 출력 결과 해석 문제로 출제됩니다.
아래는 기본 개념 → 명령어 정리 → 시험 포인트 → 출력 해석 순서로 정리합니다.

⸻

1. 디스크 장치 구조 이해

리눅스에서 디스크 장치는 /dev 아래에 생성됩니다.

예

/dev/sda
/dev/sdb
/dev/nvme0n1

파티션

/dev/sda1
/dev/sda2
/dev/sda3

NVMe

/dev/nvme0n1p1
/dev/nvme0n1p2


⸻

2. 디스크 / 파티션 관리 명령어

fdisk

가장 기본적인 파티션 관리 도구입니다.

사용 예

fdisk /dev/sda

주요 기능

명령	기능
m	도움말
p	파티션 테이블 출력
n	새 파티션 생성
d	파티션 삭제
w	저장 후 종료
q	저장하지 않고 종료


⸻

시험 포인트
	•	MBR 기반 파티션 관리
	•	최대 4개 primary partition

⸻

parted

GPT 기반 파티션 관리 도구

예

parted /dev/sda

특징
	•	대용량 디스크 지원
	•	GPT 지원

⸻

3. 파일 시스템 생성 명령어

mkfs

파일 시스템 생성

예

mkfs.ext4 /dev/sda1

또는

mkfs -t ext4 /dev/sda1


⸻

mke2fs

ext 계열 파일 시스템 생성

예

mke2fs /dev/sda1


⸻

시험 포인트

ext 계열

ext2
ext3
ext4


⸻

4. 파일 시스템 검사

fsck

파일 시스템 검사 및 복구

예

fsck /dev/sda1

ext 계열

e2fsck


⸻

시험 포인트

저널링 파일 시스템 도입 목적

fsck 시간 단축


⸻

5. 디스크 사용량 확인

df

파일 시스템 사용량 확인

예

df -h

출력 예

Filesystem Size Used Avail Use% Mounted on
/dev/sda1   50G   20G  30G  40% /

옵션

옵션	의미
-h	human readable
-T	파일시스템 타입


⸻

du

디렉터리 사용량 확인

예

du -sh /home

옵션

옵션	의미
-s	합계
-h	사람이 읽기 쉬움


⸻

시험 포인트

차이

명령	의미
df	파일 시스템 사용량
du	디렉터리 사용량


⸻

6. 장치 정보 확인

lsblk

블록 장치 정보 확인

예

lsblk

출력 예

NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sda      8:0    0 100G  0 disk
├─sda1   8:1    0 50G   0 part /
└─sda2   8:2    0 50G   0 part /home


⸻

blkid

파일 시스템 UUID 확인

예

blkid

출력

/dev/sda1: UUID="abc123" TYPE="ext4"


⸻

시험 포인트

fstab에서 사용

UUID


⸻

7. 마운트 명령어

mount

파일 시스템 연결

예

mount /dev/sda1 /mnt


⸻

umount

마운트 해제

umount /mnt

또는

umount /dev/sda1


⸻

자동 마운트

설정 파일

/etc/fstab


⸻

8. 디스크 정보 확인

fdisk -l

디스크 정보 출력

fdisk -l

출력

Disk /dev/sda: 100 GiB
Device     Boot Start End Sectors Size Id Type
/dev/sda1        2048 ... 


⸻

9. 시험에서 자주 나오는 명령어 정리

명령어	기능
fdisk	파티션 생성
parted	GPT 파티션
mkfs	파일 시스템 생성
fsck	파일 시스템 검사
df	파일 시스템 사용량
du	디렉터리 사용량
lsblk	블록 장치 구조
blkid	UUID 확인
mount	파일 시스템 연결
umount	마운트 해제


⸻

10. 시험 함정

함정 1

df는 디렉터리 크기 확인

❌ 틀림

⸻

함정 2

du는 파일시스템 사용량 확인

❌ 틀림

⸻

함정 3

mount는 파일시스템 생성

❌ 틀림

⸻

함정 4

fsck는 마운트 상태에서 실행

❌ 위험

⸻

11. 시험 직전 암기

이 6개가 가장 중요합니다.

fdisk → 파티션 생성
mkfs → 파일시스템 생성
fsck → 파일시스템 검사
df → 디스크 사용량
du → 디렉터리 사용량
mount → 파일시스템 연결


⸻

12. 개발자 관점에서 실제 사용 흐름

디스크 초기 설정 순서

fdisk
 ↓
mkfs
 ↓
mount
 ↓
df

문제 발생 시

fsck

확인

lsblk
blkid


⸻

원하시면 다음도 정리해 드리겠습니다.

1️⃣ 리눅스마스터 1급 파일 시스템 문제 TOP 30
2️⃣ lsblk / df 출력 해석 문제
3️⃣ fstab 문제 (시험에서 자주 나옴)

특히 fstab 문제는 거의 매 회차 출제됩니다.