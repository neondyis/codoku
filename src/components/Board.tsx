import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Flex,
    Grid,
    GridItem,
    Text
} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {setUser, setWon} from "../redux/SudokuSlice";
import {socket} from "../App";
import {DateTime} from "luxon";
import {SudokuSolver} from "@algorithm.ts/sudoku";
import './Board.css';
import {useCookies} from "react-cookie";

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
    const isWon = useAppSelector(state => state.won);
    const [cookies, setCookie] = useCookies();
    // TODO Investigate what is causing the loading twice of data
    let cookieLoadcounter = 0;

    useEffect(() => {
        if(!gameInitiated){
            if(id){
                socket.emit('getGameData',id)
            }else{
                if(cookieLoadcounter === 0){
                    const cookieId = cookies.gameId;
                    socket.emit('getGameData', {id : cookieId});
                    dispatch(setUser(cookies.user));
                    cookieLoadcounter ++;
                }
            }
            setGameInitiated(true);
            setInterval(() => {
                // @ts-ignore
                setGameTime(DateTime.now().diff(DateTime.fromISO(startTime),'seconds').toFormat("hh:mm:ss"))
            }, 1000)
        }
    },[gameTime])


    const compareBoard = () => {
        const solver = new SudokuSolver({childMatrixWidth: 3});
        const isWonCheck = solver.solve([...gameBoard],[...solutionBoard]);
        if(isWonCheck){
            dispatch(setWon(isWonCheck));
        }
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
            <CardBody>
                {!isWon ?
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
                    </Center>:
                    <Center>
                        <Text>
                            You have won
                        </Text>
                    </Center>
                }
            </CardBody>
            <CardFooter>
                <Button onClick={compareBoard}>Check For Win</Button>
                <Button onClick={confirmTurn}>Confirm Turn</Button>
            </CardFooter>
        </Card>
    )
}

type Board = {}