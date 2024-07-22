import React, { useState, useEffect, useCallback } from 'react';
import BlogCard from './BlogCard';
import axios from 'axios';
import { baseUrl } from '../js/baseURL';

const img = 'https://images.pexels.com/photos/6114987/pexels-photo-6114987.jpeg?auto=compress&cs=tinysrgb&w=600';

const images = [
    'https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg',
    'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg',
    'https://images.pexels.com/photos/8466163/pexels-photo-8466163.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/277124/pexels-photo-277124.jpeg',
    'https://images.pexels.com/photos/277092/pexels-photo-277092.jpeg',
    'https://images.pexels.com/photos/6114957/pexels-photo-6114957.jpeg',
    'https://images.chesscomfiles.com/uploads/v1/article/30943.9c9f98cf.300x169o.ad775e4caa00@2x.png',
    'https://images.pexels.com/photos/1025469/pexels-photo-1025469.jpeg',
    'https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg',
    'https://images.pexels.com/photos/7207268/pexels-photo-7207268.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/10626503/pexels-photo-10626503.jpeg',
    'https://images.chesscomfiles.com/uploads/v1/article/30807.40e7bc95.300x169o.7a62fe7ea6b7@2x.png',
    'https://images.pexels.com/photos/5477776/pexels-photo-5477776.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/8865448/pexels-photo-8865448.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/462685/pexels-photo-462685.jpeg',
    'https://images.pexels.com/photos/5692995/pexels-photo-5692995.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg',
    'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/700971/pexels-photo-700971.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    'https://images.pexels.com/photos/4114602/pexels-photo-4114602.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/814133/pexels-photo-814133.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/10626498/pexels-photo-10626498.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/6028683/pexels-photo-6028683.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

function Blogs() {
    
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(12);
    const [errorMessage, setErrorMessage] = useState('');

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

    const addBlogs = () => {
        if (index >= 19) {
            setErrorMessage('No more blogs to display');
        } else {
            setIndex(index + 6);
            setErrorMessage('');  // Clear the error message when adding blogs
        }
    };

    if (loading) {
        return <div className='w-screen h-screen flex justify-center items-center bg-slate-900' >
            <div className='text-3xl font-bold text-white'>Loading...</div>
        </div>;
    }

    if (!response) {
        return <div className='w-screen h-screen flex justify-center items-center bg-slate-900'>
            <div className='text-3xl font-bold text-white'>{errorMessage}</div></div>;
    }

    const blogCards = [];
    for (let i = 0; i < index; i++) {
        blogCards.push(<BlogCard key={i} index={i} response={response} images={images}/>);
    }
    if(response) {
        return (
            <div className='bg-slate-900 flex flex-col items-center h-max w-screen p-4'>
                <div className="pic h-4/5 w-4/5 bg-slate-500 rounded-2xl m-4 mr-16 ml-16">
                    <img className='h-full w-full rounded-2xl' src={img} alt="Image" />
                </div>
                <div className='h-max w-screen bg-slate-900 p-12'>
                    <div className="grid grid-rows-2 grid-cols-3 h-max w-full text-white">
                        {blogCards}
                    </div>
                </div>
                <div className="button w-full h-16 mb-8 flex justify-center items-center bg-slate-900">
                    <button onClick={addBlogs} className='flex justify-center items-center text-white font-bold text-3xl bg-slate-950 h-20 w-60 rounded-xl hover:bg-slate-800'>
                        READ MORE
                    </button>
                </div>
                {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            </div>
        );
    }
}

export default Blogs;
