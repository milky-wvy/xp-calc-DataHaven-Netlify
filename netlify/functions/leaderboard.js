import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  const params = event.queryStringParameters;
  const offset = parseInt(params.offset || '0');
  const limit = parseInt(params.limit || '20');

  const { data, error } = await supabase
    .from('users_xp')
    .select('discord_id, username, xp, level')
    .order('xp', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
