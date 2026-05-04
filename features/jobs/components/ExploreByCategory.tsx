"use client";

import React, { useState, useRef, useEffect } from "react";
import { getFilters } from '../queries';

const iconMap: { [key: string]: string } = {
    'Digital Experience': 'devices',
    'Data & Analytics': 'analytics',
    'Cloud & Infra': 'cloud_done',
    'Security Labs': 'verified_user',
    'Engineering Core': 'engineering',
    'AI & Intelligence': 'psychology',
    'Quality Systems': 'fact_check',
    'Business Nodes': 'business_center',
    'Data Engineering': 'analytics',
    'Information Security': 'verified_user',
    'SAP Consulting': 'business_center',
    'Facilities Management': 'engineering',
    'default': 'category'
};

interface ExploreByCategoryProps {
    selectedCategory: string;
    onCategorySelect: (cat: string) => void;
}

export default function ExploreByCategory({ selectedCategory, onCategorySelect }: ExploreByCategoryProps) {
    const [categories, setCategories] = useState<Array<{ name: string; jobs: number; icon: string }>>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastInteractionRef = useRef(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categories: fetchedCategories } = await getFilters();
                
                if (fetchedCategories && fetchedCategories.length > 0) {
                    const categoriesWithJobs = fetchedCategories.map((category: string) => ({
                        name: category,
                        jobs: Math.floor(Math.random() * 30) + 5, // Random job count for demo
                        icon: iconMap[category] || iconMap.default
                    }));
                    
                    setCategories(categoriesWithJobs);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const [isHovered, setIsHovered] = useState(false);
    const scrollPosRef = useRef(0);
    const velocityRef = useRef(0);
    const lastTimeRef = useRef(0);
    const requestRef = useRef<number | null>(null);

    // Touch handling refs
    const touchStartPosRef = useRef({ x: 0, y: 0 });
    const isScrollingRef = useRef<boolean | null>(null);

    useEffect(() => {
        if (categories.length === 0) return;

        const container = scrollRef.current;
        if (!container) return;

        const update = (time: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // Base auto-scroll velocity (0 if hovered)
            const autoVelocity = isHovered ? 0 : 0.05; // pixels per ms
            
            // Apply manual velocity from wheel
            scrollPosRef.current += (autoVelocity * deltaTime) + velocityRef.current;

            // Friction for manual velocity
            velocityRef.current *= 0.95;
            if (Math.abs(velocityRef.current) < 0.01) velocityRef.current = 0;

            // Seamless loop logic (4 copies)
            const contentWidth = container.scrollWidth / 4;
            if (scrollPosRef.current >= contentWidth) {
                scrollPosRef.current -= contentWidth;
            } else if (scrollPosRef.current < 0) {
                scrollPosRef.current += contentWidth;
            }

            // Apply transform
            container.style.transform = `translateX(${-scrollPosRef.current}px)`;

            requestRef.current = requestAnimationFrame(update);
        };

        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [categories, isHovered]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const nativeWheelHandler = (e: WheelEvent) => {
            if (isHovered) {
                // Lock vertical scroll when interacting with cards
                e.preventDefault();
                // We still update the velocity for our horizontal movement
                // Support both vertical wheel and horizontal trackpad swipes
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                velocityRef.current += delta * 0.1;
            }
        };

        // Use non-passive listener to allow preventDefault()
        container.addEventListener('wheel', nativeWheelHandler, { passive: false });
        
        return () => {
            container.removeEventListener('wheel', nativeWheelHandler);
        };
    }, [isHovered]);

    const handleWheel = (e: React.WheelEvent) => {
        // Native listener handles the logic now to allow preventDefault
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsHovered(true);
        touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
        isScrollingRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!e.touches[0]) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        
        const deltaX = touchStartPosRef.current.x - touchCurrentX;
        const deltaY = touchStartPosRef.current.y - touchCurrentY;

        if (isScrollingRef.current === null) {
            // Determine if the user is scrolling vertically or horizontally
            isScrollingRef.current = Math.abs(deltaY) > Math.abs(deltaX);
        }

        if (isScrollingRef.current) {
            // Let the browser handle vertical scrolling
            setIsHovered(false);
            return;
        }

        // Horizontal swipe - apply to carousel
        touchStartPosRef.current.x = touchCurrentX;
        touchStartPosRef.current.y = touchCurrentY;
        
        scrollPosRef.current += deltaX;
        
        const now = performance.now();
        const deltaTime = now - lastTimeRef.current;
        if (deltaTime > 0) {
            velocityRef.current = deltaX / deltaTime * 16;
        }
        lastTimeRef.current = now;
    };

    const handleTouchEnd = () => {
        setIsHovered(false);
        isScrollingRef.current = null;
    };

    const CategorySkeleton = () => (
        <div className="flex items-center gap-5 px-6 py-4 min-w-[300px] border border-white/5 bg-zinc-900/20 relative overflow-hidden">
            <div className="w-12 h-12 border border-white/5 bg-zinc-950/30 animate-skeleton"></div>
            <div className="flex-1 space-y-3">
                <div className="h-3 w-24 animate-skeleton"></div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                    <div className="h-2 w-16 animate-skeleton"></div>
                </div>
            </div>
            <div className="w-4 h-4 animate-skeleton"></div>
        </div>
    );

    if (loading) {
        return (
            <section className="relative bg-black pt-24 pb-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <div className="h-12 w-80 animate-skeleton mb-4"></div>
                        <div className="h-3 w-48 animate-skeleton"></div>
                    </div>
                    <div className="flex gap-6 py-4 overflow-hidden -mx-6 px-6">
                        {[1, 2, 3, 4].map((n) => (
                            <CategorySkeleton key={n} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative bg-black pt-24 pb-4">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-white font-display text-5xl mb-3 uppercase tracking-tight transition-colors duration-300 hover:text-[#0DE4CF] cursor-default">Explore by Category</h2>
                        <p className="text-zinc-500 font-technical text-[10px] tracking-[0.4em] uppercase opacity-70">Sector analysis // operational nodes</p>
                    </div>
                    <div className="flex gap-3">
                    </div>
                </div>

                <div className="relative overflow-hidden -mx-6 pb-12">
                    <div 
                        ref={scrollRef}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'pan-y' }}
                        className="flex gap-6 py-4 px-6 w-max select-none will-change-transform"
                    >
                        {/* 
                            Dynamic Velocity Loop: 
                            We render 4 sets to ensure no gaps during manual high-speed scrolls.
                            The JS engine handles the smooth movement and perfect looping.
                        */}
                        {[0, 1, 2, 3].map((setIndex) => (
                            <React.Fragment key={`set-${setIndex}`}>
                                {categories.map((cat, i) => (
                                    <div
                                        key={`${cat.name}-${setIndex}-${i}`}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        className={`category-card group flex items-center gap-5 px-6 py-4 min-w-[300px] transition-all duration-500 cursor-pointer border relative overflow-hidden hover:-translate-y-1.5 hover:z-20
                                            ${selectedCategory === cat.name ? 'border-[#0DE4CF]/80 bg-[#0DE4CF]/10 shadow-[0_0_30px_rgba(13,228,207,0.2)]' : 'bg-zinc-900/40 border-white/5 hover:border-[#0DE4CF]/40 hover:bg-[#0DE4CF]/[0.03] hover:shadow-[0_0_30px_rgba(13,228,207,0.1)]'}`}
                                        onClick={() => onCategorySelect(cat.name)}
                                    >
                                        <div className="absolute inset-0 w-full h-[1px] bg-[#0DE4CF]/20 translate-y-[-100%] group-hover:animate-[scan-v_3s_linear_infinite] pointer-events-none"></div>
                                        <div className="w-12 h-12 flex items-center justify-center transition-all duration-500 border border-white/10 bg-zinc-950/50 group-hover:border-[#0DE4CF]/50 group-hover:bg-[#0DE4CF]/10 group-hover:shadow-[0_0_15px_rgba(13,228,207,0.2)]">
                                            <span className="material-symbols-outlined text-xl text-zinc-500 transition-colors duration-500 group-hover:text-[#0DE4CF]">
                                                {cat.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-technical text-[12px] tracking-widest uppercase transition-colors duration-300 text-zinc-300 group-hover:text-[#0DE4CF]">
                                                {cat.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-[#0DE4CF] transition-colors duration-500"></div>
                                                <p className="text-zinc-600 font-technical text-[8px] tracking-[0.2em] uppercase">
                                                    {cat.jobs} ACTIVE NODES
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="material-symbols-outlined text-sm transition-all duration-500 text-zinc-800 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:-translate-y-1 group-hover:-rotate-45 group-hover:opacity-100 group-hover:text-[#0DE4CF]">
                                                arrow_forward
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Faded Edges for Smooth Transition */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
}
