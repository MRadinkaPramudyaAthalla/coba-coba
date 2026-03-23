// Dark mode
const html = document.documentElement;
let dark = localStorage.getItem('thm') === 'dark' || (!localStorage.getItem('thm') && matchMedia('(prefers-color-scheme:dark)').matches);
function applyDark(d) {
  html.classList.toggle('dark', d);
  document.getElementById('dkIco').innerHTML = d ? '<i class="fa-solid fa-moon" style="color:#93c5fd"></i>' : '<i class="fa-solid fa-sun" style="color:#facc15"></i>';
  localStorage.setItem('thm', d ? 'dark' : 'light');
}
applyDark(dark);
document.getElementById('dkBtn').addEventListener('click', () => { dark = !dark; applyDark(dark); });

// Mobile nav
const ham = document.getElementById('ham'), mnav = document.getElementById('mnav');
const h1=document.getElementById('h1'),h2=document.getElementById('h2'),h3=document.getElementById('h3');
let mOpen = false;
ham.addEventListener('click', () => {
  mOpen = !mOpen;
  mnav.style.maxHeight = mOpen ? '500px' : '0';
  h1.style.transform = mOpen ? 'translateY(7.5px) rotate(45deg)' : '';
  h2.style.opacity   = mOpen ? '0' : '1';
  h3.style.transform = mOpen ? 'translateY(-7.5px) rotate(-45deg)' : '';
});
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mOpen = false; mnav.style.maxHeight = '0';
  h1.style.transform = h3.style.transform = ''; h2.style.opacity = '1';
}));

// Navbar shadow + back-to-top
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow = scrollY > 20 ? '0 4px 30px rgba(37,99,235,.1)' : 'none';
  const btt = document.getElementById('btt');
  btt.style.display = scrollY > 400 ? 'flex' : 'none';
});

// Scroll reveal
const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); }), {threshold:.12});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el => obs.observe(el));

// Stat counter
function countUp(el, target, sfx='') {
  const duration = 2200;
  const start = performance.now();
  const round = target >= 500 ? 10 : 1;
  let last = -1;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const val = progress < 1
      ? Math.round((ease * target) / round) * round
      : target;
    if (val !== last) { el.textContent = val + sfx; last = val; }
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let statsTriggered = false;
function triggerStats() {
  if (statsTriggered) return;
  statsTriggered = true;
  countUp(document.getElementById('s1'), 3000, '+');
  countUp(document.getElementById('s2'), 1600, '+');
  countUp(document.getElementById('s3'), 15, '+');
}

const sObs = new IntersectionObserver(es => {
  if(es[0].isIntersecting) {
    triggerStats();
    sObs.disconnect();
  }
}, {threshold: 0.1});
const s1El = document.getElementById('s1');
sObs.observe(s1El);

// Fallback: jika elemen stats sudah visible saat halaman load (hero section langsung terlihat)
function checkStatsVisible() {
  const rect = s1El.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    triggerStats();
    sObs.disconnect();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkStatsVisible);
} else {
  // DOM sudah siap
  setTimeout(checkStatsVisible, 100);
}

