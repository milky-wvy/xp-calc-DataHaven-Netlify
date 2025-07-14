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
      const res = await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/1317255994459426868?limit=100&p
