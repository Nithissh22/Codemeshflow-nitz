import { gsap } from "@/lib/gsap";

export function initProcessHandAnimation(section: HTMLElement) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 900px)").matches || window.matchMedia("(pointer: coarse)").matches;
  const isSmallHeight = window.matchMedia("(max-height: 850px)").matches;

  const cards = Array.from(section.querySelectorAll('.process-card')) as HTMLElement[];
  if (cards.length !== 6) return () => {};

  let activeIndex = -1; // -1 means no card is selected (Hand view)
  let isAnimating = false;

  const baseAngles6 = isMobile ? [-15, -9, -3, 3, 9, 15] : [-25, -15, -5, 5, 15, 25];
  const baseAngles5 = isMobile ? [-12, -6, 0, 6, 12] : [-20, -10, 0, 10, 20];
  const handScale = isMobile ? 0.65 : (isSmallHeight ? 0.55 : 0.60);
  const handY = isMobile ? -40 : (isSmallHeight ? 0 : 0); // Lift up slightly on mobile so it doesn't sink
  const expandedScale = isMobile ? 0.95 : (isSmallHeight ? 0.80 : 0.90);
  const expandedY = isMobile ? -80 : (isSmallHeight ? -320 : -360);

  // Setup Initial State
  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      left: "50%",
      bottom: "0px",
      rotationZ: baseAngles6[i],
      y: handY,
      scale: handScale,
      zIndex: i,
      transformOrigin: isMobile ? "50% 120%" : "50% 140%"
    });
    
    // Ensure details are hidden initially
    gsap.set(card.querySelector('.card-details'), { opacity: 0, pointerEvents: 'none' });
    gsap.set(card.querySelector('.close-btn'), { opacity: 0, pointerEvents: 'none' });
    gsap.set(card.querySelector('.nav-btns'), { opacity: 0, pointerEvents: 'none' });
  });

  // Hover Mechanics
  const handleMouseEnter = (i: number) => {
    if (activeIndex !== -1 || isAnimating || isMobile || isReducedMotion) return;
    
    const card = cards[i];
    gsap.set(card, { zIndex: 20 });
    gsap.to(card, {
      y: handY - 15,
      scale: handScale + 0.05,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = (i: number) => {
    if (activeIndex !== -1 || isAnimating || isMobile || isReducedMotion) return;

    const card = cards[i];
    gsap.set(card, { zIndex: i });
    gsap.to(card, {
      rotationZ: baseAngles6[i],
      rotationX: 0,
      rotationY: 0,
      y: handY,
      scale: handScale,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto"
    });
    card.style.boxShadow = '0 30px 60px -15px rgba(0,0,0,0.8), inset 0 0 40px rgba(201,168,76,0.02)';
  };

  const handleMouseMove = (e: MouseEvent, i: number) => {
    if (activeIndex !== -1 || isAnimating || isMobile || isReducedMotion) return;
    
    const card = cards[i];
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    gsap.to(card, {
      rotationX: normY * -2,
      rotationY: normX * 2,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    card.style.boxShadow = `${normX * -20}px ${normY * -20 + 40}px 80px -20px rgba(0,0,0,0.9), inset 0 0 40px rgba(201,168,76,0.05)`;
  };

  // Content Animations
  const revealDetails = (card: HTMLElement) => {
    const details = card.querySelector('.card-details');
    if (!details) return;
    
    gsap.set(details, { pointerEvents: 'auto' });
    
    if (isReducedMotion) {
      gsap.set(details, { opacity: 1 });
      gsap.set(card.querySelectorAll('.sec-label, .phase-title, .gold-line, .body-desc, .tag-chips span, .quote-text, .deliv-label, .deliv-item'), { opacity: 1, y: 0, x: 0, scale: 1, width: 'auto' });
      return;
    }

    const tl = gsap.timeline();
    tl.to(details, { opacity: 1, duration: 0.3 });
    
    // Reset states
    gsap.set(card.querySelectorAll('.sec-label, .phase-title, .body-desc, .quote-text, .deliv-label'), { opacity: 0, y: 20 });
    gsap.set(card.querySelectorAll('.tag-chips span'), { scale: 0.5, opacity: 0 });
    gsap.set(card.querySelectorAll('.gold-line'), { width: 0 });
    gsap.set(card.querySelectorAll('.deliv-item'), { opacity: 0, x: 30 });

    tl.to(card.querySelector('.sec-label'), { opacity: 1, y: 0, duration: 0.4 })
      .to(card.querySelector('.phase-title'), { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .to(card.querySelector('.gold-line'), { width: 60, duration: 0.5 }, "-=0.3")
      .to(card.querySelector('.body-desc'), { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(card.querySelectorAll('.tag-chips span'), { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .to(card.querySelector('.quote-text'), { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      
      .to(card.querySelector('.deliv-label'), { opacity: 1, y: 0, duration: 0.4 }, 0.2)
      .to(card.querySelectorAll('.deliv-item'), { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.3);
  };

  const hideDetails = (card: HTMLElement) => {
    const details = card.querySelector('.card-details');
    if (!details) return;
    gsap.set(details, { opacity: 0, pointerEvents: 'none' });
    gsap.set(card.querySelectorAll('.sec-label, .phase-title, .gold-line, .body-desc, .tag-chips span, .quote-text, .deliv-label, .deliv-item'), { clearProps: "all" });
  };

  // The Draw (Open Card or Switch)
  const drawCard = (i: number) => {
    if (isAnimating) return;
    if (activeIndex === i) return;
    
    const oldIndex = activeIndex;
    isAnimating = true;
    activeIndex = i;

    const selectedCard = cards[i];
    const cover = selectedCard.querySelector('.card-cover');
    const closeBtn = selectedCard.querySelector('.close-btn');
    const navBtns = selectedCard.querySelector('.nav-btns');

    if (oldIndex !== -1) {
      // Switching from another card
      const oldCard = cards[oldIndex];
      const oldCover = oldCard.querySelector('.card-cover');
      const oldCloseBtn = oldCard.querySelector('.close-btn');
      const oldNavBtns = oldCard.querySelector('.nav-btns');
      
      if (oldCloseBtn) gsap.set(oldCloseBtn, { opacity: 0, pointerEvents: 'none' });
      if (oldNavBtns) gsap.set(oldNavBtns, { opacity: 0, pointerEvents: 'none' });
      hideDetails(oldCard);
      gsap.to(oldCover, { opacity: 1, duration: 0.3 });
    }

    // Animate all other cards (including oldCard if there was one) to their 3-card hand positions
    const otherCards = cards.filter((_, idx) => idx !== i);
    otherCards.forEach((c, idx) => {
      const originalIndex = cards.indexOf(c);
      gsap.set(c, { zIndex: originalIndex }); // Snap z-index instantly
      gsap.to(c, {
        rotationZ: baseAngles5[idx],
        y: handY + 20,
        opacity: 0.8,
        scale: handScale - 0.05,
        duration: 0.6,
        ease: "power3.inOut"
      });
    });

    // Bring selected card to center
    gsap.set(selectedCard, { zIndex: 50 }); // Snap z-index instantly to be above all
    gsap.to(selectedCard, {
      rotationZ: 0,
      rotationX: 0,
      rotationY: 0,
      y: expandedY,
      scale: expandedScale,
      opacity: 1,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        isAnimating = false;
      }
    });

    // 3. Crossfade cover to details
    gsap.to(cover, { opacity: 0, duration: 0.3, ease: "power2.inOut" });
    revealDetails(selectedCard);
    
    if (closeBtn) {
      gsap.to(closeBtn, { opacity: 1, pointerEvents: 'auto', duration: 0.4, delay: 0.5 });
    }
    if (navBtns) {
      gsap.to(navBtns, { opacity: 1, pointerEvents: 'auto', duration: 0.4, delay: 0.5 });
    }
  };

  // Close Card (Return to Hand)
  const closeCard = () => {
    if (activeIndex === -1 || isAnimating) return;
    isAnimating = true;

    const selectedCard = cards[activeIndex];
    const otherCards = cards.filter((_, idx) => idx !== activeIndex);
    const cover = selectedCard.querySelector('.card-cover');
    const closeBtn = selectedCard.querySelector('.close-btn');
    const navBtns = selectedCard.querySelector('.nav-btns');

    if (closeBtn) gsap.set(closeBtn, { opacity: 0, pointerEvents: 'none' });
    if (navBtns) gsap.set(navBtns, { opacity: 0, pointerEvents: 'none' });
    hideDetails(selectedCard);
    gsap.to(cover, { opacity: 1, duration: 0.4, delay: 0.2 });

    // 1. Send active card back to its spot
    gsap.set(selectedCard, { zIndex: activeIndex }); // Snap back to its original layering
    gsap.to(selectedCard, {
      rotationZ: baseAngles6[activeIndex],
      y: handY,
      scale: handScale,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        isAnimating = false;
        activeIndex = -1;
      }
    });

    // 2. Bring other cards back up
    otherCards.forEach((c) => {
      const originalIndex = cards.indexOf(c);
      gsap.to(c, {
        rotationZ: baseAngles6[originalIndex],
        y: handY,
        opacity: 1,
        scale: handScale,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.1
      });
    });
  };

  // Attach Event Listeners
  const cleanups: (() => void)[] = [];

  cards.forEach((card, i) => {
    const onEnter = () => handleMouseEnter(i);
    const onLeave = () => handleMouseLeave(i);
    const onMove = (e: MouseEvent) => handleMouseMove(e, i);
    const onClick = (e: MouseEvent) => {
      // Don't trigger if clicking close button or nav buttons
      if ((e.target as HTMLElement).closest('.close-btn') || (e.target as HTMLElement).closest('.nav-btns')) return;
      if (isAnimating) return;
      
      // CREATE RIPPLE EFFECT
      const rippleContainer = card.querySelector('.click-ripple-container');
      if (rippleContainer) {
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        // Calculate click position relative to card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gsap.set(ripple, {
          position: 'absolute',
          left: x,
          top: y,
          xPercent: -50,
          yPercent: -50,
          width: 20,
          height: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none'
        });
        rippleContainer.appendChild(ripple);
        
        gsap.to(ripple, {
          scale: 100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        });
      }

      // Advance to the next card sequentially on any click
      const nextIndex = activeIndex === -1 ? 0 : activeIndex + 1;
      if (nextIndex < cards.length) {
        drawCard(nextIndex);
      } else {
        closeCard();
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('click', onClick);

    const closeBtn = card.querySelector('.close-btn');
    if (closeBtn) {
      const onCloseClick = (e: Event) => {
        e.stopPropagation();
        closeCard();
      };
      closeBtn.addEventListener('click', onCloseClick);
      cleanups.push(() => closeBtn.removeEventListener('click', onCloseClick));
    }

    const prevBtn = card.querySelector('.prev-btn');
    if (prevBtn) {
      const onPrevClick = (e: Event) => {
        e.stopPropagation();
        if (isAnimating) return;
        const prevIndex = activeIndex <= 0 ? cards.length - 1 : activeIndex - 1;
        drawCard(prevIndex);
      };
      prevBtn.addEventListener('click', onPrevClick);
      cleanups.push(() => prevBtn.removeEventListener('click', onPrevClick));
    }

    const nextBtn = card.querySelector('.next-btn');
    if (nextBtn) {
      const onNextClick = (e: Event) => {
        e.stopPropagation();
        if (isAnimating) return;
        const nextIndex = activeIndex >= cards.length - 1 ? 0 : activeIndex + 1;
        drawCard(nextIndex);
      };
      nextBtn.addEventListener('click', onNextClick);
      cleanups.push(() => nextBtn.removeEventListener('click', onNextClick));
    }

    cleanups.push(() => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('click', onClick);
    });
  });

  // Entrance animation for the hand itself
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && activeIndex === -1 && !isAnimating) {
      gsap.fromTo(cards, 
        { y: 600, opacity: 0, rotationZ: 0 },
        { 
          y: handY, 
          opacity: 1, 
          rotationZ: (i) => baseAngles6[i],
          duration: 1.2, 
          stagger: 0.1, 
          ease: "expo.out",
          overwrite: "auto"
        }
      );
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(section);

  cleanups.push(() => observer.disconnect());

  return () => cleanups.forEach(c => c());
}
