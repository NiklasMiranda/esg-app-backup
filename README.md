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
