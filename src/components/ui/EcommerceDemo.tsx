"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, X, Check, ArrowRight, Plus, Minus } from "lucide-react";
import { gsap } from "@/lib/gsap";

function MagneticButton({ children, onClick, disabled, className }: any) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
        overwrite: true
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

// Types
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  img1: string;
  img2: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

// Mock Data
const PRODUCTS: Product[] = [
  { 
    id: 1, name: "Midnight Aura", category: "Fragrance", price: 185, 
    img1: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1594032194509-0056023973b2?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 2, name: "Obsidian Chronograph", category: "Accessories", price: 450, 
    img1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 3, name: "Silken Trench", category: "Apparel", price: 320, 
    img1: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 4, name: "Onyx Carryall", category: "Bags", price: 580, 
    img1: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 5, name: "Velvet Noir", category: "Fragrance", price: 210, 
    img1: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 6, name: "Eclipse Aviators", category: "Accessories", price: 290, 
    img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop", 
    img2: "https://images.unsplash.com/photo-1572635196237-14b3f281501f?q=80&w=600&auto=format&fit=crop" 
  }
];

const CATEGORIES = ["All", "Fragrance", "Accessories", "Apparel", "Bags"];

export default function EcommerceDemo() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "processing" | "success">("cart");
  const [addingId, setAddingId] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    gsap.fromTo(cards, 
      { opacity: 0, y: 40, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", overwrite: true }
    );
  }, [activeCategory]);

  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setAddingId(product.id);
    
    setTimeout(() => {
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
      setAddingId(null);
      setCartOpen(true);
    }, 600);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const handleCheckout = () => {
    setCheckoutStep("processing");
    setTimeout(() => {
      setCheckoutStep("success");
      setCart([]);
    }, 2000);
  };

  return (
    <div className="py-20 border-t border-cmf-border">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          FULL STOREFRONT SIMULATION
        </span>
        <h2 className="heading-display text-4xl md:text-5xl text-cmf-text mb-6">
          AURA.
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          Experience a fully functional headless commerce frontend. Filter products, manage your cart state, and simulate a complete checkout flow seamlessly.
        </p>
      </div>
      
      {/* Full Store Interface */}
      <div className="bg-[#050505] border border-cmf-border rounded-lg relative overflow-hidden min-h-[800px] flex flex-col shadow-2xl">
        
        {/* Mock Store Header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-cmf-border h-20 flex justify-between items-center px-8">
          <span className="font-display tracking-widest text-xl text-cmf-text">AURA.</span>
          
          <div className="hidden md:flex items-center gap-8">
            {CATEGORIES.slice(1).map(cat => (
              <span key={cat} className="text-xs uppercase tracking-widest text-cmf-text-muted hover:text-cmf-gold transition-colors cursor-pointer" onClick={() => setActiveCategory(cat)}>{cat}</span>
            ))}
          </div>

          <button 
            onClick={() => setCartOpen(true)}
            className="relative text-cmf-text hover:text-cmf-gold transition-colors flex items-center gap-3"
          >
            <span className="text-xs tracking-widest uppercase hidden md:block">Cart</span>
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-cmf-gold text-cmf-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Store Body */}
        <div className="flex-1 p-8 md:p-12">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-cmf-border pb-6">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`label-mono text-xs px-4 py-2 border transition-colors ${activeCategory === cat ? 'border-cmf-gold text-cmf-gold bg-cmf-gold/5' : 'border-transparent text-cmf-text-muted hover:text-cmf-text'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 group/grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="group cursor-pointer flex flex-col transition-all duration-500 hover:!opacity-100 group-hover/grid:opacity-40 hover:scale-[1.02]">
                <div className="relative w-full aspect-[4/5] bg-[#111] overflow-hidden mb-6">
                  <Image 
                    src={product.img1} 
                    alt={product.name} 
                    fill 
                    className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-100 group-hover:opacity-0"
                  />
                  <Image 
                    src={product.img2} 
                    alt={`${product.name} Detail`} 
                    fill 
                    className="object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out opacity-0 group-hover:opacity-100"
                  />
                </div>

                <div className="flex justify-between items-start flex-1">
                  <div>
                    <span className="label-mono text-[10px] text-cmf-gold-muted tracking-widest uppercase block mb-2">{product.category}</span>
                    <h4 className="font-display text-xl text-cmf-text mb-2">{product.name}</h4>
                    <p className="font-sans text-cmf-text-muted">₹{product.price.toFixed(2)}</p>
                  </div>
                  
                  <MagneticButton 
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={addingId === product.id}
                    className="w-10 h-10 border border-cmf-border rounded-full flex items-center justify-center text-cmf-text hover:bg-cmf-gold hover:text-cmf-bg hover:border-cmf-gold transition-colors"
                  >
                    {addingId === product.id ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Plus size={16} />
                    )}
                  </MagneticButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide-out Cart Drawer */}
        <div className={`absolute top-0 right-0 w-full md:w-[450px] h-full bg-[#080808] border-l border-cmf-border shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col z-30 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex justify-between items-center p-8 border-b border-cmf-border">
            <span className="font-display uppercase tracking-widest text-xl">Your Cart ({totalItems})</span>
            <button 
              onClick={() => {
                setCartOpen(false);
                if (checkoutStep === "success") setCheckoutStep("cart");
              }} 
              className="text-cmf-text-muted hover:text-cmf-gold transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {checkoutStep === "cart" && (
            <>
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {cart.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-6 items-center">
                        <div className="relative w-24 h-32 bg-[#111]">
                          <Image src={item.product.img1} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-display text-lg mb-1">{item.product.name}</h5>
                          <p className="text-cmf-text-muted text-sm mb-4">₹{item.product.price.toFixed(2)}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-cmf-border">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center text-cmf-text-muted hover:text-cmf-text transition-colors"><Minus size={12} /></button>
                              <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center text-cmf-text-muted hover:text-cmf-text transition-colors"><Plus size={12} /></button>
                            </div>
                            <button onClick={() => removeItem(item.product.id)} className="text-xs text-cmf-text-muted hover:text-red-400 transition-colors uppercase tracking-widest">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-cmf-text-muted">
                    <ShoppingBag size={48} strokeWidth={0.5} className="mb-6 opacity-50" />
                    <p className="font-sans font-light mb-8">Your cart is currently empty.</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="px-8 py-3 border border-cmf-gold text-cmf-gold hover:bg-cmf-gold hover:text-cmf-bg transition-colors tracking-widest uppercase text-xs"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-cmf-border bg-[#0a0a0a]">
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-sans text-cmf-text-muted">Estimated Total</span>
                    <span className="font-display text-2xl">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full h-16 bg-cmf-gold text-cmf-bg font-display uppercase tracking-widest hover:bg-cmf-gold-light transition-colors flex items-center justify-center gap-3 text-lg"
                  >
                    Simulate Checkout <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}

          {checkoutStep === "processing" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="w-12 h-12 border-2 border-cmf-gold border-t-transparent rounded-full animate-spin mb-8"></span>
              <h3 className="font-display text-2xl mb-2">Processing Payment</h3>
              <p className="text-cmf-text-muted font-light">Simulating secure checkout...</p>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-cmf-gold/10 text-cmf-gold flex items-center justify-center mb-8">
                <Check size={32} />
              </div>
              <h3 className="font-display text-3xl mb-4 text-cmf-gold">Order Complete</h3>
              <p className="text-cmf-text-muted font-light mb-8 leading-relaxed max-w-xs mx-auto">
                Thank you for testing the e-commerce simulation. In a real environment, this would redirect to an order confirmation page.
              </p>
              <button 
                onClick={() => {
                  setCheckoutStep("cart");
                  setCartOpen(false);
                }}
                className="px-8 py-4 border border-cmf-border text-cmf-text hover:border-cmf-gold hover:text-cmf-gold transition-colors tracking-widest uppercase text-xs"
              >
                Back to Store
              </button>
            </div>
          )}

        </div>

        {/* Cart Overlay */}
        {cartOpen && (
          <div 
            className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm"
            onClick={() => {
              setCartOpen(false);
              if (checkoutStep === "success") setCheckoutStep("cart");
            }}
          ></div>
        )}

      </div>
    </div>
  );
}
