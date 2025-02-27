import { gameData } from "./002_gameConfig";
export interface RankingPlayer {
  player_name: string;
  player_id: number;
  player_score: number;
}
export function loadcache_localranking() {
  let defaultR: RankingPlayer = {
    player_name: "nodata",
    player_id: 0,
    player_score: 0,
  };
  let output: RankingPlayer[] = loadFromCache<typeof output>("localRanking", [
    defaultR,
  ]);

  while (output.length <= 100) {
    output.push(defaultR);
  }
  gameData.localRanking = output;
}
export function savecache_localranking() {
  saveToCache("localRanking", gameData.localRanking);
}
export const saveToCache = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
export const loadFromCache = <T>(key: string, defaultValue: T): T => {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : defaultValue;
};
export function insertLocalRanking(newPlayer: RankingPlayer): number {
  const ranking = gameData.localRanking;

  let index = ranking.findIndex(
    (player) => newPlayer.player_score > player.player_score
  );

  if (index === -1) {
    index = ranking.length;
  } else {
    while (
      index < ranking.length &&
      ranking[index].player_score === newPlayer.player_score
    ) {
      index++;
    }
  }

  if (index < 100) {
    ranking.splice(index, 0, newPlayer);
    ranking.pop();

    saveToCache("localRanking", ranking);
    return index;
  }

  return -1;
}
