import { promises as fs } from 'fs';
import path from 'path';
import GameBoard from './GameBoard';

type GameState = {
  boardSize: number;
  obstacles: [number, number][];
};

async function getGameState(matchId: string): Promise<GameState | null> {
  const matchesDir = path.join(process.cwd(), 'public/Tournament_Logs/matches');
  const files = await fs.readdir(matchesDir);
  const matchFile = files.find(file => file.startsWith(`match_${matchId}_`));
  
  if (!matchFile) return null;
  
  const logContent = await fs.readFile(path.join(matchesDir, matchFile), 'utf-8');
  const lines = logContent.split('\n');
  
  let boardSize = 0;
  const obstacles: [number, number][] = [];
  
  for (const line of lines) {
    if (line.includes('Board size:')) {
      boardSize = parseInt(line.split(':')[3].trim());
    } else if (line.includes('Obstacles at positions:')) {
      const posStr = line.split('positions:')[1].trim();
      const positions = posStr.match(/\(\d+,\d+\)/g) || [];
      obstacles.push(...positions.map(pos => {
        const [x, y] = pos.slice(1, -1).split(',').map(Number);
        return [x, y] as [number, number];
      }));
    }
  }
  
  return { boardSize, obstacles };
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
  const { matchId } = params;
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
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 min-h-[600px] flex items-center justify-center">
          {!gameState ? (
            <p className="text-gray-400 text-xl">Unable to load game state</p>
          ) : (
            <GameBoard boardSize={gameState.boardSize} obstacles={gameState.obstacles} />
          )}
        </div>
      </main>
    </div>
  );
}