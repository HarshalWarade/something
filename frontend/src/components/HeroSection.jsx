import React, { useContext, useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/ThemeContext';

const HeroSection = () => {

    const {theme, toogleTheme} = useContext(ThemeContext)

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className={`text-center ${theme === "dark" ? "bg-[#191919] text-slate-300" : "bg-white"}`}>
            <div className='flex flex-col gap-8 my-10'>
                <span className={`mx-auto px-4 font-semibold py-2 rounded-full ${theme === "dark" ? "bg-red-300 text-[#b11b1b]" : "bg-red-50"} text-[#ec2525] font-medium`}>Job Hunting made easier</span>
                <h1 className={`text-5xl font-bold ${theme === "dark" ? "text-white" : ""}`}>Search, Apply & <br /> Get Your <span className='text-[#ec2525]'>Dream Job</span></h1>
                <p>Discover thousands of jobs. Apply with a click. Succeed with confidence.</p>
                <div className={`flex w-[40%] pl-1 rounded-md items-center gap-4 mx-auto ${theme === "dark" ? "border border-gray-700" : "border border-gray-400"}`}>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className={`pl-3 outline-none border-none w-full ${theme === "dark" ? "bg-transparent outline-none border-none border border-gray-800" : ""}`}

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-md rounded-l-none bg-[#ec2525]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection