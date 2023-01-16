import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Input, Select,
    Tab,
    TabList,
    TabPanel, TabPanels,
    Tabs
} from "@chakra-ui/react";
import {SudokuCreator} from "@algorithm.ts/sudoku";
import {useEffect, useState} from "react";
import {
    modifyGameBoard,
    setCurrentTurn,
    setID,
    setNotes,
    setSolutionBoard,
    setStartTime,
    setUser
} from "../redux/SudokuSlice";
import {useAppDispatch} from "../redux/hooks";
import {useNavigate} from "react-router-dom";
import io from "socket.io-client";
import {DateTime} from "luxon";
import {ArrowDownIcon} from "@chakra-ui/icons";

export const socket = io(`http://localhost:4000`);

export const MainMenu = () => {
    const [gridSize,setGridSize] = useState(0);
    const [difficulty,setDifficulty] = useState(0);
    const [gameId,setGameID] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [gameList, setGamelist] = useState([]);

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('getGameList');
        });

        socket.on('gameListInfo', (data) => {
         setGamelist(data)
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('receiveGameData', (data) => {
            dispatch(setID(data._id));
            dispatch(modifyGameBoard(data.puzzle));
            dispatch(setCurrentTurn(data.currentTurn));
            dispatch(setSolutionBoard(data.solution));
            dispatch(setStartTime(data.startTime));
            dispatch(setNotes(data.notes));
            navigate('/play')
        })

        socket.on('updateGameData', (data) => {
            console.log("Update Came")
            dispatch(modifyGameBoard(data.puzzle));
            dispatch(setCurrentTurn(data.currentTurn));
        })

        socket.on('updateClientNotes', (data) => {
            console.log(data)
            dispatch(setNotes(data));
        })

        console.log(gameId)
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };

    },[gameList,gameId])

    const sendPing = () => {
        socket.emit('ping', {id: gameId});
    }

    const createBoard = () => {
        const sudokuBoardManager:any = new SudokuCreator({ childMatrixWidth:gridSize }).createSudoku(difficulty);
        const startTime = DateTime.now().toJSDate();
        dispatch(setUser(name));
        dispatch(setStartTime(startTime.toDateString()))
        socket.emit('initiateGame', {...sudokuBoardManager,name,startTime});
    }

    const joinGame = () => {
        socket.emit('joinGame', {id:gameId ,name: name})
        dispatch(setUser(name));
        navigate('/play');
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
                                <Input onChange={e => setName(e.target.value)} placeholder={'Name'}/>
                                <Input onChange={e => setGridSize(+e.target.value)} placeholder='Grid Size (e.g 3 = 9x9)' />
                                <Input onChange={e => setDifficulty(+e.target.value)} placeholder='Difficulty - (0.1 - 1.0)' />
                                <Button onClick={createBoard}>Create</Button>
                            </TabPanel>
                            <TabPanel>
                                <Input onChange={e => setName(e.target.value)} placeholder={'Name'}/>
                                <Select placeholder='Select a game' onChange={e => setGameID(e.target.value)}>
                                    {gameList.map((game,index) => {
                                        return <option key={index} value={game['_id']}>{game['_id']} - Current Turn - {game['currentTurn']}</option>
                                    })}
                                </Select>
                                <Button onClick={joinGame}>Join</Button>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>
        </Center>
    )
}