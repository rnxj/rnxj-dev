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

type PhoneFrameProps = {
  alt: string;
  base: string;
  className?: string;
  sizes?: string;
  widths: readonly [number, number];
  sourceHeight: number;
  sourceWidth: number;
};

export function PhoneFrame({
  alt,
  base,
  className,
  sizes = "(min-width: 900px) 19vw, 72vw",
  sourceHeight,
  sourceWidth,
  widths,
}: PhoneFrameProps) {
  return (
    <figure className={`phone-frame ${className ?? ""}`}>
      <span className="phone-button phone-button--top" aria-hidden="true" />
      <span className="phone-button phone-button--bottom" aria-hidden="true" />
      <div className="phone-screen">
        <ResponsivePicture
          alt={alt}
          base={base}
          width={sourceWidth}
          height={sourceHeight}
          widths={widths}
          sizes={sizes}
        />
      </div>
    </figure>
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

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const pointerTarget = canvas.closest<HTMLElement>(".hero") ?? canvas;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let visible = true;
    const pointer = { x: -1_000, y: -1_000, targetX: -1_000, targetY: -1_000 };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      const lanes = Math.max(11, Math.floor(height / 52));
      const spacing = height / (lanes + 1);
      const step = 22;

      for (let lane = 0; lane < lanes; lane += 1) {
        const baseY = spacing * (lane + 1);
        const emphasized = lane === Math.floor(lanes * 0.58);
        context.beginPath();

        for (let x = -step; x <= width + step; x += step) {
          const dx = x - pointer.x;
          const dy = baseY - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          const influence = Math.exp(-distanceSquared / 42_000);
          const direction = dy === 0 ? 1 : dy / Math.max(Math.abs(dy), 24);
          const ambient = Math.sin(x * 0.012 + lane * 0.72 + time * 0.00035) * 2.2;
          const y = baseY + ambient + influence * direction * 42;
          if (x === -step) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle = emphasized
          ? "rgba(216, 255, 62, 0.42)"
          : "rgba(228, 235, 218, 0.105)";
        context.stroke();
      }

      context.fillStyle = "rgba(216, 255, 62, 0.75)";
      const markerX = width * 0.72;
      const markerY = spacing * (Math.floor(lanes * 0.58) + 1);
      context.fillRect(markerX, markerY - 2, 18, 4);
    };

    const tick = (time: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.085;
      pointer.y += (pointer.targetY - pointer.y) * 0.085;
      draw(time);
      if (visible && !reducedMotion.matches && finePointer.matches) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
    };

    const onPointerLeave = () => {
      pointer.targetX = -1_000;
      pointer.targetY = height * 0.5;
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches || !finePointer.matches) draw();
      else animationFrame = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else window.cancelAnimationFrame(animationFrame);
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    pointerTarget.addEventListener("pointermove", onPointerMove);
    pointerTarget.addEventListener("pointerleave", onPointerLeave);
    reducedMotion.addEventListener("change", start);
    finePointer.addEventListener("change", start);
    resize();
    start();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      pointerTarget.removeEventListener("pointerleave", onPointerLeave);
      reducedMotion.removeEventListener("change", start);
      finePointer.removeEventListener("change", start);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />;
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
        {copied ? "Copied" : "Copy email"}
      </span>
    </button>
  );
}
