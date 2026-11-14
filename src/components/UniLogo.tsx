import { useState } from "react";

export function UniLogo({
  domain,
  name,
  logoUrl,
  className = "max-h-16 max-w-[70%] object-contain",
}: {
  domain: string;
  name: string;
  logoUrl?: string;
  className?: string;
}) {
  const sources = [
    ...(logoUrl ? [logoUrl] : []),
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
  ];
  const [idx, setIdx] = useState(0);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  if (idx >= sources.length) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <span className="font-display text-3xl text-primary">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={sources[idx]}
      alt={name}
      className={className}
      onError={() => setIdx((i) => i + 1)}
      loading="lazy"
    />
  );
}
