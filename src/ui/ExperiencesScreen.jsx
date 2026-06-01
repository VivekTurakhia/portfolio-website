/**
 * Bare-bones "experiences" mini-site shown ON the monitor1 screen mesh
 * (via drei <Html transform> in Room.jsx). Vivek will flesh out the real
 * content later — keep this self-contained DOM so it can scroll/link normally.
 *
 * Default export so it can be React.lazy()'d.
 */
export default function ExperiencesScreen() {
  return (
    <div className="screen-page">
      <header className="screen-header">
        <h1>Vivek Turakhia</h1>
        <p>Software Engineer</p>
      </header>

      <section>
        <h2>Experience</h2>
        <ul className="screen-list">
          <li>
            <strong>Company One</strong> — Role
            <span>2024 – Present</span>
          </li>
          <li>
            <strong>Company Two</strong> — Role
            <span>2023 – 2024</span>
          </li>
          <li>
            <strong>Company Three</strong> — Role
            <span>2022 – 2023</span>
          </li>
        </ul>
      </section>

      <footer className="screen-footer">More coming soon…</footer>
    </div>
  )
}
