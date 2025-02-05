interface PlayData {
  score: number;
  speed: number;
  accuracy: number;
  maxSpeed: number;
  playTime: number;
  finishTime: number;
  playerId: number;
}

interface PlayerData {
  username: string;
  password: string;
}

interface ApiResponse {
  status: string;
  message?: string;
  playerId?: number;
  texts?: Array<{ problem: string; reading: string }>;
  ranking?: Array<{ playerId: number; score: number }>;
}

// Apps Script の Web API の URL（YOUR_DEPLOYMENT_ID を実際のものに置換）
const API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

// Function to write play data
export async function writePlayData(playData: PlayData): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "writePlayData", data: playData }),
  });
  return response.json();
}

// Function to get text data
export async function getTexts(): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getTexts" }),
  });
  return response.json();
}

// Function to register a new player
export async function registerPlayer(player: PlayerData): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "registerPlayer", data: player }),
  });
  return response.json();
}

// Function to log in a player
export async function login(player: PlayerData): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", data: player }),
  });
  return response.json();
}

// Function to get ranking data
export async function getRanking(): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getRanking" }),
  });
  return response.json();
}
