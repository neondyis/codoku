import React, {createContext, useContext, useState} from "react";
// import { DateTime } from "luxon";

const SudokuContext = createContext<SudokuContextProps>({
    gameArray: [], setGameArray: () => {},
    // timeGameStarted: DateTime.now(), setTimeGameStarted: () => {},
    initArray: [], setInitArray: () => {},
    won: false, setWon: () => {} });

export const SudokuProvider = ({ children }: SudokuProviderProps) => {
    const [ gameArray, setGameArray ] = useState<number[][]>([]);
    // const [ timeGameStarted, setTimeGameStarted ] = useState<any>(DateTime.now());
    // const [ cellSelected, setCellSelected ] = useState<number>(-1);
    const [ initArray, setInitArray ] = useState<number[][]>([]);
    const [ won, setWon ] = useState<boolean>(false);

    return (
        <SudokuContext.Provider value={
            {
                gameArray, setGameArray,
                // timeGameStarted, setTimeGameStarted,
                // cellSelected, setCellSelected,
                initArray, setInitArray,
                won, setWon
            }
        }>
            {children}
        </SudokuContext.Provider>
    );
};

type SudokuContextProps = {
    gameArray: number[][],
    initArray: number[][],
    won: boolean,
    setGameArray: React.Dispatch<React.SetStateAction<number[][]>>,
    setInitArray: React.Dispatch<React.SetStateAction<number[][]>>,
    setWon: React.Dispatch<React.SetStateAction<boolean>>
}

type SudokuProviderProps = {
    children: React.ReactElement
};

export const useSudokuContext = (): SudokuContextProps => useContext(SudokuContext);