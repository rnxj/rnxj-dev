import { type CSSProperties, type RefObject, useEffect, useRef, useState } from "react";
import { luxe, victoriousMinistries } from "./content";
import "./flagship-stories.css";

type StoryScreen = {
  alt: string;
  id: string;
  label: string;
  media: string;
};

type StoryActivationDetail = {
  chapter?: string;
  index?: number;
};

type IndexedStyle = CSSProperties & {
  "--screen-order": number;
};

const luxeScreens: readonly StoryScreen[] = [
  { id: "home", label: "Home", media: "01-home", alt: "Luxe resident app home screen" },
  {
    id: "packages",
    label: "Packages",
    media: "02-packages",
    alt: "Luxe resident app packages screen",
  },
  {
    id: "amenities",
    label: "Amenities",
    media: "03-amenities",
    alt: "Luxe resident app amenities screen",
  },
  {
    id: "community",
    label: "Community",
    media: "04-community",
    alt: "Luxe resident app community screen",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    media: "05-maintenance",
    alt: "Luxe resident app maintenance screen",
  },
] as const;

const ministryScreens: readonly StoryScreen[] = [
  {
    id: "scripture",
    label: "Scripture",
    media: "01-verses",
    alt: "Victorious Ministries scripture screen",
  },
  {
    id: "videos",
    label: "Videos",
    media: "02-videos",
    alt: "Victorious Ministries videos screen",
  },
  {
    id: "magazine",
    label: "Magazine",
    media: "03-magazine",
    alt: "Victorious Ministries magazine screen",
  },
  {
    id: "schedule",
    label: "Schedule",
    media: "04-schedule",
    alt: "Victorious Ministries schedule screen",
  },
  {
    id: "video-detail",
    label: "Video detail",
    media: "05-video-detail",
    alt: "Victorious Ministries video detail screen",
  },
  {
    id: "settings",
    label: "Settings",
    media: "06-settings",
    alt: "Victorious Ministries settings screen",
  },
] as const;

