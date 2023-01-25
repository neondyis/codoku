import React, {useEffect, useState} from 'react';
import {Board} from "./components/Board";
import { MainMenu } from './components/MainMenu';
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";
import io from "socket.io-client";
import {
  modifyGameBoard,
  setCurrentTurn,
  setID,
  setInitArray,
  setNotes,
  setSolutionBoard,
  setStartTime
} from "./redux/SudokuSlice";
import {useAppDispatch} from "./redux/hooks";
import {useCookies} from "react-cookie";

// @ts-ignore
export const socket = io(process.env.REACT_APP_SOCKET_URL || `http://localhost:4000`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainMenu/>
  },
  {
    path:"/play",
    element: <Board/>
  }
]);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('getGameList');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receiveGameData', (data) => {
      if(data._id){
        dispatch(setID(data._id));
        dispatch(modifyGameBoard(data.puzzle));
        dispatch(setCurrentTurn(data.currentTurn));
        dispatch(setSolutionBoard(data.solution));
        dispatch(setStartTime(data.startTime));
        dispatch(setNotes(data.notes));
        dispatch(setInitArray(data.initPuzzle))
        console.log('gameId set', data._id)
      }
    })

    socket.on('updateGameData', (data) => {
      dispatch(modifyGameBoard(data.puzzle));
      dispatch(setCurrentTurn(data.currentTurn));
    })

    socket.on('updateClientNotes', (data) => {
      dispatch(setNotes(data));
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };

  },[])

  // const sendPing = () => {
  //   socket.emit('ping', {id: gameId});
  // }

  return (
      <RouterProvider router={router} />
  );
}

export default App;
