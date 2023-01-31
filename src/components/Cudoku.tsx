import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center, Container, createStandaloneToast,
    Flex,
    Grid,
    GridItem, Tag,
    Text
} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {setUser, setWon} from "../redux/SudokuSlice";
import {socket} from "../App";
import {DateTime} from "luxon";
import {ISudokuBoardData, SudokuSolver} from "@algorithm.ts/sudoku";
import './Board.css';
import {useCookies} from "react-cookie";
import { Board } from "./Board";

// TODO Add game time in and make it proper this time
// TODO Make grid more mobile friendly
// TODO Make competitive multiplayer
export const Cudoku = () => {
    const gameBoard: number[] = useAppSelector(state => state.gameArray);
    const solutionBoard: number[] = useAppSelector(state => state.solvedArray);
    const id: string = useAppSelector(state => state.id);
    const user: string = useAppSelector(state => state.user);
    const currentTurn: string = useAppSelector(state => state.currentTurn);
    const dispatch = useAppDispatch();
    const [gameInitiated,setGameInitiated] = useState(false);
    const [gameTime, setGameTime] = useState('00:00')
    const isWon:boolean = useAppSelector(state => state.won);
    const [cookies, setCookie] = useCookies();
    const { ToastContainer, toast } = createStandaloneToast();
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
        }
    },[])

    const compareBoard = () => {
        let isWonCheck = true;
        gameBoard.forEach((num, i) => {
            if(num !== solutionBoard[i]){
                isWonCheck = false;
                return;
            }
        })

        if(isWonCheck){
            dispatch(setWon(isWonCheck));
            toast({
                title: 'Congrats',
                description: 'The sudoku board is complete',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }else{
            toast({
                title: 'Not Complete',
                description: 'The sudoku board is incorrect',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const confirmTurn = () => {
        if(user === currentTurn){
            socket.emit('playTurn', {id: id, puzzle: gameBoard, currentTurn: currentTurn});
        }
    }

    return (
        <>
            <Flex flexDirection={"column"} alignItems={"center"} justify={"space-evenly"}>
                <Tag  borderRadius='full' variant='solid' colorScheme='teal' minW={'auto'}>{id}</Tag>
                <Tag borderRadius='full' variant='solid' colorScheme={currentTurn === user ? "linkedin" : "orange" } minW={'auto'}>{user}</Tag>
                <Tag borderRadius='full' variant='solid' colorScheme='teal' minW={'auto'}>{currentTurn}'s Turn</Tag>
            </Flex>
             <Board gameBoard={gameBoard} solutionBoard={solutionBoard}></Board>
            <Flex alignItems={"center"} justify={"space-evenly"}>
                <Button onClick={compareBoard}>Check For Win</Button>
                <Button onClick={confirmTurn}>Confirm Turn</Button>
            </Flex>
            <ToastContainer />
        </>
    )
}

type Board = {}