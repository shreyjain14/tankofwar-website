import { Database } from 'sqlite3';
import path from 'path';
import Link from 'next/link';
import SortableTable, { TournamentResult } from './components/SortableTable';

async function getResults() {
  const dbPath = path.join(process.cwd(), 'public/Tournament_Logs/tournament.db');
  return new Promise<TournamentResult[]>((resolve, reject) => {
    const db = new Database(dbPath);
    db.all('SELECT * FROM results ORDER BY points DESC', (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows as TournamentResult[]);
      db.close();
    });
  });
}

export default async function Home() {
  const results = await getResults();

  return (
      <div className="min-h-screen bg-gray-900 text-white pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Tank of War
            </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Tournament
            </span>
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
            {/* Directly use the client component */}
            <SortableTable results={results} />
          </div>
        </main>
        {/* <div className="text-center pb-16">
          <Link
              href="/matches"
              className="inline-block px-6 py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            View Matches
          </Link>
        </div> */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16">
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
