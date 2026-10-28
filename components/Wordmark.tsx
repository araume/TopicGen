export function Wordmark() {
  return (
    <div className="flex items-center gap-3 text-fg">
      <svg viewBox="0 0 40 20" className="h-4 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="10" cy="10" r="7" />
        <circle cx="30" cy="10" r="7" />
        <path d="M17 9.5q3-2.5 6 0" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-xl">Solomon&rsquo;s Glasses</span>
    </div>
  );
}
