import React from 'react'
const ranks = [8,7,6,5,4,3,2,1];
function ChessBoardRanks({player}) {
    if(player==='w'){return (
        <div className=' grid grid-row-8 grid-col-1 h-full'>
            {ranks.map((rank,i) => <span key={rank} className=' flex items-center justify-start text-slate-500 font-semibold w-3 flex-1' >{rank}</span>)}
        </div>
      )}else{
        return(
            <div className=' grid grid-row-8 grid-col-1 h-full'>
                {ranks.map((rank,i) => <span key={rank} className=' flex items-center justify-start text-slate-500 font-semibold w-3 ' >{9-rank}</span>)}
            </div>
        )
      }
}

export default ChessBoardRanks;