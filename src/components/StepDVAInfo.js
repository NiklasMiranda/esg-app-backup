import React from 'react';

function StepDVAInfo({ onNext, onPrev }) {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-font-bold esg-mb-8">Dobbeltvæsentlighedsanalysen (DVA)</h1>

      <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-8">
        {/* DVA Info Box */}
        <div className="md:esg-col-span-2 esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Hvad er dobbeltvæsentlighedsanalysen?</h2>
          <p className="esg-text-gray-700">
            Dobbelt væsentlighed er grundprincippet bag ESGScore-beregningen. 
            Det betyder, at en virksomheds bæredygtighedsvurdering ikke kun handler om dens påvirkning af omgivelserne, 
            men også om hvordan bæredygtighedsforhold påvirker virksomheden selv.
            <br></br><br></br>
            I praksis sikrer dobbelt væsentlighed, at ESG-scoren bliver både relevant og retfærdig. 
            Den tager højde for, at virksomheder står over for vidt forskellige risici, muligheder og påvirkninger – 
            afhængigt af branche, størrelse og forretningsmodel. 
            En byggevirksomhed skal fx vægte klima og ressourceforbrug højt, 
            mens et revisionshus i højere grad skal fokusere på etik, databeskyttelse og governance.
            <br></br><br></br>
            Ved at integrere dobbelt væsentlighed i beregningsmodellen bliver ESG-scoren et mere præcist udtryk for, 
            hvor virksomheden reelt gør en forskel – og hvor den har mest at vinde eller tabe.
          </p>
        </div>

        {/* Impact Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Impact-perspektivet</h2>
          <p className="esg-text-gray-700">
            Impact-væsentlighed handler om den effekt, virksomheden har på mennesker og miljø. 
            Det dækker alt fra CO₂-udledninger, energiforbrug og forurening til arbejdsforhold, menneskerettigheder og lokalsamfund.
            <br></br><br></br>
            I ESGScore-beregningen vurderes impact-væsentligheden gennem en række indikatorer, 
            der måler hvor konkret virksomheden handler, og hvordan den dokumenterer sin indsats. 
            Det betyder, at virksomheder, der aktivt reducerer deres miljøpåvirkning, 
            styrker deres arbejdsmiljø eller tager ansvar i værdikæden, opnår en højere score – uanset deres udgangspunkt.
            <br></br><br></br>
            Denne tilgang gør det muligt at belønne reelle fremskridt frem for blot resultater. 
            En virksomhed med højt energiforbrug kan stadig få en høj score, 
            hvis den arbejder systematisk og dokumenteret med at reducere sin påvirkning.
          </p>
        </div>

        {/* Finansiel Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Finansielt perspektiv</h2>
          <p className="esg-text-gray-700">
            Finansiel væsentlighed fokuserer på hvordan bæredygtighedsforhold påvirker virksomhedens økonomi, 
            drift og risikoprofil. Det kan være alt fra stigende energipriser 
            og klimapolitisk regulering til ændrede kundekrav, forsyningsrisici eller omdømmetab.
            <br></br><br></br>
            I ESGScore-modellen inddrages finansiel væsentlighed ved at vægte de temaer højest, 
            som har størst økonomisk betydning for den enkelte virksomhedstype. 
            For eksempel vil klimarisici og ressourceeffektivitet være finansielt væsentlige for produktionsvirksomheder, 
            mens dataetik og governance vejer tungere i videns- og serviceerhverv.
            <br></br><br></br>
            Ved at kombinere de to perspektiver – virksomhedens påvirkning af verden 
            og verdens påvirkning af virksomheden – sikrer beregneren en balanceret 
            og helhedsorienteret ESG-score, der kan bruges som et reelt ledelses- og kommunikationsværktøj.
          </p>
        </div>
      </div>
      <div className="esg-flex esg-justify-between esg-mt-8">
        <button onClick={onPrev} className="btn-secondary">Tilbage</button>
        <button onClick={onNext} className="btn-primary">Til DVA</button>
      </div>
    </div>
  );
}

export default StepDVAInfo;
