# ESG Analyse- og Rapporteringsværktøj

Dette dokument beskriver projektets formål, teknologivalg og den overordnede plan for ombygningen af applikationen.

## Projektbeskrivelse

Applikationen er et værktøj, der gør det muligt for virksomheder at analysere og rapportere på deres ESG-indsats (Environmental, Social, and Governance).

Kernefunktionaliteter:
- Besvarelse af en række ESG-relaterede spørgsmål.
- Indtastning af specifikke nøgletal (metrics) for hvert spørgsmål.
- Upload af dokumentation til at understøtte besvarelser.
- Visning af resultater og fremskridt via interaktive grafer.
- Mulighed for at gemme data over flere år for at sammenligne udviklingen.
- Generering af en samlet rapport (PDF), der kan eksporteres.
- Et separat admin-panel, hvor ESG-specialister kan tilgå og administrere kundedata.

## Tech Stack

Den valgte teknologistak er designet til at være robust, skalerbar og effektiv til formålet.

*   **Frontend:** **React**
    *   Bygger den interaktive brugerflade for slutbrugerne.

*   **Backend:** **Django + Django REST Framework (DRF)**
    *   **Django:** Udgør kernen af backend-systemet. Håndterer forretningslogik, databasemodeller (via ORM), og det indbyggede **Admin-panel** til specialister.
    *   **DRF:** Bygger det REST API, som React-frontend'et kommunikerer med.

*   **Database:** **PostgreSQL**
    *   En robust, relationel database til at gemme alle strukturerede data (brugere, svar, nøgletal, etc.).

*   **Fil-lagring:** **Azure Blob Storage (f.eks.)**
    *   Til sikker og skalerbar opbevaring af uploadede dokumenter. Dette er den foretrukne løsning, men kræver yderligere afklaring omkring specifikke opsætningsdetaljer, før implementering påbegyndes.

## Projektplan for Ombygning

Følgende trin udgør planen for at refaktorere applikationen til den nye arkitektur.

1.  **Opsætning af Django Backend:** Oprette en ny `backend` mappe og initialisere et Django-projekt.
2.  **Database Konfiguration:** Opsætte og konfigurere en PostgreSQL-database, som Django kan forbinde til.
3.  **Modeller og Admin-panel:** Definere datamodellerne i Django (f.eks. `Question`, `Answer`, `Document`) og eksponere dem i Djangos indbyggede admin-panel.
4.  **API Udvikling:** Udvikle API-endpoints med Django REST Framework til at hente spørgsmål og gemme/opdatere svar.
5.  **Migrering af Logik:** Flytte al beregningslogik fra den nuværende JavaScript-kode til Django-backend'en.
6.  **Refaktorering af Frontend:** Ombygge React-komponenterne til at:
    *   Bruge Djangos authentication-flow (login/logout).
    *   Hente og sende data via DRF API'et i stedet for fra lokale filer.
    *   Inkludere nye UI-elementer til indtastning af nøgletal og upload af filer.
7.  **Implementering af Fil-upload:** Bygge funktionaliteten til at uploade filer fra React til en cloud storage-løsning via Django-backend'en.
8.  **Rapport-generering:** Oprette et API-endpoint i Django, der kan generere en PDF-rapport baseret på en brugers data.
9.  **Oprydning:** Fjerne forældede filer og kode fra den gamle arkitektur (f.eks. `custom-login-upload.php`, statiske datafiler).

## Verificerbare ESG Rapporter

For at give eksterne parter mulighed for at verificere ægtheden og godkendelsen af ESG-rapporter genereret fra systemet, implementeres en løsning baseret på unikke rapport-ID'er og en offentlig verifikationsportal.

**Formål:** Give samarbejdspartnere, investorer og andre interessenter en nem og betroet metode til at bekræfte, at en ESG-rapport er verificeret og godkendt af vores system.

**Løsningens Struktur (Django Backend & React Frontend):**

