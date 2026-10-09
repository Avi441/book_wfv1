import fs from "fs";
import path from "path";

const outDir = "/app/applet/public/covers";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function getTuxSvg(x, y, scale = 1) {
  return `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <!-- Tux Body Outer -->
    <ellipse cx="40" cy="50" rx="30" ry="38" fill="#0f172a" />
    <!-- Tux White Belly -->
    <ellipse cx="40" cy="55" rx="20" ry="26" fill="#f8fafc" />
    <!-- Tux Head -->
    <circle cx="40" cy="24" r="20" fill="#0f172a" />
    <!-- Tux Eyes -->
    <ellipse cx="33" cy="20" rx="3.5" ry="5.5" fill="#f8fafc" />
    <circle cx="34" cy="20" r="2" fill="#0f172a" />
    <ellipse cx="47" cy="20" rx="3.5" ry="5.5" fill="#f8fafc" />
    <circle cx="46" cy="20" r="2" fill="#0f172a" />
    <!-- Tux Beak -->
    <polygon points="34,26 46,26 40,34" fill="#f59e0b" />
    <!-- Tux Wings -->
    <ellipse cx="12" cy="52" rx="6" ry="18" fill="#0f172a" transform="rotate(15 12 52)" />
    <ellipse cx="68" cy="52" rx="6" ry="18" fill="#0f172a" transform="rotate(-15 68 52)" />
    <!-- Tux Feet -->
    <ellipse cx="28" cy="85" rx="12" ry="5" fill="#f59e0b" />
    <ellipse cx="52" cy="85" rx="12" ry="5" fill="#f59e0b" />
  </g>`;
}

// 1. Storage Book Cover SVG
const storageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 860" width="600" height="860">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="nvmeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="600" height="860" fill="url(#bgGrad)"/>
  
  <!-- Spine Book Fold Shadow -->
  <rect x="0" y="0" width="16" height="860" fill="black" opacity="0.08"/>
  <line x1="16" y1="0" x2="16" y2="860" stroke="#000000" stroke-width="0.75" opacity="0.12"/>
  
  <!-- Header Title -->
  <text x="300" y="70" font-family="sans-serif" font-size="20" font-weight="900" letter-spacing="4" text-anchor="middle" fill="#1e293b">THINK LIKE A</text>
  <text x="300" y="140" font-family="sans-serif" font-size="68" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#0f172a">LINUX</text>
  <text x="300" y="210" font-family="sans-serif" font-size="64" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#b91c1c">STORAGE</text>
  <text x="300" y="275" font-family="sans-serif" font-size="56" font-weight="900" letter-spacing="-0.5" text-anchor="middle" fill="#0f172a">ENGINEER</text>

  <!-- Subtitle -->
  <text x="300" y="318" font-family="sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#334155">
    From Linux I/O Internals to Filesystems, blk-mq, RAID, NVMe and Storage Debugging
  </text>

  <!-- Quote Capsule -->
  <g transform="translate(60, 340)">
    <rect width="480" height="32" rx="16" fill="#0f172a"/>
    <text x="240" y="21" font-family="sans-serif" font-size="12" font-style="italic" font-weight="500" text-anchor="middle" fill="#ffffff">
      “Learn not just how Linux storage works, but why it is designed that way.”
    </text>
  </g>

  <!-- 4 Feature Pillars -->
  <g transform="translate(45, 395)">
    <!-- Pill 1: Physical Devices -->
    <g transform="translate(0, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#1e293b"/>
      <text x="22" y="32" font-size="15" text-anchor="middle">💾</text>
      <text x="44" y="25" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Physical</text>
      <text x="44" y="39" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Devices</text>
    </g>

    <!-- Pill 2: Kernel Data Path -->
    <g transform="translate(130, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#1d4ed8"/>
      <text x="22" y="31" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">VFS</text>
      <text x="44" y="25" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Kernel</text>
      <text x="44" y="39" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Data Path</text>
    </g>

    <!-- Pill 3: blk-mq Queues -->
    <g transform="translate(260, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#b91c1c"/>
      <text x="22" y="31" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">MQ</text>
      <text x="44" y="25" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">blk-mq</text>
      <text x="44" y="39" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Queues</text>
    </g>

    <!-- Pill 4: Multipath Fabrics -->
    <g transform="translate(390, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#7e22ce"/>
      <text x="22" y="31" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">ANA</text>
      <text x="44" y="25" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Multipath</text>
      <text x="44" y="39" font-family="sans-serif" font-size="10" font-weight="800" fill="#0f172a">Fabrics</text>
    </g>
  </g>

  <!-- Center Graphic: Tux with NVMe SSD Graphic -->
  <g transform="translate(45, 480)">
    <rect width="510" height="230" rx="14" fill="#0b1322" stroke="#1e293b" stroke-width="2"/>
    
    <path d="M 0,50 L 510,50 M 0,115 L 510,115 M 0,180 L 510,180" stroke="#1e293b" stroke-width="1" opacity="0.6"/>
    <path d="M 120,0 L 120,230 M 255,0 L 255,230 M 390,0 L 390,230" stroke="#1e293b" stroke-width="1" opacity="0.6"/>

    <!-- Tux the Penguin -->
    ${getTuxSvg(40, 50, 1.4)}

    <!-- NVMe M.2 SSD Card Visual -->
    <g transform="translate(190, 45)">
      <rect width="280" height="135" rx="8" fill="url(#nvmeGrad)" stroke="#ef4444" stroke-width="1.8"/>
      
      <!-- Gold PCIe Pins -->
      <g transform="translate(15, 122)">
        <rect x="0" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="12" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="24" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="36" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="48" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="68" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="80" y="0" width="8" height="10" fill="#fbbf24"/>
        <rect x="92" y="0" width="8" height="10" fill="#fbbf24"/>
      </g>

      <!-- Controller Chip -->
      <rect x="25" y="20" width="70" height="70" rx="4" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="60" y="52" font-family="monospace" font-size="10" font-weight="900" fill="#38bdf8" text-anchor="middle">NVMe</text>
      <text x="60" y="66" font-family="monospace" font-size="9" fill="#94a3b8" text-anchor="middle">ASIC</text>

      <!-- NAND Chips -->
      <rect x="110" y="20" width="70" height="85" rx="4" fill="#020617" stroke="#64748b" stroke-width="1"/>
      <text x="145" y="66" font-family="monospace" font-size="9" font-weight="bold" fill="#cbd5e1" text-anchor="middle">NAND 1</text>
      <rect x="190" y="20" width="70" height="85" rx="4" fill="#020617" stroke="#64748b" stroke-width="1"/>
      <text x="225" y="66" font-family="monospace" font-size="9" font-weight="bold" fill="#cbd5e1" text-anchor="middle">NAND 2</text>

      <!-- Spec Text -->
      <text x="190" y="122" font-family="monospace" font-size="9" font-weight="bold" fill="#ef4444" text-anchor="middle">PCIe 4.0 x4 • blk-mq • NVMe-oF</text>
    </g>
  </g>

  <!-- Bottom Author Banner -->
  <g transform="translate(0, 780)">
    <rect width="600" height="80" fill="#090d16"/>
    <line x1="0" y1="0" x2="600" y2="0" stroke="#b91c1c" stroke-width="4"/>
    <text x="300" y="48" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="8" fill="#ffffff" text-anchor="middle">
      AVINASH PAL
    </text>
  </g>
