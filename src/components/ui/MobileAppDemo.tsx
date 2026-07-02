"use client";

import { useState, useEffect } from "react";
import { Battery, Wifi, Signal, Menu, Search, Home, ShoppingBag, User, Heart, ChevronRight, Settings, CreditCard, Package, ArrowLeft, Plus, Minus, CheckCircle, X, Maximize, Minimize, Bell, Shield, MapPin, Truck, HelpCircle } from "lucide-react";

type ScreenState = 'os_home' | 'splash' | 'app_home' | 'app_shop' | 'app_profile' | 'product_detail' | 'cart' | 'checkout_success';

// Mock Data Expansion
const PRODUCTS = [
  // Jackets / Outerwear
  { id: 1, name: "Midnight Series Jacket", category: "Outerwear", price: 3999, img: "https://images.unsplash.com/photo-1550614000-4b95d4e57129?q=80&w=600&auto=format&fit=crop", isNew: true },
  { id: 2, name: "Urban Trench Coat", category: "Outerwear", price: 2499, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 3, name: "Minimalist Blazer", category: "Outerwear", price: 1999, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 4, name: "Classic Leather Jacket", category: "Outerwear", price: 4499, img: "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=600&auto=format&fit=crop", isNew: false },
  // Designer Pieces
  { id: 5, name: "Silk Evening Dress", category: "Designer", price: 6999, img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop", isNew: true },
  { id: 6, name: "Structured Tote Bag", category: "Designer", price: 3499, img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 7, name: "Luxe Knit Sweater", category: "Designer", price: 2499, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 8, name: "Tailored Trousers", category: "Designer", price: 1999, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 9, name: "Cashmere Scarf", category: "Designer", price: 999, img: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 10, name: "Oversized Sunglasses", category: "Designer", price: 1499, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop", isNew: true },
  // Accessories
  { id: 11, name: "Gold Chain Necklace", category: "Accessories", price: 2999, img: "https://images.unsplash.com/photo-1599643478524-fb66f7ca065b?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 12, name: "Chronograph Watch", category: "Accessories", price: 8999, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop", isNew: true },
  { id: 13, name: "Leather Belt", category: "Accessories", price: 1299, img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 14, name: "Pearl Earrings", category: "Accessories", price: 1999, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", isNew: false },
  // Footwear
  { id: 15, name: "Leather Chelsea Boots", category: "Footwear", price: 3499, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 16, name: "Suede Loafers", category: "Footwear", price: 2999, img: "https://images.unsplash.com/photo-1534015699479-7f5fb4ebbd7b?q=80&w=600&auto=format&fit=crop", isNew: true },
  { id: 17, name: "Designer Sneakers", category: "Footwear", price: 4999, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", isNew: false },
  { id: 18, name: "Stiletto Heels", category: "Footwear", price: 5499, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop", isNew: true },
];

export default function MobileAppDemo() {
  const [screen, setScreen] = useState<ScreenState>("os_home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shopFilter, setShopFilter] = useState("All");
  
  // App Data State
  const [cart, setCart] = useState<{id: number, name: string, price: number, qty: number, img: string}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] & {desc: string} | null>(null);

  // OS Clock
  const [time, setTime] = useState("12:00");
  useEffect(() => {
    const d = new Date();
    setTime(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  }, []);

  const launchApp = () => {
    setScreen("splash");
    setTimeout(() => {
      setScreen("app_home");
    }, 1800);
  };

  const handleProductClick = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct({
      ...product,
      desc: "A stunning piece crafted with meticulous attention to detail. Made from premium materials ensuring both comfort and longevity. Perfect for elevating your everyday aesthetic."
    });
    setScreen("product_detail");
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === selectedProduct.id);
      if (existing) {
        return prev.map(item => item.id === selectedProduct.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { ...selectedProduct, qty: 1 }];
    });
    setScreen("cart");
  };

  const handleMenuClick = (category: string) => {
    setIsMenuOpen(false);
    if (category === "Home") setScreen("app_home");
    else if (category === "Account") setScreen("app_profile");
    else {
      setShopFilter(category);
      setScreen("app_shop");
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const OS_APPS = Array.from({length: 20}).map((_, i) => i); // Fake app icons

  // Filtered Shop Products
  const displayedShopProducts = shopFilter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === shopFilter);

  // Base classes for the phone frame
  const frameClasses = isFullscreen 
    ? "fixed inset-0 z-[9999] w-full h-full bg-black flex flex-col" 
    : "relative z-10 w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-500";

  return (
    <div className={`w-full flex items-center justify-center py-20 bg-[#050505] relative overflow-hidden border border-cmf-border ${isFullscreen ? 'static' : ''}`}>
      {/* Background Abstract */}
      {!isFullscreen && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05)_0%,transparent_50%)] pointer-events-none"></div>}

      {/* Fullscreen Toggle Button */}
      {!isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(true)}
          className="absolute top-6 right-6 p-3 bg-cmf-gold/10 text-cmf-gold hover:bg-cmf-gold hover:text-black border border-cmf-gold/30 rounded-xl transition-all z-20 flex items-center gap-2"
        >
          <Maximize size={18} />
          <span className="font-mono text-[10px] uppercase tracking-widest hidden md:inline">Full Screen</span>
        </button>
      )}

      {/* PHONE FRAME */}
      <div className={frameClasses}>
        
        {/* Notch */}
        {!isFullscreen && (
          <div className="absolute top-0 inset-x-0 h-[25px] flex justify-center z-50 pointer-events-none">
            <div className="w-[120px] h-full bg-[#1a1a1a] rounded-b-[15px]"></div>
          </div>
        )}

        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-12 right-6 p-3 bg-black/80 backdrop-blur-md text-white border border-white/20 rounded-full transition-all z-[999] flex items-center shadow-2xl hover:bg-white hover:text-black"
          >
            <Minimize size={20} />
          </button>
        )}

        {/* Global Status Bar */}
        <div className={`h-12 w-full pt-3 px-6 flex justify-between items-center text-[10px] z-40 relative transition-colors ${screen === 'os_home' ? 'text-white' : 'text-white/70'}`}>
          <span className="font-mono">{time}</span>
          <div className="flex gap-1.5 items-center">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* SCREEN CONTENT CONTAINER */}
        <div className={`flex-1 relative overflow-hidden ${isFullscreen ? 'max-w-[480px] mx-auto w-full border-l border-r border-white/5 shadow-2xl bg-black' : ''}`}>
          
          {/* 1. OS HOME SCREEN */}
          {screen === "os_home" && (
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center animate-fade-in flex flex-col pt-8">
              <div className="flex-1 p-6">
                <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                  {/* Real App Icon */}
                  <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={launchApp}>
                    <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-black border border-cmf-gold/30 rounded-xl flex items-center justify-center group-active:scale-95 transition-transform shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cmf-gold/20 to-transparent"></div>
                      <span className="text-cmf-gold font-display text-xl md:text-3xl">L</span>
                    </div>
                    <span className="text-[9px] md:text-[11px] text-white font-medium drop-shadow-md">Luxe</span>
                  </div>
                  
                  {/* Fake Apps */}
                  {OS_APPS.slice(0, 15).map(id => (
                    <div key={id} className="flex flex-col items-center gap-1 opacity-70">
                      <div className={`w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-xl bg-white/10 backdrop-blur-sm shadow-sm`}></div>
                      <span className="text-[9px] text-transparent bg-white/20 rounded w-8 h-2 mt-1"></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[90px] bg-white/10 backdrop-blur-xl mb-4 mx-4 rounded-3xl p-4 flex justify-around items-center">
                 {OS_APPS.slice(15, 19).map(id => (
                    <div key={`dock-${id}`} className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-xl bg-white/20 shadow-sm"></div>
                 ))}
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/50 rounded-full"></div>
            </div>
          )}

          {/* 2. SPLASH SCREEN */}
          {screen === "splash" && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center animate-fade-in z-50">
              <div className="w-20 h-20 md:w-32 md:h-32 border border-cmf-gold/30 rounded-2xl flex items-center justify-center bg-black shadow-[0_0_30px_rgba(201,168,76,0.15)] animate-pulse">
                <span className="text-cmf-gold font-display text-4xl md:text-6xl">L</span>
              </div>
              <div className="text-cmf-gold text-[10px] md:text-xs font-mono tracking-[0.4em] mt-8 uppercase">Luxe Mobile</div>
            </div>
          )}

          {/* APP MASTER LAYOUT (for app_home, app_shop, app_profile) */}
          {['app_home', 'app_shop', 'app_profile'].includes(screen) && (
            <div className="absolute inset-0 flex flex-col bg-[#0a0a09] animate-fade-in-up">
              
              {/* App Header */}
              <div className="px-5 py-3 flex justify-between items-center bg-black/80 backdrop-blur-md z-30 border-b border-white/5">
                <button onClick={() => setIsMenuOpen(true)} className="text-white hover:text-cmf-gold transition-colors p-2">
                  <Menu size={24} />
                </button>
                <div className="font-display text-lg tracking-widest text-cmf-gold uppercase">Luxe</div>
                <button onClick={() => setScreen("cart")} className="text-white hover:text-cmf-gold transition-colors relative p-2">
                  <ShoppingBag size={24} />
                  {cart.length > 0 && <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border border-black">{cart.length}</div>}
                </button>
              </div>

              {/* Menu Overlay */}
              <div className={`absolute inset-0 bg-black/95 z-50 backdrop-blur-xl transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
                <div className="flex flex-col gap-8 p-8 mt-24">
                  {['Home', 'All', 'Outerwear', 'Designer', 'Accessories', 'Footwear', 'Account'].map((item) => (
                    <div key={item} onClick={() => handleMenuClick(item)} className="text-2xl md:text-3xl font-light text-white/80 hover:text-cmf-gold transition-colors cursor-pointer">{item}</div>
                  ))}
                  <div className="mt-auto pt-8 border-t border-white/10">
                    <button onClick={() => setScreen("os_home")} className="text-red-400 text-sm font-mono tracking-widest uppercase hover:text-red-300 transition-colors">Exit App Demo</button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-[90px]">
                
                {/* --- APP HOME TAB --- */}
                {screen === "app_home" && (
                  <div className="p-5 flex flex-col gap-8 animate-fade-in">
                    {/* Hero Section */}
                    <div className="w-full h-56 md:h-72 bg-[#111] rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer" onClick={() => handleProductClick(PRODUCTS[0])}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
                      <img src={PRODUCTS[0].img} className="object-cover w-full h-full opacity-70 transition-transform duration-700" alt="Hero" />
                      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                        <div className="text-cmf-gold text-[10px] md:text-xs font-mono tracking-widest mb-2">NEW COLLECTION</div>
                        <div className="text-white font-display text-3xl md:text-4xl">The Midnight Series</div>
                      </div>
                    </div>

                    {/* Trending Outerwear */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white/90 text-sm md:text-base font-medium tracking-wide">Trending Outerwear</span>
                        <span className="text-cmf-gold text-[10px] md:text-xs font-mono tracking-widest cursor-pointer hover:underline" onClick={() => handleMenuClick("Outerwear")}>VIEW ALL</span>
                      </div>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {PRODUCTS.filter(p => p.category === "Outerwear").map((p) => (
                          <div key={p.id} onClick={() => handleProductClick(p)} className="min-w-[140px] md:min-w-[180px] h-[190px] md:h-[240px] bg-[#161616] rounded-xl flex-shrink-0 cursor-pointer border border-transparent active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden hover:border-cmf-gold/30">
                            <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-60 transition-opacity" alt={p.name} />
                            <div className="absolute top-2 right-2 p-1.5 md:p-2 bg-black/40 backdrop-blur-sm rounded-full text-white/70 hover:text-red-400 z-10">
                              <Heart size={14} />
                            </div>
                            {p.isNew && <div className="absolute top-2 left-2 bg-cmf-gold text-black text-[8px] font-bold px-2 py-0.5 rounded uppercase">New</div>}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                              <div className="text-xs md:text-sm text-white font-medium line-clamp-1">{p.name}</div>
                              <div className="text-[10px] md:text-xs text-cmf-gold mt-1">₹{p.price.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessories Carousel */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white/90 text-sm md:text-base font-medium tracking-wide">Must-Have Accessories</span>
                        <span className="text-cmf-gold text-[10px] md:text-xs font-mono tracking-widest cursor-pointer hover:underline" onClick={() => handleMenuClick("Accessories")}>VIEW ALL</span>
                      </div>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {PRODUCTS.filter(p => p.category === "Accessories").map((p) => (
                          <div key={p.id} onClick={() => handleProductClick(p)} className="min-w-[140px] md:min-w-[180px] h-[190px] md:h-[240px] bg-[#161616] rounded-xl flex-shrink-0 cursor-pointer border border-transparent active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden hover:border-cmf-gold/30">
                            <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-60 transition-opacity" alt={p.name} />
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                              <div className="text-xs md:text-sm text-white font-medium line-clamp-1">{p.name}</div>
                              <div className="text-[10px] md:text-xs text-cmf-gold mt-1">₹{p.price.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- APP SHOP TAB --- */}
                {screen === "app_shop" && (
                  <div className="p-5 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-white text-xl md:text-2xl font-display">{shopFilter} Products</h2>
                      <div className="flex items-center gap-2 text-white/50 bg-[#161616] px-3 py-1.5 rounded-full border border-white/10 text-xs cursor-pointer hover:bg-white/5 transition-colors">
                        <span>Sort</span>
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                    
                    {/* Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
                       {['All', 'Outerwear', 'Designer', 'Accessories', 'Footwear'].map(cat => (
                         <button 
                            key={cat} 
                            onClick={() => setShopFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${shopFilter === cat ? 'bg-cmf-gold text-black font-medium' : 'bg-[#111] text-white/60 border border-white/10 hover:border-cmf-gold/50'}`}
                         >
                            {cat}
                         </button>
                       ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {displayedShopProducts.map((p) => (
                        <div key={p.id} onClick={() => handleProductClick(p)} className="bg-[#111] rounded-xl overflow-hidden border border-white/5 active:scale-95 transition-transform cursor-pointer hover:border-cmf-gold/30 flex flex-col">
                          <div className="aspect-square relative overflow-hidden bg-[#1a1a1a]">
                            {p.isNew && <div className="absolute top-2 left-2 z-10 bg-cmf-gold text-black text-[8px] font-bold px-2 py-0.5 rounded uppercase">New</div>}
                            <img src={p.img} className="w-full h-full object-cover opacity-70 hover:scale-110 transition-transform duration-700" alt={p.name} />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between bg-[#161616]">
                            <div className="text-xs md:text-sm text-white/90 line-clamp-2">{p.name}</div>
                            <div className="text-xs md:text-sm text-cmf-gold font-mono mt-2">₹{p.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- APP PROFILE TAB --- */}
                {screen === "app_profile" && (
                  <div className="p-5 animate-fade-in">
                    <div className="flex flex-col items-center mb-10 pt-6">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#1a1a1a] border border-cmf-gold/30 overflow-hidden mb-4 relative">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
                      </div>
                      <div className="text-white font-display text-2xl md:text-3xl">Elena Rostova</div>
                      <div className="text-cmf-gold text-[10px] md:text-xs font-mono tracking-widest mt-2">PREMIUM MEMBER</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-[#111] rounded-2xl p-2 md:p-4 flex flex-col gap-2 border border-white/5">
                        <div className="px-4 py-2 text-[10px] text-white/40 font-mono tracking-widest">ACCOUNT</div>
                        {[
                          { icon: <Package size={20} />, label: "My Orders", val: "3 Active" },
                          { icon: <Heart size={20} />, label: "Wishlist", val: "12 Items" },
                          { icon: <MapPin size={20} />, label: "Shipping Addresses", val: "2 Saved" },
                          { icon: <CreditCard size={20} />, label: "Payment Methods", val: "" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="text-white/50">{item.icon}</div>
                              <span className="text-base text-white/90">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.val && <span className="text-xs text-white/40">{item.val}</span>}
                              <ChevronRight size={18} className="text-white/20" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#111] rounded-2xl p-2 md:p-4 flex flex-col gap-2 border border-white/5">
                        <div className="px-4 py-2 text-[10px] text-white/40 font-mono tracking-widest">PREFERENCES</div>
                        {[
                          { icon: <Bell size={20} />, label: "Notifications", val: "Enabled" },
                          { icon: <Shield size={20} />, label: "Privacy & Security", val: "" },
                          { icon: <Settings size={20} />, label: "App Settings", val: "" },
                          { icon: <HelpCircle size={20} />, label: "Help & Support", val: "" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="text-white/50">{item.icon}</div>
                              <span className="text-base text-white/90">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.val && <span className="text-xs text-white/40">{item.val}</span>}
                              <ChevronRight size={18} className="text-white/20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 inset-x-0 h-[80px] md:h-[90px] bg-black/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-4 pb-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {[
                  { id: "app_home", icon: <Home size={24} />, label: "Home" },
                  { id: "app_shop", icon: <ShoppingBag size={24} />, label: "Shop" },
                  { id: "app_profile", icon: <User size={24} />, label: "Profile" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setScreen(item.id as ScreenState); setShopFilter("All"); }}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${screen === item.id ? 'text-cmf-gold -translate-y-1' : 'text-white/30 hover:text-white/60'}`}
                  >
                    {item.icon}
                    <span className={`text-[10px] font-medium transition-opacity ${screen === item.id ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. PRODUCT DETAIL SCREEN */}
          {screen === "product_detail" && selectedProduct && (
            <div className="absolute inset-0 flex flex-col bg-[#0a0a09] z-50 animate-fade-in-right">
               <div className="relative h-[400px] md:h-[450px] bg-[#111]">
                  <img src={selectedProduct.img} className="w-full h-full object-cover opacity-80" alt={selectedProduct.name} />
                  <button onClick={() => setScreen("app_home")} className="absolute top-6 left-5 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/60 transition-colors z-10">
                     <ArrowLeft size={24} />
                  </button>
                  <button onClick={() => setScreen("cart")} className="absolute top-6 right-5 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 relative hover:bg-black/60 transition-colors z-10">
                     <ShoppingBag size={24} />
                     {cart.length > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{cart.length}</div>}
                  </button>
                  {/* Delivery Info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 text-white/80 text-xs z-10">
                    <Truck size={16} className="text-cmf-gold" />
                    <span>Free shipping on orders over ₹15000. Estimated delivery: 2-4 days.</span>
                  </div>
               </div>
               <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                       <h2 className="text-3xl text-white font-display mb-2">{selectedProduct.name}</h2>
                       <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-xs font-mono">
                         <span className="bg-cmf-gold/20 text-cmf-gold px-2 py-1 rounded">IN STOCK</span>
                         <span>REF: LX-{selectedProduct.id}</span>
                       </div>
                     </div>
                     <span className="text-2xl text-cmf-gold font-mono">₹{selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <p className="text-base text-white/60 font-light leading-relaxed mb-8">
                    {selectedProduct.desc}
                  </p>
                  
                  <div className="mb-6">
                    <div className="text-[10px] md:text-xs text-white/50 font-mono tracking-widest mb-4">SELECT SIZE</div>
                    <div className="flex gap-4">
                      {['S', 'M', 'L', 'XL'].map(s => (
                        <button key={s} className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 text-white/70 text-base focus:bg-white focus:text-black hover:border-white transition-colors">{s}</button>
                      ))}
                    </div>
                  </div>
               </div>
               
               <div className="p-5 md:p-6 bg-black border-t border-white/10">
                 <button onClick={addToCart} className="w-full py-5 bg-cmf-gold text-black rounded-xl text-lg font-medium tracking-wide active:scale-95 transition-transform flex justify-center items-center gap-3 shadow-lg hover:bg-[#E8C96A]">
                   <ShoppingBag size={22} /> ADD TO CART
                 </button>
               </div>
            </div>
          )}

          {/* 5. CART SCREEN */}
          {screen === "cart" && (
            <div className="absolute inset-0 flex flex-col bg-[#0a0a09] z-50 animate-fade-in">
              <div className="px-6 py-5 border-b border-white/10 flex items-center gap-5 bg-black sticky top-0">
                 <button onClick={() => setScreen("app_home")} className="text-white/70 hover:text-white transition-colors p-2"><ArrowLeft size={24} /></button>
                 <span className="text-white font-display text-2xl">Your Bag</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/40 gap-6 mt-20">
                    <ShoppingBag size={64} className="opacity-20" />
                    <p className="text-lg">Your bag is empty.</p>
                    <button onClick={() => setScreen("app_shop")} className="px-8 py-3 border border-white/20 hover:border-cmf-gold hover:text-cmf-gold transition-colors rounded-full text-white mt-2">Browse Shop</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-5 p-4 bg-[#111] border border-white/5 rounded-2xl shadow-sm relative">
                         <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1 text-white/30 hover:text-red-400"><X size={16} /></button>
                         <div className="w-24 h-28 md:w-32 md:h-36 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0">
                           <img src={item.img} className="w-full h-full object-cover opacity-80" alt={item.name} />
                         </div>
                         <div className="flex-1 flex flex-col py-2">
                           <span className="text-white/90 text-base md:text-lg font-medium line-clamp-1 mb-1 pr-6">{item.name}</span>
                           <span className="text-cmf-gold text-sm md:text-base font-mono">₹{item.price.toFixed(2)}</span>
                           <div className="mt-auto flex items-center gap-4">
                             <div className="flex items-center gap-4 bg-black rounded-xl px-3 py-2 border border-white/10">
                               <button onClick={() => {
                                 const newCart = [...cart];
                                 if (newCart[idx].qty > 1) { newCart[idx].qty--; setCart(newCart); }
                               }} className="text-white/40 hover:text-white transition-colors"><Minus size={16} /></button>
                               <span className="text-sm text-white w-6 text-center font-medium">{item.qty}</span>
                               <button onClick={() => {
                                 const newCart = [...cart];
                                 newCart[idx].qty++; setCart(newCart);
                               }} className="text-white/40 hover:text-white transition-colors"><Plus size={16} /></button>
                             </div>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="bg-black border-t border-white/10 p-6">
                  <div className="flex justify-between items-center mb-6 text-white/90">
                    <span className="text-lg font-medium">Total</span>
                    <span className="font-mono text-2xl text-cmf-gold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => { setCart([]); setScreen("checkout_success"); }} className="w-full py-5 bg-white text-black hover:bg-gray-200 rounded-xl text-lg font-medium tracking-wide active:scale-95 transition-transform flex justify-center items-center gap-2">
                     SECURE CHECKOUT
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 6. CHECKOUT SUCCESS */}
          {screen === "checkout_success" && (
            <div className="absolute inset-0 bg-[#0a0a09] z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
               <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-8 text-green-400">
                 <CheckCircle size={48} />
               </div>
               <h2 className="text-3xl font-display text-white mb-4">Order Confirmed</h2>
               <p className="text-base text-white/50 mb-10 leading-relaxed max-w-xs">Thank you for your purchase. Your order #849302 is being processed and will ship shortly.</p>
               <button onClick={() => setScreen("app_home")} className="w-full max-w-[280px] mx-auto py-4 bg-[#1a1a1a] text-white border border-white/10 rounded-xl hover:bg-[#222] transition-colors text-lg">
                 Return to Home
               </button>
            </div>
          )}

        </div>
        
        {/* OS Home indicator bar */}
        {screen !== 'os_home' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full z-[100] cursor-pointer hover:bg-white transition-colors" onClick={() => setScreen("os_home")}></div>
        )}

      </div>
      
      {/* Decorative Help Text */}
      {!isFullscreen && (
        <div className="absolute bottom-10 right-10 text-right hidden md:block">
          <div className="text-cmf-gold text-[10px] font-mono tracking-[0.3em] mb-2">FULL APP SIMULATION</div>
          <div className="text-white/30 font-light text-sm max-w-[200px] leading-relaxed">
            {screen === 'os_home' ? "Click the Luxe app icon to launch the application." : "Experience a complete user journey: browse, add to cart, and checkout."}
          </div>
        </div>
      )}
    </div>
  );
}
