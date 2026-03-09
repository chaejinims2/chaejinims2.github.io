import { Terminal } from 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/+esm';

const gatewayUrlEl = document.getElementById('gatewayUrl');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const terminalEl = document.getElementById('terminal');

const term = new Terminal({ cursorBlink: true });
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(terminalEl);
fitAddon.fit();

let ws = null;
let onDataHandler = null;

function writeStatus(msg) {
  term.writeln('\r\n\x1b[33m[status] ' + msg + '\x1b[0m\r\n');
}

function send(obj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

function disconnect() {
  if (ws) {
    ws.close();
    ws = null;
  }
  if (onDataHandler) {
    term.off('data', onDataHandler);
    onDataHandler = null;
  }
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  writeStatus('연결 종료');
}

function connect() {
  const url = gatewayUrlEl.value.trim();
  if (!url) {
    writeStatus('Gateway URL을 입력하세요.');
    return;
  }
  disconnect();
  term.clear();
  writeStatus('연결 중: ' + url);

  ws = new WebSocket(url);

  ws.onopen = () => {
    writeStatus('연결됨');
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    const { cols, rows } = term;
    send({ type: 'resize', cols, rows });
    onDataHandler = (data) => send({ type: 'input', data });
    term.on('data', onDataHandler);
  };

  ws.onmessage = (ev) => {
    term.write(ev.data);
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
