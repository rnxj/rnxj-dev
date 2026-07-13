import { useEffect, useRef } from "react";
import "./project-aperture.css";

const portraitBase = "/media/avatar/portrait-signal";

function AperturePortrait({
  alt,
  className,
  priority = false,
}: {
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <picture className={className} aria-hidden={alt ? undefined : true}>
      <source
        type="image/avif"
        srcSet={`${portraitBase}-720.avif 720w, ${portraitBase}-1254.avif 1254w`}
        sizes="(min-width: 900px) 56vw, calc(100vw - 2.5rem)"
      />
      <source
        type="image/webp"
        srcSet={`${portraitBase}-720.webp 720w, ${portraitBase}-1254.webp 1254w`}
        sizes="(min-width: 900px) 56vw, calc(100vw - 2.5rem)"
      />
      <img
        src={`${portraitBase}-720.webp`}
        alt={alt}
        width="1254"
        height="1254"
        loading="eager"
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

/**
 * Layered hero artwork. One image carries the portrait's accessible identity;
 * the signal duplicate and effects remain decorative.
 */
export function ProjectAperture() {
  const apertureRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aperture = apertureRef.current;
    const plane = planeRef.current;
    if (!aperture || !plane) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pointerTarget = aperture.closest<HTMLElement>(".hero") ?? aperture.parentElement;
    if (!pointerTarget) return;

    const resetLens = () => {
      aperture.style.removeProperty("--aperture-x");
      aperture.style.removeProperty("--aperture-y");
      delete aperture.dataset.engaged;
    };

    const updateLens = (event: PointerEvent) => {
      if (reducedMotion.matches || !finePointer.matches) return;

      const bounds = plane.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!inside) {
        resetLens();
        return;
      }

      const x = Math.min(94, Math.max(6, ((event.clientX - bounds.left) / bounds.width) * 100));
      const y = Math.min(92, Math.max(8, ((event.clientY - bounds.top) / bounds.height) * 100));

      aperture.style.setProperty("--aperture-x", `${x.toFixed(2)}%`);
      aperture.style.setProperty("--aperture-y", `${y.toFixed(2)}%`);
      aperture.dataset.engaged = "true";
    };

    const onCapabilityChange = () => {
      if (reducedMotion.matches || !finePointer.matches) resetLens();
    };

    pointerTarget.addEventListener("pointermove", updateLens, {
      passive: true,
    });
    pointerTarget.addEventListener("pointerleave", resetLens);
    reducedMotion.addEventListener("change", onCapabilityChange);
    finePointer.addEventListener("change", onCapabilityChange);

    return () => {
      pointerTarget.removeEventListener("pointermove", updateLens);
      pointerTarget.removeEventListener("pointerleave", resetLens);
      reducedMotion.removeEventListener("change", onCapabilityChange);
      finePointer.removeEventListener("change", onCapabilityChange);
    };
  }, []);

  return (
    <div ref={apertureRef} className="project-aperture">
      <div ref={planeRef} className="project-aperture__plane">
        <AperturePortrait
          alt="Stylized portrait of Reuel Nixon"
          className="project-aperture__portrait project-aperture__portrait--base"
          priority
        />
        <AperturePortrait
          alt=""
          className="project-aperture__portrait project-aperture__portrait--signal"
        />
        <span className="project-aperture__dither" aria-hidden="true" />
        <span className="project-aperture__scan" aria-hidden="true" />
        <span className="project-aperture__lens" aria-hidden="true" />
      </div>
    </div>
  );
}
