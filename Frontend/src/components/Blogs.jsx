import React, { useState, useEffect, useCallback } from 'react';
import BlogCard from './BlogCard';
import axios from 'axios';
import { baseUrl } from '../js/baseURL';
import { images } from '../js/images';

const img = 'https://images.pexels.com/photos/6114987/pexels-photo-6114987.jpeg?auto=compress&cs=tinysrgb&w=600';



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
