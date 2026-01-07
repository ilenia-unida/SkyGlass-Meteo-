import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { OPENWEATHER_KEY, WEATHER_IMAGES, COLORS } from './constants';

// 🔑 Configurazione Chiavi (Standard Vite per Netlify/GitHub)
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const WEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY || OPENWEATHER_KEY;

const ai = new GoogleGenAI(GEMINI_KEY);

interface WeatherInfo {
  city: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
  aiAdvice?: string;
}

const WeatherApp = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgImage, setBgImage] = useState(WEATHER_IMAGES['Clouds']);
  const [currentDate, setCurrentDate] = useState('');

  // 📅 Aggiorna la data in tempo reale
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      setCurrentDate(now.toLocaleDateString('it-IT', options));
    };
    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🤖 Chiamata all'Intelligenza Artificiale
  const getAIAdvice = async (data: any) => {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Sei un esperto meteo. In base a: ${data.main.temp}°C e ${data.weather[0].description} a ${data.name}, dai un consiglio brevissimo (max 10 parole) in italiano perfetto.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "Vestiti a strati e buona giornata!";
    }
  };

  // ☁️ Recupero dati Meteo
  const fetchWeather = async (searchCity?: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_KEY}&units=metric&lang=it`;
      if (lat && lon) url += `&lat=${lat}&lon=${lon}`;
      else url += `&q=${encodeURIComponent(searchCity || 'Milano')}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Città non trovata');
      const data = await res.json();

      const advice = await getAIAdvice(data);

      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        icon: data.weather[0].icon,
        aiAdvice: advice
      });
      setBgImage(WEATHER_IMAGES[data.weather[0].main] || WEATHER_IMAGES['Clear']);
    } catch (err) {
      setError('Errore nel recupero dati. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  // 📍 Geolocalizzazione iniziale
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => fetchWeather(undefined, p.coords.latitude, p.coords.longitude),
      () => fetchWeather('Milano')
    );
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-6 py-12 transition-all duration-1000"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="w-full max-w-md mt-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Cerca una città..."
            className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FEB05D]/50 transition-all shadow-2xl text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather(query)}
          />
          <button
            onClick={() => fetchWeather(query)}
            className="absolute right-3 top-2 bottom-2 bg-[#FEB05D] text-[#2B2A2A] px-6 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center"><div className="w-12 h-12 border-4 border-[#FEB05D] border-t-transparent rounded-full animate-spin"></div></div>
        ) : weather ? (
          <div className="mt-12 animate-fadeIn">
            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/20 shadow-2xl text-center relative overflow-hidden bg-white/5">
              <p className="text-[#FEB05D] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Meteo Attuale</p>
              <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">{weather.city}</h1>
              <div className="flex justify-center items-center gap-4 my-6">
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} className="w-24 h-24 drop-shadow-2xl" alt="icon" />
                <span className="text-8xl font-light text-white tracking-tighter">{weather.temp}°</span>
              </div>
              <p className="text-xl text-white/90 font-medium capitalize mb-8">{weather.description}</p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Umidità 💧</p>
                  <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">Vento 🌬️</p>
                  <p className="text-2xl font-bold text-white">{weather.wind} <span className="text-xs opacity-50">km/h</span></p>
                </div>
              </div>

              {weather.aiAdvice && (
                <div className="mt-8 p-6 rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-white/10 to-[#FEB05D]/5">
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <span className="text-[#FEB05D]">✨</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FEB05D]">Consiglio Smart</span>
                  </div>
                  <p className="text-white font-medium italic">"{weather.aiAdvice}"</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {error && <div className="mt-8 p-4 bg-red-500/20 border border-red-500/40 text-white rounded-2xl text-center font-bold">{error}</div>}
      </div>

      <footer className="mt-auto pt-10 text-center">
        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-white/40">{currentDate}</p>
        <p className="text-[9px] font-medium tracking-widest text-[#FEB05D]/60 mt-2">Powered by Ilenia Unida & Gemini AI 🤖</p>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<WeatherApp />);
}