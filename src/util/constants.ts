import type { Board } from "../structures/Board";
import {
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  type MoveDirection,
} from "./index";

export const BOARD_SIZE = 4 as const;

export const CELL_GAP = "1vmin" as const;

export const CELL_SIZE = "10vmin" as const;

export const DIRECTIONS: Record<MoveDirection, [(board: Board) => boolean, (board: Board) => Promise<unknown[]>]> = {
  Up: [canMoveUp, moveUp],
  Down: [canMoveDown, moveDown],
  Left: [canMoveLeft, moveLeft],
  Right: [canMoveRight, moveRight],
};

export const GAME_OVER_MESSAGE = "Game over!\nPlay again?" as const;

/* eslint-disable id-length */
export const KEY_TO_DIRECTIONS: Record<string, MoveDirection> = {
  w: "Up",
  s: "Down",
  a: "Left",
  d: "Right",
  h: "Left",
  j: "Down",
  k: "Up",
  l: "Right",
};
/* eslint-enable id-length */
