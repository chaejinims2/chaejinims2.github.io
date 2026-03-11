#!/bin/bash
set -euo pipefail

# log/*.log 를 읽어서 result/*.rst 를 자동 생성한다.
# - 민감정보는 log 생성 단계에서 마스킹된다는 전제
# - result는 git에 남기고(log는 로컬만) 관리하기 위한 용도

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../" && pwd)"

JSON_FILE="${REPO_ROOT}/_data/lm11/prac/lm11-prac.json"
LOG_DIR="${REPO_ROOT}/_data/lm11/prac/log"
RESULT_DIR="${REPO_ROOT}/_data/lm11/prac/result"

mkdir -p "$RESULT_DIR"

python3 - <<'PY' "$JSON_FILE" "$LOG_DIR" "$RESULT_DIR"
import json, os, sys, re

json_path, log_dir, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]

def rst_escape(s: str) -> str:
    return s.replace("\\", "\\\\")

def underline(title: str, ch: str = "=") -> str:
    return ch * len(title)

def read_log(path: str) -> list[str]:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

def first_n_after_cmd(lines: list[str], n: int = 18) -> list[str]:
    if not lines:
        return []
    # 첫 줄은 보통 "user@host:~$ cmd"
    body = lines[1:] if len(lines) > 1 else []
    return body[:n]

def guess_highlights(cmd: str, lines: list[str]) -> list[str]:
    body = lines[1:] if len(lines) > 1 else []
    hl: list[str] = []

    if cmd.startswith("df"):
        for ln in body:
            if re.search(r"\s/\s*$", ln):
                hl.append(f"- 루트(/) 사용량 행: ``{rst_escape(ln.strip())}``")
                break
    if cmd.startswith("lsblk"):
        for ln in body:
            if "mmcblk" in ln and "p5" in ln:
                hl.append(f"- mmcblk 관련 행 예시: ``{rst_escape(ln.strip())}``")
                break
    if cmd.startswith("cat /etc/fstab"):
        for ln in body:
            if ln.strip().startswith("UUID=") and " /" in ln:
                hl.append(f"- 루트(/) 마운트 항목: ``{rst_escape(ln.strip())}``")
                break
    if cmd.startswith("ss -t"):
        estab = sum(1 for ln in body if ln.startswith("ESTAB"))
        if estab:
            hl.append(f"- ESTAB(TCP 연결 성립) 라인 수: **{estab}**")
    if cmd.startswith("ss -u"):
        hl.append(f"- UDP 소켓 라인 수(헤더 제외): **{max(0, len(body)-1)}**")
    if cmd.startswith("kill -l"):
        hl.append("- 시그널 번호/이름 매핑 확인 가능 (예: SIGTERM=15, SIGKILL=9)")
    if cmd.startswith("systemctl status"):
        for ln in body[:40]:
            if "Active:" in ln:
                hl.append(f"- 서비스 상태(Active): ``{rst_escape(ln.strip())}``")
                break
            if "State:" in ln:
                hl.append(f"- 시스템 상태(State): ``{rst_escape(ln.strip())}``")
                break

    return hl

with open(json_path, "r", encoding="utf-8") as f:
    items = json.load(f)

for idx, item in enumerate(items, start=1):
    cmd = (item.get("cmd") or "").strip()
    title = (item.get("title") or "").strip()
    desc = (item.get("description") or "").strip()

    nn = f"{idx:02d}"
    log_path = os.path.join(log_dir, f"{nn}.log")
    out_path = os.path.join(out_dir, f"{nn}.rst")

    lines = read_log(log_path)

    page_title = f"{cmd} 에서 알 수 있는 정보" if cmd else f"{nn}.log 에서 알 수 있는 정보"
    out: list[str] = []
    out.append(page_title)
    out.append(underline(page_title, "="))
    out.append("")

    if title or desc:
        out.append("요약")
        out.append(underline("요약", "-"))
        if title:
            out.append(f"- 제목: **{rst_escape(title)}**")
        if desc and desc != title:
            out.append(f"- 설명: {rst_escape(desc)}")
        out.append("")

    if not lines:
        out.append("주의")
        out.append(underline("주의", "-"))
        out.append(f"- 로그 파일이 없습니다: ``{rst_escape(log_path)}``")
        out.append("- `lm11-prac.sh` 실행 후 다시 생성하세요.")
        out.append("")
    else:
        hl = guess_highlights(cmd, lines)
        if hl:
            out.append("로그에서 바로 읽히는 포인트")
            out.append(underline("로그에서 바로 읽히는 포인트", "-"))
            out.extend(hl)
            out.append("")

        out.append("로그 주요 출력(일부)")
        out.append(underline("로그 주요 출력(일부)", "-"))
        out.append("")
        out.append(".. code-block:: text")
        out.append("")
        snippet = [lines[0]] + first_n_after_cmd(lines, n=18)
        for ln in snippet:
            out.append(f"  {ln}")
        out.append("")

        out.append("확인 포인트(체크리스트)")
        out.append(underline("확인 포인트(체크리스트)", "-"))
        out.append("- 출력에서 **핵심 컬럼 이름**(헤더)을 먼저 읽는다.")
        out.append("- 숫자/단위(%, bytes, blocks, port 등)를 보고 **무엇을 의미하는지** 말로 설명한다.")
        out.append("- 설정 파일이라면(예: fstab) “무엇을 어디에 어떻게 마운트하는지”를 한 문장으로 요약한다.")
        out.append("")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(out).rstrip() + "\n")

print(f"Wrote {len(items)} result file(s) to {out_dir}")
PY

