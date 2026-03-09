---
layout: page
title: LVM / 파티션 (RAID + LVM + 파티션 문제)
---
리눅스마스터 1급 시험에서 RAID + LVM + 파티션은 따로 나오기보다 “디스크 → RAID → LVM → 파일시스템 → 마운트” 구조를 이해하는지 묻는 문제로 출제됩니다.
따라서 각각을 따로 외우기보다 **계층 구조(storage stack)**로 이해하는 것이 중요합니다.

아래는 구조 → 각 계층 역할 → 실제 구성 흐름 → 시험 문제 패턴 → 함정 포인트 순서로 정리합니다.

⸻

1. 리눅스 스토리지 계층 구조

실제 리눅스 서버에서 디스크가 사용되는 구조입니다.

Physical Disk
     │
Partition
     │
RAID (optional)
     │
LVM
 ├── PV (Physical Volume)
 ├── VG (Volume Group)
 └── LV (Logical Volume)
     │
Filesystem
     │
Mount

예시

/dev/sda
  └─ /dev/sda1
        └─ RAID1 (/dev/md0)
              └─ LVM PV
                    └─ VG vg_data
                          └─ LV lv_home
                                └─ ext4
                                      └─ /home

시험에서는 이 순서를 이해했는지 확인합니다.

⸻

2. 파티션 (Partition)

역할

하나의 디스크를 여러 영역으로 나누는 것.

예

/dev/sda
 ├─ /dev/sda1
 ├─ /dev/sda2
 └─ /dev/sda3

생성 명령

fdisk

또는

parted


⸻

시험 포인트

파티션 타입

Linux        → 83
Linux swap   → 82
Linux LVM    → 8e

특히

LVM 파티션 타입

8e

자주 출제됩니다.

⸻

3. RAID

여러 디스크를 하나의 장치로 묶는 것.

예

/dev/sda1
/dev/sdb1
      │
      ▼
   RAID1
      │
      ▼
   /dev/md0

생성

mdadm

상태 확인

cat /proc/mdstat


⸻

4. LVM

RAID 위에서 논리적인 볼륨 관리를 합니다.

구조

PV → VG → LV


⸻

5. LVM 구성 요소

PV (Physical Volume)

LVM이 사용하는 실제 디스크

예

/dev/sda1
/dev/md0

생성

pvcreate /dev/md0


⸻

VG (Volume Group)

PV들을 모은 논리적 저장 공간

예

vg_data

생성

vgcreate vg_data /dev/md0


⸻

LV (Logical Volume)

실제 파일 시스템을 만드는 영역

예

/dev/vg_data/lv_home

생성

lvcreate -L 10G -n lv_home vg_data


⸻

6. 파일 시스템 생성

LV 위에 파일 시스템 생성

mkfs.ext4 /dev/vg_data/lv_home


⸻

7. 마운트

mount /dev/vg_data/lv_home /home

자동 마운트

/etc/fstab


⸻

8. 실제 구축 흐름

실무 및 시험 흐름

1단계 파티션 생성

/dev/sda1
/dev/sdb1


⸻

2단계 RAID 생성

mdadm → /dev/md0


⸻

3단계 LVM

pvcreate /dev/md0
vgcreate vg_data /dev/md0
lvcreate -L 10G -n lv_home vg_data


⸻

4단계 파일시스템

mkfs.ext4


⸻

5단계 마운트

mount


⸻

9. 시험 문제 패턴

문제 패턴 1

다음 중 LVM 구성 순서

정답

PV → VG → LV


⸻

문제 패턴 2

다음 중 RAID 장치 이름

정답

/dev/md0


⸻

문제 패턴 3

다음 중 RAID 상태 확인

정답

/proc/mdstat


⸻

문제 패턴 4

다음 중 LVM 확장 가능한 영역

정답

Logical Volume

또는

Volume Group

문제 문맥에 따라 다름.

⸻

10. 시험 함정

함정 1

LV → VG → PV

❌ 틀림

⸻

함정 2

RAID는 파일시스템이다

❌ 틀림

RAID는 블록 디바이스

⸻

함정 3

LVM은 파일시스템이다

❌ 틀림

LVM은 볼륨 관리 시스템

⸻

함정 4

파일 시스템 → LVM

❌ 순서 반대

⸻

11. 시험 암기 구조

이 순서만 기억하면 대부분 풀립니다.

Disk
 ↓
Partition
 ↓
RAID
 ↓
LVM
 ↓
Filesystem
 ↓
Mount


⸻

12. 개발자 관점

사용자님이 시스템 개발자라서 실제 서버 구조를 같이 보면 더 이해가 쉽습니다.

대부분 서버는 이런 구조입니다.

NVMe / SATA Disk
       ↓
Partition
       ↓
RAID1 / RAID10
       ↓
LVM
       ↓
ext4 / xfs
       ↓
mount (/data)

이 구조를 이해하면
스토리지 + 파일 시스템 + 장애 복구 문제도 쉽게 풀립니다.

⸻

13. 시험 직전 암기

이 다섯 개만 기억하면 됩니다.

RAID 장치 = /dev/md0
RAID 상태 = /proc/mdstat
LVM 순서 = PV → VG → LV
LVM 파티션 타입 = 8e
mount 설정 = /etc/fstab


⸻

원하시면 다음도 정리해 드리겠습니다.

1️⃣ 리눅스마스터 1급 저장장치 문제 TOP 30
2️⃣ LVM + RAID 실제 구성 예제 (시험형)
3️⃣ 디스크 명령어 정리 (fdisk / mount / df / lsblk / blkid)

특히 lsblk / df / mount / blkid 문제는 시험에서 굉장히 많이 나옵니다.