// Bubbles
const bc = document.getElementById('bubbles');
for(let i=0;i<12;i++){
  const b = document.createElement('div');
  const sz = Math.random()*22+7;
  b.className='bubble';
  b.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-duration:${Math.random()*12+7}s;animation-delay:${Math.random()*12}s;opacity:${Math.random()*.25+.05}`;
  bc.appendChild(b);
}

// Galeri filter
function gFilter(btn, cat) {
  document.querySelectorAll('.gf').forEach(b => b.classList.toggle('act', b === btn));
  document.querySelectorAll('#gg .gitem').forEach(item => {
    const show = cat === 'all' || item.dataset.c === cat;
    item.style.display = show ? '' : 'none';
    if(show) { item.style.opacity = '0'; requestAnimationFrame(() => { item.style.transition='opacity .4s ease,transform .4s ease'; item.style.opacity='1'; }); }
  });
}

// Lightbox
function lbOpen(el, cap) {
  const lb = document.getElementById('lb');
  const img = document.getElementById('lb-img');
  const realImg = el.querySelector('img[src]:not([src=""])');
  if(realImg && realImg.src && realImg.style.display !== 'none') {
    img.src = realImg.src;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
  document.getElementById('lb-cap').textContent = cap || '';
  lb.classList.add('on');
  document.body.style.overflow = 'hidden';
}
function lbClose(e) {
  if(e) e.stopPropagation();
  document.getElementById('lb').classList.remove('on');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if(e.key==='Escape') lbClose(); });

// Form toast
function submitForm() {
  const t = document.getElementById('toast');
  t.style.opacity = '1'; t.style.transform = 'translateY(0)';
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(16px)'; }, 3800);
}

// Active nav
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if(scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.na').forEach(a => {
    a.style.color = a.getAttribute('href') === '#'+cur ? (dark?'#60a5fa':'#2563eb') : '';
  });
});
// ── FAQ Accordion ──
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = ans.style.maxHeight && ans.style.maxHeight !== '0px';
  document.querySelectorAll('.faq-ans').forEach(a => { a.style.maxHeight = '0px'; });
  document.querySelectorAll('.faq-icon').forEach(i => { i.style.transform=''; });
  if (!isOpen) {
    ans.style.maxHeight = ans.scrollHeight + 'px';
    icon.style.transform = 'rotate(45deg)';
  }
}

// ══════════════════════════════════════════════════════════════════
// 🎵 MUSIC PLAYER WITH PLAYLIST - Team Hindia Bogor
// ══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

const playlist = [
  { title: "Secukupnya", artist: "Hindia", file: "music/secukupnya.mp3", duration: "0:20", startTime: 10, cover: "img/Menari.jpg" },
  { title: "Rumah Ke Rumah", artist: "Hindia", file: "music/rumah.mp3", duration: "0:20", startTime: 9, cover: "img/Menari.jpg" },
  { title: "Kita ke Sana", artist: "Hindia", file: "music/kita.mp3", duration: "0:20", startTime: 79, cover: "img/lhab.jpg" },
  { title: "Everything U Are", artist: "Hindia", file: "music/everything.mp3", duration: "0:20", startTime: 60, cover: "img/dove.jpg" },
  { title: "Besok Mungkin Kita Sampai", artist: "Hindia", file: "music/besok.mp3", duration: "0:20", startTime: 62, cover: "img/Menari.jpg" },
  { title: "Berdansalah", artist: "Hindia", file: "music/berdansalah karir ini tidak ada artinya.mp3", duration: "0:20", startTime: 65, cover: "img/lhab.jpg" }
];

const PREVIEW_DURATION = 20; // Preview 20 detik
let currentTrack = 0, isPlaying = false, isPlayerOpen = false, isPlaylistOpen = false;
let previewTimeout = null;

const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const playingIndicator = document.getElementById('playingIndicator');
const musicPlayerContainer = document.getElementById('musicPlayerContainer');
const audio = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('mp-play-pause');
const prevBtn = document.getElementById('mp-prev');
const nextBtn = document.getElementById('mp-next');
const progressContainer = document.getElementById('mp-progress-container');
const progressBar = document.getElementById('mp-progress-bar');
const currentTimeEl = document.getElementById('mp-current-time');
const durationEl = document.getElementById('mp-duration');
const volumeSlider = document.getElementById('mp-volume-slider');
const volumeBar = document.getElementById('mp-volume-bar');
const volumeIcon = document.getElementById('mp-volume-icon');
const songTitle = document.getElementById('mp-song-title');
const songArtist = document.getElementById('mp-song-artist');
const playlistToggle = document.getElementById('mp-playlist-toggle');
const playlistIcon = document.getElementById('mp-playlist-icon');
const playlistContainer = document.getElementById('mp-playlist');
const playlistItems = document.getElementById('mp-playlist-items');

function initPlayer() {
  loadTrack(currentTrack);
  renderPlaylist();
  audio.volume = 0.7;
  volumeBar.style.width = '70%';
  
  const savedTrack = localStorage.getItem('mp-current-track');
  if (savedTrack !== null) { 
    currentTrack = parseInt(savedTrack); 
    loadTrack(currentTrack); 
  }
  // No need to restore time in preview mode - always start from startTime
}

function loadTrack(index) {
  const track = playlist[index];
  
  // Reset audio sebelum ganti src
  audio.pause();
  audio.src = track.file;
  audio.load(); // WAJIB dipanggil setelah ganti src
  
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  durationEl.textContent = track.duration;
  progressBar.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  
  // Update album cover
  const coverEl = document.getElementById('mp-album-cover');
  if (coverEl && track.cover) {
    coverEl.src = track.cover;
    coverEl.style.display = 'block';
  }
  
  // Gunakan 'canplay' agar lebih andal dibanding 'loadedmetadata'
  audio.addEventListener('canplay', function setStart() {
    audio.currentTime = track.startTime;
  }, { once: true });
  
  // Fallback: set startTime juga di loadedmetadata
  audio.addEventListener('loadedmetadata', function setStartFallback() {
    if (audio.currentTime < track.startTime) {
      audio.currentTime = track.startTime;
    }
  }, { once: true });
  
  updatePlaylistUI();
  localStorage.setItem('mp-current-track', index);
}

function togglePlay() { isPlaying ? pauseMusic() : playMusic(); }

function playMusic() {
  const track = playlist[currentTrack];
  
  // Pastikan currentTime sudah di startTime sebelum play
  if (audio.readyState >= 1 && audio.currentTime < track.startTime) {
    audio.currentTime = track.startTime;
  }
  
  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
    musicIcon.textContent = '⏸️';
    playingIndicator.classList.remove('hidden');
    
    // Clear any existing timeout
    if (previewTimeout) clearTimeout(previewTimeout);
    
    // Auto-next setelah sisa waktu preview habis
    const endTime = track.startTime + PREVIEW_DURATION;
    const remainingTime = Math.max(0, endTime - audio.currentTime);
    previewTimeout = setTimeout(() => {
      nextTrack();
    }, remainingTime * 1000);
    
  }).catch(error => {
    console.error('Error playing music:', error);
    console.warn('Pastikan file MP3 sudah ada di folder music/');
  });
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
  musicIcon.textContent = '🎵';
  playingIndicator.classList.add('hidden');
  
  // Clear preview timeout
  if (previewTimeout) {
    clearTimeout(previewTimeout);
    previewTimeout = null;
  }
}

function prevTrack() {
  currentTrack--;
  if (currentTrack < 0) currentTrack = playlist.length - 1;
  loadTrack(currentTrack);
  if (isPlaying) playMusic();
}

function nextTrack() {
  currentTrack++;
  if (currentTrack >= playlist.length) currentTrack = 0;
  loadTrack(currentTrack);
  if (isPlaying) playMusic();
}

function updateProgress() {
  const track = playlist[currentTrack];
  const startTime = track.startTime;
  const endTime = startTime + PREVIEW_DURATION;
  const currentTime = audio.currentTime;
  
  // Calculate progress within the 20-second preview window
  const elapsed = currentTime - startTime;
  const percent = Math.max(0, Math.min(100, (elapsed / PREVIEW_DURATION) * 100));
  
  progressBar.style.width = percent + '%';
  
  // Show time as elapsed/total (0:00 to 0:20)
  const displayTime = Math.max(0, Math.min(PREVIEW_DURATION, elapsed));
  currentTimeEl.textContent = formatTime(displayTime);
  
  // Auto-stop if we've exceeded the preview window
  if (currentTime >= endTime && isPlaying) {
    nextTrack();
  }
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const percent = clickX / width;
  
  // Set time within the 20-second preview window
  const track = playlist[currentTrack];
  const newTime = track.startTime + (percent * PREVIEW_DURATION);
  audio.currentTime = newTime;
}

function setVolume(e) {
  const width = volumeSlider.clientWidth;
  const volume = e.offsetX / width;
  audio.volume = volume;
  volumeBar.style.width = (volume * 100) + '%';
  updateVolumeIcon(volume);
}

function toggleMute() {
  if (audio.volume > 0) {
    audio.dataset.lastVolume = audio.volume;
    audio.volume = 0;
    volumeBar.style.width = '0%';
    volumeIcon.textContent = '🔇';
  } else {
    const lastVolume = parseFloat(audio.dataset.lastVolume) || 0.7;
    audio.volume = lastVolume;
    volumeBar.style.width = (lastVolume * 100) + '%';
    updateVolumeIcon(lastVolume);
  }
}

function updateVolumeIcon(volume) {
  if (volume === 0) volumeIcon.textContent = '🔇';
  else if (volume < 0.5) volumeIcon.textContent = '🔉';
  else volumeIcon.textContent = '🔊';
}

function renderPlaylist() {
  playlistItems.innerHTML = '';
  playlist.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'mp-playlist-item';
    item.dataset.index = index;
    item.innerHTML = `
      <div class="mp-playlist-number">${String(index + 1).padStart(2, '0')}</div>
      <div class="mp-playlist-song-info">
        <div class="mp-playlist-song-title">${track.title}</div>
        <div class="mp-playlist-song-duration">${track.artist} • ${track.duration}</div>
      </div>
      <div class="mp-playlist-playing-icon" style="display:none;">🎵</div>
    `;
    item.addEventListener('click', () => {
      currentTrack = index;
      loadTrack(currentTrack);
      playMusic();
    });
    playlistItems.appendChild(item);
  });
  updatePlaylistUI();
}

function updatePlaylistUI() {
  const items = playlistItems.querySelectorAll('.mp-playlist-item');
  items.forEach((item, index) => {
    const playingIcon = item.querySelector('.mp-playlist-playing-icon');
    if (index === currentTrack) {
      item.classList.add('active');
      playingIcon.style.display = 'block';
    } else {
      item.classList.remove('active');
      playingIcon.style.display = 'none';
    }
  });
}

function togglePlaylist() {
  isPlaylistOpen = !isPlaylistOpen;
  if (isPlaylistOpen) {
    playlistContainer.classList.add('open');
    playlistIcon.classList.add('open');
  } else {
    playlistContainer.classList.remove('open');
    playlistIcon.classList.remove('open');
  }
}

function togglePlayer() {
  isPlayerOpen = !isPlayerOpen;
  musicPlayerContainer.classList.toggle('active', isPlayerOpen);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ':' + String(secs).padStart(2, '0');
}

musicBtn.addEventListener('click', togglePlayer);
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', toggleMute);
playlistToggle.addEventListener('click', togglePlaylist);
audio.addEventListener('ended', nextTrack);
document.addEventListener('visibilitychange', () => { if (document.hidden && isPlaying) pauseMusic(); });
document.addEventListener('keydown', (e) => {
  if (!isPlayerOpen) return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  else if (e.code === 'ArrowLeft') prevTrack();
  else if (e.code === 'ArrowRight') nextTrack();
  else if (e.code === 'Escape') togglePlayer();
});
window.addEventListener('load', initPlayer);
window.addEventListener('beforeunload', () => {
  localStorage.setItem('mp-current-track', currentTrack);
  // No need to save time in preview mode
});

})(); // End of music player IIFE

// ============================
// KOTAK SARAN
// ============================

let kategoriDipilih = "";

function pilihKategori(el) {
  document.querySelectorAll(".saran-cat").forEach(btn => btn.classList.remove("active"));
  el.classList.add("active");
  kategoriDipilih = el.dataset.cat;
}

(function initSaran() {
  const text = document.getElementById("saran-text");
  const count = document.getElementById("saran-count");
  if (text) {
    text.addEventListener("input", () => {
      count.textContent = text.value.length + " / 500";
    });
  }
})();

async function kirimSaran() {
  const pesan = document.getElementById("saran-text").value;

  if (!kategoriDipilih) {
    alert("Pilih kategori dulu ya!");
    return;
  }

  if (!pesan) {
    alert("Isi pesan dulu ya!");
    return;
  }

  const data = {
    Kategori: kategoriDipilih,
    Pesan: pesan,
    Halaman: "Kotak Saran Website Hindia"
  };

  const btnText = document.getElementById("saran-btn-text");
  btnText.textContent = "Mengirim...";

  try {
    const response = await fetch("https://formspree.io/f/mdawvdkd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    console.log("Response Formspree:", response);
    if (response.ok) {
      document.getElementById("saran-success").classList.remove("hidden");
      document.getElementById("saran-text").value = "";
      document.getElementById("saran-count").textContent = "0 / 500";
      kategoriDipilih = "";
      document.querySelectorAll(".saran-cat").forEach(btn => btn.classList.remove("active"));
      btnText.textContent = "Kirim Saran 💙";
    } else {
      alert("Gagal mengirim saran.");
      btnText.textContent = "Kirim Saran 💙";
    }
  } catch (error) {
    alert("Error koneksi.");
    btnText.textContent = "Kirim Saran 💙";
  }
}