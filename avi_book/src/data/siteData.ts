import { Book, UpcomingEvent, InterviewNote, TechnicalNote, RealDeviceExample } from '../types';

export const AUTHOR_INFO = {
  name: 'LinuxStack',
  role: 'Linux Systems, Storage & Kernel Learning',
  bioShort:
    "LinuxStack helps engineers move from basic Linux usage to real systems thinking with practical books on storage, drivers, networking, and kernel internals.",
  bioCard:
    "LinuxStack teaches engineers how Linux works underneath the hood so they can reason about performance, debugging, and system design with confidence.",
  quote: "Learn not just how Linux works, but how to reason about it in production.",
  location: 'Bangalore, India',
  stats: [
    { label: 'Author', icon: 'User' },
    { label: 'Linux Systems Engineer', icon: 'Terminal' },
    { label: 'Kernel & Storage Books', icon: 'BookOpen' },
    { label: 'Technical Speaker & Mentor', icon: 'GraduationCap' },
  ],
  socials: {
    github: 'https://github.com/avinashpal',
    linkedin: 'https://www.linkedin.com/in/avinash-pal-b885a026b/',
    youtube: 'https://youtube.com/@avinashpal',
    email: 'avinashpal441@gmail.com',
  },
};

export const BOOKS_DATA: Book[] = [
  {
    id: 1,
    title: 'Think Like a Linux Storage Engineer',
    subtitle: 'From Linux I/O Internals to Filesystems, blk-mq, RAID, NVMe and Storage Debugging',
    tagline: 'Learn not just how Linux storage works, but why it is designed that way.',
    description: 'Master the Linux storage pipeline from VFS, page cache, blk-mq, and device-mapper down to NVMe, PCIe, and hardware drivers.',
    fullDescription:
      'The definitive working manual for Linux storage engineering. Traces a single I/O request from write() returning to a doorbell write on an NVMe controller. Covers VFS, page cache folios, writeback, BIOs, blk-mq multi-queue architecture, device-mapper, LVM, software RAID, NVMe-oF, fio benchmarking, and real-world latency debugging with bpftrace. Includes 65 conceptual interview questions and 10 production case studies.',
    color: '#8b1e1e',
    spineColor: '#6b1414',
    accentColor: '#f87171',
    tag: 'Storage & I/O',
    badge: 'Latest Release',
    year: '2026',
    price: 39.99,
    offerPrice: 27.99,
    discountPercent: 30,
    samplePercentage: 20,
    coverImage: '/covers/cover_storage.png',
    bannerImage: '/covers/cover_storage.png',
    pdfUrl: '/pdfs/think-like-a-linux-storage-engineer_f-V2.pdf',
    pdfFileName: 'think-like-a-linux-storage-engineer_f-V2.pdf',
    pdfDownloadName: 'think-like-a-linux-storage-engineer_f-V2.pdf',
    chapters: [
      'Chapter 1 — Thinking Like a Linux Storage Engineer',
      'Chapter 2 — The Linux Storage Stack: VFS to Hardware',
      'Chapter 3 — VFS, Page Cache, and the Block Layer',
      'Chapter 4 — Stacking Storage: DM, LVM, md RAID, and Multipath',
      'Chapter 5 — ext4 and XFS: Journaling Filesystems in Production',
      'Chapter 6 — Btrfs and Copy-on-Write Filesystem Architecture',
      'Chapter 7 — NVMe, PCIe, and the Local Fast Path',
      'Chapter 8 — SCSI, SAS, SATA, and Network Storage Fabrics',
      'Chapter 9 — Performance, Benchmarking with fio, and bpftrace',
      'Chapter 10 — Reliability, Failure, and Interview Mastery',
    ],
    pages: 273,
    isbn: '978-0-998123-10-4',
    targetKernel: 'Linux 6.6 LTS',
    featured: true,
    pdfNotes: [
      {
        id: 'sn-1',
        chapterNumber: 1,
        title: 'The Storage Journey: From write() to NVMe Doorbell',
        summary:
          'Traces the journey of application data from a write() system call through page cache folios, writeback mechanisms, BIO generation, blk-mq queues, and controller DMA.',
        keyConcepts: [
          'write() writes to Page Cache folios unless O_DIRECT / O_SYNC is set.',
          'wb_workfn (flusher thread) builds block I/O requests (struct bio).',
          'blk-mq eliminates lock contention with per-CPU software queues and hardware submission queues (SQ).',
          'NVMe doorbell write notifies controller to fetch commands via DMA.',
        ],
        codeSnippets: [
          {
            title: 'Benchmarking Random Write Latency with fio',
            language: 'bash',
            code: `fio --name=nvme_randwrite \\
  --filename=/dev/nvme0n1 \\
  --direct=1 --rw=randwrite --bs=4k \\
  --ioengine=libaio --iodepth=64 \\
  --runtime=60 --time_based --group_reporting`,
          },
          {
            title: 'bpftrace Block I/O Latency Histogram',
            language: 'c',
            code: `kprobe:blk_account_io_done
{
  @latency_us = hist(arg1 / 1000);
}`,
          },
        ],
        interviewTakeaways: [
          'Why does blk-mq outperform the legacy single-queue block layer? Elimination of global spinlocks and direct per-core queueing.',
          'What happens during dirty page writeback throttling? If dirty ratio exceeds dirty_ratio sysctl, tasks stall in balance_dirty_pages.',
        ],
      },
      {
        id: 'sn-2',
        chapterNumber: 2,
        title: 'Filesystems, Journaling & COW: ext4, XFS and Btrfs',
        summary:
          'Deep dive into modern production journaling filesystems (ext4 JBD2, XFS log) vs Copy-On-Write Btrfs b-trees.',
        keyConcepts: [
          'Journaling modes: data=ordered (default, writes data before metadata commit) vs data=journal.',
          'Delayed allocation (delalloc) groups contiguous blocks to prevent filesystem fragmentation.',
          'Copy-on-Write (COW) ensures tree nodes are never overwritten in-place, enabling instant snapshots.',
        ],
        codeSnippets: [
          {
            title: 'Inspecting ext4 superblock and journal status',
            language: 'bash',
            code: `dumpe2fs -h /dev/mapper/vg0-data | grep -E "Inode count|Block size|Journal"
tune2fs -l /dev/mapper/vg0-data`,
          },
        ],
        interviewTakeaways: [
          'Why can fsync() take tens of milliseconds on busy drives? Because it flushes disk caches and forces journal transaction commit to non-volatile media.',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Think Like a Linux Kernel Developer',
    subtitle: 'Mastering C Through Real Linux Kernel Design Patterns',
    tagline: 'Learn not just how Linux kernel code works, but why it is designed that way.',
    description: 'Master the C patterns, intrusive data structures, ops tables, and driver lifecycles that power the modern Linux kernel.',
    fullDescription:
      'Bridging the gap between knowing C and writing real Linux kernel code. Learn the bedrock patterns used across 30 million lines of kernel source: container_of(), intrusive linked lists (list_head), ops tables (file_operations, net_device_ops), notifier chains, workqueues, and step-by-step device driver lifecycle walkthrough with full source code.',
    color: '#0f2942',
    spineColor: '#173a5e',
    accentColor: '#38bdf8',
    tag: 'Kernel Patterns & C',
    badge: 'Flagship Book',
    year: '2026',
    price: 39.99,
    offerPrice: 29.99,
    discountPercent: 25,
    samplePercentage: 20,
    coverImage: '/covers/cover_kernel.png',
    bannerImage: '/covers/cover_kernel.png',
    pdfUrl: '/pdfs/think-like-a-linux-kernel-developer.pdf',
    pdfFileName: 'think-like-a-linux-kernel-developer.pdf',
    pdfDownloadName: 'think-like-a-linux-kernel-developer.pdf',
    chapters: [
      'Chapter 1 — Why the Linux Kernel Uses C',
      'Chapter 2 — Memory, Pointers, and Kernel Spaces',
      'Chapter 3 — Structures: Alignment, Padding & Real Kernel Structs',
      'Chapter 4 — Function Pointers: Mechanics & Jump Tables',
      'Chapter 5 — Object-Oriented C and Kernel Architecture',
      'Chapter 6 — Putting Everything Together: A Linux Driver Walkthrough',
      'Appendix — Linux Kernel Utilities, Patterns, and Coding Style',
    ],
    pages: 139,
    isbn: '978-0-00000-001-7',
    targetKernel: 'Linux 6.x LTS',
    featured: false,
    pdfNotes: [
      {
        id: 'kn-1',
        chapterNumber: 1,
        title: 'Intrusive Data Structures & container_of() Mechanics',
        summary:
          'How the Linux kernel avoids dynamic heap allocation wrappers by embedding list_head and hlist_node directly inside records.',
        keyConcepts: [
          'container_of(ptr, type, member) uses offsetof() to get the containing struct pointer.',
          'Memory zero-copy and continuous cache-line spatial locality.',
          'Doubly-linked circular list guarantees O(1) addition, deletion, and rotation.',
        ],
        codeSnippets: [
          {
            title: 'Definition and Usage of container_of()',
            language: 'c',
            code: `#define container_of(ptr, type, member) ({                \\
    void *__mptr = (void *)(ptr);                         \\
    static_assert(__same_type(*(ptr), ((type *)0)->member) || \\
                  __same_type(*(ptr), void),              \\
                  "pointer type mismatch in container_of()"); \\
    ((type *)(__mptr - offsetof(type, member))); })

// Example driver struct
struct my_sensor {
    int sensor_id;
    struct list_head list;
};

// Retrieve sensor from embedded list
struct my_sensor *s = container_of(entry, struct my_sensor, list);`,
          },
        ],
        interviewTakeaways: [
          'What happens if member is at offset 0? container_of returns the pointer unchanged, but the macro is generic for any offset.',
          'Why does Linux avoid standard libc linked lists? Standard lists allocate auxiliary nodes requiring extra kmalloc and causing memory fragmentation.',
        ],
      },
      {
        id: 'kn-2',
        chapterNumber: 2,
        title: 'Device Driver Lifecycle & Ops Tables Pattern',
        summary:
          'Writing loadable kernel modules, managing platform drivers, device-tree probing, and file_operations bindings.',
        keyConcepts: [
          'Polymorphism in C is implemented via struct file_operations and ops tables.',
          'Platform driver matching via of_match_table (compatible string).',
          'Concurrency handling: spinlocks in atomic context vs mutexes in process context.',
        ],
        codeSnippets: [
          {
            title: 'Minimal Character Driver Ops Table',
            language: 'c',
            code: `static const struct file_operations my_fops = {
    .owner   = THIS_MODULE,
    .open    = my_dev_open,
    .read    = my_dev_read,
    .write   = my_dev_write,
    .release = my_dev_release,
};

static int __init my_module_init(void) {
    pr_info("Driver registered successfully\\n");
    return 0;
}
module_init(my_module_init);`,
          },
        ],
        interviewTakeaways: [
          'Can you call kmalloc(..., GFP_KERNEL) in a hardirq handler? Never! GFP_KERNEL can sleep; hardirq handlers cannot sleep.',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Think Like a Linux Network Engineer',
    subtitle: 'Learn Linux Networking Through Real-Life Analogies, Practical Examples, Kernel Internals & Debugging',
    tagline: 'Hard Concepts. Simple Analogies. Real-Life Examples That Make Linux Networking Easy.',
    description: 'Master the Linux networking path from NIC DMA rings and NAPI polling to socket buffers (sk_buff), Netfilter, eBPF XDP, and 100GbE driver tuning.',
    fullDescription:
      'Step inside the packet processing machine. Understand how incoming Ethernet frames are moved into host memory via DMA ring buffers, picked up by NAPI poll routines, encapsulated into sk_buff structures, processed through TCP/IP protocols, inspected by Netfilter, and handed to application sockets. Includes eBPF XDP programs for line-rate packet drops and real-world 100Gbps tuning.',
    color: '#064e3b',
    spineColor: '#0f766e',
    accentColor: '#2dd4bf',
    tag: 'Networking & Protocols',
    badge: 'High Performance',
    year: '2026',
    price: 39.99,
    offerPrice: 31.99,
    discountPercent: 20,
    samplePercentage: 20,
    coverImage: '/covers/cover_network.png',
    bannerImage: '/covers/cover_network.png',
    pdfUrl: '/pdfs/net_fV3.pdf',
    pdfFileName: 'net_fV3.pdf',
    pdfDownloadName: 'net_fV3.pdf',
    chapters: [
      'Chapter 1 — The Linux Network Subsystem Architecture',
      'Chapter 2 — NAPI, Ring Buffers, and NIC Driver Interrupts',
      'Chapter 3 — Socket Buffer (sk_buff) Anatomy & Memory Layout',
      'Chapter 4 — TCP/IP Protocol Processing Paths in the Kernel',
      'Chapter 5 — Netfilter, Conntrack, and Routing Table Engines',
      'Chapter 6 — eBPF, XDP (eXpress Data Path), and Kernel Bypass',
      'Chapter 7 — Network Performance Tuning and Latency Optimization',
    ],
    pages: 312,
    isbn: '978-0-998123-05-0',
    targetKernel: 'Linux 6.x LTS',
    featured: false,
    pdfNotes: [
      {
        id: 'nn-1',
        chapterNumber: 1,
        title: 'Packet Ingress Fast Path: NIC Ring to Sockets',
        summary:
          'From packet arrival on the physical wire through hardware DMA, MSI-X interrupt, NAPI softirq polling, sk_buff allocation, TCP/IP processing, and queueing to the receive socket buffer.',
        keyConcepts: [
          'NIC DMA engine places packet directly in pre-allocated RX ring descriptors in RAM.',
          'Driver napi_schedule() disables hardware interrupt and activates NET_RX_SOFTIRQ.',
          '__netif_receive_skb() passes packet to protocol handlers (e.g. ip_rcv).',
          'Socket backlog queue awakens epoll_wait() in user applications.',
        ],
        codeSnippets: [
          {
            title: 'Tuning RX/TX Ring Buffers and Interrupt Coalescing',
            language: 'bash',
            code: `# Maximize ring buffer to prevent drops during traffic bursts
ethtool -G eth0 rx 4096 tx 4096

# Adjust adaptive interrupt moderation
ethtool -C eth0 adaptive-rx on rx-usecs 50`,
          },
        ],
        interviewTakeaways: [
          'What is the purpose of NAPI (New API) in Linux networking? To prevent interrupt storms at high packet rates by switching from interrupts to polling.',
        ],
      },
      {
        id: 'nn-2',
        chapterNumber: 2,
        title: 'sk_buff Memory Architecture: Headroom, Tailroom, and Zero-Copy',
        summary:
          'The internal design of struct sk_buff, non-contiguous page frags, and why packet cloning is O(1).',
        keyConcepts: [
          'skb_push() decrements data pointer into headroom to prepend protocol headers without copying.',
          'skb_put() increments tail pointer to append packet payload.',
          'skb_clone() copies only the sk_buff control structure while sharing the underlying packet data buffer with an atomic refcount.',
        ],
        codeSnippets: [
          {
            title: 'eBPF XDP Fast Drop Program',
            language: 'c',
            code: `#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

SEC("xdp")
int xdp_drop_udp(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    // Inspect headers and drop line-rate
    return XDP_PASS;
}
char _license[] SEC("license") = "GPL";`,
          },
        ],
        interviewTakeaways: [
          'Why is XDP faster than standard Netfilter iptables? XDP runs right inside the device driver before an sk_buff is even allocated in host memory.',
        ],
      },
    ],
  },
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'evt-1',
    date: {
      month: 'NOV',
      day: '15',
      year: '2025',
    },
    title: 'Linux Camera Driver Deep Dive',
    type: 'Workshop',
    location: 'Online',
    time: '10:00 AM – 1:00 PM (IST)',
    price: '$49',
    seatsTotal: 30,
    seatsLeft: 18,
    description: 'Hands-on session building V4L2 sensor subdevices, media controller graphs, and DMA video buffers.',
    iconType: 'camera',
  },
  {
    id: 'evt-2',
    date: {
      month: 'NOV',
      day: '22',
      year: '2025',
    },
    title: 'Linux Kernel Debugging Workshop',
    type: 'Workshop',
    location: 'Online',
    time: '10:00 AM – 1:00 PM (IST)',
    price: '$49',
    seatsTotal: 30,
    seatsLeft: 24,
    description: 'Master KGDB, QEMU kernel debugging, ftrace, perf, and diagnosing race conditions in driver code.',
    iconType: 'kernel',
  },
  {
    id: 'evt-3',
    date: {
      month: 'DEC',
      day: '06',
      year: '2025',
    },
    title: 'Android Camera Driver Internals',
    type: 'Talk',
    location: 'Bangalore, India',
    time: '6:00 PM – 8:00 PM (IST)',
    price: '$29',
    seatsTotal: 50,
    seatsLeft: 32,
    description: 'Deep dive into Android Camera HAL3, vendor extensions, Gralloc buffer passing, and V4L2 kernel hooks.',
    iconType: 'phone',
  },
  {
    id: 'evt-4',
    date: {
      month: 'DEC',
      day: '13',
      year: '2025',
    },
    title: 'USB Camera Driver – Hands On',
    type: 'Workshop',
    location: 'Online',
    time: '10:00 AM – 1:00 PM (IST)',
    price: '$49',
    seatsTotal: 30,
    seatsLeft: 20,
    description: 'Writing USB video class (UVC) driver modules, isochronous transfers, and endpoint descriptor parsing.',
    iconType: 'usb',
  },
  {
    id: 'evt-5',
    date: {
      month: 'JAN',
      day: '10',
      year: '2026',
    },
    title: 'Embedded Linux for Camera Systems',
    type: 'Talk',
    location: 'Bangalore, India',
    time: '6:00 PM – 8:00 PM (IST)',
    price: '$29',
    seatsTotal: 60,
    seatsLeft: 40,
    description: 'Hardware bringup, device tree bindings for MIPI CSI-2 receivers, and Yocto build configuration for edge vision.',
    iconType: 'chip',
  },
];

export const ONE_TO_ONE_SESSIONS = [
  {
    id: 'kernel-dev',
    title: 'Linux Kernel Development',
    description: 'Kernel architecture, modules, device drivers, and subsystem deep dives. Bring your code or questions.',
    duration: '60 min',
    durationMinutes: 60,
    price: 50,
    iconName: 'Terminal',
  },
  {
    id: 'camera-v4l2',
    title: 'Camera Drivers & V4L2',
    description: 'Camera pipeline, V4L2 subdevice drivers, media framework, Android camera HAL, and MIPI CSI-2 bring-up.',
    duration: '60 min',
    durationMinutes: 60,
    price: 50,
    iconName: 'Camera',
  },
  {
    id: 'embedded-linux',
    title: 'Embedded Linux',
    description: 'Buildroot, Yocto, board bring-up, U-Boot bootloader debugging, and system configuration.',
    duration: '45 min',
    durationMinutes: 45,
    price: 40,
    iconName: 'Cpu',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Common Linux kernel & driver interview questions, deep dive conceptual explanations, and mock interviews.',
    duration: '45 min',
    durationMinutes: 45,
    price: 40,
    iconName: 'Users',
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance',
    description: 'Resume review, learning roadmap, transition into systems/firmware engineering, and portfolio tips.',
    duration: '30 min',
    durationMinutes: 30,
    price: 30,
    iconName: 'Compass',
  },
];

export const INTERVIEW_NOTES: InterviewNote[] = [
  {
    id: 'int-1',
    category: 'Kernel',
    categoryColor: 'bg-blue-600 text-white',
    title: 'Kernel Driver Internals – Common Questions',
    questionCount: '50+ questions',
    readTime: '8 min read',
  },
  {
    id: 'int-2',
    category: 'V4L2',
    categoryColor: 'bg-emerald-600 text-white',
    title: 'V4L2 Framework – Interview Questions',
    questionCount: '35+ questions',
    readTime: '6 min read',
  },
  {
    id: 'int-3',
    category: 'General',
    categoryColor: 'bg-indigo-600 text-white',
    title: 'Behavioral & System Design',
    questionCount: '20+ questions',
    readTime: '5 min read',
  },
];

export const TECHNICAL_NOTES: TechnicalNote[] = [
  {
    id: 'tech-1',
    title: 'V4L2 Buffer Management',
    readTime: '6 min read',
    category: 'Camera Drivers',
  },
  {
    id: 'tech-2',
    title: 'Device Tree for Camera Drivers',
    readTime: '8 min read',
    category: 'Device Tree & Hardware',
  },
  {
    id: 'tech-3',
    title: 'Linux Kernel Memory Management',
    readTime: '7 min read',
    category: 'Kernel Subsystems',
  },
];

export const REAL_DEVICES: RealDeviceExample[] = [
  {
    id: 'dev-1',
    title: 'Android Phone Camera',
    subtitle: 'Camera stack, HAL, and driver',
    iconType: 'phone',
    specs: 'Qualcomm Spectra ISP / V4L2 Subdev / Camera3 HAL',
  },
  {
    id: 'dev-2',
    title: 'Laptop Camera',
    subtitle: 'Webcam, firmware, data flow',
    iconType: 'laptop',
    specs: 'Intel IPU6 / MIPI CSI-2 / v4l2-core',
  },
  {
    id: 'dev-3',
    title: 'USB Camera',
    subtitle: 'UVC driver and USB stack',
    iconType: 'camera',
    specs: 'uvcvideo driver / Isochronous USB URBs',
  },
];
