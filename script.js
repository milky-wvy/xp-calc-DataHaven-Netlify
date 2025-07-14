const levels = [
  { xp: 1150, keys: '1 key' },
  { xp: 4675, keys: '2 keys' },
  { xp: 11825, keys: '2 keys' },
  { xp: 23850, keys: '2 keys' },
  { xp: 42000, keys: '2 keys' },
  { xp: 67525, keys: '3 keys' },
  { xp: 101675, keys: '3 keys' }
];

const loadedUserIds = new Set();
let leaderboardOffset = 0;
const leaderboardLimit = 20;
let isLoadingMore = false;

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

    let statsHTML = `
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

async function loadLeaderboard() {
  if (isLoadingMore) return;
  isLoadingMore = true;

  try {
    const res = await fetch(`/.netlify/functions/leaderboard?offset=${leaderboardOffset}&limit=${leaderboardLimit}`);
    const data = await res.json();

    const list = document.getElementById('leaderboardList');

    data.forEach((user, index) => {
      if (loadedUserIds.has(user.discord_id)) return;

      loadedUserIds.add(user.discord_id);

      const li = document.createElement('li');
      li.innerHTML = `#${leaderboardOffset + index + 1} <b>${user.username}</b> — ${user.xp.toLocaleString()} XP<br/>Level ${user.level}`;
      list.appendChild(li);
    });

    leaderboardOffset += leaderboardLimit;
  } catch (err) {
    console.error('Failed to load leaderboard:', err);
  } finally {
    isLoadingMore = false;
  }
}

window.onload = () => {
  const savedXP = localStorage.getItem('xpInput');
  if (savedXP) {
    document.getElementById('xpInput').value = savedXP;
    calculateXP();
  }
  loadLeaderboard();
};

document.getElementById('leaderboardList').addEventListener('scroll', () => {
  const list = document.getElementById('leaderboardList');
  if (list.scrollTop + list.clientHeight >= list.scrollHeight - 10) {
    loadLeaderboard();
  }
});

document.getElementById('themeSwitch').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('background').style.backgroundImage = isDark
    ? "url('background_night.png')"
    : "url('background_day.png')";

  const button = document.getElementById('themeSwitch');
  button.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});
