import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  const username = event.queryStringParameters?.username;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Username is required" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  const { data, error } = await supabase
    .from('users_xp')
    .select('username, xp, level')
    .ilike('username', username);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error", details: error.message }),
      headers: { "Content-Type": "application/json" }
    };
  }

  if (!data || data.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "User not found" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  const player = data[0];
  return {
    statusCode: 200,
    body: JSON.stringify({ username: player.username, xp: player.xp, level: player.level }),
    headers: { "Content-Type": "application/json" }
  };
};
