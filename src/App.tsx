import React, { useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import Grid from "./struct/grid";
import { KonvaEventObject } from "konva/lib/Node";
import { getColorFor } from "./struct/square_type";

function draw(grid: Grid, e: KonvaEventObject<PointerEvent | MouseEvent>, gridContent: number[][]) {
	if (!grid.isDrawing()) {
		return;
	}

	if (!e.target.getStage()) {
		return;
	}

	const stage = e.target.getStage()!;

	let layers = stage.getLayers();

	let x = Math.floor(e.evt.offsetX / grid.getSquareSize());
	let y = Math.floor(e.evt.offsetY / grid.getSquareSize());

	for (let i = -grid.getDrawingRadius(); i <= grid.getDrawingRadius(); i++) {
		for (let j = -grid.getDrawingRadius(); j <= grid.getDrawingRadius(); j++) {
			grid.setCell(x + i, y + j, grid.getColorType());

			let rect = new Konva.Rect({
				x: (x + i) * grid.getSquareSize(),
				y: (y + j) * grid.getSquareSize(),
				width: grid.getSquareSize(),
				height: grid.getSquareSize(),
				fill: getColorFor(grid.getColorType()),
			});

			if (layers.length === 0) {
				let layer = new Konva.Layer();
				stage.add(layer);
				layer.add(rect);
			} else {
				let layer = layers[layers.length - 1];
				layer.add(rect);
			}
		}
	}
}

function App({ grid }: { grid: Grid }) {
	const [gridContent, setGridContent] = useState(grid.getGrid());

	return (
		<div className={"w-full h-screen bg-gray-800 flex"}>
			<div className={"m-auto text-white"}>
				<Stage width={512}
					height={512}
					onMouseDown={(e) => {
						if (e.evt.offsetX < 0 || e.evt.offsetX >= 512) {
							grid.setDrawing(false);
							return;
						}

						if (e.evt.offsetY < 0 || e.evt.offsetY >= 512) {
							grid.setDrawing(false);
							return;
						}

						grid.setDrawing(!grid.isDrawing());

						draw(grid, e, gridContent);
					}}
					onMouseUp={(e) => {
						grid.setDrawing(false);
					}}
					onPointerMove={(e) => {
						if (e.evt.offsetX < 0 || e.evt.offsetX >= 512) {
							grid.setDrawing(false);
							return;
						}

						if (e.evt.offsetY < 0 || e.evt.offsetY >= 512) {
							grid.setDrawing(false);
							return;
						}

						draw(grid, e, gridContent);
					}}>
					<Layer>
						{
							gridContent.map((row, i) => {
								return row.map((cell, j) => {
									return (
										<Rect
											key={i * row.length + j}
											x={i * grid.getSquareSize()}
											y={j * grid.getSquareSize()}
											width={grid.getSquareSize()}
											height={grid.getSquareSize()}
											fill={getColorFor(cell)}
										/>
									);
								});
							})
						}
					</Layer>
				</Stage>
				<div onClick={(e) => {
					const json = JSON.stringify({
						version: 1,
						grid: grid.getGrid(),
					});
					const blob = new Blob([json], { type: "application/json" });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "data.json";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}}>
					Export grid
				</div>
				<label htmlFor={"file"}>Import grid</label>
				<input id={"file"}
					type={"file"}
					className={"hidden"}
					onInput={(e) => {
						let eventTarget = e.target as HTMLInputElement;
						const file = eventTarget.files![0];
						const reader = new FileReader();
						reader.onload = (e) => {
							const content = e.target!.result as string;
							console.log(content);
							grid.loadGrid(content);
							setGridContent(grid.getGrid());
							eventTarget.files = null;
						};
						reader.readAsText(file);
					}}>
				</input><br />
				<select onChange={(e) => {
					grid.setColorType(parseInt(e.target.value));
				}}>
					<option value={0}>Arbres</option>
					<option value={1}>Champs</option>
					<option value={2}>Eau</option>
					<option value={3}>Feu</option>
				</select><br />
				<input type={"range"}
					min={1}
					max={16}
					onInput={(e) => {
						console.log((e.target as HTMLInputElement).value);
						grid.setDrawingRadius(parseInt((e.target as HTMLInputElement).value));
					}} />
				<div onClick={(e) => {
					// Do simulation
				}}>
					Start simulation
				</div>
			</div>
		</div>
	);
}

export default App;
