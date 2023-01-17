import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {sudokuStore} from "./redux/SudokuSlice";
import {Provider} from "react-redux";
import {ChakraProvider, extendBaseTheme} from '@chakra-ui/react';
import {CookiesProvider} from "react-cookie";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// const theme = extendBaseTheme({
//     styles: {
//         global: () => ({
//             body: {
//                 backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
//             },
//         })},
// })


root.render(
  <React.StrictMode>
      <ChakraProvider>
      <Provider store={sudokuStore}>
          <CookiesProvider>
              <App />
          </CookiesProvider>
      </Provider>
      </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
