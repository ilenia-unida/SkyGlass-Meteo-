# 🌤️ SkyGlass Meteo

SkyGlass Meteo è un'applicazione web moderna e sofisticata per il monitoraggio meteorologico in tempo reale, caratterizzata da un'estetica *glassmorphism* e dall'integrazione di intelligenza artificiale generativa per fornire consigli personalizzati.

**Sviluppato da: Ilenia Unida**

## ✨ Caratteristiche Principali

- **Dati Real-time**: Integrazione con l'API OpenWeather per dati accurati su temperatura, umidità, vento e condizioni atmosferiche.
- **Smart AI Advice**: Utilizza il modello **Gemini 3 Flash** per analizzare le condizioni locali e generare consigli pratici in un italiano grammaticalmente perfetto.
- **Geolocalizzazione Automatica**: Rileva la posizione dell'utente all'avvio per mostrare immediatamente il meteo locale (con fallback su Milano).
- **Design Glassmorphism**: Interfaccia ultra-moderna con effetti di sfocatura (backdrop-blur), bordi semi-trasparenti e ombre profonde per un look premium.
- **Dynamic Backgrounds**: Lo sfondo dell'applicazione cambia dinamicamente in base alle condizioni meteorologiche correnti (Sole, Nuvole, Pioggia, Neve, ecc.).
- **Data Dinamica**: Footer intelligente che mostra la data corrente formattata in italiano, aggiornata automaticamente ogni minuto.

## 🛠️ Stack Tecnologico

- **Frontend**: React 19 (ESM)
- **Styling**: Tailwind CSS
- **AI**: Google GenAI SDK (@google/genai)
- **Data Source**: OpenWeatherMap API
- **Typography**: Plus Jakarta Sans (Google Fonts)

## 🎨 Specifiche di Design

- **Color Palette**:
  - `Orange (#FEB05D)`: Accenti e dettagli importanti.
  - `Blue (#5A7ACD)`: Toni secondari e gradienti AI.
  - `Light (#F5F2F2)`: Testi e icone principali.
  - `Dark (#2B2A2A)`: Fallback di sfondo e contrasto.
- **UI Components**:
  - **Search Bar**: Input arrotondato con bordo in vetro e pulsante di ricerca animato.
  - **Weather Card**: Pannello centrale con sfocatura 25px, icone meteo HD e tipografia bold.
  - **AI Panel**: Box dedicato ai consigli con gradiente soffuso e icona scintillante (✨).

## 🚀 Funzionamento Tecnico

1. **Inizializzazione**: L'app richiede i permessi di geolocalizzazione tramite `metadata.json`.
2. **Fetch Dati**: Viene effettuata una chiamata asincrona all'API OpenWeather.
3. **Generazione AI**: Una volta ricevuti i dati, il contesto (temperatura + descrizione) viene inviato a Gemini con un prompt specifico per garantire qualità grammaticale e concisione (max 12 parole).
4. **Rendering**: Lo stato di React viene aggiornato, innescando le animazioni di transizione (fadeIn) e il cambio di immagine di sfondo.


---

> ### 🔑 Configurazione API Key 

Per eseguire il progetto sul tuo computer, segui questi passaggi per configurare correttamente le chiavi di accesso (API Keys):

1. 
**Copia il file di esempio**: Individua il file `constants.example.ts` nella cartella principale. 


2. 
**Rinomina il file**: Crea una copia del file e chiamala esattamente `constants.ts`. 


3. 
**Inserisci la tua chiave Meteo**: Apri il nuovo file `constants.ts` e sostituisci il testo `'INSERIRE_QUI_LA_TUA_CHIAVE_OPENWEATHER'` con la tua API Key personale di OpenWeatherMap. 


> 

---
*Progetto sviluppato con focus su estetica, accessibilità e innovazione tecnologica da Ilenia Unida.*
