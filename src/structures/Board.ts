import { BOARD_SIZE, CELL_GAP, CELL_SIZE } from "../util";
import { Cell } from "./Cell";

/**
 * Represents the board of the game.
 */
export class Board {
  /**
   * The cell elements on the board.
   */
  readonly #cells: Cell[];

  /**
   * The board element.
   */
  public element: HTMLDivElement;

  public constructor(boardElement: HTMLDivElement) {
    this.element = boardElement;

    this.element.style.setProperty("--board-size", String(BOARD_SIZE));
    this.element.style.setProperty("--cell-gap", CELL_GAP);
    this.element.style.setProperty("--cell-size", CELL_SIZE);

    this.#cells = this.#createCells();
  }

  /**
   * Creates the cells and appends them to the board.
   *
   * @returns The cells on the board.
   */
  #createCells(): Cell[] {
    const cells: Cell[] = [];

    for (let index = 0; index < BOARD_SIZE ** 2; index++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");

      cells.push(new Cell(index % BOARD_SIZE, Math.floor(index / BOARD_SIZE)));

      this.element.append(cell);
    }

    return cells;
  }

  /**
   * Returns a random empty cell.
   *
   * @returns A random empty cell.
   */
  public randomEmptyCell(): Cell {
    return this.#emptyCells[Math.floor(Math.random() * this.#emptyCells.length)];
  }

  /**
   * The cells of the board by column.
   */
  public get cellsByColumn(): Cell[][] {
    return this.#cells.reduce((cellGrid: Cell[][], cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] ?? [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  /**
   * The cells of the board by row.
   */
  public get cellsByRow(): Cell[][] {
    return this.#cells.reduce((cellGrid: Cell[][], cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] ?? [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  /**
   * The cells on the board.
   */
  public get cells() {
    return this.#cells;
  }

  /**
   * The empty cells on the board.
   */
  get #emptyCells() {
    return this.#cells.filter(cell => !cell.tile);
  }
}
