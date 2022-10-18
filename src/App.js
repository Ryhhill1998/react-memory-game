import { useEffect, useState } from "react";

import Card from "./components/card/card.component";
import "./App.css";

const cardImages = [
  { src: "img/helmet-1.png" },
  { src: "img/potion-1.png" },
  { src: "img/ring-1.png" },
  { src: "img/scroll-1.png" },
  { src: "img/shield-1.png" },
  { src: "img/sword-1.png" },
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [highscore, setHighscore] = useState(null);

  // get highscore from localStorage
  const getHighscore = () => {
    const savedHighscore = JSON.parse(localStorage.getItem("highscore"));

    if (!savedHighscore) return;

    setHighscore(savedHighscore);
  };

  // shuffle cards
  const shuffleCards = () => {
    resetTurn();

    const shuffledCards = [...cardImages, ...cardImages].map((card) => ({
      ...card,
      id: Math.random(),
      matched: false,
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

    // retrieve highscore from localStorage if it exists
    getHighscore();
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  // handle user choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // compare selected cards
  useEffect(() => {
    if (!choiceOne || !choiceTwo) return;

    setDisabled(true);

    if (choiceOne.src !== choiceTwo.src) {
      setTimeout(() => resetTurn(), 1000);
      return;
    }

    const updatedCards = cards.map((card) => {
      if (card.src === choiceOne.src || card.src === choiceTwo.src) {
        return { ...card, matched: true };
      }
      return card;
    });

    setCards(updatedCards);
    resetTurn();
  }, [choiceOne, choiceTwo]);

  // reset choices and increment turns by 1
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(turns + 1);
    setDisabled(false);
  };

  // check whether all cards are matched
  const allCardsMatched = () => {
    let allMatched = true;

    cards.forEach((card) => {
      if (!card.matched) {
        allMatched = false;
      }
    });

    return allMatched;
  };

  // set highscore
  const updateHighscore = () => {
    if (highscore && turns >= highscore) return;

    localStorage.setItem("highscore", JSON.stringify(turns));
  };

  // check if game is over and set highscore if turns is lower than the current
  useEffect(() => {
    if (!cards.length) return;

    const gameOver = allCardsMatched();

    if (gameOver) {
      updateHighscore();
    }
  }, [cards]);

  return (
    <div className="App">
      <h1 className="title">Magic Match</h1>
      <div className="header">
        <button onClick={shuffleCards}>New Game</button>
        <p>Turns: {turns}</p>
        {highscore ? <p>Highscore: {highscore}</p> : ""}
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
