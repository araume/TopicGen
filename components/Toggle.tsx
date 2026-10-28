"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex cursor-pointer items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg"
    >
      <span>{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full border transition-colors duration-300 ${
          checked ? "border-fg bg-fg" : "border-faint bg-transparent"
        }`}
      >
        <span
          className={`absolute top-[2px] left-0 size-3.5 rounded-full transition-transform duration-300 ease-out ${
            checked ? "translate-x-[18px] bg-bg" : "translate-x-[2px] bg-muted"
          }`}
        />
      </span>
    </button>
  );
}
