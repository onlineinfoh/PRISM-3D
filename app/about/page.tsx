export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="eyebrow">About PRISM-3D</p>
        <h1 className="headline">Periskeletal Region–aware Imaging for Survival Modeling</h1>
        <p className="hero-text">
          PRISM-3D is a research pipeline exploring whether targeted anatomical context
          can improve prognostic modeling for NSCLC. The current demo focuses on transparent
          workflow design, visual explainability, and clean clinical-facing interaction.
        </p>
      </section>

      <section className="layout">
        <article className="card span-6">
          <h2>Mission</h2>
          <p>
            Build a clinically interpretable imaging workflow where segmentation priors and
            deep learning outputs can be reviewed together instead of as isolated results.
          </p>
        </article>

        <article className="card span-6">
          <h2>What This Demo Shows</h2>
          <p>
            End-to-end UI for uploading CT, running segmentation-guided inference, and
            inspecting Grad-CAM overlays across three anatomical planes.
          </p>
        </article>

        <article className="card span-12">
          <h2>Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <h3>Tianxi Liang</h3>
              <p>Pipeline integration, model experimentation, and product direction.</p>
            </div>
            <div className="team-card">
              <h3>Nishanth Sathisha</h3>
              <p>Clinical framing, validation planning, and translational workflow support.</p>
            </div>
            <div className="team-card">
              <h3>Sai Maruvada</h3>
              <p>Technical development, evaluation support, and systems execution.</p>
            </div>
          </div>
        </article>

        <article className="card span-12">
          <h2>Research Use Only</h2>
          <p>
            This system is a research demonstration and does not provide medical advice,
            diagnosis, or treatment recommendations.
          </p>
        </article>
      </section>
    </main>
  );
}
