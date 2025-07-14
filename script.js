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

    let target = 0, reward = '';
    for (let i = 0; i < levels.length; i++) {
      if (xp < levels[i].xp) {
        reward = levels[i].keys;
        target = levels[i].xp;
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
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '<li>Loading...</li>';

  try {
    const res = await fetch('/.netlify/functions/leaderboard');
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error('Invalid leaderboard data');

    leaderboardList.innerHTML = data.map((user, i) => `
      <li><strong>#${i + 1}</strong> ${user.username} — ${user.xp.toLocaleString()} XP — Level ${user.level}</li>
    `).join('');
  } catch (err) {
    leaderboardList.innerHTML = '<li>Error loading leaderboard</li>';
    console.error(err);
  }
}

window.onload = () => {
  const saved = localStorage.getItem('xpInput');
  if (saved) {
    document.getElementById('xpInput').value = saved;
    calculateXP();
  }
  loadLeaderboard();
};
