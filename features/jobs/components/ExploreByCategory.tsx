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

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let frameId: number;
        const autoScroll = () => {
            if (!isHovered) {
                container.scrollLeft += 0.8; // Smooth auto-scroll speed

                // Seamless loop: jump back to start when first set ends
                const halfWidth = container.scrollWidth / 2;
                if (container.scrollLeft >= halfWidth) {
                    container.scrollLeft -= halfWidth;
                }
            }
            frameId = requestAnimationFrame(autoScroll);
        };

        frameId = requestAnimationFrame(autoScroll);
        return () => cancelAnimationFrame(frameId);
    }, [isHovered]);

    const handleWheel = (e: React.WheelEvent) => {
        const container = scrollRef.current;
        if (!container) return;

        // Translate vertical wheel to horizontal scroll
        container.scrollLeft += e.deltaY;

        // Manual scroll loop logic
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth;
        }
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

                {/* Categories Container */}
                <div
                    ref={scrollRef}
                    onWheel={handleWheel}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    className="relative overflow-x-auto no-scrollbar -mx-6 select-none pb-12"
                >
                    <div className="flex gap-6 py-4 px-6 w-max">
                        {/* Duplicate categories twice for seamless loop */}
                        {[...categories, ...categories].map((cat, i) => (
                            <div
                                key={`${cat.name}-${i}`}
                                className={`group flex items-center gap-5 px-6 py-4 min-w-[300px] transition-all duration-500 cursor-pointer border relative overflow-hidden hover:-translate-y-1.5 hover:z-20
                                    ${selectedCategory === cat.name ? 'border-[#0DE4CF]/80 bg-[#0DE4CF]/10 shadow-[0_0_30px_rgba(13,228,207,0.2)]' : 'bg-zinc-900/40 border-white/5 hover:border-[#0DE4CF]/40 hover:bg-[#0DE4CF]/[0.03] hover:shadow-[0_0_30px_rgba(13,228,207,0.1)]'}`}
                                onClick={() => onCategorySelect(cat.name)}
                            >
                                {/* Subtle scan line on hover */}
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
                    </div>

                    {/* Faded Edges for Smooth Transition */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
}
