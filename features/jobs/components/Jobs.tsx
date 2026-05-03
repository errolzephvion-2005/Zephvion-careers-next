"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJobs, UIJob } from "../queries";

// Extend UIJob for the component's specific needs
interface Job extends UIJob {
    lpaSalary?: string;
}

interface TrendingJobsProps {
    searchKeyword?: string;
    searchLocation?: string;
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
}

export default function TrendingJobs({ searchKeyword = '', searchLocation = '', selectedCategory = 'ALL CATEGORY', onCategoryChange }: TrendingJobsProps) {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState<string[]>(['ALL CATEGORY', 'TECHNICAL', 'NON-TECHNICAL']);
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
    const jobsPerPage = 6;

    // Smooth scroll to top of grid on page change
    useEffect(() => {
        if (!loading) {
            const element = document.getElementById('jobs-section');
            if (element) {
                const yOffset = -100; // Offset for navbar and breathing room
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, [currentPage]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobsArray = await getJobs();

                // Use dynamic LPA salaries from backend
                const transformedData = jobsArray.map((job) => {
                    const lpaSalary = `${job.salary} PER ANNUM`;
                    return { ...job, lpaSalary };
                });

                setJobs(transformedData);
            } catch (error) {
                console.error("Failed to fetch trending jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAll = async () => {
            await Promise.all([fetchJobs(), fetchCategories()]);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const fetchCategories = async () => {
        // Slider options: ALL, TECHNICAL, NON-TECHNICAL
        setCategories(['ALL CATEGORY', 'TECHNICAL', 'NON-TECHNICAL']);
    };

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
        setExpandedJobId(null);
    }, [searchKeyword, searchLocation, selectedCategory]);

    const toggleJob = (id: string) => {
        if (expandedJobId === id) {
            setIsClosing(id);
            setTimeout(() => {
                setExpandedJobId(null);
                setIsClosing(null);
            }, 400);
        } else {
            setExpandedJobId(id);
            // Rapidly focus the start of the card after state update
            setTimeout(() => {
                const element = document.getElementById(`job-card-${id}`);
                if (element) {
                    const yOffset = -120; // Offset for navbar and breathing room
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 50);
        }
    };

    const JobCardSkeleton = () => (
        <div className="bg-[#0A0A0A] border border-white/5 p-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-3 flex-1">
                    <div className="h-8 w-3/4 animate-skeleton"></div>
                    <div className="flex gap-4">
                        <div className="h-4 w-24 animate-skeleton"></div>
                        <div className="h-4 w-24 animate-skeleton"></div>
                    </div>
                </div>
                <div className="h-6 w-6 animate-skeleton rounded-full"></div>
            </div>
            <div className="space-y-2 mb-8">
                <div className="h-3 w-full animate-skeleton"></div>
                <div className="h-3 w-5/6 animate-skeleton"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-6 w-32 animate-skeleton"></div>
                <div className="h-10 w-28 animate-skeleton"></div>
            </div>
            {/* Decorative corners for industrial feel */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5"></div>
        </div>
    );

    if (loading) {
        return (
            <section className="relative bg-[#050505] py-24 min-h-screen border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end mb-16 gap-10">
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-16 w-64 animate-skeleton"></div>
                            <div className="h-4 w-48 animate-skeleton"></div>
                        </div>
                        <div className="md:col-span-1 w-full md:max-w-[380px] h-12 animate-skeleton ml-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <JobCardSkeleton key={n} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }


    const filteredJobs = jobs.filter(job => {
        const matchesKeyword = searchKeyword ? (
            job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            job.serviceLine.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            job.responsibilities.some(r => r.toLowerCase().includes(searchKeyword.toLowerCase())) ||
            job.preferredSkills.some(s => s.toLowerCase().includes(searchKeyword.toLowerCase()))
        ) : true;

        const matchesLocation = searchLocation ? (
            job.location?.toLowerCase().includes(searchLocation.toLowerCase())
        ) : true;

        const matchesCategory = (() => {
            if (selectedCategory === 'ALL CATEGORY') return true;
            if (['TECHNICAL', 'NON-TECHNICAL'].includes(selectedCategory)) {
                // Real-time filter based on job_type column
                return job.jobType?.toLowerCase() === selectedCategory.toLowerCase();
            }
            // Specific category from Explore section
            return job.category === selectedCategory;
        })();

        return matchesKeyword && matchesLocation && matchesCategory;
    }).sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return 0;
    });

    const isSearching = searchKeyword.trim() !== '' || searchLocation.trim() !== '' || selectedCategory !== 'ALL CATEGORY';

    const titleText = isSearching ? "SEARCH RESULTS" : "Available JOBS";
    const subtitleText = isSearching
        ? `Found ${filteredJobs.length} Roles matching your query`
        : "High-priority recruitment Roles // active";

    const handlePrevCategory = () => {
        if (!categories.length || !onCategoryChange) return;
        setSlideDir('left');
        const currentIndex = categories.indexOf(selectedCategory);
        if (currentIndex > 0) {
            onCategoryChange(categories[currentIndex - 1]);
        } else {
            onCategoryChange(categories[categories.length - 1]);
        }
    };

    const handleNextCategory = () => {
        if (!categories.length || !onCategoryChange) return;
        setSlideDir('right');
        const currentIndex = categories.indexOf(selectedCategory);
        if (currentIndex < categories.length - 1) {
            onCategoryChange(categories[currentIndex + 1]);
        } else {
            onCategoryChange(categories[0]);
        }
    };

    // Pagination Logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    return (
        <section className="relative bg-[#050505] py-24 min-h-screen border-b border-white/5" id="jobs-section">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 items-end mb-16 gap-10">
                    <div className="md:col-span-2">
                        <h2 className="text-white font-display text-5xl md:text-7xl mb-4 uppercase tracking-tighter">{titleText}</h2>
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] w-12 bg-[#0DE4CF] opacity-50"></div>
                            <p className="text-zinc-500 font-technical text-[10px] tracking-[0.4em] uppercase">{subtitleText}</p>
                        </div>
                    </div>

                    {/* Slider / Badge Area */}
                    <div className="md:col-span-1 w-full md:max-w-[380px] md:ml-auto mx-auto flex items-center justify-end">
                        {(!['TECHNICAL', 'NON-TECHNICAL', 'ALL CATEGORY'].includes(selectedCategory)) ? (
                            /* Rounded Batch for Specific Categories */
                            <div
                                onClick={() => onCategoryChange?.('ALL CATEGORY')}
                                className="flex items-center gap-3 bg-[#0DE4CF]/5 border border-[#0DE4CF]/20 px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#0DE4CF]/10 hover:border-[#0DE4CF]/40 transition-all group shadow-[0_0_20px_rgba(13,228,207,0.05)]"
                            >
                                <span className="text-white font-technical text-[10px] tracking-[0.2em] uppercase">{selectedCategory}</span>
                                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                                <span className="material-symbols-outlined text-sm text-[#0DE4CF] group-hover:scale-110 transition-transform">close</span>
                            </div>
                        ) : (
                            /* Standard Slider for Technical/Non-Technical */
                            <div className="group/slider relative w-full">
                                {/* Sharp Decorative Corner */}
                                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#0DE4CF]/40 transition-all group-hover/slider:border-[#0DE4CF]"></div>

                                <div className="flex items-center bg-zinc-900/40 border border-white/10 backdrop-blur-md overflow-hidden rounded-sm relative">
                                    {/* Prev Button */}
                                    <button
                                        onClick={handlePrevCategory}
                                        className="p-3 flex items-center justify-center text-zinc-500 hover:text-[#0DE4CF] hover:bg-white/5 transition-all active:scale-90 border-r border-white/5"
                                    >
                                        <span className="material-symbols-outlined text-base">chevron_left</span>
                                    </button>

                                    {/* Category Display */}
                                    <div className="flex-1 relative h-10 flex items-center overflow-hidden px-4 group/cat">
                                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/0 via-[#0DE4CF]/5 to-zinc-900/0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-700"></div>

                                        <div
                                            key={selectedCategory}
                                            className={`w-full flex items-center justify-center whitespace-nowrap
                                                ${slideDir === 'right' ? 'animate-swift-right' : 'animate-swift-left'}`}
                                        >
                                            <span className="text-white font-technical text-[9px] tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                                                {selectedCategory === 'ALL CATEGORY' ? 'SELECT CATEGORY' : selectedCategory}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={handleNextCategory}
                                        className="p-3 flex items-center justify-center text-zinc-500 hover:text-[#0DE4CF] hover:bg-white/5 transition-all active:scale-90 border-l border-white/5"
                                    >
                                        <span className="material-symbols-outlined text-base">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 bg-zinc-900/20">
                        <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 block">search_off</span>
                        <h3 className="text-white font-display text-2xl tracking-widest mb-2">NO Roles FOUND</h3>
                        <p className="text-zinc-500 font-technical text-xs tracking-widest uppercase">Adjust your parameters and re-initialize scan</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {currentJobs.map((job: any) => (
                                <div
                                    key={job.id}
                                    id={`job-card-${job.id}`}
                                    className={`relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group
                                        ${expandedJobId === job.id || isClosing === job.id
                                            ? 'lg:col-span-3 md:col-span-2'
                                            : 'min-h-[320px] flex flex-col'}`}
                                    onClick={() => toggleJob(job.id)}
                                >
                                    {/* Card Shell */}
                                    <div className={`relative w-full h-full transition-all duration-500
                                        ${expandedJobId === job.id || isClosing === job.id
                                            ? 'shadow-[0_0_80px_rgba(13,228,207,0.1)] z-50'
                                            : 'z-10'}`}
                                    >
                                        {/* Main Content Surface */}
                                        <div className={`w-full bg-black border border-white/5 transition-all duration-500 flex flex-col h-full
                                            ${expandedJobId === job.id || isClosing === job.id
                                                ? 'border-[#0DE4CF] ring-1 ring-[#0DE4CF]/20'
                                                : 'group-hover:border-[#0DE4CF]/50 group-hover:bg-zinc-900/10'}`}
                                        >
                                            {/* Scanning Line Effect */}
                                            {(expandedJobId === job.id && !isClosing) && (
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0DE4CF] to-transparent animate-scan-h opacity-50 z-20"></div>
                                            )}

                                            <div className={`p-8 md:p-10 flex flex-col h-full relative transition-all duration-500 
                                                ${(expandedJobId === job.id && !isClosing) ? 'pb-20' : 'pb-10'}`}>
                                                <div className="flex flex-col gap-6 flex-grow">
                                                    <div className="space-y-4">
                                                        <h3 className={`font-display transition-all duration-700 leading-[1.1] pr-12 break-words
                                                            ${expandedJobId === job.id && !isClosing
                                                                ? 'text-4xl md:text-7xl text-[#0DE4CF] tracking-tight'
                                                                : 'text-2xl md:text-3xl text-white group-hover:text-[#0DE4CF]'}`}>
                                                            {job.title}
                                                        </h3>

                                                        <div className="flex flex-wrap gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-[10px] text-[#0DE4CF]">work_history</span>
                                                                <span className="font-technical text-[9px] text-zinc-500 uppercase tracking-widest">{job.experience}</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-[10px] text-[#0DE4CF]">verified</span>
                                                                <span className="font-technical text-[9px] text-[#0DE4CF] uppercase tracking-widest">{job.status}</span>
                                                            </div>

                                                            {job.isTrending && (
                                                                <div className="flex items-center gap-2 border border-[#0DE4CF]/30 bg-[#0DE4CF]/5 px-2 py-0.5">
                                                                    <span className="material-symbols-outlined text-[10px] text-[#0DE4CF]">trending_up</span>
                                                                    <span className="font-technical text-[9px] text-[#0DE4CF] uppercase tracking-widest">Trending</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>


                                                    <div className={`flex flex-col sm:flex-row sm:items-center gap-6 pt-6 transition-all duration-500
                                                        ${expandedJobId === job.id ? 'opacity-100' : 'opacity-90'}`}>
                                                        <div className="text-left flex-grow">
                                                            <p className="font-technical text-[7px] text-zinc-600 uppercase tracking-widest mb-1.5 opacity-50">Target_Comp_Range</p>
                                                            <div className="flex items-baseline gap-2 flex-nowrap overflow-hidden">
                                                                <p className={`font-technical tracking-wider transition-all whitespace-nowrap
                                                                    ${expandedJobId === job.id && !isClosing ? 'text-[clamp(24px,5vw,40px)] text-white' : 'text-[clamp(16px,4vw,20px)] text-white'}`}>
                                                                    {job.lpaSalary.split(' ').slice(0, 4).join(' ')}
                                                                </p>
                                                                <span className="opacity-40 text-[clamp(7px,1.5vw,8px)] font-technical uppercase whitespace-nowrap">PER ANNUM</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-4">
                                                                <span className="material-symbols-outlined text-[11px] text-[#0DE4CF]">location_on</span>
                                                                <span className="font-technical text-[9px] text-zinc-500 uppercase tracking-widest">{job.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Simple Apply Now Button (Bottom Right) */}
                                                {expandedJobId !== job.id && (
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/apply?jobId=${job.id}`);
                                                        }}
                                                        className="mt-8 flex items-center justify-end gap-2 text-zinc-500 hover:text-[#0DE4CF] transition-all duration-300 cursor-pointer self-end group/btn"
                                                    >
                                                        <span className="font-technical text-[0.65rem] tracking-[0.4em] uppercase opacity-70 group-hover/btn:opacity-100">Apply Now</span>
                                                        <span className="material-symbols-outlined text-lg -rotate-45 group-hover/btn:rotate-0 group-hover/btn:translate-x-1 transition-all duration-300">arrow_forward</span>
                                                    </div>
                                                )}

                                                {/* Expanded Content Area */}
                                                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 transition-all duration-700 ease-in-out
                                                    ${expandedJobId === job.id && isClosing !== job.id
                                                        ? 'max-h-[5000px] mt-16 pt-16 border-t border-white/10 opacity-100'
                                                        : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="lg:col-span-4 space-y-10">
                                                        <div className="bg-zinc-900/40 p-6 md:p-8 border border-white/10 relative group/info">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0DE4CF] scale-y-0 group-hover/info:scale-y-100 transition-transform origin-top duration-500"></div>
                                                            <label className="font-technical text-[9px] md:text-[10px] text-[#0DE4CF] uppercase tracking-[0.3em] md:tracking-[0.4em] block mb-3 md:mb-4">Service Line</label>
                                                            <p className="text-white font-sans text-base md:text-xl font-light">{job.serviceLine}</p>
                                                        </div>

                                                        <div className="bg-zinc-900/40 p-6 md:p-8 border border-white/10 relative group/info overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0DE4CF] scale-y-0 group-hover/info:scale-y-100 transition-transform origin-top duration-500"></div>
                                                            <label className="font-technical text-[9px] md:text-[10px] text-[#0DE4CF] uppercase tracking-[0.3em] md:tracking-[0.4em] block mb-3 md:mb-4">Educational Requirements</label>
                                                            <p className="text-white font-sans text-sm md:text-lg font-light leading-relaxed break-words">{job.education.replace(/,/g, ', ')}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => router.push(`/apply?jobId=${job.id}`)}
                                                            className="group/bigapply w-full flex items-center justify-center gap-4 bg-white text-black hover:bg-[#0DE4CF] py-6 font-technical text-sm tracking-[0.4em] uppercase transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(13,228,207,0.4)] active:scale-[0.98]"
                                                        >
                                                            Apply Now
                                                            <span className="material-symbols-outlined text-2xl -rotate-45 group-hover/bigapply:rotate-0 transition-transform duration-500">arrow_forward</span>
                                                        </button>
                                                    </div>

                                                    <div className="lg:col-span-8 space-y-16">
                                                        <div>
                                                            <div className="flex items-center gap-4 mb-10 w-full overflow-hidden">
                                                                <h4 className="font-technical text-[clamp(9px,2.5vw,11px)] text-[#0DE4CF] uppercase tracking-[0.3em] md:tracking-[0.5em] whitespace-nowrap">Responsibilities_List</h4>
                                                                <div className="h-[1px] flex-1 bg-white/10 hidden sm:block"></div>
                                                            </div>
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                                                {job.responsibilities.slice(0, 10).map((resp: string, idx: number) => (
                                                                    <li key={idx} className="flex gap-6 text-zinc-400 text-[13px] leading-relaxed group/li">
                                                                        <span className="font-technical text-[#0DE4CF] opacity-60 group-hover/li:opacity-100 transition-opacity">[{idx + 1}]</span>
                                                                        <p className="group-hover/li:text-zinc-200 transition-colors">{resp}</p>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-4 mb-10 w-full overflow-hidden">
                                                                <h4 className="font-technical text-[clamp(9px,2.5vw,11px)] text-[#0DE4CF] uppercase tracking-[0.3em] md:tracking-[0.5em] whitespace-nowrap">Preferred_Expertise</h4>
                                                                <div className="h-[1px] flex-1 bg-white/10 hidden sm:block"></div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4">
                                                                {job.preferredSkills.map((skill: string, idx: number) => (
                                                                    <div key={idx} className="bg-zinc-900/60 border border-white/10 px-6 py-4 flex items-center gap-4 group/skill hover:border-[#0DE4CF]/40 transition-colors">
                                                                        <div className="w-2 h-2 bg-[#0DE4CF] group-hover/skill:shadow-[0_0_15px_#0DE4CF]"></div>
                                                                        <span className="text-zinc-400 text-[11px] font-technical tracking-widest uppercase group-hover:text-zinc-200">{skill}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Top Right Expand Node */}
                                    <div className={`absolute top-6 right-8 transition-all duration-700 z-[60] cursor-pointer
                                        ${expandedJobId === job.id && !isClosing
                                            ? 'text-white rotate-180'
                                            : 'text-zinc-500 group-hover:text-[#0DE4CF]'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleJob(job.id);
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-3xl">{expandedJobId === job.id && !isClosing ? 'close' : 'expand_more'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 bg-zinc-900/40 text-white disabled:opacity-30 hover:border-[#0DE4CF] hover:text-[#0DE4CF] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <div className="font-technical text-xs tracking-widest text-zinc-500">
                                    PAGE <span className="text-white">{currentPage}</span> / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 bg-zinc-900/40 text-white disabled:opacity-30 hover:border-[#0DE4CF] hover:text-[#0DE4CF] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
