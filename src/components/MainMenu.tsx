import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Radio,
    RadioGroup,
    Select, Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from "@chakra-ui/react";
import {SudokuCreator} from "@algorithm.ts/sudoku";
import {useEffect, useState} from "react";
import {
    setUser
} from "../redux/SudokuSlice";
import {useAppDispatch} from "../redux/hooks";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {socket} from "../App";

export const MainMenu = () => {
    // Functionality
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies();
    const navigate = useNavigate();

    // Page Variables
    const [gridSize,setGridSize] = useState(3);
    const [difficulty,setDifficulty] = useState(0.1);
    const [numPlayers,setNumPlayers] = useState(1);
    const [gameId,setGameID] = useState('');
    const [name, setName] = useState(cookies.user ? cookies.user : '');
    const [gameList, setGamelist] = useState([]);
    const [mode, setMode] = useState('coop');

    // Validation
    const isError = (name === '' && difficulty === 0);

    useEffect(() => {
        socket.on('gameListInfo', (data) => {
            setGamelist(data)
        });

        socket.on('navToGame', (data) => {
            setCookie('gameId',data.id);
            if(data.mode === 'Coop'){
                navigate('/play')
            }else{
                navigate('/fight')
            }
        })
    },[gameList,gameId])

    const createBoard = () => {
        const sudokuBoardManager:any = new SudokuCreator({ childMatrixWidth:gridSize }).createSudoku(difficulty);
        dispatch(setUser(name));
        setCookie('user',name);
        socket.emit('initiateGame', {...sudokuBoardManager,name,mode,numPlayers});
    }

    const joinGame = () => {
        dispatch(setUser(name));
        setCookie('user',name);
        setCookie('gameId',gameId);
        socket.emit('joinGame', {id:gameId ,name: name})
        if(mode === 'Coop'){
            navigate('/play')
        }else{
            navigate('/fight')
        }
    }

    const canJoin = (game:any): boolean => {
        if(game['users'].length === game['numPlayers']){
            return !(game['users'].findIndex((user: { name: any; }) => name === user.name) > -1);
        }
        return false;
    }

    return (
        <Center>
            <Card bgColor={'honeydew'} color={'mediumblue'}>
                <CardHeader>
                    Create or Join a Cudoku Room
                </CardHeader>
                <CardBody >
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
                                <FormControl isRequired isDisabled={true}>
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
                                    <FormLabel>Mode</FormLabel>
                                    <RadioGroup onChange={setMode} value={mode}>
                                        <Stack direction='row'>
                                            <Radio value='coop'>Cooperative</Radio>
                                            <Radio value='competitive'>Competitive</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                                {mode !== 'coop' &&
                                    <FormControl isRequired>
                                        <FormLabel>Number of players</FormLabel>
                                        <NumberInput max={10}
                                                     min={1}
                                                     value={numPlayers}
                                                     step={1}
                                                     onChange={numPlayers => setNumPlayers(+numPlayers)}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                }
                                <FormControl isRequired>
                                    <FormLabel>Difficulty</FormLabel>
                                    <NumberInput max={1.00}
                                                 min={0.1}
                                                 value={difficulty}
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
                                <Select placeholder='Select a game' onChange={e => {
                                    if(e.target.value !== ''){
                                        const gameInfo = JSON.parse(e.target.value)
                                        setGameID(gameInfo._id);
                                        setMode(gameInfo.type);
                                    }
                                }}>
                                    {gameList.map((game,index) => {
                                        // @ts-ignore
                                        return <option disabled={canJoin(game)}
                                                       key={index}
                                                       value={JSON.stringify(game)}>{game['_id']} - {game['type']} {game['type'] === 'Comp' ?
                                            // @ts-ignore
                                            `${game['users'].length} / ${game['numPlayers']}` :
                                            `${game['currentTurn']}'s Turn`
                                            }
                                        </option>
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