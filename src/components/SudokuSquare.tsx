import {Box,Grid, GridItem, Input} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {modifyGameBoardBox, setNotes} from "../redux/SudokuSlice";
import {socket} from "../App";

export const SudokuSquare = (props: SudokuSquareProps) => {
    const boxNumber = props.number;
    const id = useAppSelector(state => state.id);
    const [initNumber,setInitNumber] = useState(props.number === -1 ? -1 : props.number);
    const dispatch = useAppDispatch();
    const stateNotes = useAppSelector(state => state.notes);
    const blockStateNotes = stateNotes.find(notes => notes[0]['boardIndex'] === props.boardIndex)
    const [boxNotes,setBoxNotes] = useState(blockStateNotes !== undefined ? blockStateNotes : Array(9).fill({value: '', boardIndex: props.boardIndex}))

    useEffect(() => {
        if(blockStateNotes !== undefined){
            setBoxNotes(blockStateNotes);
        }
    },[stateNotes]);

    const handleBoxChange = (e:any) => {
        const value = e.target.value;
        if (value >= 0 && value <= 9){
            dispatch(modifyGameBoardBox({number: +value,index: props.boardIndex}))
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            dispatch(modifyGameBoardBox({number: -1,index: props.boardIndex}))
            setInitNumber(-1)
        }
    }

    const handleNoteChange = (e:any, index:number) => {
        // TODO Change this to improved method possibly using Object.assign and remove repeat code
        const value = e.target.value;
        if (value >= 0 && value <= 9){
            const tempNotes = [...boxNotes];
            // @ts-ignore
            tempNotes[index] = {value: value, boardIndex: props.boardIndex};
            setBoxNotes(tempNotes);
            socket.emit('modifyNotes', {notes: tempNotes, id: id})
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            const tempNotes = [...boxNotes];
            tempNotes[index] = {value: value, boardIndex: props.boardIndex};
            setBoxNotes(tempNotes);
            socket.emit('modifyNotes', {notes: tempNotes, id: id})
        }
    }

    const numberStyle = initNumber !== -1 ? 'black.300' : 'red.500'

    return (
                        <Grid key={props.boardIndex} templateRows='repeat(3, 1fr)'
                              templateColumns='repeat(3, 1fr)'>
                                {boxNotes.map(({value,boardIndex},index)=> {
                                    return (
                                        <Box key={index}>
                                            {index === 4 ?
                                                <GridItem  w='25px' h='25px'>
                                                    <Input variant='unstyled'
                                                           textColor={numberStyle}
                                                           textAlign='center'
                                                           type='number'
                                                           min={1}
                                                           max={9}
                                                           pattern="/^[0-9]{0,1}$/"
                                                           readOnly={initNumber !== -1}
                                                           value={(boxNumber === -1 ) ? '': boxNumber}
                                                           onChange={e => handleBoxChange(e)}
                                                    />
                                                </GridItem>
                                                :
                                                <GridItem  w='25px' h='25px'>
                                                <Input value={value}
                                                       variant='unstyled'
                                                       textColor={"lightgrey"}
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
}