import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

type MatchFile = {
  filename: string;
  bot1: string;
  bot2: string;
};

async function getMatchFiles(): Promise<MatchFile[]> {
  const matchesDir = path.join(process.cwd(), 'public/Tournament_Logs/matches');
  const files = await fs.readdir(matchesDir);
  
  return files
    .filter(file => file.startsWith('match_') && file.endsWith('.log'))
    .map(filename => {
      const match = filename.match(/match_\d+_(.+)_vs_(.+)\.log/);
      if (!match) return null;
      return {
        filename,
        bot1: match[1],
        bot2: match[2]
      };
    })
    .filter((match): match is MatchFile => match !== null);
}

export default async function Matches() {
  const matches = await getMatchFiles();
  const uniqueBots = new Set<string>();
  
  matches.forEach(match => {
    uniqueBots.add(match.bot1);
    uniqueBots.add(match.bot2);
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Tournament Bots</span>
          </h1>
          
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
            Select a bot to view its match history
          </p>
        </div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from(uniqueBots).sort().map(bot => (
            <Link key={bot} href={`/matches/${encodeURIComponent(bot)}`} className="block">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 hover:border-blue-400 transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-xl font-bold text-blue-400 mb-2">{bot}</h3>
                <p className="text-sm text-gray-300">
                  {matches.filter(match => match.bot1 === bot || match.bot2 === bot).length} matches played
                </p>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}