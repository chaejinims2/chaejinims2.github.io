import { Terminal } from 'https://cdn.jsdelivr.net/npm/@xterm/xterm/+esm';
import { FitAddon } from 'https://cdn.jsdelivr.net/npm/@xterm/addon-fit/+esm';

const WS_URL = 'ws://100.91.93.1:8080';
const terminalEl = document.getElementById('terminal');
const connectBtn = document.getElementById('connect');
const disconnectBtn = document.getElementById('disconnect');
const statusEl = document.getElementById('status');

let term;
let fitAddon;
let ws;

function setStatus(text) {
  statusEl.textContent = text;
}

function initTerminal() {
  if (term) return;
  term = new Terminal({ cursorBlink: true, theme: { background: '#1e1e1e', foreground: '#d4d4d4' } });
  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminalEl);
  fitAddon.fit();

  term.onData((data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'input', data }));
    }
  });

  const sendResize = () => {
    if (ws && ws.readyState === WebSocket.OPEN && term) {
      ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
    }
  };

  window.addEventListener('resize', () => {
    fitAddon.fit();
    sendResize();
  });
}

function connect() {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) return;
  initTerminal();
  setStatus('Connecting');
  connectBtn.disabled = true;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    setStatus('Connected');
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    term.write('[Connected to rhombus]\r\n');
    ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
  };

  ws.onmessage = (ev) => {
    if (typeof ev.data === 'string') term.write(ev.data);
    else ev.data.text().then((t) => term.write(t));
  };

  ws.onerror = () => {
    term.write('[Connection failed]\r\n');
  };

  ws.onclose = () => {
    setStatus('Disconnected');
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    ws = null;
  };
}

function disconnect() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);

initTerminal();
