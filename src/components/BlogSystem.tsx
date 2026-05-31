import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blog';
import { Search, Calendar, Eye, ArrowLeft, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSystemProps {
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
}

export default function BlogSystem({ addLog }: BlogSystemProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Read single blog detail
  const activePost = BLOG_POSTS.find(p => p.slug === selectedSlug);

  // Extract all unique categories and tags across posts
  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category)));
  const tagsList = Array.from(new Set(BLOG_POSTS.flatMap(p => p.tags)));

  // Filter posts list
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = !selectedTag || post.tags.includes(selectedTag);
    const matchCategory = !selectedCategory || post.category === selectedCategory;

    return matchSearch && matchTag && matchCategory;
  });

  const handleOpenPost = (post: BlogPost) => {
    setSelectedSlug(post.slug);
    // Increment simulated views in place
    post.views += 1;
    addLog('Blog Article Opened', `Dispatched analytics capture for blog slug "${post.slug}"`, 'admin');
  };

  const handleShare = (post: BlogPost) => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
    alert(`Copied article link to clipboard!`);
    addLog('Blog Share Sim', `URL link copied for slug "{${post.slug}}"`, 'admin');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white text-left">
      
      {/* 1. SINGLE DETAILED POST VIEWER */}
      {activePost ? (
        <article className="max-w-3xl mx-auto space-y-8 animate-fade-in unique-blog-view">
          
          <button
            onClick={() => setSelectedSlug(null)}
            className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </button>

          {/* Feature Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-violet-400 font-mono uppercase tracking-wider">
              <span>{activePost.category}</span>
              <span>·</span>
              <span>{activePost.readTime}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {activePost.views.toLocaleString()} views</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-display">
              {activePost.title}
            </h1>

            <p className="text-white/70 text-md sm:text-lg leading-relaxed italic">
              "{activePost.excerpt}"
            </p>
          </div>

          {/* Author info line */}
          <div className="flex items-center justify-between py-4 border-y border-white/10">
            <div className="flex items-center gap-3">
              <img 
                src={activePost.author.avatar} 
                alt={activePost.author.name}
                className="h-10 w-10 rounded-full object-cover border border-white/10"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white/95">{activePost.author.name}</span>
                <span className="text-[10px] text-white/40 font-mono mt-0.5">{activePost.author.role} · Published {activePost.date}</span>
              </div>
            </div>

            <button
              onClick={() => handleShare(activePost)}
              className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              title="Copy citation link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Cover image preview */}
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative">
            <img 
              src={activePost.image} 
              alt={activePost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Structured Text Prose */}
          <div className="text-xs sm:text-base text-white/80 leading-relaxed space-y-6 pt-4 text-justify prose prose-invert max-w-none">
            {activePost.content.split('\n\n').map((para, i) => {
              if (para.trim().startsWith('#')) {
                // Ignore raw markdown titles but render bold subtitle headers nicely
                return (
                  <h3 key={i} className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight pt-4">
                    {para.replace(/#/g, '').trim()}
                  </h3>
                );
              }
              if (para.trim().startsWith('-')) {
                // List items
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-4 text-white/50">
                    {para.split('\n').map((li, j) => (
                      <li key={j}>{li.replace('-', '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-white/70 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {para.trim()}
                </p>
              );
            })}
          </div>

          {/* Bottom tag clouds */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
            {activePost.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-[10px] font-bold font-mono text-white/50 bg-white/5 border border-white/5 rounded">
                #{tag}
              </span>
            ))}
          </div>

        </article>
      ) : (
        
        // 2. PRIMARY DIRECTORY LIST
        <div className="space-y-10">
          
          <div className="text-left">
            <span className="text-xs font-bold text-violet-400 font-mono uppercase tracking-widest leading-none">VoxAI Resources</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-display">SaaS Articles & Documentation</h1>
            <p className="text-xs sm:text-sm text-white/50 leading-normal mt-0.5">Learn acoustic best practices, read up on browser TTS development, and learn how to optimize audio narratives for SEO.</p>
          </div>

          {/* Quick Filters / Search Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch border-b border-white/10 pb-6">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search articles, developer tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500 placeholder-white/25 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`h-9 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/10 text-violet-400 border-violet-500/30'
                      : 'border-white/10 text-white/55 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main blog post cards list (Col-8) */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.length === 0 ? (
                <div className="md:col-span-2 text-center py-16 rounded-2xl border border-white/10 bg-white/5">
                  <BookOpen className="h-10 w-10 text-white/20 mx-auto mb-3 animate-pulse" />
                  <p className="text-xs font-semibold text-white/40 font-mono">No Resource Articles Found</p>
                  <p className="text-[10px] text-white/30 mt-1">Purge search terms or category triggers to discover articles.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => handleOpenPost(post)}
                    className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-sm shadow-sm"
                  >
                    <div>
                      {/* Thumbnail aspect ratio */}
                      <div className="aspect-video bg-neutral-950 relative overflow-hidden border-b border-white/5">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 rounded-md bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider text-violet-400 border border-white/10 uppercase">
                          {post.category}
                        </div>
                      </div>

                      <div className="p-5 text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{post.date}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="text-md font-bold text-white tracking-tight line-clamp-2 leading-snug group-hover:text-violet-400 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-white/40">
                      <span className="text-[10px] flex items-center gap-1 font-mono">{post.views.toLocaleString()} visits</span>
                      <span className="text-[10px] font-bold font-mono uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors">Read article <ArrowRight className="h-3 w-3 shrink-0" /></span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Sidebar tags lists (Col-3) */}
            <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 backdrop-blur-md shadow-sm">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-widest block border-b border-white/5 pb-3">
                Tag Cloud
              </span>

              <div className="flex flex-wrap gap-1.5">
                {tagsList.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-lg border transition-all ${
                      selectedTag === tag 
                        ? 'bg-white/10 text-violet-400 border-violet-500/30' 
                        : 'border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
