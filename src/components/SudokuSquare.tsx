import {Center, Flex, Grid, GridItem, Input} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useAppDispatch} from "../redux/hooks";
import {modifyGameBoardBox} from "../redux/SudokuSlice";
import io from "socket.io-client";
import {socket} from "./MainMenu";

// TODO Move from using numbers to use init array stuff from the context and remove redundancy
export const SudokuSquare = (props: SudokuSquareProps) => {
    const boxNumber = props.number;
    const [initNumber,setInitNumber] = useState(props.number === -1 ? -1 : props.number);
    const dispatch = useAppDispatch();

    const handleBoxChange = (e:any) => {
        const value = e.target.value;
        if (value > 0 && value <= 9){
            dispatch(modifyGameBoardBox({number: +value,index: props.boardIndex}))
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            dispatch(modifyGameBoardBox({number: -1,index: props.boardIndex}))
            setInitNumber(-1)
        }
    }

    return (
                        <Flex border='1px black solid' key={props.boardIndex}>
                            <Center w='50px' h='50px'>
                                <Input variant='unstyled' textAlign='center' type='number'
                                       min={1}
                                       max={9}
                                       pattern="/^[0-9]{0,1}$/"
                                       readOnly={initNumber !== -1}
                                       value={(boxNumber === -1 ) ? '': boxNumber}
                                       onChange={e => handleBoxChange(e)}
                                >
                                </Input>
                            </Center>
                        </Flex>
    )
}

type SudokuSquareProps = {
    number: number;
    boardIndex:any;
}