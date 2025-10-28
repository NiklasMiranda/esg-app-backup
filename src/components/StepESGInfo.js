import React from 'react';

function StepESGInfo({ onNext }) {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-font-bold esg-mb-8">Initiativanalyse – fra væsentlighed til konkret vurdering</h1>

      <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
        <p className="esg-text-gray-700">
          Efter at virksomheden har fastlagt sin væsentlighed og vægtning i ESG-beregneren, begynder næste trin: initiativanalysen.
          Her omsættes den teoretiske vægtning til en praktisk og målbar vurdering af virksomhedens indsats inden for hvert ESG-område.<br/><br/>
          Initiativanalysen fungerer som konkrete indikatorer, 
          der tester, om virksomheden reelt lever op til de principper og målsætninger, 
          der blev vægtet højt i den første del af beregningen.
          De dækker alle underkategorier (E1–G1) og består af ja/nej-baserede spørgsmål med fast pointværdi, 
          så alle svar kan sammenlignes direkte på tværs af virksomheder og brancher.<br/><br/>
          Hvert spørgsmål er udformet, så det:<br/><br/>
          <ul className="esg-list-disc esg-list-inside">
            <li>måler handling og dokumentation, ikke holdninger eller intentioner,</li>
            <li>kan besvares ud fra eksisterende data eller beviser, og</li>
            <li>bidrager til en transparent og sporbar score for hvert ESG-kriterium.</li>
          </ul><br/>
          De samlede point fra initiativanalysen vægtes derefter i forhold til den tidligere fastsatte væsentlighed 
          (fx E: 40 %, S: 30 %, G: 30 %) og virksomhedens egne prioriteringer.
          På den måde bliver ESG-scoren både objektiv og dynamisk – den afspejler virksomhedens faktiske præstationer, 
          men også hvad der er mest væsentligt for dens forretning.<br/><br/>
          Målet med initiativanalysen er at gøre ESG-arbejdet målbart, ensartet og udviklingsorienteret.
          Når resultaterne visualiseres i ESG-initiativanalysen (virkningsvæsentlighed vs. finansiel væsentlighed), 
          får virksomheden et tydeligt billede af, hvor indsatsen giver størst effekt, og hvor der er potentiale for forbedring.
        </p>
      </div>
      <div className="esg-flex esg-justify-end esg-mt-8">
        <button onClick={onNext} className="btn-primary">Til initiativanalysen</button>
      </div>
    </div>
  );
}

export default StepESGInfo;
