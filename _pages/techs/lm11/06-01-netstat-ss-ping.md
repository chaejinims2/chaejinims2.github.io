---
layout: page
title: 네트워크 명령어 (netstat / ss / ping)
---

리눅스마스터 1급에서 네트워크 명령어는 다음 세 가지가 핵심입니다.
	•	ping
	•	netstat
	•	ss

시험에서는 주로
① 명령어 기능
② 옵션 의미
③ 출력 결과 해석
을 묻습니다.

아래는 개념 → 주요 옵션 → 출력 해석 → 실전 문제 → 시험 함정 순서로 정리합니다.

⸻

1. ping

역할

ping은 네트워크 연결 상태 확인 명령어입니다.

동작 원리

ICMP Echo Request
ICMP Echo Reply

즉 ICMP 프로토콜을 사용합니다.

⸻

기본 구조

ping [옵션] 호스트

예

ping google.com


⸻

주요 옵션

옵션	의미
-c	패킷 횟수
-i	전송 간격
-s	패킷 크기
-q	요약 출력


⸻

예

ping -c 4 google.com

→ 4번만 ping

⸻

출력 예

64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=10.3 ms

필드 의미

필드	의미
icmp_seq	패킷 번호
ttl	Time To Live
time	응답 시간


⸻

2. netstat

역할

네트워크 연결 상태 확인

예

netstat


⸻

주요 옵션

옵션	의미
-a	모든 연결
-t	TCP
-u	UDP
-l	listening
-n	포트 숫자
-p	프로세스


⸻

자주 사용되는 명령

netstat -tuln

의미

TCP + UDP
Listening
Port number


⸻

출력 예

Proto Local Address Foreign Address State
tcp   0.0.0.0:22     0.0.0.0:*      LISTEN

필드

필드	의미
Proto	프로토콜
Local Address	로컬 주소
Foreign Address	원격 주소
State	상태


⸻

TCP 상태

상태	의미
LISTEN	연결 대기
ESTABLISHED	연결됨
TIME_WAIT	종료 대기
CLOSE_WAIT	종료 대기

시험에서 LISTEN이 가장 많이 나옵니다.

⸻

3. ss

역할

netstat의 대체 명령어

더 빠르고 최신

⸻

기본 구조

ss [옵션]


⸻

주요 옵션

옵션	의미
-t	TCP
-u	UDP
-l	listening
-n	숫자 출력
-p	프로세스


⸻

예

ss -tuln

→ netstat -tuln 동일

⸻

4. netstat vs ss

명령어	특징
netstat	오래된 도구
ss	빠르고 최신

최근 Linux는 ss 권장.

⸻

5. 실전 문제

⸻

문제 1

다음 명령어 의미

ping -c 3 host

정답

3번 ping 전송


⸻

문제 2

다음 중 ping이 사용하는 프로토콜

정답

ICMP


⸻

문제 3

다음 명령어 의미

netstat -tuln

정답

TCP/UDP listening 포트 출력


⸻

문제 4

다음 중 LISTEN 의미

정답

연결 대기 상태


⸻

문제 5

다음 명령어 의미

ss -t

정답

TCP 연결 표시


⸻

문제 6

다음 중 UDP 연결 확인

정답

netstat -u

또는

ss -u


⸻

6. 시험 함정

함정 1

ping = TCP 테스트

❌ 틀림

정답

ICMP


⸻

함정 2

netstat = 패킷 전송

❌ 틀림

정답

연결 상태 확인


⸻

함정 3

LISTEN = 연결 완료

❌ 틀림

정답

연결 대기


⸻

7. 시험 직전 암기

ping

ICMP
연결 확인
-c 횟수


⸻

netstat

-a 모든 연결
-t TCP
-u UDP
-l LISTEN
-n 숫자
-p 프로세스


⸻

ss

netstat 대체


⸻

핵심 요약

ping   = 네트워크 연결 테스트
netstat = 연결 상태 확인
ss     = netstat 대체


⸻

원하시면 리눅스마스터 1급에서 매우 자주 출제되는 마지막 핵심 영역
	•	tar / gzip 압축 문제
	•	부팅 과정 문제 (runlevel / systemd)
	•	cron / at 스케줄 문제

까지 시험 대비 최종 정리로 만들어 드리겠습니다.