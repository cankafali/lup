import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  href: string;
  /** Ok (→) bileşen tarafından eklenir; metne yazılmaz. */
  children: string;
  /** primary: kırmızı CTA (§8.8). link: ikincil, alt çizgili graphite. */
  variant?: "primary" | "link";
  /** Yeni sekmede açılır (WhatsApp, harita). */
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const VARIANT = {
  primary: "h-14 justify-between gap-6 bg-stamp px-6 font-mono text-mono-l text-paper uppercase",
  link: "tap gap-[1ch] font-mono text-mono text-graphite uppercase",
} as const;

/** Tek CTA stili (§8.8) ve ikincil link. */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className,
  onClick,
}: ButtonProps) {
  const classes = clsx("group inline-flex items-center", VARIANT[variant], className);
  const content = (
    <>
      <span
        className={variant === "link" ? "underline decoration-1 underline-offset-4" : undefined}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={
          variant === "primary"
            ? "transition-transform duration-(--duration-fast) ease-lup group-hover:translate-x-1.5"
            : undefined
        }
      >
        →
      </span>
    </>
  );

  if (href.startsWith("/") && !external) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}
