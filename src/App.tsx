import React, { useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import Grid from "./struct/grid";
import { KonvaEventObject } from "konva/lib/Node";
import { getColorFor, SquareType } from "./struct/square_type";

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

	let bigRect = new Konva.Rect({
		x: x * grid.getSquareSize() - grid.getSquareSize() * grid.getDrawingRadius(),
		y: y * grid.getSquareSize() - grid.getSquareSize() * grid.getDrawingRadius(),
		width: grid.getSquareSize() * grid.getDrawingRadius() * 2,
		height: grid.getSquareSize() * grid.getDrawingRadius() * 2,
		fill: getColorFor(grid.getColorType()),
	});

	for (let i = -grid.getDrawingRadius(); i <= grid.getDrawingRadius(); i++) {
		for (let j = -grid.getDrawingRadius(); j <= grid.getDrawingRadius(); j++) {
			grid.setCell(x + i, y + j, grid.getColorType());
		}
	}

	if (layers.length === 0) {
		let layer = new Konva.Layer();
		stage.add(layer);
		layer.add(bigRect);
	} else {
		let layer = layers[layers.length - 1];
		layer.add(bigRect);
	}
}

function App({ grid }: { grid: Grid }) {
	const [gridContent, setGridContent] = useState(grid.getGrid());

	return (
		<div className={"w-full h-screen bg-gray-800 flex"}>
			<div className={"m-auto text-white w-full"}>
				<div className={"flex justify-around w-full"}>
					<Stage width={512}
						height={512}
						id={"stage"}
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
							<Rect x={0}
								y={0}
								height={512}
								width={512}
								fill={getColorFor(SquareType.Tree)} />
							{
								gridContent.map((row, i) => {
									return row.map((cell, j) => {
										if (cell !== SquareType.Tree) {
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
										}

										return <></>;
									});
								})
							}
						</Layer>
					</Stage>
					<div className={"w-[30rem]"}>
						<label className={"text-sm text-gray-500 dark:text-gray-400"}>Actions</label>
						<div className={"flex mx-auto"}>
							<div className={"bg-blue-500 w-40 h-10 text-center my-4 flex mx-auto rounded cursor-pointer"}
								onClick={(e) => {
									const json = JSON.stringify({
										version: 1,
										grid: grid.getGrid(),
									});
									const blob = new Blob([json], { type: "application/json" });
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = "grid.json";
									document.body.appendChild(a);
									a.click();
									document.body.removeChild(a);
									URL.revokeObjectURL(url);
								}}>
								<div className={"m-auto"}>
									Export
								</div>
							</div>
							<label className={"bg-red-500 w-40 h-10 text-center my-4 flex mx-auto rounded cursor-pointer"}
								htmlFor={"file"}>
								<div className={"m-auto"}>
									Import
								</div>
							</label>
						</div>
						<input id={"file"}
							type={"file"}
							className={"hidden"}
							onInput={(e) => {
								let eventTarget = e.target as HTMLInputElement;
								const file = eventTarget.files![0];
								const reader = new FileReader();
								reader.onload = (e) => {
									const content = e.target!.result as string;
									grid.loadGrid(content);
									setGridContent(grid.getGrid());
									eventTarget.files = null;
								};
								reader.readAsText(file);
							}}>
						</input><br />
						<label htmlFor={"color"}
							className={"text-sm text-gray-500 dark:text-gray-400"}>Color</label>
						<select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							onChange={(e) => {
								grid.setColorType(parseInt(e.target.value));
							}}
							id={"color"}>
							<option value={0}>
								Arbres
							</option>
							<option value={1}>
								Arbres denses
							</option>
							<option value={2}>Eau</option>
							<option value={3}>Champ</option>
							<option value={4}>Feu</option>
							<option value={6}>Tranchées</option>
						</select><br />
						<label className={"text-sm text-gray-500 dark:text-gray-400"}>Pen size</label>
						<div className="relative mb-6">
							<input className={"w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"}
								type={"range"}
								min={1}
								max={16}
								defaultValue={1}
								onInput={(e) => {
									grid.setDrawingRadius(parseInt((e.target as HTMLInputElement).value));
								}} />
							<span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">Min (1)</span>
							<span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">5</span>
							<span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">11</span>
							<span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">Max (16)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
