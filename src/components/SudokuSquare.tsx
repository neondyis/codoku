import {Box,Grid, GridItem, Input} from "@chakra-ui/react";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {modifyGameBoardBox, setNotes} from "../redux/SudokuSlice";
import {socket} from "../App";

// TODO Fix pepega code here and clean up code all over
export const SudokuSquare = (props: SudokuSquareProps) => {
    const dispatch = useAppDispatch();
    const boxNumber = props.number;
    const id = useAppSelector(state => state.id);
    const initNumber = useAppSelector(state => state.initArray[props.boardIndex]);
    const stateNotes = useAppSelector(state => state.notes);
    const blockStateNotes = stateNotes.find(notes => notes[0]['boardIndex'] === props.boardIndex)
    const [boxNotes,setBoxNotes] = useState(blockStateNotes !== undefined ? blockStateNotes : Array(9).fill({value: '', boardIndex: props.boardIndex}))

    const [numberStyle,setNumberStyle] =  useState();
    const [backgroundStyle,setBackgroundStyle] =  useState('white.500');
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        if(blockStateNotes !== undefined && !isInit){
            setBoxNotes(blockStateNotes);
            setIsInit(true);
        }

    },[stateNotes,boxNumber]);

    const handleBoxChange = (e:any) => {
        const value = e.target.value;
        if (value >= 0 && value <= 9){
            dispatch(modifyGameBoardBox({number: +value,index: props.boardIndex}))
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            dispatch(modifyGameBoardBox({number: -1,index: props.boardIndex}))
        }
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
                                        <Box key={index} backgroundColor={initNumber !== -1 ? 'black.300': +boxNumber === +props.solutionNumber ? 'gray.100' : 'whiteAlpha.500'}>
                                            {index === 4 ?
                                                <GridItem maxWidth={'25px'}>
                                                    <Input variant='unstyled'
                                                           textColor={initNumber !== -1 ? 'whiteAlpha.800': +boxNumber === +props.solutionNumber ? 'green.300' : 'red.300'}
                                                           textAlign='center'
                                                           type='number'
                                                           fontSize='medium'
                                                           min={1}
                                                           max={9}
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
    solutionNumber: number
}