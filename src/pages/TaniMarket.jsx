import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, ExternalLink, 
  Box, Plus, X
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import './TaniMarket.css';

// Curated Premium Agricultural Products
const PRODUCTS = [
  // BIBIT
  { id: 1, name: 'Bibit Padi Inpari 32 (5kg)', price: 125000, category: 'Bibit', rate: 4.9, img: 'https://images.unsplash.com/photo-1536630596251-b12ba0d7f7eb?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 2, name: 'Bibit Cabai Rawit Unggul (10gr)', price: 45000, category: 'Bibit', rate: 4.8, img: 'https://images.unsplash.com/photo-1592150621344-82841499d305?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 3, name: 'Bibit Jagung Hybrid Perkasa', price: 85000, category: 'Bibit', rate: 4.7, img: 'https://images.unsplash.com/photo-1628155981180-2646d616886e?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 4, name: 'Bibit Selada Hidroponik (1000 biji)', price: 35000, category: 'Bibit', rate: 5.0, img: 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 5, name: 'Bibit Tomat Cherry Red Velvet', price: 55000, category: 'Bibit', rate: 4.9, img: 'https://images.unsplash.com/photo-1594901061363-93ca1db97839?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  
  // NUTRISI
  { id: 6, name: 'Pupuk Organik Cair (POC) 1L', price: 65000, category: 'Nutrisi', rate: 4.8, img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 7, name: 'Nutrisi AB Mix Sayuran Daun', price: 95000, category: 'Nutrisi', rate: 4.9, img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 8, name: 'Hormon Pertumbuhan Giberelin', price: 42000, category: 'Nutrisi', rate: 4.6, img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 9, name: 'Pupuk NPK Mutiara Biru (1kg)', price: 28000, category: 'Nutrisi', rate: 4.8, img: 'https://images.unsplash.com/photo-1463123081488-729f608e9b55?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 10, name: 'Vitamin B1 Tanaman Anti Stres', price: 18000, category: 'Nutrisi', rate: 4.7, img: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },

  // ALAT
  { id: 11, name: 'Sensor Tanah IoT (Wi-Fi)', price: 450000, category: 'Alat', rate: 5.0, img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 12, name: 'Drone Sprayer Agricultural X1', price: 18500000, category: 'Alat', rate: 4.9, img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 13, name: 'Alat Ukur pH Tanah Digital', price: 125000, category: 'Alat', rate: 4.5, img: 'https://images.unsplash.com/photo-1530836361253-efad529f8a1a?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 14, name: 'Timer Irigasi Otomatis', price: 285000, category: 'Alat', rate: 4.8, img: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 15, name: 'Gunting Stek Baja Carbon', price: 45000, category: 'Alat', rate: 4.7, img: 'https://images.unsplash.com/photo-1591123720164-de1348b2c485?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },

  // TANAH
  { id: 16, name: 'Media Tanam Organik (10kg)', price: 35000, category: 'Tanah', rate: 4.8, img: 'https://images.unsplash.com/photo-1416870230247-3b4a8366f7b1?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 17, name: 'Kompos Murni Super Subur', price: 25000, category: 'Tanah', rate: 4.9, img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 18, name: 'Tanah Humus Hutan Asli', price: 40000, category: 'Tanah', rate: 4.7, img: 'https://images.unsplash.com/photo-1485603780336-7494548d8884?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 19, name: 'Pasir Malang Merah (5kg)', price: 22000, category: 'Tanah', rate: 4.6, img: 'https://images.unsplash.com/photo-1528733355523-be126742a78f?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 20, name: 'Cocopeat Halus Grade A', price: 15000, category: 'Tanah', rate: 4.8, img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },

  // ADDITIONAL PREMIUM ITEMS
  { id: 21, name: 'Bibit Melon Premium Golden', price: 75000, category: 'Bibit', rate: 4.9, img: 'https://images.unsplash.com/photo-1595855759920-86582396706d?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 22, name: 'Eco Booster Bunga & Buah', price: 88000, category: 'Nutrisi', rate: 4.8, img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 23, name: 'Smart Controller Irigasi IoT', price: 1250000, category: 'Alat', rate: 5.0, img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 24, name: 'Mineral Tanah Alami (Ziolit)', price: 45000, category: 'Tanah', rate: 4.7, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 25, name: 'Bibit Anggur Import Jupiter', price: 145000, category: 'Bibit', rate: 5.0, img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 26, name: 'Spray Pestisida Organik 500ml', price: 35000, category: 'Nutrisi', rate: 4.6, img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 27, name: 'Alat Tes Kandungan NPK Tanah', price: 320000, category: 'Alat', rate: 4.8, img: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 28, name: 'Peat Moss Substrat Jerman', price: 210000, category: 'Tanah', rate: 4.9, img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 29, name: 'Bibit Semangka Tanpa Biji', price: 65000, category: 'Bibit', rate: 4.7, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 30, name: 'Pupuk Guano Kelawar Asli', price: 55000, category: 'Nutrisi', rate: 4.8, img: 'https://images.unsplash.com/photo-1592652426689-5327244f7703?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 31, name: 'Automatic Seed Sower Pro', price: 780000, category: 'Alat', rate: 4.9, img: 'https://images.unsplash.com/photo-1505063364137-5ff68afb81f1?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 32, name: 'Arang Sekam Steril (10L)', price: 15000, category: 'Tanah', rate: 4.8, img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 33, name: 'Bibit Avocado Aligator (1m)', price: 185000, category: 'Bibit', rate: 5.0, img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id' },
  { id: 34, name: 'Bio-Fungisida Ramah Lingkungan', price: 48000, category: 'Nutrisi', rate: 4.7, img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com' },
  { id: 35, name: 'Smart LED Growlight UV-Full', price: 890000, category: 'Alat', rate: 4.9, img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id', division: 'Pertanian' },
  
  // PETERNAKAN
  { id: 36, name: 'Pakan Ayam Pedaging Premium 50kg', price: 350000, category: 'Pakan', rate: 4.8, img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com', division: 'Peternakan' },
  { id: 37, name: 'Vitamin & Antibiotik Sapi', price: 125000, category: 'Nutrisi', rate: 4.9, img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id', division: 'Peternakan' },

  // PERIKANAN
  { id: 38, name: 'Pelet Ikan Lele Super Protein 10kg', price: 110000, category: 'Pakan', rate: 4.8, img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com', division: 'Perikanan' },
  { id: 39, name: 'Pompa Aerator Kolam Koi', price: 250000, category: 'Alat', rate: 4.7, img: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id', division: 'Perikanan' },

  // PERHUTANAN
  { id: 40, name: 'Bibit Pohon Jati Emas', price: 45000, category: 'Bibit', rate: 4.9, img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400', shop: 'https://tokopedia.com', division: 'Perhutanan' },
  { id: 41, name: 'Chainsaw Pro Max', price: 1850000, category: 'Alat', rate: 4.8, img: 'https://images.unsplash.com/photo-1590211186717-b73a46fb1f81?auto=format&fit=crop&q=80&w=400', shop: 'https://shopee.co.id', division: 'Perhutanan' },

  // HASIL PANEN (MOCK USER LISTINGS)
  { id: 42, name: 'Susu Sapi Segar (10L)', price: 150000, category: 'Hasil Panen', rate: 5.0, img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400', shop: 'https://wa.me/628123456789', division: 'Hasil Panen' },
  { id: 43, name: 'Ikan Nila Segar (5kg)', price: 160000, category: 'Hasil Panen', rate: 4.9, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', shop: 'https://wa.me/628123456789', division: 'Hasil Panen' },

];

const TaniMarket = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [sellForm, setSellForm] = useState({ name: '', price: '', division: 'Pertanian', desc: '' });

  useEffect(() => {
    const q = query(collection(db, 'marketListings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserListings(listings);
    }, (err) => {
      console.warn("Error fetching market listings: ", err);
    });
    return () => unsubscribe();
  }, []);

  const handleSell = async (e) => {
    e.preventDefault();
    if(!sellForm.name) return;
    
    try {
      await addDoc(collection(db, 'marketListings'), {
        name: sellForm.name,
        price: parseInt(sellForm.price) || 0,
        category: 'Hasil Panen',
        rate: 5.0,
        img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        shop: 'https://wa.me/62800000000',
        division: sellForm.division,
        desc: sellForm.desc,
        createdAt: serverTimestamp()
      });
      setShowSellModal(false);
      setSellForm({ name: '', price: '', division: 'Pertanian', desc: '' });
      setFilter('Hasil Panen');
    } catch(err) {
      alert("Gagal mempublikasikan jualan: " + err.message);
    }
  };

  const filteredProducts = useMemo(() => {
    const allItems = [...userListings, ...PRODUCTS.map(p => ({...p, division: p.division || 'Pertanian'}))];
    return allItems.filter(p => 
      (filter === 'Semua' || p.division === filter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [filter, search, userListings]);

  return (
    <div className="market-ultra">
      <div className="market-top glass-panel">
         <div className="search-box-ultra">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Cari produk pertanian premium..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="category-scroll">
         {['Semua', 'Pertanian', 'Peternakan', 'Perikanan', 'Perhutanan', 'Hasil Panen'].map(c => (
           <button 
             key={c} 
             className={`pill ${filter === c ? 'active' : ''}`}
             onClick={() => setFilter(c)}
           >
              {c}
           </button>
         ))}
      </div>

      <div className="catalog-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <p>Menampilkan {filteredProducts.length} Produk Pilihan</p>
         <button className="btn-premium" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => setShowSellModal(true)}>
            <Plus size={16} /> Jual Hasil Panen
         </button>
      </div>

      <div className="product-grid-ultra">
         <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="product-card-ultra" 
                key={p.id}
              >
                 <div className="p-img-wrap">
                    <img src={p.img} alt={p.name} loading="lazy" />
                    <div className="p-tag glass-panel">{p.category}</div>
                 </div>
                 <div className="p-info-ultra">
                    <div className="p-rate"><Star size={12} fill="var(--p-sun)" /> {p.rate}</div>
                    <h4>{p.name}</h4>
                    <div className="p-footer-direct">
                       <span className="p-price">Rp {p.price.toLocaleString()}</span>
                       <button 
                         className="btn-buy-now"
                         onClick={() => window.open(p.shop, '_blank')}
                       >
                          Beli <ExternalLink size={14} />
                       </button>
                    </div>
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>
      
      <div className="market-footer-hint">
         <Box size={24} className="ghost-icon" />
         <p>AgroPlus Premium Market - Kualitas Terjamin.</p>
      </div>

      <AnimatePresence>
        {showSellModal && (
          <div className="modal-overlay-silk flex-center">
             <motion.div 
               className="add-modal-silk glass-panel"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               style={{ zIndex: 100 }}
             >
                <div className="modal-head">
                   <h3>Jual Hasil Panen</h3>
                   <button className="close-btn" onClick={() => setShowSellModal(false)}><X /></button>
                </div>
                <form onSubmit={handleSell}>
                   <div className="form-group">
                      <label>Nama Produk</label>
                      <input type="text" placeholder="Contoh: Ikan Nila Segar 5kg" value={sellForm.name} onChange={e => setSellForm({...sellForm, name: e.target.value})} />
                   </div>
                   <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label>Sektor</label>
                      <select value={sellForm.division} onChange={e => setSellForm({...sellForm, division: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--p-border)', background: 'var(--p-surface)', color: 'var(--p-text)', marginTop: '8px', outline: 'none' }}>
                         <option value="Pertanian">Pertanian</option>
                         <option value="Peternakan">Peternakan</option>
                         <option value="Perikanan">Perikanan</option>
                         <option value="Perhutanan">Perhutanan</option>
                      </select>
                   </div>
                   <div className="form-group">
                      <label>Harga (Rp)</label>
                      <input type="number" placeholder="Contoh: 150000" value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                   </div>
                   <div className="form-group">
                      <label>Deskripsi (Opsional)</label>
                      <input type="text" placeholder="Contoh: Siap kirim via Gojek" value={sellForm.desc} onChange={e => setSellForm({...sellForm, desc: e.target.value})} />
                   </div>
                   <button type="submit" className="btn-premium full-w mt-20">Pasarkan Sekarang</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaniMarket;
