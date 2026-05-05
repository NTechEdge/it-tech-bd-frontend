interface BrandNameProps {
  className?: string;
}

export default function BrandName({ className = "" }: BrandNameProps) {
  return (
    <span
      className={`font-bold tracking-widest uppercase bg-gradient-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] bg-clip-text text-transparent ${className}`}
      style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
    >
      IT TECH BD
    </span>
  );
}
