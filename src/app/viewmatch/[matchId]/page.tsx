import { promises as fs } from 'fs';
import path from 'path';
import GameBoard from './GameBoard';

type GameState = {
  boardSize: number;
  obstacles: [number, number][];
  obstacleDensity: number;
  maxTurns: number;
  numPlayers: number;
};

async function getGameState(matchId: string): Promise<GameState | null> {
  const matchesDir = path.join(process.cwd(), 'public/Tournament_Logs/matches');
  const files = await fs.readdir(matchesDir);
  const matchFile = files.find(file => file.startsWith(`match_${matchId}_`));
  
  if (!matchFile) return null;
  
  const logContent = await fs.readFile(path.join(matchesDir, matchFile), 'utf-8');
  const lines = logContent.split('\n');
  
  let boardSize = 0;
  let maxTurns = 0;
  let numPlayers = 0;
  const obstacles: [number, number][] = [];
  
  for (const line of lines) {
    if (line.includes('Board size:')) {
      const sizeMatch = line.split(':')[3]?.trim();
      boardSize = sizeMatch ? parseInt(sizeMatch) : 0;
    } else if (line.includes('Obstacles at positions:')) {
      const posStr = line.split('positions:')[1]?.trim() || '';
      const positions = posStr.match(/\(\d+,\d+\)/g) || [];
      obstacles.push(...positions.map(pos => {
        const coords = pos.slice(1, -1).split(',').map(Number);
        return [coords[0] || 0, coords[1] || 0] as [number, number];
      }));
    } else if (line.includes('Max turns:')) {
      const turnsMatch = line.split(':')[3]?.trim();
      maxTurns = turnsMatch ? parseInt(turnsMatch) : 0;
    } else if (line.includes('Game initialized with')) {
      const playersMatch = line.match(/initialized with (\d+) players/)?.[1];
      numPlayers = playersMatch ? parseInt(playersMatch) : 0;
    }
  }
  
  const obstacleDensity = (obstacles.length / (boardSize * boardSize)) * 100;
  
  return { boardSize, obstacles, obstacleDensity, maxTurns, numPlayers };
}

async function getMatchTitle(matchId: string) {
  const matchesDir = path.join(process.cwd(), 'public/Tournament_Logs/matches');
  const files = await fs.readdir(matchesDir);
  const matchFile = files.find(file => file.startsWith(`match_${matchId}_`));
  
  if (!matchFile) return null;
  
  const match = matchFile.match(/match_\d+_(.+)_vs_(.+)\.log/);
  if (!match) return null;
  
  return {
    bot1: match[1],
    bot2: match[2]
  };
}

export default async function MatchViewer({ params }: { params: { matchId: string } }) {
  
  const { matchId } = await params;
  const [matchTitle, gameState] = await Promise.all([
    getMatchTitle(matchId),
    getGameState(matchId)
  ]);
  
  if (!matchTitle) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400">Match not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Match {matchId}: {matchTitle.bot1} vs {matchTitle.bot2}
            </span>
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-purple-500 min-h-[600px] flex items-center justify-center">
            {!gameState ? (
              <p className="text-gray-400 text-xl">Unable to load game state</p>
            ) : (
              <GameBoard boardSize={gameState.boardSize} obstacles={gameState.obstacles} />
            )}
          </div>
          
          {gameState && (
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">Game Data</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-medium">Board Size</h3>
                  <p className="text-white text-lg">{gameState.boardSize}x{gameState.boardSize}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-medium">Obstacle Density</h3>
                  <p className="text-white text-lg">{gameState.obstacleDensity.toFixed(1)}%</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-medium">Max Turns</h3>
                  <p className="text-white text-lg">{gameState.maxTurns}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-medium">Number of Players</h3>
                  <p className="text-white text-lg">{gameState.numPlayers}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}