// The Spell Sprint mark: "Sp" with a wavy mistake line that turns into a tick — from a mistake to
// the right spelling. Same drawing as public/icons/spell-sprint-icon.svg.
export function BrandMark({ size = 38 }: { size?: number }) {
  return <svg className="brand-mark" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
    <rect width="44" height="44" rx="11" fill="var(--brand)" />
    <text x="22" y="24" fontFamily="Georgia, 'Times New Roman', serif" fontSize="19" fontWeight="700" fill="#ffffff" textAnchor="middle">Sp</text>
    <path d="M10 33q3-3 6 0t6 0" fill="none" stroke="var(--coral-light)" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M25 33l3 3 7-8" fill="none" stroke="var(--mint)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
