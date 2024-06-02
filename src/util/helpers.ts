import type { Board } from "../structures/Board";
import type { Cell } from "../structures/Cell";
import { Tile } from "../structures/Tile";
import { DIRECTIONS, GAME_OVER_MESSAGE, type MoveDirection } from "./index";

export function setupEventListener(board: Board) {
  window.addEventListener(
    "keydown",
    async event => handleGameplay({ board, direction: event.key.replace("Arrow", "") as MoveDirection, event }),
    { once: true },
  );

  board.element.addEventListener("touchstart", handleTouchStart, { once: true });
  board.element.addEventListener("touchmove", handleTouchMove, { once: true });
  board.element.addEventListener("touchend", async event => handleTouchEnd(board, event), { once: true });
}

const touchCoordinates = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
};

export function handleTouchStart(event: TouchEvent) {
  touchCoordinates.startX = event.touches[0].clientX;
  touchCoordinates.startY = event.touches[0].clientY;
}

export function handleTouchMove(event: TouchEvent) {
  touchCoordinates.endX = event.touches[0].clientX;
  touchCoordinates.endY = event.touches[0].clientY;
}

export async function handleTouchEnd(board: Board, event: TouchEvent) {
  const deltaX = touchCoordinates.endX - touchCoordinates.startX;
  const deltaY = touchCoordinates.endY - touchCoordinates.startY;

  let direction: MoveDirection;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    direction = deltaX > 0 ? "Right" : "Left";
  } else {
    direction = deltaY > 0 ? "Down" : "Up";
  }

  await handleGameplay({ board, direction, event });
}

export type HandleGameplayOptions = {
  board: Board;
  direction: MoveDirection;
  event: Event;
};

export async function handleGameplay({ board, direction, event }: HandleGameplayOptions) {
  const moveDirection = DIRECTIONS[direction];

  if (!moveDirection) {
    setupEventListener(board);

    return;
  }

  event.preventDefault();

  const [canMove, move] = moveDirection;

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
    await handleGameOver(newTile);

    return;
  }

  setupEventListener(board);
}

export async function handleGameOver(tile: Tile) {
  await tile.waitForTransition(true);

  // eslint-disable-next-line no-alert
  const playAgain = confirm(GAME_OVER_MESSAGE);

  if (playAgain) location.reload();
}

export function handleNewGameButton() {
  // eslint-disable-next-line no-alert
  const isSure = confirm("Are you sure you want to start a new game?");

  if (isSure) location.reload();
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
