interface TuxLogoProps {
  className?: string;
  size?: number;
}

export function TuxLogo({ className = 'w-8 h-8', size = 32 }: TuxLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="LinuxStack Logo"
    >
      <rect x="10" y="14" width="100" height="92" rx="22" fill="#0F172A" />
      <path d="M35 30H85V42H35V30Z" fill="#38BDF8" />
      <path d="M28 48H92V58H28V48Z" fill="#E2E8F0" />
      <path d="M22 62H98V72H22V62Z" fill="#38BDF8" />
      <path d="M35 76H85V90H35V76Z" fill="#E2E8F0" />
      <circle cx="60" cy="42" r="19" fill="#F8FAFC" />
      <path d="M49 42C49 36.4772 53.4772 32 59 32H65C70.5228 32 75 36.4772 75 42V47C75 52.5228 70.5228 57 65 57H59C53.4772 57 49 52.5228 49 47V42Z" fill="#0F172A" />
      <circle cx="54" cy="43" r="2.7" fill="#F8FAFC" />
      <circle cx="66" cy="43" r="2.7" fill="#F8FAFC" />
      <circle cx="54" cy="43" r="1.1" fill="#0F172A" />
      <circle cx="66" cy="43" r="1.1" fill="#0F172A" />
      <path d="M60 48L55 52L65 52L60 48Z" fill="#F59E0B" />
      <path d="M37 90C43 82 50 78 60 78C70 78 77 82 83 90" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 21L39 13H81L90 21" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
