import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Page } from '../types';

interface FlowboardingPageProps {
  onNavigate: (page: Page) => void;
}

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Easing function for smoother animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
};

// Scroll progress hook
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(scrolled / scrollHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

// Intersection observer hook for animations
const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Animated gradient mesh background
const GradientMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.005;

      // Create gradient
      const gradient = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.sin(time) * 0.2),
        canvas.height * (0.3 + Math.cos(time * 0.7) * 0.2),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Second gradient orb
      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.cos(time * 0.8) * 0.2),
        canvas.height * (0.6 + Math.sin(time * 0.6) * 0.2),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.6
      );

      gradient2.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
      gradient2.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
      gradient2.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Third smaller orb
      const gradient3 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time * 1.2) * 0.3),
        canvas.height * (0.4 + Math.cos(time * 0.9) * 0.3),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.4
      );

      gradient3.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
      gradient3.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
};

// Animated SVG Icons (Lottie-style)
const AnimatedChatIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <rect x="8" y="12" width="48" height="36" rx="8" fill="url(#chatGrad)" opacity="0.2" />
    <rect x="8" y="12" width="48" height="36" rx="8" fill="none" stroke="url(#chatGrad)" strokeWidth="2">
      <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="1.5s" fill="freeze" />
    </rect>
    <circle cx="24" cy="30" r="3" fill="#3b82f6">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0s" />
    </circle>
    <circle cx="32" cy="30" r="3" fill="#06b6d4">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
    </circle>
    <circle cx="40" cy="30" r="3" fill="#14b8a6">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.4s" />
    </circle>
    <path d="M16 48 L16 56 L28 48" fill="url(#chatGrad)" opacity="0.6">
      <animate attributeName="opacity" values="0;0.6" dur="0.8s" fill="freeze" begin="0.5s" />
    </path>
  </svg>
);

const AnimatedClipboardIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="clipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="52" rx="4" fill="url(#clipGrad)" opacity="0.2" />
    <rect x="12" y="8" width="40" height="52" rx="4" fill="none" stroke="url(#clipGrad)" strokeWidth="2" />
    <rect x="22" y="4" width="20" height="10" rx="2" fill="url(#clipGrad)" />
    <line x1="20" y1="26" x2="44" y2="26" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.5s" fill="freeze" begin="0.3s" />
    </line>
    <line x1="20" y1="36" x2="38" y2="36" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="stroke-dasharray" from="0,24" to="24,0" dur="0.5s" fill="freeze" begin="0.5s" />
    </line>
    <line x1="20" y1="46" x2="32" y2="46" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="stroke-dasharray" from="0,18" to="18,0" dur="0.5s" fill="freeze" begin="0.7s" />
    </line>
  </svg>
);

const AnimatedTeamIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Center person */}
    <g>
      <circle cx="32" cy="20" r="8" fill="url(#teamGrad)">
        <animate attributeName="r" values="0;8" dur="0.4s" fill="freeze" />
      </circle>
      <path d="M20 44 Q20 32 32 32 Q44 32 44 44" fill="url(#teamGrad)" opacity="0.8">
        <animate attributeName="opacity" values="0;0.8" dur="0.4s" fill="freeze" begin="0.2s" />
      </path>
    </g>
    {/* Left person */}
    <g opacity="0.7">
      <circle cx="14" cy="28" r="6" fill="#8b5cf6">
        <animate attributeName="r" values="0;6" dur="0.4s" fill="freeze" begin="0.3s" />
      </circle>
      <path d="M6 48 Q6 38 14 38 Q22 38 22 48" fill="#8b5cf6" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6" dur="0.4s" fill="freeze" begin="0.5s" />
      </path>
    </g>
    {/* Right person */}
    <g opacity="0.7">
      <circle cx="50" cy="28" r="6" fill="#3b82f6">
        <animate attributeName="r" values="0;6" dur="0.4s" fill="freeze" begin="0.4s" />
      </circle>
      <path d="M42 48 Q42 38 50 38 Q58 38 58 48" fill="#3b82f6" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6" dur="0.4s" fill="freeze" begin="0.6s" />
      </path>
    </g>
    {/* Connection lines */}
    <line x1="22" y1="26" x2="26" y2="24" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5">
      <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" />
    </line>
    <line x1="42" y1="26" x2="38" y2="24" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5">
      <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
    </line>
  </svg>
);

const AnimatedPlanIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="planGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    {/* Kanban columns */}
    <rect x="6" y="12" width="16" height="44" rx="3" fill="url(#planGrad)" opacity="0.15" />
    <rect x="24" y="12" width="16" height="44" rx="3" fill="url(#planGrad)" opacity="0.15" />
    <rect x="42" y="12" width="16" height="44" rx="3" fill="url(#planGrad)" opacity="0.15" />
    {/* Cards */}
    <rect x="8" y="16" width="12" height="8" rx="2" fill="#3b82f6">
      <animate attributeName="y" values="16;16" dur="2s" />
    </rect>
    <rect x="8" y="28" width="12" height="8" rx="2" fill="#3b82f6" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.7" dur="2s" />
    </rect>
    <rect x="26" y="16" width="12" height="8" rx="2" fill="#06b6d4">
      <animate attributeName="y" values="40;16" dur="1s" fill="freeze" begin="0.5s" />
    </rect>
    <rect x="44" y="16" width="12" height="8" rx="2" fill="#14b8a6">
      <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" begin="1s" />
    </rect>
    {/* Progress arrow */}
    <path d="M20 50 L32 50 L28 46 M32 50 L28 54" stroke="url(#planGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const AnimatedApprovalIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="approveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" fill="url(#approveGrad)" opacity="0.15" />
    <circle cx="32" cy="32" r="26" fill="none" stroke="url(#approveGrad)" strokeWidth="3">
      <animate attributeName="stroke-dasharray" from="0,170" to="170,0" dur="1s" fill="freeze" />
    </circle>
    <path d="M20 32 L28 40 L44 24" fill="none" stroke="url(#approveGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.5s" fill="freeze" begin="0.8s" />
    </path>
    {/* Sparkles */}
    <circle cx="50" cy="16" r="2" fill="#14b8a6">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1.2s" />
      <animate attributeName="r" values="0;2;0" dur="1.5s" repeatCount="indefinite" begin="1.2s" />
    </circle>
    <circle cx="54" cy="24" r="1.5" fill="#10b981">
      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1.4s" />
    </circle>
  </svg>
);

const AnimatedContractIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="contractGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <path d="M16 8 L48 8 L48 56 L16 56 Z" fill="url(#contractGrad)" opacity="0.15" />
    <path d="M16 8 L48 8 L48 56 L16 56 Z" fill="none" stroke="url(#contractGrad)" strokeWidth="2">
      <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="1s" fill="freeze" />
    </path>
    {/* Text lines */}
    <line x1="22" y1="20" x2="42" y2="20" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" />
    <line x1="22" y1="28" x2="38" y2="28" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" />
    <line x1="22" y1="36" x2="40" y2="36" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" />
    {/* Signature */}
    <path d="M24 46 Q28 42 32 46 Q36 50 40 46" fill="none" stroke="url(#contractGrad)" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.8s" fill="freeze" begin="0.8s" />
    </path>
    {/* Pen */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="10,10;0,0" dur="0.8s" fill="freeze" begin="0.3s" />
      <line x1="44" y1="42" x2="50" y2="36" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0;1" dur="0.3s" fill="freeze" begin="0.3s" />
      </line>
    </g>
  </svg>
);

const AnimatedCodeIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect x="8" y="12" width="48" height="40" rx="4" fill="url(#codeGrad)" opacity="0.15" />
    <rect x="8" y="12" width="48" height="40" rx="4" fill="none" stroke="url(#codeGrad)" strokeWidth="2" />
    {/* Terminal dots */}
    <circle cx="16" cy="20" r="2" fill="#ef4444" />
    <circle cx="24" cy="20" r="2" fill="#eab308" />
    <circle cx="32" cy="20" r="2" fill="#22c55e" />
    {/* Code lines with typing animation */}
    <line x1="14" y1="32" x2="28" y2="32" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="x2" values="14;28" dur="0.5s" fill="freeze" begin="0.3s" />
    </line>
    <line x1="18" y1="40" x2="40" y2="40" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="x2" values="18;40" dur="0.6s" fill="freeze" begin="0.6s" />
    </line>
    <line x1="14" y1="48" x2="32" y2="48" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="x2" values="14;32" dur="0.5s" fill="freeze" begin="0.9s" />
    </line>
    {/* Cursor blink */}
    <rect x="34" y="46" width="2" height="6" fill="#3b82f6">
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" begin="1.2s" />
    </rect>
  </svg>
);

const AnimatedRocketIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#fef3c7" />
      </linearGradient>
    </defs>
    {/* Rocket body */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,10;0,0" dur="0.8s" fill="freeze" />
      <path d="M32 8 Q44 20 44 36 L40 44 L24 44 L20 36 Q20 20 32 8" fill="url(#rocketGrad)">
        <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" />
      </path>
      {/* Window */}
      <circle cx="32" cy="26" r="6" fill="#fff" opacity="0.9" />
      <circle cx="32" cy="26" r="4" fill="#0ea5e9" />
      {/* Fins */}
      <path d="M20 36 L12 44 L20 44" fill="#3b82f6" />
      <path d="M44 36 L52 44 L44 44" fill="#3b82f6" />
    </g>
    {/* Flame */}
    <g>
      <path d="M28 44 L32 58 L36 44" fill="url(#flameGrad)">
        <animate attributeName="d" values="M28 44 L32 52 L36 44;M28 44 L32 60 L36 44;M28 44 L32 52 L36 44" dur="0.3s" repeatCount="indefinite" />
      </path>
      <path d="M30 44 L32 52 L34 44" fill="#fef3c7">
        <animate attributeName="d" values="M30 44 L32 50 L34 44;M30 44 L32 54 L34 44;M30 44 L32 50 L34 44" dur="0.2s" repeatCount="indefinite" />
      </path>
    </g>
    {/* Stars */}
    <circle cx="12" cy="16" r="1.5" fill="#3b82f6">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="52" cy="20" r="1" fill="#14b8a6">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
    </circle>
    <circle cx="8" cy="32" r="1" fill="#8b5cf6">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
    </circle>
  </svg>
);

// Floating 3D-like cards
const FloatingCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / 50;
      const y = (e.clientY - centerY) / 50;
      setTransform({ x: x * -1, y: y * -1 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${transform.y}deg) rotateY(${transform.x}deg) translateZ(20px)`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// Professional straight timeline with glow effects
const TimelinePath: React.FC<{ stepCount: number }> = ({ stepCount }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate progress from when element enters view to when it leaves
      const start = windowHeight;
      const end = -elementHeight;
      const current = elementTop;
      const progress = Math.max(0, Math.min(1, (start - current) / (start - end)));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none" style={{ height: '100%' }}>
      {/* Main timeline container */}
      <div className="relative h-full flex flex-col items-center">
        {/* Background line - subtle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1 rounded-full"
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(20, 184, 166, 0.1) 100%)',
          }}
        />

        {/* Glowing progress line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1 rounded-full transition-all duration-300 ease-out"
          style={{
            height: `${scrollProgress * 100}%`,
            background: 'linear-gradient(180deg, #3b82f6 0%, #06b6d4 50%, #14b8a6 100%)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(20, 184, 166, 0.3)',
          }}
        />

        {/* Animated energy particles flowing down */}
        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(6, 182, 212, 0.8) 50%, transparent 70%)',
                boxShadow: '0 0 10px #06b6d4, 0 0 20px #3b82f6',
                animation: `flowDown 3s ease-in-out infinite`,
                animationDelay: `${i * 1}s`,
                opacity: scrollProgress > 0.05 ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* Pulsing glow at the progress point */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-300"
          style={{
            top: `calc(${scrollProgress * 100}% - 8px)`,
            background: 'radial-gradient(circle, #fff 0%, #06b6d4 50%, transparent 70%)',
            boxShadow: '0 0 15px #06b6d4, 0 0 30px #3b82f6, 0 0 45px #14b8a6',
            animation: 'pulseGlow 2s ease-in-out infinite',
            opacity: scrollProgress > 0.02 ? 1 : 0,
          }}
        />
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes flowDown {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-50%) scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Timeline step component with alternating left/right design
const TimelineStep: React.FC<{
  step: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  isLast?: boolean;
  align: 'left' | 'right';
}> = ({ step, title, description, details, icon, align }) => {
  const { ref, isInView } = useInView(0.2);

  // Animation: slide in from the side the card is on
  const slideDirection = align === 'left' ? '-translate-x-12' : 'translate-x-12';

  return (
    <div ref={ref} className={`relative flex items-center gap-6 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Content - Glass card with slide animation */}
      <div
        className={`flex-1 ${align === 'right' ? 'text-right' : 'text-left'} transition-all duration-700 ease-out ${
          isInView ? 'opacity-100 translate-x-0' : `opacity-0 ${slideDirection}`
        }`}
      >
        {/* Glass morphism card */}
        <div
          className={`${align === 'right' ? 'ml-auto' : 'mr-auto'} max-w-lg relative overflow-hidden group rounded-2xl`}
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="p-6">
            {/* Gradient shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className={`flex items-center gap-4 mb-4 relative z-10 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-16 h-16 relative flex-shrink-0 transition-all duration-500 ${
                  isInView ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                }`}
                style={{ transitionDelay: '0.2s' }}
              >
                {icon}
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-100/80 text-blue-700 mb-1">
                  Steg {step}
                </span>
                <h3 className="text-xl font-serif text-slate-900">{title}</h3>
              </div>
            </div>

            <p className="text-slate-600 mb-4 leading-relaxed text-sm relative z-10">{description}</p>

            <ul className={`space-y-2 relative z-10 ${align === 'right' ? 'text-right' : 'text-left'}`}>
              {details.map((detail, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 text-sm text-slate-500 transition-all duration-500 ${
                    align === 'right' ? 'flex-row-reverse' : ''
                  } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
                >
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Center dot with glow - connects to the S-curve */}
      <div className="relative flex flex-col items-center z-20 flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-base transition-all duration-500 ${
            isInView ? 'scale-100' : 'scale-0'
          }`}
          style={{
            boxShadow: isInView
              ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
              : 'none',
            transitionDelay: '0.1s',
          }}
        >
          {step}
        </div>
      </div>

      {/* Empty space for alignment */}
      <div className="flex-1" />
    </div>
  );
};

// Feature card with 3D effect
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <FloatingCard className="h-full">
        <div className="bg-white rounded-2xl p-8 h-full border border-slate-100 hover:border-blue-200 transition-all duration-300 group relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <h3 className="text-xl font-serif text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
};

// Stats component
const StatCard: React.FC<{
  value: number;
  suffix: string;
  label: string;
  delay: number;
}> = ({ value, suffix, label, delay }) => {
  const { count, ref } = useCountUp(value, 2000);
  const { ref: viewRef, isInView } = useInView(0.3);

  return (
    <div
      ref={viewRef}
      className={`text-center transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div ref={ref} className="relative inline-block">
        <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          {count}
        </span>
        <span className="text-3xl md:text-4xl font-bold text-white/80">{suffix}</span>
      </div>
      <p className="text-slate-400 mt-2 text-lg">{label}</p>
    </div>
  );
};

