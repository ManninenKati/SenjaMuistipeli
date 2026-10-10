import { getStore } from "@netlify/blobs";

const STORE_NAME = "senja-memory-game-stats";
const KEY = "counts";
const MAX_RETRIES = 12;

const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
};

function cleanCounts(value) {
  return {
    opens: Number.isFinite(Number(value?.opens)) ? Math.max(0, Number(value.opens)) : 0,
    completions: Number.isFinite(Number(value?.completions)) ? Math.max(0, Number(value.completions)) : 0,
  };
}

function responseJSON(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

async function getEntry(store) {
  const entry = await store.getWithMetadata(KEY, {
    type: "json",
    consistency: "strong",
  });
  if (!entry || entry.data == null) return null;
  return { counts: cleanCounts(entry.data), etag: entry.etag };
}

async function readCounts(store) {
  const entry = await getEntry(store);
  return entry?.counts ?? { opens: 0, completions: 0 };
}

async function increment(store, field) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const entry = await getEntry(store);

    if (!entry) {
      const initial = { opens: 0, completions: 0 };
      initial[field] = 1;
      const result = await store.setJSON(KEY, initial, { onlyIfNew: true });
      if (result.modified) return initial;
    } else {
      const next = { ...entry.counts, [field]: entry.counts[field] + 1 };
      const result = await store.setJSON(KEY, next, { onlyIfMatch: entry.etag });
      if (result.modified) return next;
    }

    await new Promise((resolve) => setTimeout(resolve, 12 + attempt * 8));
  }

  throw new Error("Counter update conflict");
}

export default async (req) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    return responseJSON(await readCounts(store));
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return responseJSON({ error: "Virheellinen pyyntö" }, 400);
    }

    if (body?.action === "open") {
      return responseJSON(await increment(store, "opens"));
    }

    if (body?.action === "complete") {
      return responseJSON(await increment(store, "completions"));
    }

    return responseJSON({ error: "Tuntematon toiminto" }, 400);
  }

  return responseJSON({ error: "Metodi ei ole sallittu" }, 405);
};
