import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initializeMotion(root: HTMLElement) {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    root.classList.add("motion-ready");

    let alive = true;
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];
    const activeSplits = new Set<SplitText>();
    const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const tween = gsap.fromTo(
            element,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power4.out",
              clearProps: "transform,opacity",
            },
          );
          tweens.push(tween);
          revealObserver.unobserve(element);
        }
      },
      { rootMargin: "0px 0px 10% 0px", threshold: 0.01 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    void document.fonts.ready.then(() => {
      if (!alive) return;
      const headings = gsap.utils.toArray<HTMLElement>(
        ".flagship-copy > h2, .section-heading > h2",
        root,
      );

      headings.forEach((heading) => {
        const trigger = ScrollTrigger.create({
          trigger: heading,
          start: "top 88%",
          once: true,
          onEnter: () => {
            if (!alive) return;
            const split = SplitText.create(heading, {
              type: "lines,words",
              mask: "lines",
              linesClass: "split-line",
              wordsClass: "split-word",
              aria: "auto",
            });
            activeSplits.add(split);
            const tween = gsap.from(split.words, {
              yPercent: 105,
              duration: 0.85,
              stagger: 0.055,
              ease: "power4.out",
              onComplete: () => {
                split.revert();
                activeSplits.delete(split);
              },
            });
            tweens.push(tween);
          },
        });
        triggers.push(trigger);
      });

      ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      revealObserver.disconnect();
      tweens.forEach((tween) => tween.kill());
      triggers.forEach((trigger) => trigger.kill());
      activeSplits.forEach((split) => split.revert());
      activeSplits.clear();
      root.classList.remove("motion-ready");
    };
  });

  media.add(
    "(min-width: 900px) and (min-height: 705px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
      });

      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);
      const raf = (time: number) => lenis.raf(time * 1_000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const timelines: gsap.core.Timeline[] = [];
      root.querySelectorAll<HTMLElement>("[data-flagship]").forEach((stage) => {
        const cards = Array.from(stage.querySelectorAll<HTMLElement>(".phone-card"));
        const progress = stage.querySelector<HTMLElement>(".flagship-progress span");
        const current = stage.querySelector<HTMLElement>("[data-stage-current]");
        if (cards.length === 0) return;

        cards.forEach((card, index) => {
          gsap.set(card, {
            xPercent: index * 17,
            yPercent: index * 1.7,
            rotation: index * 3,
            scale: 1 - index * 0.025,
            opacity: Math.max(0.34, 1 - index * 0.13),
            zIndex: cards.length - index,
          });
        });

        const setProgress = progress ? gsap.quickSetter(progress, "scaleX") : undefined;
        let lastActive = 1;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress?.(self.progress);
              const active = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
              if (current && active !== lastActive) {
                current.textContent = String(active).padStart(2, "0");
                lastActive = active;
              }
            },
          },
        });

        cards.forEach((card, index) => {
          if (index === 0) return;
          const position = index / cards.length;
          timeline.to(
            cards[index - 1],
            {
              xPercent: -72,
              yPercent: -3,
              rotation: -7,
              scale: 0.84,
              opacity: 0.14,
              zIndex: index,
              duration: 0.16,
            },
            position,
          );
          timeline.to(
            card,
            {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              zIndex: cards.length + 1,
              duration: 0.18,
            },
            position,
          );
        });

        timelines.push(timeline);
      });

      return () => {
        timelines.forEach((timeline) => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        });
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    },
  );

  return () => media.revert();
}
