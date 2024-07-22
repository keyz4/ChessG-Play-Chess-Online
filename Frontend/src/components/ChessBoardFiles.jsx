import React from 'react'
const files = ['a','b','c','d','e','f','g','h'];
const fileRev = ['h','g','f','e','d','c','b','a'];
function ChessBoardFiles({player}) {
  if(player==='w'){return (
    <div className='ml-4 flex w-full' >
        {files.map((file,i) => <span key={file} className=' flex justify-center items-center text-slate-500 font-semibold w-1/2 ' >{file}</span>)}
    </div>
  )}else{
    return(
      <div className=' ml-4 flex w-full' >
          {fileRev.map((file,i) => <span key={file} className=' flex justify-center items-center text-slate-500 font-semibold w-1/2 ' >{file}</span>)}
      </div>
    )
  }
}

export default ChessBoardFiles