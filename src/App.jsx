import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  HashRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  Phone,
  Ruler,
  Waves,
} from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa6'
import { SiBilibili, SiGithub } from 'react-icons/si'
import BorderGlow from './components/BorderGlow/BorderGlow'
import Masonry from './components/Masonry/Masonry'
import PillNav from './components/PillNav/PillNav'
import { getProject, projects } from './projectData'
import { useHomeMotion, useMediaReveal } from './siteMotion'
import { TransitionLink, TransitionProvider } from './PageTransition'

// Lazy-loaded so the WebGL library (ogl) is code-split out of the main bundle
// and fetched only when the animated hero actually renders.
const SoftAurora = lazy(() => import('./components/SoftAurora/SoftAurora'))

const sectionLinks = [
  { label: 'About', id: 'top' },
  { label: 'Projects', id: 'work' },
]

const headerLinks = [
  ...sectionLinks.map((link) => ({ label: link.label, href: `/?section=${link.id}` })),
  { label: 'Contact', href: '/?section=contact' },
]

function SiteHeader() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [spySection, setSpySection] = useState(null)
  const isProjectPage = location.pathname.startsWith('/projects/')
  const isHome = location.pathname === '/'
  const activeSection = new URLSearchParams(location.search).get('section') || 'top'
  const activeHref = isHome
    ? `/?section=${spySection || activeSection}`
    : isProjectPage
      ? '/?section=work'
      : undefined

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: move the active dot under whichever section is currently in view.
  useEffect(() => {
    if (!isHome) {
      setSpySection(null)
      return
    }
    const ids = ['top', 'work', 'contact']
    const onSpy = () => {
      const probe = window.innerHeight * 0.35
      let current = 'top'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= probe) current = id
      }
      setSpySection(current)
    }
    onSpy()
    window.addEventListener('scroll', onSpy, { passive: true })
    return () => window.removeEventListener('scroll', onSpy)
  }, [isHome])

  return (
    <header className={`site-header ${isHome ? 'site-header--home' : ''} ${scrolled || isProjectPage ? 'site-header--scrolled' : ''}`}>
      <PillNav
        className="site-pill-nav"
        items={headerLinks}
        activeHref={activeHref}
        baseColor="#263f58"
        pillColor="#ffffff"
        pillTextColor="#263f58"
        hoveredPillTextColor="#ffffff"
        ease="power2.easeOut"
        initialLoadAnimation
      />
    </header>
  )
}

function ForceVisual({ compact = false }) {
  return (
    <div className={`force-visual ${compact ? 'force-visual--compact' : ''}`} aria-hidden="true">
      <div className="sensor-plane">
        <span className="sensor-node sensor-node--a" />
        <span className="sensor-node sensor-node--b" />
        <span className="sensor-node sensor-node--c" />
        <span className="sensor-node sensor-node--d" />
        <span className="force-vector"><i /></span>
      </div>
      <div className="axis-label axis-label--x">X / 5N</div>
      <div className="axis-label axis-label--y">Y / 5N</div>
      <div className="axis-label axis-label--z">Z / 20N</div>
    </div>
  )
}

function BiosignalVisual({ compact = false }) {
  return (
    <div className={`biosignal-visual ${compact ? 'biosignal-visual--compact' : ''}`} aria-hidden="true">
      <div className="biosignal-readout">
        <span>HR</span><strong>72</strong><small>BPM</small>
      </div>
      <svg viewBox="0 0 1000 420" preserveAspectRatio="none">
        <path className="bio-grid" d="M0 105H1000M0 210H1000M0 315H1000M200 0V420M400 0V420M600 0V420M800 0V420" />
        <path className="breath-line" d="M0 250C70 110 150 110 220 250S370 390 445 250 590 110 665 250 820 390 900 250 970 120 1000 150" />
        <path className="heart-line" d="M0 226h90l18-10 16 20 16-92 18 160 22-78h120l18-10 16 20 16-92 18 160 22-78h120l18-10 16 20 16-92 18 160 22-78h120l18-10 16 20 16-92 18 160 22-78h100" />
      </svg>
      <div className="bio-legend"><span>RESPIRATION</span><span>HEARTBEAT</span></div>
    </div>
  )
}