</svg>`;

// 2. Kernel Developer Book Cover SVG
const kernelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 860" width="600" height="860">
  <defs>
    <linearGradient id="kBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <filter id="kShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="600" height="860" fill="url(#kBgGrad)"/>
  
  <!-- Spine Book Fold Shadow -->
  <rect x="0" y="0" width="16" height="860" fill="black" opacity="0.08"/>
  <line x1="16" y1="0" x2="16" y2="860" stroke="#000000" stroke-width="0.75" opacity="0.12"/>
  
  <!-- Header Title -->
  <text x="300" y="70" font-family="sans-serif" font-size="20" font-weight="900" letter-spacing="4" text-anchor="middle" fill="#1e293b">THINK LIKE A</text>
  <text x="300" y="140" font-family="sans-serif" font-size="68" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#0f172a">LINUX</text>
  <text x="300" y="210" font-family="sans-serif" font-size="68" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#0f172a">KERNEL</text>
  <text x="300" y="275" font-family="sans-serif" font-size="56" font-weight="900" letter-spacing="-0.5" text-anchor="middle" fill="#b91c1c">DEVELOPER</text>

  <!-- Subtitle -->
  <text x="300" y="318" font-family="sans-serif" font-size="14.5" font-weight="700" text-anchor="middle" fill="#334155">
    Mastering C Through Real Linux Kernel Design Patterns
  </text>

  <!-- Quote Capsule -->
  <g transform="translate(60, 340)">
    <rect width="480" height="32" rx="16" fill="#0f172a"/>
    <text x="240" y="21" font-family="sans-serif" font-size="12" font-style="italic" font-weight="500" text-anchor="middle" fill="#ffffff">
      “Learn not just how Linux kernel code works, but why it is designed that way.”
    </text>
  </g>

  <!-- 4 Feature Pillars -->
  <g transform="translate(45, 395)">
    <!-- Pill 1: Real-World Analogies -->
    <g transform="translate(0, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#kShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#c2410c"/>
      <text x="22" y="32" font-size="14" text-anchor="middle">☕</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Real-World</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Analogies</text>
    </g>

    <!-- Pill 2: C Concepts Made Simple -->
    <g transform="translate(130, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#kShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#1d4ed8"/>
      <text x="22" y="31" font-family="monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">&lt;/&gt;</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">C Concepts</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Simple</text>
    </g>

    <!-- Pill 3: Kernel Design Patterns -->
    <g transform="translate(260, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#kShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#7e22ce"/>
      <text x="22" y="32" font-size="14" text-anchor="middle">⚙️</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Design</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Patterns</text>
    </g>

    <!-- Pill 4: Driver Walkthrough -->
    <g transform="translate(390, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#kShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#059669"/>
      <text x="22" y="31" font-family="monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">&gt;_</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Driver</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Walkthrough</text>
    </g>
  </g>

  <!-- Center Graphic: Tux with C Patterns Terminal -->
  <g transform="translate(45, 480)">
    <rect width="510" height="230" rx="14" fill="#030d1a" stroke="#173a5e" stroke-width="2"/>
    
    <path d="M 0,40 L 510,40" stroke="#173a5e" stroke-width="1"/>
    <circle cx="20" cy="20" r="4.5" fill="#ef4444"/>
    <circle cx="35" cy="20" r="4.5" fill="#f59e0b"/>
    <circle cx="50" cy="20" r="4.5" fill="#10b981"/>
    <text x="75" y="24" font-family="monospace" font-size="10" fill="#94a3b8">kernel_c_patterns.c</text>

    <!-- Tux the Penguin -->
    ${getTuxSvg(35, 60, 1.4)}

    <!-- C Code Snippet Box -->
    <g transform="translate(170, 55)">
      <rect width="320" height="150" rx="8" fill="#0b1b2d" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="16" y="30" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">#define container_of(ptr, type, member)</text>
      <text x="16" y="52" font-family="monospace" font-size="11" fill="#f8fafc">struct list_head {</text>
      <text x="36" y="70" font-family="monospace" font-size="11" fill="#34d399">struct list_head *next, *prev;</text>
      <text x="16" y="88" font-family="monospace" font-size="11" fill="#f8fafc">};</text>
      <text x="16" y="112" font-family="monospace" font-size="11" fill="#fbbf24">static const struct file_operations fops = {</text>
      <text x="36" y="130" font-family="monospace" font-size="11" fill="#a78bfa">.read = dev_read, .write = dev_write</text>
      <text x="16" y="145" font-family="monospace" font-size="11" fill="#fbbf24">};</text>
    </g>
  </g>

  <!-- Bottom Author Banner -->
  <g transform="translate(0, 780)">
    <rect width="600" height="80" fill="#090d16"/>
    <line x1="0" y1="0" x2="600" y2="0" stroke="#b91c1c" stroke-width="4"/>
    <text x="300" y="48" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="8" fill="#ffffff" text-anchor="middle">
      AVINASH PAL
    </text>
  </g>
</svg>`;

