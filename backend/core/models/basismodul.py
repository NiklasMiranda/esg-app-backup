from django.db import models

from .company import Company


class CompanyBasismodulData(models.Model):
    """Stores detailed company figures for the 'Basismodul'."""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='basismodul_data')
    year = models.PositiveIntegerField(help_text="The reporting year for this Basismodul data.")

    # Generelle oplysninger (B1)
    legal_form = models.CharField(max_length=100, verbose_name="Virksomhedens juridiske form", blank=True, null=True)
    nace_sector_codes = models.JSONField(default=list, verbose_name="NACE sektor kode(r)", blank=True, null=True) # Stores a list of codes
    balance_sheet_total = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Balancesum", blank=True, null=True)
    revenue = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Omsætning", blank=True, null=True)
    employees = models.PositiveIntegerField(verbose_name="Antal ansatte", blank=True, null=True)
    asset_locations = models.TextField(verbose_name="Adresser og geolokation på væsentlige aktiver og anlæg", blank=True, null=True)
    confidentiality_exclusions = models.TextField(verbose_name="Eventuelle udeladelser grundet fortrolighed", blank=True, null=True)
    esg_certificate_description = models.TextField(verbose_name="Kort beskrivelse af din virksomheds eventuelle ESG-certifikat eller miljømærker", blank=True, null=True)

    # Indsatser, politikker og fremtidige initiativer (B2)
    has_initiatives = models.BooleanField(verbose_name="Har konkrete indsatser, politikker eller initiativer for bæredygtighed", blank=True, null=True)

    # E-Data: Energiforbrug (B3)
    electricity_renewable = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Elektricitet: Vedvarende", blank=True, null=True)
    electricity_non_renewable = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Elektricitet: Ikke-vedvarende", blank=True, null=True)
    fuel_renewable = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Brændstoffer: Vedvarende", blank=True, null=True)
    fuel_non_renewable = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Brændstoffer: Ikke-vedvarende", blank=True, null=True)

    # E-Data: CO₂e-udledninger (B3)
    scope1_emissions = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Scope 1 CO₂e udledninger", blank=True, null=True)
    scope2_emissions = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Scope 2 CO₂e udledninger", blank=True, null=True)
    co2e_intensity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="CO₂e-intensitet", blank=True, null=True)
    scope3_emissions = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Scope 3 CO₂e udledninger (valgfri)", blank=True, null=True)

    # E-Data: Forurening af luft, vand og jord (B4)
    pollution_reporting = models.TextField(verbose_name="Rapportering om forurening", blank=True, null=True)

    # E-Data: Biodiversitet (B5)
    biodiversity_sensitive_areas = models.TextField(verbose_name="Områder i nærheden af biodiversitetsfølsomme områder", blank=True, null=True)
    land_area_usage = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Virksomhedens arealforbrug (valgfri)", blank=True, null=True)

    # E-Data: Vand (B6)
    water_withdrawal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Udtagning af vand", blank=True, null=True)
    water_consumption = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Vandforbrug (valgfri)", blank=True, null=True)

    # E-Data: Ressourceforbrug, cirkulær økonomi og affaldshåndtering (B7)
    uses_circular_economy_principles = models.BooleanField(verbose_name="Anvender principper fra cirkulær økonomi", blank=True, null=True)
    circular_economy_description = models.TextField(verbose_name="Beskrivelse af arbejde med cirkulær økonomi", blank=True, null=True)
    total_waste_hazardous = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total mængde farligt affald årligt", blank=True, null=True)
    total_waste_non_hazardous = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total mængde ikke-farligt affald årligt", blank=True, null=True)
    waste_recycled = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total mængde affald sendt til genbrug/genanvendelse", blank=True, null=True)
    mass_flow_materials = models.TextField(verbose_name="Årlige masse-flow for centrale materialer (valgfri)", blank=True, null=True)

    # S-Data: Egen arbejdsstyrke (B8)
    contract_type = models.TextField(verbose_name="Kontrakttype", blank=True, null=True)
    gender_composition = models.TextField(verbose_name="Kønssammensætning", blank=True, null=True) # Consider more structured if needed
    employees_abroad = models.TextField(verbose_name="Ansættelseskontrakter i andre lande udover Danmark (valgfri)", blank=True, null=True)
    employee_turnover = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Medarbejderomsætning (valgfri)", blank=True, null=True)

    # S-Data: Sundhed og sikkerhed (B9)
    work_accidents = models.PositiveIntegerField(verbose_name="Registrerede arbejdsulykker", blank=True, null=True)
    work_related_deaths = models.PositiveIntegerField(verbose_name="Arbejdsrelaterede dødsfald", blank=True, null=True)

    # S-Data: Vederlag, overenskomster og uddannelse (B10)
    salary_below_minimum = models.CharField(max_length=50, verbose_name="Aflønning over/under minimumsløn", blank=True, null=True)
    gender_pay_gap = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Lønforskel mellem mandlige og kvindelige ansatte (valgfri)", blank=True, null=True)
    collective_bargaining_coverage = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Procentvis ansatte dækket af kollektiv overenskomst", blank=True, null=True)
    avg_training_hours = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Uddannelsestimer i gennemsnit pr. ansat", blank=True, null=True)

    # G-Data: Virksomhedsledelse (B11)
    corruption_bribery_cases = models.PositiveIntegerField(verbose_name="Antal domme og bøder i relation til korruption & bestikkelse (valgfri)", blank=True, null=True)

    class Meta:
        verbose_name = "Company Basismodul Data"
        verbose_name_plural = "Company Basismodul Data"
        unique_together = ('company', 'year')
        
    def __str__(self):
        return f"Basismodul Data for {self.company.name}"