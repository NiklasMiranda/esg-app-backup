from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Company, CompanyBasismodulData

class CompanyBasismodulDataTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.company = Company.objects.create(name='Test Company', user=self.user)
        self.client.force_authenticate(user=self.user)
        self.company_basismodul_data_url = reverse('companybasismoduldata-list')
        
    def test_create_company_basismodul_data(self):
        data = {
            'company': self.company.id,
            'basis_for_preparation': 'Annual Report 2023',
            'legal_form': 'Aktieselskab',
            'nace_sector_codes': ['A01', 'A02'],
            'balance_sheet_total': '1000000.00',
            'revenue': '2000000.00',
            'employees': 50,
            'asset_locations': 'Headquarters, Factory',
            'confidentiality_exclusions': 'Some confidential info',
            'esg_certificate_description': 'ISO 14001 certified',
            'has_initiatives': True,
            'electricity_renewable': '1000.00',
            'electricity_non_renewable': '500.00',
            'fuel_renewable': '200.00',
            'fuel_non_renewable': '100.00',
            'scope1_emissions': '100.00',
            'scope2_emissions': '50.00',
            'co2e_intensity': '0.50',
            'scope3_emissions': '200.00',
            'pollution_reporting': 'Reports annually to EPA',
            'biodiversity_sensitive_areas': 'Near protected forest',
            'land_area_usage': '1000.00',
            'water_withdrawal': '500.00',
            'water_consumption': '400.00',
            'uses_circular_economy_principles': True,
            'circular_economy_description': 'Recycling programs in place',
            'total_waste_hazardous': '10.00',
            'total_waste_non_hazardous': '100.00',
            'waste_recycled': '70.00',
            'mass_flow_materials': 'Steel, Aluminum',
            'contract_type': 'Permanent, Temporary',
            'gender_composition': '50% Male, 50% Female',
            'employees_abroad': 'Offices in Germany',
            'employee_turnover': '0.10',
            'work_accidents': 2,
            'work_related_deaths': 0,
            'salary_below_minimum': 'equal',
            'gender_pay_gap': '0.03',
            'collective_bargaining_coverage': '0.80',
            'avg_training_hours': '20.00',
            'corruption_bribery_cases': 0,
        }
        response = self.client.post(self.company_basismodul_data_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CompanyBasismodulData.objects.count(), 1)
        self.assertEqual(CompanyBasismodulData.objects.get().employees, 50)

    def test_retrieve_company_basismodul_data(self):
        # Create an instance first
        basis_data = CompanyBasismodulData.objects.create(
            company=self.company,
            basis_for_preparation='Annual Report 2023',
            legal_form='Aktieselskab',
            nace_sector_codes=['A01'],
            balance_sheet_total=1000000.00,
            revenue=2000000.00,
            employees=50,
            asset_locations='Headquarters',
            electricity_renewable=1000.00,
            electricity_non_renewable=500.00,
            fuel_renewable=200.00,
            fuel_non_renewable=100.00,
            scope1_emissions=100.00,
            scope2_emissions=50.00,
            co2e_intensity=0.50,
            water_withdrawal=500.00,
            total_waste_hazardous=10.00,
            total_waste_non_hazardous=100.00,
            waste_recycled=70.00,
            work_accidents=2,
            work_related_deaths=0,
            salary_below_minimum='equal',
            collective_bargaining_coverage=0.80,
            avg_training_hours=20.00,
        )
        
        url = reverse('companybasismoduldata-detail', args=[basis_data.pk])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['employees'], 50)

    def test_update_company_basismodul_data(self):
        basis_data = CompanyBasismodulData.objects.create(
            company=self.company,
            basis_for_preparation='Annual Report 2023',
            legal_form='Aktieselskab',
            nace_sector_codes=['A01'],
            balance_sheet_total=1000000.00,
            revenue=2000000.00,
            employees=50,
            asset_locations='Headquarters',
            electricity_renewable=1000.00,
            electricity_non_renewable=500.00,
            fuel_renewable=200.00,
            fuel_non_renewable=100.00,
            scope1_emissions=100.00,
            scope2_emissions=50.00,
            co2e_intensity=0.50,
            water_withdrawal=500.00,
            total_waste_hazardous=10.00,
            total_waste_non_hazardous=100.00,
            waste_recycled=70.00,
            work_accidents=2,
            work_related_deaths=0,
            salary_below_minimum='equal',
            collective_bargaining_coverage=0.80,
            avg_training_hours=20.00,
        )
        updated_data = {
            'company': self.company.id,
            'employees': 55, # Update employees
            'legal_form': 'Anpartsselskab', # Update legal form
            # Include all other fields even if unchanged, as PUT replaces the entire resource
            'basis_for_preparation': 'Annual Report 2023',
            'nace_sector_codes': ['A01'],
            'balance_sheet_total': '1000000.00',
            'revenue': '2000000.00',
            'asset_locations': 'Headquarters',
            'electricity_renewable': '1000.00',
            'electricity_non_renewable': '500.00',
            'fuel_renewable': '200.00',
            'fuel_non_renewable': '100.00',
            'scope1_emissions': '100.00',
            'scope2_emissions': '50.00',
            'co2e_intensity': '0.50',
            'water_withdrawal': '500.00',
            'total_waste_hazardous': '10.00',
            'total_waste_non_hazardous': '100.00',
            'waste_recycled': '70.00',
            'work_accidents': '2',
            'work_related_deaths': '0',
            'salary_below_minimum': 'equal',
            'collective_bargaining_coverage': '0.80',
            'avg_training_hours': '20.00',
        }
        url = reverse('companybasismoduldata-detail', args=[basis_data.pk])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        basis_data.refresh_from_db()
        self.assertEqual(basis_data.employees, 55)
        self.assertEqual(basis_data.legal_form, 'Anpartsselskab')
