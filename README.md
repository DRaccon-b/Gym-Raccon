# Gym Raccon

Eine mobile Fitness-App zum Erstellen von Trainingsplänen, Protokollieren von Workouts (Sätze, Wiederholungen, Gewicht) und Einsehen des Trainingsverlaufs.

Gebaut mit [Expo](https://expo.dev) (React Native + TypeScript). Alle Daten werden lokal auf dem Gerät gespeichert (`AsyncStorage`).

## Features

- Trainingspläne mit eigenen Übungen, Sätzen und Wiederholungen erstellen
- Workout starten und Sätze live protokollieren (Wiederholungen, Gewicht)
- Trainingsverlauf mit Datum, Dauer und Satzanzahl einsehen
- Lang drücken zum Löschen von Plänen/Verlaufseinträgen

## Loslegen

```bash
npm install
npm start
```

Dann in der Expo-Ausgabe wählen:

- `a` — Android-Emulator
- `i` — iOS-Simulator (nur macOS)
- `w` — Web-Browser
- QR-Code mit der [Expo Go](https://expo.dev/go) App scannen, um es auf dem eigenen Handy zu testen

## Projektstruktur

```
src/
  types/        Gemeinsame TypeScript-Typen
  storage/      AsyncStorage-Persistenz
  context/      App-weiter State (Pläne & Sessions)
  navigation/   React Navigation Stack & Tabs
  screens/      Bildschirme (Pläne, Plan erstellen, Plan-Detail, aktives Workout, Verlauf)
```
