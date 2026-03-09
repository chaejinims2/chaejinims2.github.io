const DEFAULT_CONFIG = {
  mode: localStorage.getItem("panel.mode") || "mock",
  apiBase: localStorage.getItem("panel.apiBase") || "http://100.91.93.1:8080"
};

const els = {
  modeSelect: document.getElementById("modeSelect"),
  apiBaseInput: document.getElementById("apiBaseInput"),
  saveConfigBtn: document.getElementById("saveConfigBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  connectionStatus: document.getElementById("connectionStatus"),
  lastRefresh: document.getElementById("lastRefresh"),
  globalMessage: document.getElementById("globalMessage"),
  systemSummary: document.getElementById("systemSummary"),
  diskUsage: document.getElementById("diskUsage"),
  inodeUsage: document.getElementById("inodeUsage"),
  networkStatus: document.getElementById("networkStatus"),
  serviceStatus: document.getElementById("serviceStatus"),
  actionButtons: document.querySelectorAll(".action-btn"),
  logTypeSelect: document.getElementById("logTypeSelect"),
  loadLogsBtn: document.getElementById("loadLogsBtn"),
  logViewer: document.getElementById("logViewer")
};

let config = { ...DEFAULT_CONFIG };

function saveConfig() {
  localStorage.setItem("panel.mode", config.mode);
  localStorage.setItem("panel.apiBase", config.apiBase);
}

function applyConfigToUI() {
  els.modeSelect.value = config.mode;
  els.apiBaseInput.value = config.apiBase;
}

function setMessage(message) {
  els.globalMessage.textContent = message;
}

function setConnectionStatus(state, text) {
  els.connectionStatus.className = "status-value";
  if (state === "ok") els.connectionStatus.classList.add("status-ok");
  else if (state === "error") els.connectionStatus.classList.add("status-error");
  else els.connectionStatus.classList.add("status-neutral");

  els.connectionStatus.textContent = text;
}

function setLastRefreshNow() {
  els.lastRefresh.textContent = new Date().toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderKV(container, obj) {
  const entries = Object.entries(obj);
  container.innerHTML = entries
    .map(([key, value]) => {
      return `
        <div class="kv-key">${escapeHtml(key)}</div>
        <div class="kv-value">${escapeHtml(value)}</div>
      `;
    })
    .join("");
}

function renderTable(container, columns, rows) {
  if (!rows || rows.length === 0) {
    container.innerHTML = "<p>No data.</p>";
    return;
  }

  const thead = `
    <thead>
      <tr>
        ${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${rows
        .map((row) => {
          return `
            <tr>
              ${columns
                .map((c) => `<td>${formatCell(row[c.key], c.key)}</td>`)
                .join("")}
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;

  container.innerHTML = `<table>${thead}${tbody}</table>`;
}

function formatCell(value, key) {
  if (key === "status") {
    const status = String(value).toLowerCase();
    if (status.includes("active") || status.includes("ok")) {
      return `<span class="badge badge-ok">${escapeHtml(value)}</span>`;
    }
    if (status.includes("warn") || status.includes("degraded")) {
      return `<span class="badge badge-warn">${escapeHtml(value)}</span>`;
    }
    return `<span class="badge badge-error">${escapeHtml(value)}</span>`;
  }
  return escapeHtml(value ?? "");
}

function getMockData() {
  return {
    systemSummary: {
      hostname: "rhombus",
      uptime: "2 days, 13 hours",
      loadAverage: "0.12 0.08 0.05",
      memory: "2.1G / 7.6G",
      cpu: "Intel Celeron",
      kernel: "Linux 6.x"
    },
    diskUsage: [
      { filesystem: "/dev/mmcblk1p5", size: "116G", used: "31G", avail: "80G", use: "28%", mount: "/" },
      { filesystem: "tmpfs", size: "3.9G", used: "4.0M", avail: "3.9G", use: "1%", mount: "/run" }
    ],
    inodeUsage: [
      { filesystem: "/dev/mmcblk1p5", inodes: "2624496", iused: "684960", ifree: "1939536", iuse: "27%", mount: "/" },
      { filesystem: "tmpfs", inodes: "992544", iused: "1197", ifree: "991347", iuse: "1%", mount: "/run" }
    ],
    networkStatus: [
      { interface: "enp1s0", address: "192.168.1.6", type: "ethernet", status: "active" },
      { interface: "wlo1", address: "192.168.1.7", type: "wifi", status: "active" },
      { interface: "tailscale0", address: "100.91.93.1", type: "tailscale", status: "active" },
      { interface: "wg0", address: "10.0.0.1", type: "wireguard", status: "inactive" }
    ],
    serviceStatus: [
      { service: "web-terminal-gateway", status: "active (running)", detail: "enabled" },
      { service: "tailscaled", status: "active (running)", detail: "enabled" },
      { service: "ssh", status: "active (running)", detail: "enabled" }
    ],
    logs: {
      gateway: `[mock] gateway started\n[mock] websocket bridge ready\n[mock] health check ok`,
      tailscale: `[mock] tailscaled running\n[mock] peer rhombus online`,
      system: `[mock] system boot complete\n[mock] network stable`
    }
  };
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${config.apiBase}${path}`, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

async function loadDashboardData() {
  setMessage("Loading...");
  try {
    let data;

    if (config.mode === "mock") {
      data = getMockData();
      setConnectionStatus("ok", "mock");
    } else {
      const [health, systemSummary, diskUsage, inodeUsage, networkStatus, serviceStatus] =
        await Promise.all([
          fetchJson("/api/health"),
          fetchJson("/api/system/summary"),
          fetchJson("/api/disk/usage"),
          fetchJson("/api/disk/inodes"),
          fetchJson("/api/network/interfaces"),
          fetchJson("/api/services/status")
        ]);

      data = {
        systemSummary,
        diskUsage,
        inodeUsage,
        networkStatus,
        serviceStatus,
        logs: {}
      };

      setConnectionStatus("ok", health.status || "connected");
    }

    renderKV(els.systemSummary, data.systemSummary);

    renderTable(
      els.diskUsage,
      [
        { key: "filesystem", label: "Filesystem" },
        { key: "size", label: "Size" },
        { key: "used", label: "Used" },
        { key: "avail", label: "Avail" },
        { key: "use", label: "Use%" },
        { key: "mount", label: "Mount" }
      ],
      data.diskUsage
    );

    renderTable(
      els.inodeUsage,
      [
        { key: "filesystem", label: "Filesystem" },
        { key: "inodes", label: "Inodes" },
        { key: "iused", label: "IUsed" },
        { key: "ifree", label: "IFree" },
        { key: "iuse", label: "IUse%" },
        { key: "mount", label: "Mount" }
      ],
      data.inodeUsage
    );

    renderTable(
      els.networkStatus,
      [
        { key: "interface", label: "Interface" },
        { key: "address", label: "Address" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" }
      ],
      data.networkStatus
    );

    renderTable(
      els.serviceStatus,
      [
        { key: "service", label: "Service" },
        { key: "status", label: "Status" },
        { key: "detail", label: "Detail" }
      ],
      data.serviceStatus
    );

    if (config.mode === "mock") {
      els.logViewer.textContent = data.logs[els.logTypeSelect.value] || "No logs.";
    }

    setLastRefreshNow();
    setMessage("Loaded");
  } catch (error) {
    console.error(error);
    setConnectionStatus("error", "error");
    setMessage(error.message);
  }
}

async function loadLogs() {
  setMessage("Loading logs...");
  try {
    if (config.mode === "mock") {
      const logs = getMockData().logs;
      els.logViewer.textContent = logs[els.logTypeSelect.value] || "No logs.";
      setMessage("Logs loaded");
      return;
    }

    const type = els.logTypeSelect.value;
    const data = await fetchJson(`/api/logs/${encodeURIComponent(type)}`);
    els.logViewer.textContent = data.content || "No logs.";
    setMessage("Logs loaded");
  } catch (error) {
    console.error(error);
    els.logViewer.textContent = `Failed to load logs: ${error.message}`;
    setMessage("Log load failed");
  }
}

async function runAction(action) {
  setMessage(`Running action: ${action}`);
  try {
    if (config.mode === "mock") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      els.logViewer.textContent = `[mock] action executed: ${action}`;
      setMessage(`Action complete: ${action}`);
      return;
    }

    const data = await fetchJson(`/api/actions/${encodeURIComponent(action)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    els.logViewer.textContent = data.output || JSON.stringify(data, null, 2);
    setMessage(`Action complete: ${action}`);
    await loadDashboardData();
  } catch (error) {
    console.error(error);
    els.logViewer.textContent = `Action failed: ${error.message}`;
    setMessage(`Action failed: ${action}`);
  }
}

function bindEvents() {
  els.saveConfigBtn.addEventListener("click", () => {
    config.mode = els.modeSelect.value;
    config.apiBase = els.apiBaseInput.value.trim() || DEFAULT_CONFIG.apiBase;
    saveConfig();
    setMessage("Config saved");
  });

  els.refreshBtn.addEventListener("click", loadDashboardData);
  els.loadLogsBtn.addEventListener("click", loadLogs);

  els.actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action) runAction(action);
    });
  });
}

function init() {
  applyConfigToUI();
  bindEvents();
  loadDashboardData();
}

init();