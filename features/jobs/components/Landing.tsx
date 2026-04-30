
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface HeroProps {
    onSearch?: (keyword: string, location: string) => void;
}

import { getFilters } from '../queries';

export default function Hero({ onSearch }: HeroProps) {
    //throw new Error('Not Implemented');
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Focus states for dropdowns
    const [keywordFocus, setKeywordFocus] = useState(false);
    const [locationFocus, setLocationFocus] = useState(false);

    // Suggestions from DB
    const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

    // Interactive Grid State
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    useEffect(() => {
        setIsMounted(true);
        // Fetch suggestions from Supabase
        const fetchSuggestions = async () => {
            const { keywords, locations } = await getFilters();
            setKeywordSuggestions(keywords);
            setLocationSuggestions(locations);
        };
        fetchSuggestions();
    }, []);

    // Auto-reset search when fields are empty
    useEffect(() => {
        if (isMounted && keyword.trim() === '' && location.trim() === '') {
            onSearch?.('', '');
        }
    }, [keyword, location, onSearch, isMounted]);

    const handleSearch = () => {
        if (onSearch) {
            onSearch(keyword, location);
            setKeywordFocus(false);
            setLocationFocus(false);
        }
    };

    const filteredKeywords = keyword
        ? keywordSuggestions.filter(k => k.toLowerCase().includes(keyword.toLowerCase()))
        : keywordSuggestions.slice(0, 5);

    const filteredLocations = location
        ? locationSuggestions.filter(l => l.toLowerCase().includes(location.toLowerCase()))
        : locationSuggestions.slice(0, 5);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-black min-h-[100dvh] flex flex-col justify-center border-b border-white/5 relative group"
        >
            {/* Base Faint Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Hover Illuminated Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                }}
            ></div>

            {/* HERO SECTION */}
            <section className="relative w-full z-10 pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl px-6 text-center mb-16">
                    <h1 className={`text-5xl md:text-8xl font-display text-white tracking-tight mb-6 transition-all duration-1000 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        ZEPHVION <span className="text-[#0DE4CF]">CAREERS</span>
                    </h1>
                    <p className={`text-zinc-500 font-technical text-xs md:text-sm tracking-[0.5em] uppercase transition-all duration-1000 delay-300 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Access the neural network of opportunity
                    </p>
                </div>

                {/* SEARCH BAR (Premium Design) */}
                <div className={`w-full max-w-5xl px-6 transition-all duration-1000 delay-500 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row items-stretch bg-zinc-900/30 border border-white/10 backdrop-blur-md p-2 shadow-[0_0_40px_rgba(13,228,207,0.05)] relative">

                        {/* Inputs Wrapper */}
                        <div className="flex-1 flex flex-col md:flex-row relative">

                            {/* Mobile Vertical Connecting Line (Right Side) */}
                            <div className="md:hidden absolute right-6 top-[25%] bottom-[25%] w-[1px] bg-white/20 z-10 pointer-events-none">
                                {/* Square End (Top) */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-[#0DE4CF] bg-black shadow-[0_0_10px_rgba(13,228,207,0.5)]"></div>
                                {/* Dot End (Bottom) */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[#0DE4CF] shadow-[0_0_10px_rgba(13,228,207,0.5)]"></div>
                            </div>

                            {/* Keyword Input */}
                            <div className="flex-1 relative flex items-center px-4 py-4 md:py-2 w-full group pr-12 md:pr-4">
                                <span className="material-symbols-outlined text-[#0DE4CF] mr-3 opacity-70 group-focus-within:opacity-100 transition-opacity">search</span>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => setKeywordFocus(true)}
                                    onBlur={() => setKeywordFocus(false)}
                                    placeholder="Job Title, Skills, or Keywords"
                                    className="w-full bg-transparent border-none text-white font-sans text-lg focus:outline-none placeholder:text-zinc-600"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />

                                {/* Keyword Suggestions Dropdown */}
                                {keywordFocus && filteredKeywords.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#050505] border border-white/10 z-[1] shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#0DE4CF] to-transparent opacity-50"></div>
                                        <ul className="py-2">
                                            {filteredKeywords.map((suggestion, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-6 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-[#0DE4CF] cursor-pointer transition-colors flex items-center gap-4 group/item"
                                                    onMouseDown={() => {
                                                        setKeyword(suggestion);
                                                        setKeywordFocus(false);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined text-[14px] text-zinc-600 group-hover/item:text-[#0DE4CF] transition-colors">history</span>
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Connecting Line (Desktop Only) */}
                            <div className="hidden md:flex w-20 h-auto relative items-center justify-center shrink-0 pointer-events-none">
                                <div className="w-full h-[1px] bg-white/20"></div>
                                {/* Square End (Left) */}
                                <div className="absolute left-0 w-2 h-2 border border-[#0DE4CF] bg-black shadow-[0_0_10px_rgba(13,228,207,0.5)] -translate-y-[0.5px]"></div>
                                {/* Dot End (Right) */}
                                <div className="absolute right-0 w-2 h-2 rounded-full bg-[#0DE4CF] shadow-[0_0_10px_rgba(13,228,207,0.5)] -translate-y-[0.5px]"></div>
                            </div>

                            {/* Mobile Separator */}
                            <div className="md:hidden w-full h-[1px] bg-white/5 my-1"></div>

                            {/* Location Input */}
                            <div className="flex-1 relative flex items-center px-4 py-4 md:py-2 w-full group pr-12 md:pr-4">
                                <span className="material-symbols-outlined text-zinc-500 mr-3 group-focus-within:text-[#0DE4CF] transition-colors">location_on</span>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onFocus={() => setLocationFocus(true)}
                                    onBlur={() => setLocationFocus(false)}
                                    placeholder="Location or Remote"
                                    className="w-full bg-transparent border-none text-white font-sans text-lg focus:outline-none placeholder:text-zinc-600"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />

                                {/* Location Suggestions Dropdown */}
                                {locationFocus && filteredLocations.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#050505] border border-white/10 z-[999999] shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#0DE4CF] to-transparent opacity-50"></div>
                                        <ul className="py-2">
                                            {filteredLocations.map((suggestion, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-6 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-[#0DE4CF] cursor-pointer transition-colors flex items-center gap-4 group/item"
                                                    onMouseDown={() => {
                                                        setLocation(suggestion);
                                                        setLocationFocus(false);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined text-[14px] text-zinc-600 group-hover/item:text-[#0DE4CF] transition-colors">place</span>
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="w-full md:w-auto mt-4 md:mt-0 bg-white text-black font-technical tracking-[0.2em] text-[1.2rem] uppercase py-5 px-10 hover:bg-[#0DE4CF] hover:text-black transition-all duration-500 flex justify-center items-center gap-3 border border-transparent hover:shadow-[0_0_20px_rgba(13,228,207,0.4)] active:scale-[0.98]"
                        >
                            Search <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>

                    </div>
                </div>
            </section>
        </div>
    );
}