function StoryPicture({
  alt,
  base,
  height,
  sizes,
  widths,
  width,
}: {
  alt: string;
  base: string;
  height: number;
  sizes: string;
  widths: readonly [number, number];
  width: number;
}) {
  const [small, large] = widths;

  return (
    <picture>
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
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function StoryIcon({ alt, base }: { alt: string; base: string }) {
  return (
    <picture className="fs-icon">
      <source type="image/avif" srcSet={`${base}.avif`} />
      <img src={`${base}.webp`} width="256" height="256" alt={alt} loading="lazy" />
    </picture>
  );
}

function StoryMetrics({ facts }: { facts: ReadonlyArray<readonly [string, string]> }) {
  return (
    <dl className="fs-metrics" aria-label="Project scale">
      {facts.map(([value, label]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StoryCopy({ kind }: { kind: "luxe" | "ministries" }) {
  const project = kind === "luxe" ? luxe : victoriousMinistries;

  return (
    <div className="fs-copy">
      <div className="fs-kicker">
        <StoryIcon
          alt={`${project.name} app icon`}
          base={kind === "luxe" ? "/media/luxe/icon-256" : "/media/victorious-ministries/icon-256"}
        />
        <div>
          <p className="fs-eyebrow">Flagship · {kind === "luxe" ? "01" : "02"}</p>
          <p className="fs-status">{project.status}</p>
        </div>
      </div>

      <h2 id={kind === "luxe" ? "luxe-title" : "victorious-ministries-title"}>{project.name}</h2>
      <p className="fs-lede">{project.description}</p>
      <StoryMetrics facts={project.facts} />
      <p className="fs-detail">{project.detail}</p>
      {kind === "luxe" ? <p className="fs-storage">{luxe.storage}</p> : null}
      <ul className="fs-stack" aria-label="Technologies used">
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="fs-links">
        <a
          className="fs-link"
          href={kind === "luxe" ? "/work/luxe-pms/" : "/work/victorious-ministries/"}
        >
          Read the {project.name} case study <span aria-hidden="true">→</span>
        </a>
        <a className="fs-link" href={project.live} target="_blank" rel="noreferrer">
          {kind === "luxe" ? "Open invite-only admin portal" : "View app landing page"}{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

function useStoryActivation(
  storyRef: RefObject<HTMLElement | null>,
  screens: readonly StoryScreen[],
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const activate = (event: Event) => {
      const { detail } = event as CustomEvent<StoryActivationDetail>;
      const requestedIndex =
        typeof detail?.index === "number"
          ? detail.index
          : screens.findIndex((screen) => screen.id === detail?.chapter);

      if (requestedIndex >= 0 && requestedIndex < screens.length) {
        setActiveIndex(requestedIndex);
      }
    };

    story.addEventListener("flagship:activate", activate);
    return () => story.removeEventListener("flagship:activate", activate);
  }, [screens, storyRef]);

  return [activeIndex, setActiveIndex] as const;
}

function useDesktopStoryLayout() {
  const [desktopLayout, setDesktopLayout] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 56.25rem)");
    const update = () => setDesktopLayout(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktopLayout;
}

function ChapterRail({
  activeIndex,
  onSelect,
  screens,
  storyId,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  screens: readonly StoryScreen[];
  storyId: string;
}) {
  return (
    <ol className="fs-chapters" aria-label="App screens">
      {screens.map((screen, index) => (
        <li key={screen.id}>
          <button
            type="button"
            className={index === activeIndex ? "is-active" : undefined}
            data-story-trigger
            data-chapter={screen.id}
            aria-controls={`${storyId}-panel-${screen.id}`}
            aria-pressed={index === activeIndex}
            onClick={() => onSelect(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {screen.label}
          </button>
        </li>
      ))}
    </ol>
  );
}

function StoryDevice({
  activeIndex,
  base,
  screens,
  sourceHeight,
  sourceWidth,
  storyId,
  widths,
}: {
  activeIndex: number;
  base: string;
  screens: readonly StoryScreen[];
  sourceHeight: number;
  sourceWidth: number;
  storyId: string;
  widths: readonly [number, number];
}) {
  const desktopLayout = useDesktopStoryLayout();

  return (
    <div className="fs-device" data-story-device>
      <span className="fs-device__button fs-device__button--top" aria-hidden="true" />
      <span className="fs-device__button fs-device__button--bottom" aria-hidden="true" />
      <div className="fs-device__deck">
        {screens.map((screen, index) => {
          const active = index === activeIndex;

          return (
            <figure
              className={`fs-screen${active ? " is-active" : ""}`}
              key={screen.id}
              id={`${storyId}-panel-${screen.id}`}
              aria-hidden={desktopLayout && !active ? true : undefined}
              data-story-screen
              data-chapter={screen.id}
              data-state={active ? "active" : "inactive"}
              style={{ "--screen-order": index } as IndexedStyle}
            >
              <StoryPicture
                alt={screen.alt}
                base={`${base}/${screen.media}`}
                width={sourceWidth}
                height={sourceHeight}
                widths={widths}
                sizes="(min-width: 900px) 20rem, 72vw"
              />
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {screen.label}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export function LuxeStory() {
  const storyRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useStoryActivation(storyRef, luxeScreens);
  const selectChapter = (index: number) => {
    setActiveIndex(index);
    storyRef.current?.dispatchEvent(
      new CustomEvent("flagship:navigate", {
        detail: { index },
      }),
    );
  };

  return (
    <section
      ref={storyRef}
      className="fs-story fs-story--luxe"
      id="luxe"
      data-flagship-story
      data-story="luxe"
      data-active-chapter={luxeScreens[activeIndex].id}
      data-active-index={activeIndex}
      aria-labelledby="luxe-title"
    >
      <div className="fs-story__track" data-story-track>
        <div className="fs-story__stage" data-story-stage>
          <StoryCopy kind="luxe" />

          <div className="fs-showcase fs-showcase--luxe" aria-label="Luxe app screens">
            <StoryDevice
              activeIndex={activeIndex}
              base="/media/luxe"
              screens={luxeScreens}
              widths={[440, 660]}
              sourceWidth={1320}
              sourceHeight={2868}
              storyId="luxe"
            />
            <ChapterRail
              activeIndex={activeIndex}
              onSelect={selectChapter}
              screens={luxeScreens}
              storyId="luxe"
            />
          </div>
          <div className="fs-story__progress" aria-hidden="true">
            <span data-story-progress />
          </div>
        </div>
      </div>
    </section>
  );
}

export function VictoriousMinistriesStory() {
  const storyRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useStoryActivation(storyRef, ministryScreens);
  const [signalFired, setSignalFired] = useState(false);
  const selectChapter = (index: number) => {
    setActiveIndex(index);
    storyRef.current?.dispatchEvent(
      new CustomEvent("flagship:navigate", {
        detail: { index },
      }),
    );
  };

  useEffect(() => {
    const story = storyRef.current;
    if (!story || signalFired) return;
    const signalTarget = story.querySelector<HTMLElement>("[data-story-stage]") ?? story;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSignalFired(true);
        observer.disconnect();
      },
      { threshold: 0.38 },
    );

    observer.observe(signalTarget);
    return () => observer.disconnect();
  }, [signalFired]);

  return (
    <section
      ref={storyRef}
      className="fs-story fs-story--vm"
      id="victorious-ministries"
      data-flagship-story
      data-story="victorious-ministries"
      data-active-chapter={ministryScreens[activeIndex].id}
      data-active-index={activeIndex}
      data-signal-fired={signalFired}
      aria-labelledby="victorious-ministries-title"
    >
      <div className="fs-story__track" data-story-track>
        <div className="fs-story__stage fs-story__stage--reverse" data-story-stage>
          <StoryCopy kind="ministries" />

          <div className="fs-showcase fs-showcase--vm" aria-label="Victorious Ministries screens">
            <div className="fs-signal" aria-hidden="true">
              <span className="fs-signal__ring fs-signal__ring--one" />
              <span className="fs-signal__ring fs-signal__ring--two" />
              <span className="fs-signal__ring fs-signal__ring--three" />
            </div>
            <StoryDevice
              activeIndex={activeIndex}
              base="/media/victorious-ministries"
              screens={ministryScreens}
              widths={[428, 642]}
              sourceWidth={1284}
              sourceHeight={2778}
              storyId="victorious-ministries"
            />
            <ChapterRail
              activeIndex={activeIndex}
              onSelect={selectChapter}
              screens={ministryScreens}
              storyId="victorious-ministries"
            />
          </div>
          <div className="fs-story__progress" aria-hidden="true">
            <span data-story-progress />
          </div>
        </div>
      </div>
    </section>
  );
}
