var store = [{
        "title": "Case Study",
        "excerpt":"Here is a curated list of my personal and professional projects. Each project reflects my hands-on experience in system software, storage drivers, and automation tools.  ","categories": [],
        "tags": [],
        "url": "/cases/",
        "teaser": null
      },{
        "title": "Printing Image 3D Simulator",
        "excerpt":"Inkjet Printing Equipment Quality Prediction Method Extended an existing NVMe host driver to support Multi Physical Functions (MPF) as well as Single Physical Function (SPF). By redesigning the static array-based global variable model of the legacy driver into a reference-counting-based list structure, I reduced the module size and increased scalability....","categories": [],
        "tags": [],
        "url": "/cases/wpf-img-3d-simulator/index/",
        "teaser": null
      },{
        "title": "NVMe Host Driver Extension for MPF",
        "excerpt":"NVMe Host Driver Extension for Multi-Physical Function (MPF) Support Extended an existing NVMe host driver to support Multi Physical Functions (MPF) as well as Single Physical Function (SPF). By redesigning the static array-based global variable model of the legacy driver into a reference-counting-based list structure, I reduced the module size...","categories": [],
        "tags": [],
        "url": "/cases/nvme-spf-mpf/index/",
        "teaser": null
      },{
        "title": "NVMe-MI Basic Command on sBLT",
        "excerpt":"NVMe-MI Basic Command Set implementation on sBLT   SMBus communication implementation to the device SMBus communication implementation in sBLT (SmbSend, SmbRecv) NVMe-MI Basic Management Command I/O implementation in sBLT (SMBus)   ","categories": [],
        "tags": [],
        "url": "/cases/nvme-mi-basic/index/",
        "teaser": null
      },{
        "title": "Test Equipment S/W Migration to WebApp",
        "excerpt":"Test Equipment S/W Migration to WebApp, Cross platform APP Design and WPF migration Migrated a legacy Windows Presentation Foundation (WPF) application to a modern web-based solution. This involved refactoring the UI architecture to leverage modern web technologies while maintaining backward compatibility with existing features. Highlights: Cross platform APP Design and...","categories": [],
        "tags": [],
        "url": "/cases/wpf-to-webapp/index/",
        "teaser": null
      },{
        "title": "chaejinims2@github.io",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/cherry",
        "teaser": null
      },{
        "title": "About",
        "excerpt":"NVMe / Linux Kernel / Equipment Software Automation tools and reproducible workflows I am a Systems &amp; Platform Engineer with expertise in Linux kernel, storage systems (NVMe), and DevOps-oriented platform design. I am interested in structuring complex systems for clarity, changeability, and scale. I am designing system software that remains...","categories": [],
        "tags": [],
        "url": "/home/about/index/",
        "teaser": null
      },{
        "title": "History",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/home/history/index/",
        "teaser": null
      },{
        "title": "Home",
        "excerpt":"Welcome!  ","categories": [],
        "tags": [],
        "url": "/home/",
        "teaser": null
      },{
        "title": "Ideals & Objectives",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/home/objective/index/",
        "teaser": null
      },{
        "title": "Laboratory",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/labs/",
        "teaser": null
      },{
        "title": "linux master 1",
        "excerpt":"실행 로그 선택 lsblk -f : 블록 장치 정보 확인 cat /etc/fstab : fstab에서 사용 UUID 확인 ls -li : inode 확인 cat /proc/mdstat : 소프트웨어 RAID 상태 확인 sudo fdisk -l /dev/mmcblk1p5 : 특정 파티션 정보 확인 df -h : 파일 시스템 디스크 사용량 확인 du -sh * :...","categories": [],
        "tags": [],
        "url": "/labs/lm11/index/",
        "teaser": null
      },{
        "title": "Websocket Test",
        "excerpt":"Lab: Configure Korean VPN on Latte Panda delta 3 at home and verify connection.  ","categories": [],
        "tags": [],
        "url": "/labs/websocket/index/",
        "teaser": null
      },{
        "title": "Settings",
        "excerpt":"This is the settings page.  ","categories": [],
        "tags": [],
        "url": "/settings/",
        "teaser": null
      },{
        "title": "Sitemap",
        "excerpt":"This is the sitemap page.  ","categories": [],
        "tags": [],
        "url": "/sitemap/",
        "teaser": null
      },{
        "title": "chaejinims2@github.io",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/",
        "teaser": null
      },{
        "title": "Tech notes",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/techs/",
        "teaser": null
      },{
        "title": "01-01 파일 시스템 (inode / journal / ext4)",
        "excerpt":"리눅스마스터 1급에서 파일 시스템(inode / journaling / ext4) 문제는 대부분 개념 + 구조 + 특징 비교 형태로 출제됩니다. 특히 다음 세 가지는 거의 반드시 등장합니다. inode 구조 저널링 파일 시스템 ext2 / ext3 / ext4 차이 파일 시스템 구조 → inode → journaling → ext 계열 비교 → 시험 문제...","categories": [],
        "tags": [],
        "url": "/techs/lm11/01-01-filesystem-inode-journal-ext4/",
        "teaser": null
      },{
        "title": "01-02 디렉터리 구조 (FHS)",
        "excerpt":"리눅스마스터 1급에서 디렉터리 구조(FHS) 문제는 거의 항상 출제되는 기본 영역입니다. 핵심은 각 디렉터리의 역할을 구분하는 것입니다. 여기서 기준이 되는 표준은 FHS(Filesystem Hierarchy Standard)입니다. 1. FHS (Filesystem Hierarchy Standard) FHS는 리눅스 파일 시스템 구조를 표준화한 규칙입니다. 목적 시스템 관리 일관성 프로그램 호환성 파일 위치 표준화 2. 리눅스 디렉터리 구조 루트 디렉터리에서...","categories": [],
        "tags": [],
        "url": "/techs/lm11/01-02-directory-structure-fhs/",
        "teaser": null
      },{
        "title": "01-03 링크 (Hard / Symbolic Link)",
        "excerpt":"리눅스마스터 1급 시험에서 링크(Link) 문제는 매우 자주 출제됩니다. 핵심은 Hard Link vs Symbolic Link 차이입니다. 아래는 파일 시스템 구조 → Hard Link → Symbolic Link → 차이 → 시험 문제 → 함정 순서로 설명합니다. 1. 링크(Link) 개념 리눅스 파일 시스템에서 파일은 이름이 아니라 inode로 관리됩니다. 구조 파일명 → inode →...","categories": [],
        "tags": [],
        "url": "/techs/lm11/01-03-link-hard-symbolic/",
        "teaser": null
      },{
        "title": "02-01 RAID 관련 정리",
        "excerpt":"리눅스마스터 1급 시험에서 RAID는 개념 + 레벨 특징 + 최소 디스크 수 + 장단점이 핵심입니다. 효율적인 학습을 위해 구조 → 각 RAID 레벨 → 시험 포인트 → 암기법 순서로 정리합니다. ⸻ RAID 기본 개념 RAID 정의 RAID는 여러 개의 디스크를 하나의 논리적 디스크처럼 사용하여 성능 또는 안정성을 높이는 기술입니다. RAID의...","categories": [],
        "tags": [],
        "url": "/techs/lm11/02-01-raid/",
        "teaser": null
      },{
        "title": "02-02 LVM / 파티션 (RAID + LVM + 파티션 문제)",
        "excerpt":"리눅스마스터 1급 시험에서 RAID + LVM + 파티션은 따로 나오기보다 “디스크 → RAID → LVM → 파일시스템 → 마운트” 구조를 이해하는지 묻는 문제로 출제됩니다. 따라서 각각을 따로 외우기보다 계층 구조(storage stack)로 이해하는 것이 중요합니다. 아래는 구조 → 각 계층 역할 → 실제 구성 흐름 → 시험 문제 패턴 → 함정...","categories": [],
        "tags": [],
        "url": "/techs/lm11/02-02-lvm-partition/",
        "teaser": null
      },{
        "title": "02-03 디스크 명령어 정리",
        "excerpt":"리눅스마스터 1급 시험에서 디스크 관련 명령어는 크게 네 가지 범주로 나눌 수 있습니다. 1️⃣ 디스크 / 파티션 관리 2️⃣ 파일시스템 생성 및 검사 3️⃣ 디스크 사용량 확인 4️⃣ 장치 정보 확인 시험에서는 보통 명령어 기능을 묻거나 출력 결과 해석 문제로 출제됩니다. 아래는 기본 개념 → 명령어 정리 → 시험 포인트...","categories": [],
        "tags": [],
        "url": "/techs/lm11/02-03-disk-commands/",
        "teaser": null
      },{
        "title": "02-04 디스크 사용량 (df / du)",
        "excerpt":"리눅스마스터 시험에서 디스크 사용량 관련 문제는 거의 항상 df vs du 차이를 묻습니다. 핵심은 다음 한 줄입니다. df → 파일 시스템 전체 용량 du → 디렉터리 / 파일 실제 사용량 이 차이를 이해하면 시험 문제 대부분을 바로 풀 수 있습니다. 1. df (Disk Free) df는 파일 시스템 전체의 디스크 사용량을...","categories": [],
        "tags": [],
        "url": "/techs/lm11/02-04-df-du/",
        "teaser": null
      },{
        "title": "02-05 파일 시스템 마운트 (fstab)",
        "excerpt":"리눅스마스터 1급에서 /etc/fstab 문제는 구조 이해 + 필드 의미 + 옵션 해석을 묻는 형태로 자주 출제됩니다. 효율적으로 풀기 위해 구조 → 각 필드 의미 → 옵션 → 실제 문제 패턴 → 함정 포인트 순으로 정리합니다. ⸻ /etc/fstab의 역할 /etc/fstab은 부팅 시 자동으로 마운트할 파일 시스템 정보를 저장하는 설정 파일입니다. 즉,...","categories": [],
        "tags": [],
        "url": "/techs/lm11/02-05-fstab/",
        "teaser": null
      },{
        "title": "03-01 파일 검색 (grep / find)",
        "excerpt":"리눅스마스터 1급에서 grep / find 문제는 매우 자주 출제됩니다. 특히 다음 네 가지 유형이 핵심입니다. 1️⃣ 명령어 의미 해석 2️⃣ 옵션 기능 3️⃣ 출력 결과 추론 4️⃣ 명령어 조합 (grep + find) 아래는 개념 → 주요 옵션 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. grep 기본 개념 grep은...","categories": [],
        "tags": [],
        "url": "/techs/lm11/03-01-grep-find/",
        "teaser": null
      },{
        "title": "03-02 파일 위치 검색 (which / whereis / locate)",
        "excerpt":"리눅스마스터 1급 시험에서 파일 위치 검색 명령어는 다음 세 가지가 비교 문제로 자주 출제됩니다. which whereis locate 핵심 차이는 검색 방식과 검색 대상입니다. 1. which which는 실행 가능한 명령어의 경로를 찾습니다. 특징 PATH 환경 변수에 있는 디렉터리만 검색 사용 예 which ls 출력 예 /bin/ls 즉 실행 명령어 위치 확인...","categories": [],
        "tags": [],
        "url": "/techs/lm11/03-02-which-whereis-locate/",
        "teaser": null
      },{
        "title": "03-03 파일 출력 (cat / head / tail)",
        "excerpt":"리눅스마스터 1급 시험에서 파일 내용 확인 명령어는 다음 세 가지가 핵심입니다. cat head tail 시험에서는 보통 1️⃣ 명령어 역할 2️⃣ 옵션 의미 3️⃣ 출력 위치 차이 를 묻습니다. 1. cat cat은 파일 내용을 전체 출력하는 명령어입니다. 기본 사용 cat file.txt 출력 파일의 모든 내용 여러 파일 출력 cat file1 file2...","categories": [],
        "tags": [],
        "url": "/techs/lm11/03-03-cat-head-tail/",
        "teaser": null
      },{
        "title": "03-04 압축 (tar / gzip)",
        "excerpt":"리눅스마스터 1급에서 압축 관련 문제는 거의 항상 등장하며, 핵심은 두 가지입니다. • tar (파일 묶기 + 압축 옵션) • gzip (단일 파일 압축) 시험은 보통 옵션 의미 / 명령어 해석 / 파일 확장자 형태로 출제됩니다. 아래는 개념 → 옵션 → 확장자 → 실전 문제 → 시험 함정 순서로 정리합니다. ⸻...","categories": [],
        "tags": [],
        "url": "/techs/lm11/03-04-tar-gzip/",
        "teaser": null
      },{
        "title": "04-01 파일 권한 문제",
        "excerpt":"리눅스마스터 1급에서 파일 권한(permission) 문제는 매우 높은 빈도로 출제됩니다. 문제 유형은 주로 다음 네 가지입니다. 1️⃣ 권한 의미 해석 2️⃣ 8진수 권한 계산 3️⃣ chmod 명령어 4️⃣ 특수 권한 (SUID, SGID, Sticky bit) 아래는 구조 → 권한 계산 → chmod → 특수 권한 → 시험 문제 패턴 순서로 정리합니다. 1....","categories": [],
        "tags": [],
        "url": "/techs/lm11/04-01-file-permission/",
        "teaser": null
      },{
        "title": "04-02 특수 권한 (SUID / SGID)",
        "excerpt":"리눅스마스터 1급에서 SUID / SGID / Sticky bit 문제는 대부분 ① 권한 문자열 해석 ② 숫자 권한 계산 ③ 의미 이해 형태로 출제됩니다. 아래는 실전 시험 스타일 문제 → 풀이 → 핵심 정리 방식으로 구성했습니다. 문제 1 다음 파일 권한이 의미하는 것은? -rwsr-xr-x 보기 실행 시 그룹 권한으로 실행된다 실행...","categories": [],
        "tags": [],
        "url": "/techs/lm11/04-02-suid-sgid/",
        "teaser": null
      },{
        "title": "04-03 사용자 / 그룹 관리 (useradd / passwd / group)",
        "excerpt":"리눅스마스터 1급 시험에서 사용자 관리(User Management) 영역은 거의 매 시험마다 출제됩니다. 핵심은 사용자 생성 → 비밀번호 → 그룹 관리 → 관련 파일 구조입니다. 아래는 개념 → 명령어 → 시스템 파일 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 사용자(User) 개념 리눅스는 멀티 사용자(Multi-user) 시스템입니다. 사용자 종류 유형 설명 root...","categories": [],
        "tags": [],
        "url": "/techs/lm11/04-03-user-group/",
        "teaser": null
      },{
        "title": "05-01 프로세스 관리 (ps / kill / top)",
        "excerpt":"리눅스마스터 1급에서 프로세스 관리 명령어는 매우 중요한 출제 영역입니다. 특히 다음 세 명령어가 반복적으로 등장합니다. ps kill top 시험에서는 주로 출력 해석 + 옵션 의미 + 시그널 이해를 묻습니다. 아래는 개념 → 옵션 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 프로세스 개념 프로세스란 실행 중인 프로그램 구조 program...","categories": [],
        "tags": [],
        "url": "/techs/lm11/05-01-ps-kill-top/",
        "teaser": null
      },{
        "title": "05-02 프로세스 우선순위 (nice / renice)",
        "excerpt":"리눅스마스터 1급 시험에서 프로세스 우선순위 관리는 주로 두 명령어를 묻습니다. nice renice 핵심 개념은 CPU 스케줄링 우선순위(Nice value) 입니다. 1. Nice 값 개념 리눅스 프로세스는 우선순위(priority) 를 가지고 CPU를 사용합니다. 여기서 사용하는 값이 nice 값입니다. 범위 -20 ~ 19 의미 값 의미 -20 가장 높은 우선순위 0 기본값 19 가장...","categories": [],
        "tags": [],
        "url": "/techs/lm11/05-02-nice-renice/",
        "teaser": null
      },{
        "title": "05-03 시그널 정리",
        "excerpt":"리눅스마스터 1급 1차 기준으로는 시그널을 “정의 + 번호 + 발생 상황 + 시험 함정”으로 묶어서 외우는 것이 가장 효율적입니다. 아래는 기본 개념 → 자주 나오는 시그널 → 헷갈리는 비교 → 시험 암기 포인트 순서로 정리합니다. 1. Signal이란? 시그널(signal)은 프로세스에게 특정 사건이 발생했음을 알리는 소프트웨어 인터럽트입니다. 즉, 운영체제나 다른 프로세스, 또는...","categories": [],
        "tags": [],
        "url": "/techs/lm11/05-03-signal/",
        "teaser": null
      },{
        "title": "06-01 네트워크 명령어 (netstat / ss / ping)",
        "excerpt":"리눅스마스터 1급에서 네트워크 명령어는 다음 세 가지가 핵심입니다. • ping • netstat • ss 시험에서는 주로 ① 명령어 기능 ② 옵션 의미 ③ 출력 결과 해석 을 묻습니다. 아래는 개념 → 주요 옵션 → 출력 해석 → 실전 문제 → 시험 함정 순서로 정리합니다. ⸻ ping 역할 ping은 네트워크 연결...","categories": [],
        "tags": [],
        "url": "/techs/lm11/06-01-netstat-ss-ping/",
        "teaser": null
      },{
        "title": "07-01 부팅 관리 (runlevel / systemd target / init)",
        "excerpt":"리눅스마스터 1급에서 부팅 과정 + runlevel + init/systemd 문제는 매우 자주 출제됩니다. 특히 시험에서는 다음을 묻습니다. 1️⃣ 리눅스 부팅 순서 2️⃣ runlevel 의미 3️⃣ init vs systemd 차이 4️⃣ systemctl 명령어 아래는 부팅 과정 → runlevel → init → systemd → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 리눅스...","categories": [],
        "tags": [],
        "url": "/techs/lm11/07-01-runlevel-systemd-init/",
        "teaser": null
      },{
        "title": "07-02 서비스 관리 (systemctl)",
        "excerpt":"리눅스마스터 1급에서 서비스 관리(Service Management) 문제는 대부분 systemctl 명령어 중심으로 출제됩니다. 이는 현대 리눅스에서 사용하는 systemd 기반 서비스 관리 도구입니다. 관련 시스템: systemd 1. systemctl 개념 systemctl은 서비스(service) 및 시스템 상태를 관리하는 명령어입니다. 기능 서비스 시작 / 종료 부팅 자동 실행 설정 서비스 상태 확인 2. 서비스 상태 확인 서비스...","categories": [],
        "tags": [],
        "url": "/techs/lm11/07-02-systemctl/",
        "teaser": null
      },{
        "title": "08-01 작업 스케줄 (cron / at)",
        "excerpt":"리눅스마스터 1급 시험에서 작업 스케줄링은 두 가지 명령이 핵심입니다. • cron (반복 작업) • at (일회성 작업) 시험에서는 보통 다음을 묻습니다. 1️⃣ crontab 구조 해석 2️⃣ cron vs at 차이 3️⃣ crontab 필드 의미 4️⃣ 명령어 사용법 아래는 cron → crontab 구조 → at → 실전 문제 → 시험 함정...","categories": [],
        "tags": [],
        "url": "/techs/lm11/08-01-cron-at/",
        "teaser": null
      },{
        "title": "09-01 쉘 문제",
        "excerpt":"리눅스마스터 1급에서 쉘(Shell) 문제는 다음 영역에서 반복적으로 출제됩니다. 1️⃣ 쉘 종류 2️⃣ 쉘 변수 / 환경 변수 3️⃣ 쉘 메타 문자 4️⃣ 쉘 스크립트 기본 문법 시험에서는 대부분 개념 + 간단한 코드 해석 형태입니다. 아래는 쉘 개념 → 쉘 종류 → 변수 → 메타 문자 → 쉘 스크립트 → 실전...","categories": [],
        "tags": [],
        "url": "/techs/lm11/09-01-shell/",
        "teaser": null
      },{
        "title": "09-02 환경 변수 (PATH / export)",
        "excerpt":"리눅스마스터 1급에서 환경 변수(Environment Variable) 문제는 비교적 단순하지만 자주 출제되는 영역입니다. 특히 다음 세 가지가 핵심입니다. 1️⃣ PATH 의미 2️⃣ export 명령어 3️⃣ 환경 변수 확인 / 설정 아래는 환경 변수 개념 → PATH → export → 관련 명령어 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 환경 변수...","categories": [],
        "tags": [],
        "url": "/techs/lm11/09-02-path-export/",
        "teaser": null
      },{
        "title": "09-03 입출력 제어 (리다이렉션 / 파이프)",
        "excerpt":"리눅스마스터 1급에서 리다이렉션(redirection)과 파이프(pipe)는 기본 쉘 기능 문제로 자주 출제됩니다. 핵심은 표준 입출력 구조 이해 → 기호 의미 → 명령 조합 해석입니다. 아래는 개념 → 기호 → 예제 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 표준 입출력 (Standard I/O) 리눅스 프로그램은 기본적으로 3개의 입출력 채널을 사용합니다. 번호 이름...","categories": [],
        "tags": [],
        "url": "/techs/lm11/09-03-redirection-pipe/",
        "teaser": null
      },{
        "title": "10-01 패키지 관리 (rpm / yum / apt)",
        "excerpt":"리눅스마스터 1급에서 패키지 관리(package management) 문제는 보통 다음을 묻습니다. 1️⃣ 패키지 개념 2️⃣ 패키지 형식 (.rpm / .deb) 3️⃣ 패키지 관리 명령어 4️⃣ 배포판 계열별 패키지 도구 아래는 개념 → 배포판 계열 → 주요 명령어 → 실전 문제 → 시험 함정 순서로 정리합니다. 1. 패키지 (Package) 패키지는 소프트웨어 설치 단위입니다....","categories": [],
        "tags": [],
        "url": "/techs/lm11/10-01-package-management/",
        "teaser": null
      },{
        "title": "11-01 로그 관리 (/var/log)",
        "excerpt":"리눅스마스터 1급에서 로그 관리(Log Management) 문제는 다음을 중심으로 출제됩니다. 1️⃣ 로그 저장 위치 2️⃣ 주요 로그 파일 역할 3️⃣ 로그 관리 도구 4️⃣ 로그 확인 명령어 핵심 디렉터리는 /var/log 입니다. ⸻ 로그 디렉터리 리눅스에서 대부분의 로그는 /var/log 에 저장됩니다. 예 ls /var/log 이 디렉터리에는 system 로그 authentication 로그 boot 로그...","categories": [],
        "tags": [],
        "url": "/techs/lm11/11-01-log/",
        "teaser": null
      },{
        "title": "Linux Master Level 1",
        "excerpt":"목차 (01-01 ~ 11-01) Linux 기본 개념 파일 시스템 (inode / journal / ext4) 디렉터리 구조 (FHS) 링크 (Hard / Symbolic Link) 디스크 / 저장장치 관리 RAID 관련 정리 LVM / 파티션 (RAID + LVM + 파티션 문제) 디스크 명령어 정리 디스크 사용량 (df / du) 파일 시스템 마운트 (fstab)...","categories": [],
        "tags": [],
        "url": "/techs/lm11/index/",
        "teaser": null
      },{
        "title": "What is NVMe Physical Function",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/techs/lnkn/index/",
        "teaser": null
      },{
        "title": "Ielts voca - 예문 번역",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tests/cexample/",
        "teaser": null
      },{
        "title": "Ielts voca set",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tests/cvoca/",
        "teaser": null
      },{
        "title": "Voca JSON Editor",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tests/editor/",
        "teaser": null
      },{
        "title": "Tests",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tests/",
        "teaser": null
      },{
        "title": "Linux Master 1급 1차",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tests/lm11/",
        "teaser": null
      },{
        "title": "What is Agentic Coding",
        "excerpt":"What is Agentic Coding Agentic coding uses autonomous AI agents to plan, write, test, and refine code, acting as a collaborative partner rather than just an autocomplete tool. Powered by Large Language Models (LLMs), these agents operate in a “reason and act” loop, managing entire development tasks—such as debugging or...","categories": ["ai"],
        "tags": ["agentic coding","vibe coding"],
        "url": "/ai/2026/03/03/agentic-coding/",
        "teaser": null
      },{
        "title": "linux-master",
        "excerpt":"Linux 2022년 03월 12일 필기 다음 설명에 해당하는 파일로 알맞은 것은? 네트워크 관리자로부터 운영 중인 DNS 서버의 IP 주소가 변경되었다는 연락을 받아서 관련 설정을 진행해야 한다. /etc/hosts /etc/sysconfig/networks /etc/resolv.conf /etc/named.conf 다음 중 프로토콜 데이터 단위를 OSI 7계층 모델의 하위 계층부터 상위 계층 순으로 올바르게 나열한 것은? bit → frame →...","categories": ["linux","ubuntu"],
        "tags": ["linux"],
        "url": "/linux/ubuntu/2026/03/03/linux-master-1/",
        "teaser": null
      },{
        "title": "Design Webapp",
        "excerpt":"[WebApp] 1. Design Webapp  ","categories": ["Web"],
        "tags": ["ASP.Net Core","Razor","Web Socket"],
        "url": "/web/2026/03/03/design-web-app/",
        "teaser": null
      },{
        "title": "IaaS, PaaS, SaaS, FaaS 정리",
        "excerpt":"IaaS/PaaS/SaaS/FaaS 클라우드 서비스 모델들은 ‘어디까지 내가 직접 관리하고, 어디까지 업체가 다 해주는가’의 차이 ‘피자 만들기(Pizza as a Service)’로 비유해보기 1. IaaS (Infrastructure as a Service) 정의: 물리적 서버, 네트워크, 저장소(하드웨어)와 같은 인프라만 빌려주는 모델입니다. 내가 할 일: OS(Windows, Linux) 설치, 런타임 설정, 데이터 관리, 보안 설정 등 거의 전부. 비유...","categories": ["cloud"],
        "tags": ["iaas","paas","saas","faas","linux-master-1"],
        "url": "/cloud/2026/03/05/iaas-paas-saas-faas/",
        "teaser": null
      },{
        "title": "리눅스·오픈소스 라이선스 개요",
        "excerpt":"Linux License 개요 리눅스 생태계는 ‘자유로운 소프트웨어’를 지향하지만, 그 자유를 보장하는 방식(의무사항)에 따라 여러 라이선스로 나뉩니다. 크게 ‘강한 제약’이 있는 것과 ‘느슨한 제약’이 있는 것으로 구분하면 이해하기 쉽습니다. 1. GPL (GNU General Public License) 리눅스 커널이 채택한 가장 대표적인 라이선스입니다. ‘카피레프트(Copyleft)’의 정신을 가장 잘 보여줍니다. 핵심: GPL 코드를 사용해 새로운...","categories": ["linux","license"],
        "tags": ["gpl","lgpl","bsd","apache","mit","linux-master-1"],
        "url": "/linux/license/2026/03/05/linux-licenses-overview/",
        "teaser": null
      },{
        "title": "메모리 할당과 스왑/가상 메모리",
        "excerpt":"Memory allocation 메모리 할당이라는 제목만 정리해 두고, 스왑/가상 메모리와 연결해서 정리하는 노트. 프로세스가 실행되려면 코드, 데이터, 스택, 힙 등 여러 영역에 대해 연속된 논리 주소 공간이 필요합니다. 운영체제는 실제 물리 메모리(RAM)에 이 논리 주소를 매핑하면서, 필요한 만큼만 실제 메모리를 할당합니다. 하지만 모든 프로세스가 동시에 많은 메모리를 요구하면 RAM이 부족해지고, 이때...","categories": ["linux"],
        "tags": ["memory","allocation","swap","linux-master-1"],
        "url": "/linux/2026/03/05/memory-allocation/",
        "teaser": null
      },{
        "title": "Memory Swap",
        "excerpt":"Memory Swap Memory Swap(스왑 메모리)은 물리적 메모리(RAM)가 꽉 찼을 때, 운영체제가 하드디스크나 SSD의 일부 공간을 메모리처럼 활용하는 가상 메모리(Virtual Memory) 기술입니다. RAM 부족 시 사용 빈도가 낮은 데이터를 디스크로 옮겨 시스템 멈춤을 방지하고 안정성을 높이지만, 디스크 속도가 훨씬 느려 성능 저하가 발생할 수 있습니다. 배경: 내 컴퓨터의 RAM이 8GB인데, 고사양...","categories": ["linux"],
        "tags": ["memory","swap","linux-master-1"],
        "url": "/linux/2026/03/05/memory-swap/",
        "teaser": null
      },{
        "title": "오픈소스 라이선스 리스크 관리",
        "excerpt":"오픈소스 라이선스 리스크 관리 _data/lm11/notes.md의 라이선스 비교 내용을 바탕으로, 실무에서 어떤 리스크를 주의해야 하는지 정리한 노트입니다. 1. 강한 카피레프트(GPL) 계열 리스크 GPL 코드를 제품에 통합하면, 그 제품 전체에 GPL 의무(소스 공개)가 전파될 수 있습니다. 폐쇄형 상용 제품에서 무심코 GPL 라이브러리를 통합하면, 나중에 소스 공개 요구가 들어올 수 있습니다. 따라서: GPL...","categories": ["linux","license"],
        "tags": ["oss","compliance","linux-master-1"],
        "url": "/linux/license/2026/03/05/oss-license-risk-management/",
        "teaser": null
      },{
        "title": "Pipe와 Pipeline",
        "excerpt":"Pipe 한 프로세스의 출력(Output)이 다른 프로세스의 입력(Input)으로 바로 이어지도록 연결하는 데이터 통로를 말합니다. 데이터가 물 흐르듯 한 방향으로만 흐르기 때문에 파이프라는 이름이 붙었습니다. 파이프라인(Pipeline)은 이러한 파이프 구조를 여러 개 연결하여 복잡한 작업을 단계별로 처리하는 전체 시스템을 의미 Pipe (|): 프로그램 → 프로그램 (A의 출력을 B의 입력으로) 예시: bash ps aux...","categories": ["linux"],
        "tags": ["pipe","pipeline","linux-master-1"],
        "url": "/linux/2026/03/05/pipe-and-pipeline/",
        "teaser": null
      },{
        "title": "Redirection과 입출력 흐름",
        "excerpt":"Redirection 프로그램의 입출력 방향을 바꾸는 것입니다. 보통 화면에 나올 결과물을 파일로 저장하거나, 키보드 대신 파일에서 데이터를 읽어올 때 사용합니다. 파이프가 ‘프로세스와 프로세스’를 연결한다면, 리디렉션은 ‘프로세스와 파일’을 연결한다. Redirection (&gt;): 프로그램 → 파일 (출력을 파일로 저장) 심볼릭 링크는 “A는 곧 B다”라는 관계를 정의하는 것이고, 리다이렉션은 “A로 갈 데이터를 B로 보내라”는 흐름을...","categories": ["linux"],
        "tags": ["redirection","io","linux-master-1"],
        "url": "/linux/2026/03/05/redirection-io-flow/",
        "teaser": null
      },{
        "title": "Serverless와 FaaS 비용 구조",
        "excerpt":"Serverless와 FaaS 비용 효율성 FaaS(Function as a Service) 핵심 정리 정의: 서버 전체를 띄우지 않고, 특정 ‘함수(기능)’가 필요할 때만 잠깐 실행하는 모델입니다. (Serverless의 핵심) 특징: 코드가 실행될 때만 비용이 발생하며, 평소에는 서버 비용이 0원입니다. 비유 (피자 조각 뷔페): 한 판을 시키는 게 아니라, 딱 한 입 먹고 싶을 때 한...","categories": ["cloud"],
        "tags": ["faas","serverless","cost","linux-master-1"],
        "url": "/cloud/2026/03/05/serverless-faas-cost/",
        "teaser": null
      },{
        "title": "Virtual Console과 TTY",
        "excerpt":"Virtual Console 실제 물리적인 콘솔은 하나지만, 커널이 이를 가상화하여 여러 개의 세션을 제공합니다. 마치 하나의 모니터와 키보드를 마치 여러 개의 독립된 터미널인 것처럼 나누어 사용하는 기능 보통 프로그램은 결과를 화면에 출력하기 위해 하드웨어를 직접 제어하고 싶어 합니다. 하지만 커널은 이를 허용하지 않고 중간에 가상 터미널 드라이버(TTY)를 둡니다. 추상화: 하드웨어와 프로세스의...","categories": ["linux"],
        "tags": ["tty","console","linux-master-1"],
        "url": "/linux/2026/03/05/virtual-console-tty/",
        "teaser": null
      }]
