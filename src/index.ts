import { Board } from "./structures/Board";
import { Tile } from "./structures/Tile";
import "./styles/globals.css";

const boardElement = document.querySelector<HTMLDivElement>("#board")!;

const board = new Board(boardElement);

board.randomEmptyCell().tile = new Tile(boardElement);
board.randomEmptyCell().tile = new Tile(boardElement);
