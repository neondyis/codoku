import {Center, Grid, GridItem} from "@chakra-ui/react";
import {SudokuSquare} from "./SudokuSquare";

export const Board = ({gameBoard, solutionBoard}: BoardProps) => {
    return (
        <div>
            <Center h='100%' w='100%'>
                {gameBoard.length > 0 ?
                    <Grid
                        className='sudoku-board'
                        templateRows='repeat(9, minmax(10px,1fr))'
                        templateColumns='repeat(9, minmax(10px,1fr))'
                        gridAutoRows='0.2fr'
                    >
                        {gameBoard.map((block: number, index: number) => {
                            return (
                                <GridItem key={index} className='sudoku-board-block'>
                                    <SudokuSquare number={block} boardIndex={index} solutionNumber={solutionBoard[index]}/>
                                </GridItem>
                            )
                        })
                        }
                    </Grid>
                    :
                    <div>Loading</div>
                }
            </Center>
            <br/>
        </div>
    )
}

type BoardProps = {
    gameBoard: number[];
    solutionBoard: number[];
}