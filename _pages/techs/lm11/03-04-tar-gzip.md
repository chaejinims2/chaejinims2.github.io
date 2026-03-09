---
layout: page
title: 03-04 압축 (tar / gzip)
---

리눅스마스터 1급에서 압축 관련 문제는 거의 항상 등장하며, 핵심은 두 가지입니다.
	•	tar (파일 묶기 + 압축 옵션)
	•	gzip (단일 파일 압축)

시험은 보통 옵션 의미 / 명령어 해석 / 파일 확장자 형태로 출제됩니다.

아래는 개념 → 옵션 → 확장자 → 실전 문제 → 시험 함정 순서로 정리합니다.

⸻

1. tar 기본 개념

tar는 여러 파일을 하나로 묶는 아카이브(archive) 도구입니다.
원래는 압축 기능이 아니라 묶기 기능입니다.

구조

tar [옵션] 파일

예

tar -cvf backup.tar dir

의미

dir 디렉터리를 backup.tar로 묶기

옵션

옵션	의미
c	create
x	extract
v	verbose
f	file


⸻

2. tar 주요 옵션

생성

tar -cvf file.tar dir

설명

c = 생성
v = 과정 출력
f = 파일 이름 지정


⸻

압축 해제

tar -xvf file.tar

설명

x = extract


⸻

특정 디렉터리로 압축 해제

tar -xvf file.tar -C /tmp


⸻

3. gzip

gzip 은 파일 압축 도구입니다.

특징

단일 파일 압축

예

gzip file

결과

file.gz


⸻

압축 해제

gunzip file.gz

또는

gzip -d file.gz


⸻

4. tar + gzip

실무에서는 tar와 gzip을 같이 사용합니다.

⸻

압축

tar -zcvf file.tar.gz dir

옵션

옵션	의미
z	gzip 압축


⸻

압축 해제

tar -zxvf file.tar.gz


⸻

5. 확장자 정리

확장자	의미
.tar	묶기
.gz	gzip
.tar.gz	tar + gzip
.tgz	tar.gz


⸻

6. bzip2

bzip2 는 gzip보다 높은 압축률을 제공합니다.

압축

bzip2 file

결과

file.bz2


⸻

tar + bzip2

압축

tar -jcvf file.tar.bz2 dir

해제

tar -jxvf file.tar.bz2

옵션

j = bzip2


⸻

7. 옵션 정리

옵션	의미
c	생성
x	압축 해제
v	과정 출력
f	파일 지정
z	gzip
j	bzip2


⸻

8. 실전 문제

⸻

문제 1

다음 명령어 의미

tar -cvf backup.tar dir

정답

dir을 backup.tar로 묶기


⸻

문제 2

다음 명령어 의미

tar -xvf file.tar

정답

tar 파일 압축 해제


⸻

문제 3

다음 명령어 의미

tar -zcvf file.tar.gz dir

정답

dir을 gzip 압축 tar 생성


⸻

문제 4

다음 명령어 의미

gzip file

정답

file을 gzip 압축


⸻

문제 5

다음 중 gzip 해제

정답

gunzip file.gz

또는

gzip -d file.gz


⸻

9. 시험 함정

함정 1

tar = 압축 프로그램

❌ 틀림

정답

archive (묶기)


⸻

함정 2

gzip = 여러 파일 압축

❌ 틀림

단일 파일


⸻

함정 3

tar -cvf

gzip 압축

❌ 틀림

gzip 압축은

tar -zcvf


⸻

10. 시험 직전 암기

tar

c = create
x = extract
v = verbose
f = file


⸻

압축 옵션

z = gzip
j = bzip2


⸻

핵심 요약

tar     = 묶기
gzip    = 압축
tar.gz  = 묶기 + 압축


⸻

원하시면 마지막으로 리눅스마스터 1급에서 가장 자주 나오는 마지막 핵심 영역
	•	부팅 과정 문제 (runlevel / systemd / init)
	•	cron / at 스케줄 문제
	•	환경변수 문제 (PATH / export)

까지 시험 대비 최종 핵심 요약으로 정리해 드리겠습니다.