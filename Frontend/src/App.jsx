import { useState } from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css'
import Home from './components/Home.jsx';
import NavBar from './components/NavBar';
import Rules from './components/Rules';
import Blogs from './components/Blogs.jsx';
import PlayStockofish from './components/PlayStockofish';
import PlayOnline from './components/PlayOnline';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      
      <Route path='/' element = {<NavBar/>} ></Route>
      <Route path='/rules' element = {<NavBar/>} ></Route>
      <Route path='/blogs' element = {<NavBar/>} ></Route>
  
    </Routes>

    <Routes>
      
      <Route path='/' element = {<Home/>} ></Route>
      <Route path='/playonline' element = {<PlayOnline/>} ></Route>
      <Route path='/stockfish' element = {<PlayStockofish/>} ></Route>
      <Route path='/rules' element = {<Rules/>} ></Route>
      <Route path='/blogs' element = {<Blogs/>} ></Route>
  
    </Routes>
    </>
    
  )
}

export default App
