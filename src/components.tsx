import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ResponsivePictureProps = {
  alt: string;
  base: string;
  className?: string;
  height: number;
  loading?: "eager" | "lazy";
  sizes: string;
  widths: readonly [number, number];
  width: number;
};

export function ResponsivePicture({
  alt,
  base,
  className,
  height,
  loading = "lazy",
  sizes,
  widths,
  width,
}: ResponsivePictureProps) {
  const [small, large] = widths;

  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`${base}-${small}.avif ${small}w, ${base}-${large}.avif ${large}w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${base}-${small}.webp ${small}w, ${base}-${large}.webp ${large}w`}
        sizes={sizes}
      />
      <img
        src={`${base}-${small}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}

export function IstClock({ compact = false }: { compact?: boolean }) {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date());
  const [time, setTime] = useState(format);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <time className="ist-clock" dateTime={time} suppressHydrationWarning>
      {compact ? `${time} IST` : `Local time · ${time} IST`}
    </time>
  );
}

export function MagneticLink({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.22;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.22;
    element.style.setProperty("--magnetic-x", `${x}px`);
    element.style.setProperty("--magnetic-y", `${y}px`);
  };

  const reset = () => {
    ref.current?.style.setProperty("--magnetic-x", "0px");
    ref.current?.style.setProperty("--magnetic-y", "0px");
  };

  return (
    <a
      ref={ref}
      className={`button button--accent magnetic ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </a>
  );
}

export function ProjectVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (reducedMotion.matches || !inView.current || userPaused.current) {
        video.pause();
        setPlaying(false);
        return;
      }

      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="project-video-shell">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/media/duckhunt/logo-360.webp"
        aria-label="Duck Hunt: Unplugged gameplay"
      >
        <source src="/media/duckhunt/demo.webm" type="video/webm" />
        <source src="/media/duckhunt/demo.mp4" type="video/mp4" />
      </video>
      <button className="video-toggle" type="button" onClick={toggle}>
        {playing ? "Pause gameplay" : "Play gameplay"}
      </button>
    </div>
  );
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  return (
    <button className="email-copy" type="button" onClick={copy}>
      <span>{email}</span>
      <span className="email-copy__action" aria-live="polite">
        {copied ? "Email copied" : "Copy email address"}
      </span>
    </button>
  );
}
