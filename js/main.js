const layer=document.getElementById('popup-layer');
function openFarewell(){
  layer.classList.add('hide');
  document.body.classList.remove('locked');
  window.scrollTo(0,0);
  setTimeout(()=>document.querySelectorAll('.hero .reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('in'),i*180)),400);
}
document.getElementById('btnMore').onclick=()=>{startMusic();openFarewell();};
document.getElementById('btnClose').onclick=openFarewell;

const COMEBACK=[
 "Yang hari ini terasa berat, suatu hari akan kita ceritakan sambil tertawa.",
 "Status boleh berakhir di atas kertas. Pertemanan ini tidak pernah punya tanggal habis.",
 "Kita tidak pulang dengan tangan kosong. Kita pulang membawa satu sama lain.",
 "Tempatnya boleh berubah, tapi cara kita saling menjaga akan tetap sama.",
 "Semua yang kita pelajari di sini akan ikut ke mana pun kita melangkah.",
 "Tidak ada lembur yang sia-sia kalau dijalani bersama orang yang tepat.",
 "Kita pernah bertahan di masa paling sulit. Itu bukti yang tidak bisa dibantah siapa pun.",
 "Pintu ini tertutup, dan itu tidak apa-apa. Kita sudah cukup kuat untuk membuka pintu berikutnya.",
 "Kursinya boleh kosong, tapi kenangannya akan selalu terisi.",
 "Jarak hanya mengubah cara kita bertemu, bukan alasan kita peduli.",
 "Tidak semua orang beruntung punya rekan kerja yang terasa seperti saudara. Kita pernah.",
 "Kita belajar dari contoh yang baik, dan belajar lebih banyak lagi dari contoh yang tidak.",
 "Hari ini kita berpisah meja. Besok kita saling mendoakan dari tempat masing-masing.",
 "Bukan soal seberapa lama kita bersama, tapi seberapa dalam kita saling percaya.",
 "Kita mungkin kecil di mata sebagian orang, tapi kita besar untuk satu sama lain.",
 "Yang kita bangun di sini bukan sekadar pekerjaan. Itu kepercayaan, dan kepercayaan tidak bisa dipindahtugaskan.",
 "Istirahat dulu. Bukan karena kalah, tapi supaya langkah berikutnya lebih mantap.",
 "Setiap orang yang pernah berjuang di sini meninggalkan jejak yang tidak akan hilang.",
 "Kita tidak memilih bagaimana ini berakhir, tapi kita memilih untuk tetap baik sampai akhir.",
 "Suatu hari nanti kita akan bilang, di sanalah kita belajar untuk tidak menyerah.",
 "Doa terbaik untuk yang sudah pamit lebih dulu, dan kekuatan untuk yang masih bertahan.",
 "Kita pernah saling menutupi kekurangan tanpa diminta. Itulah yang disebut tim.",
 "Perjalanan ini berhenti di sini, tapi cerita kita belum selesai.",
 "Yang membuat kita bertahan bukan gaji atau jabatan, tapi orang-orang di meja sebelah.",
 "Kita akan baik-baik saja. Kita sudah membuktikannya berkali-kali.",
 "Terima kasih sudah tetap tulus, bahkan saat keadaan memberi banyak alasan untuk menyerah.",
 "Yang tersisa dari semua ini bukan kecewa, tapi rasa syukur pernah dipertemukan.",
 "Saat nanti kita bertemu lagi, semoga kita sudah menjadi versi terbaik dari diri kita.",
 "Tidak ada yang sia-sia. Semua lelah ini sedang menyiapkan kita untuk sesuatu yang lebih besar.",
 "Kita pernah berempat, dan dalam hal yang paling penting, kita akan selalu berempat."
];
let bag=[];
const pick=()=>{if(!bag.length)bag=[...COMEBACK].sort(()=>Math.random()-.5);return bag.pop();};
document.querySelectorAll('.letter-body p').forEach((p,k)=>{
  p.tabIndex=0;p.setAttribute('role','button');p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.click()}});
  p.addEventListener('click',()=>{
    if(p.dataset.done){
      const sh=p.querySelector('.shine');if(!sh||p.dataset.busy)return;p.dataset.busy=1;
      sh.style.transition='opacity .35s,transform .35s';sh.style.opacity=0;sh.style.transform='translateY(-6px)';
      setTimeout(()=>{p.innerHTML=`<span class="shine">${pick()}</span>`;delete p.dataset.busy;},380);return;
    }
    p.dataset.done=1;
    const txt=p.textContent.trim();p.style.minHeight=p.offsetHeight+'px';
    let n=0;p.innerHTML=txt.split(' ').map(w=>'<span class="w">'+[...w].map(c=>`<span class="ch" style="--dx:${(Math.random()*80-20).toFixed(0)}px;--dy:${(-Math.random()*60-10).toFixed(0)}px;--rt:${(Math.random()*90-45).toFixed(0)}deg;transition-delay:${Math.min(n++*7,700)}ms">${c}</span>`).join('')+'</span>').join(' ');
    requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.add('dust')));
    setTimeout(()=>{p.classList.remove('dust');p.style.transition='min-height .8s cubic-bezier(.22,1,.36,1)';setTimeout(()=>p.style.minHeight='0px',1200);p.innerHTML=`<span class="shine">${pick()}</span>`;},Math.min(n*7,700)+950);
  });
});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('main .reveal:not(.hero .reveal)').forEach(el=>io.observe(el));

