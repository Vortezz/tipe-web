export default class Grid {

	private _width: number = 512;
	private _height: number = 512;
	private _squareSize: number = 2;
	private _grid: number[][] = [];
	private _isDrawing: boolean = false;
	private _drawingType: number = 0;
	private _drawingRadius: number = 1;

	public initialize(): void {
		// Initialize the grid
		for (let i = 0; i < this._width / this._squareSize; i++) {
			this._grid[i] = [];
			for (let j = 0; j < this._height / this._squareSize; j++) {
				this._grid[i][j] = 0;
			}
		}
	}

	public loadGrid(content: string): void {
		const data = JSON.parse(content);
		this._grid = data.grid;
	}

	public getGrid(): number[][] {
		return this._grid;
	}

	getSquareSize() {
		return this._squareSize;
	}

	setCell(x: number, y: number, number: number) {
		if (x < 0 || x * this._squareSize >= this._width) {
			return;
		}

		if (y < 0 || y * this._squareSize >= this._height) {
			return;
		}

		this._grid[x][y] = number;
	}

	public isDrawing(): boolean {
		return this._isDrawing;
	}

	public setDrawing(isDrawing: boolean): void {
		this._isDrawing = isDrawing;
	}

	public getDrawingType(): number {
		return this._drawingType;
	}

	public setDrawingType(type: number): void {
		this._drawingType = type;
	}

	public getColorType(): number {
		return this._drawingType;
	}

	public setColorType(type: number): void {
		this._drawingType = type;
	}

	public getDrawingRadius(): number {
		return this._drawingRadius;
	}

	public setDrawingRadius(radius: number): void {
		this._drawingRadius = radius;
	}
}