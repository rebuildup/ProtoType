import React, { useState } from "react";
import "../styles/002_header.css";
import { settings, updateSetting } from "../SiteInterface";
async function checkUserExists(username: string) {
  console.log(username);

  return true;
}

const PlayerProfilePanel: React.FC = () => {
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [, setRefresh] = useState<number>(0);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
    if (!isPanelVisible) {
      setStep(1);
      setUsername("");
      setPassword("");
      setUserExists(null);
    }
  };

  const handleUsernameNext = async () => {
    if (username.trim() === "") return;
    try {
      const exists = await checkUserExists(username);
      setUserExists(exists);
    } catch (error) {
      console.error("Error checking username:", error);
      setUserExists(false);
    }
    setStep(2);
  };

  const handleLogin = () => {
    updateSetting("user", { id: 0, name: username, isLoggedin: true });
    console.log("Logging in with:", username, password);
    setRefresh((prev) => prev + 1);
    setIsPanelVisible(false);
    setStep(1);
  };

  const handleRegister = () => {
    updateSetting("user", { id: 0, name: username, isLoggedin: true });
    console.log("Registering new user:", username, password);
    setRefresh((prev) => prev + 1);
    setIsPanelVisible(false);
    setStep(1);
  };

  const handleLogout = () => {
    updateSetting("user", { id: 0, name: "Guest", isLoggedin: false });
    console.log("Logging out");
    setRefresh((prev) => prev + 1);
    setIsPanelVisible(false);
  };

  const closePanel = () => {
    setIsPanelVisible(false);
    setStep(1);
  };

  return (
    <div>
      <button
        className="player-card"
        onClick={togglePanel}
        style={{ zIndex: 2 }}
      >
        {settings.user.isLoggedin ? settings.user.name : "ログイン"}
      </button>
      {isPanelVisible && (
        <div className="player-panel" style={{ zIndex: 4 }}>
          <button onClick={closePanel}>Close</button>
          {settings.user.isLoggedin ? (
            <div>
              <div>{settings.user.name}</div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              {step === 1 && (
                <div>
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button onClick={handleUsernameNext}>次へ</button>
                </div>
              )}
              {step === 2 && (
                <div>
                  {userExists === false && (
                    <div>ユーザーが存在しませんでした。</div>
                  )}
                  <div>
                    <label htmlFor="password">Password:</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {userExists ? (
                    <button onClick={handleLogin}>ログイン</button>
                  ) : (
                    <button onClick={handleRegister}>登録</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerProfilePanel;
