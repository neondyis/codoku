import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Input,
    Tab,
    TabList,
    TabPanel, TabPanels,
    Tabs
} from "@chakra-ui/react";
import {SudokuCreator} from "@algorithm.ts/sudoku";
import {useEffect, useState} from "react";
import {modifyGameBoard, setID, setSolutionBoard} from "../redux/SudokuSlice";
import {useAppDispatch} from "../redux/hooks";
import {useNavigate} from "react-router-dom";
import io from "socket.io-client";

export const socket = io(`http://localhost:4000`);

export const MainMenu = () => {
    const [gridSize,setGridSize] = useState(0);
    const [difficulty,setDifficulty] = useState(0);
    const [gameId,setGameID] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('receiveGameData', (data) => {
            dispatch(setID(data._id));
            dispatch(modifyGameBoard(data.puzzle));
            dispatch(setSolutionBoard(data.solution));
            navigate('/play')
        })

        socket.on('updateGameData', (data) => {
            dispatch(modifyGameBoard(data.puzzle));
            // navigate('/play')
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    },[])

    const sendPing = () => {
        socket.emit('ping');
    }

    const createBoard = () => {
        const sudokuBoardManager:any = new SudokuCreator({ childMatrixWidth:gridSize }).createSudoku(difficulty);
        socket.emit('initiateGame', sudokuBoardManager);
    }

    const joinGame = () => {
        socket.emit('getGameData', {id: gameId})
        // navigate('/play');
    }

    return (
        <Center>
            <Card>
                <CardHeader>
                    Create or Join a Cudoku Room
                </CardHeader>
                <CardBody>
                    <Tabs >
                        <TabList>
                            <Tab>Create</Tab>
                            <Tab>Join</Tab>
                        </TabList>
                        <TabPanels maxW={'50vw'}>
                            <TabPanel>
                                <Input onChange={e => setGridSize(+e.target.value)} placeholder='Grid Size (e.g 3 = 9x9)' />
                                <Input onChange={e => setDifficulty(+e.target.value)} placeholder='Difficulty - (0.1 - 1.0)' />
                                <Button onClick={createBoard}>Create</Button>
                            </TabPanel>
                            <TabPanel>
                                <Input onChange={e => setGameID(e.target.value)} placeholder='Input Room Code' />
                                <Button onClick={joinGame}>Join</Button>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>
        </Center>
    )
}