import React from 'react';

function StepDVAInfo() {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-font-bold esg-mb-8">Dobbeltvæsentlighedsanalysen (DVA)</h1>

      <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-3 esg-gap-8">
        {/* DVA Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Hvad er Dobbeltvæsentlighedsanalysen?</h2>
          <p className="esg-text-gray-700">
            Dobbeltvæsentlighedsanalysen er en central del af de nye EU-krav til bæredygtighedsrapportering (CSRD).
            Den kræver, at virksomheder vurderer deres væsentligste påvirkninger, risici og muligheder ud fra to perspektiver:
            både hvordan virksomhedens aktiviteter påvirker omverdenen (Impact-perspektivet) og hvordan eksterne bæredygtighedsforhold påvirker virksomhedens økonomi (Finansielt perspektiv).
            Målet er at give et helhedsbillede af virksomhedens bæredygtighedsperformance og dens relevans for interessenter.
          </p>
        </div>

        {/* Impact Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Impact-perspektivet</h2>
          <p className="esg-text-gray-700">
            Impact-perspektivet handler om virksomhedens positive og negative påvirkninger på mennesker og miljø.
            Dette inkluderer emner som klimaforandringer, forurening, biodiversitet, arbejdsforhold, menneskerettigheder og samfundsforhold.
            Virksomheden skal identificere, vurdere og rapportere om, hvordan dens drift, produkter og services påvirker disse områder.
            Det handler om at forstå og håndtere virksomhedens fodaftryk på omverdenen.
          </p>
        </div>

        {/* Finansiel Info Box */}
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-xl esg-font-bold esg-mb-4">Finansielt perspektiv</h2>
          <p className="esg-text-gray-700">
            Det finansielle perspektiv fokuserer på, hvordan bæredygtighedsforhold påvirker virksomhedens økonomi og forretningsmodel.
            Dette kan omfatte risici som fysiske klimaforandringer, overgangsrisici (f.eks. nye reguleringer), ressourceknaphed, men også muligheder som nye grønne markeder, energieffektivitet og forbedret omdømme.
            Virksomheden skal vurdere, hvordan disse faktorer kan påvirke dens indtjening, omkostninger, kapitaladgang og langsigtede værdiskabelse.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepDVAInfo;
