/* ═══════════════════════════════════════════════════════════════
   WELDI WIN — Premium Interactions & Motion
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  /* ═══════════════════════════════════════════════════════════════
     SMOOTH SCROLL REVEALS
     ═══════════════════════════════════════════════════════════════ */
  
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (reveals.length === 0) return;
    
    const observerOptions = {
      threshold: 0,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal for performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
  }
  
  /* ═══════════════════════════════════════════════════════════════
     CUSTOM CURSOR GLOW (Desktop Only)
     ═══════════════════════════════════════════════════════════════ */
  
  function initCursorGlow() {
    if (isTouchDevice || prefersReducedMotion) return;
    
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    const ease = 0.15;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }
    });
    
    // Smooth follow animation
    function animateGlow() {
      glowX += (mouseX - glowX) * ease;
      glowY += (mouseY - glowY) * ease;
      
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      
      requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
  }
  
  /* ═══════════════════════════════════════════════════════════════
     SHIELD 3D PARALLAX EFFECT
     ═══════════════════════════════════════════════════════════════ */
  
  function initShieldParallax() {
    if (prefersReducedMotion || isTouchDevice) return;
    
    const shield = document.getElementById('shieldCanvas');
    const hero = document.querySelector('.hero');
    
    if (!shield || !hero) return;
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const smoothness = 0.1;
    
    // Track mouse position relative to hero section
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize to -1 to 1 range
      targetX = (e.clientX - centerX) / (rect.width / 2);
      targetY = (e.clientY - centerY) / (rect.height / 2);
    });
    
    hero.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
    
    // Smooth animation loop
    function animate() {
      currentX += (targetX - currentX) * smoothness;
      currentY += (targetY - currentY) * smoothness;
      
      const rotateY = currentX * 12;
      const rotateX = -currentY * 8;
      const translateX = currentX * 8;
      const translateY = currentY * 8;
      
      shield.style.transform = `
        perspective(1200px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        translateX(${translateX}px)
        translateY(${translateY}px)
      `;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  /* ═══════════════════════════════════════════════════════════════
     CANVAS NOISE TEXTURE (Subtle grain effect)
     ═══════════════════════════════════════════════════════════════ */
  
  function initNoiseCanvas() {
    // Skip on very small mobile devices for performance
    if (isSmallMobile) return;
    
    const canvas = document.getElementById('noiseCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Use lower DPR on mobile for better performance
    const effectiveDpr = isMobile ? Math.min(dpr, 1.5) : dpr;
    
    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * effectiveDpr;
      canvas.height = rect.height * effectiveDpr;
      ctx.scale(effectiveDpr, effectiveDpr);
      drawNoise();
    }
    
    function drawNoise() {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const buffer = new Uint32Array(imageData.data.buffer);
      
      // Reduce noise density on mobile
      const threshold = isMobile ? 0.6 : 0.5;
      
      for (let i = 0; i < buffer.length; i++) {
        if (Math.random() > threshold) {
          buffer[i] = 0xff000000; // Black pixel
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    resize();
    
    // Debounce resize on mobile for better performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (isMobile) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
      } else {
        resize();
      }
    });
  }
  
  /* ═══════════════════════════════════════════════════════════════
     SMOOTH ANCHOR SCROLLING
     ═══════════════════════════════════════════════════════════════ */
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /* ═══════════════════════════════════════════════════════════════
     CAPABILITY CARDS — VISUAL INTERACTIONS
     ═══════════════════════════════════════════════════════════════ */
  
  function initCapabilityInteractions() {
    if (isTouchDevice) return;
    
    const capabilities = document.querySelectorAll('.capability');
    
    capabilities.forEach(card => {
      const visual = card.querySelector('.capability-visual');
      if (!visual) return;
      
      card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          visual.style.transform = 'scale(1.05) rotate(-2deg)';
          visual.style.transition = 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        visual.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }
  
  /* ═══════════════════════════════════════════════════════════════
     BUTTON INTERACTION ENHANCEMENTS
     ═══════════════════════════════════════════════════════════════ */
  
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-ghost, .ghost-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion && !this.querySelector('.ripple')) {
          this.style.transform = 'translateY(-2px)';
        }
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
      
      // Ripple effect on click
      btn.addEventListener('click', function(e) {
        if (prefersReducedMotion) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        `;
        
        ripple.className = 'ripple';
        
        // Ensure button has position relative
        if (getComputedStyle(this).position === 'static') {
          this.style.position = 'relative';
        }
        this.style.overflow = 'hidden';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Add ripple animation keyframes
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes rippleEffect {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /* ═══════════════════════════════════════════════════════════════
     PERFORMANCE OPTIMIZATION — LAZY ANIMATION INIT
     ═══════════════════════════════════════════════════════════════ */
  
  function initLazyAnimations() {
    // Only initialize heavy animations when elements are near viewport
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initShieldParallax();
          heroObserver.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    
    const hero = document.querySelector('.hero');
    if (hero) heroObserver.observe(hero);
  }
  
  /* ═══════════════════════════════════════════════════════════════
     MOBILE-SPECIFIC OPTIMIZATIONS
     ═══════════════════════════════════════════════════════════════ */
  
  function initMobileOptimizations() {
    if (!isMobile) return;
    
    // Optimize scroll performance on mobile
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll-based optimizations here if needed
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.capability, .trust-badge, button, a');
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.style.opacity = '0.8';
      }, { passive: true });
      
      el.addEventListener('touchend', function() {
        this.style.opacity = '';
      }, { passive: true });
    });
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
    });
    
    // Prevent zoom on double tap for buttons
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-ghost');
    buttons.forEach(btn => {
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        btn.click();
      });
    });
  }
  
  /* ═══════════════════════════════════════════════════════════════
     VIEWPORT HEIGHT FIX (Mobile Safari)
     ═══════════════════════════════════════════════════════════════ */
  
  function initViewportFix() {
    // Fix for mobile viewport height (especially iOS Safari)
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }
  
  /* ═══════════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════════ */
  
  function init() {
    // Core interactions
    initScrollReveals();
    initSmoothScroll();
    initButtonEffects();
    initViewportFix();
    
    // Mobile-specific
    if (isMobile || isTouchDevice) {
      initMobileOptimizations();
    }
    
    // Progressive enhancement
    if (!prefersReducedMotion) {
      initCursorGlow();
      initNoiseCanvas();
      initCapabilityInteractions();
      initLazyAnimations();
    }
    
    // Log for debugging (remove in production)
    console.log(`🛡️ Weldi Win initialized | Mobile: ${isMobile} | Touch: ${isTouchDevice}`);
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
