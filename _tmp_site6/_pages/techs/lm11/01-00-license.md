리눅스마스터 1급 1차 시험에서 라이선스 문제는 보통 1~2문제 정도 출제되며, 핵심은 Copyleft vs Permissive 라이선스 구분입니다.
리눅스 커널 자체는 GNU General Public License 을 사용합니다.

⸻

1. 오픈소스 라이선스 기본 구조

오픈소스 라이선스는 크게 두 종류로 구분됩니다.

Open Source License
 ├ Copyleft License
 │   └ GPL
 │
 └ Permissive License
     ├ BSD
     ├ MIT
     └ Apache

핵심 차이

구분	특징
Copyleft	수정 후 배포 시 소스 공개 의무
Permissive	수정 후 소스 공개 의무 없음


⸻

2. GPL (GNU General Public License)

대표적인 Copyleft 라이선스

특징

소스코드 공개 의무
2차 저작물도 GPL 적용
상업적 사용 가능

핵심 규칙

GPL 프로그램 수정 후 배포 → 소스코드 공개해야 함

대표 사례
	•	Linux Kernel
	•	GCC
	•	Bash

시험 포인트

GPL = 강한 Copyleft


⸻

3. LGPL (Lesser GPL)

GPL보다 완화된 Copyleft

특징

라이브러리용 라이선스
독점 소프트웨어에서 링크 가능
라이브러리 수정 시 소스 공개

대표 예

glibc

시험 포인트

LGPL → proprietary 프로그램과 함께 사용 가능


⸻

4. BSD License

대표적인 Permissive 라이선스

특징

소스 수정 가능
재배포 자유
소스 공개 의무 없음

시험 핵심

BSD = 제한 거의 없음

대표 OS
	•	FreeBSD
	•	NetBSD
	•	OpenBSD

⸻

5. MIT License

BSD와 거의 동일한 자유 라이선스

특징

소스 수정 자유
재배포 자유
상업적 사용 가능
소스 공개 의무 없음

시험 포인트

MIT = 가장 간단한 라이선스


⸻

6. Apache License 2.0

특징

소스 수정 가능
상업적 사용 가능
특허권 보호 포함

핵심

특허 보호 조항 존재

대표 프로젝트
	•	Apache HTTP Server
	•	Hadoop

⸻

7. 시험에 자주 나오는 비교

라이선스	소스 공개 의무	특징
GPL	있음	Copyleft
LGPL	일부	라이브러리
BSD	없음	자유
MIT	없음	매우 자유
Apache	없음	특허 보호


⸻

8. 시험에서 자주 나오는 함정

문제 유형 1

BSD / MIT 라이선스는 수정 시 소스 공개해야 한다

❌ 틀림

정답

소스 공개 의무 없음


⸻

문제 유형 2

GPL 프로그램 수정 후 배포 시 소스 공개해야 한다

⭕ 맞음

⸻

문제 유형 3

LGPL 라이브러리는 독점 프로그램에서 사용할 수 없다

❌ 틀림

정답

사용 가능


⸻

9. 시험 직전 암기

GPL  → 소스 공개 의무
LGPL → 라이브러리
BSD  → 자유
MIT  → 가장 자유
Apache → 특허 보호


⸻

10. 리눅스 시험 핵심

Linux Kernel → GPL v2


⸻

✔️ 정리하면 리눅스마스터 시험에서는

GPL
LGPL
BSD
MIT
Apache

이 5개만 정확히 구분하면 대부분 맞힙니다.

⸻

원하시면 제가 리눅스마스터 1급 1차에서 실제로 제일 많이 틀리는

Top 30 개념

을 시험 출제 패턴 기준으로 정리해 드리겠습니다.
(이건 기출 기반이라 실제 점수 차이가 꽤 납니다.)