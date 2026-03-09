---
layout: page
title: 01-03 링크 (Hard / Symbolic Link)
---

리눅스마스터 1급 시험에서 **링크(Link)** 문제는 매우 자주 출제됩니다.
핵심은 **Hard Link vs Symbolic Link 차이**입니다.

아래는 **파일 시스템 구조 → Hard Link → Symbolic Link → 차이 → 시험 문제 → 함정** 순서로 설명합니다.

---

# 1. 링크(Link) 개념

리눅스 파일 시스템에서 파일은 **이름이 아니라 inode로 관리**됩니다.

구조

```text
파일명 → inode → 데이터
```

즉

```text
파일 이름 = inode를 가리키는 포인터
```

그래서 하나의 inode를 **여러 이름이 공유**할 수 있습니다.

이것이 **Hard Link**입니다.

---

# 2. Hard Link

Hard link는 **같은 inode를 공유하는 파일**입니다.

명령어

```bash
ln original linkfile
```

예

```bash
ln file1 file2
```

구조

```text
file1 → inode 123
file2 → inode 123
```

특징

| 특징     | 설명        |
| ------ | --------- |
| inode  | 동일        |
| 데이터    | 동일        |
| 파일 삭제  | 영향 없음     |
| 파일 시스템 | 같은 FS만 가능 |

예

```bash
rm file1
```

file2는 그대로 존재합니다.

---

# Hard Link 확인

```bash
ls -li
```

출력 예

```text
12345 file1
12345 file2
```

같은 inode 번호입니다.

---

# 3. Symbolic Link

Symbolic link는 **파일 경로를 가리키는 링크**입니다.

명령어

```bash
ln -s target link
```

예

```bash
ln -s file1 file2
```

구조

```text
file2 → file1 → inode
```

즉

```text
file2는 file1의 경로만 저장
```

---

# 특징

| 특징      | 설명            |
| ------- | ------------- |
| inode   | 다름            |
| 삭제 영향   | 원본 삭제 시 링크 깨짐 |
| 파일 시스템  | 다른 FS 가능      |
| 디렉터리 링크 | 가능            |

---

# Symbolic Link 확인

```bash
ls -l
```

출력

```text
file2 -> file1
```

---

# 4. Hard vs Symbolic 비교

| 항목     | Hard Link | Symbolic Link |
| ------ | --------- | ------------- |
| inode  | 동일        | 다름            |
| 파일 삭제  | 영향 없음     | 링크 깨짐         |
| 파일 시스템 | 동일 FS     | 다른 FS 가능      |
| 디렉터리   | 불가        | 가능            |
| 명령     | ln        | ln -s         |

---

# 5. 실전 시험 문제

### 문제 1

심볼릭 링크 생성

정답

```bash
ln -s file1 file2
```

---

### 문제 2

같은 inode 공유

정답

```text
Hard Link
```

---

### 문제 3

원본 삭제 시 링크 깨짐

정답

```text
Symbolic Link
```

---

### 문제 4

다른 파일 시스템 연결 가능

정답

```text
Symbolic Link
```

---

### 문제 5

inode 번호 동일

정답

```text
Hard Link
```

---

# 6. 시험 함정

### 함정 1

```text
Symbolic link = inode 동일
```

❌ 틀림

---

### 함정 2

```text
Hard link = 다른 파일 시스템 가능
```

❌ 틀림

---

### 함정 3

```text
Hard link = 디렉터리 가능
```

❌ 틀림

---

# 7. 시험 직전 암기

Hard link

```text
inode 동일
파일 삭제 영향 없음
같은 파일 시스템
```

---

Symbolic link

```text
경로 링크
inode 다름
원본 삭제 시 깨짐
```

---

# 핵심 요약

```text
Hard Link = 같은 inode
Symbolic Link = 경로 링크
```

---

추가로 하나 알려드리면
**리눅스마스터 시험에서 링크 문제는 거의 항상 다음 문제 형태로 나옵니다.**

예

```bash
ln file1 file2
```

이때

```text
file1 삭제 후 file2 상태?
```

정답

```text
정상 사용 가능
```

---

원하시면 다음으로 **시험에서 Hard link보다 더 많이 나오는**

👉 **df vs du (디스크 사용량 문제)**

를 설명해 드리겠습니다.
이건 **리눅스 시험 단골 함정 문제**입니다.
