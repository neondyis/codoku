import {Box,Grid, GridItem, Input} from "@chakra-ui/react";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {modifyGameBoard, modifyGameBoardBox, setNotes} from "../redux/SudokuSlice";
import {socket} from "../App";

// TODO Fix pepega code here and clean up code all over
export const SudokuSquare = (props: SudokuSquareProps) => {
    const dispatch = useAppDispatch();
    const boxNumber = props.number;
    const solutionNumber = props.solutionNumber;
    const boardIndex = props.boardIndex;
    const id = useAppSelector(state => state.id);
    const gameBoard: number[] = useAppSelector(state => state.gameArray);
    const initNumber = useAppSelector(state => state.initArray[props.boardIndex]);
    const stateNotes = useAppSelector(state => state.notes);
    const user: string = useAppSelector(state => state.user);
    const blockStateNotes = stateNotes.find(notes => notes[0]['boardIndex'] === props.boardIndex);
    const [boxNotes,setBoxNotes] = useState(blockStateNotes !== undefined ? blockStateNotes : Array(9).fill({value: '', boardIndex: props.boardIndex}))
    const [isInit, setIsInit] = useState(false);
    const isWon:boolean = useAppSelector(state => state.won);
    const [isScored,setIsScored] = useState(false);

    useEffect(() => {
        if(blockStateNotes !== undefined && !isInit){
            setBoxNotes(blockStateNotes);
            setIsInit(true);
        }
    },[stateNotes,boxNumber]);

    useEffect(() => {

    },[isScored])

    const handleBoxChange = (e:any) => {
        const value = e.target.value;
        const updatedBoard = [...gameBoard];
        if (value >= 0 && value <= 9){
            updatedBoard[boardIndex] = +value;
            dispatch(modifyGameBoard(updatedBoard))
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            updatedBoard[boardIndex] = -1;
            dispatch(modifyGameBoardBox(updatedBoard))
        }
        if(+value === solutionNumber && !isScored){
            socket.emit('updateScore',{id,user});
            setIsScored(true);
        }
        localStorage.setItem(id,JSON.stringify(updatedBoard));
    }

    const handleNoteChange = (e:any, index:number) => {
        const value = e.target.value;
        if ((value >= 0 && value <= 9 ) || e.nativeEvent.inputType === 'deleteContentBackward'){
            const tempNotes = [...boxNotes];
            tempNotes[index] = {value: value, boardIndex: props.boardIndex};
            setBoxNotes(tempNotes);
            socket.emit('modifyNotes', {notes: tempNotes, id: id})
        }
    }

    return (
                        <Grid key={props.boardIndex}
                              templateRows='repeat(3, minmax(1px,1fr))'
                              templateColumns='repeat(3, minmax(1px,1fr))'
                        >
                                {boxNotes.map(({value,boardIndex},index)=> {
                                    return (
                                        <Box key={index} backgroundColor={initNumber !== -1 ? 'black.300': +boxNumber === +props.solutionNumber ? 'whiteAlpha.500' : 'whiteAlpha.100'}>
                                            {index === 4 ?
                                                <GridItem maxWidth={'25px'}>
                                                    <Input variant='unstyled'
                                                           textColor={initNumber !== -1 ? 'whiteAlpha.800': +boxNumber === +props.solutionNumber ? 'teal.600' : 'orange.300'}
                                                           textAlign='center'
                                                           type='number'
                                                           fontSize='medium'
                                                           min={1}
                                                           max={9}
                                                           disabled={(boxNumber === +props.solutionNumber && initNumber === -1) || isWon}
                                                           pattern="/^[0-9]{0,1}$/"
                                                           readOnly={initNumber !== -1}
                                                           value={(boxNumber === -1 ) ? '': boxNumber}
                                                           onChange={e => handleBoxChange(e)}
                                                    />
                                                </GridItem>
                                                :
                                                <GridItem maxWidth={'25px'}>
                                                <Input value={value}
                                                       variant='unstyled'
                                                       textColor={"lightgrey"}
                                                       fontSize='small'
                                                       textAlign='center'
                                                       type='number'
                                                       min={1}
                                                       max={9}
                                                       pattern="/^[0-9]{0,1}$/"
                                                       onChange={e => {handleNoteChange(e,index)}}
                                                />
                                                </GridItem>
                                            }
                                        </Box>
                                    )
                                })}
                        </Grid>
    )
}

type SudokuSquareProps = {
    number: number;
    boardIndex:any;
    solutionNumber: number;
}