function IndustrialIOVisual({ compact = false }) {
  return (
    <div className={`industrial-io-visual ${compact ? 'industrial-io-visual--compact' : ''}`} aria-label="SmartLink industrial I/O network diagram">
      <div className="industrial-io-controller">
        <span>Control layer</span>
        <strong>S7-200 SMART</strong>
        <small>or Beckhoff CX5020</small>
      </div>
      <div className="industrial-io-bus"><span>PROFINET / EtherCAT</span></div>
      <div className="industrial-io-rack" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="industrial-io-status"><span>Run</span><span>Link</span><span>I/O</span></div>
    </div>
  )
}

function ProjectVisual({ project, compact = false }) {
  if (project.visual === 'force') return <ForceVisual compact={compact} />
  if (project.visual === 'biosignal') return <BiosignalVisual compact={compact} />
  if (project.visual === 'industrial-io') return <IndustrialIOVisual compact={compact} />

  return (
    <div className={`project-image-visual project-image-visual--${project.visual}`}>
      <img src={project.cover} alt={project.coverAlt} />
      <div className="project-image-overlay" />
      <span>{project.category}</span>
    </div>
  )
}

function ProjectIndex() {
  const timelineProjects = [...projects]
    .sort((projectA, projectB) => (projectA.sortDate || projectA.date).localeCompare(projectB.sortDate || projectB.date))
  const timelineGroups = timelineProjects.reduce((groups, project) => {
    const year = (project.sortDate || project.date).slice(0, 4)
    const currentGroup = groups[groups.length - 1]

    if (currentGroup?.year === year) {
      currentGroup.projects.push(project)
    } else {
      groups.push({ year, projects: [project] })
    }

    return groups
  }, [])

  const typeLabels = {
    research: 'Research',
    course: 'Course Project',
    competition: 'Competition',
    internship: 'Internship Project',
  }

  const formatProjectMonth = (date) => new Intl.DateTimeFormat('en', {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}-01T00:00:00Z`))

  const formatProjectDate = (project) => {
    if (project.dateLabel) return project.dateLabel
    const start = `${formatProjectMonth(project.date)} ${project.date.slice(0, 4)}`
    if (!project.endDate) return start
    return `${start} – ${formatProjectMonth(project.endDate)} ${project.endDate.slice(0, 4)}`
  }

  return (
    <section className="academic-projects section" id="work">
      <div className="page-shell">
        <div className="academic-section-heading academic-projects-heading">
          <p className="academic-kicker">Project timeline</p>
          <h2>Academic and engineering projects</h2>
          <p>Projects are arranged from earliest to most recent. Each entry opens into a complete case study with implementation details and engineering evidence.</p>
        </div>

        <div className="academic-project-timeline">
          {timelineGroups.map((group) => (
            <section className="academic-project-year" aria-labelledby={`project-year-${group.year}`} key={group.year}>
              <div className="academic-project-year-heading">
                <h3 id={`project-year-${group.year}`}>{group.year}</h3>
              </div>
              <div className="academic-project-year-entries">
                {group.projects.map((project) => (
                  <BorderGlow
                    className={`academic-project-glow ${project.featured ? 'academic-project-glow--featured' : ''}`}
                    key={project.slug}
                    edgeSensitivity={30}
                    glowColor={project.featured ? '195 100 72' : '278 100 76'}
                    backgroundColor={project.featured ? '#0f172a' : '#120f17'}
                    borderRadius={project.featured ? 18 : 16}
                    glowRadius={42}
                    glowIntensity={project.featured ? 1.35 : 1.15}
                    coneSpread={28}
                    fillOpacity={project.featured ? 0.72 : 0.58}
                    animated
                    colors={project.featured
                      ? ['#38bdf8', '#f472b6', '#facc15']
                      : ['#c084fc', '#f472b6', '#38bdf8']}
                  >
                    <article className={`academic-project-entry ${project.featured ? 'academic-project-entry--featured' : ''}`}>
                      <div className="academic-project-topline">
                        <time dateTime={project.date}>{formatProjectDate(project)}</time>
                        <div className="academic-project-meta">
                          <span>{typeLabels[project.type]}</span>
                          <span>{project.category}</span>
                          {project.featured && <strong>Featured</strong>}
                          {project.status && <strong className="academic-project-status">{project.status}</strong>}
                        </div>
                      </div>
                      <div className="academic-project-content">
                        <h4>{project.title}</h4>
                        <p>{project.summary}</p>
                      </div>
                      <div className="academic-project-footer">
                        <div className="academic-project-details">
                          <div className="academic-project-role">
                            <span>Role</span>
                            <strong>{project.role}</strong>
                          </div>
                          {project.tech.length > 0 && (
                            <div className="academic-project-tags">
                              {project.tech.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}
                            </div>
                          )}
                        </div>
                        {project.available === false
                          ? project.detailNote && <span className="academic-project-pending">{project.detailNote}</span>
                          : <TransitionLink className="academic-project-action" to={`/projects/${project.slug}`}>View project <ArrowRight size={16} /></TransitionLink>}
                      </div>
                    </article>
                  </BorderGlow>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

function GmailLogo() {
  return (
    <svg className="gmail-mark" viewBox="0 0 256 193" role="img" aria-label="Gmail">
      <path fill="#4285f4" d="M58.18 192.05V93.64L27.79 65.82 0 50.09v124.51c0 9.64 7.82 17.45 17.45 17.45h40.73Z" />
      <path fill="#34a853" d="M197.82 192.05h40.73c9.63 0 17.45-7.81 17.45-17.45V50.09l-27.79 15.73-30.39 27.82v98.41Z" />
      <path fill="#ea4335" d="m58.18 93.64-4.14-38.31 4.14-37.15L128 70.55l69.82-52.37 4.67 35.35-4.67 40.11L128 146 58.18 93.64Z" />
      <path fill="#fbbc04" d="M197.82 18.18v75.46L256 50.09V26.91C256 5.36 231.4-6.93 214.18 6l-16.36 12.18Z" />
      <path fill="#c5221f" d="M0 50.09 26.77 70.12l31.41 23.52V18.18L41.82 5.91C24.6-6.99 0 5.3 0 26.91v23.18Z" />
    </svg>
  )
}

function CorporateFooter() {
  return (
    <footer className="academic-contact" id="contact">
      <div className="page-shell academic-contact-card">
        <div>
          <p className="academic-kicker">Contact</p>
          <h2>Academic and engineering enquiries</h2>
          <p>I welcome conversations about graduate study, research projects and embedded engineering opportunities.</p>
        </div>
        <nav className="academic-contact-links" aria-label="Contact links">
          <a className="contact-link contact-link--gmail" href="mailto:1320653495op@gmail.com"><GmailLogo /><span><strong>Gmail</strong><small>1320653495op@gmail.com</small></span></a>
          <a className="contact-link contact-link--github" href="https://github.com/Leon112211" target="_blank" rel="noreferrer"><SiGithub /><span><strong>GitHub</strong><small>https://github.com/Leon112211</small></span></a>
          <a className="contact-link contact-link--linkedin" href="https://www.linkedin.com/in/ziwen-liao-3b4602396" target="_blank" rel="noreferrer"><FaLinkedin /><span><strong>LinkedIn</strong><small>https://www.linkedin.com/in/ziwen-liao-3b4602396</small></span></a>
          <a className="contact-link contact-link--phone" href="tel:+8613266946335"><Phone /><span><strong>Phone</strong><small>+86 132 6694 6335</small></span></a>
        </nav>
      </div>
      <div className="page-shell academic-contact-bottom">
        <p>© 2026 Ziwen Liao · Electrical and Electronic Engineering</p>
        <Link to="/?section=top">Back to top</Link>
      </div>
    </footer>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

function HomePage() {
  const [searchParams] = useSearchParams()
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  useHomeMotion(rootRef)

  useEffect(() => {
    const section = searchParams.get('section')
    if (!section) return

    const timer = window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
    return () => window.clearTimeout(timer)
  }, [searchParams])

  return (
    <main className="academic-home" ref={rootRef}>
      <section className="academic-hero academic-hero--aurora" id="top">
        <div className="academic-hero-aurora" aria-hidden="true">
          {!reducedMotion && (
            <Suspense fallback={null}>
              <SoftAurora
                speed={0.45}
                scale={1.5}
                brightness={0.95}
                color1="#cfe0f0"
                color2="#4b86c4"
                noiseFrequency={2.5}
                noiseAmplitude={10}
                bandHeight={0.5}
                bandSpread={1}
                octaveDecay={0.11}
                layerOffset={0.5}
                colorSpeed={0.6}
                enableMouseInteraction={false}
              />
            </Suspense>
          )}
        </div>
        <div className="page-shell">
          <div className="academic-hero-grid">
            <div className="academic-hero-copy">
              <p className="academic-kicker">Academic portfolio · 2026</p>
              <h1>Ziwen Liao</h1>
              <h2>Electrical and Electronic Engineering Student</h2>
              <p>I am an undergraduate engineer interested in embedded systems, intelligent sensing and the design of reliable hardware–software systems.</p>
              <div className="academic-hero-actions">
                <Link className="academic-button academic-button--primary" to="/?section=work">View Projects</Link>
                <Link className="academic-button" to="/?section=contact">Contact Me</Link>
              </div>
            </div>
            <div className="academic-hero-identity-stack">
              <aside className="academic-profile-dossier" aria-label="Academic profile summary">
                <p>Academic profile</p>
                <dl>
                  <div><dt>Programme</dt><dd>BEng Electrical Engineering</dd></div>
                  <div><dt>Institution</dt><dd>Xi’an Jiaotong-Liverpool University</dd></div>
                  <div><dt>Location</dt><dd>Suzhou, China</dd></div>
                </dl>
              </aside>
            </div>
          </div>
          <div className="academic-hero-about-band">
            <div className="academic-hero-about-heading">
              <p className="academic-kicker">About</p>
              <h3>Engineering across the full signal path</h3>
            </div>
            <div className="academic-hero-about-copy">
              <p className="academic-hero-lede">I enjoy the difficult middle ground where hardware, software and mechanics must agree with each other.</p>
              <p>Currently a Year 3 BEng Electrical Engineering student at Xi’an Jiaotong-Liverpool University, I build embedded and research prototypes that turn physical signals into reliable decisions — from CAN-controlled motors to multi-axis force sensing and low-power cardiopulmonary monitoring.</p>
            </div>
          </div>
        </div>
      </section>

      <ProjectIndex />

      <CorporateFooter />
    </main>
  )
}

function ArchitectureFlow({ nodes }) {
  return (
    <div className="architecture-flow">
      {nodes.map((node, index) => (
        <div className="architecture-step" key={node.label}>
          <span>0{index + 1}</span><strong>{node.label}</strong><p>{node.detail}</p>
          {index < nodes.length - 1 && <ArrowRight className="architecture-arrow" size={18} />}
        </div>
      ))}
    </div>
  )
}

function MediaItem({ item }) {
  if (item.type === 'bilibili') {
    return (
      <article className="detail-media-card detail-media-card--video">
        <div className="detail-video-frame">
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${item.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`}
            title={item.title}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="detail-media-caption"><SiBilibili /><div><strong>{item.title}</strong><span>{item.caption}</span></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} on Bilibili`}><ArrowUpRight /></a></div>
      </article>
    )
  }

  if (item.type === 'video') {
    return (
      <article className="detail-media-card detail-media-card--video">
        <video controls playsInline preload="metadata"><source src={item.src} type="video/mp4" /></video>
        <div className="detail-media-caption"><Waves /><div><strong>Prototype video</strong><span>{item.caption}</span></div></div>
      </article>
    )
  }

  if (item.type === 'diagram') {
    const diagramProject = { visual: item.visual }
    return (
      <article className="detail-media-card detail-media-card--diagram">
        <ProjectVisual project={diagramProject} />
        <div className="detail-media-caption"><CircuitBoard /><div><strong>Engineering diagram</strong><span>{item.caption}</span></div></div>
      </article>
    )
  }

  return (
    <article className="detail-media-card">
      <img src={item.src} alt={item.alt} />
      <div className="detail-media-caption"><Ruler /><div><strong>Project evidence</strong><span>{item.caption}</span></div></div>
    </article>
  )
}

function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  useMediaReveal(rootRef)

  // Full-screen scroll-snap "pages" — scoped to project detail pages only.
  useEffect(() => {
    document.documentElement.classList.add('snap-scroll')
    return () => document.documentElement.classList.remove('snap-scroll')
  }, [])

  if (!project) return <NotFoundPage />

  const bilibiliVideos = (project.media || []).filter((item) => item.type === 'bilibili' && item.bvid)
  const detailMedia = (project.media || []).filter((item) => item.type !== 'bilibili')

  // Split the research-report figures at the "from scratch" break so the finished
  // result and the from-zero journey render as two separate panels.
  const reportFigures = project.researchReport?.figures || []
  const reportBreakIndex = reportFigures.findIndex((item) => item.type === 'section-break')
  const reportHeadFigures = reportBreakIndex === -1 ? reportFigures : reportFigures.slice(0, reportBreakIndex)
  const reportBreak = reportBreakIndex === -1 ? null : reportFigures[reportBreakIndex]
  const reportJourneyFigures = reportBreakIndex === -1 ? [] : reportFigures.slice(reportBreakIndex + 1)
  const renderReportFigure = (item, isPrimary) => {
    if (item.type === 'section-break') {
      return (
        <div className="project-research-report__figure-break" key={item.title}>
          <span>{item.eyebrow}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </div>
      )
    }
    return (
      <figure className={`project-research-report__figure${isPrimary ? ' project-research-report__figure--primary' : ''}${item.images ? ' project-research-report__figure--image-set' : ''}${item.variant ? ` project-research-report__figure--${item.variant}` : ''}`} key={item.src}>
        {item.images ? (
          <div className="project-research-report__image-set">
            {item.images.map((image, imageIndex) => (
              <div className={imageIndex === 0 ? 'project-research-report__image-set-item project-research-report__image-set-item--wide' : 'project-research-report__image-set-item'} key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <span>{image.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <img src={item.src} alt={item.alt} loading="lazy" />
        )}
        <figcaption>{item.caption}</figcaption>
      </figure>
    )
  }
  const hasContext = Boolean(project.contextMasonry || project.contextMedia)
  const hasEvidenceSections = Boolean(hasContext || project.controllerIntegration || project.researchReport || project.projectExperience || bilibiliVideos.length || detailMedia.length)
  const hasSpecialSection = Boolean(project.controllerIntegration || project.researchReport || project.projectExperience)
  const hasNarrative = Boolean(
    project.problem ||
      project.objective ||
      project.architecture?.length ||
      project.contributions?.length ||
      project.implementation?.length ||
      project.results?.length,
  )
  const showNarrative = hasNarrative && (!hasSpecialSection || project.forceNarrative)
  const galleryMedia = hasSpecialSection ? [] : detailMedia
  const hasAnyContent = showNarrative || hasSpecialSection || galleryMedia.length > 0 || hasContext || bilibiliVideos.length > 0

  return (
    <main className="project-page project-page--placeholder" ref={rootRef}>
      <section className={`project-placeholder page-shell ${hasEvidenceSections ? 'project-placeholder--with-context' : ''}`}>
        <TransitionLink className="project-back" to="/?section=work"><ArrowLeft size={16} /> Back to project timeline</TransitionLink>

        <div className="project-placeholder-intro">
          <p className="eyebrow">Project case study / {project.year}</p>
          <h1>{project.title}</h1>
          {project.projectExperience?.repositoryFrontLabel && (
            <a
              className="project-front-repository"
              href={project.projectExperience.repository}
              target="_blank"
              rel="noreferrer"
            >
              <SiGithub />
              {project.projectExperience.repositoryFrontLabel}
              <ArrowUpRight size={15} />
            </a>
          )}
          <p>{project.summary}</p>
        </div>

        {!hasAnyContent && (
          <aside className="project-placeholder-status" aria-label="Case study status">
            <span>Status</span>
            <strong>Default project interface</strong>
            <p>Detailed documentation for this project will be added in a later revision.</p>
          </aside>
        )}

        <dl className="project-placeholder-meta">
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{project.category}</dd></div>
          <div><dt>Core stack</dt><dd>{project.tech.slice(0, 5).join(' · ')}</dd></div>
          {project.organization && <div><dt>Organization</dt><dd>{project.organization}</dd></div>}
        </dl>

        {showNarrative && (
          <section className="project-brief">
            {(project.problem || project.objective) && (
              <div className="project-brief__overview">
                {project.problem && (
                  <article>
                    <p className="eyebrow">The challenge</p>
                    <p>{project.problem}</p>
                  </article>
                )}
                {project.objective && (
                  <article>
                    <p className="eyebrow">Objective</p>
                    <p>{project.objective}</p>
                  </article>
                )}
              </div>
            )}

            {project.architecture?.length > 0 && (
              <div className="project-brief__block">
                <div className="project-brief__heading">
                  <p className="eyebrow">System architecture</p>
                  <h2>Signal and control path</h2>
                </div>
                <ArchitectureFlow nodes={project.architecture} />
              </div>
            )}

            {project.contributions?.length > 0 && (
              <div className="project-brief__block">
                <div className="project-brief__heading">
                  <p className="eyebrow">My contribution</p>
                  <h2>What I worked on</h2>
                </div>
                <div className="project-brief__contributions">
                  {project.contributions.map((item, index) => (
                    <article key={item.title}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {(project.implementation?.length > 0 || project.results?.length > 0) && (
              <div className="project-brief__delivery">
                {project.implementation?.length > 0 && (
                  <div className="project-brief__steps">
                    <p className="eyebrow">Implementation</p>
                    <ol>
                      {project.implementation.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </div>
                )}
                {project.results?.length > 0 && (
                  <div className="project-brief__results">
                    <p className="eyebrow">Outcome</p>
                    <ul>
                      {project.results.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {galleryMedia.length > 0 && (
          <section className="project-detail-media" aria-labelledby={`${project.slug}-media-heading`}>
            <div className="project-detail-media__heading">
              <p className="eyebrow">Project media</p>
              <h2 id={`${project.slug}-media-heading`}>Visual evidence and prototype records</h2>
            </div>
            <div className={`detail-media-grid ${galleryMedia.length === 1 ? 'detail-media-grid--single' : ''}`}>
              {galleryMedia.map((item) => (
                <MediaItem item={item} key={`${item.type}-${item.src || item.visual || item.caption}`} />
              ))}
            </div>
          </section>
        )}

        {project.controllerIntegration && (
          <section className="project-controller-integration" aria-labelledby={`${project.slug}-controller-heading`}>
            <div className="project-controller-integration__intro">
              <p className="eyebrow">{project.controllerIntegration.eyebrow}</p>
              <h2 id={`${project.slug}-controller-heading`}>{project.controllerIntegration.title}</h2>
              <p>{project.controllerIntegration.description}</p>
              {project.controllerIntegration.evidence && (
                <div className="project-controller-integration__evidence">
                  {project.controllerIntegration.evidence.map((item) => (
                    <article key={item.label}>
                      <span>{item.label}</span>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
            <div className="project-controller-integration__side">
              {project.controllerIntegration.certificate && (
                <figure className="project-controller-integration__certificate">
                  <img src={project.controllerIntegration.certificate.src} alt={project.controllerIntegration.certificate.alt} loading="lazy" />
                  <figcaption>{project.controllerIntegration.certificate.caption}</figcaption>
                </figure>
              )}
            </div>
            {project.controllerIntegration.technicalDetails && (
              <div className="project-controller-integration__technical">
                <div className="project-controller-integration__technical-heading">
                  <p className="eyebrow">Control tuning notes</p>
                  <h3>What I actually tuned on the gimbal</h3>
                </div>
                <div className="project-controller-integration__technical-grid">
                  {project.controllerIntegration.technicalDetails.map((item) => (
                    <article key={item.label}>
                      <span>{item.label}</span>
                      <code>{item.code}</code>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {project.controllerIntegration.codeStudy && (
              <div className="project-controller-integration__code">
                <div className="project-controller-integration__technical-heading">
                  <p className="eyebrow">{project.controllerIntegration.codeStudy.eyebrow}</p>
                  <h3>{project.controllerIntegration.codeStudy.title}</h3>
                </div>
                <figure className="project-code-figure">
                  <pre><code>{project.controllerIntegration.codeStudy.code}</code></pre>
                  <figcaption>{project.controllerIntegration.codeStudy.caption}</figcaption>
                </figure>
                {project.controllerIntegration.codeStudy.approach && (
                  <p className="project-code-lead">{project.controllerIntegration.codeStudy.approach}</p>
                )}
                {project.controllerIntegration.codeStudy.tuningPath?.length > 0 && (
                  <ol className="project-code-path">
                    {project.controllerIntegration.codeStudy.tuningPath.map((stage) => (
                      <li className="project-code-path__stage" key={stage.step}>
                        <span className="project-code-path__step">{stage.step}</span>
                        <div>
                          <h4>{stage.title}</h4>
                          <p>{stage.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {project.controllerIntegration.codeStudy.challenges?.length > 0 && (
                  <div className="project-code-challenges">
                    {project.controllerIntegration.codeStudy.challenges.map((item) => (
                      <article className="project-code-challenges__item" key={item.situation}>
                        <p className="project-code-challenges__situation">{item.situation}</p>
                        <p className="project-code-challenges__line"><span>Why</span>{item.analysis}</p>
                        <p className="project-code-challenges__line"><span>Fix</span>{item.solution}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
            {project.controllerIntegration.demoVideos?.length > 0 && (
              <div className="project-controller-integration__demos">
                {project.controllerIntegration.demoVideos.map((demo) => (
                  <figure className="project-controller-integration__demo" key={demo.src}>
                    <video controls loop muted playsInline autoPlay={!reducedMotion} preload="auto">
                      <source src={demo.src} type="video/mp4" />
                    </video>
                    <figcaption>{demo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <p className="project-controller-integration__note">{project.controllerIntegration.note}</p>
          </section>
        )}

        {project.researchReport && (
          <>
            <section className="project-research-report" aria-labelledby={`${project.slug}-report-heading`}>
              <div className="project-research-report__intro">
                <p className="eyebrow">{project.researchReport.eyebrow}</p>
                <h2 id={`${project.slug}-report-heading`}>{project.researchReport.title}</h2>
                <p>{project.researchReport.description}</p>
              </div>
              <div className="project-research-report__stats" aria-label="Technical evidence metrics">
                {project.researchReport.stats.map((item) => (
                  <article key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
              <div className="project-research-report__stages">
                {project.researchReport.stages.map((item, index) => (
                  <article key={item.label}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              {detailMedia.length > 0 && (
                <section className="project-detail-media" aria-labelledby={`${project.slug}-media-heading`}>
                  <div className="project-detail-media__heading">
                    <p className="eyebrow">Project media</p>
                    <h2 id={`${project.slug}-media-heading`}>Visual evidence and prototype records</h2>
                  </div>
                  <div className={`detail-media-grid ${detailMedia.length === 1 ? 'detail-media-grid--single' : ''}`}>
                    {detailMedia.map((item) => (
                      <MediaItem item={item} key={`${item.type}-${item.src || item.visual || item.caption}`} />
                    ))}
                  </div>
                </section>
              )}
              {reportHeadFigures.length > 0 && (
                <div className="project-research-report__figures">
                  {reportHeadFigures.map((item, index) => renderReportFigure(item, index === 0))}
                </div>
              )}
              {!reportBreak && project.researchReport.note && (
                <p className="project-research-report__note">{project.researchReport.note}</p>
              )}
            </section>

            {reportBreak && (
              <section className="project-research-report project-research-report--journey" aria-label={reportBreak.title}>
                <div className="project-research-report__intro">
                  <p className="eyebrow">{reportBreak.eyebrow}</p>
                  <h2>{reportBreak.title}</h2>
                  <p>{reportBreak.text}</p>
                </div>
                {reportJourneyFigures.length > 0 && (
                  <div className="project-research-report__figures">
                    {reportJourneyFigures.map((item) => renderReportFigure(item, false))}
                  </div>
                )}
                {project.researchReport.note && (
                  <p className="project-research-report__note">{project.researchReport.note}</p>
                )}
              </section>
            )}
          </>
        )}

        {project.processFlow && (
          <section className="project-process" aria-labelledby={`${project.slug}-process-heading`}>
            <div className="project-process__heading">
              <p className="eyebrow">{project.processFlow.eyebrow}</p>
              <h2 id={`${project.slug}-process-heading`}>{project.processFlow.title}</h2>
              {project.processFlow.description && <p>{project.processFlow.description}</p>}
            </div>
            <ol className="project-process__steps">
              {project.processFlow.steps.map((step) => (
                <li className={`project-process__step${step.todo ? ' project-process__step--todo' : ''}`} key={step.num}>
                  <div className="project-process__marker"><span>{step.num}</span></div>
                  <div className="project-process__body">
                    {step.phase && <p className="project-process__phase">{step.phase}</p>}
                    <h3>{step.title}</h3>
                    {step.text && <p>{step.text}</p>}
                    {(step.equation || step.tags?.length > 0) && (
                      <div className="project-process__tags">
                        {step.equation && <span className="project-process__eq">{step.equation}</span>}
                        {step.tags?.map((tag) => (
                          <span className={`project-process__tag${tag.key ? ' project-process__tag--key' : ''}`} key={tag.label}>{tag.label}</span>
                        ))}
                      </div>
                    )}
                    {step.images && (
                      <figure className="project-process__media project-process__media--set">
                        <div className={`project-process__image-set project-process__image-set--n${step.images.length}${step.imageLayout ? ` project-process__image-set--${step.imageLayout}` : ''}`}>
                          {step.images.map((image) => (
                            <div className="project-process__image-set-item" key={image.src}>
                              <img src={image.src} alt={image.alt} loading="lazy" />
                              {image.label && <span>{image.label}</span>}
                            </div>
                          ))}
                        </div>
                        {step.caption && <figcaption>{step.caption}</figcaption>}
                      </figure>
                    )}
                    {step.image && (
                      <figure className={`project-process__media${step.imageWide ? ' project-process__media--wide' : ''}`}>
                        <img src={step.image.src} alt={step.image.alt} loading="lazy" />
                        {step.image.caption && <figcaption>{step.image.caption}</figcaption>}
                      </figure>
                    )}
                    {step.code && (
                      <pre className="project-process__code"><code>{step.code}</code></pre>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {project.projectExperience && (
          <section className="project-independent-experience" aria-labelledby={`${project.slug}-experience-heading`}>
            <div className="project-independent-experience__intro">
              <p className="eyebrow">{project.projectExperience.eyebrow}</p>
              <h2 id={`${project.slug}-experience-heading`}>{project.projectExperience.title}</h2>
              {project.projectExperience.description && <p>{project.projectExperience.description}</p>}
              {project.projectExperience.repository && project.projectExperience.showRepositoryLink !== false && (
                <a href={project.projectExperience.repository} target="_blank" rel="noreferrer">
                  <SiGithub />
                  {project.projectExperience.repositoryLabel}
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
            <div className="project-independent-experience__body">
              <ul className="project-independent-experience__highlights">
                {project.projectExperience.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="project-independent-experience__modules">
                {project.projectExperience.modules.map((item) => (
                  <article key={item.label}>
                    <span>{item.label}</span>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
              {project.projectExperience.note && <p className="project-independent-experience__note">{project.projectExperience.note}</p>}
            </div>
          </section>
        )}

        {hasContext && (
          <section className="project-context" aria-labelledby={`${project.slug}-context-heading`}>
            <div className="project-context-heading">
              <div>
                <p className="eyebrow">Competition context</p>
                <h2 id={`${project.slug}-context-heading`}>A brief record of the team environment</h2>
              </div>
              <p>These photographs document the GMaster team at the RoboMaster 2024 University League in Shanghai. My role was Electrical Control Group Member and Robot Operator.</p>
            </div>
            {project.contextMasonry ? (
              <div className="project-context-masonry" aria-label="RoboMaster competition photo gallery">
                <Masonry
                  items={project.contextMasonry}
                  ease="power3.out"
                  duration={0.6}
                  stagger={0.05}
                  animateFrom="bottom"
                  scaleOnHover
                  hoverScale={0.95}
                  blurToFocus
                  colorShiftOnHover={false}
                />
              </div>
            ) : (
              <div className="project-context-grid">
                {project.contextMedia.map((item, index) => (
                  <figure className={index === 0 ? 'project-context-item project-context-item--primary' : 'project-context-item'} key={item.src}>
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}

        {bilibiliVideos.length > 0 && (
          <section className="project-video-evidence" aria-labelledby={`${project.slug}-video-heading`}>
            <div className="project-video-evidence__heading">
              <p className="eyebrow">Competition video evidence</p>
              <h2 id={`${project.slug}-video-heading`}>Playable RoboMaster match records</h2>
              <p>The two Bilibili match records are embedded directly here so the competition context can be reviewed without leaving the portfolio.</p>
            </div>
            <div className="project-video-evidence__grid">
              {bilibiliVideos.map((item) => (
                <article className="project-video-card" key={item.bvid}>
                  <div className="project-video-card__frame">
                    <iframe
                      src={`https://player.bilibili.com/player.html?bvid=${item.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`}
                      title={item.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      scrolling="no"
                      frameBorder="0"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  <div className="project-video-card__caption">
                    <SiBilibili />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.caption}</span>
                      <a href={item.url} target="_blank" rel="noreferrer">Open on Bilibili <ArrowUpRight size={13} /></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="project-placeholder-actions">
          <TransitionLink className="academic-button academic-button--primary" to="/?section=work">Return to projects</TransitionLink>
        </div>
      </section>
      <CorporateFooter />
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found page-shell">
        <p className="eyebrow">404 / Signal lost</p><h1>This project channel does not exist.</h1>
        <Link to="/?section=work">Return to selected work <ArrowRight /></Link>
      </section>
      <CorporateFooter />
    </main>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname !== '/') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <SiteHeader />
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </TransitionProvider>
    </HashRouter>
  )
}

export default App
