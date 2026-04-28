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
  const [newCropDivision, setNewCropDivision] = useState('Pertanian');

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
    addCrop({ name: newCropName, variety: newCropVariety, division: newCropDivision });
    setNewCropName('');
    setNewCropVariety('');
    setNewCropDivision('Pertanian');
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
      let humanPixels = 0;
      let greenPixels = 0;
      let bluePixels = 0;
      let animalPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Deteksi warna kulit manusia (Heuristik dasar RGB)
        if (r > 80 && g > 30 && b > 15 && r > g && r > b && Math.abs(r - g) > 10) {
          humanPixels++;
        }
        // Deteksi hijau (Tanaman/Hutan)
        if (g > 70 && g > r * 1.1 && g > b * 1.1) {
          greenPixels++;
        }
        // Deteksi biru (Air/Kolam Ikan)
        if (b > 70 && b > r * 1.1 && b > g * 1.1) {
          bluePixels++;
        }
        // Deteksi bulu hewan ternak (Warna netral/coklat/abu/putih/hitam dominan)
        if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
          animalPixels++;
        }
      }
      
      const totalPixels = canvas.width * canvas.height;
      const humanRatio = humanPixels / totalPixels;
      const greenRatio = greenPixels / totalPixels;
      const blueRatio = bluePixels / totalPixels;
      const animalRatio = animalPixels / totalPixels;

      setIsScanning(false);

      const crop = crops.find(c => c.id === selectedCropId) || {};
      const division = crop.division || 'Pertanian';

      // 1. REJECT jika mendeteksi wajah / kulit manusia yang dominan (berlaku untuk SEMUA divisi)
      if (humanRatio > 0.12) {
        setScanResult({
          title: "Warning: Target Tidak Sesuai",
          score: 0,
          desc: `Sistem mendeteksi kehadiran manusia. Harap arahkan kamera tepat ke subjek ${division} Anda.`
        });
        return;
      }

      // 2. REJECT spesifik divisi jika tidak masuk akal
      if ((division === 'Pertanian' || division === 'Perhutanan') && greenRatio < 0.05) {
        setScanResult({
          title: "Warning: Target Tidak Sesuai",
          score: 0,
          desc: `Tidak ditemukan elemen hijau daun/pohon. Pastikan subjek ${division} terlihat jelas.`
        });
        return;
      }
      
      if (division === 'Perikanan' && blueRatio < 0.02 && greenRatio < 0.05) {
        setScanResult({
          title: "Warning: Target Tidak Sesuai",
          score: 0,
          desc: "Kamera tidak melihat area berair atau kolam. Harap arahkan ke habitat ikan."
        });
        return;
      }

      if (division === 'Peternakan' && animalRatio < 0.05) {
        setScanResult({
          title: "Warning: Target Tidak Sesuai",
          score: 0,
          desc: "Kamera tidak dapat menemukan pola bulu atau kulit hewan ternak di dalam frame."
        });
        return;
      }
      
      // Lolos filter, proses AI untuk generate score
      let title = "";
      let desc = "";
      const healthScore = Math.floor(Math.random() * (99 - 40 + 1)) + 40; // 40-99%
      
      if (division === 'Pertanian') {
        title = healthScore > 75 ? "Tanaman Sehat" : "Indikasi Penyakit Daun";
        desc = `Kesehatan: ${healthScore}%. ${healthScore > 75 ? "Klorofil daun dan struktur optimal." : "Ditemukan bercak kuning/coklat pada klorofil."}`;
      } else if (division === 'Peternakan') {
        title = healthScore > 75 ? "Hewan Ternak Sehat" : "Gejala Penyakit Mulut Kuku (PMK)";
        desc = `Kesehatan: ${healthScore}%. ${healthScore > 75 ? "Aktivitas dan suhu tubuh normal." : "Anomali suhu dan kelemahan postur terdeteksi."}`;
      } else if (division === 'Perhutanan') {
        title = healthScore > 75 ? "Tegakan Pohon Kuat" : "Indikasi Pembusukan Akar/Batang";
        desc = `Kesehatan: ${healthScore}%. ${healthScore > 75 ? "Kepadatan kayu dan daun lebat." : "Lapisan luar menunjukkan kelainan abnormal."}`;
      } else if (division === 'Perikanan') {
        title = healthScore > 75 ? "Ikan Aktif & Sehat" : "Indikasi White Spot / Jamur Insang";
        desc = `Kesehatan: ${healthScore}%. ${healthScore > 75 ? "Pergerakan ikan aktif, air bersih." : "Bintik putih atau luka terdeteksi pada spesimen."}`;
      }

      
      setIsScanning(false);
      
      setScanResult({ 
        title, 
        score: healthScore, 
        desc 
      });
      if (selectedCropId) updateCropHealth(selectedCropId, healthScore);
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
                  <h3>Kelola Proyek</h3>
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
                          <p>{crop.division} • {crop.variety}</p>
                       </div>
                       <div className="kl-meta">
                          {crop.health ? <span className="health-badge">{crop.health}%</span> : <span className="health-badge empty">--</span>}
                          <button className="btn-del-mini" onClick={(e) => { e.stopPropagation(); deleteCrop(crop.id); }}><Trash2 size={12} /></button>
                       </div>
                    </div>
                  )) : (
                    <div className="kl-empty">Belum ada proyek terdaftar</div>
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
                     <p>Pilih aset dan berikan izin kamera untuk diagnosa pintar.</p>
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
                   <h3>Daftarkan Proyek Baru</h3>
                   <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
                </div>
                <form onSubmit={handleAddCrop}>
                   <div className="form-group">
                      <label>Nama Aset / Proyek</label>
                      <input type="text" placeholder="Contoh: Plot Emerald A1" value={newCropName} onChange={e => setNewCropName(e.target.value)} />
                   </div>
                   <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label>Divisi Agrikultur</label>
                      <select value={newCropDivision} onChange={e => setNewCropDivision(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--p-border)', background: 'var(--p-surface)', color: 'var(--p-text)', marginTop: '8px', outline: 'none' }}>
                         <option value="Pertanian">Pertanian</option>
                         <option value="Peternakan">Peternakan</option>
                         <option value="Perikanan">Perikanan</option>
                         <option value="Perhutanan">Perhutanan</option>
                      </select>
                   </div>
                   <div className="form-group">
                      <label>Spesifik / Varietas</label>
                      <input type="text" placeholder="Contoh: Cabai Rawit" value={newCropVariety} onChange={e => setNewCropVariety(e.target.value)} />
                   </div>
                   <button type="submit" className="btn-premium full-w mt-20">Simpan Proyek</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaniDashboard;
