import React, {useEffect, useRef, useState} from 'react';
import {Cudoku} from "./components/Cudoku";
import { MainMenu } from './components/MainMenu';
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";
import io from "socket.io-client";
import {
  modifyGameBoard,
  setCurrentTurn, setGameType,
  setID,
  setInitArray, setIsInitialized,
  setNotes,
  setSolutionBoard, setStartTime,
  setUsers
} from "./redux/SudokuSlice";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {useCookies} from "react-cookie";
import {Cupedoku} from "./components/Cupedoku";
import {DateTime} from "luxon";

// @ts-ignore
export const socket = io(process.env.REACT_APP_SOCKET_URL || `http://localhost:4000`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainMenu/>
  },
  {
    path:"/play",
    element: <Cudoku/>
  },
  {
    path:"/fight",
    element: <Cupedoku/>
  }
]);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const isInitialized = useAppSelector(state => state.isInitialized);
  const gameListRef:any = useRef();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      gameListRef.current = setInterval(() => {
        socket.emit('getGameList');
      },1000)
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      gameListRef.current = null;
    });

    socket.on('updateGameData', (data) => {
      dispatch(modifyGameBoard(data.puzzle));
      dispatch(setCurrentTurn(data.currentTurn));
    })

    socket.on('updateClientNotes', (data) => {
      dispatch(setNotes(data));
    })


    socket.on('receiveGameData', (data) => {
      dispatch(setUsers(data.users))
      dispatch(setID(data._id));
      if(data.currentTurn){
        dispatch(setCurrentTurn(data.currentTurn));
      }
      if(!isInitialized){
        dispatch(setInitArray(data.initPuzzle))
        dispatch(modifyGameBoard(data.puzzle));
        dispatch(setSolutionBoard(data.solution));
        dispatch(setNotes(data.notes));
        dispatch(setGameType(data.type));
        dispatch(setIsInitialized(data.isInitialized));
      }
      if(data.startTime){
        dispatch(setStartTime( data.startTime));
      }
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
