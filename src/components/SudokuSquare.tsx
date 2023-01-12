import {Center, Grid, GridItem, Input} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useSudokuContext} from "../context/SudokuContext";

// TODO Move from using numbers to use init array stuff from the context and remove redundancy
export const SudokuSquare = (props: SudokuSquareProps) => {
    const [numbers,setNumbers] = useState([...props.numbers]);
    const initNumbersArray = props.numbers;
    const {initArray} = useSudokuContext();

    useEffect(() => {
    },[])

    const handleBoxChange = (e:any,index: number) => {
        const value = e.target.value;
        if (value > 0 && value <= 9){
            numbers[index] = +value;
            setNumbers([...numbers])
        }
        if(e.nativeEvent.inputType === 'deleteContentBackward'){
            numbers[index] = 0;
            setNumbers([...numbers]);
        }
        initArray[props.boardIndex] = numbers;
    }

    return (
        <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(3, 1fr)' gap={0}>
            {numbers.length > 0 ?
            numbers.map((n:number,index:number) => {
                return (
                        <GridItem border='1px black solid' key={index}>
                            <Center w='50px' h='50px'>
                                <Input variant='unstyled' textAlign='center' type='number'
                                       min={1}
                                       max={9}
                                       pattern="/^[0-9]{0,1}$/"
                                       readOnly={initNumbersArray[index] !== 0}
                                       value={numbers[index] === 0 ? '': numbers[index]} onChange={e => handleBoxChange(e,index)}>
                                </Input>
                            </Center>
                        </GridItem>
                )
            }):
            <div> loading</div>
            }
        </Grid>
    )
}

type SudokuSquareProps = {
    numbers: any;
    boardIndex:any;
}