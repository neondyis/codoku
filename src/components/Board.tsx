import {Button, Center, Flex, Grid} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {modifyGameBoard, setSolutionBoard} from "../redux/SudokuSlice";
import {createSudokuBoardData, SudokuCreator, toMatrixStyleBoardData} from "@algorithm.ts/sudoku";
import io from "socket.io-client";
import {socket} from "./MainMenu";

export const Board = () => {
    const gameBoard = useAppSelector(state => state.gameArray);
    const solutionBoard = useAppSelector(state => state.solvedArray);
    const id = useAppSelector(state => state.id);
    const dispatch = useAppDispatch();
    const [gameInitiated,setGameInitiated] = useState(false);

    useEffect(() => {
        if(!gameInitiated){
            setGameInitiated(true);
        }
    },[])


    const compareBoard = () => {
        dispatch(modifyGameBoard(solutionBoard));
        // setGameBoard(sudokuBoardManager.solution)
        // let completedBoard = false;
        // for(let x = 0; x < initArray.length;x++){
        //     for(let y = 0; y < initArray[x].length;y++){
        //         if(initArray[x][y] === gameArray[x][y]){
        //             completedBoard = true;
        //         }else{
        //            return;
        //         }
        //     }
        // }
        // setWon(completedBoard)
    }

    const confirmTurn = () => {
        socket.emit('playTurn', {puzzle: gameBoard});
    }

    return (
        <Center h='100%' w='100%'>
            {id}
            {gameBoard.length > 0 ?
                    <Grid templateRows='repeat(3, 1fr)'
                            templateColumns='repeat(9, 1fr)'>
                        {gameBoard.map((block: number, index: number) => {
                            return (
                                        <Flex key={index} >
                                            <SudokuSquare number={block} boardIndex={index}/>
                                        </Flex>
                            )
                        })
                        }
                    </Grid>
                :
                <div>Loading</div>
            }
            <Button onClick={compareBoard}>Check For Win</Button>
            <Button onClick={confirmTurn}>Confirm Turn</Button>
        </Center>
    )
}

type Board = {}