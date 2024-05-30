import { setupCounter } from "./util";
import "./styles/globals.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

const button = document.createElement("button");

button.id = "counter";

app.append(button);

setupCounter(button);
