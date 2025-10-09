import React from 'react';

function StepESGInfo({ onNext }) {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-font-bold esg-mb-8">ESG-score: Introduktion</h1>

      <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-3 esg-gap-8">
        {/* ESG Score Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Hvad er ESG-score?</h2>
          <p className="esg-text-gray-700">
            ESG-scoren er en samlet vurdering af en virksomheds præstation inden for miljø (Environmental), sociale forhold (Social) og god selskabsledelse (Governance).
            Den giver et kvantificerbart mål for, hvor bæredygtig og ansvarlig en virksomhed er.
            En høj ESG-score indikerer typisk en virksomhed med stærk bæredygtighedspraksis og lavere risici.
          </p>
        </div>

        {/* Environmental (E) Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Miljø (Environmental)</h2>
          <p className="esg-text-gray-700">
            Miljøaspektet dækker virksomhedens påvirkning af den naturlige verden.
            Dette inkluderer emner som klimaforandringer, ressourceforbrug, forurening, biodiversitet og affaldshåndtering.
            Det handler om, hvordan virksomheden minimerer sit økologiske fodaftryk og bidrager til en mere bæredygtig planet.
          </p>
        </div>

        {/* Social (S) Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Sociale forhold (Social)</h2>
          <p className="esg-text-gray-700">
            Sociale forhold omhandler virksomhedens relationer til medarbejdere, leverandører, kunder og de samfund, den opererer i.
            Emner herunder er arbejdsforhold, menneskerettigheder, diversitet, ligestilling, sundhed og sikkerhed samt samfundsengagement.
            Det handler om, hvordan virksomheden behandler mennesker og bidrager positivt til samfundet.
          </p>
        </div>

        {/* Governance (G) Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Selskabsledelse (Governance)</h2>
          <p className="esg-text-gray-700">
            Governance-aspektet fokuserer på virksomhedens ledelse, interne kontroller, politikker og praksis.
            Dette inkluderer emner som bestyrelsens sammensætning, ledelsesløn, revision, aktionærrettigheder og bekæmpelse af korruption.
            Det handler om, hvordan virksomheden ledes retfærdigt, etisk og transparent.
          </p>
        </div>
      </div>
      <div className="esg-flex esg-justify-end esg-mt-8">
        <button onClick={onNext} className="btn-primary">Start ESG-score</button>
      </div>
    </div>
  );
}

export default StepESGInfo;
