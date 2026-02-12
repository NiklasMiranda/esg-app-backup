// src/components/CompanyFigures.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CompanyFigures from './CompanyFigures';

// Mock axios
jest.mock('axios');

describe('CompanyFigures', () => {
  const COMPANY_ID = 1;
  const apiUrl = `/api/company-basismodul-data/${COMPANY_ID}/`;
  const postUrl = `/api/company-basismodul-data/`;

  const mockFormData = {
    basis_for_preparation: 'Annual Report 2023',
    legal_form: 'Aktieselskab',
    nace_sector_codes: ['A01', 'B02'],
    balance_sheet_total: 1000000.00,
    revenue: 2000000.00,
    employees: 50,
    asset_locations: 'Headquarters, Factory',
    confidentiality_exclusions: 'Some confidential info',
    esg_certificate_description: 'ISO 14001 certified',
    has_initiatives: true,
    electricity_renewable: 1000.00,
    electricity_non_renewable: 500.00,
    fuel_renewable: 200.00,
    fuel_non_renewable: 100.00,
    scope1_emissions: 100.00,
    scope2_emissions: 50.00,
    co2e_intensity: 0.50,
    scope3_emissions: 200.00,
    pollution_reporting: 'Reports annually to EPA',
    biodiversity_sensitive_areas: 'Near protected forest',
    land_area_usage: 1000.00,
    water_withdrawal: 500.00,
    water_consumption: 400.00,
    uses_circular_economy_principles: true,
    circular_economy_description: 'Recycling programs in place',
    total_waste_hazardous: 10.00,
    total_waste_non_hazardous: 100.00,
    waste_recycled: 70.00,
    mass_flow_materials: 'Steel, Aluminum',
    contract_type: 'Permanent, Temporary',
    gender_composition: '50% Male, 50% Female',
    employees_abroad: 'Offices in Germany',
    employee_turnover: 0.10,
    work_accidents: 2,
    work_related_deaths: 0,
    salary_below_minimum: 'equal',
    gender_pay_gap: 0.03,
    collective_bargaining_coverage: 0.80,
    avg_training_hours: 20.00,
    corruption_bribery_cases: 0,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
    global.alert = jest.fn(); // Mock window.alert
  });

  afterEach(() => {
    global.alert.mockRestore(); // Restore original window.alert
  });


  test('renders the component and fetches existing data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockFormData });

    render(<CompanyFigures />);

    expect(screen.getByText('Basismodul')).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(apiUrl);
      expect(screen.getByDisplayValue('Annual Report 2023')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Aktieselskab')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('B02')).toBeInTheDocument();
      expect(screen.getByLabelText(/Balancesum \(DKK\):/i)).toHaveValue(1000000);
      expect(screen.getByLabelText(/Antal ansatte:/i)).toHaveValue(50);
      expect(screen.getByText(/ISO 14001 certified/i)).toBeInTheDocument();
    });
  });

  test('submits new data successfully (POST)', async () => {
    // Mock get to return 404, simulating no existing data
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    axios.post.mockResolvedValueOnce({ data: mockFormData });

    render(<CompanyFigures />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(apiUrl));

    // Fill in some required fields
    userEvent.type(screen.getByLabelText(/Grundlag for udarbejdelse:/i), 'New Report');
    userEvent.type(screen.getByLabelText(/Virksomhedens juridiske form:/i), 'Anpartsselskab');
    fireEvent.click(screen.getByRole('button', { name: /Tilføj NACE kode/i }));
    userEvent.type(screen.getByPlaceholderText('Indtast NACE kode'), 'C03'); // First NACE code input
    userEvent.type(screen.getByLabelText(/Balancesum \(DKK\):/i), '1500000');
    userEvent.type(screen.getByLabelText(/Omsætning \(DKK\):/i), '2500000');
    userEvent.type(screen.getByLabelText(/Antal ansatte:/i), '60');
    userEvent.type(screen.getByLabelText(/Adresser og geolokation på væsentlige aktiver og anlæg:/i), 'New Office');
    userEvent.type(screen.getByLabelText(/Elektricitet: Vedvarende:/i), '1200');
    userEvent.type(screen.getByLabelText(/Elektricitet: Ikke-vedvarende:/i), '600');
    userEvent.type(screen.getByLabelText(/Brændstoffer: Vedvarende:/i), '250');
    userEvent.type(screen.getByLabelText(/Brændstoffer: Ikke-vedvarende:/i), '120');
    userEvent.type(screen.getByLabelText(/Scope 1 CO₂e udledninger:/i), '110');
    userEvent.type(screen.getByLabelText(/Scope 2 CO₂e udledninger:/i), '60');
    userEvent.type(screen.getByLabelText(/CO₂e-intensitet:/i), '0.6');
    userEvent.type(screen.getByLabelText(/Udtagning af vand:/i), '550');
    userEvent.type(screen.getByLabelText(/Total mængde farligt affald årligt:/i), '12');
    userEvent.type(screen.getByLabelText(/Total mængde ikke-farligt affald årligt:/i), '110');
    userEvent.type(screen.getByLabelText(/Total mængde affald, der sendes til genbrug eller genanvendelse:/i), '80');
    fireEvent.change(screen.getByLabelText(/Oplysning om aflønning over\/under minimumsløn:/i), { target: { value: 'over' } });
    userEvent.type(screen.getByLabelText(/Procentvis ansatte, der er dækket af en kollektiv overenskomst:/i), '0.85');
    userEvent.type(screen.getByLabelText(/Uddannelsestimer i gennemsnit pr. ansat:/i), '22');
    userEvent.type(screen.getByLabelText(/Egen arbejdsstyrke: Registrerede arbejdsulykker:/i), '3');
    userEvent.type(screen.getByLabelText(/Egen arbejdsstyrke: Arbejdsrelaterede dødsfald:/i), '0');

    fireEvent.click(screen.getByRole('button', { name: /Gem data/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      const submittedData = axios.post.mock.calls[0][1];
      expect(submittedData.basis_for_preparation).toBe('New Report');
      expect(submittedData.nace_sector_codes).toEqual(['C03']);
      expect(global.alert).toHaveBeenCalledWith('Basismodul data created successfully!');
    });
  });

  test('submits updated data successfully (PUT)', async () => {
    axios.get.mockResolvedValueOnce({ data: mockFormData }); // First get for initial fetch
    axios.put.mockResolvedValueOnce({ data: { ...mockFormData, employees: 55 } });

    render(<CompanyFigures />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(apiUrl));

    userEvent.type(screen.getByLabelText(/Antal ansatte:/i), '55'); // Change existing value

    fireEvent.click(screen.getByRole('button', { name: /Gem data/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      const submittedData = axios.put.mock.calls[0][1];
      expect(submittedData.employees).toBe('55'); // Input value is string
      expect(global.alert).toHaveBeenCalledWith('Basismodul data updated successfully!');
    });
  });

  test('displays validation errors for required fields on submit', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } }); // No existing data

    render(<CompanyFigures />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(apiUrl));

    fireEvent.click(screen.getByRole('button', { name: /Gem data/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Venligst udfyld alle obligatoriske felter.');
      expect(screen.getByText('Dette felt er obligatorisk.')).toBeInTheDocument();
      expect(screen.getByText('Mindst én NACE sektor kode er obligatorisk.')).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
      expect(axios.put).not.toHaveBeenCalled();
    });
  });

  test('adds and removes NACE codes dynamically', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } }); // No existing data

    render(<CompanyFigures />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(apiUrl));

    const addNaceButton = screen.getByRole('button', { name: /Tilføj NACE kode/i });
    fireEvent.click(addNaceButton);
    const naceInputs = screen.getAllByPlaceholderText('Indtast NACE kode');
    expect(naceInputs).toHaveLength(1);
    userEvent.type(naceInputs[0], 'NACE1');

    fireEvent.click(addNaceButton);
    const naceInputsAfterAdd = screen.getAllByPlaceholderText('Indtast NACE kode');
    expect(naceInputsAfterAdd).toHaveLength(2);
    userEvent.type(naceInputsAfterAdd[1], 'NACE2');

    const removeButtons = screen.getAllByRole('button', { name: '-' });
    fireEvent.click(removeButtons[0]);
    await waitFor(() => {
        expect(screen.queryByDisplayValue('NACE1')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('NACE2')).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('Indtast NACE kode')).toHaveLength(1);
    });
  });
});
