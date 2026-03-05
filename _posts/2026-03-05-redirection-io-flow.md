---
title: Redirection과 입출력 흐름
date: 2026-03-05 00:00:00 +0900
section: techs
categories:
  - linux
tags:
  - redirection
  - io
  - linux-master-1
---

# Redirection

프로그램의 입출력 방향을 바꾸는 것입니다. 보통 화면에 나올 결과물을 파일로 저장하거나, 키보드 대신 파일에서 데이터를 읽어올 때 사용합니다.

- 파이프가 **'프로세스와 프로세스'**를 연결한다면,
  리디렉션은 **'프로세스와 파일'**을 연결한다.
- Redirection (`>`): **프로그램 → 파일** (출력을 파일로 저장)
- 심볼릭 링크는 **"A는 곧 B다"**라는 관계를 정의하는 것이고,  
  리다이렉션은 **"A로 갈 데이터를 B로 보내라"**는 흐름을 제어하는 것

예시:
bash
ls > files.txt # 화면 대신 files.txt에 저장
cat input.txt | wc # 파일 내용을 파이프로 다른 프로그램에 전달