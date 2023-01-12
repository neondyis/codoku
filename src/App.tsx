import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import {Board} from "./components/Board";
import {SudokuProvider} from "./context/SudokuContext";

function App() {
  return (
      <ChakraProvider>
          <SudokuProvider>
          <Board/>
          </SudokuProvider>
      </ChakraProvider>
  );
}

export default App;
