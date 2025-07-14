const levels = [
  { xp: 1150, keys: '1 key' },
  { xp: 4675, keys: '2 keys' },
  { xp: 11825, keys: '2 keys' },
  { xp: 23850, keys: '2 keys' },
  { xp: 42000, keys: '2 keys' },
  { xp: 67525, keys: '3 keys' },
  { xp: 101675, keys: '3 keys' }
];

let leaderboardPage = 0;
let loadingMore = false;

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
      topStats.innerHTML = statsHTML;
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

    topStats.innerHTML = statsHTML;
    bottomStats.innerHTML = progressHTML;

  } catch (e) {
    topStats.innerHTML = `<div class="error">❌ ${e.message}</div>`;
  }
}

async function loadLeaderboardPage() {
  if (loadingMore) return;
  loadingMore = true;
  leaderboardPage++;

  try {
    const res = await fetch(`/.netlify/functions/leaderboard?page=${leaderboardPage}`);
    const data = await res.json();

    const list = document.getElementById('leaderboardList');
    data.forEach((u, i) => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>#${(leaderboardPage - 1) * 20 + i + 1}</strong> ${u.username} — ${u.xp.toLocaleString()} XP — Level ${u.level}`;
      list.appendChild(item);
    });
  } catch (e) {
    console.warn('Leaderboard load error:', e);
  } finally {
    loadingMore = false;
  }
}

window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom) loadLeaderboardPage();
});

window.onload = () => {
  const savedXP = localStorage.getItem('xpInput');
  if (savedXP) {
    document.getElementById('xpInput').value = savedXP;
    calculateXP();
  }
  loadLeaderboardPage();
};

document.getElementById('themeSwitch').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const bg = document.getElementById('background');
  bg.style.backgroundImage = document.body.classList.contains('dark')
    ? "url('background_night.png')"
    : "url('background_day.png')";
});
