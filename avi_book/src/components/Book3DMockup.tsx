import React, { useState, useRef } from 'react';
import { Book } from '../types';

interface Book3DMockupProps {
  book: Book;
  interactive?: boolean;
}

export function Book3DMockup({ book, interactive = true }: Book3DMockupProps) {
  // 3D rotation state
  const [rotateX, setRotateX] = useState(10);
  const [rotateY, setRotateY] = useState(-25);
  const [isHovered, setIsHovered] = useState(false);
  const [viewAngle, setViewAngle] = useState<'perspective' | 'front' | 'side' | 'isometric'>('perspective');
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move handler for natural tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    // Normalized coordinates from -1 to 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Angle dampening
    if (viewAngle === 'perspective') {
      setRotateY(-25 + normX * 22);
      setRotateX(10 - normY * 18);
    } else if (viewAngle === 'isometric') {
      setRotateY(-38 + normX * 15);
      setRotateX(25 - normY * 15);
    } else if (viewAngle === 'front') {
      setRotateY(normX * 12);
      setRotateX(-normY * 10);
    } else if (viewAngle === 'side') {
      setRotateY(-70 + normX * 15);
      setRotateX(8 - normY * 10);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to preset angles
    if (viewAngle === 'perspective') {
      setRotateX(10);
      setRotateY(-25);
    } else if (viewAngle === 'isometric') {
      setRotateX(25);
      setRotateY(-38);
    } else if (viewAngle === 'front') {
      setRotateX(0);
      setRotateY(0);
    } else if (viewAngle === 'side') {
      setRotateX(5);
      setRotateY(-75);
    }
  };

  const handlePresetChange = (preset: 'perspective' | 'front' | 'side' | 'isometric') => {
    setViewAngle(preset);
    if (preset === 'perspective') {
      setRotateX(10);
      setRotateY(-25);
    } else if (preset === 'isometric') {
      setRotateX(25);
      setRotateY(-38);
    } else if (preset === 'front') {
      setRotateX(0);
      setRotateY(0);
    } else if (preset === 'side') {
      setRotateX(5);
      setRotateY(-75);
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* 3D Viewport Stage */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1300px',
        }}
      >
        {/* Subtle Ambient Radial Glow matching book color */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-all duration-700 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${book.accentColor}33 0%, ${book.color}22 50%, transparent 80%)`,
          }}
        />

        {/* 3D Book Assembly (Transforms with mouse tilt) */}
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            width: '260px',
            height: '370px',
          }}
        >
          {/* Cast Drop Shadow on Floor Plane */}
          <div
            className="absolute -bottom-10 left-[-30px] w-[320px] h-[55px] rounded-full blur-xl pointer-events-none transition-opacity duration-300"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(15,23,42,0.3) 50%, transparent 75%)',
              transform: `rotateX(90deg) translateZ(-40px) scale(${isHovered ? 1.05 : 0.95})`,
            }}
          />

          {/* FRONT COVER */}
          <div
            className="absolute inset-0 rounded-r-xl rounded-l-xs overflow-hidden border-y border-r border-white/20 shadow-2xl flex flex-col justify-between p-5 text-white"
            style={{
              background: book.coverImage
                ? `linear-gradient(rgba(15,23,42,0.4), rgba(15,23,42,0.8)), url(${book.coverImage}) center/cover no-repeat`
                : book.id === 1
                ? 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 55%, #e2e8f0 100%)'
                : book.id === 2
                ? 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)'
                : `linear-gradient(135deg, ${book.color} 0%, #030712 100%)`,
              transform: 'translateZ(20px)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* If custom cover image is set, render full image directly */}
            {book.coverImage ? (
              <>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-top z-10 bg-white"
                />
                {/* Book spine left gradient shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-white/40 pointer-events-none z-20" />
                {/* Subtle lighting sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
              </>
            ) : book.id === 1 ? (
              /* REAL COVER 1: Think Like a Linux Storage Engineer */
              <div className="relative z-10 flex flex-col justify-between h-full text-slate-900 select-none">
                {/* Header title */}
                <div className="text-center pt-1">
                  <div className="text-xs font-black tracking-widest text-slate-800 uppercase font-sans">
                    THINK LIKE A
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mt-1">
                    LINUX
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight leading-none mt-0.5">
                    STORAGE
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                    ENGINEER
                  </div>

                  <p className="text-[8.5px] font-bold text-slate-700 mt-2 leading-tight px-1">
                    From Linux I/O Internals to Filesystems, blk-mq, RAID, NVMe and Storage Debugging
                  </p>

                  <div className="mt-1.5 inline-block bg-slate-900 text-white text-[7.5px] font-medium italic px-2 py-0.5 rounded-full">
                    “Learn not just how Linux storage works, but why it is designed that way.”
                  </div>
                </div>

                {/* 4 Storage Pillars from real cover */}
                <div className="grid grid-cols-4 gap-1 text-[6.5px] font-mono font-bold text-slate-800 text-center my-1 bg-white/70 p-1.5 rounded border border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-slate-800 text-white flex items-center justify-center text-[7px] mb-0.5">💾</span>
                    <span className="leading-tight">Physical Devices</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-blue-700 text-white flex items-center justify-center text-[7px] mb-0.5">VFS</span>
                    <span className="leading-tight">Kernel Data Path</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-red-700 text-white flex items-center justify-center text-[7px] mb-0.5">MQ</span>
                    <span className="leading-tight">blk-mq Queues</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-purple-700 text-white flex items-center justify-center text-[7px] mb-0.5">ANA</span>
                    <span className="leading-tight">Multipath Fabrics</span>
                  </div>
                </div>

                {/* Tux Penguin with NVMe SSD Graphic */}
                <div className="relative h-20 flex items-center justify-center overflow-hidden rounded bg-gradient-to-b from-sky-100 to-slate-200 border border-slate-300">
                  {/* Tux with NVMe SSD */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-12 bg-slate-900 rounded-full flex flex-col items-center justify-center relative shadow">
                      <div className="w-6 h-7 bg-white rounded-full flex flex-col items-center justify-center mt-1">
                        <div className="flex gap-1.5 mt-1">
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                        </div>
                        <div className="w-2.5 h-1.5 bg-amber-400 rounded-full mt-0.5" />
                      </div>
                      <div className="absolute -bottom-1 flex gap-2">
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border-2 border-red-600 rounded p-1.5 shadow-md flex flex-col justify-center">
                      <div className="text-[7.5px] font-mono font-bold text-sky-400 flex items-center gap-1">
                        <span>NVMe SSD</span>
                        <span className="text-[6px] text-red-400">M.2</span>
                      </div>
                      <div className="text-[6px] font-mono text-slate-400">PCIe 4.0 x4 • blk-mq</div>
                    </div>
                  </div>
                </div>

                {/* Author Banner */}
                <div className="bg-slate-950 text-white py-1.5 px-3 rounded text-center tracking-widest font-black text-xs uppercase font-sans shadow-md border-t-2 border-red-600">
                  AVINASH PAL
                </div>
              </div>
            ) : book.id === 2 ? (
              /* REAL COVER 2: Think Like a Linux Kernel Developer */
              <div className="relative z-10 flex flex-col justify-between h-full text-slate-900 select-none">
                {/* Header title */}
                <div className="text-center pt-1">
                  <div className="text-xs font-black tracking-widest text-slate-800 uppercase font-sans">
                    THINK LIKE A
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mt-1">
                    LINUX
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                    KERNEL
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-red-700 tracking-tight leading-none mt-0.5">
                    DEVELOPER
                  </div>

                  <p className="text-[9px] font-bold text-slate-700 mt-2 leading-tight px-2">
                    Mastering C Through Real Linux Kernel Design Patterns
                  </p>

                  <div className="mt-1.5 inline-block bg-slate-900 text-white text-[7.5px] font-medium italic px-2 py-0.5 rounded-full">
                    “Learn not just how Linux kernel code works, but why it is designed that way.”
                  </div>
                </div>

                {/* 4 Kernel Pillars from real cover */}
                <div className="grid grid-cols-4 gap-1 text-[6.5px] font-mono font-bold text-slate-800 text-center my-1 bg-white/70 p-1.5 rounded border border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-amber-700 text-white flex items-center justify-center text-[7px] mb-0.5">☕</span>
                    <span className="leading-tight">Real-World Analogies</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-blue-700 text-white flex items-center justify-center text-[7px] mb-0.5">{'</>'}</span>
                    <span className="leading-tight">C Concepts Made Simple</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-purple-700 text-white flex items-center justify-center text-[7px] mb-0.5">⚙️</span>
                    <span className="leading-tight">Kernel Design Patterns</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-700 text-white flex items-center justify-center text-[7px] mb-0.5">{'>_'}</span>
                    <span className="leading-tight">Driver Walkthrough</span>
                  </div>
                </div>

                {/* Tux Penguin on Mountain Highway Graphic */}
                <div className="relative h-20 flex items-center justify-center overflow-hidden rounded bg-gradient-to-b from-sky-100 via-slate-100 to-slate-200 border border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-13 bg-slate-900 rounded-full flex flex-col items-center justify-center relative shadow">
                      <div className="w-7 h-8 bg-white rounded-full flex flex-col items-center justify-center mt-1">
                        <div className="flex gap-2 mt-1">
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                        </div>
                        <div className="w-3 h-1.5 bg-amber-400 rounded-full mt-0.5" />
                      </div>
                      <div className="absolute -bottom-1 flex gap-2.5">
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-sky-400/50 rounded p-1.5 shadow-md flex flex-col justify-center">
                      <div className="text-[8px] font-mono font-bold text-sky-300">container_of()</div>
                      <div className="text-[6.5px] font-mono text-emerald-400">struct list_head</div>
                      <div className="text-[6.5px] font-mono text-amber-300">struct file_operations</div>
                    </div>
                  </div>
                </div>

                {/* Author Banner */}
                <div className="bg-slate-950 text-white py-1.5 px-3 rounded text-center tracking-widest font-black text-xs uppercase font-sans shadow-md border-t-2 border-red-600">
                  AVINASH PAL
                </div>
              </div>
            ) : book.id === 3 ? (
              /* REAL COVER 3: Think Like a Linux Network Engineer */
              <div className="relative z-10 flex flex-col justify-between h-full text-slate-900 select-none">
                {/* Header title */}
                <div className="text-center pt-1">
                  <div className="text-xs font-black tracking-widest text-slate-800 uppercase font-sans">
                    THINK LIKE A
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mt-1">
                    LINUX
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight leading-none mt-0.5">
                    NETWORK
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                    ENGINEER
                  </div>

                  <p className="text-[8.5px] font-bold text-slate-700 mt-2 leading-tight px-1">
                    The Linux Network Stack: sk_buff, TCP/IP, Netfilter, eBPF &amp; High-Speed Drivers
                  </p>

                  <div className="mt-1.5 inline-block bg-slate-900 text-white text-[7.5px] font-medium italic px-2 py-0.5 rounded-full">
                    “Learn not just how Linux networking works, but why it is designed that way.”
                  </div>
                </div>

                {/* 4 Network Pillars */}
                <div className="grid grid-cols-4 gap-1 text-[6.5px] font-mono font-bold text-slate-800 text-center my-1 bg-white/70 p-1.5 rounded border border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-700 text-white flex items-center justify-center text-[7px] mb-0.5">🌐</span>
                    <span className="leading-tight">Wire to Sockets</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-blue-700 text-white flex items-center justify-center text-[7px] mb-0.5">skb</span>
                    <span className="leading-tight">sk_buff Anatomy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-purple-700 text-white flex items-center justify-center text-[7px] mb-0.5">XDP</span>
                    <span className="leading-tight">eBPF &amp; XDP</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3.5 h-3.5 rounded bg-red-700 text-white flex items-center justify-center text-[7px] mb-0.5">⚡</span>
                    <span className="leading-tight">100GbE Tuning</span>
                  </div>
                </div>

                {/* Center graphic with Tux and sk_buff */}
                <div className="relative h-20 flex items-center justify-center overflow-hidden rounded bg-gradient-to-b from-emerald-100 to-slate-200 border border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-slate-900 rounded-full flex flex-col items-center justify-center relative shadow">
                      <div className="w-6 h-7 bg-white rounded-full flex flex-col items-center justify-center mt-1">
                        <div className="flex gap-1.5 mt-1">
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                          <span className="w-1 h-1 rounded-full bg-slate-900" />
                        </div>
                        <div className="w-2.5 h-1.5 bg-amber-400 rounded-full mt-0.5" />
                      </div>
                      <div className="absolute -bottom-1 flex gap-2">
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                        <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-emerald-500/70 rounded p-1.5 shadow-md flex flex-col justify-center">
                      <div className="text-[7.5px] font-mono font-bold text-emerald-300">struct sk_buff</div>
                      <div className="text-[6px] font-mono text-slate-300">head • data • tail • end</div>
                      <div className="text-[6px] font-mono text-sky-400">DMA Ring Descriptors</div>
                    </div>
                  </div>
                </div>

                {/* Author Banner */}
                <div className="bg-slate-950 text-white py-1.5 px-3 rounded text-center tracking-widest font-black text-xs uppercase font-sans shadow-md border-t-2 border-emerald-600">
                  AVINASH PAL
                </div>
              </div>
            ) : (
              /* Fallback / Generic Cover for other catalog books */
              <>
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center shadow-md text-white border"
                      style={{
                        backgroundColor: book.accentColor,
                        borderColor: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      #{book.id}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-300 uppercase">
                      Avinash Pal
                    </span>
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md bg-white/10 border border-white/15"
                    style={{ color: book.accentColor }}
                  >
                    {book.tag}
                  </span>
                </div>

                <div className="relative z-10 my-auto text-left py-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-xs text-slate-300 mt-1.5 font-medium line-clamp-2 leading-relaxed">
                      {book.subtitle}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-center">
                    <div
                      className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center relative shadow-inner"
                      style={{ borderColor: `${book.accentColor}77` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg"
                        style={{
                          background: `radial-gradient(circle, ${book.accentColor} 0%, ${book.color} 80%)`,
                        }}
                      >
                        6.x LTS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-semibold text-white tracking-wide">
                    Kernel Publishing
                  </span>
                  <span>{book.pages || 400} pp.</span>
                </div>
              </>
            )}
          </div>

          {/* BACK COVER */}
          <div
            className="absolute inset-0 rounded-l-xl rounded-r-xs overflow-hidden border-y border-l border-white/20 shadow-2xl flex flex-col justify-between p-6 text-white text-left"
            style={{
              background: `linear-gradient(225deg, ${book.color} 0%, #030712 100%)`,
              transform: 'rotateY(180deg) translateZ(20px)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Back Cover Synopsis
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-400">
                  ISBN {book.isbn || '978-0-998123-01'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-3 leading-relaxed line-clamp-6">
                {book.fullDescription || book.description}
              </p>
            </div>

            {/* Barcode & Publisher imprint */}
            <div className="pt-3 border-t border-white/15 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-[2px] h-7 items-end">
                  <div className="w-[2px] h-7 bg-white" />
                  <div className="w-[1px] h-7 bg-white" />
                  <div className="w-[3px] h-7 bg-white" />
                  <div className="w-[1px] h-7 bg-white" />
                  <div className="w-[2px] h-7 bg-white" />
                  <div className="w-[4px] h-7 bg-white" />
                  <div className="w-[1px] h-7 bg-white" />
                  <div className="w-[3px] h-7 bg-white" />
                  <div className="w-[2px] h-7 bg-white" />
                  <div className="w-[1px] h-7 bg-white" />
                  <div className="w-[3px] h-7 bg-white" />
                </div>
                <span className="text-[8px] font-mono text-slate-400">$39.99 USD</span>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-white">Avinash Pal</div>
                <div className="text-[8px] font-mono text-slate-400">Linux Kernel Engineer</div>
              </div>
            </div>
          </div>

          {/* BOOK SPINE (Left Side) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[40px] flex flex-col justify-between py-5 px-1 text-white border-y border-white/20 shadow-md select-none overflow-hidden"
            style={{
              background: `linear-gradient(90deg, ${book.spineColor || '#0e2439'} 0%, #030712 100%)`,
              transform: 'rotateY(-90deg) translateZ(20px)',
              transformOrigin: 'left center',
            }}
          >
            {/* Top Spine Badge */}
            <div className="w-6 h-6 mx-auto rounded bg-white/15 border border-white/30 flex items-center justify-center text-[10px] font-mono font-bold text-white">
              {book.id}
            </div>

            {/* Rotated Spine Text (Title + Author) */}
            <div
              className="text-center font-bold text-[11px] tracking-wider whitespace-nowrap text-white"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                margin: 'auto 0',
              }}
            >
              <span className="text-sky-300 font-mono text-[9px] mr-2">[{book.tag}]</span>
              <span>{book.title}</span>
              <span className="text-slate-400 ml-2 font-normal"> — Avinash Pal</span>
            </div>

            {/* Bottom Kernel Logo Mark */}
            <div className="text-center text-[9px] font-mono text-slate-400">
              LTS
            </div>
          </div>

          {/* PAGE EDGES (Right, Top, Bottom) */}
          {/* Right Page Edge block (Paper texture) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-[38px] border-y border-slate-300 shadow-inner"
            style={{
              background: 'repeating-linear-gradient(90deg, #f8fafc 0px, #f1f5f9 1px, #e2e8f0 2px, #f8fafc 3px)',
              transform: 'rotateY(90deg) translateZ(240px)',
              transformOrigin: 'right center',
            }}
          />

          {/* Top Page Edge */}
          <div
            className="absolute top-0 left-0 w-[260px] h-[38px] border-x border-slate-300 shadow-inner"
            style={{
              background: 'repeating-linear-gradient(0deg, #f8fafc 0px, #f1f5f9 1px, #e2e8f0 2px, #f8fafc 3px)',
              transform: 'rotateX(90deg) translateZ(19px)',
              transformOrigin: 'top center',
            }}
          />

          {/* Bottom Page Edge */}
          <div
            className="absolute bottom-0 left-0 w-[260px] h-[38px] border-x border-slate-300 shadow-inner"
            style={{
              background: 'repeating-linear-gradient(0deg, #f8fafc 0px, #f1f5f9 1px, #e2e8f0 2px, #f8fafc 3px)',
              transform: 'rotateX(-90deg) translateZ(351px)',
              transformOrigin: 'bottom center',
            }}
          />
        </div>
      </div>

      {/* Preset Angle Selector Controls */}
      {interactive && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10">
          <span className="text-xs text-slate-600 font-mono font-bold mr-1">
            3D Angle:
          </span>
          {[
            { id: 'perspective', label: 'Perspective (3/4)' },
            { id: 'isometric', label: 'Isometric' },
            { id: 'front', label: 'Front View' },
            { id: 'side', label: 'Spine / Side' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetChange(preset.id as any)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
                viewAngle === preset.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <span className="text-[11px] text-slate-500 hidden sm:inline ml-2 italic">
            (Hover / drag to inspect)
          </span>
        </div>
      )}
    </div>
  );
}
