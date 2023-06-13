// REACT
import { useEffect, useState, useCallback} from 'react';

// DATA
import { wordList, wordsList } from './data/words';

// CSS
import './App.css';

// COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'}
]

const guessesQty = 3;

function App() {

  const [words] = useState(wordsList);
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWord = useCallback((category) => {

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return word;

  }, [words])

  const pickCategory = useCallback(() => {
    
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    return category;

  }, [pickWord])

  //starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();

    // pick category
    const category = pickCategory();

    // pick word
    const word = pickWord(category);

    // create an array of letters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters)

    setGameStage(stages[1].name);

  }, [pickCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter
      ])
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1);

    }

  }

  const clearLetterStates = () => {

    setGuessedLetters([]);
    setWrongLetters([]);

  }

  // check if guesses ended
  useEffect(() => {

    if(guesses <= 0){

      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);

    }

  }, [guesses])

  // check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length){

      // add score
      setScore((actualScore) => (actualScore += 1));

      //restart game with new word
      startGame();

    }

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {

    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
