# 인자가 lm11-20260314 와 같이 key값이 들어오면
# exam.json 의 해당 key가 속한 것의 answer 필드와 cjim 필드의 값을 비교하여 cjim 필드의 값이 answer 필드의 값과 일치하는 경우를 +1하여 합산 값 출력

#!/bin/bash

# 인자 확인
if [ $# -ne 1 ]; then
    echo "Usage: $0 <key>"
    exit 1
fi

KEY=$1
EXAM_FILE="exams.json"

# jq를 사용하여 해당 key의 answers와 cjim 배열 추출
ANSWERS=$(jq -r ".[] | select(.key == \"$KEY\") | .answers[]" "$EXAM_FILE")
CJIM=$(jq -r ".[] | select(.key == \"$KEY\") | .cjim[]" "$EXAM_FILE")

# 배열로 변환
ANSWERS_ARRAY=($ANSWERS)
CJIM_ARRAY=($CJIM)

# 길이 확인
LEN_ANSWERS=${#ANSWERS_ARRAY[@]}
LEN_CJIM=${#CJIM_ARRAY[@]}

if [ $LEN_ANSWERS -ne $LEN_CJIM ]; then
    echo "Warning: answers and cjim arrays have different lengths ($LEN_ANSWERS vs $LEN_CJIM)"
fi

# 최소 길이로 비교
MIN_LEN=$(( LEN_ANSWERS < LEN_CJIM ? LEN_ANSWERS : LEN_CJIM ))

# 일치하는 개수 계산
MATCH_COUNT=0
for ((i=0; i<$MIN_LEN; i++)); do
    if [ "${ANSWERS_ARRAY[$i]}" == "${CJIM_ARRAY[$i]}" ]; then
        ((MATCH_COUNT++))
    fi
done

# 결과 출력
echo $MATCH_COUNT