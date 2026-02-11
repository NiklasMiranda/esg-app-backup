import React, { useState } from 'react';

function CompanyFigures() {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    industry: '',
    cvr: '',
  });

  const [keyFigures, setKeyFigures] = useState({
    balanceSheetTotal: '',
    revenue: '',
    employees: '',
    energyConsumption: '',
    areaConsumption: '',
    waterExtraction: '',
    totalWaste: '',
    workAccidents: '',
    trainingHours: '',
    corruptionCases: '',
  });

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleKeyFiguresChange = (e) => {
    const { name, value } = e.target;
    setKeyFigures((prevFigures) => ({ ...prevFigures, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Company Info:', companyInfo);
    console.log('Key Figures:', keyFigures);
    // Here you would typically send this data to an API
    alert('Data saved (not really, just logged to console)');
  };

  return (
    <div className="esg-p-6 esg-bg-white esg-rounded-lg esg-shadow-md">
      <h2 className="esg-text-2xl esg-font-bold esg-mb-6 esg-text-gray-800">Virksomhedstal</h2>
      <form onSubmit={handleSubmit}>
        {/* Company Information */}
        <div className="esg-mb-8">
          <h3 className="esg-text-xl esg-font-semibold esg-mb-4 esg-text-gray-700">Virksomhedsinformation</h3>
          <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
            <div>
              <label htmlFor="companyName" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Virksomhedsnavn:
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyInfo.companyName}
                onChange={handleCompanyInfoChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast virksomhedsnavn"
              />
            </div>
            <div>
              <label htmlFor="industry" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Branche:
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={companyInfo.industry}
                onChange={handleCompanyInfoChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast branche"
              />
            </div>
            <div>
              <label htmlFor="cvr" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                CVR:
              </label>
              <input
                type="text"
                id="cvr"
                name="cvr"
                value={companyInfo.cvr}
                onChange={handleCompanyInfoChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast CVR-nummer"
              />
            </div>
          </div>
        </div>

        {/* Key Figures */}
        <div className="esg-mb-8">
          <h3 className="esg-text-xl esg-font-semibold esg-mb-4 esg-text-gray-700">Nøgletal</h3>
          <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-3 esg-gap-4">
            <div>
              <label htmlFor="balanceSheetTotal" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Balancesum (DKK):
              </label>
              <input
                type="number"
                id="balanceSheetTotal"
                name="balanceSheetTotal"
                value={keyFigures.balanceSheetTotal}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast balancesum"
              />
            </div>
            <div>
              <label htmlFor="revenue" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Omsætning (DKK):
              </label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                value={keyFigures.revenue}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast omsætning"
              />
            </div>
            <div>
              <label htmlFor="employees" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Antal ansatte:
              </label>
              <input
                type="number"
                id="employees"
                name="employees"
                value={keyFigures.employees}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast antal ansatte"
              />
            </div>
            <div>
              <label htmlFor="energyConsumption" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Energiforbrug (kWh):
              </label>
              <input
                type="number"
                id="energyConsumption"
                name="energyConsumption"
                value={keyFigures.energyConsumption}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast energiforbrug"
              />
            </div>
            <div>
              <label htmlFor="areaConsumption" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Arealforbrug (m²):
              </label>
              <input
                type="number"
                id="areaConsumption"
                name="areaConsumption"
                value={keyFigures.areaConsumption}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast arealforbrug"
              />
            </div>
            <div>
              <label htmlFor="waterExtraction" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Udtagning af vand (m³):
              </label>
              <input
                type="number"
                id="waterExtraction"
                name="waterExtraction"
                value={keyFigures.waterExtraction}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast vandudtagning"
              />
            </div>
            <div>
              <label htmlFor="totalWaste" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Samlet mængde affald (kg):
              </label>
              <input
                type="number"
                id="totalWaste"
                name="totalWaste"
                value={keyFigures.totalWaste}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast mængde affald"
              />
            </div>
            <div>
              <label htmlFor="workAccidents" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Arbejdsulykker (antal):
              </label>
              <input
                type="number"
                id="workAccidents"
                name="workAccidents"
                value={keyFigures.workAccidents}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast antal arbejdsulykker"
              />
            </div>
            <div>
              <label htmlFor="trainingHours" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Uddannelsestimer (timer):
              </label>
              <input
                type="number"
                id="trainingHours"
                name="trainingHours"
                value={keyFigures.trainingHours}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast uddannelsestimer"
              />
            </div>
            <div>
              <label htmlFor="corruptionCases" className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2">
                Sager med korruption og bestikkelse (antal):
              </label>
              <input
                type="number"
                id="corruptionCases"
                name="corruptionCases"
                value={keyFigures.corruptionCases}
                onChange={handleKeyFiguresChange}
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast antal sager"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="esg-bg-blue-600 hover:esg-bg-blue-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded focus:esg-outline-none focus:esg-shadow-outline"
        >
          Gem data
        </button>
      </form>
    </div>
  );
}

export default CompanyFigures;
