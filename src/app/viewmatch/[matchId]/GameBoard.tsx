"use client";

type GameBoardProps = {
  boardSize: number;
  obstacles: [number, number][];
};

export default function GameBoard({ boardSize, obstacles }: GameBoardProps) {
  return (
    <div className="w-full max-w-[400px] aspect-square mx-auto">
      <div 
        className="grid gap-[2px] bg-gray-700 border border-purple-500" 
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, index) => {
          const x = Math.floor(index / boardSize);
          const y = index % boardSize;
          const isObstacle = obstacles.some(([ox, oy]) => ox === x && oy === y);
          
          return (
            <div 
              key={`${x}-${y}`}
              className={`
                aspect-square bg-gray-800
                ${isObstacle ? 'bg-purple-900 border border-purple-500' : ''}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}