const FlowboardingPage: React.FC<FlowboardingPageProps> = ({ onNavigate }) => {
  const scrollProgress = useScrollProgress();
  const { ref: heroRef, isInView: heroInView } = useInView(0.1);

  const timelineSteps = useMemo(() => [
    {
      title: 'Första kontakten',
      description: 'Vi börjar med ett enkelt samtal för att förstå dina behov och visioner. Inga komplicerade processer - bara ett personligt möte.',
      details: ['Kostnadsfritt samtal', 'Lyssnar på dina utmaningar', 'Snabb projektbedömning'],
      icon: <AnimatedChatIcon />,
    },
    {
      title: 'Behovsanalys',
      description: 'Du får ett skräddarsytt formulär som hjälper oss förstå ditt projekt på djupet. Svara i din egen takt.',
      details: ['Strukturerade frågor', 'Ingen teknikkunskap krävs', 'Spara & fortsätt när du vill'],
      icon: <AnimatedClipboardIcon />,
    },
    {
      title: 'Ditt team formas',
      description: 'Baserat på dina behov sätter vi ihop det perfekta teamet. Du får veta exakt vilka som kommer arbeta med ditt projekt.',
      details: ['Handplockade experter', 'Presentation av teamet', 'Direktkontakt med alla'],
      icon: <AnimatedTeamIcon />,
    },
    {
      title: 'Projektplanering',
      description: 'Teamet skapar en detaljerad plan med tydliga faser, milstolpar och tidsestimat. Du ser exakt vad som ska levereras.',
      details: ['Visuell projektplan', 'Tydliga milstolpar', 'Transparent tidsplan'],
      icon: <AnimatedPlanIcon />,
    },
    {
      title: 'Din godkännande',
      description: 'Du granskar planen i lugn och ro. Ställ frågor, föreslå ändringar - vi justerar tills du är helt nöjd.',
      details: ['Interaktiv planvisning', 'Kommentera direkt', 'Obegränsade revideringar'],
      icon: <AnimatedApprovalIcon />,
    },
    {
      title: 'Avtal & start',
      description: 'Digital signering gör det enkelt. Så fort avtalet är påskrivet kan arbetet börja - ofta samma dag.',
      details: ['Digital signering', 'Tydliga villkor', 'Snabb projektstart'],
      icon: <AnimatedContractIcon />,
    },
    {
      title: 'Utveckling',
      description: 'Nu händer det! Följ arbetet i realtid via din portal. Se framsteg, ge feedback och var delaktig.',
      details: ['Realtidsuppdateringar', 'Regelbundna avstämningar', 'Direkt kommunikation'],
      icon: <AnimatedCodeIcon />,
    },
    {
      title: 'Lansering',
      description: 'Den stora dagen! Vi hjälper dig lansera och ser till att allt fungerar perfekt.',
      details: ['Kontrollerad lansering', 'Dokumentation & utbildning', 'Överlämning'],
      icon: <AnimatedRocketIcon />,
    },
  ], []);

  const features = useMemo(() => [
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
      title: 'Full transparens',
      description: 'Se exakt vad som händer, när det händer. Inga överraskningar, inga dolda kostnader.',
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: '24/7 Portal',
      description: 'Tillgång till din projektportal dygnet runt. Granska, kommentera och följ upp när det passar dig.',
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
      title: 'Direktkontakt',
      description: 'Prata direkt med utvecklarna som bygger ditt projekt. Inga mellanhänder.',
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      title: 'Milstolpe-leverans',
      description: 'Betala i etapper efter godkända milstolpar. Du ser resultat innan du betalar.',
    },
  ], []);

  return (
    <div className="relative overflow-hidden">
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated gradient mesh background */}
        <GradientMesh />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-particle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + i}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Vår Onboarding Process</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1]">
              Från idé till{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                verklighet
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Upptäck hur vi förvandlar din vision till ett fungerande digitalt system.
              <span className="text-white font-medium"> Transparent, strukturerat </span>
              och alltid med dig i fokus.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              <StatCard value={14} suffix=" dagar" label="Till projektstart" delay={0.2} />
              <StatCard value={100} suffix="%" label="Transparens" delay={0.4} />
              <StatCard value={24} suffix="/7" label="Portaltillgång" delay={0.6} />
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge">Fördelarna</span>
            <h2 className="section-title">Varför välja Flowboarding?</h2>
            <p className="section-subtitle">
              En process designad för att ge dig kontroll, insyn och trygghet genom hela projektet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge">Steg för steg</span>
            <h2 className="section-title">Din resa med oss</h2>
            <p className="section-subtitle">
              Från första kontakt till lansering - så här ser processen ut.
            </p>
          </div>

          <div className="relative">
            {/* S-Curve flowing path */}
            <TimelinePath stepCount={timelineSteps.length} />

            <div className="space-y-12 relative z-10">
              {timelineSteps.map((step, index) => (
                <TimelineStep
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  details={step.details}
                  icon={step.icon}
                  isLast={index === timelineSteps.length - 1}
                  align={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Preview */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-badge">Din portal</span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
                Allt samlat på ett ställe
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Via din personliga portal har du full kontroll över projektet.
                Se framsteg, kommunicera med teamet, granska leveranser och hantera
                dokument - allt tillgängligt dygnet runt.
              </p>

              <div className="space-y-4">
                {[
                  { icon: '📊', text: 'Realtidsuppdateringar om projektets status' },
                  { icon: '💬', text: 'Direkt kommunikation med ditt team' },
                  { icon: '📁', text: 'Alla dokument och leveranser samlade' },
                  { icon: '✅', text: 'Enkel godkännandeprocess för milstolpar' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portal mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
              <FloatingCard>
                <div className="relative bg-slate-900 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="flex-1 text-center text-sm text-slate-500">portal.siteflow.se</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold">Mitt projekt</div>
                      <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs">Pågående</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Projektprogress</span>
                        <span>75%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      {[
                        { status: 'done', text: 'Design godkänd' },
                        { status: 'done', text: 'Frontend utveckling' },
                        { status: 'current', text: 'Backend implementation' },
                        { status: 'pending', text: 'Testning & QA' },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            task.status === 'done' ? 'bg-teal-500' :
                            task.status === 'current' ? 'bg-blue-500 animate-pulse' :
                            'bg-slate-700'
                          }`}>
                            {task.status === 'done' && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={task.status === 'pending' ? 'text-slate-500' : 'text-slate-300'}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <GradientMesh />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            Redo att börja din resa?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Låt oss prata om ditt projekt. Första samtalet är alltid kostnadsfritt
            och utan förpliktelser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 rounded-full text-slate-900 font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Starta dialog
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onNavigate('caseStudies')}
              className="px-8 py-4 rounded-full text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              Se våra kundcase
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlowboardingPage;
