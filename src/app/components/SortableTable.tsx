'use client';

import { useState, useMemo } from 'react';

export type TournamentResult = {
    bot_name: string;
    matches_played: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
};

type Props = {
    results: TournamentResult[];
};

export default function SortableTable({ results }: Props) {
    // Local state for sorted data.
    const [sortedResults, setSortedResults] = useState<TournamentResult[]>([...results]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof TournamentResult; direction: 'asc' | 'desc' } | null>(null);

    // Compute a ranking mapping based solely on points (highest points = rank 1)
    const rankingMap = useMemo(() => {
        const sortedByPoints = [...results].sort((a, b) => b.points - a.points);
        const map = new Map<string, number>();
        sortedByPoints.forEach((row, index) => {
            map.set(row.bot_name, index + 1);
        });
        return map;
    }, [results]);

    // Function to sort the table by any column
    const sortTable = (key: keyof TournamentResult) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sorted = [...sortedResults].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedResults(sorted);
        setSortConfig({ key, direction });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                <tr>
                    {/* Rank column always reflects the points-based rank */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Rank
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('bot_name')}
                    >
                        Bot Name {sortConfig?.key === 'bot_name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('matches_played')}
                    >
                        Matches {sortConfig?.key === 'matches_played' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('won')}
                    >
                        Won {sortConfig?.key === 'won' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('draw')}
                    >
                        Draw {sortConfig?.key === 'draw' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('lost')}
                    >
                        Lost {sortConfig?.key === 'lost' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        onClick={() => sortTable('points')}
                    >
                        Points {sortConfig?.key === 'points' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedResults.map((result) => (
                    <tr key={result.bot_name} className="hover:bg-gray-700 transition-colors">
                        {/* Use the rankingMap to always display the rank based on points */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {rankingMap.get(result.bot_name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                            {result.bot_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {result.matches_played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                            {result.won}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">
                            {result.draw}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">
                            {result.lost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">
                            {result.points}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
