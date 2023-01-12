import {validateBoard, validateNumber, shuffleArray, generateCoords, deepClone} from "./Shared";

export function generate() {
	const sudoku: number[][] = [];

	for (let y = 0; y < 9; y++) {
		sudoku[y] = [];

		for (let x = 0; x < 9; x++) {
			sudoku[y][x] = 0;
		}
	}

	const backTracker = (board: typeof sudoku) => {
		let x = 0;
		let y = 0;

		for (y = 0; y < 9; y++) {
			for (x = 0; x < 9; x++) {
				if (board[y][x] !== 0) continue;

				for (const num of shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
					if (!validateNumber(board, x, y, num)) continue;
					board[y][x] = num;

					if (validateBoard(board)) return true;
					if (backTracker(board)) return true;
				}
				board[y][x] = 0;
				return false;
			}
		}
		board[y][x] = 0;
		return false;
	};

	backTracker(sudoku);
	return sudoku;
}

export function removeHints(sudoku: number[][], count: number) {
	const sudokuClone = deepClone(sudoku);
	let counter = count;
	let solutions = 0;

	const solver = (board: typeof sudoku) => {
		let x = 0;
		let y = 0;

		for (y = 0; y < 9; y++) {
			for (x = 0; x < 9; x++) {
				if (board[y][x] !== 0) continue;

				for (let i = 1; i <= 9; i++) {
					if (!validateNumber(board, x, y, i)) continue;
					board[y][x] = i;

					if (validateBoard(board)) {
						solutions += 1;
						break;
					}
					if (solver(board)) return true;
				}
				board[y][x] = 0;
				return false;
			}
		}
		board[y][x] = 0;
		return false;
	};

	const coords = generateCoords();

	while (counter > 0) {
		if (coords.length <= 0) break;
		const rand = ~~(Math.random() * coords.length);
		const { x, y } = coords[rand];
		coords.splice(rand, 1);

		const num = sudokuClone[y][x];
		sudokuClone[y][x] = 0;

		solutions = 0;
		solver(deepClone(sudokuClone));

		if (solutions !== 1) {
			sudokuClone[y][x] = num;
		} else {
			counter -= 1;
		}
	}

	return sudokuClone;
}