import {configureStore, createSlice} from "@reduxjs/toolkit";
import {stat} from "fs";

const SudokuSlice = createSlice({
    name: 'sudoku',
    initialState: {
        id: '',
        gameArray: [],
        solvedArray:[],
        gameTime: ''
    },
    reducers: {
        setID: (state,action) => {
            return {
                ...state,
                id: action.payload
            }
        },
        modifyGameBoard: (state,action) => {
            console.log(action.payload)
            return{
                ...state,
                gameArray: action.payload
            }
        },
        modifyGameBoardBox: (state,action) => {
            const gameboard = [...state.gameArray];

            // @ts-ignore
            gameboard[action.payload.index] = action.payload.number;
            return{
                ...state,
                gameArray: gameboard
            }
        },
        setSolutionBoard : (state, action) => {
            return{
                ...state,
                solvedArray: action.payload
            }
        }
    }
})


export const {modifyGameBoard, setSolutionBoard,modifyGameBoardBox,setID} = SudokuSlice.actions;

export const sudokuStore = configureStore({
    reducer: SudokuSlice.reducer
})

export type RootState = ReturnType<typeof sudokuStore.getState>
export type AppDispatch = typeof sudokuStore.dispatch