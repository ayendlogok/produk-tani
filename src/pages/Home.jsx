import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, CloudRain, Droplets, MapPin, 
  ChevronRight, Zap, ShieldCheck,
  TrendingUp, Users, Activity, X, ArrowLeft,
  Wind, ThermometerSun, Leaf
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Home.css';

import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { crops } = useFarm();
  const { user, logout } = useAuth();
  const [locationName, setLocationName] = useState('Emerald City');
  const [weather, setWeather] = useState({ temp: 31, rain: 5, hum: 62, uv: 4 });
  const [showDetail, setShowDetail] = useState(null);

  // Derived stats from real FarmContext
  const hasCrops = crops.length > 0;
  const scannedCrops = crops.filter(c => c.health !== null);
  const avgHealth = scannedCrops.length > 0 
    ? Math.round(scannedCrops.reduce((acc, current) => acc + current.health, 0) / scannedCrops.length) 
    : 0;

  const monitoringList = crops;

  useEffect(() => {
    const fetchByCoords = async (lat, lon) => {
      try {
        // Reverse geocode to get city name
        const geoResp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geoResp.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || 'Lokasi Anda';
        setLocationName(city);

        // Fetch real weather
        const weatherResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,uv_index&timezone=auto`);
        const wData = await weatherResp.json();
        if (wData.current) {
          setWeather({
            temp: Math.round(wData.current.temperature_2m),
            rain: wData.current.precipitation || 0,
            hum: wData.current.relative_humidity_2m || 0,
            uv: Math.round(wData.current.uv_index) || 0,
          });
        }
      } catch (e) { console.error('Weather API error', e); }
    };

    // Try GPS first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        async () => {
          // GPS denied — fallback to IP geolocation
          try {
            const ipResp = await fetch('https://ipapi.co/json/');
            const ipData = await ipResp.json();
            setLocationName(ipData.city || 'Indonesia');
            fetchByCoords(ipData.latitude, ipData.longitude);
          } catch (e) {
            setLocationName('Indonesia');
          }
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      // No geolocation support
      setLocationName('Indonesia');
    }
  }, []);

  return (
    <div className="home-ultra">
      {/* Hero Welcome with Animated Elements */}
      <section className="hero-ultra-section">
        <div className="hero-content-v2">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="big-greet"
          >
            Halo, <span className="highlight">{user?.name?.split(' ')[0] || 'Rekan'}!</span>
          </motion.h2>
          <div className="hero-meta-v2">
            <p className="hero-desc">Data proyek Anda sinkron dan stabil hari ini.</p>
          </div>
        </div>
        
        <div className="status-board glass-panel">
           <div className="status-main">
              <span className="live-pill">{scannedCrops.length > 0 ? 'LIVE' : 'IDLE'}</span>
              <div className="percent-circle">
                 <svg viewBox="0 0 36 36" className="circular-chart emerald">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${avgHealth}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{scannedCrops.length > 0 ? `${avgHealth}%` : '--'}</text>
                 </svg>
              </div>
              <div className="status-text">
                 <h4>Kesehatan Aset</h4>
                 <p>{scannedCrops.length > 0 ? 'Data terverifikasi scanner' : 'Lakukan scan di Panel Kendali'}</p>
              </div>
           </div>
        </div>
      </section>

      <div className="ultra-grid">
         <div className="col-2 garden-card ultra-card">
            <div className="card-bg-icon"><Sun size={120} /></div>
            <div className="weather-pro-content">
               <div className="w-left">
                  <span className="w-tag">Cuaca Lokal</span>
                  <div className="w-deg-box">
                    <h1>{weather.temp}°</h1>
                    <div className="w-deg-sub">
                       <span className="w-loc"><MapPin size={14} /> {locationName}</span>
                       <span className="w-sky">Cerah Berawan</span>
                    </div>
                  </div>
               </div>
               <div className="w-right-grid">
                  <div className="w-mini-item">
                     <Wind size={20} />
                     <span>12 km/h</span>
                  </div>
                  <div className="w-mini-item">
                     <Droplets size={20} />
                     <span>{weather.hum}%</span>
                  </div>
                  <div className="w-mini-item">
                     <ThermometerSun size={20} />
                     <span>UV {weather.uv}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Multi-Division Feature Cards */}
         <div className="div-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', marginBottom: '24px' }}>
            <div className="ultra-card flex-center interactive" style={{ flexDirection: 'column', textAlign: 'center', padding: '24px', alignItems: 'center' }} onClick={() => window.location.href='/dashboard'}>
               <div className="action-circle-bg bg-emerald" style={{ marginBottom: '16px' }}><Leaf size={32} /></div>
               <div className="action-info">
                  <h3>IoT Agrikultur</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>Kelembapan & Irigasi</p>
               </div>
            </div>
            <div className="ultra-card flex-center interactive" style={{ flexDirection: 'column', textAlign: 'center', padding: '24px', alignItems: 'center' }} onClick={() => window.location.href='/dashboard'}>
               <div className="action-circle-bg bg-sun" style={{ marginBottom: '16px' }}><ShieldCheck size={32} /></div>
               <div className="action-info">
                  <h3>Pemantauan Ternak</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>Suhu Kandang & Pakan</p>
               </div>
            </div>
            <div className="ultra-card flex-center interactive" style={{ flexDirection: 'column', textAlign: 'center', padding: '24px', alignItems: 'center' }} onClick={() => window.location.href='/dashboard'}>
               <div className="action-circle-bg" style={{ marginBottom: '16px', background: 'var(--p-sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={32} /></div>
               <div className="action-info">
                  <h3>Kualitas Air Kolam</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>pH & Oksigen Terlarut</p>
               </div>
            </div>
            <div className="ultra-card flex-center interactive" style={{ flexDirection: 'column', textAlign: 'center', padding: '24px', alignItems: 'center' }} onClick={() => window.location.href='/dashboard'}>
               <div className="action-circle-bg" style={{ marginBottom: '16px', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={32} /></div>
               <div className="action-info">
                  <h3>Satelit Kehutanan</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>Deteksi Api & Titik Panas</p>
               </div>
            </div>
         </div>

         {/* Monitoring Section */}
         <div className="col-full monitoring-section">
            <div className="section-title-ultra">
               <h3>Monitor Aktif</h3>
               <span className="badge-pill">{monitoringList.length} Proyek Online</span>
            </div>
            <div className="monitoring-list-ultra">
               {monitoringList.length > 0 ? (
                 monitoringList.map((plot, i) => (
                    <motion.div 
                      className="plot-card ultra-card" 
                      key={i}
                      whileHover={{ x: 10 }}
                    >
                       <div className="plot-info-main">
                          <div className="crop-avatar"><Leaf size={24} /></div>
                          <div className="plot-text">
                             <h4>{plot.name}</h4>
                             <span>{plot.division || 'Pertanian'} • {plot.variety || 'Tanaman'}</span>
                          </div>
                       </div>
                       <div className="plot-stats">
                          <div className="stat-unit">
                             <span className="l">Kesehatan</span>
                             <span className="v text-emerald">{plot.health}%</span>
                          </div>
                          <div className="stat-unit">
                             <span className="l">Update</span>
                             <span className="v">{plot.last}</span>
                          </div>
                       </div>
                    </motion.div>
                 ))
               ) : (
                 <div className="empty-plot-silk glass-panel">
                    <Activity size={40} className="glow-emerald" />
                    <h4>Belum Ada Proyek</h4>
                    <p>Mulai tambahkan aset atau proyek Anda di Panel Kendali.</p>
                    <NavLink to="/dashboard" className="btn-premium sm">Buka Panel <ChevronRight size={14} /></NavLink>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;
