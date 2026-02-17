import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';

function ExtendedModule({ currentYear }) {
  const [formData, setFormData] = useState({
    // Generelle oplysninger (C1)
    products_services_groups: '',
    markets: '',
    business_relations: '',
    strategy_sustainability_elements: '',

    // Indsatser, politikker og fremtidige initiativer (C2)
    existing_practices_policies: '',
    future_initiatives_targets: '',
    highest_management_level: '',

    // E-data: Scope 3 CO₂e-udledning
    scope3_co2e_relevant: null, // Checkbox for relevance
    scope3_co2e_emissions: '',

    // E-data: CO₂e-reduktionsmål og klimaomstilling (C3)
    co2e_reduction_target: '',
    co2e_baseline_year: '',
    co2e_reduction_actions: '',
    climate_transition_plan: '',

    // E-data: Klimarisici (C4)
    climate_risks_description: '',
    exposure_vulnerability: '',
    climate_risks_time_horizon: '',
    climate_adaptation: null, // JA/NEJ checkbox
    financial_impact_climate_risks: '',

    // S-data: Supplerende (generelle) oplysninger om arbejdsstyrken (C5)
    gender_management_ratio: '',
    independent_workers: '',
    temporary_workers: '',

    // S-data: Egen arbejdsstyrke: Menneskerettighedspolitikker og processer (C6)
    code_of_conduct_hr_policy: null, // JA/NEJ checkbox
    grievance_mechanism: null, // JA/NEJ checkbox

    // S-data: Alvorlige negative menneskerettighedshændelser (C7)
    confirmed_hr_incidents_own_workforce: '',
    confirmed_hr_incidents_value_chain: '',

    // G-data: Indtægter fra bestemte aktiviteter og udelukkelse fra EU-referencebenchmarks (C8)
    revenue_selected_sectors: '',
    eu_benchmarks_exceedance: null, // Checkbox for relevance

    // G-data: Kønsfordeling i øverste ledelsesorgan (C9)
    gender_top_management_ratio: '',
  });

  const [isCategory1Expanded, setIsCategory1Expanded] = useState(true);
  const [isCategory2Expanded, setIsCategory2Expanded] = useState(true);
  const [isCategory3Expanded, setIsCategory3Expanded] = useState(true);
  const [isCategory4Expanded, setIsCategory4Expanded] = useState(true);
  const [isCategory5Expanded, setIsCategory5Expanded] = useState(true);
  const [isCategory6Expanded, setIsCategory6Expanded] = useState(true);
  const [isCategory7Expanded, setIsCategory7Expanded] = useState(true);
  const [isCategory8Expanded, setIsCategory8Expanded] = useState(true);
  const [isCategory9Expanded, setIsCategory9Expanded] = useState(true);
  const [isCategory10Expanded, setIsCategory10Expanded] = useState(true);

  const COMPANY_ID = 1; // Assuming a single company for now, or fetch dynamically

  useEffect(() => {
    const fetchCompanyExtendedModulData = async () => {
      try {
        const response = await axios.get(`/api/company-extended-module-data/${COMPANY_ID}/${currentYear}/`);
        setFormData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No existing Extended Module data for company ${COMPANY_ID} for year ${currentYear}. Starting with empty form.`);
          setFormData({ // Reset form data to empty when no data is found for the year
            products_services_groups: '', markets: '', business_relations: '', strategy_sustainability_elements: '',
            existing_practices_policies: '', future_initiatives_targets: '', highest_management_level: '',
            scope3_co2e_relevant: null, scope3_co2e_emissions: '', co2e_reduction_target: '', co2e_baseline_year: '',
            co2e_reduction_actions: '', climate_transition_plan: '', climate_risks_description: '', exposure_vulnerability: '',
            climate_risks_time_horizon: '', climate_adaptation: null, financial_impact_climate_risks: '',
            gender_management_ratio: '', independent_workers: '', temporary_workers: '', code_of_conduct_hr_policy: null,
            grievance_mechanism: null, confirmed_hr_incidents_own_workforce: '', confirmed_hr_incidents_value_chain: '',
            revenue_selected_sectors: '', eu_benchmarks_exceedance: null, gender_top_management_ratio: '',
          });
        } else {
          console.error("Error fetching Extended Module data:", error);
        }
      }
    };
    fetchCompanyExtendedModulData();
  }, [COMPANY_ID, currentYear]); // Added currentYear to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use POST method which leverages update_or_create in the backend
      await axios.post(`/api/company-extended-module-data/${COMPANY_ID}/${currentYear}/`, { company: COMPANY_ID, year: currentYear, ...formData });
      alert('Udvidet modul data saved successfully!');
    } catch (error) {
      console.error("Error submitting Udvidet modul data:", error);
      alert('Error saving Udvidet modul data.');
    }
  };

  return (
    <div className="esg-p-6 esg-bg-white esg-rounded-lg esg-shadow-md esg-min-h-screen">
      <h2 className="esg-text-2xl esg-font-bold esg-mb-6 esg-text-gray-800">Udvidet modul</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. Generelle oplysninger: Strategi: Forretningsmodel og bæredygtighedsrelaterede initiativer (C1) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory1Expanded(!isCategory1Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">1. Generelle oplysninger: Strategi: Forretningsmodel og bæredygtighedsrelaterede initiativer (C1)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory1Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory1Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="products_services_groups" className="esg-block esg-text-gray-700 esg-text-lg esg-font-bold esg-mb-2">
                    Væsentlige grupper af produkter og/eller tjenesteydelser:
                  </label>
                  <textarea
                    id="products_services_groups"
                    name="products_services_groups"
                    value={formData.products_services_groups}
                    onChange={handleChange}
                    rows="2"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv produkter og tjenesteydelser"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="markets" className="esg-block esg-text-gray-700 esg-text-lg esg-font-bold esg-mb-2">
                    Væsentlige markeder:
                  </label>
                  <textarea
                    id="markets"
                    name="markets"
                    value={formData.markets}
                    onChange={handleChange}
                    rows="2"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv væsentlige markeder"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="business_relations" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Primære forretningsforbindelser:
                  </label>
                  <textarea
                    id="business_relations"
                    name="business_relations"
                    value={formData.business_relations}
                    onChange={handleChange}
                    rows="2"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv primære forretningsforbindelser"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="strategy_sustainability_elements" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Centrale elementer fra virksomhedens strategi, der er relateret til/påvirker bæredygtighedsspørgsmål (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="strategy_sustainability_elements"
                    name="strategy_sustainability_elements"
                    value={formData.strategy_sustainability_elements}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv strategi elementer"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Generelle oplysninger: Beskrivelse af indsatser, politikker og fremtidige initiativer for omstilling til en mere bæredygtig økonomi (C2) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory2Expanded(!isCategory2Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">2. Generelle oplysninger: Beskrivelse af indsatser, politikker og fremtidige initiativer for omstilling til en mere bæredygtig økonomi (C2)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory2Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory2Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="existing_practices_policies" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Beskrivelse af eksisterende praksisser/politikker/handlinger (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="existing_practices_policies"
                    name="existing_practices_policies"
                    value={formData.existing_practices_policies}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv eksisterende praksisser"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="future_initiatives_targets" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Beskrivelse af fremtidige initiativer/målsætninger (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="future_initiatives_targets"
                    name="future_initiatives_targets"
                    value={formData.future_initiatives_targets}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv fremtidige initiativer"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="highest_management_level" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Angivelse af højeste ledelsesniveau i virksomheden, der er ansvarlig for implementering (obligatorisk hvis relevant):
                  </label>
                  <input
                    type="text"
                    id="highest_management_level"
                    name="highest_management_level"
                    value={formData.highest_management_level}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Angiv ledelsesniveau"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. E-data: Vurdér, om Scope 3 CO₂e-udledning er relevant at oplyse om for netop din virksomhed */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory3Expanded(!isCategory3Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">3. E-data: Vurdér, om Scope 3 CO₂e-udledning er relevant at oplyse om for netop din virksomhed</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory3Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory3Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2 esg-flex esg-items-center">
                  <input
                    type="checkbox"
                    id="scope3_co2e_relevant"
                    name="scope3_co2e_relevant"
                    checked={formData.scope3_co2e_relevant || false}
                    onChange={handleChange}
                    className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                  />
                  <label htmlFor="scope3_co2e_relevant" className="esg-text-gray-700lg esg-font-bold">
                    Vurdér, om Scope 3 CO₂e-udledning er relevant at oplyse om for netop din virksomhed (obligatorisk hvis relevant):
                  </label>
                </div>
                {formData.scope3_co2e_relevant && (
                  <div className="md:esg-col-span-2">
                    <label htmlFor="scope3_co2e_emissions" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                      Scope 3 CO₂e-udledninger (obligatorisk hvis relevant):
                    </label>
                    <input
                      type="number"
                      id="scope3_co2e_emissions"
                      name="scope3_co2e_emissions"
                      value={formData.scope3_co2e_emissions}
                      onChange={handleChange}
                      className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                      placeholder="Indtast Scope 3 CO₂e-udledninger"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. E-data: CO₂e-reduktionsmål og klimaomstilling (C3) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory4Expanded(!isCategory4Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">4. E-data: CO₂e-reduktionsmål og klimaomstilling (C3)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory4Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory4Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div>
                  <label htmlFor="co2e_reduction_target" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    CO₂e-reduktionsmål (obligatorisk hvis relevant):
                  </label>
                  <input
                    type="text"
                    id="co2e_reduction_target"
                    name="co2e_reduction_target"
                    value={formData.co2e_reduction_target}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast CO₂e-reduktionsmål"
                  />
                </div>
                <div>
                  <label htmlFor="co2e_baseline_year" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    CO₂e-udledning i baselineår (obligatorisk hvis relevant):
                  </label>
                  <input
                    type="number"
                    id="co2e_baseline_year"
                    name="co2e_baseline_year"
                    value={formData.co2e_baseline_year}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast baselineår"
                  />
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="co2e_reduction_actions" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Liste med de handlinger, der skal bidrage til at nå CO₂e-reduktionsmålene (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="co2e_reduction_actions"
                    name="co2e_reduction_actions"
                    value={formData.co2e_reduction_actions}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv handlinger"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="climate_transition_plan" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Omstillingsplan for modvirkning af klimaforandringer (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="climate_transition_plan"
                    name="climate_transition_plan"
                    value={formData.climate_transition_plan}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv omstillingsplan"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. E-data: Klimarisici (C4) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory5Expanded(!isCategory5Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">5. E-data: Klimarisici (C4)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory5Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory5Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="climate_risks_description" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Beskrivelse af klimarelaterede risici og/eller klimarelaterede omstillingsrisici (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="climate_risks_description"
                    name="climate_risks_description"
                    value={formData.climate_risks_description}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv klimarisici"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="exposure_vulnerability" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Eksponering og sårbarhed for virksomhedens aktiver, aktiviteter og værdikæde (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="exposure_vulnerability"
                    name="exposure_vulnerability"
                    value={formData.exposure_vulnerability}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv eksponering og sårbarhed"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="climate_risks_time_horizon" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Tidshorisont for, hvornår de klimarelaterede risici og omstillingsrisici forventes at få negativ indflydelse på virksomheden (obligatorisk hvis relevant):
                  </label>
                  <input
                    type="text"
                    id="climate_risks_time_horizon"
                    name="climate_risks_time_horizon"
                    value={formData.climate_risks_time_horizon}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Angiv tidshorisont"
                  />
                </div>
                <div className="md:esg-col-span-2 esg-flex esg-items-center">
                  <input
                    type="checkbox"
                    id="climate_adaptation"
                    name="climate_adaptation"
                    checked={formData.climate_adaptation || false}
                    onChange={handleChange}
                    className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                  />
                  <label htmlFor="climate_adaptation" className="esg-block esg-text-gray-700lg esg-font-bold">
                    Oplysning om klimatilpasning (JA/NEJ):
                  </label>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="financial_impact_climate_risks" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Potentiel negativ påvirkning på virksomhedens finansielle præstation og forretningsdrift fra de oplistede klimarisici (valgfri):
                  </label>
                  <textarea
                    id="financial_impact_climate_risks"
                    name="financial_impact_climate_risks"
                    value={formData.financial_impact_climate_risks}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv potentiel finansiel påvirkning"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. S-data: Supplerende (generelle) oplysninger om arbejdsstyrken (C5) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory6Expanded(!isCategory6Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">6. S-data: Supplerende (generelle) oplysninger om arbejdsstyrken (C5)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory6Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory6Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div>
                  <label htmlFor="gender_management_ratio" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Forholdet mellem kvinder og mænd på ledelsesniveau (valgfri):
                  </label>
                  <input
                    type="text"
                    id="gender_management_ratio"
                    name="gender_management_ratio"
                    value={formData.gender_management_ratio}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast forhold"
                  />
                </div>
                <div>
                  <label htmlFor="independent_workers" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Antal selvstændige, som arbejder for din virksomhed (valgfri):
                  </label>
                  <input
                    type="number"
                    id="independent_workers"
                    name="independent_workers"
                    value={formData.independent_workers}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast antal"
                  />
                </div>
                <div>
                  <label htmlFor="temporary_workers" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Antal vikarer, som arbejder for din virksomhed (valgfri):
                  </label>
                  <input
                    type="number"
                    id="temporary_workers"
                    name="temporary_workers"
                    value={formData.temporary_workers}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast antal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. S-data: Egen arbejdsstyrke: Menneskerettighedspolitikker og processer (C6) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory7Expanded(!isCategory7Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">7. S-data: Egen arbejdsstyrke: Menneskerettighedspolitikker og processer (C6)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory7Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory7Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2 esg-flex esg-items-center">
                  <input
                    type="checkbox"
                    id="code_of_conduct_hr_policy"
                    name="code_of_conduct_hr_policy"
                    checked={formData.code_of_conduct_hr_policy || false}
                    onChange={handleChange}
                    className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                  />
                  <label htmlFor="code_of_conduct_hr_policy" className="esg-block esg-text-gray-700lg esg-font-bold">
                    Oplysning om ”code of conduct” eller menneskerettighedspolitik for din virksomheds egen arbejdsstyrke (JA/NEJ):
                  </label>
                </div>
                <div className="md:esg-col-span-2 esg-flex esg-items-center">
                  <input
                    type="checkbox"
                    id="grievance_mechanism"
                    name="grievance_mechanism"
                    checked={formData.grievance_mechanism || false}
                    onChange={handleChange}
                    className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                  />
                  <label htmlFor="grievance_mechanism" className="esg-block esg-text-gray-700lg esg-font-bold">
                    Oplysning om klagemekanisme for virksomhedens egne ansatte (JA/NEJ):
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8. S-data: Alvorlige negative menneskerettighedshændelser (egen arbejdsstyrke + værdikæde) (C7) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory8Expanded(!isCategory8Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">8. S-data: Alvorlige negative menneskerettighedshændelser (egen arbejdsstyrke + værdikæde) (C7)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory8Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory8Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="confirmed_hr_incidents_own_workforce" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Bekræftede negative menneskerettighedshændelser for din virksomheds egen arbejdsstyrke:
                  </label>
                  <textarea
                    id="confirmed_hr_incidents_own_workforce"
                    name="confirmed_hr_incidents_own_workforce"
                    value={formData.confirmed_hr_incidents_own_workforce}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv hændelser"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2">
                  <label htmlFor="confirmed_hr_incidents_value_chain" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Bekræftede negative menneskerettighedshændelser i din virksomheds værdikæde (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="confirmed_hr_incidents_value_chain"
                    name="confirmed_hr_incidents_value_chain"
                    value={formData.confirmed_hr_incidents_value_chain}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv hændelser i værdikæden"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. G-data: Indtægter fra bestemte aktiviteter og udelukkelse fra EU-referencebenchmarks (C8) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory9Expanded(!isCategory9Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">9. G-data: Indtægter fra bestemte aktiviteter og udelukkelse fra EU-referencebenchmarks (C8)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory9Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory9Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="revenue_selected_sectors" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Indtægter fra udvalgte sektorer (obligatorisk hvis relevant):
                  </label>
                  <textarea
                    id="revenue_selected_sectors"
                    name="revenue_selected_sectors"
                    value={formData.revenue_selected_sectors}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv indtægter fra udvalgte sektorer"
                  ></textarea>
                </div>
                <div className="md:esg-col-span-2 esg-flex esg-items-center">
                  <input
                    type="checkbox"
                    id="eu_benchmarks_exceedance"
                    name="eu_benchmarks_exceedance"
                    checked={formData.eu_benchmarks_exceedance || false}
                    onChange={handleChange}
                    className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                  />
                  <label htmlFor="eu_benchmarks_exceedance" className="esg-block esg-text-gray-700lg esg-font-bold">
                    Overskridelse af EU-benchmarks i overensstemmelse med Parisaftalen (obligatorisk hvis relevant):
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10. G-data: Kønsfordeling i øverste ledelsesorgan (C9) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCategory10Expanded(!isCategory10Expanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">10. G-data: Kønsfordeling i øverste ledelsesorgan (C9)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCategory10Expanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCategory10Expanded ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'}`}>
            <div className="esg-p-4">
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
                <div className="md:esg-col-span-2">
                  <label htmlFor="gender_top_management_ratio" className="esg-block esg-text-gray-700lg esg-font-bold esg-mb-2">
                    Forholdet mellem kvinder og mænd i det øverste ledelsesorgan (obligatorisk hvis relevant):
                  </label>
                  <input
                    type="text"
                    id="gender_top_management_ratio"
                    name="gender_top_management_ratio"
                    value={formData.gender_top_management_ratio}
                    onChange={handleChange}
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Indtast forhold"
                  />
                </div>
              </div>
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

export default ExtendedModule;
