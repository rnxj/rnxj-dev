import { Fragment, useEffect, useRef } from "react";
import { CopyEmail, IstClock, MagneticLink, ProjectVideo, ResponsivePicture } from "./components";
import { education, experience, identity, projects, skills } from "./content";
import { LuxeStory, VictoriousMinistriesStory } from "./FlagshipStories";
import { ProjectAperture } from "./ProjectAperture";

function SectionHeading({ eyebrow, id, title }: { eyebrow: string; id: string; title: string }) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
    </header>
  );
}

function SkillLabel({ value }: { value: string }) {
  const parts = value.split("/");

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? (
        <>
          /<wbr />
        </>
      ) : null}
    </Fragment>
  ));
}

function ProjectLinks({
  live,
  liveLabel,
  name,
  source,
}: {
  live?: string;
  liveLabel: string;
  name: string;
  source?: string;
}) {
  return (
    <div className="project-links">
      {live ? (
        <a href={live} target="_blank" rel="noreferrer" aria-label={`${liveLabel}: ${name}`}>
          {liveLabel} <span aria-hidden="true">↗</span>
        </a>
      ) : null}
      {source ? (
        <a href={source} target="_blank" rel="noreferrer" aria-label={`View ${name} source code`}>
          View source <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  );
}

function SecondaryWork() {
  return (
    <section className="section secondary-work" aria-labelledby="more-work-title">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Selected projects"
          id="more-work-title"
          title="A few more things I’ve built."
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
                  liveLabel={project.liveLabel}
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
                    width={3400}
                    height={1958}
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
          title="From product surfaces to infrastructure."
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
                  <details className="experience-details">
                    <summary>
                      <span>Additional scope</span>
                      <span className="experience-summary-meta">
                        <span>{item.highlights.length - 1} details</span>
                        <span className="experience-summary-icon" aria-hidden="true" />
                      </span>
                    </summary>
                    <ul className="experience-detail-list">
                      {item.highlights.slice(1).map((highlight, index) => (
                        <li key={highlight}>
                          <span className="experience-detail-index" aria-hidden="true">
                            {String(index + 2).padStart(2, "0")}
                          </span>
                          <span>{highlight}</span>
                        </li>
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
        <a
          className="resume-link text-link"
          href="/Reuel-Nixon-Resume.pdf"
          download="Reuel-Nixon-Resume.pdf"
        >
          Download Reuel Nixon’s résumé <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="section-frame">
        <SectionHeading eyebrow="Skills" id="skills-title" title="The stack behind the work." />
        <div className="skills-ledger">
          {skills.map(([category, items]) => (
            <div className="skills-row" key={category}>
              <h3>{category}</h3>
              <ul className="skills-list" aria-label={`${category} skills`}>
                {items.map((item, index) => (
                  <li key={item}>
                    <span className="skill-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <SkillLabel value={item} />
                    </span>
                  </li>
                ))}
              </ul>
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
        <CopyEmail email={identity.email} />
        <div className="contact-actions">
          <MagneticLink href={identity.links.schedule}>Schedule a call ↗</MagneticLink>
          <a className="button button--ghost" href={`mailto:${identity.email}`}>
            Email me
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
      "(min-width: 900px) and (min-height: 801px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let cleanup: (() => void) | undefined;
    let disposed = false;
    let loading = false;
    let idleCallback: number | undefined;
    let timeout: number | undefined;

    const cancelScheduled = () => {
      if (idleCallback !== undefined) window.cancelIdleCallback?.(idleCallback);
      if (timeout !== undefined) window.clearTimeout(timeout);
      idleCallback = undefined;
      timeout = undefined;
    };

    const start = () => {
      cancelScheduled();
      if (disposed || loading || cleanup || !motionAllowed.matches) return;
      loading = true;
      void import("./motion")
        .then(({ initializeMotion }) => {
          if (disposed || !motionAllowed.matches || !appRef.current) return;
          cleanup = initializeMotion(appRef.current);
        })
        .finally(() => {
          loading = false;
        });
    };

    const schedule = () => {
      cancelScheduled();
      if (disposed || cleanup || loading || !motionAllowed.matches) return;
      idleCallback = window.requestIdleCallback?.(start, { timeout: 1_200 });
      if (idleCallback === undefined) timeout = window.setTimeout(start, 300);
    };

    const syncMotion = () => {
      if (motionAllowed.matches) {
        schedule();
        return;
      }

      cancelScheduled();
      cleanup?.();
      cleanup = undefined;
    };

    motionAllowed.addEventListener("change", syncMotion);
    syncMotion();

    return () => {
      disposed = true;
      motionAllowed.removeEventListener("change", syncMotion);
      cancelScheduled();
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
          <ProjectAperture />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <div className="hero-title-group">
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
            </div>
            <div className="hero-footer">
              <p>{identity.heroPositioning}</p>
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
          <a href="/Reuel-Nixon-Resume.pdf" download="Reuel-Nixon-Resume.pdf">
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
    </div>
  );
}
