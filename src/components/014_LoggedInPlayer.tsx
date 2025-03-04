import React, { useState } from "react";
import "../styles/002_header.css";
import { settings, updateSetting } from "../SiteInterface";
async function checkUserExists(username: string) {
  console.log(username);

  return false;
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
        {settings.user.isLoggedin ? "you : " + settings.user.name : "ログイン"}
      </button>
      {isPanelVisible && (
        <div className="player-panel" style={{ zIndex: 4 }}>
          <button
            onClick={closePanel}
            className="close-btn"
            style={{ position: "absolute", right: 0, fontSize: "16px" }}
          >
            Close
          </button>

          {settings.user.isLoggedin ? (
            <div>
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "12px",
                }}
              >
                ユーザーネーム
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "24px",
                }}
              >
                {settings.user.name}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  position: "absolute",
                  bottom: "26px",
                  left: "80px",
                  fontSize: "16px",
                }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div>
              {step === 1 && (
                <div>
                  <div>
                    <label
                      htmlFor="username"
                      style={{
                        position: "absolute",
                        top: "60px",
                        left: "80px",
                        fontSize: "16px",
                      }}
                    >
                      ユーザーネーム:
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        position: "absolute",
                        width: "180px",
                        top: "90px",
                        left: "46px",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleUsernameNext}
                    style={{
                      position: "absolute",
                      bottom: "30px",
                      left: "98px",
                      fontSize: "16px",
                    }}
                  >
                    次へ
                  </button>
                </div>
              )}
              {step === 2 && (
                <div>
                  {userExists === false && (
                    <div>
                      <div
                        style={{
                          position: "absolute",
                          top: "30px",
                          left: "46px",
                          fontSize: "8px",
                        }}
                      >
                        ユーザーが見つかりませんでした。
                        <br />
                        パスワードを入力してユーザーを登録します
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "56px",
                          left: "20px",
                          fontSize: "8px",
                        }}
                      >
                        ※セキュリティの確保が出来ていません
                        <br />
                        他のサイトで使用したパスワードは絶対に使用しないでください
                      </div>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="password"
                      style={{
                        position: "absolute",
                        top: "60px",
                        left: "98px",
                        fontSize: "16px",
                      }}
                    >
                      パスワード
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        position: "absolute",
                        width: "180px",
                        top: "90px",
                        left: "46px",
                      }}
                    />
                  </div>
                  {userExists ? (
                    <button
                      onClick={handleLogin}
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "82px",
                        fontSize: "16px",
                      }}
                    >
                      ログイン
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "98px",
                        fontSize: "16px",
                      }}
                    >
                      登録
                    </button>
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
