import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event, context) {
  const { data, error } = await supabase
    .from('users_xp')
    .select('username, xp, level')
    .order('xp', { ascending: false })
    .limit(20); // выводим топ-20

  if (error) {
    console.error('Supabase error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
