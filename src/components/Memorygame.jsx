import { useEffect, useState } from "react";

const MemoryGame = () => {
  // State variables
  const [gridSize, setGridSize] = useState(4); // Grid size for the game board
  const [cards, setCards] = useState([]); // Stores the shuffled cards
  const [flipped, setFlipped] = useState([]); // Stores currently flipped cards
  const [solved, setSolved] = useState([]); // Stores correctly matched pairs
  const [disabled, setDisabled] = useState(false); // Disables clicking while checking matches
  const [won, setWon] = useState(false); // Tracks if the game is won

  // Handles grid size change
  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  // Initializes a new game
  const initializeGame = () => {
    const totalCards = gridSize * gridSize; // Total number of cards
    const pairCount = Math.floor(totalCards / 2); // Number of unique pairs
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);

    // Shuffle the cards
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  // Re-initialize game when grid size changes
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  // Checks if two flipped cards match
  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      // If matched, add to solved list
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      // If not matched, reset flipped cards after a delay
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  // Handles card click event
  const handleClick = (id) => {
    if (disabled || won) return; // Prevent clicks if game is disabled or won

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  // Check if a card is flipped or solved
  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  // Check if all pairs are solved
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* Grid Size Selector */}
      <div className="mb-4 flex flex-col items-center">
        <label htmlFor="gridSize" className="mb-2 text-lg font-medium">
          Grid Size: (2 - 10)
        </label>
        <div className="flex items-center">
          {/* Decrease Grid Size */}
          <button
            onClick={() => setGridSize((prev) => Math.max(2, prev - 1))}
            className="px-3 py-2 bg-gray-300 text-xl rounded-l hover:bg-gray-400 transition"
          >
            -
          </button>

          {/* Input for Grid Size */}
          <input
            type="number"
            id="gridSize"
            min="2"
            max="10"
            value={gridSize}
            onChange={handleGridSizeChange}
            className="border-2 border-gray-300 text-center w-16 px-2 py-1"
          />

          {/* Increase Grid Size */}
          <button
            onClick={() => setGridSize((prev) => Math.min(10, prev + 1))}
            className="px-3 py-2 bg-gray-300 text-xl rounded-r hover:bg-gray-400 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300
              ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {/* Display Winning Message */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}

      {/* Reset / Play Again Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
