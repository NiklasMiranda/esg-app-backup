from django.db import models

from .company import Company


class CompanyExtendedModuleData(models.Model):
    """Stores detailed company figures for the 'Udvidet Modul'."""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='extended_module_data')
    year = models.PositiveIntegerField(help_text="The reporting year for this Extended Module data.")

    # Generelle oplysninger: Strategi: Forretningsmodel og bæredygtighedsrelaterede initiativer (C1)
    products_services_groups = models.TextField(verbose_name="Væsentlige grupper af produkter og/eller tjenesteydelser", blank=True, null=True)
    markets = models.TextField(verbose_name="Væsentlige markeder", blank=True, null=True)
    business_relations = models.TextField(verbose_name="Primære forretningsforbindelser", blank=True, null=True)
    strategy_sustainability_elements = models.TextField(verbose_name="Centrale elementer fra virksomhedens strategi, der er relateret til/påvirker bæredygtighedsspørgsmål (C1)", blank=True, null=True)

    # Beskrivelse af indsatser, politikker og fremtidige initiativer for omstilling til en mere bæredygtig økonomi (C2)
    existing_practices_policies = models.TextField(verbose_name="Beskrivelse af eksisterende praksisser/politikker/handlinger (C2)", blank=True, null=True)
    future_initiatives_targets = models.TextField(verbose_name="Beskrivelse af fremtidige initiativer/målsætninger (C2)", blank=True, null=True)
    highest_management_level = models.CharField(max_length=255, verbose_name="Angivelse af højeste ledelsesniveau i virksomheden, der er ansvarlig for implementering (C2)", blank=True, null=True)

    # E-data: Vurdér, om Scope 3 CO₂e-udledning er relevant at oplyse om for netop din virksomhed
    scope3_co2e_relevant = models.BooleanField(verbose_name="Vurdér, om Scope 3 CO₂e-udledning er relevant", blank=True, null=True)
    scope3_co2e_emissions = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Scope 3 CO₂e-udledninger", blank=True, null=True)

    # E-data: CO₂e-reduktionsmål og klimaomstilling (C3)
    co2e_reduction_target = models.TextField(verbose_name="CO₂e-reduktionsmål (C3)", blank=True, null=True)
    co2e_baseline_year = models.PositiveIntegerField(verbose_name="CO₂e-udledning i baselineår (C3)", blank=True, null=True)
    co2e_reduction_actions = models.TextField(verbose_name="Liste med de handlinger, der skal bidrage til at nå CO₂e-reduktionsmålene (C3)", blank=True, null=True)
    climate_transition_plan = models.TextField(verbose_name="Omstillingsplan for modvirkning af klimaforandringer (C3)", blank=True, null=True)

    # E-data: Klimarisici (C4)
    climate_risks_description = models.TextField(verbose_name="Beskrivelse af klimarelaterede risici og/eller klimarelaterede omstillingsrisici (C4)", blank=True, null=True)
    exposure_vulnerability = models.TextField(verbose_name="Eksponering og sårbarhed for virksomhedens aktiver, aktiviteter og værdikæde (C4)", blank=True, null=True)
    climate_risks_time_horizon = models.CharField(max_length=255, verbose_name="Tidshorisont for, hvornår de klimarelaterede risici og omstillingsrisici forventes at få negativ indflydelse på virksomheden (C4)", blank=True, null=True)
    climate_adaptation = models.BooleanField(verbose_name="Oplysning om klimatilpasning (JA/NEJ) (C4)", blank=True, null=True)
    financial_impact_climate_risks = models.TextField(verbose_name="Potentiel negativ påvirkning på virksomhedens finansielle præstation og forretningsdrift fra de oplistede klimarisici (valgfri)", blank=True, null=True)

    # S-data: Supplerende (generelle) oplysninger om arbejdsstyrken (C5)
    gender_management_ratio = models.CharField(max_length=50, verbose_name="Forholdet mellem kvinder og mænd på ledelsesniveau (C5)", blank=True, null=True)
    independent_workers = models.PositiveIntegerField(verbose_name="Antal selvstændige, som arbejder for din virksomhed (C5)", blank=True, null=True)
    temporary_workers = models.PositiveIntegerField(verbose_name="Antal vikarer, som arbejder for din virksomhed (C5)", blank=True, null=True)

    # S-data: Egen arbejdsstyrke: Menneskerettighedspolitikker og processer (C6)
    code_of_conduct_hr_policy = models.BooleanField(verbose_name="Oplysning om ”code of conduct” eller menneskerettighedspolitik for din virksomheds egen arbejdsstyrke (JA/NEJ) (C6)", blank=True, null=True)
    grievance_mechanism = models.BooleanField(verbose_name="Oplysning om klagemekanisme for virksomhedens egne ansatte (JA/NEJ) (C6)", blank=True, null=True)

    # S-data: Alvorlige negative menneskerettighedshændelser (egen arbejdsstyrke + værdikæde) (C7)
    confirmed_hr_incidents_own_workforce = models.TextField(verbose_name="Bekræftede negative menneskerettighedshændelser for din virksomheds egen arbejdsstyrke (C7)", blank=True, null=True)
    confirmed_hr_incidents_value_chain = models.TextField(verbose_name="Bekræftede negative menneskerettighedshændelser i din virksomheds værdikæde (C7)", blank=True, null=True)

    # G-data: Indtægter fra bestemte aktiviteter og udelukkelse fra EU-referencebenchmarks (C8)
    revenue_selected_sectors = models.TextField(verbose_name="Indtægter fra udvalgte sektorer (C8)", blank=True, null=True)
    eu_benchmarks_exceedance = models.BooleanField(verbose_name="Overskridelse af EU-benchmarks i overensstemmelse med Parisaftalen (C8)", blank=True, null=True)

    # G-data: Kønsfordeling i øverste ledelsesorgan (C9)
    gender_top_management_ratio = models.CharField(max_length=50, verbose_name="Forholdet mellem kvinder og mænd i det øverste ledelsesorgan (C9)", blank=True, null=True)

    class Meta:
        verbose_name = "Company Extended Module Data"
        verbose_name_plural = "Company Extended Module Data"
        unique_together = ('company', 'year')
        
    def __str__(self):
        return f"Extended Module Data for {self.company.name} ({self.year})"