import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {Board} from "./Board";
import {
    Card,
    CardBody,
    CardHeader,
    Center,
    createStandaloneToast,
    Grid,
    GridItem,
    Text,
    Tag,
    Flex,
    Box,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button, TagRightIcon
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
import {socket} from "../App";
import {modifyGameBoard, setIsInitialized, setStartTime, setUser, setUsers, setWon} from "../redux/SudokuSlice";
import {DateTime} from "luxon";

// TODO Set up timer and when timer is over 3 mins stop entry and show winner with a toast

// TODO Clean up code place code in own components
// TODO clean up use of redux
// TODO place tsx in pages folders

export const Cupedoku = ({}: CupedokuProps)  => {
    // Functional Methods
    const dispatch = useAppDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cookies, setCookie] = useCookies();
    const { ToastContainer, toast } = createStandaloneToast();

    // Board Variables
    const gameBoard: number[] = useAppSelector(state => state.gameArray);
    const solutionBoard: number[] = useAppSelector(state => state.solvedArray);
    const initArray: number[] = useAppSelector(state => state.initArray);
    const maxScore: number = initArray.filter(value => value === -1).length;
    const id: string = useAppSelector(state => state.id);
    const user: string = useAppSelector(state => state.user);
    const users: any[] = useAppSelector(state => state.users);
    const startTime: any =  useAppSelector(state => state.startTime);
    const isWon:boolean = useAppSelector(state => state.won);
    const isInitialized = useAppSelector(state => state.isInitialized);
    let cookieLoadcounter = 0;
    const [gameTime, setGameTime] = useState(null);
    const timer:any = useRef(null);

    useEffect(() => {
        if(!isInitialized){
            if(id){
                socket.emit('getGameData',id)
            }else{
                if(cookieLoadcounter === 0){
                    const cookieId = cookies.gameId;
                    socket.emit('getGameData', {id : cookieId});
                    dispatch(setUser(cookies.user));
                }
                cookieLoadcounter ++;
            }
        }else {
            const gameBoardData = localStorage.getItem(id);
            if(gameBoardData){
                dispatch(modifyGameBoard(JSON.parse(gameBoardData)));
            }
        }
    },[id])

    useEffect(() => {
        socket.on('updateUsers',(data) => {
            dispatch(setUsers(data));
        })
        if(users.length > 0){
            const currentUserScore = users.find(u => u.name === user).score;
            if(currentUserScore >= maxScore){
                dispatch(setWon(true))
                clearInterval(timer.current)
            }
        }
    },[users])

    useEffect(() =>{
        socket.on('startGame', (data)=>{
            dispatch(setStartTime(data.startTime))
            if(!isInitialized){
                // @ts-ignore
                setGameTime(DateTime.fromISO(data.startTime).plus({ minutes: 5 }).diff(DateTime.now()))
            }
            dispatch(setIsInitialized(true));
        })
    },[])

    useEffect(() => {
        if(isInitialized){
            const isGameOver = DateTime.fromISO(startTime).plus({ minutes: 5 }).diff(DateTime.now()).milliseconds <= 0;
            // @ts-ignore
            if(!gameTime){
                if(isGameOver && !isWon){
                    dispatch(setWon(true))
                }else{
                    // @ts-ignore
                    setGameTime(DateTime.fromISO(startTime).plus({ minutes: 5 }).diff(DateTime.now()))
                }
            }else{
                if(isGameOver && !isWon && timer.current !== null){
                    dispatch(setWon(true))
                    clearInterval(timer.current)
                }else{
                    if(timer.current === null){
                        // @ts-ignore
                        timer.current = setInterval(() => setGameTime((state) => state.minus({ second: 1 })), 1000);
                    }
                }
            }
        }
    },[isInitialized,gameTime])

    // TODO save board state of game on client side using cookies in the sudoku square component

    const startGame = () => {
        socket.emit('setStartTime',{id});
        onClose();
    }

    const setReady = () => {
        socket.emit('updateStatus',{id,user});
    }

    const checkAllReady = (): boolean => {
        return !(users.filter(user => user.startStatus === true).length === users.length);
    }

    return(
        <>
            <Modal closeOnOverlayClick={false} isOpen={!isInitialized} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start Confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                       <Text>Waiting for the following players to confirm start.</Text>
                        {users.length > 0 &&
                        <>
                            {users.map((user,index) => {
                                return (
                                    <Tag key={index} colorScheme={user.startStatus ? 'teal': 'orange'}>
                                        {user.name}
                                        <br/>
                                        <TagRightIcon as={user.startStatus ? CheckIcon:CloseIcon}/>
                                    </Tag>)
                            })}
                        </>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button hidden={checkAllReady()}  colorScheme='blue' mr={3} onClick={startGame}>
                            Start Game
                        </Button>
                        <Button hidden={!checkAllReady()} colorScheme='green' mr={3} onClick={setReady} rightIcon={<CheckIcon/>}>
                            Ready
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Center alignItems='center' h='100%'>
                <Grid
                    templateColumns='repeat(4,1fr)'
                    gap={10}
                >
                    <GridItem colSpan={1}>
                        <Card >
                            <CardHeader>
                                <Text textAlign='center'>Game Info</Text>
                                <Text fontSize='xs' textAlign='center'>Room ID<Tag colorScheme='orange'>{id}</Tag></Text>
                                {/*// @ts-ignore*/}
                                {(gameTime !== null && !isWon) &&  <Text fontSize='xs' textAlign='center'>Time {gameTime.toFormat('mm:ss')}</Text>}
                                {isWon && <Text fontSize='xs' textAlign='center'>Game Over</Text>}
                            </CardHeader>
                            <CardBody>
                                <Flex flexDirection='column'>
                                    <Box>
                                        <Text>Scores</Text>
                                        <Flex flexDirection='row' gap={2}>
                                            {users.length > 0 &&
                                                <>
                                                    {users.map((user,index) => {
                                                        return (<Tag key={index} colorScheme={index % 2 === 0 ? 'blue': 'pink'}>{user.name} - {user.score}</Tag>)
                                                    })}
                                                </>
                                            }
                                        </Flex>
                                    </Box>
                                </Flex>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem w={'100%'} colSpan={3}>
                        <Board gameBoard={gameBoard} solutionBoard={solutionBoard}></Board>
                    </GridItem>
                </Grid>
            </Center>
        </>
    )
}

type CupedokuProps = {

}