const hero=document.getElementById('heroInner');
/* music beat bar: glowing waveform, moves with the music, brighter up to the scroll position */
let scrollP=0;
(()=>{
  const c=document.getElementById('progress'),x=c.getContext('2d');let W,H,amp=0,beat=0,lastBeat=0;
  const BPM=100,dpr=Math.min(devicePixelRatio||1,2);
  const size=()=>{W=c.width=innerWidth*dpr;H=c.height=30*dpr};size();addEventListener('resize',size);
  const playing=()=>typeof bgm!=='undefined'&&bgm&&bgm.getPlayerState&&bgm.getPlayerState()===1;
  function frame(t){
    if(document.getElementById('popup-layer').classList.contains('hide')===false){requestAnimationFrame(frame);return}
    const on=playing();amp+=((on?1:.12)-amp)*.06;
    const period=60000/BPM;if(on&&t-lastBeat>period){lastBeat=t;beat=1}beat*=.9;
    x.clearRect(0,0,W,H);const gLit=x.createLinearGradient(0,0,W,0);gLit.addColorStop(0,'#2B57A6');gLit.addColorStop(.5,'#6E9BD8');gLit.addColorStop(1,'#E8B425');
    const mid=H/2,n=Math.floor(W/(4*dpr)),cut=scrollP*W;
    for(let i=0;i<n;i++){
      const px=i*4*dpr,u=i/n,s=t/1000;
      let v=Math.sin(u*18+s*2.1)*.35+Math.sin(u*47-s*3.3)*.25+Math.sin(u*7+s*1.2)*.4;
      v=Math.abs(v)*(.55+beat*.9*Math.exp(-Math.pow((u-.5)*3,2)))+(((i*9301+Math.floor(s*12)*49297)%233)/233)*.08*amp;
      const hh=Math.max(1,v*amp*(H*.46));
      const lit=px<=cut;
      x.fillStyle=lit?gLit:'rgba(169,182,198,.18)';
      x.fillRect(px,mid-hh,2*dpr,hh*2);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
let sTick=false;addEventListener('scroll',()=>{if(sTick)return;sTick=true;requestAnimationFrame(()=>{sTick=false;
  const y=scrollY,h=innerHeight,t=Math.min(y/h,1);
  if(y<h*1.2)hero.style.transform=`translate3d(0,${y*.35}px,0) scale(${1-t*.12})`;
  hero.style.opacity=1-t*1.2;
  scrollP=y/(document.body.scrollHeight-h);
});},{passive:true});

/* Background music: "Negoro Angin" by Muslih Fvnky (YouTube embed), loops forever */
const BGM_ID = 'IMg-w8g8Ekk';
let bgm, bgmReady = false, bgmWanted = false;
window.onYouTubeIframeAPIReady = () => {
  bgm = new YT.Player('bgm', {
    width: 1, height: 1, videoId: BGM_ID,
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: BGM_ID, playsinline: 1 },
    events: {
      onReady: () => { bgmReady = true; bgm.setVolume(70); try { const t0 = +localStorage.getItem('pcccBgmTime'); if (t0 && location.hash) { bgm.seekTo(t0, true); bgmWanted = true; } } catch (e) {} if (bgmWanted) bgm.playVideo(); },
      onStateChange: e => { if (e.data === YT.PlayerState.ENDED) { bgm.seekTo(0); bgm.playVideo(); } }
    }
  });
};
function startMusic() { bgmWanted = true; if (bgmReady) bgm.playVideo(); }
function toggleMusic() {
  if (!bgmReady) return startMusic();
  bgm.getPlayerState() === YT.PlayerState.PLAYING ? bgm.pauseVideo() : bgm.playVideo();
}
setInterval(()=>{try{if(bgmReady&&bgm.getPlayerState()===1)localStorage.setItem('pcccBgmTime',bgm.getCurrentTime())}catch(e){}},1000);
setInterval(()=>{const b=document.getElementById('musicBtn');if(!b)return;const on=bgmReady&&bgm.getPlayerState&&bgm.getPlayerState()===1;b.textContent=on?'❚❚ Jeda musik':'♪ Putar musik';b.style.borderColor=on?'#E8B425':'#333';},500);
const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);

/* open the reel on top of this page so the music keeps playing */
const reelLayer=document.getElementById('reelLayer'),reelFrame=document.getElementById('reelFrame');
function openReel(push=true){
  if(!reelFrame.src)reelFrame.src='reel.html?embedded=1';
  reelLayer.classList.add('open');reelLayer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  if(push)history.pushState({reel:1},'','#reel');
}
function closeReel(push=true){
  reelLayer.classList.remove('open');reelLayer.setAttribute('aria-hidden','true');document.body.style.overflow='';
  if(push&&location.hash==='#reel')history.back();
}
document.querySelector('.logo-link').addEventListener('click',e=>{e.preventDefault();startMusic();openReel();});
addEventListener('message',e=>{if(e.data==='pccc-close-reel')closeReel();});
addEventListener('popstate',()=>{location.hash==='#reel'?openReel(false):closeReel(false);});
addEventListener('keydown',e=>{if(e.key==='Escape'&&reelLayer.classList.contains('open'))closeReel();});
/* coming back from the standalone reel page: skip the popup */
if(location.hash==='#letter'){openFarewell();setTimeout(()=>document.getElementById('letter').scrollIntoView(),500);}