1.  **Backend (Django):**
    *   **Modeludvidelse:** Tilføj et felt (`verification_token` af typen `UUIDField` eller `CharField` med `unique=True`) til den eksisterende `ESGReport` eller en ny `ReportVerification` model. Dette token skal autogenereres ved oprettelse eller godkendelse af rapporten.
    *   **Unikt Token pr. Godkendt Version:** Når en ESG-rapport er endeligt godkendt af en administrator, tildeles (eller opdateres) et unikt, uforanderligt verification_token. Hvis rapporten senere ændres og gen-godkendes, skal et *nyt* token genereres for den nye version.
    *   **API Endpoint for Verifikation:** Opret et nyt, offentligt tilgængeligt API-endpoint (f.eks. `/api/verify/<uuid:token>/`). Dette endpoint skal, når kaldt med et `token`, returnere:
        *   Bekræftelse på, at rapporten er fundet og godkendt.
        *   Offentligt tilgængelige metadata om rapporten (f.eks. virksomhedsnavn, rapporteringsår, godkendelsesdato).
        *   **Sikkerhed:** Dette endpoint skal *ikke* kræve autentifikation. Det skal dog *kun* returnere ikke-følsomme data.

2.  **Frontend (React):**
    *   **Rapport-generering:** Når en bruger genererer en PDF-rapport (via et eksisterende eller nyt API-kald), skal rapporten indeholde:
        *   **Det unikke `verification_token`** synligt printet på rapporten (f.eks. i sidefoden eller på en dedikeret side).
        *   En **QR-kode**, der indkapsler en URL til verifikationsportalen med `token`'et indlejret (f.eks. `https://yourdomain.com/verify?token=UNIQ_TOKEN`). Biblioteker som `qrcode.react` kan bruges til at generere QR-koder i React.
    *   **Offentlig Verifikationsportal (React Komponent):** Opret en ny, simpel React-komponent/side (f.eks. `/verify`) i jeres frontend.
        *   Denne komponent skal kunne modtage `token`'et fra URL'ens query-parametre (f.eks. `?token=...`).
        *   Den kalder Django API'ets offentlige verifikations-endpoint med `token`'et.
        *   Baseret på svaret fra API'et, viser den en bekræftelsesmeddelelse og de relevante metadata til den eksterne part.
        *   Den skal også indeholde en inputboks, hvor man manuelt kan indtaste et token.

**Implementeringstrin:**

1.  **Backend:**
    *   Definer `verification_token` feltet i jeres `ESGReport` model.
    *   Implementer logik i Django for at generere et UUID og tildele det, når en rapport godkendes.
    *   Opret et `Serializer` til at eksponere de nødvendige offentlige metadata for verifikations-endpoint'et.
    *   Lav en `View` (f.eks. en `APIView` i DRF) og en `URL-route`, der håndterer verifikations-kaldet baseret på `token`.
2.  **Frontend:**
    *   Installer et QR-kode bibliotek (f.eks. `qrcode.react`).
    *   Tilpas rapport-genereringslogikken i React til at inkludere `verification_token` og den genererede QR-kode i PDF'en.
    *   Opret den nye `VerifyReport.js` React-komponent og dens tilhørende route (f.eks. `/verify`).
    *   Implementer fetching-logikken i `VerifyReport.js` til at kommunikere med Django's verifikations-API.

Denne tilgang giver en klar og betroet måde for eksterne parter at validere jeres ESG-rapporter, uden at de får adgang til følsomme data.

## Simpelt Tovejs Notifikationssystem

Dette system er designet til at facilitere essentielle notifikationer mellem kunder og admins, primært via e-mail, centreret omkring ESG-rapportens verificeringsproces. Det erstatter et fuldt chatsystem med en mere målrettet og event-drevet kommunikation.

**Funktionalitet:**

1.  **Notifikation til Admins:** Admins modtager en e-mail, når en kundes ESG-rapport markeres som "Klar til Verifikation".
2.  **Notifikation til Kunder:** Admins kan manuelt udløse en e-mail til kunden, når en ESG-rapport er "Verificeret" eller har ændret status efter administrativ gennemgang.

**Løsningens Struktur (Django Backend & React Frontend):**

### 1. Notifikation til Admins (Rapport Klar til Verifikation)

