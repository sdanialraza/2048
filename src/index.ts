import { Board } from "./structures/Board";
import { Tile } from "./structures/Tile";
import { handleBestScore, handleNewGameButton, setupEventListener } from "./util/index";
import "./styles/globals.css";

const boardElement = document.querySelector<HTMLDivElement>("#board")!;

const board = new Board(boardElement);

board.randomEmptyCell().tile = new Tile(boardElement);
board.randomEmptyCell().tile = new Tile(boardElement);

setupEventListener(board);

const newGameButton = document.querySelector<HTMLButtonElement>("#new-game")!;

newGameButton.addEventListener("click", handleNewGameButton);

handleBestScore(0);
