export function validateBoard(board: number[][]) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] === 0) return false;
        }
    }
    return true;
}

export function validateNumber(board: number[][], x: number, y: number, num: number) {
    const dx = ~~(x / 3) * 3;
    const dy = ~~(y / 3) * 3;

    return !(
        board[y].includes(num) ||
        board.map((row) => row[x]).includes(num) ||
        board
            .slice(dy, dy + 3)
            .reduce((block, row) => [...block, ...row.slice(dx, dx + 3)], [])
            .includes(num)
    );
}

export function generateCoords() {
    const coords = [] as { x: number; y: number }[];

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            coords.push({ x, y });
        }
    }
    return coords;
}

export function shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = ~~(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;

    if (obj instanceof Date) {
        const copy = new Date() as typeof obj;
        copy.setTime(obj.getTime());
        return copy as T;
    }

    if (obj instanceof Array) {
        const copy = [] as typeof obj;
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy as T;
    }

    if (obj instanceof Object) {
        const copy = {} as typeof obj;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key]);
            }
        }
        return copy as T;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
export {}