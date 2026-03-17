# 인자가 lm11-20260314 와 같이 key값과 공백을 포함하지 않는 숫자가 들어오면
# exam.json 의 해당 key가 속한 것의 cjim 필드에 값 추가 및 anwer-match.sh 를 실행하여 일치하는 개수 출력

#!/bin/bash

# 인자 확인
if [ $# -ne 2 ]; then
    echo "Usage: $0 <key> <numbers>"
    exit 1
fi

KEY=$1
NUMBERS=$2

# NUMBERS가 숫자로만 구성되어 있는지 확인
if ! [[ $NUMBERS =~ ^[0-9]+$ ]]; then
    echo "Error: Second argument must be a string of digits"
    exit 1
fi

EXAM_FILE="exams.json"
TEMP_FILE="exams_temp.json"

# NUMBERS를 jq 배열 형식으로 변환
JQ_ARRAY=$(echo "$NUMBERS" | sed 's/./& /g' | sed 's/ $//' | sed 's/ /,/g' | sed 's/^/[/; s/$/]/')

# jq를 사용하여 해당 key의 cjim 배열에 추가
jq "map(if .key == \"$KEY\" then .answers += $JQ_ARRAY else . end)" "$EXAM_FILE" > "$TEMP_FILE"

# 임시 파일을 원본으로 교체
mv "$TEMP_FILE" "$EXAM_FILE"

# answer-match.sh 실행
./answer-match.sh "$KEY"