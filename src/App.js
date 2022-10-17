import { useState } from "react";

import "./App.css";

const cardImages = [
  { src: "public/img/helmet-1.png" },
  { src: "public/img/potion-1.png" },
  { src: "public/img/ring-1.png" },
  { src: "public/img/scroll-1.png" },
  { src: "public/img/shield-1.png" },
  { src: "public/img/sword-1.png" },
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages].map((card) => ({
      ...card,
      id: Math.random(),
    }));

    // fisher-yates algorithm
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledCards[i];
      shuffledCards[i] = shuffledCards[j];
      shuffledCards[j] = temp;
    }

    // set cards to shuffled cards
    setCards(shuffledCards);

    // reset turns
    setTurns(0);
  };

  console.log(cards, turns);

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
    </div>
  );
};

export default App;
