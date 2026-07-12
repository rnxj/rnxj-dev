import { Analytics } from "@vercel/analytics/react";
import { useEffect, useRef } from "react";
import {
  CopyEmail,
  IstClock,
  MagneticLink,
  PhoneFrame,
  ProjectVideo,
  ResponsivePicture,
  SignalField,
} from "./components";
import {
  education,
  experience,
  identity,
  luxe,
  projects,
  skills,
  victoriousMinistries,
} from "./content";

function AppIcon({ alt, base }: { alt: string; base: string }) {
  return (
    <picture className="app-icon">
      <source type="image/avif" srcSet={`${base}.avif`} />
      <img src={`${base}.webp`} width="256" height="256" alt={alt} loading="lazy" />
    </picture>
  );
}

function SectionHeading({ eyebrow, id, title }: { eyebrow: string; id: string; title: string }) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
    </header>
  );
}

function Metrics({ facts }: { facts: ReadonlyArray<readonly [string, string]> }) {
  return (
    <dl className="metrics" aria-label="Project scale">
      {facts.map(([value, label]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectLinks({ live, name, source }: { live?: string; name: string; source?: string }) {
  return (
    <div className="project-links">
      {live ? (
        <a href={live} target="_blank" rel="noreferrer" aria-label={`View ${name} live`}>
          Live <span aria-hidden="true">↗</span>
        </a>
      ) : null}
      {source ? (
        <a href={source} target="_blank" rel="noreferrer" aria-label={`View ${name} source code`}>
          Source <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  );
}

function LuxeStory() {
  return (
    <section
      className="flagship-runway flagship-runway--luxe"
      id="luxe"
      data-flagship
      aria-labelledby="luxe-title"
    >
      <div className="flagship-stage">
        <div className="flagship-copy">
          <div className="flagship-kicker">
            <AppIcon alt="Luxe app icon" base="/media/luxe/icon-256" />
            <div>
              <p className="eyebrow">Flagship · 01</p>
              <p className="status-label">{luxe.status}</p>
            </div>
          </div>
          <h2 id="luxe-title">{luxe.name}</h2>
          <p className="flagship-lede">{luxe.description}</p>
          <Metrics facts={luxe.facts} />
          <p className="flagship-detail">{luxe.detail}</p>
          <p className="storage-note">{luxe.storage}</p>
          <ul className="stack-list" aria-label="Technologies used">
            {luxe.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="text-link" href={luxe.live} target="_blank" rel="noreferrer">
            Open live app <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="phone-stage" data-phone-stack role="group" aria-label="Luxe app screens">
          {luxe.screens.map((screen, index) => (
            <PhoneFrame
              key={screen}
              className={`phone-card phone-card--${index + 1}`}
              alt={`Luxe resident app ${screen.slice(3).replaceAll("-", " ")} screen`}
              base={`/media/luxe/${screen}`}
              widths={[440, 660]}
              sourceWidth={1320}
              sourceHeight={2868}
            />
          ))}
          <div className="stage-counter" aria-hidden="true">
            <span data-stage-current>01</span>
            <span>/ 05</span>
          </div>
        </div>
        <div className="flagship-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

function VictoriousMinistriesStory() {
  return (
    <section
      className="flagship-runway flagship-runway--vm"
      id="victorious-ministries"
      data-flagship
      aria-labelledby="victorious-ministries-title"
    >
      <div className="flagship-stage">
        <div className="flagship-copy">
          <div className="flagship-kicker">
            <AppIcon
              alt="Victorious Ministries app icon"
              base="/media/victorious-ministries/icon-256"
            />
            <div>
              <p className="eyebrow">Flagship · 02</p>
              <p className="status-label">{victoriousMinistries.status}</p>
            </div>
          </div>
          <h2 id="victorious-ministries-title">{victoriousMinistries.name}</h2>
          <p className="flagship-lede">{victoriousMinistries.description}</p>
          <Metrics facts={victoriousMinistries.facts} />
          <p className="flagship-detail">{victoriousMinistries.detail}</p>
          <ul className="stack-list" aria-label="Technologies used">
            {victoriousMinistries.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a
            className="text-link"
            href={victoriousMinistries.live}
            target="_blank"
            rel="noreferrer"
          >
            Open landing page <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div
          className="phone-stage"
          data-phone-stack
          role="group"
          aria-label="Victorious Ministries app screens"
        >
          {victoriousMinistries.screens.map((screen, index) => (
            <PhoneFrame
              key={screen}
              className={`phone-card phone-card--${index + 1}`}
              alt={`Victorious Ministries ${screen.slice(3).replaceAll("-", " ")} screen`}
              base={`/media/victorious-ministries/${screen}`}
              widths={[428, 642]}
              sourceWidth={1284}
              sourceHeight={2778}
            />
          ))}
          <div className="stage-counter" aria-hidden="true">
            <span data-stage-current>01</span>
            <span>/ 06</span>
          </div>
        </div>
        <div className="flagship-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

function SecondaryWork() {
  return (
    <section className="section secondary-work" aria-labelledby="more-work-title">
      <div className="section-frame">
        <SectionHeading
          eyebrow="More shipped work"
          id="more-work-title"
          title="Products, tools, and experiments."
        />
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-row" key={project.name} data-reveal>
              <div className="project-row__meta">
                <span>{project.index}</span>
                <ul aria-label="Technologies used">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="project-row__copy">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {"subline" in project ? <p className="project-subline">{project.subline}</p> : null}
                <ProjectLinks
                  live={"live" in project ? project.live : undefined}
                  name={project.name}
                  source={"source" in project ? project.source : undefined}
                />
              </div>
              <div className="project-row__media">
                {project.media === "video" ? <ProjectVideo /> : null}
                {project.media === "phonepe" ? (
                  <ResponsivePicture
                    alt="PhonePe Payment Gateway interface"
                    base="/media/projects/phonepe"
                    widths={[720, 1440]}
                    width={3382}
                    height={2102}
                    sizes="(min-width: 900px) 38vw, 100vw"
                  />
                ) : null}
                {project.media === "warewise" ? (
                  <ResponsivePicture
                    alt="Warewise workflow automation interface"
                    base="/media/projects/warewise"
                    widths={[720, 1440]}
                    width={3352}
                    height={2052}
                    sizes="(min-width: 900px) 38vw, 100vw"
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Experience"
          id="experience-title"
          title="Building systems end to end."
        />
        <div className="experience-ledger">
          {experience.map((item) => (
            <article className="experience-row" key={item.company}>
              <div className="experience-date">
                <span>{item.dates}</span>
                <span>{item.location}</span>
              </div>
              <div className="experience-copy">
                <h3>
                  {item.role} <span>at {item.company}</span>
                </h3>
                <p>{item.highlights[0]}</p>
                {item.highlights.length > 1 ? (
                  <details>
                    <summary>More scope</summary>
                    <ul>
                      {item.highlights.slice(1).map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </article>
          ))}
          <article className="experience-row education-row">
            <div className="experience-date">
              <span>{education.dates}</span>
              <span>{education.result}</span>
            </div>
            <div className="experience-copy">
              <h3>
                {education.program} <span>at {education.institution}</span>
              </h3>
            </div>
          </article>
        </div>
        <a className="resume-link text-link" href="/resume.pdf" download>
          Download résumé <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="section-frame">
        <SectionHeading eyebrow="Skills" id="skills-title" title="What I build with." />
        <div className="skills-ledger">
          {skills.map(([category, items]) => (
            <div className="skills-row" key={category}>
              <h3>{category}</h3>
              <p>{items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-glow" aria-hidden="true" />
      <div className="section-frame contact-inner">
        <div className="contact-status">
          <span className="availability">
            <span aria-hidden="true" />
            Available for work
          </span>
          <IstClock />
          <span>{identity.location}</span>
        </div>
        <h2 id="contact-title">
          <span>{identity.tagline[0]}</span>
          <span>{identity.tagline[1]}</span>
          <span className="accent-text">{identity.tagline[2]}</span>
        </h2>
        <p className="contact-lede">{identity.positioning}</p>
        <CopyEmail email={identity.email} />
        <div className="contact-actions">
          <MagneticLink href={identity.links.schedule}>Schedule a call ↗</MagneticLink>
          <a className="button button--ghost" href={`mailto:${identity.email}`}>
            Open email
          </a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionAllowed = window.matchMedia(
      "(min-width: 900px) and (min-height: 705px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!motionAllowed.matches) return;

    let cleanup: (() => void) | undefined;
    let disposed = false;
    const start = () => {
      void import("./motion").then(({ initializeMotion }) => {
        if (disposed || !appRef.current) return;
        cleanup = initializeMotion(appRef.current);
      });
    };

    const idleCallback = window.requestIdleCallback?.(start, { timeout: 1_200 });
    const timeout = idleCallback === undefined ? window.setTimeout(start, 300) : undefined;

    return () => {
      disposed = true;
      if (idleCallback !== undefined) window.cancelIdleCallback?.(idleCallback);
      if (timeout !== undefined) window.clearTimeout(timeout);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={appRef} className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Reuel Nixon, home">
          RNXJ<span>.</span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-meta">
          <span className="availability">
            <span aria-hidden="true" />
            Available for work
          </span>
          <IstClock compact />
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <SignalField />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <div className="hero-intro">
              <p>{identity.role}</p>
              <p>{identity.location}</p>
            </div>
            <h1 id="hero-title" aria-label={identity.name}>
              <span className="hero-line">
                <span>REUEL</span>
              </span>
              <span className="hero-line hero-line--offset">
                <span>NIXON</span>
              </span>
            </h1>
            <div className="hero-footer">
              <p>{identity.positioning}</p>
              <figure className="portrait-card">
                <ResponsivePicture
                  alt="Portrait of Reuel Nixon"
                  base="/media/avatar/avatar"
                  widths={[320, 640]}
                  width={1696}
                  height={1696}
                  sizes="(min-width: 900px) 11vw, 28vw"
                  loading="eager"
                />
                <figcaption>Reuel Nixon</figcaption>
              </figure>
              <a className="scroll-cue" href="#work">
                Selected work <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <div id="work">
          <LuxeStory />
          <VictoriousMinistriesStory />
          <SecondaryWork />
        </div>
        <Experience />
        <Skills />
        <Contact />
      </main>

      <footer className="site-footer">
        <div className="footer-identity">
          <span>© {new Date().getFullYear()} Reuel Nixon</span>
          <a href="/resume.pdf" download>
            Résumé ↓
          </a>
        </div>
        <nav aria-label="Social links">
          <a href={identity.links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={identity.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={identity.links.x} target="_blank" rel="noreferrer">
            X ↗
          </a>
          <a href={identity.links.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </nav>
        <a href="#top">Back to top ↑</a>
      </footer>
      <Analytics />
    </div>
  );
}
