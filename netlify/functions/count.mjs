import { getStore } from "@netlify/blobs";

const STORE_NAME = "visitor-count";
const KEY_TOTAL = "total";
const KEY_DAILY_PREFIX = "daily:";

function todayKey() {
  const d = new Date();
  return KEY_DAILY_PREFIX + d.getUTCFullYear() + "-" +
    String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
    String(d.getUTCDate()).padStart(2, "0");
}

function getClientIp(req) {
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "";
}

function getExcludedIps() {
  const raw = process.env.VISITOR_COUNT_EXCLUDE_IPS || "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders(),
    });
  }

  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const keyDaily = todayKey();

    const [totalStr, dailyStr] = await Promise.all([
      store.get(KEY_TOTAL),
      store.get(keyDaily),
    ]);

    const excludedIps = getExcludedIps();
    const clientIp = getClientIp(req);
    const isExcluded = clientIp && excludedIps.length > 0 && excludedIps.includes(clientIp);

    let today, total;
    if (isExcluded) {
      total = Math.max(0, parseInt(totalStr || "0", 10));
      today = Math.max(0, parseInt(dailyStr || "0", 10));
    } else {
      total = Math.max(0, parseInt(totalStr || "0", 10)) + 1;
      today = Math.max(0, parseInt(dailyStr || "0", 10)) + 1;
      await Promise.all([
        store.set(KEY_TOTAL, String(total)),
        store.set(keyDaily, String(today)),
      ]);
    }

    return new Response(JSON.stringify({ today, total }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (err) {
    console.error("count function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
};
