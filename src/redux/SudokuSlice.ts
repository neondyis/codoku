import {configureStore, createSlice} from "@reduxjs/toolkit";
import {stat} from "fs";
import {DateTime} from "luxon";

const SudokuSlice = createSlice({
    name: 'sudoku',
    initialState: {
        id: '',
        gameArray: [],
        solvedArray:[],
        currentTurn: '',
        user: '',
        startTime: '00:00',
        notes: [],
        won: false
    },
    reducers: {
        setID: (state,action) => {
            return {
                ...state,
                id: action.payload
            }
        },
        setCurrentTurn: (state,action) => {
            return {
                ...state,
                currentTurn: action.payload
            }
        },
        setUser: (state,action) => {
            return {
                ...state,
                user: action.payload
            }
        },
        modifyGameBoard: (state,action) => {
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
        },
        setStartTime: (state,action) => {
            return {
                ...state,
                startTime: action.payload
            }
        },
        setNotes: (state,action) => {
            return {
                ...state,
                notes: action.payload
            }
        },
        setWon: (state, action) => {
            return {
                ...state,
                won: action.payload
            }
        }
    }
})


export const {modifyGameBoard, setSolutionBoard,modifyGameBoardBox,setID,setUser,setCurrentTurn,setStartTime, setNotes,setWon} = SudokuSlice.actions;

export const sudokuStore = configureStore({
    reducer: SudokuSlice.reducer
})

export type RootState = ReturnType<typeof sudokuStore.getState>
export type AppDispatch = typeof sudokuStore.dispatch