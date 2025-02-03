// import { sql } from '@vercel/postgres';
import { Database } from 'sqlite3';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

type TournamentResult = {
  bot_name: string;
  matches_played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
};

async function getResults() {
  const dbPath = path.join(process.cwd(), 'public/Tournament_Logs/tournament.db');
  return new Promise<TournamentResult[]>((resolve, reject) => {
    const db = new Database(dbPath);
    db.all('SELECT * FROM results ORDER BY points DESC', (err, rows) => {
      if (err) reject(err);
      resolve(rows as TournamentResult[]);
      db.close();
    });
  });
}

export default async function Home() {
  const results = await getResults();
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Tank of War</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Tournament</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
            Watch the epic battles unfold as AI-powered tanks compete for supremacy!
          </p>
        </div>

        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-purple-500">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Tournament Leaderboard
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bot Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matches</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Won</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Draw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {results.map((result, index) => (
                  <tr key={result.bot_name} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{result.bot_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.matches_played}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{result.won}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{result.draw}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{result.lost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">{result.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div className="text-center pb-16">
        <Link href="/matches" className="inline-block px-6 py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors">
          View Matches
        </Link>
      </div>
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              © 2024 Tank of War Tournament. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
