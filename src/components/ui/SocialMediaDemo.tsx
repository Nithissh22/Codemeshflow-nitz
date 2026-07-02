"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Grid, Calendar, TrendingUp } from "lucide-react";

export default function SocialMediaDemo() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const posts = [
    { type: 'image', likes: 1205, comments: 45, img: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=600&auto=format&fit=crop" },
    { type: 'video', likes: 3402, comments: 112, img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop" },
    { type: 'carousel', likes: 890, comments: 24, img: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=600&auto=format&fit=crop" },
    { type: 'image', likes: 2150, comments: 89, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop" },
    { type: 'image', likes: 1750, comments: 62, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
    { type: 'video', likes: 4500, comments: 230, img: "https://images.unsplash.com/photo-1634942537034-2b96ac9ee014?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-12 relative z-10">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="text-left mb-6">
            <span className="label-mono text-[10px] text-cmf-gold tracking-[0.2em] mb-2 block">CONTENT CURATION</span>
            <h3 className="text-3xl text-white font-display">Aesthetic Feed Design</h3>
            <p className="text-white/40 font-light text-sm mt-2">We construct meticulously planned 30-day content calendars that ensure visual harmony and maximize audience engagement.</p>
          </div>

          <div className="bg-[#0a0a09] border border-white/5 rounded-xl p-6">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 rounded-full bg-cmf-gold/10 border border-cmf-gold/30 flex items-center justify-center overflow-hidden">
                  <div className="font-display text-cmf-gold text-2xl">B</div>
               </div>
               <div>
                 <div className="text-white font-medium text-lg">brand_official</div>
                 <div className="text-white/40 text-xs">Digital & Lifestyle</div>
               </div>
             </div>

             <div className="flex justify-between text-center mb-6">
               <div>
                 <div className="text-white font-display text-xl">412</div>
                 <div className="text-white/40 text-[10px] tracking-widest">POSTS</div>
               </div>
               <div>
                 <div className="text-white font-display text-xl">124K</div>
                 <div className="text-white/40 text-[10px] tracking-widest">FOLLOWERS</div>
               </div>
               <div>
                 <div className="text-white font-display text-xl">89</div>
                 <div className="text-white/40 text-[10px] tracking-widest">FOLLOWING</div>
               </div>
             </div>

             <div className="flex gap-2">
               <button className="flex-1 bg-cmf-gold text-black py-2 rounded-md font-mono text-[10px] tracking-widest hover:bg-[#E8C96A] transition-colors">FOLLOW</button>
               <button className="flex-1 bg-[#1a1a1a] text-white py-2 rounded-md font-mono text-[10px] tracking-widest hover:bg-[#222] transition-colors border border-white/10">MESSAGE</button>
             </div>
          </div>

          <div className="bg-cmf-gold/5 border border-cmf-gold/20 rounded-xl p-5 flex items-center gap-4">
             <TrendingUp className="text-cmf-gold" size={24} />
             <div>
               <div className="text-cmf-gold text-sm font-medium">Engagement +34%</div>
               <div className="text-cmf-gold/60 text-xs">Since management takeover</div>
             </div>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-center gap-12 border-b border-white/5 pb-4 mb-6">
            <button className="flex items-center gap-2 text-white border-t-2 border-white pt-2 -mt-[18px]">
              <Grid size={16} /> <span className="text-xs tracking-widest font-mono">POSTS</span>
            </button>
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors pt-2 -mt-[18px]">
              <Calendar size={16} /> <span className="text-xs tracking-widest font-mono">CALENDAR</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {posts.map((post, i) => (
              <div 
                key={i} 
                className="aspect-square bg-[#111] relative overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredPost(i)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <img src={post.img} alt={`Post ${i+1}`} className="w-full h-full object-cover opacity-80" />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity duration-300 ${hoveredPost === i ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Heart size={18} fill="currentColor" />
                    <span>{post.likes > 1000 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <MessageCircle size={18} fill="currentColor" />
                    <span>{post.comments}</span>
                  </div>
                </div>

                {/* Icons top right */}
                {post.type === 'video' && <div className="absolute top-2 right-2 text-white shadow-sm"><Share2 size={14} /></div>}
                {post.type === 'carousel' && <div className="absolute top-2 right-2 text-white shadow-sm"><Grid size={14} /></div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
