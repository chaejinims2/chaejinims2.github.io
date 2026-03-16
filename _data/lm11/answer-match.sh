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

# 과목별 카운트 (associative array)
declare -A correct
declare -A total

# 초기화
for subj in 1 2 3; do
    correct[$subj]=0
    total[$subj]=0
done

# 일치하는 개수 계산 및 과목별 카운트
MATCH_COUNT=0
for ((i=0; i<$MIN_LEN; i++)); do
    # 문제 번호 (1-based)
    qnum=$((i+1))
    if [ $qnum -le 20 ]; then
        subj=1
    elif [ $qnum -le 60 ]; then
        subj=2
    else
        subj=3
    fi
    ((total[$subj]++))
    if [ "${ANSWERS_ARRAY[$i]}" == "${CJIM_ARRAY[$i]}" ]; then
        ((MATCH_COUNT++))
        ((correct[$subj]++))
    fi
done

# 결과 출력: 과목별 정답률
for subj in 1 2 3; do
    if [ ${total[$subj]} -gt 0 ]; then
        percentage=$(( correct[$subj] * 100 / total[$subj] ))
        echo -n "${correct[$subj]}/${total[$subj]}(${percentage}%) "
    else
        echo -n "0/0(0%) "
    fi
done
echo
echo $MATCH_COUNT