*   **Frontend (React - Kundeside):**
    *   **"Klar til Verifikation" Knap:** Implementer en knap (f.eks. "Send til Verifikation") på kundens rapportside. Denne knap bør kun være aktiv, når rapporten er i en tilstand, der tillader verifikation (f.eks. alle obligatoriske sektioner udfyldt).
    *   **API-kald:** Ved klik sender React et API-kald til backend for at opdatere rapportens status.
    *   **UI Feedback:** Vis en succesmeddelelse til kunden.

*   **Backend (Django):**
    *   **ESGReport Model Status:** Tilføj et `status` felt til jeres `ESGReport` model (f.eks. et `CharField` med `choices=[('DRAFT', 'Udkast'), ('READY_FOR_VERIFICATION', 'Klar til Verifikation'), ('VERIFIED', 'Verificeret'), ('REJECTED', 'Afvist')]`).
    *   **API Endpoint:** Opret et API-endpoint (f.eks. `/api/esg-reports/<id>/set-ready-for-verification/`), der modtager anmodningen fra frontend.
    *   **Logik:**
        1.  Verificer, at brugeren er kunden, der ejer rapporten.
        2.  Opdater `ESGReport.status` til `READY_FOR_VERIFICATION`.
        3.  **E-mail Trigger:** Udløs en asynkron task (anbefales: Celery) til at sende en e-mail til alle relevante admins (eller en specifik e-mailgruppe).
    *   **E-mail Skabelon:**
        *   Emne: `Ny ESG-rapport klar til verifikation: [Virksomhedsnavn] - [Rapporteringsår]`
        *   Indhold: Et professionelt udseende HTML-e-mail med link direkte til rapporten i Djangos admin-panel for hurtig adgang.

### 2. Notifikation til Kunder (Rapport Status Ændret af Admin)

*   **Frontend (React - Admin-side):**
    *   **Admin-dashboard/Admin-panel:** I Djangos admin-panel (eller et dedikeret admin React dashboard), når en admin er færdig med at gennemgå/verificere en rapport, implementeres en knap, f.eks. "Markér som Verificeret & Notificér Kunde".
    *   **API-kald:** Ved klik sender React (eller Djangos admin-interface, hvis tilpasset) et API-kald til backend.
    *   **UI Feedback:** Vis en succesmeddelelse til administratoren.

*   **Backend (Django):**
    *   **API Endpoint:** Opret et API-endpoint (f.eks. `/api/esg-reports/<id>/set-verified-and-notify/`), der modtager anmodningen fra admin.
    *   **Logik:**
        1.  Verificer, at brugeren er en autoriseret administrator.
        2.  Opdater `ESGReport.status` til `VERIFIED` (eller en anden relevant status).
        3.  **E-mail Trigger:** Udløs en asynkron task (Celery) til at sende en e-mail til den kunde, der ejer rapporten.
    *   **E-mail Skabelon:**
        *   Emne: `Din ESG-rapport for [Rapporteringsår] er nu verificeret!`
        *   Indhold: HTML-e-mail med en bekræftelsesmeddelelse og et link til kundens dashboard eller den offentlige verifikationsportal, hvor rapporten kan ses/downloades.

**Teknisk Overvejelser og Implementering (Fælles):**

*   **E-mail Backend:** Konfigurer Djangos `EMAIL_BACKEND` i `settings.py` til en robust tredjeparts-tjeneste (f.eks. SendGrid, Mailgun, AWS SES) for at sikre høj leveringsrate og professionalisme.
*   **Asynkrone Opgaver (Celery):** Anbefales kraftigt for e-mailafsendelse for at undgå at blokere webserveren og forbedre pålideligheden.
    *   Kræver en Celery-opsætning med en message broker (f.eks. Redis eller RabbitMQ).
    *   Definer Celery tasks i jeres Django-apps til at håndtere e-mail-afsendelseslogikken.
*   **E-mail Skabeloner:** Brug Djangos template-system til at oprette genanvendelige HTML-e-mail-skabeloner (f.g. `templates/emails/admin_notification.html`, `templates/emails/customer_notification.html`).
*   **Brugeroplysninger:** Sikre, at `User` eller `Company` modellerne indeholder de e-mailadresser, der skal bruges til notifikationer.
*   **Fejltolerance:** Implementer retry-mekanismer for e-mail-afsendelse i Celery tasks.