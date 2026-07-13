import { IstClock, MagneticLink } from "./components";
import { caseStudies, type CaseStudy, type CaseStudyGalleryImage } from "./case-studies";
import { identity } from "./content";

function CasePicture({ image }: { image: CaseStudyGalleryImage }) {
  const [small, large] = image.widths;
  const sizes =
    image.width > image.height ? "(min-width: 900px) 82vw, 100vw" : "(min-width: 900px) 25vw, 72vw";

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${image.base}-${small}.avif ${small}w, ${image.base}-${large}.avif ${large}w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${image.base}-${small}.webp ${small}w, ${image.base}-${large}.webp ${large}w`}
        sizes={sizes}
      />
      <img
        src={`${image.base}-${small}.webp`}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function CaseVisual({ study }: { study: CaseStudy }) {
  if (study.visual === "duckhunt") {
    return (
      <figure className="case-visual case-visual--duckhunt">
        <video
          controls
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/duckhunt/logo-360.webp"
          aria-label="Duck Hunt: Unplugged hand-tracking gameplay"
        >
          <source src="/media/duckhunt/demo.webm" type="video/webm" />
          <source src="/media/duckhunt/demo.mp4" type="video/mp4" />
        </video>
        <figcaption>No controller needed. Just your webcam and a pinch.</figcaption>
      </figure>
    );
  }

  if (study.visual === "phonepe") {
    return (
      <figure className="case-visual case-visual--wide">
        <CasePicture image={study.gallery[0]} />
        <figcaption>Payment initiation, verification, callbacks, and result states.</figcaption>
      </figure>
    );
  }

  return (
    <div
      className="case-visual case-visual--phones"
      role="group"
      aria-label={`${study.name} app screens`}
    >
      {study.gallery.map((image) => (
        <figure className="case-phone" key={image.base}>
          <CasePicture image={image} />
        </figure>
      ))}
    </div>
  );
}

function CaseHeader() {
  return (
    <header className="site-header case-header">
      <a className="wordmark" href="/" aria-label="RNXJ. — Reuel Nixon, home">
        RNXJ<span>.</span>
      </a>
      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="/#work">Work</a>
        <a href="/#experience">Experience</a>
        <a href="/#skills">Skills</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div className="header-meta">
        <span className="availability">
          <span aria-hidden="true" />
          Available for work
        </span>
        <IstClock compact />
      </div>
    </header>
  );
}

function MoreWork({ study }: { study: CaseStudy }) {
  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug);
  const previous = caseStudies[(currentIndex - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <nav className="case-more" aria-label="More engineering case studies">
      <a href={previous.path}>
        <span>Previous case study</span>
        <strong>{previous.name}</strong>
      </a>
      <a href={next.path}>
        <span>Next case study</span>
        <strong>{next.name}</strong>
      </a>
    </nav>
  );
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    <div className="site-shell case-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <CaseHeader />

      <main id="main-content" tabIndex={-1}>
        <article>
          <header className="case-hero">
            <div className="case-hero__grid" aria-hidden="true" />
            <div className="case-frame case-hero__inner">
              <nav className="case-breadcrumbs" aria-label="Breadcrumb">
                <a href="/">Reuel Nixon</a>
                <span aria-hidden="true">/</span>
                <a href="/#work">Selected work</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{study.name}</span>
              </nav>

              <div className="case-hero__title">
                <div>
                  <p className="eyebrow">
                    {study.eyebrow} · {study.index}
                  </p>
                  <p className="case-status">{study.status}</p>
                </div>
                <h1>{study.name}</h1>
              </div>

              <div className="case-hero__summary">
                <p>{study.description}</p>
                <div className="case-actions">
                  {study.links.map((link) => (
                    <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>

              <dl className="case-facts" aria-label="Project facts">
                {study.facts.map(([value, label]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </header>

          <div className="case-frame case-visual-wrap">
            <CaseVisual study={study} />
          </div>

          <div className="case-frame case-body">
            <aside className="case-stack" aria-labelledby="case-stack-title">
              <p className="eyebrow" id="case-stack-title">
                Built with
              </p>
              <ul>
                {study.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>

            <div className="case-narrative">
              {study.sections.map((section, index) => (
                <section key={section.title} aria-labelledby={`case-section-${index}`}>
                  <span className="case-section-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 id={`case-section-${index}`}>{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>

        <div className="case-frame">
          <MoreWork study={study} />
        </div>

        <section className="case-contact" aria-labelledby="case-contact-title">
          <div className="case-frame case-contact__inner">
            <p className="eyebrow">Available for work</p>
            <h2 id="case-contact-title">
              Build fast. Understand deeply. <span>Keep shipping.</span>
            </h2>
            <p>Available for full-stack product engineering work and freelance projects.</p>
            <div className="contact-actions">
              <MagneticLink href={identity.links.schedule}>Schedule a call ↗</MagneticLink>
              <a className="button button--ghost" href={`mailto:${identity.email}`}>
                Email me
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-identity">
          <span>© {new Date().getFullYear()} Reuel Nixon</span>
          <a href="/Reuel-Nixon-Resume.pdf" download="Reuel-Nixon-Resume.pdf">
            Résumé ↓
          </a>
        </div>
        <nav aria-label="Social links">
          <a href={identity.links.github} target="_blank" rel="me noreferrer">
            GitHub ↗
          </a>
          <a href={identity.links.linkedin} target="_blank" rel="me noreferrer">
            LinkedIn ↗
          </a>
          <a href={identity.links.x} target="_blank" rel="me noreferrer">
            X ↗
          </a>
        </nav>
        <a href="/">Back home ↑</a>
      </footer>
    </div>
  );
}
