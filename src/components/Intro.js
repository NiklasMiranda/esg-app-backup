function Intro({ onStartClick }) {
  return (
    <div>
      <h1 className="esg-text-3xl esg-font-bold esg-mb-4">ESG Calculator</h1>
      <p className="esg-mb-4">
        Welcome to the ESG calculator. This tool will guide you through a series of questions
        to determine your company's ESG score.
      </p>
      <button
        onClick={onStartClick}
        className="btn-primary"
      >
        Start
      </button>
    </div>
  );
}

export default Intro;