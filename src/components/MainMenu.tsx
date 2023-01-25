import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center, FormControl,
    FormLabel,
    Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select,
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
import {DateTime} from "luxon";
import {useCookies} from "react-cookie";
import {socket} from "../App";

export const MainMenu = () => {
    const [cookies, setCookie] = useCookies();
    const [gridSize,setGridSize] = useState(3);
    const [difficulty,setDifficulty] = useState(0);
    const [gameId,setGameID] = useState('');
    const [name, setName] = useState(cookies.user ? cookies.user : '');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [gameList, setGamelist] = useState([]);
    const isError = (name === '' && difficulty === 0);

    useEffect(() => {
        socket.on('gameListInfo', (data) => {
            setGamelist(data)
        });

        socket.on('navigateToBoard', () => {
            navigate('/play')
        });
    },[gameList,gameId])

    const createBoard = () => {
        const sudokuBoardManager:any = new SudokuCreator({ childMatrixWidth:gridSize }).createSudoku(difficulty);
        const startTime = DateTime.now().toJSDate();
        dispatch(setUser(name));
        dispatch(setStartTime(startTime.toDateString()))
        setCookie('user',name);
        socket.emit('initiateGame', {...sudokuBoardManager,name,startTime});
    }

    const joinGame = () => {
        console.log('emitted')
        dispatch(setUser(name));
        setCookie('user',name);
        setCookie('gameId',gameId);
        socket.emit('joinGame', {id:gameId ,name: name})
        navigate('/play');
    }

    return (
        <Center>
            <Card>
                <CardHeader>
                    Create or Join a Cudoku Room
                </CardHeader>
                <CardBody bgColor={'honeydew'} color={'mediumaquamarine'}>
                    <Tabs>
                        <TabList>
                            <Tab>Create</Tab>
                            <Tab>Join</Tab>
                        </TabList>
                        <TabPanels minW={'50vw'} maxW={'50vw'}>
                            <TabPanel>
                                <FormControl isRequired isInvalid={isError}>
                                    <FormLabel>Name</FormLabel>
                                    <Input type='text' value={name} onChange={e => setName(e.target.value)} placeholder={'Name'} isRequired/>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Grid Size</FormLabel>
                                    <NumberInput defaultValue={3}
                                                 max={9}
                                                 min={2}
                                                 value={gridSize}
                                                 onChange={(gridValue) => setGridSize(+gridValue)}
                                                 isReadOnly={true}
                                                 isRequired>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Difficulty</FormLabel>
                                    <NumberInput max={1.00}
                                                 min={0.1}
                                                 value={difficulty}
                                                 defaultValue={0.1}
                                                 precision={1} step={0.1}
                                                 onChange={difficultyValue => setDifficulty(+difficultyValue)}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <br/>
                                <Button disabled={isError} onClick={createBoard}>Create</Button>
                            </TabPanel>
                            <TabPanel>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder={'Name'}/>
                                <Select placeholder='Select a game' onChange={e => setGameID(e.target.value)}>
                                    {gameList.map((game,index) => {
                                        return <option key={index} value={game['_id']}>{game['_id']} - Current Turn - {game['currentTurn']}</option>
                                    })}
                                </Select>
                                <br/>
                                <Button disabled={isError} onClick={joinGame}>Join</Button>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>
        </Center>
    )
}