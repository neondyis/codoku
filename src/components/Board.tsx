import {Box, Button, Card, CardFooter, CardHeader, Center, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {modifyGameBoard, setSolutionBoard} from "../redux/SudokuSlice";
import {socket} from "./MainMenu";
import {DateTime} from "luxon";
import './Board.css';

export const Board = () => {
    const gameBoard = useAppSelector(state => state.gameArray);
    const solutionBoard = useAppSelector(state => state.solvedArray);
    const id = useAppSelector(state => state.id);
    const user = useAppSelector(state => state.user);
    const currentTurn = useAppSelector(state => state.currentTurn);
    const dispatch = useAppDispatch();
    const [gameInitiated,setGameInitiated] = useState(false);
    const startTime: any =  useAppSelector(state => state.startTime);
    const [gameTime, setGameTime] = useState('00:00')

    useEffect(() => {
        if(!gameInitiated){
            if(id){
                socket.emit('getGameData',id)
            }
            setGameInitiated(true);
            setInterval(() => {
                // @ts-ignore
                setGameTime(DateTime.now().diff(DateTime.fromISO(startTime),'seconds').toFormat("mm:ss"))
            }, 1000)
        }
    },[gameTime])


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
        if(user === currentTurn){
            socket.emit('playTurn', {id: id, puzzle: gameBoard, currentTurn: currentTurn});
        }
    }


    return (
        <Card>
            <CardHeader>
                <Text>Room ID - {id}</Text>
                <Text>Your Name - {user}</Text>
                <Text>Current Turn - {currentTurn}</Text>
                <Text>Game Time - {gameTime}</Text>
            </CardHeader>
            <Center h='100%' w='100%'>
                {gameBoard.length > 0 ?
                    <Grid
                          className='sudoku-board'
                          templateRows='repeat(9, 1fr)'
                          templateColumns='repeat(9, 1fr)'
                    >
                        {gameBoard.map((block: number, index: number) => {
                            return (
                                <GridItem key={index} className='sudoku-board-block'>
                                    <SudokuSquare number={block} boardIndex={index}/>
                                </GridItem>
                            )
                        })
                        }
                    </Grid>
                    :
                    <div>Loading</div>
                }
            </Center>
            <CardFooter>
                <Button onClick={compareBoard}>Check For Win</Button>
                <Button onClick={confirmTurn}>Confirm Turn</Button>
            </CardFooter>
        </Card>
    )
}

type Board = {}