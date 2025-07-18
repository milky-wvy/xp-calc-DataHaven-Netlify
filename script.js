/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: transparent;
  overflow: hidden;
}

#background {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('background_day.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.3s ease-in-out;
}

/* MAIN STRUCTURE */
main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 1rem;
  height: 100%;
  overflow: hidden;
}

#mainContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

h1 {
  text-align: center;
  margin: 10px auto;
  font-size: 2rem;
  font-weight: 700;
  background: #5a3223;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  display: inline-block;
}

body.dark h1 {
  color: #fff;
}

#search {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 0.5rem;
}

#xpInput {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 300px;
  font-size: 1rem;
}

#search button {
  padding: 0.6rem 1rem;
  background: #5a3223;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1rem;
}

#search button:hover {
  background: #3d2217;
}

/* STATS & PROGRESS */
#statsWrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

#statsWrapper.center {
  align-items: center;
}

.stats-box {
  background: rgba(245, 245, 220, 0.9);
  padding: 1rem;
  border-radius: 12px;
  width: 300px;
  border: 2px solid #5a3223;
  backdrop-filter: blur(8px);
}

#topStats {
  width: 350px;
}

.stats-box:empty {
  display: none;
}

body.dark .stats-box {
  background: rgba(0, 0, 0, 0.65);
  color: white;
  border: 2px solid #5a3223;
}

#realMooseMessage {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  background: #5a3223;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
}

#realMooseMessage:empty {
  display: none;
}

body.dark #realMooseMessage {
  color: #fff;
}

/* LEADERBOARD */
#leaderboard {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 300px;
  height: calc(100% - 80px);
  background: rgba(245, 245, 220, 0.9);
  border-radius: 12px;
  padding: 1rem;
  overflow-y: auto;
  border: 2px solid #5a3223;
  backdrop-filter: blur(8px);
}

body.dark #leaderboard {
  background: rgba(0, 0, 0, 0.65);
  color: white;
  border: 2px solid #5a3223;
}

#leaderboard h3 {
  margin-bottom: 0.8rem;
}

#leaderboardList {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#leaderboardList li {
  background: #f5f5dc;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #5a3223;
  box-shadow: 0 0 4px rgba(0,0,0,0.05);
}

body.dark #leaderboardList li {
  background: #2d2d2d;
  color: white;
  border: 1px solid #5a3223;
}

/* THEME SWITCH */
#themeSwitch {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: #5a3223;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.3s;
}

#themeSwitch:hover {
  background: #3a1f13;
}

/* AUTHOR & DONATE BUTTONS */
#authorButton, #donateButton {
  font-size: 1.1rem;
  padding: 0.6rem 1.2rem;
}

#authorButton {
  position: absolute;
  bottom: 40px;
  right: 180px;
  background: #5a3223;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.3s;
}

#authorButton:hover {
  background: #3a1f13;
}

#donateButton {
  position: absolute;
  bottom: 40px;
  right: 40px;
  background: #5a3223;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.3s;
}

#donateButton:hover {
  background: #3a1f13;
}

/* ERROR */
.error {
  background: #ffdddd;
  border-left: 4px solid #e74c3c;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.progress-container {
  width: 100%;
  height: 10px;
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: #5a3223;
  width: 0;
}

/* MODAL */
.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.6);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 2rem;
  border: 2px solid #5a3223;
  border-radius: 16px;
  width: 400px;
  text-align: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

body.dark .modal-content {
  background-color: #1a1a1a;
  color: #fff;
}

.close-button {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

/* MOBILE STYLES */
@media (max-width: 600px) {
  html, body {
    overflow: auto;
  }

  #leaderboard {
    position: static;
    width: 90%;
    height: auto;
    margin: 1rem auto;
  }

  #search {
    flex-direction: column;
    align-items: stretch;
  }

  #xpInput {
    width: 100%;
    min-width: 0;
  }

  #search button {
    width: 100%;
  }

  .stats-box,
  #topStats {
    width: 90%;
  }

  .modal-content {
    width: 90%;
    margin: 20% auto;
    font-size: 1rem;
  }
}
