// ゲーム状態インターフェース
interface GameStatus {
  score: number;
  accuracy: number;
  missCount: number;
}

// シーン名の型定義
type SceneName = "Title" | "Game" | "Result" | "Settings";

// キーレイアウトの型定義
type KeyLayout = "QWERTY" | "DVORAK" | "AZERTY";

// ゲームモードの型定義
type GameMode = "Normal" | "Hard" | "Endless";

export class GameSessionConfig {
  // デフォルト値
  private _sceneName: SceneName = "Title";
  private _keyLayout: KeyLayout = "QWERTY";
  private _gameMode: GameMode = "Normal";
  private _gameStatus: GameStatus = {
    score: 0,
    accuracy: 0,
    missCount: 0,
  };

  // Getter/Setter
  get sceneName(): SceneName {
    return this._sceneName;
  }

  set sceneName(value: SceneName) {
    this._sceneName = value;
  }

  get keyLayout(): KeyLayout {
    return this._keyLayout;
  }

  set keyLayout(value: KeyLayout) {
    this._keyLayout = value;
  }

  get gameMode(): GameMode {
    return this._gameMode;
  }

  set gameMode(value: GameMode) {
    this._gameMode = value;
  }

  get gameStatus(): GameStatus {
    return this._gameStatus;
  }

  set gameStatus(value: GameStatus) {
    this._gameStatus = value;
  }

  // リセットメソッド
  reset(): void {
    this._sceneName = "Title";
    this._keyLayout = "QWERTY";
    this._gameMode = "Normal";
    this._gameStatus = {
      score: 0,
      accuracy: 0,
      missCount: 0,
    };
  }
}

// WebGL起動時にインスタンスを生成
export const createNewSession = () => new GameSessionConfig();
