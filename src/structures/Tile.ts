/**
 * Represents a tile on the board.
 */
export class Tile {
  /**
   * The tile element.
   */
  readonly #tile: HTMLDivElement;

  /**
   * The value of the tile.
   */
  #value: number;

  /**
   * The x coordinate of the tile.
   */
  #x: number;

  /**
   * The y coordinate of the tile.
   */
  #y: number;

  public constructor(container: HTMLDivElement, value = Math.random() < 0.9 ? 2 : 4) {
    this.#tile = document.createElement("div");
    this.#value = value;
    this.#x = 0;
    this.#y = 0;

    this.#tile.classList.add("tile");

    container.append(this.#tile);

    this.value = this.#value;
  }

  public remove() {
    this.#tile.remove();
  }

  public async waitForTransition(animation = false): Promise<unknown> {
    const { promise, resolve } = Promise.withResolvers();

    this.#tile.addEventListener(animation ? "animationend" : "transitionend", resolve, { once: true });

    return promise;
  }

  public get value() {
    return this.#value;
  }

  public set value(value) {
    this.#value = value;

    this.#tile.textContent = String(value);

    const backgroundLightness = 100 - Math.log2(value) * 9;

    this.#tile.style.setProperty("--background-lightness", `${backgroundLightness}%`);
    this.#tile.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`);
  }

  public get x() {
    return this.#x;
  }

  public set x(x) {
    this.#x = x;
    this.#tile.style.setProperty("--x", String(x));
  }

  public get y() {
    return this.#y;
  }

  public set y(y) {
    this.#y = y;
    this.#tile.style.setProperty("--y", String(y));
  }
}
