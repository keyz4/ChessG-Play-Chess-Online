import React from 'react'
import ChessBoard from './ChessBoard'
import {Chess} from 'chess.js'
import { useNavigate } from 'react-router-dom';
import ShortChessRules from './ShortChessRules';
import BlogCard from './BlogCard'
import Footer from './Footer';
import { images } from '../js/images';
import { useEffect, useCallback,useState } from 'react';
import { baseUrl } from '../js/baseURL';
import axios from 'axios';

const chess = new Chess();
const board = chess.board();

function Home() {

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = new useNavigate();
  const playOnline = ()=>{
    alert('Play Online')
    navigate('/playonline')
    window.scrollTo(0, 0);
  }
  const playStockfish = ()=>{
    alert('Play Stockfish')
    navigate('/stockfish')
    window.scrollTo(0, 0);
  }
  const readBlogs = ()=>{
    navigate('/blogs');
    window.scrollTo(0, 0);
  }
  const fetchBlogs = useCallback(async () => {
    try {
        const result = await axios.get(`${baseUrl}/blogs`);
        setResponse(result);
        setLoading(false);
    } catch (error) {
        setErrorMessage('Error fetching blogs!');
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <>
      <div className='flex-col h-screen w-screen bg-slate-900' >
        <div className="HomeScreen flex justify-start items-center h-[90%]  w-full bg-slate-900">
          <div className=" left flex justify-start items-start bg-slate-900 h-full w-1/2">
            <div className=' mt-3 chessboard h-[95%] aspect-square'>
              <ChessBoard 
                board={board} 
                room={1} 
                playerRole={'w'}
                playerNo={1}
                stockfishRole={'b'}/>
            </div>
          </div>
          <div className='rightScreen flex flex-col h-full w-full justify-center items-center' >
            <div className='homepageText flex justify-center items-center h-2/5 w-[60%] ml-2 mb-2' >
              <div className="flex flex-col h-full w-full justify-center items-center">
                <span className='text-white text-4xl font-bold'>Play Chess </span>
                <span className='text-white text-4xl font-thin' >Challenge Stockfish</span>
              </div>
            </div>
            <div className='buttons h-[20%] w-[50%] flex justify-center items-center' >
              <button onClick={playOnline} className='flex justify-center items-center m-2 h-[55%] w-[45%] rounded-xl bg-slate-800 hover:bg-slate-600 text-white font-medium text-2xl' >Play Online</button>
              <button onClick={playStockfish} className='flex justify-center items-center m-2 h-[65%] w-[45%] rounded-xl bg-slate-800 hover:bg-slate-600 text-white font-medium text-2xl p-2'>Challenge Stockfish</button>
            </div>
          </div>
        </div>
        <div className='RulesHome flex flex-col h-max w-screen bg-slate-900 p-24 pb-0 pt-4' >
            <div  className='flex flex-col items-center h-full w-full bg-slate-950 text-yellow-500' >
              <div className='font-bold text-4xl mt-4 font-serif'>RULES</div>
              <div className='w-full h-full text-wrap' ><ShortChessRules/></div>
            </div>
        </div>
        <div className=' ChessToday h-max w-screen bg-slate-900 p-8 pb-0' >
            <div className='h-full w-full' >
              <div className="flex flex-col h-full w-full items-center justify-between">
                <div className='text-4xl font-bold text-white mt-8' >Know more about chess</div>
                {loading && <div className='w-full h-40 flex justify-center items-center bg-slate-900' >
            <div className='text-3xl font-bold text-white'>Loading...</div>
        </div> }
                {!response && <div className='w-full h-40 flex justify-center items-center bg-slate-900'>
                  <div className='text-3xl font-bold text-white'>{errorMessage}</div></div>}
                  {response && <div className='grid grid-row-2 grid-cols-3 w-full h-max p-8 text-white' >
                  <BlogCard index={0} response={response} images={images}/>
                  <BlogCard index={1} response={response} images={images}/>
                  <BlogCard index={2} response={response} images={images}/>
                  <BlogCard index={3} response={response} images={images}/>
                  <BlogCard index={4} response={response} images={images}/>
                  <BlogCard index={5} response={response} images={images}/>
                </div>}
                <div className='w-full h-1/6 flex justify-center items-center' >
                  <button onClick={readBlogs} className='h-16 w-48 bg-slate-900 text-lime-400 font-bold text-3xl fles justify-center items-center rounded-lg hover:bg-slate-600 border-2 border-indigo-800 mb-12' >Learn Chess</button>
                </div>
              </div>
            </div>
        </div>
        <Footer/>
      </div>
    </>
  )
}

export default Home
