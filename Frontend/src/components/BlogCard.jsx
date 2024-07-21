import React, { useEffect, useState } from 'react'
// import axios from 'axios'
  
const convertDate = (date)=>{
    
    const dateString = date;
    const dates = new Date(dateString);

    // Options for formatting the date in IST
    const options = {
        weekday: 'long', // "Tuesday"
        year: 'numeric', // "2024"
        month: 'long',   // "June"
        day: 'numeric',  // "18"
    };
    const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(dates);

    // console.log(formattedDate); // "Tuesday, June 18, 2024 at 11:07:59 PM IST"
    return formattedDate;
}

const getData = async (setTitle,setUrl,setDate,setImage,index,response,images)=>{
    setImage(images[index]);
    const data = response.data.items[index];
    setTitle(data.title);
    setUrl(data.link);
    const newDate = convertDate(data.pubDate)
    setDate(newDate);
}



function BlogCard({index,response,images}) {
    const [title, setTitle] = useState('Unknown');
    const [date, setDate] = useState('Tuesday, June 18, 2024');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('www.chess.com');

    useEffect(()=>{
        getData(setTitle,setUrl,setDate,setImage,index,response,images);
    },[])
  return (
    <div className='flex flex-col items-center h-[28rem] w-70 p-4' >
        <div className='bg-slate-600 h-4/5 w-full flex justify-center items-center rounded-xl' ><a className='h-full w-full rounded-xl overflow-hidden' target='blank' href={url}>
            <img className='h-full w-full rounded-xl overflow-hidden' src={image} alt="" />
            </a>
        
        </div>
        <div className='w-full flex flex-col items-center justify-between mt-8 '>
            <div className="title h-12 w-full flex justify-center items-center text-center font-semibold text-xl mb-2 hover:underline underline-offset-4">
                <a target='blank' href={url}>{title}</a>
            </div>
            <div className="display_link flex justify-center items-center">{date}</div>
        </div>
    </div>
  )
}

export default BlogCard