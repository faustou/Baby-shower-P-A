import styles from './InvitationSection.module.css'

export default function BearSVG() {
  return (
    <svg
      className={styles.bear}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Osito tierno"
      role="img"
    >
      {/* Left ear */}
      <circle cx="30" cy="28" r="16" fill="#8B5E3C" />
      <circle cx="30" cy="28" r="9" fill="#C4956A" />
      {/* Right ear */}
      <circle cx="90" cy="28" r="16" fill="#8B5E3C" />
      <circle cx="90" cy="28" r="9" fill="#C4956A" />
      {/* Head */}
      <circle cx="60" cy="52" r="38" fill="#8B5E3C" />
      {/* Face highlight */}
      <ellipse cx="60" cy="66" rx="20" ry="14" fill="#C4956A" />
      {/* Eyes */}
      <circle cx="48" cy="46" r="5" fill="#1a0f0a" />
      <circle cx="72" cy="46" r="5" fill="#1a0f0a" />
      {/* Eye shine */}
      <circle cx="50" cy="44" r="1.5" fill="white" />
      <circle cx="74" cy="44" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="6" ry="4" fill="#4A2810" />
      {/* Mouth */}
      <path d="M54 63 Q60 69 66 63" stroke="#4A2810" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx="40" cy="56" r="6" fill="#F4A7B9" opacity="0.5" />
      <circle cx="80" cy="56" r="6" fill="#F4A7B9" opacity="0.5" />
      {/* Body */}
      <ellipse cx="60" cy="98" rx="28" ry="22" fill="#8B5E3C" />
      {/* Tummy */}
      <ellipse cx="60" cy="100" rx="16" ry="13" fill="#C4956A" />
      {/* Heart on tummy */}
      <path d="M57 98 C57 95.5 54 94 54 96.5 C54 99 57 101 57 101 C57 101 60 99 60 96.5 C60 94 57 95.5 57 98 Z" fill="#F4A7B9" opacity="0.9" />
    </svg>
  )
}
