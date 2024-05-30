import type { Tile } from "./Tile";

/**
 * Represents a cell on the board.
 */
export class Cell {
  /**
   * The tile that the cell will merge with.
   */
  #mergeTile: Tile | null | undefined;

  /**
   * The tile of the cell.
   */
  #tile: Tile | null | undefined;

  /**
   * The x coordinate of the cell.
   */
  public x: number;

  /**
   * The y coordinate of the cell.
   */
  public y: number;

  /**
   * Creates a new cell.
   *
   * @param x - The x coordinate of the cell.
   * @param y - The y coordinate of the cell.
   */
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.#mergeTile = null;
  }

  /**
   * Whether or not the cell can merge with the given tile.
   */
  public canMerge(tile: Tile): boolean {
    return !this.tile || (!this.mergeTile && this.tile.value === tile.value);
  }

  /**
   * Merges the tile of the cell with the merge tile if  possible.
   *
   * @returns The new value of the tile.
   */
  public mergeTiles(): number {
    if (!this.tile || !this.mergeTile) return 0;

    this.tile.value += this.mergeTile.value;

    this.mergeTile.remove();

    this.mergeTile = null;

    return this.tile.value;
  }

  /**
   * The tile that the cell will merge with.
   */
  public get mergeTile() {
    return this.#mergeTile;
  }

  /**
   * Sets the tile that the cell will merge with.
   */
  public set mergeTile(mergeTile) {
    this.#mergeTile = mergeTile;
    if (this.#mergeTile) {
      this.#mergeTile.x = this.x;
      this.#mergeTile.y = this.y;
    }
  }

  /**
   * The tile of the cell.
   */
  public get tile() {
    return this.#tile;
  }

  /**
   * Sets the tile of the cell.
   */
  public set tile(tile) {
    this.#tile = tile;

    if (this.#tile) {
      this.#tile.x = this.x;
      this.#tile.y = this.y;
    }
  }
}
