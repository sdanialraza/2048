import type { Board } from "../structures/Board";
import type { Cell } from "../structures/Cell";
import { Tile } from "../structures/Tile";
import { GAME_OVER_MESSAGE } from "./index";

export function setupEventListener(board: Board) {
  window.addEventListener("keydown", async event => handleInput(board, event), { once: true });
}

export function handleNewGameButton() {
  // eslint-disable-next-line no-alert
  const isSure = confirm("Are you sure you want to start a new game?");

  if (isSure) location.reload();
}

const directions: Record<string, [(board: Board) => boolean, (board: Board) => Promise<unknown[]>]> = {
  ArrowUp: [canMoveUp, moveUp],
  ArrowDown: [canMoveDown, moveDown],
  ArrowLeft: [canMoveLeft, moveLeft],
  ArrowRight: [canMoveRight, moveRight],
};

export async function handleInput(board: Board, event: KeyboardEvent) {
  const direction = directions[event.key];

  if (!direction) {
    setupEventListener(board);
    return;
  }

  event.preventDefault();

  const [canMove, move] = direction;

  if (!canMove(board)) {
    setupEventListener(board);
    return;
  }

  await move(board);

  for (const cell of board.cells) {
    cell.mergeTiles();
  }

  const boardElement = document.querySelector<HTMLDivElement>("#board")!;

  const newTile = new Tile(boardElement);

  board.randomEmptyCell().tile = newTile;

  if (!canMoveUp(board) && !canMoveDown(board) && !canMoveLeft(board) && !canMoveRight(board)) {
    await newTile.waitForTransition(true);

    // TODO: Implement a game over screen.
    // eslint-disable-next-line no-alert
    const playAgain = confirm(GAME_OVER_MESSAGE);

    if (playAgain) location.reload();

    return;
  }

  setupEventListener(board);
}

export function canMoveUp(board: Board): boolean {
  return canMove(board.cellsByColumn);
}

export function canMoveDown(board: Board): boolean {
  return canMove(board.cellsByColumn.map(column => [...column].reverse()));
}

export function canMoveLeft(board: Board): boolean {
  return canMove(board.cellsByRow);
}

export function canMoveRight(board: Board): boolean {
  return canMove(board.cellsByRow.map(row => [...row].reverse()));
}

export function canMove(cells: Cell[][]): boolean {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (!cell.tile) return false;
      if (index === 0) return false;

      const moveToCell = group[index - 1];

      return moveToCell.canMerge(cell.tile);
    });
  });
}

export async function moveUp(board: Board): Promise<unknown[]> {
  return slideTiles(board.cellsByColumn);
}

export async function moveDown(board: Board): Promise<unknown[]> {
  return slideTiles(board.cellsByColumn.map(column => [...column].reverse()));
}

export async function moveLeft(board: Board): Promise<unknown[]> {
  return slideTiles(board.cellsByRow);
}

export async function moveRight(board: Board): Promise<unknown[]> {
  return slideTiles(board.cellsByRow.map(row => [...row].reverse()));
}

export async function slideTiles(cellGroups: Cell[][]): Promise<unknown[]> {
  return Promise.all(
    cellGroups.flatMap(group => {
      const promises: Promise<unknown>[] = [];

      for (let currentIndex = 1; currentIndex < group.length; currentIndex++) {
        const currentCell = group[currentIndex];

        if (!currentCell.tile) continue;

        let targetCell: Cell | undefined;

        for (let previousIndex = currentIndex - 1; previousIndex >= 0; previousIndex--) {
          const potentialTargetCell = group[previousIndex];

          if (!potentialTargetCell.canMerge(currentCell.tile)) break;

          targetCell = potentialTargetCell;
        }

        if (targetCell) {
          promises.push(currentCell.tile.waitForTransition());

          if (targetCell.tile) targetCell.mergeTile = currentCell.tile;
          else targetCell.tile = currentCell.tile;

          currentCell.tile = null;
        }
      }

      return promises;
    }),
  );
}
