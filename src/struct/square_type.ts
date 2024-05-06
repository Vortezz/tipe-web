export enum SquareType {
	Tree,
	Water,
	Field,
	Fire
}

export function getColorFor(i: SquareType) {
	if (i === SquareType.Tree) {
		return "green";
	} else if (i === SquareType.Field) {
		return "brown";
	} else if (i === SquareType.Water) {
		return "blue";
	} else {
		return "red";
	}
}

export function getSquareType(i: number) {
	if (i === 0) {
		return SquareType.Tree;
	} else if (i === 1) {
		return SquareType.Field;
	} else if (i === 2) {
		return SquareType.Water;
	} else {
		return SquareType.Fire;
	}
}