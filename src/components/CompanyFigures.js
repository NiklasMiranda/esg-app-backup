import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import { DJANGO_API_BASE_URL, createAuthHeader } from '../api';

function CompanyFigures({ currentYear }) {
  const [formData, setFormData] = useState({
    // Generelle oplysninger (B1)
    basis_for_preparation: '',
    legal_form: '',
    nace_sector_codes: [],
    balance_sheet_total: '',
    revenue: '',
    employees: '',
    asset_locations: '',
    confidentiality_exclusions: '',
    esg_certificate_description: '',

    // Indsatser, politikker og fremtidige initiativer (B2)
    has_initiatives: null,

    // E-Data: Energiforbrug (B3)
    electricity_renewable: '',
    electricity_non_renewable: '',
    fuel_renewable: '',
    fuel_non_renewable: '',

    // E-Data: CO₂e-udledninger (B3)
    scope1_emissions: '',
    scope2_emissions: '',
    co2e_intensity: '',
    scope3_emissions: '',

    // E-Data: Forurening af luft, vand og jord (B4)
    pollution_reporting: '',

    // E-Data: Biodiversitet (B5)
    biodiversity_sensitive_areas: '',
    land_area_usage: '',

    // E-Data: Vand (B6)
    water_withdrawal: '',
    water_consumption: '',

    // E-Data: Ressourceforbrug, cirkulær økonomi og affaldshåndtering (B7)
    uses_circular_economy_principles: null,
    circular_economy_description: '',
    total_waste_hazardous: '',
    total_waste_non_hazardous: '',
    waste_recycled: '',
    mass_flow_materials: '',

    // S-Data: Egen arbejdsstyrke (B8)
    contract_type: '',
    gender_composition: '',
    employees_abroad: '',
    employee_turnover: '',

    // S-Data: Sundhed og sikkerhed (B9)
    work_accidents: '',
    work_related_deaths: '',

    // S-Data: Vederlag, overenskomster og uddannelse (B10)
    salary_below_minimum: '',
    gender_pay_gap: '',
    collective_bargaining_coverage: '',
    avg_training_hours: '',

    // G-Data: Virksomhedsledelse (B11)
    corruption_bribery_cases: '',
  });

  const [isGeneralInfoExpanded, setIsGeneralInfoExpanded] = useState(true); // New state
  const [isInitiativesExpanded, setIsInitiativesExpanded] = useState(false); // New state
  const [isEnergyConsumptionExpanded, setIsEnergyConsumptionExpanded] = useState(false); // New state
  const [isCo2EmissionsExpanded, setIsCo2EmissionsExpanded] = useState(false); // New state
  const [isPollutionExpanded, setIsPollutionExpanded] = useState(false); // New state
  const [isBiodiversityExpanded, setIsBiodiversityExpanded] = useState(false); // New state
  const [isWaterExpanded, setIsWaterExpanded] = useState(false); // New state
  const [isResourcesWasteExpanded, setIsResourcesWasteExpanded] = useState(false); // New state
  const [isWorkforceExpanded, setIsWorkforceExpanded] = useState(false); // New state
  const [isHealthSafetyExpanded, setIsHealthSafetyExpanded] = useState(false); // New state
  const [isCompensationExpanded, setIsCompensationExpanded] = useState(false); // New state
  const [isGovernanceExpanded, setIsGovernanceExpanded] = useState(false); // New state

  const COMPANY_ID = 1; // Assuming a single company for now, or fetch dynamically

  useEffect(() => {
    const fetchCompanyBasismodulData = async () => {
      try {
        const response = await axios.get(`${DJANGO_API_BASE_URL}company-basismodul-data/${COMPANY_ID}/${currentYear}/`, {
            headers: createAuthHeader(),
        });
        setFormData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No existing Basismodul data for company ${COMPANY_ID} for year ${currentYear}. Starting with empty form.`);
          setFormData({ // Reset form data to empty when no data is found for the year
            basis_for_preparation: '', legal_form: '', nace_sector_codes: [], balance_sheet_total: '', revenue: '', employees: '', asset_locations: '',
            confidentiality_exclusions: '', esg_certificate_description: '', has_initiatives: null, electricity_renewable: '', electricity_non_renewable: '',
            fuel_renewable: '', fuel_non_renewable: '', scope1_emissions: '', scope2_emissions: '', co2e_intensity: '', scope3_emissions: '',
            pollution_reporting: '', biodiversity_sensitive_areas: '', land_area_usage: '', water_withdrawal: '', water_consumption: '',
            uses_circular_economy_principles: null, circular_economy_description: '', total_waste_hazardous: '', total_waste_non_hazardous: '',
            waste_recycled: '', mass_flow_materials: '', contract_type: '', gender_composition: '', employees_abroad: '', employee_turnover: '',
            work_accidents: '', work_related_deaths: '', salary_below_minimum: '', gender_pay_gap: '', collective_bargaining_coverage: '',
            avg_training_hours: '', corruption_bribery_cases: '',
          });
        } else {
          console.error("Error fetching Basismodul data:", error);
        }
      }
    };
    fetchCompanyBasismodulData();
  }, [COMPANY_ID, currentYear]); // Added currentYear to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? null : Number(value);
      if (isNaN(newValue)) {
        newValue = null; // Ensure NaN values are treated as null
      }
    } else if (value === '') {
      newValue = null; // For other types, empty string can still be null if nullable
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleNaceCodeChange = (index, value) => {
    const newNaceCodes = [...formData.nace_sector_codes];
    newNaceCodes[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      nace_sector_codes: newNaceCodes,
    }));
  };

  const addNaceCode = () => {
    setFormData((prevData) => ({
      ...prevData,
      nace_sector_codes: [...prevData.nace_sector_codes, ''],
    }));
  };

  const removeNaceCode = (index) => {
    const newNaceCodes = formData.nace_sector_codes.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      nace_sector_codes: newNaceCodes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = formData.id ? 'patch' : 'post';
      
      // Fjern company og year fra payload - de er allerede i URL'en
      const { company, year, ...dataToSend } = formData;
      
      const response = await axios[method](
        `${DJANGO_API_BASE_URL}company-basismodul-data/${COMPANY_ID}/${currentYear}/`,
        dataToSend, // Send kun selve form data, ikke company/year
        { headers: createAuthHeader() }
      );
      
      alert('Basismodul data saved successfully!');
      
      // Opdater formData med response data (inkl. id hvis det var POST)
      setFormData(response.data);
      
    } catch (error) {
      console.error("Error submitting Basismodul data:", error);
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
      }
      alert('Error saving Basismodul data.');
    }
  };

  return (
    <div className="esg-p-6 esg-bg-white esg-rounded-lg esg-shadow-md">
      <h2 className="esg-text-2xl esg-font-bold esg-mb-6 esg-text-gray-800">Basismodul</h2>
      <form onSubmit={handleSubmit}>
        {/* Generelle oplysninger (B1) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsGeneralInfoExpanded(!isGeneralInfoExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">1. Generelle oplysninger (B1)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isGeneralInfoExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isGeneralInfoExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-3 esg-gap-4">
            <div>
              <label htmlFor="basis_for_preparation" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Grundlag for udarbejdelse:
              </label>
              <input
                type="text"
                id="basis_for_preparation"
                name="basis_for_preparation"
                value={formData.basis_for_preparation}
                onChange={handleChange}
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast grundlag for udarbejdelse"
              />

            </div>
            <div>
              <label htmlFor="legal_form" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Virksomhedens juridiske form:
              </label>
              <input
                type="text"
                id="legal_form"
                name="legal_form"
                value={formData.legal_form}
                onChange={handleChange}
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast juridisk form"
              />

            </div>
            {/* NACE Sektor Koder */}
            <div> {/* NACE codes block now acts as a single column */}
              <label className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2 esg-flex esg-items-center esg-justify-between">
                NACE sektor kode(r):
                <button
                  type="button"
                  onClick={addNaceCode}
                  className="esg-bg-green-500 hover:esg-bg-green-700 esg-text-white esg-font-bold esg-py-1 esg-px-2 esg-rounded esg-text-sm"
                >
                  +
                </button>
              </label>
              {formData.nace_sector_codes.map((code, index) => (
                <div key={index} className="esg-flex esg-items-center esg-mb-2">
                  <input
                    type="text"
                    name={`nace_sector_code_${index}`}
                    value={code}
                    onChange={(e) => handleNaceCodeChange(index, e.target.value)}
                    className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline esg-mr-2`}
                    placeholder="Indtast NACE kode"
                  />
                  <button
                    type="button"
                    onClick={() => removeNaceCode(index)}
                    className="esg-bg-red-500 hover:esg-bg-red-700 esg-text-white esg-font-bold esg-py-1 esg-px-2 esg-rounded"
                  >
                    -
                  </button>
                </div>
              ))}

            </div>
            </div>
            <div>
              <label htmlFor="balance_sheet_total" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Balancesum (DKK):
              </label>
              <input
                type="number"
                id="balance_sheet_total"
                name="balance_sheet_total"
                value={formData.balance_sheet_total}
                onChange={handleChange}
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast balancesum"
              />

            </div>
            <div>
              <label htmlFor="revenue" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Omsætning (DKK):
              </label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast omsætning"
              />

            </div>
            <div>
              <label htmlFor="employees" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Antal ansatte:
              </label>
              <input
                type="number"
                id="employees"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast antal ansatte"
              />

            </div>
            <div> {/* Textarea now acts as a single column */}
              <label htmlFor="asset_locations" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Adresser og geolokation på væsentlige aktiver og anlæg:
              </label>
              <textarea
                id="asset_locations"
                name="asset_locations"
                value={formData.asset_locations}
                onChange={handleChange}
                rows="3"
                className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                placeholder="Indtast adresser og geolokation"
              ></textarea>

            </div>
            <div> {/* Textarea now acts as a single column */}
              <label htmlFor="confidentiality_exclusions" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Eventuelle udeladelser grundet fortrolighed (valgfri):
              </label>
              <textarea
                id="confidentiality_exclusions"
                name="confidentiality_exclusions"
                value={formData.confidentiality_exclusions}
                onChange={handleChange}
                rows="3"
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast udeladelser"
              ></textarea>
            </div>
            <div> {/* Textarea now acts as a single column */}
              <label htmlFor="esg_certificate_description" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Kort beskrivelse af din virksomheds eventuelle ESG-certifikat eller miljømærker (valgfri):
              </label>
              <textarea
                id="esg_certificate_description"
                name="esg_certificate_description"
                value={formData.esg_certificate_description}
                onChange={handleChange}
                rows="3"
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast beskrivelse"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Indsatser, politikker og fremtidige initiativer (B2) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsInitiativesExpanded(!isInitiativesExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">2. Indsatser, politikker og fremtidige initiativer (B2)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isInitiativesExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isInitiativesExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-flex esg-items-center esg-mb-4">
              <input
                type="checkbox"
                id="has_initiatives"
                name="has_initiatives"
                checked={formData.has_initiatives || false}
                onChange={handleChange}
                className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
              />
              <label htmlFor="has_initiatives" className="esg-text-gray-700 esg-text-md esg-font-bold">
                Har din virksomhed allerede konkrete indsatser, politikker eller initiativer, der understøtter omstilling til en mere bæredygtig økonomi? (valgfri)
              </label>
            </div>
          </div>
        </div>

        {/* E-Data: Energiforbrug (B3) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsEnergyConsumptionExpanded(!isEnergyConsumptionExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">3. E-Data: Energiforbrug (B3)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isEnergyConsumptionExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isEnergyConsumptionExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-4 esg-gap-4">
              <div>
                <label htmlFor="electricity_renewable" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Elektricitet: Vedvarende:
                </label>
                <input
                  type="number"
                  id="electricity_renewable"
                  name="electricity_renewable"
                  value={formData.electricity_renewable}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast vedvarende elektricitet"
                />

              </div>
              <div>
                <label htmlFor="electricity_non_renewable" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Elektricitet: Ikke-vedvarende:
                </label>
                <input
                  type="number"
                  id="electricity_non_renewable"
                  name="electricity_non_renewable"
                  value={formData.electricity_non_renewable}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast ikke-vedvarende elektricitet"
                />

              </div>
              <div>
                <label htmlFor="fuel_renewable" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Brændstoffer: Vedvarende:
                </label>
                <input
                  type="number"
                  id="fuel_renewable"
                  name="fuel_renewable"
                  value={formData.fuel_renewable}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast vedvarende brændstoffer"
                />

              </div>
              <div>
                <label htmlFor="fuel_non_renewable" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Brændstoffer: Ikke-vedvarende:
                </label>
                <input
                  type="number"
                  id="fuel_non_renewable"
                  name="fuel_non_renewable"
                  value={formData.fuel_non_renewable}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast ikke-vedvarende brændstoffer"
                />

              </div>
            </div>
          </div>
        </div>

        {/* E-Data: CO₂e-udledninger (B3) - continued */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCo2EmissionsExpanded(!isCo2EmissionsExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">4. E-Data: CO₂e-udledninger (B3)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCo2EmissionsExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCo2EmissionsExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-4 esg-gap-4">
              <div>
                <label htmlFor="scope1_emissions" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Scope 1 CO₂e udledninger:
                </label>
                <input
                  type="number"
                  id="scope1_emissions"
                  name="scope1_emissions"
                  value={formData.scope1_emissions}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast Scope 1 udledninger"
                />

              </div>
              <div>
                <label htmlFor="scope2_emissions" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Scope 2 CO₂e udledninger:
                </label>
                <input
                  type="number"
                  id="scope2_emissions"
                  name="scope2_emissions"
                  value={formData.scope2_emissions}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast Scope 2 udledninger"
                />

              </div>
              <div>
                <label htmlFor="co2e_intensity" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  CO₂e-intensitet:
                </label>
                <input
                  type="number"
                  id="co2e_intensity"
                  name="co2e_intensity"
                  value={formData.co2e_intensity}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast CO₂e-intensitet"
                />

              </div>
              <div>
                <label htmlFor="scope3_emissions" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Scope 3 CO₂e udledninger (valgfri):
                </label>
                <input
                  type="number"
                  id="scope3_emissions"
                  name="scope3_emissions"
                  value={formData.scope3_emissions}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast Scope 3 udledninger"
                />
              </div>
            </div>
          </div>
        </div>

        {/* E-Data: Forurening af luft, vand og jord (B4) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsPollutionExpanded(!isPollutionExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">5. E-Data: Forurening af luft, vand og jord (B4)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isPollutionExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isPollutionExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="md:esg-col-span-2">
              <label htmlFor="pollution_reporting" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                Rapportering om forurening (obligatorisk hvis relevant):
              </label>
              <textarea
                id="pollution_reporting"
                name="pollution_reporting"
                value={formData.pollution_reporting}
                onChange={handleChange}
                rows="3"
                className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                placeholder="Indtast oplysninger om forurening"
              ></textarea>
            </div>
          </div>
        </div>

        {/* E-Data: Biodiversitet (B5) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsBiodiversityExpanded(!isBiodiversityExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">6. E-Data: Biodiversitet (B5)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isBiodiversityExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isBiodiversityExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
              <div>
                <label htmlFor="biodiversity_sensitive_areas" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Opgørelse af virksomhedens områder i nærheden af eller i 'biodiversitetsfølsomme områder’ (obligatorisk hvis relevant):
                </label>
                <textarea
                  id="biodiversity_sensitive_areas"
                  name="biodiversity_sensitive_areas"
                  value={formData.biodiversity_sensitive_areas}
                  onChange={handleChange}
                  rows="3"
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast oplysninger om biodiversitetsfølsomme områder"
                ></textarea>
              </div>
              <div>
                <label htmlFor="land_area_usage" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Virksomhedens arealforbrug (valgfri):
                </label>
                <input
                  type="number"
                  id="land_area_usage"
                  name="land_area_usage"
                  value={formData.land_area_usage}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast arealforbrug"
                />
              </div>
            </div>
          </div>
        </div>

        {/* E-Data: Vand (B6) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsWaterExpanded(!isWaterExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">7. E-Data: Vand (B6)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isWaterExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isWaterExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
              <div>
                <label htmlFor="water_withdrawal" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Udtagning af vand:
                </label>
                <input
                  type="number"
                  id="water_withdrawal"
                  name="water_withdrawal"
                  value={formData.water_withdrawal}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast udtagning af vand"
                />

              </div>
              <div>
                <label htmlFor="water_consumption" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Vandforbrug (obligatorisk hvis relevant):
                </label>
                <input
                  type="number"
                  id="water_consumption"
                  name="water_consumption"
                  value={formData.water_consumption}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast vandforbrug"
                />
              </div>
            </div>
          </div>
        </div>

        {/* E-Data: Ressourceforbrug, cirkulær økonomi og affaldshåndtering (B7) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsResourcesWasteExpanded(!isResourcesWasteExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">8. E-Data: Ressourceforbrug, cirkulær økonomi og affaldshåndtering (B7)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isResourcesWasteExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isResourcesWasteExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-3 esg-gap-4">
              <div className="esg-flex esg-items-center esg-mb-4 md:esg-col-span-3">
                <input
                  type="checkbox"
                  id="uses_circular_economy_principles"
                  name="uses_circular_economy_principles"
                  checked={formData.uses_circular_economy_principles || false}
                  onChange={handleChange}
                  className="esg-mr-2 esg-h-4 esg-w-4 esg-text-blue-600 esg-border-gray-300 esg-rounded focus:esg-ring-blue-500"
                />
                <label htmlFor="uses_circular_economy_principles" className="esg-text-gray-700 esg-text-md esg-font-bold">
                  Anvendelse af principper fra cirkulær økonomi (JA/NEJ):
                </label>
              </div>
              {formData.uses_circular_economy_principles && (
                <div className="md:esg-col-span-3 esg-mb-4">
                  <label htmlFor="circular_economy_description" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                    Beskrivelse af, hvordan der arbejdes med principper fra cirkulær økonomi:
                  </label>
                  <textarea
                    id="circular_economy_description"
                    name="circular_economy_description"
                    value={formData.circular_economy_description}
                    onChange={handleChange}
                    rows="3"
                    className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                    placeholder="Beskriv jeres arbejde med cirkulær økonomi"
                  ></textarea>
                </div>
              )}
              <div>
                <label htmlFor="total_waste_hazardous" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Total mængde farligt affald årligt:
                </label>
                <input
                  type="number"
                  id="total_waste_hazardous"
                  name="total_waste_hazardous"
                  value={formData.total_waste_hazardous}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast farligt affald"
                />

              </div>
              <div>
                <label htmlFor="total_waste_non_hazardous" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Total mængde ikke-farligt affald årligt:
                </label>
                <input
                  type="number"
                  id="total_waste_non_hazardous"
                  name="total_waste_non_hazardous"
                  value={formData.total_waste_non_hazardous}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast ikke-farligt affald"
                />

              </div>
              <div>
                <label htmlFor="waste_recycled" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Total mængde affald, der sendes til genbrug eller genanvendelse:
                </label>
                <input
                  type="number"
                  id="waste_recycled"
                  name="waste_recycled"
                  value={formData.waste_recycled}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast genbrugt/genanvendt affald"
                />

              </div>
              <div className="md:esg-col-span-2">
                <label htmlFor="mass_flow_materials" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Årlige masse-flow for virksomhedens centrale materialer (obligatorisk hvis relevant):
                </label>
                <textarea
                  id="mass_flow_materials"
                  name="mass_flow_materials"
                  value={formData.mass_flow_materials}
                  onChange={handleChange}
                  rows="3"
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast masse-flow for materialer"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* S-Data: Egen arbejdsstyrke (B8) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsWorkforceExpanded(!isWorkforceExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">9. S-Data: Egen arbejdsstyrke (B8)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isWorkforceExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isWorkforceExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-3 esg-gap-4">
              <div>
                <label htmlFor="contract_type" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Kontrakttype:
                </label>
                <input
                  type="text"
                  id="contract_type"
                  name="contract_type"
                  value={formData.contract_type}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast kontrakttype"
                />
              </div>
              <div>
                <label htmlFor="gender_composition" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Kønssammensætning:
                </label>
                <input
                  type="text"
                  id="gender_composition"
                  name="gender_composition"
                  value={formData.gender_composition}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast kønssammensætning"
                />
              </div>
              <div>
                <label htmlFor="employee_turnover" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Medarbejderomsætning (oplyses kun ved mere end 50 ansatte, valgfri):
                </label>
                <input
                  type="number"
                  id="employee_turnover"
                  name="employee_turnover"
                  value={formData.employee_turnover}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast medarbejderomsætning"
                />
              </div>
              <div className="md:esg-col-span-3">
                <label htmlFor="employees_abroad" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Ansættelseskontrakter i andre lande udover Danmark (obligatorisk hvis relevant):
                </label>
                <textarea
                  id="employees_abroad"
                  name="employees_abroad"
                  value={formData.employees_abroad}
                  onChange={handleChange}
                  rows="3"
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast oplysninger om ansættelseskontrakter i udlandet"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* S-Data: Sundhed og sikkerhed (B9) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsHealthSafetyExpanded(!isHealthSafetyExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">10. S-Data: Sundhed og sikkerhed (B9)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isHealthSafetyExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isHealthSafetyExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-4">
              <div>
                <label htmlFor="work_accidents" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Egen arbejdsstyrke: Registrerede arbejdsulykker:
                </label>
                <input
                  type="number"
                  id="work_accidents"
                  name="work_accidents"
                  value={formData.work_accidents}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast antal arbejdsulykker"
                />

              </div>
              <div>
                <label htmlFor="work_related_deaths" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Egen arbejdsstyrke: Arbejdsrelaterede dødsfald:
                </label>
                <input
                  type="number"
                  id="work_related_deaths"
                  name="work_related_deaths"
                  value={formData.work_related_deaths}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast antal arbejdsrelaterede dødsfald"
                />

              </div>
            </div>
          </div>
        </div>

        {/* S-Data: Vederlag, overenskomster og uddannelse (B10) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsCompensationExpanded(!isCompensationExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">11. S-Data: Vederlag, overenskomster og uddannelse (B10)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCompensationExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isCompensationExpanded ? 'esg-max-h-[5000px] esg-p-4 esg-opacity-100' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 lg:esg-grid-cols-4 esg-gap-4">
              <div>
                <label htmlFor="salary_below_minimum" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Oplysning om aflønning over/under minimumsløn:
                </label>
                <select
                  id="salary_below_minimum"
                  name="salary_below_minimum"
                  value={formData.salary_below_minimum}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                >
                  <option value="">Vælg</option>
                  <option value="over">Over minimumsløn</option>
                  <option value="under">Under minimumsløn</option>
                  <option value="equal">Minimumsløn</option>
                </select>

              </div>
              <div>
                <label htmlFor="gender_pay_gap" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Lønforskel mellem mandlige og kvindelige ansatte (oplyses kun ved over 150 ansatte, valgfri):
                </label>
                <input
                  type="number"
                  id="gender_pay_gap"
                  name="gender_pay_gap"
                  value={formData.gender_pay_gap}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast lønforskel"
                />
              </div>
              <div>
                <label htmlFor="collective_bargaining_coverage" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Procentvis ansatte, der er dækket af en kollektiv overenskomst:
                </label>
                <input
                  type="number"
                  id="collective_bargaining_coverage"
                  name="collective_bargaining_coverage"
                  value={formData.collective_bargaining_coverage}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast procent"
                />

              </div>
              <div>
                <label htmlFor="avg_training_hours" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Uddannelsestimer i gennemsnit pr. ansat:
                </label>
                <input
                  type="number"
                  id="avg_training_hours"
                  name="avg_training_hours"
                  value={formData.avg_training_hours}
                  onChange={handleChange}
                  className={`esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline`}
                  placeholder="Indtast timer"
                />

              </div>
            </div>
          </div>
        </div>

        {/* G-Data: Virksomhedsledelse (B11) */}
        <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg esg-shadow-sm">
          <div className="esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-bg-gray-50 hover:esg-bg-gray-100 esg-rounded-t-lg" onClick={() => setIsGovernanceExpanded(!isGovernanceExpanded)}>
            <h3 className="esg-text-xl esg-font-semibold esg-text-gray-700">12. G-Data: Virksomhedsledelse (B11)</h3>
            <FaChevronDown className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isGovernanceExpanded ? 'esg-rotate-180' : ''}`} />
          </div>
          <div className={`esg-transition-[max-height,opacity] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isGovernanceExpanded ? 'esg-max-h-[5000px] esg-p-4' : 'esg-max-h-0 esg-p-0 esg-opacity-0'}`}>
            <div className="esg-grid esg-grid-cols-1 esg-gap-4">
              <div>
                <label htmlFor="corruption_bribery_cases" className="esg-block esg-text-gray-700 esg-text-md esg-font-bold esg-mb-2">
                  Antal domme og bøder i relation til korruption & bestikkelse (obligatorisk hvis relevant):
                </label>
                <input
                  type="number"
                  id="corruption_bribery_cases"
                  name="corruption_bribery_cases"
                  value={formData.corruption_bribery_cases}
                  onChange={handleChange}
                  className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
                  placeholder="Indtast antal sager"
                />
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

export default CompanyFigures;


