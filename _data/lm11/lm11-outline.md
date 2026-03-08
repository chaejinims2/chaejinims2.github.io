# Linux Master Level 1 (필기)

lm11/
├─ 1. Linux 기본 개념
│
│  ├─ 파일 시스템 (inode / journal / ext4) → `outline/01-01-filesystem-inode-journal-ext4.md`
│  │
│  ├─ 디렉터리 구조 (FHS) → `outline/01-02-directory-structure-fhs.md`
│  │
│  └─ 링크 (Hard / Symbolic Link) → `outline/01-03-link-hard-symbolic.md`
│
├─ 2. 디스크 / 저장장치 관리
│
│  ├─ RAID 관련 정리 → `outline/02-01-raid.md`
│  │
│  ├─ LVM / 파티션 (RAID + LVM + 파티션 문제) → `outline/02-02-lvm-partition.md`
│  │
│  ├─ 디스크 명령어 정리 → `outline/02-03-disk-commands.md`
│  │
│  ├─ 디스크 사용량 (df / du) → `outline/02-04-df-du.md`
│  │
│  └─ 파일 시스템 마운트 (fstab) → `outline/02-05-fstab.md`
├─ 3. 파일 / 텍스트 처리
│
│  ├─ 파일 검색 (grep / find) → `outline/03-01-grep-find.md`
│  │
│  ├─ 파일 위치 검색 (which / whereis / locate) → `outline/03-02-which-whereis-locate.md`
│  │
│  ├─ 파일 출력 (cat / head / tail) → `outline/03-03-cat-head-tail.md`
│  │
│  └─ 압축 (tar / gzip) → `outline/03-04-tar-gzip.md`
│
├─ 4. 권한 / 사용자 관리
│
│  ├─ 파일 권한 문제 → `outline/04-01-file-permission.md`
│  │
│  ├─ 특수 권한 (SUID / SGID) → `outline/04-02-suid-sgid.md`
│  │
│  └─ 사용자 / 그룹 관리 (useradd / passwd / group) → `outline/04-03-user-group.md`
│
├─ 5. 프로세스 관리
│
│  ├─ 프로세스 관리 (ps / kill / top) → `outline/05-01-ps-kill-top.md`
│  │
│  ├─ 프로세스 우선순위 (nice / renice) → `outline/05-02-nice-renice.md`
│  │
        시그널 정리 → `outline/05-03-signal.md`
│
├─ 6. 네트워크 관리
│
│  └─ 네트워크 명령어 (netstat / ss / ping) → `outline/06-01-netstat-ss-ping.md`
│
├─ 7. 서비스 / 부팅 관리
│
│  ├─ 부팅 관리 (runlevel / systemd target 문제/ init) → `outline/07-01-runlevel-systemd-init.md`
│  │
│  ├─ 서비스 관리 (systemctl) → `outline/07-02-systemctl.md`
│
├─ 8. 스케줄링
│
│  └─ 작업 스케줄 (cron / at) → `outline/08-01-cron-at.md`
│
├─ 9. 쉘 환경
│
│  ├─ 쉘 문제 → `outline/09-01-shell.md`
│  │
│  ├─ 환경 변수 (PATH / export) → `outline/09-02-path-export.md`
│  │
│  └─ 입출력 제어 (리다이렉션 / 파이프) → `outline/09-03-redirection-pipe.md`
│
├─ 10. 패키지 관리 (rpm / yum / apt) → `outline/10-01-package-management.md`
│
└─ 11. 로그 관리 (/var/log) → `outline/11-01-log.md`
