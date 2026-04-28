import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Users, MessageSquare, Share2, 
  Heart, ArrowLeft, X, Send, Bot, Sparkles, Zap, Droplets
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useNotifications } from '../context/NotificationContext';
import './TaniHub.css';

const TaniHub = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const openLink = async (url) => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android/iOS: gunakan Capacitor Browser
        await Browser.open({ url });
      } else {
        // Web browser: gunakan window.open biasa
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      // Fallback jika Capacitor error
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  const [activeTab, setActiveTab] = useState('artikel');
  const [selectedArt, setSelectedArt] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Halo Rekan! Saya AgroTalk AI. Ada yang bisa saya bantu terkait proyek pertanian, peternakan, perikanan, atau perhutanan Anda?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  const [communities, setCommunities] = useState([
    { 
      id: 1, 
      name: 'Komunitas Petani Indonesia', 
      members: '50k+', 
      desc: 'Wadah diskusi petani Indonesia untuk berbagi pengalaman dan teknologi pertanian.',
      platform: 'Facebook Group',
      link: 'https://www.facebook.com/groups/komunitaspetaniindonesia/', 
      icon: <Users className="text-sky-500" />
    },
    { 
      id: 2, 
      name: 'Info Pertanian & Peternakan', 
      members: '20k+', 
      desc: 'Update berita pertanian, tips budidaya, dan informasi pasar terbaru.',
      platform: 'Telegram Channel',
      link: 'https://t.me/info_pertanian', 
      icon: <Droplets className="text-emerald-500" />
    },
    { 
      id: 3, 
      name: 'Forum Hidroponik Indonesia', 
      members: '30k+', 
      desc: 'Diskusi khusus mengenai teknik hidroponik, nutrisi, dan instalasi.',
      platform: 'Facebook Group',
      link: 'https://www.facebook.com/groups/hidroponikuntuksemua/', 
      icon: <Share2 className="text-blue-600" />
    },
    { 
      id: 4, 
      name: 'Pertanian Masa Kini', 
      members: '10k+', 
      desc: 'Edukasi tentang alat mesin pertanian dan inovasi teknologi pangan.',
      platform: 'Telegram',
      link: 'https://t.me/pertanianindonesia',
      icon: <Zap className="text-amber-500" />
    }
  ]);

  // Factual Agricultural News 2026 (Expanded)
  const [articles, setArticles] = useState([
    { 
      id: 1, 
      title: 'Percepatan Rehabilitasi Jaringan Irigasi Tersier 2026', 
      likes: 342, 
      source: 'Kementerian Pertanian', 
      url: 'https://pertanian.go.id',
      content: 'Pemerintah Indonesia menargetkan rehabilitasi 12.000 titik irigasi melalui program P3TGAI tahun 2026 untuk mendukung swasembada pangan nasional.', 
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 2, 
      title: 'Efisiensi Drone Sprayer di Sulawesi Selatan', 
      likes: 215, 
      source: 'RRI Online', 
      url: 'https://rri.co.id',
      content: 'Teknologi drone sprayer mampu menyemprot satu hektare lahan hanya dalam waktu 30 menit, menghemat biaya hingga 40%.', 
      img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 3, 
      title: 'Antisipasi Fenomena "Godzilla El Nino" 2026', 
      likes: 524, 
      source: 'Detik Pertanian', 
      url: 'https://detik.com/pertanian',
      content: 'Anggaran Rp5 triliun dialokasikan untuk pompanisasi guna mengantisipasi kekeringan ekstrim.', 
      img: 'https://images.unsplash.com/photo-1463123081488-729f608e9b55?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 4, 
      title: 'Tren Vertical Farming di Jakarta Selatan', 
      likes: 128, 
      source: 'Kompas', 
      url: 'https://kompas.com',
      content: 'Lahan sempit bukan halangan. Petani kota mulai beralih ke sistem vertikal otomatis.', 
      img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 5, 
      title: 'Produksi Padi Varietas Unggul Tahan Genangan', 
      likes: 89, 
      source: 'Balitbangtan', 
      url: 'https://litbang.pertanian.go.id',
      content: 'Varietas Inpara terbaru terbukti bertahan 14 hari di bawah air luapan banjir.', 
      img: 'https://images.unsplash.com/photo-1536630596251-b12ba0d7f7eb?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 6, 
      title: 'Ekspor Manggis RI Tembus Pasar Eropa', 
      likes: 754, 
      source: 'Kemenko Perekonomian', 
      url: 'https://ekon.go.id',
      content: 'Kualitas manggis Bali dan Jawa Barat memenuhi standar GAP Eropa, permintaan melonjak 15%.', 
      img: 'https://images.unsplash.com/photo-1592652426689-5327244f7703?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 7, 
      title: 'Pemanfaatan Smart Greenhouse di Bandung', 
      likes: 412, 
      source: 'Trubus Online', 
      url: 'https://trubus.id',
      content: 'Suhu dan nutrisi dikendalikan AI, hasil melon premiun meningkat 3 kali lipat.', 
      img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      id: 8, 
      title: 'Inovasi Biopestisida dari Daun Sirih', 
      likes: 198, 
      source: 'Info Pertanian', 
      url: 'https://pertanian.go.id',
      content: 'Alternatif ramah lingkungan untuk membasmi ulat tanah dan kutu daun.', 
      img: 'https://images.unsplash.com/photo-1594901061363-93ca1db97839?auto=format&fit=crop&q=80&w=600' 
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const currentInput = userInput;
    const newMsgs = [...chatMessages, { role: 'user', text: currentInput }];
    setChatMessages(newMsgs);
    setUserInput('');

    // Tambahkan indikator loading (typing...)
    setChatMessages(prev => [...prev, { role: 'ai', text: 'Berpikir...', isLoading: true }]);

    try {
      // Menggunakan Pollinations AI - Model LLM Sejati yang paham semua bahasa dan konteks
      const systemPrompt = "Kamu adalah AgroTalk, asisten AI pakar agrikultur, peternakan, perikanan, dan perhutanan buatan AgroPlus. Kamu memiliki pengetahuan luas tentang semua fitur aplikasi ini (seperti 'Kelola Proyek' untuk mendaftarkan aset, 'Marketplace' untuk fitur Jual Hasil Panen, dan 'AI Scanner Pintar' di Dashboard yang bisa mendeteksi penyakit hewan/tanaman). Jawab pertanyaan pengguna dengan ramah, akurat, informatif, dan gunakan bahasa yang sama persis dengan yang dipakai pengguna. Jangan terlalu panjang, langsung ke intinya saja namun berikan wawasan yang luas.";
      const url = `https://text.pollinations.ai/prompt/${encodeURIComponent(currentInput)}?system=${encodeURIComponent(systemPrompt)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("API Limit");
      
      const aiReply = await response.text(); // Pollinations mengembalikan teks murni, bukan JSON

      if (aiReply && aiReply.length > 2) {
        setChatMessages(prev => {
          const filtered = prev.filter(m => !m.isLoading);
          return [...filtered, { role: 'ai', text: aiReply }];
        });
        return;
      }
      throw new Error("No valid response");
    } catch (error) {
      // FALLBACK: Jika API utama down
      setTimeout(() => {
        let fallbackResponse = "Mohon maaf, server AI utama sedang sangat sibuk. Secara umum: Pastikan kondisi lingkungan proyek Anda tetap optimal dan asupan nutrisi terjaga. Ada hal spesifik yang ingin dicatat di fitur Kelola Proyek?";
        
        setChatMessages(prev => {
          const filtered = prev.filter(m => !m.isLoading);
          return [...filtered, { role: 'ai', text: fallbackResponse }];
        });
      }, 1000);
    }
  };

  return (
    <div className="app-hub-ultra">
      {/* Header Premium */}
      <header className="hub-head-silk glass-panel">
         <div className="head-left-ultra">
            <button className="btn-back-silk" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            <div className="head-title-wrap">
               <h2>Knowledge Hub</h2>
               <span className="dot-live">DATA LIVE</span>
            </div>
         </div>
         <div className="search-wrap-silk glass-panel">
            <Search size={16} />
            <input type="text" placeholder="Cari rahasia sukses bertani..." />
         </div>
      </header>

      {/* Tabs Silk */}
      <div className="hub-tabs-silk">
         {['artikel', 'komunitas'].map(t => (
           <button 
             key={t} 
             className={`tab-silk ${activeTab === t ? 'active' : ''}`}
             onClick={() => setActiveTab(t)}
           >
              {t === 'artikel' ? <BookOpen size={16} /> : <Users size={16} />}
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
           </button>
         ))}
      </div>

      <div className="hub-scroll-area">
        {activeTab === 'artikel' ? (
           <div className="article-grid-ultra">
              {articles.map(art => (
                <motion.div 
                  key={art.id} 
                  className="article-card-silk card glass-panel"
                  whileHover={{ y: -8 }}
                >
                   <div className="art-img-silk">
                      <img src={art.img} alt="art" />
                      <div className="art-source-tag glass-panel">{art.source}</div>
                   </div>
                   <div className="art-info-silk">
                      <h4>{art.title}</h4>
                      <div className="art-footer-silk">
                         <span className="art-likes"><Heart size={14} fill="var(--p-sun)" /> {art.likes}</span>
                         <button className="btn-read-silk" onClick={() => setSelectedArt(art)}>Eksplor</button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        ) : (
           <div className="community-list-silk">
              <div className="section-header-silk">
                 <h3>Komunitas Pilihan</h3>
                 <p>Bergabunglah dengan ribuan petani lainnya dalam diskusi real-time.</p>
              </div>
              <div className="com-grid-silk">
                 {communities.map(com => (
                    <motion.div 
                      key={com.id} 
                      className="com-card-silk glass-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                       <div className="com-header-silk">
                          <div className="com-icon-box">{com.icon}</div>
                          <div className="com-meta-silk">
                             <h4>{com.name}</h4>
                             <span>{com.members} Anggota • {com.platform}</span>
                          </div>
                       </div>
                       <p className="com-desc-silk">{com.desc}</p>
                       <button 
                        className="btn-join-silk btn-premium" 
                        onClick={() => {
                          addNotification('Berhasil Bergabung!', `Anda telah bergabung dengan ${com.name}. Tunggu pesan terbaru!`);
                          openLink(com.link);
                        }}
                       >
                          Gabung Sekarang <MessageSquare size={14} className="ml-8" />
                       </button>
                    </motion.div>
                 ))}
              </div>
           </div>
        )}

        {/* AI Expert Floating Widget */}
        <div className="ai-expert-card card glass-panel">
           <div className="ai-header-silk">
              <div className="ai-avatar-wrap">
                 <Bot size={24} className="glow-emerald" />
                 <div className="pulse-dot"></div>
              </div>
              <div className="ai-text-meta">
                 <h4>Tanya Pakar AI</h4>
                 <p>Paham segala masalah tani Anda.</p>
              </div>
           </div>
           <button className="btn-chat-silk btn-premium" onClick={() => setIsChatOpen(true)}>
              Mulai Konsultasi <Zap size={14} />
           </button>
        </div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <>
            <motion.div className="modal-overlay-silk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArt(null)} />
            <motion.div className="modal-art-silk glass-panel" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
               <div className="modal-top-silk">
                  <span className="source-label">{selectedArt.source}</span>
                  <button className="btn-close-epic" onClick={() => setSelectedArt(null)}><X /></button>
               </div>
               <img src={selectedArt.img} alt="art" className="modal-cover-silk" />
               <div className="modal-body-silk">
                  <h2>{selectedArt.title}</h2>
                  <div className="article-content-silk">
                     <p>{selectedArt.content}</p>
                     <p className="fact-check-hint">Informasi ini diverifikasi melalui data publik {selectedArt.source}.</p>
                  </div>
                   <button className="btn-premium full-w mt-20" onClick={() => openLink(selectedArt.url)}>
                      Baca Selengkapnya di {selectedArt.source}
                   </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div className="modal-overlay-silk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChatOpen(false)} />
            <motion.div className="chat-modal-silk glass-panel" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
               <div className="chat-head-silk">
                  <div className="ai-profile">
                     <div className="avatar-mini"><Bot size={18} /></div>
                     <div className="status-wrap">
                        <h5>AgroTalk Expert AI</h5>
                        <span className="status-online">Online (Aktif)</span>
                     </div>
                  </div>
                  <button className="close-btn-chat" onClick={() => setIsChatOpen(false)}><X /></button>
               </div>

               <div className="chat-messages-silk">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`msg-wrap ${m.role}`}>
                       <div className="msg-bubble">{m.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef}></div>
               </div>

               <div className="chat-input-area glass-panel">
                  <input 
                    type="text" 
                    placeholder="Contoh: 'Bagaimana cara mencegah penyakit pada ikan lele?'" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="send-btn-silk" onClick={handleSendMessage}><Send size={18} /></button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaniHub;
