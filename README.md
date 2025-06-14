# Wartezeiten PWA

Eine Progressive Web App zur Live-Anzeige der Wartezeiten ausgewählter Attraktionen.  
Die App lädt die Daten initial und aktualisiert sie automatisch alle 20 Sekunden.

## Features

- Übersichtliche Karten-Ansicht (Card-Layout) mit Ride-Name und aktueller Wartezeit  
- Sortierung: längste Wartezeit oben, geschlossene Attraktionen ausgegraut und ganz unten  
- Mobile-First & responsive Design  
- Offline-Nutzung dank Service Worker (letzte API-Antworten im Cache)  
- Installierbar als App („Zum Home-Bildschirm hinzufügen“)

## Datenquelle

Alle Wartezeiten stammen aus der öffentlichen API von **Queue-Times.com**:  
<https://queue-times.com/parks/56/queue_times.json>

## Disclaimer

Dieses Projekt wurde unabhängig von den Entwicklern der API und dem Park erstellt.  
Es besteht keine offizielle Verbindung zum Park oder zu Queue-Times.com.  
Der Autor übernimmt keine Haftung für die Richtigkeit oder Verfügbarkeit der Daten.