// 3. Network Book Cover SVG
const networkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 860" width="600" height="860">
  <defs>
    <linearGradient id="nBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <filter id="nShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="600" height="860" fill="url(#nBgGrad)"/>
  
  <!-- Spine Book Fold Shadow -->
  <rect x="0" y="0" width="16" height="860" fill="black" opacity="0.08"/>
  <line x1="16" y1="0" x2="16" y2="860" stroke="#000000" stroke-width="0.75" opacity="0.12"/>
  
  <!-- Header Title -->
  <text x="300" y="70" font-family="sans-serif" font-size="20" font-weight="900" letter-spacing="4" text-anchor="middle" fill="#1e293b">THINK LIKE A</text>
  <text x="300" y="140" font-family="sans-serif" font-size="68" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#0f172a">LINUX</text>
  <text x="300" y="210" font-family="sans-serif" font-size="64" font-weight="900" letter-spacing="-1" text-anchor="middle" fill="#047857">NETWORK</text>
  <text x="300" y="275" font-family="sans-serif" font-size="56" font-weight="900" letter-spacing="-0.5" text-anchor="middle" fill="#0f172a">ENGINEER</text>

  <!-- Subtitle -->
  <text x="300" y="318" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#334155">
    The Linux Network Stack: sk_buff, TCP/IP, Netfilter, eBPF &amp; High-Speed Drivers
  </text>

  <!-- Quote Capsule -->
  <g transform="translate(60, 340)">
    <rect width="480" height="32" rx="16" fill="#0f172a"/>
    <text x="240" y="21" font-family="sans-serif" font-size="12" font-style="italic" font-weight="500" text-anchor="middle" fill="#ffffff">
      “Learn not just how Linux networking works, but why it is designed that way.”
    </text>
  </g>

  <!-- 4 Feature Pillars -->
  <g transform="translate(45, 395)">
    <!-- Pill 1: Wire to Sockets -->
    <g transform="translate(0, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#nShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#047857"/>
      <text x="22" y="32" font-size="14" text-anchor="middle">🌐</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Wire to</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Sockets</text>
    </g>

    <!-- Pill 2: sk_buff Anatomy -->
    <g transform="translate(130, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#nShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#1d4ed8"/>
      <text x="22" y="31" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">skb</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">sk_buff</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Anatomy</text>
    </g>

    <!-- Pill 3: eBPF & XDP -->
    <g transform="translate(260, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#nShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#c026d3"/>
      <text x="22" y="31" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">XDP</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">eBPF &amp; XDP</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Filters</text>
    </g>

    <!-- Pill 4: 100GbE Tuning -->
    <g transform="translate(390, 0)">
      <rect width="118" height="54" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#nShadow)"/>
      <rect x="8" y="12" width="28" height="30" rx="6" fill="#b91c1c"/>
      <text x="22" y="32" font-size="14" text-anchor="middle">⚡</text>
      <text x="42" y="25" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">100GbE</text>
      <text x="42" y="39" font-family="sans-serif" font-size="9.5" font-weight="800" fill="#0f172a">Tuning</text>
    </g>
  </g>

  <!-- Center Graphic: Tux with Packet Rings & sk_buff Flow -->
  <g transform="translate(45, 480)">
    <rect width="510" height="230" rx="14" fill="#022018" stroke="#047857" stroke-width="2"/>
    
    <path d="M 170,80 L 480,80" stroke="#10b981" stroke-width="2" stroke-dasharray="8 6"/>
    <path d="M 170,140 L 480,140" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>

    <!-- Tux the Penguin -->
    ${getTuxSvg(35, 60, 1.4)}

    <!-- Packet Structure Graphic -->
    <g transform="translate(170, 45)">
      <!-- Ring buffer / DMA -->
      <rect x="0" y="0" width="130" height="55" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
      <text x="65" y="24" font-family="monospace" font-size="10" font-weight="900" fill="#34d399" text-anchor="middle">RX Ring Buffer</text>
      <text x="65" y="42" font-family="monospace" font-size="9" fill="#a7f3d0" text-anchor="middle">DMA Descriptors</text>

      <!-- Arrow -->
      <polygon points="140,28 152,28 152,24 162,30 152,36 152,32 140,32" fill="#34d399"/>

      <!-- sk_buff Box -->
      <rect x="170" y="0" width="145" height="150" rx="8" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.8"/>
      <text x="242" y="26" font-family="monospace" font-size="12" font-weight="bold" fill="#2dd4bf" text-anchor="middle">struct sk_buff</text>
      
      <rect x="180" y="38" width="125" height="22" rx="3" fill="#134e4a"/>
      <text x="242" y="53" font-family="monospace" font-size="9" fill="#ccfbf1" text-anchor="middle">headroom [TCP/IP]</text>

      <rect x="180" y="66" width="125" height="34" rx="3" fill="#0f766e"/>
      <text x="242" y="87" font-family="monospace" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">Packet Payload</text>

      <rect x="180" y="106" width="125" height="20" rx="3" fill="#134e4a"/>
      <text x="242" y="120" font-family="monospace" font-size="9" fill="#ccfbf1" text-anchor="middle">tailroom</text>
    </g>
  </g>

  <!-- Bottom Author Banner -->
  <g transform="translate(0, 780)">
    <rect width="600" height="80" fill="#090d16"/>
    <line x1="0" y1="0" x2="600" y2="0" stroke="#047857" stroke-width="4"/>
    <text x="300" y="48" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="8" fill="#ffffff" text-anchor="middle">
      AVINASH PAL
    </text>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, "cover_storage.svg"), storageSvg);
fs.writeFileSync(path.join(outDir, "cover_kernel.svg"), kernelSvg);
fs.writeFileSync(path.join(outDir, "cover_network.svg"), networkSvg);

console.log("SUCCESS: Generated exact SVG book covers!");
