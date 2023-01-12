import {Button, Center, Flex} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";
import {generate, removeHints} from "../utility/BoardGenerator";
import {useSudokuContext} from "../context/SudokuContext";
import {useEffect} from "react";
import {solve} from "../utility/BoardSolver";

export const Board = () => {
    const sudokuBoard = removeHints(generate(),55);
    const {gameArray,initArray,won,setGameArray,setInitArray,setWon} = useSudokuContext();

    useEffect(() => {
        setGameArray(solve(sudokuBoard));
        setInitArray(sudokuBoard);
    },[])


    const compareBoard = () => {
        let completedBoard = false;
        for(let x = 0; x < initArray.length;x++){
            for(let y = 0; y < initArray[x].length;y++){
                if(initArray[x][y] === gameArray[x][y]){
                    completedBoard = true;
                }else{
                   return;
                }
            }
        }
        setWon(completedBoard)
    }

    return (
        <Center h='100%' w='100%'>
            {initArray.length > 0 ?
                <div>
                    <Flex flexDirection='column' flexWrap='wrap'>
                        {initArray.map((blockArray: number[], index: number) => {
                            return (
                                <div key={index}>
                                    {index % 3 === 0 &&
                                        <Flex>
                                            <SudokuSquare numbers={initArray[index]} boardIndex={index}/>
                                            <SudokuSquare numbers={initArray[index+1]} boardIndex={index}/>
                                            <SudokuSquare numbers={initArray[index+2]} boardIndex={index}/>
                                        </Flex>
                                    }
                                </div>
                            )
                        })
                        }
                    </Flex>
                    <Button onClick={compareBoard}>Check For Win</Button>
                </div>
                :
                <div>Loading</div>
            }
        </Center>
    )
}

type Board = {}