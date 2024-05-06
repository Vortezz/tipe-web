import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Grid from "./struct/grid";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

let grid = new Grid();
grid.initialize();

root.render(
	<React.StrictMode>
		<App grid={grid} />
	</React.StrictMode>,
);
