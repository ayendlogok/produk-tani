import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, Thermometer, Droplets, Wind, 
  Activity, ShieldAlert, Map as MapIcon,
  Camera, Zap, Power, AlertTriangle, CheckCircle2,
  Maximize2, Sun, ArrowLeft, RefreshCw, Radio, X, Plus, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TaniDashboard.css';
import { useFarm } from '../context/FarmContext';

const TaniDashboard = () => {
  const navigate = useNavigate();
  const { crops, addCrop, updateCropHealth, deleteCrop } = useFarm();
  const videoRef = useRef(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [stats, setStats] = useState({ temp: 28.5, humidity: 62, soil: 45 });
  const [automation, setAutomation] = useState({ light: true, water: false });
  const [monitorMode, setMonitorMode] = useState('map');
  const [isCctvConnected, setIsCctvConnected] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropVariety, setNewCropVariety] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        temp: +(prev.temp + (Math.random() - 0.5)).toFixed(1),
        humidity: +(prev.humidity + (Math.random() - 0.5) * 2).toFixed(1),
        soil: +(prev.soil + (Math.random() - 0.5)).toFixed(1),
      }));
    }, 3000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const name = data.address.city || data.address.town || data.address.village || 'Area Terdeteksi';
          setStats(prev => ({ ...prev, lat: latitude, lng: longitude, locName: name }));
        } catch (e) {
          setStats(prev => ({ ...prev, lat: -6.2, lng: 106.8, locName: 'Jakarta' }));
        }
      });
    }
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initCamera = async () => {
    // Periksa apakah browser mendukung mediaDevices (membutuhkan HTTPS atau localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Kamera diblokir oleh sistem keamanan browser. Jika Anda mencoba di HP melalui jaringan lokal, pastikan Anda telah mengaktifkan 'Insecure origins treated as secure' di chrome://flags.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } } 
      });
      setStream(mediaStream);
      setUseCamera(true);
    } catch (err) { 
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallback);
        setUseCamera(true);
      } catch (fallbackErr) {
        alert("Gagal mengakses kamera: " + fallbackErr.message + ". Pastikan Anda telah memberikan izin kamera pada browser."); 
      }
    }
  };

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!newCropName) return;
    addCrop({ name: newCropName, variety: newCropVariety });
    setNewCropName('');
    setNewCropVariety('');
    setShowAddModal(false);
  };

  const handleScanToggle = () => {
    if (isScanning) {
      setIsScanning(false);
      return;
    }
    
    if (!selectedCropId && crops.length > 0) {
      alert("Pilih lahan yang ingin di-pindai di bagian samping terlebih dahulu!");
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let plantPixels = 0;
      
      // Algoritma pendeteksi warna "Daun/Klorofil" yang lebih ketat
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Cek apakah dominan warna hijau daun yang natural (Green jauh lebih besar dari Red & Blue)
        if (g > 70 && g > r * 1.3 && g > b * 1.3) {
          plantPixels++;
        }
      }
      
      const plantRatio = plantPixels / (canvas.width * canvas.height);
      setIsScanning(false);
      
      // Butuh minimal 15% layar dipenuhi warna hijau daun untuk dianggap sebagai tanaman sungguhan
      if (plantRatio > 0.15) {
        const healthScore = Math.min(Math.round(plantRatio * 100 + 40), 99);
        setScanResult({ 
          title: "Tanaman Terdeteksi", 
          score: healthScore, 
          desc: `Kesehatan: ${healthScore}%. Klorofil daun terverifikasi.` 
        });
        if (selectedCropId) updateCropHealth(selectedCropId, healthScore);
      } else {
        setScanResult({ 
          title: "Objek Bukan Tanaman", 
          score: 0, 
          desc: "Sistem menolak scan. Ini tampak seperti benda mati atau kain. Arahkan kamera tepat ke daun tanaman hijau." 
        });
      }
    }, 4000);
  };

  return (
    <div className="dashboard-ultra-page">
      <div className="ultra-header-area">
         <h2>Pusat Kendali <span className="text-glow">Cyber-Farm</span></h2>
         <div className="node-status glass-panel">
            <Radio size={16} className="blink" />
            <span>Master Node: A1-Active</span>
         </div>
      </div>

      <div className="cyber-grid">
         <div className="cyber-sensors">
            <div className="kelola-lahan-wrap">
               <div className="kl-header">
                  <h3>Kelola Lahan</h3>
                  <button className="btn-add-mini" onClick={() => setShowAddModal(true)}><Plus size={16} /></button>
               </div>
               <div className="kl-list">
                  {crops.length > 0 ? crops.map(crop => (
                    <div 
                      key={crop.id} 
                      className={`kl-item glass-panel ${selectedCropId === crop.id ? 'active' : ''}`}
                      onClick={() => setSelectedCropId(crop.id)}
                    >
                       <div className="kl-info">
                          <h4>{crop.name}</h4>
                          <p>{crop.variety}</p>
                       </div>
                       <div className="kl-meta">
                          {crop.health ? <span className="health-badge">{crop.health}%</span> : <span className="health-badge empty">--</span>}
                          <button className="btn-del-mini" onClick={(e) => { e.stopPropagation(); deleteCrop(crop.id); }}><Trash2 size={12} /></button>
                       </div>
                    </div>
                  )) : (
                    <div className="kl-empty">Belum ada lahan terdaftar</div>
                  )}
               </div>
            </div>

            {[
              { label: 'Suhu Udara', val: `${stats.temp}°C`, icon: <Thermometer />, color: 'rose' },
              { label: 'Kelembapan', val: `${stats.humidity}%`, icon: <Droplets />, color: 'sky' },
              { label: 'Nutrisi Tanah', val: 'Optimal', icon: <Activity />, color: 'emerald' },
            ].map((s, i) => (
              <div className={`sensor-node glass-panel ${s.color}`} key={i}>
                 <div className="node-icon">{s.icon}</div>
                 <div className="node-data">
                    <span className="l">{s.label}</span>
                    <span className="v">{s.val}</span>
                 </div>
                 <div className="node-trace"></div>
              </div>
            ))}
         </div>

         <div className="cyber-scanner ultra-card">
            <div className="viewport-wrap glass-panel">
               {useCamera ? (
                 <>
                   <video ref={videoRef} autoPlay playsInline muted className="cyber-cam visible" />
                   <AnimatePresence>
                      {isScanning && (
                        <motion.div 
                          className="scan-line-ultra"
                          animate={{ top: ['0%', '100%'] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                        />
                      )}
                   </AnimatePresence>
                 </>
               ) : (
                  <div className="cam-off">
                     <Camera size={64} className="ghost-icon" />
                     <h3>Scanner AI Belum Aktif</h3>
                     <p>Pilih lahan dan berikan izin kamera untuk diagnosa pintar.</p>
                     <button className="btn-premium" onClick={initCamera}>Aktifkan Kamera</button>
                  </div>
               )}

               {scanResult && !isScanning && (
                  <div className="cyber-result glass-panel">
                     <CheckCircle2 size={32} className="text-emerald" />
                     <div className="res-msg">
                        <h4>{scanResult.title}</h4>
                        <p>{scanResult.desc}</p>
                     </div>
                     <button className="close-res" onClick={() => setScanResult(null)}><X size={16} /></button>
                  </div>
               )}
            </div>

            {useCamera && (
               <div className="cyber-controls-panel">
                  {!isScanning ? (
                    <button className="btn-premium full-w" onClick={handleScanToggle}>
                       <Maximize2 size={20} /> {selectedCropId ? `Pindai ${crops.find(c => c.id === selectedCropId)?.name}` : 'Mulai Pindai Tanaman'}
                    </button>
                  ) : (
                    <button className="btn-premium stop full-w" onClick={() => setIsScanning(false)}>Batalkan Pindai</button>
                  )}
                  <button className="btn-text" onClick={() => setUseCamera(false)}>Matikan Kamera</button>
               </div>
            )}
         </div>

         <div className="cyber-automation card glass-panel">
            <div className="auto-section">
               <h3>Sistem Otomasi</h3>
               <div className="automation-list">
                  <div className="auto-item" onClick={() => setAutomation(a => ({ ...a, light: !a.light }))}>
                     <div className="auto-info"><Sun size={18} /><span>Growlight UV-C</span></div>
                     <div className={`auto-toggle ${automation.light ? 'active' : ''}`}><div className="ball"></div></div>
                  </div>
                  <div className="auto-item" onClick={() => setAutomation(a => ({ ...a, water: !a.water }))}>
                     <div className="auto-info"><Droplets size={18} /><span>Irigasi Tetes</span></div>
                     <div className={`auto-toggle ${automation.water ? 'active' : ''}`}><div className="ball"></div></div>
                  </div>
               </div>
            </div>
            
            <div className="monitor-section-ultra">
               <div className="monitor-header">
                  <h3>Field Vision</h3>
                  <div className="monitor-switcher glass-panel">
                     <button className={monitorMode === 'map' ? 'active' : ''} onClick={() => setMonitorMode('map')}>Maps</button>
                     <button className={monitorMode === 'cctv' ? 'active' : ''} onClick={() => setMonitorMode('cctv')}>CCTV</button>
                  </div>
               </div>

               <div className="monitor-viewport glass-panel">
                  {monitorMode === 'map' ? (
                    <div className="map-view-box interactive" onClick={() => window.open(`https://maps.google.com/?q=${stats.lat || -6.2},${stats.lng || 106.8}`, '_blank')}>
                       <div className="radar-ping"></div>
                       <img src={`https://static-maps.yandex.ru/1.x/?ll=${stats.lng || 106.8},${stats.lat || -6.2}&z=17&l=sat`} alt="map" />
                       <div className="map-label"><MapIcon size={14} /> {stats.locName || 'Mendeteksi...'}</div>
                    </div>
                  ) : (
                    <div className="cctv-view-box">
                       {!isCctvConnected ? (
                          <div className="cctv-discovery">
                             <div className="discovery-scan"></div>
                             <div className="cctv-list">
                                {[{ id: 'CAM-A1', name: 'Sektor Utama' }].map(cam => (
                                  <div key={cam.id} className="cctv-item card glass-panel" onClick={() => setIsCctvConnected(cam.name)}>
                                     <div className="cctv-status online"></div>
                                     <span>{cam.name}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       ) : (
                          <div className="cctv-stream">
                             <div className="osd-top"><div className="rec-wrap"><div className="rec-dot"></div><span>LIVE</span></div></div>
                             <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600" alt="cctv" className="cctv-img-live" />
                             <button className="btn-disconnect glass-panel" onClick={() => setIsCctvConnected(false)}><X size={14} /> STOP</button>
                             <div className="interference"></div>
                          </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay-silk flex-center">
             <motion.div 
               className="add-modal-silk glass-panel"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
             >
                <div className="modal-head">
                   <h3>Daftarkan Lahan Baru</h3>
                   <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
                </div>
                <form onSubmit={handleAddCrop}>
                   <div className="form-group">
                      <label>Nama Lahan / Plot</label>
                      <input type="text" placeholder="Contoh: Plot Emerald A1" value={newCropName} onChange={e => setNewCropName(e.target.value)} />
                   </div>
                   <div className="form-group">
                      <label>Jenis Tanaman</label>
                      <input type="text" placeholder="Contoh: Cabai Rawit" value={newCropVariety} onChange={e => setNewCropVariety(e.target.value)} />
                   </div>
                   <button type="submit" className="btn-premium full-w mt-20">Simpan Lahan</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaniDashboard;
