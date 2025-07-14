const levels = [
  { xp: 1150, keys: '1 key' },
  { xp: 4675, keys: '2 keys' },
  { xp: 11825, keys: '2 keys' },
  { xp: 23850, keys: '2 keys' },
  { xp: 42000, keys: '2 keys' },
  { xp: 67525, keys: '3 keys' },
  { xp: 101675, keys: '3 keys' }
];

async function calculateXP() {
  const username = document.getElementById('xpInput').value.trim();
  const topStats = document.getElementById('topStats');
  const bottomStats = document.getElementById('bottomStats');
  const message = document.getElementById('realMooseMessage');

  topStats.innerHTML = '';
  bottomStats.innerHTML = '';
  message.textContent = '';

  if (!username) return;

  try {
    const res = await fetch(`/.netlify/functions/get-xp?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Unknown error');

    const { xp, level } = data;
    const minute = xp / 9.5;
    const hour = minute / 60;
    const day = hour / 24;

    const statsHTML = `
      <h3>📊 Your Stats</h3>
      <p><strong>Username:</strong> ${data.username}</p>
      <p><strong>XP:</strong> ${xp.toLocaleString()}</p>
      <p><strong>Minutes:</strong> ${minute.toFixed(2)}</p>
      <p><strong>Hours:</strong> ${hour.toFixed(2)}</p>
      <p><strong>Days:</strong> ${day.toFixed(2)}</p>
    `;
    topStats.innerHTML = statsHTML;

    let target = 0, prev = 0, reward = '';
    for (let i = 0; i < levels.length; i++) {
      if (xp < levels[i].xp) {
        reward = levels[i].keys;
        target = levels[i].xp;
        prev = i === 0 ? 0 : levels[i - 1].xp;
        break;
      }
    }

    if (target === 0) {
      message.textContent = 'You are Real Moose!';
      return;
    }

    const left = target - xp;
    const minutesLeft = Math.round(left / 9.5);
    const days = Math.floor(minutesLeft / 1440);
    const hours = Math.floor((minutesLeft % 1440) / 60);
    const minutes = minutesLeft % 60;

    const progressHTML = `
      <h3>🔑 Progress</h3>
      <p><strong>To reach:</strong> ${reward}</p>
      <p><strong>XP left:</strong> ${left.toLocaleString()}</p>
      <p><strong>Time:</strong> ${days}d ${hours}h ${minutes}m</p>
    `;

    bottomStats.innerHTML = progressHTML;
  } catch (e) {
    topStats.innerHTML = `<div class="error">❌ ${e.message}</div>`;
  }
}

async function loadLeaderboardBatch(offset = 0, limit = 20) {
  const res = await fetch(`/.netlify/functions/leaderboard?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  return data || [];
}

let leaderboardOffset = 0;
const leaderboardList = document.getElementById('leaderboardList');
let isLoadingMore = false;

async function loadMoreLeaderboard() {
  if (isLoadingMore) return;
  isLoadingMore = true;
  const users = await loadLeaderboardBatch(leaderboardOffset);
  users.forEach((u, i) => {
    const li = document.createElement('li');
    li.innerHTML = `#${leaderboardOffset + i + 1} <strong>${u.username}</strong> — ${u.xp.toLocaleString()} XP<br/>Level ${u.level}`;
    leaderboardList.appendChild(li);
  });
  leaderboardOffset += users.length;
  isLoadingMore = false;
}

document.getElementById('themeSwitch').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const icon = document.getElementById('themeSwitch');
  icon.innerHTML = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

document.addEventListener('DOMContentLoaded', () => {
  const savedXP = localStorage.getItem('xpInput');
  if (savedXP) {
    document.getElementById('xpInput').value = savedXP;
    calculateXP();
  }
  loadMoreLeaderboard();
});

document.getElementById('leaderboard').addEventListener('scroll', (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
    loadMoreLeaderboard();
  }
});
