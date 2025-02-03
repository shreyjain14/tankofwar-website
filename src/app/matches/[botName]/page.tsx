import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

type MatchFile = {
  filename: string;
  matchNumber: number;
  bot1: string;
  bot2: string;
};

async function getMatchesForBot(botName: string): Promise<MatchFile[]> {
  const matchesDir = path.join(process.cwd(), 'public/Tournament_Logs/matches');
  const files = await fs.readdir(matchesDir);
  
  return files
    .filter(file => file.startsWith('match_') && file.endsWith('.log'))
    .filter(file => file.includes(botName))
    .map(filename => {
      const match = filename.match(/match_(\d+)_(.+)_vs_(.+)\.log/);
      if (!match) return null;
      return {
        filename,
        matchNumber: parseInt(match[1]),
        bot1: match[2],
        bot2: match[3]
      };
    })
    .filter((match): match is MatchFile => match !== null)
    .sort((a, b) => a.matchNumber - b.matchNumber);
}

export default async function BotMatches({ params }: { params: { botName: string } }) {
  const botName = decodeURIComponent(params.botName);
  const matches = await getMatchesForBot(botName);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{botName}'s Matches</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
            View all matches played by {botName}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {matches.map((match) => (
            <Link 
              key={match.filename} 
              href={`/viewmatch/${match.matchNumber}`}
              className="block bg-gray-800 rounded-lg p-6 border border-purple-500 hover:border-blue-400 transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-400">
                  Match {match.matchNumber} vs {match.bot1 === botName ? match.bot2 : match.bot1}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/matches" className="inline-block px-6 py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors">
            Back to All Bots
          </Link>
        </div>
      </main>
    </div>
  );
}