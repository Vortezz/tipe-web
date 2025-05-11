export enum SquareType {
	Tree,
	DenseTree,
	Water,
	Field,
	Fire,
	Trench
}

export function getColorFor(i: SquareType) {
	if (i === SquareType.Tree) {
		return "#1E5134";
	} else if (i === SquareType.DenseTree) {
		return "#123121";
	} else if (i === SquareType.Field) {
		return "#35694A";
	} else if (i === SquareType.Water) {
		return "#85AFAC";
	} else if (i === SquareType.Fire) {
		return "#FD3617";
	} else {
		return "#4d0500";
	}
}

export function getSquareType(i: number) {
	if (i === 0) {
		return SquareType.Tree;
	} else if (i === 1) {
		return SquareType.DenseTree;
	} else if (i === 2) {
		return SquareType.Water;
	} else if (i === 3) {
		return SquareType.Field;
	} else if (i === 4) {
		return SquareType.Fire;
	} else {
		return SquareType.Trench;
	}
}