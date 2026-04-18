"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const PerfumeBottle3D = dynamic(() => import("./PerfumeBottle3D"), {
  ssr: false,
});

// Deterministic petals to avoid hydration mismatch
const PETALS = [
  { id: 0, x: 5, delay: 0, duration: 8, size: 12, sway: 45 },
  { id: 1, x: 12, delay: 1.5, duration: 10, size: 16, sway: 55 },
  { id: 2, x: 20, delay: 3, duration: 7, size: 10, sway: 35 },
  { id: 3, x: 28, delay: 0.5, duration: 9, size: 18, sway: 70 },
  { id: 4, x: 35, delay: 4, duration: 11, size: 14, sway: 40 },
  { id: 5, x: 42, delay: 2, duration: 8, size: 20, sway: 60 },
  { id: 6, x: 50, delay: 5.5, duration: 7, size: 11, sway: 50 },
  { id: 7, x: 58, delay: 1, duration: 10, size: 15, sway: 65 },
  { id: 8, x: 65, delay: 3.5, duration: 9, size: 13, sway: 38 },
  { id: 9, x: 72, delay: 6, duration: 12, size: 17, sway: 55 },
  { id: 10, x: 78, delay: 0.8, duration: 8, size: 10, sway: 42 },
  { id: 11, x: 85, delay: 2.5, duration: 11, size: 19, sway: 75 },
  { id: 12, x: 90, delay: 4.5, duration: 7, size: 12, sway: 48 },
  { id: 13, x: 95, delay: 7, duration: 9, size: 16, sway: 58 },
  { id: 14, x: 8, delay: 5, duration: 10, size: 14, sway: 52 },
  { id: 15, x: 32, delay: 1.8, duration: 8, size: 11, sway: 36 },
  { id: 16, x: 48, delay: 6.5, duration: 11, size: 18, sway: 68 },
  { id: 17, x: 62, delay: 3.2, duration: 9, size: 13, sway: 44 },
  { id: 18, x: 75, delay: 0.3, duration: 7, size: 15, sway: 62 },
  { id: 19, x: 88, delay: 4.8, duration: 10, size: 10, sway: 50 },
];

export default function HomeHero() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [vh, setVh] = useState(800);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
    setVh(window.innerHeight);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll progress 0..1 over one viewport
  const scrollProgress = Math.min(scrollY / vh, 1);

  // 3D bottle fades out as you scroll
  const bottleOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  // Photo fades in as you scroll
  const photoOpacity = Math.min(1, scrollProgress * 1.5);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500" />

      {/* Background photo — fades IN on scroll, zooms */}
      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-300"
        style={{
          opacity: photoOpacity,
          transform: `scale(${1 + scrollY * 0.0008})`,
          transformOrigin: "center center",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=2000&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Color wash overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 via-rose-400/20 to-fuchsia-600/40" />

      {/* Mesh gradient blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-400"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-pink-300"
          style={{
            top: "40%",
            right: "5%",
            transform: `translate(${-scrollY * 0.03}px, ${scrollY * 0.04}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] bg-rose-200"
          style={{
            bottom: "10%",
            left: "30%",
            transform: `translate(${scrollY * 0.02}px, ${-scrollY * 0.03}px)`,
          }}
        />
      </div>

      {/* 3D Perfume Bottle — fades OUT on scroll */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: bottleOpacity }}
      >
        <PerfumeBottle3D scrollProgress={scrollProgress} />
      </div>

      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PETALS.map((petal) => (
          <div
            key={petal.id}
            className="absolute animate-petal-fall"
            style={{
              left: `${petal.x}%`,
              top: `-${petal.size}px`,
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
              ["--sway" as string]: `${petal.sway}px`,
            }}
          >
            <div
              className="w-full h-full rounded-[50%_50%_50%_0] bg-pink-200/60 animate-petal-spin"
              style={{ animationDuration: `${2 + (petal.id % 5)}s` }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pointer-events-none">
        <h1
          className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
        >
          Parfum Shop
        </h1>
        <p
          className={`text-xl md:text-2xl text-white/90 mb-10 max-w-xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
        >
          Тестери, ручки-спреї та масла абсолю
          <br />
          від найкращих брендів світу
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 pointer-events-auto ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/catalog"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Переглянути каталог</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/catalog?q="
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Пошук парфумів
          </Link>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">1500+</p>
            <p className="text-white/70 text-sm mt-1">парфумів</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">7</p>
            <p className="text-white/70 text-sm mt-1">категорій</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
            <p className="text-white/70 text-sm mt-1">клієнтів</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
