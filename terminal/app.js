import { Terminal } from 'https://cdn.jsdelivr.net/npm/@xterm/xterm/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/@xterm/addon-fit/+esm';

const gatewayUrlEl = document.getElementById('gatewayUrl');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const terminalEl = document.getElementById('terminal');

const term = new Terminal({ cursorBlink: true, theme: { background: '#1e1e1e', foreground: '#d4d4d4' } });
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(terminalEl);
fitAddon.fit();

let ws = null;
let dataDisposable = null;

function writeStatus(msg) {
  term.write('\r\n\x1b[33m[status] ' + msg + '\x1b[0m\r\n');
}

function send(obj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

function disconnect() {
  const wasConnected = !!ws;
  if (ws) {
    ws.close();
    ws = null;
  }
  if (dataDisposable) {
    dataDisposable.dispose();
    dataDisposable = null;
  }
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  if (wasConnected) writeStatus('연결 종료');
}

function connect() {
  const url = gatewayUrlEl.value.trim();
  if (!url) {
    writeStatus('Gateway URL을 입력하세요.');
    return;
  }
  if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
    writeStatus('URL은 ws:// 또는 wss:// 로 시작해야 합니다.');
    return;
  }
  disconnect();
  term.clear();
  writeStatus('연결 중: ' + url);

  try {
    ws = new WebSocket(url);
  } catch (e) {
    writeStatus('연결 실패: ' + (e.message || String(e)));
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    return;
  }

  ws.onopen = () => {
    writeStatus('연결됨');
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    const { cols, rows } = term;
    send({ type: 'resize', cols, rows });
    dataDisposable = term.onData((data) => send({ type: 'input', data }));
  };

  ws.onmessage = (ev) => {
    if (typeof ev.data === 'string') term.write(ev.data);
    else ev.data.text().then((t) => term.write(t));
  };

  ws.onclose = () => {
    disconnect();
  };

  ws.onerror = () => {
    writeStatus('WebSocket 오류');
  };
}

connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);

let resizeTimeout = null;
window.addEventListener('resize', () => {
  fitAddon.fit();
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const { cols, rows } = term;
      send({ type: 'resize', cols, rows });
    }
    resizeTimeout = null;
  }, 100);
});
