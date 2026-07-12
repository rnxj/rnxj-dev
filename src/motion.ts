import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initializeMotion(root: HTMLElement) {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    let alive = true;
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];
    const activeSplits = new Set<SplitText>();
    const preparedElements = new Set<HTMLElement>();
    const isUnseen = (element: HTMLElement) =>
      element.getBoundingClientRect().top >= window.innerHeight;
    const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const tween = gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
            clearProps: "transform,opacity",
            onComplete: () => preparedElements.delete(element),
          });
          tweens.push(tween);
          revealObserver.unobserve(element);
        }
      },
      { rootMargin: "0px 0px 10% 0px", threshold: 0.01 },
    );

    revealElements.forEach((element) => {
      if (!isUnseen(element)) return;
      gsap.set(element, { y: 22, opacity: 0 });
      preparedElements.add(element);
      revealObserver.observe(element);
    });

    void document.fonts.ready.then(() => {
      if (!alive) return;
      const headings = gsap.utils.toArray<HTMLElement>(
        ".fs-copy > h2, .section-heading > h2",
        root,
      );

      headings.forEach((heading) => {
        if (!isUnseen(heading)) return;
        gsap.set(heading, { opacity: 0 });
        preparedElements.add(heading);

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
            gsap.set(split.words, { yPercent: 105 });
            gsap.set(heading, { opacity: 1 });
            const tween = gsap.to(split.words, {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.055,
              ease: "power4.out",
              onComplete: () => {
                split.revert();
                activeSplits.delete(split);
                gsap.set(heading, { clearProps: "opacity" });
                preparedElements.delete(heading);
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
      preparedElements.forEach((element) => {
        gsap.set(element, { clearProps: "transform,opacity" });
      });
      preparedElements.clear();
    };
  });

  media.add(
    "(min-width: 900px) and (min-height: 801px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
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

      const storyTriggers: ScrollTrigger[] = [];
      const navigationCleanups: Array<() => void> = [];
      root.querySelectorAll<HTMLElement>("[data-flagship-story]").forEach((story) => {
        const track = story.querySelector<HTMLElement>("[data-story-track]");
        const progressBar = story.querySelector<HTMLElement>("[data-story-progress]");
        const progressShell = progressBar?.parentElement;
        const chapterCount = story.querySelectorAll("[data-story-screen]").length;
        if (!track || chapterCount === 0) return;

        if (progressBar) progressBar.style.transform = "scaleX(0)";

        const activate = (index: number) => {
          if (Number(story.dataset.activeIndex) === index) return;
          story.dispatchEvent(
            new CustomEvent("flagship:activate", {
              detail: { index },
            }),
          );
        };

        const navigate = (event: Event) => {
          const { detail } = event as CustomEvent<{ index?: number }>;
          if (typeof detail?.index !== "number") return;
          const index = Math.min(chapterCount - 1, Math.max(0, detail.index));
          const trackTop = window.scrollY + track.getBoundingClientRect().top;
          const scrollRange = Math.max(0, track.offsetHeight - window.innerHeight);
          const chapterCenter = (index + 0.5) / chapterCount;
          lenis.scrollTo(trackTop + scrollRange * chapterCenter, {
            duration: 0.72,
          });
        };

        story.addEventListener("flagship:navigate", navigate);
        navigationCleanups.push(() => story.removeEventListener("flagship:navigate", navigate));

        storyTriggers.push(
          ScrollTrigger.create({
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onToggle: (self) => {
              if (progressShell) progressShell.style.opacity = self.isActive ? "1" : "0";
            },
            onUpdate: (self) => {
              if (progressBar) progressBar.style.transform = `scaleX(${self.progress})`;
              const nextIndex = Math.min(
                chapterCount - 1,
                Math.floor(self.progress * chapterCount),
              );
              activate(nextIndex);
            },
          }),
        );
      });

      return () => {
        navigationCleanups.forEach((cleanup) => cleanup());
        storyTriggers.forEach((trigger) => trigger.kill());
        root.querySelectorAll<HTMLElement>("[data-story-progress]").forEach((progressBar) => {
          progressBar.style.removeProperty("transform");
          progressBar.parentElement?.style.removeProperty("opacity");
        });
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    },
  );

  return () => media.revert();
}
