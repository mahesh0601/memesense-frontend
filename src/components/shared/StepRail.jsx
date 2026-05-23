const labSteps = ["Alias", "Upload", "Cooking", "Results"];

export function StepRail({ activeStep = 1 }) {
  const activeLabel = labSteps[activeStep - 1] || labSteps[0];

  return (
    <div
      className="step-rail"
      role="status"
      aria-label={`Step ${activeStep} of 4: ${activeLabel}`}
    >
      <span className="step-rail-label">Step {activeStep} of 4</span>
      <ol className="step-track">
        {labSteps.map((step, index) => {
          const stepNumber = index + 1;

          return (
            <li
              className={
                stepNumber === activeStep
                  ? "step-track-item step-track-active"
                  : "step-track-item"
              }
              key={step}
            >
              <span className="step-number" aria-hidden="true">
                {stepNumber}
              </span>
              <span>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
