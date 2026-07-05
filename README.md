# 🚗 Car Profiles

Eine moderne, mobile-optimierte GitHub-Pages-Webseite für Fahrzeugprofile per QR-Code.

## Struktur

- `index.html` – Startseite mit Übersicht aller Fahrzeuge
- `styles.css` – Gemeinsames Styling (hell, modern, responsive)
- `cars/` – Einzelne Fahrzeugseiten
  - `cars/bmw-m3-e46.html` – Beispielprofil

## Neue Fahrzeugseite hinzufügen

1. Datei unter `cars/` anlegen, z. B. `cars/audi-tt-8j.html`
2. Struktur von `cars/bmw-m3-e46.html` kopieren
3. Inhalte anpassen:
   - Marke & Modell
   - Baujahr
   - Besitzer
   - Seit wann im Besitz
   - Instagram
   - Leistung (kW/PS)
   - Modifikationen nach Bereichen (Motor, Fahrwerk, Felgen, etc.)
4. Auf `index.html` eine neue Karte in der Fahrzeugliste ergänzen

## GitHub Pages aktivieren

1. Repository öffnen: `Settings` → `Pages`
2. Unter **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** Standard-Branch (`main` oder `master`) + `/ (root)`
3. Speichern
4. Nach kurzer Zeit ist die Seite unter deiner Pages-URL erreichbar.

## Hinweis zu QR-Codes

Für jedes Fahrzeug kannst du direkt den Link auf die jeweilige Datei unter `/cars/...html` als QR-Code nutzen.
