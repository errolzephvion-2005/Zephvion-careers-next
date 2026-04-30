"use client";

import { useState, useCallback } from "react";
import Navbar from "@/shared/components/Navbar";
import RightRail from "@/shared/components/RightRail";
import ZephvionFooter from "@/shared/components/Footer";
import Hero from "@/features/jobs/components/Landing";
import ExploreByCategory from "@/features/jobs/components/ExploreByCategory";
import TrendingJobs from "@/features/jobs/components/Jobs";

export default function Home() {
  // throw new Error("Testing 500 Internal Server Error!"); //usethis only for testing the 505 page 
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });
  const [selectedCategory, setSelectedCategory] = useState('ALL CATEGORY');

  const handleSearch = useCallback((keyword: string, location: string) => {
    setSearchParams(prev => {
      if (prev.keyword === keyword && prev.location === location) return prev;
      return { keyword, location };
    });
    
    // Scroll to results smoothly if searching (not on auto-reset)
    if (keyword || location) {
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat);
    // scroll up to Jobs section
    const jobsSection = document.getElementById('jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Hero onSearch={handleSearch} />

      {/* TRENDING NODES / SEARCH RESULTS */}
      <TrendingJobs 
        searchKeyword={searchParams.keyword} 
        searchLocation={searchParams.location} 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* CATEGORY EXPLORER */}
      <ExploreByCategory 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
    </>
  );
}
