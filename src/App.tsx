import React from 'react';
import {Board} from "./components/Board";
import { MainMenu } from './components/MainMenu';
import {createBrowserRouter, RouterProvider} from "react-router-dom";


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
  return (
      <RouterProvider router={router} />
  );
}

export default App;
