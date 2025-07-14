import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAX_PAGES = 103;
const MAX_RETRIES = 10;

async function getProxies() {
  const { data, error } = await supabase.from('proxies').select('proxy_url');
  if (error || !data) throw new Error('Failed to load proxies from Supabase');
  return data.map(p => p.proxy_url);
}

async function fetchPage(page, proxies) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];

    let agent;
    try {
      agent = new HttpsProxyAgent(proxy);
    } catch {
      continue;
    }

    try {
      const res = await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/1317255994459426868?limit=100&page=${page}`, {
        agent,
        headers: {
          Authorization: process.env.MEE6_TOKEN,
          'User-Agent': 'XPCollector/1.0'
        },
        timeout: 15000
      });

      if (!res.ok) continue;

      const data = await res.json();
      return data.players || [];

    } catch {}
  }

  return [];
}

export const handler = async (event) => {
  if (event.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }

  try {
    const proxies = await getProxies();
    const allResults = await Promise.all(
      Array.from({ length: MAX_PAGES }, (_, i) => fetchPage(i, proxies))
    );

    const allPlayers = allResults.flat().filter(p => p && p.id && p.username);

    const unique = new Map();
    allPlayers.forEach(p => {
      unique.set(p.id, {
        discord_id: p.id,
        username: p.username,
        xp: p.xp,
        level: p.level
      });
    });

    const deduped = Array.from(unique.values());

    const { error } = await supabase
      .from('users_xp')
      .upsert(deduped, { onConflict: ['discord_id'] });

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'DB write failed', details: error.message }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'XP saved', total: deduped.length }),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error', details: err.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
