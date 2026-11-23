import * as THREE from './assets/three.module.js';

const $ = (s) => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let stage = 0, transitioning = false, recipient = 'Berk', muted = true, audio;
try { recipient = localStorage.getItem('birthday-recipient-berk') || 'Berk'; } catch {}
const messages = ['Bazı iyi ki’lerin sebebi sensin.', 'En güzel tesadüf: seninle aynı zamana denk gelmek.', 'Yeni yaşın, en sevdiğin hikâyen olsun.', 'İçindeki o çocuğa bugün kocaman bir pasta borçlusun.', 'Daha çok kahkaha. Daha çok cesaret. Daha çok sen.'];
let messageIndex = 0;
const content = [
  { eyebrow:'BUGÜNÜN BAŞROLÜ BERK', headline:'Bugün<br><em>senin.</em>', description:'Berk, dünya biraz beklesin.<br>Senin için küçük bir evren hazırladık.', button:'Hediyeni aç', note:'MERAK ETMEK SERBEST.', hint:'KUTUYU ÇEVİR, MERAKINA YENİL.' },
  { eyebrow:'EVET, BÜTÜN BUNLAR SENİN İÇİN', headline:'İyi ki<br><em>doğdun.</em>', description:'Biraz fazla mutluluk, biraz tatlı delilik.<br>Yeni yaşına tam da bunlar yakışır.', button:'Bir dilek tut', note:'ÖNCE ŞU KIRMIZI DÜĞME…', hint:'SÜRÜKLE. KUTLA. BİRAZ YARAMAZLIK YAP.' },
  { eyebrow:'EVREN ŞU AN SENİ DİNLİYOR', headline:'Dile bir<br><em>güzellik.</em>', description:'Gözlerini bir an kapat. İçinden bir dilek tut.<br>Hazır olduğunda onu evrene gönder.', button:'Dileğimi gönder', note:'ARAMIZDA KALACAK.', hint:'BAZI ŞEYLER İNANINCA BAŞLAR.' },
  { eyebrow:'DİLEĞİN YOLA ÇIKTI', headline:'Hep iyi<br><em>ki ol.</em>', description:'İstediğin bütün güzel şeyler seni bulsun.<br>Bu dünya, sen varsın diye daha güzel.', button:'Bir daha kutlayalım', note:'İYİ Kİ, İYİ Kİ, İYİ Kİ.', hint:'BUGÜN DE HER GÜN DE: İYİ Kİ VARSIN.' }
];

function tone(freq=440, delay=0, length=.16, type='sine', vol=.07) {
  if (muted || !audio) return;
  const t=audio.currentTime+delay, osc=audio.createOscillator(), gain=audio.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,t);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(vol,t+.015);gain.gain.exponentialRampToValueAtTime(.001,t+length);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+length+.01);
}
function chime(){[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,i*.1,.6));}
$('#sound').addEventListener('click',async()=>{
  muted=!muted;const b=$('#sound');b.setAttribute('aria-pressed',String(!muted));b.setAttribute('aria-label',muted?'Sesi aç':'Sesi kapat');
  if(!muted){audio ||= new (window.AudioContext||window.webkitAudioContext)();await audio.resume();chime();}
});
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3600);}
function updateName(){ $('#tag-name').textContent=recipient ? `${recipient} için.` : 'Sadece sana.';$('#personalize').firstChild.textContent=recipient ? `${recipient} ` : 'İsmini ekle ';$('#recipient').value=recipient; }
updateName();
$('#personalize').addEventListener('click',()=>$('#name-dialog').showModal());
$('.dialog-close').addEventListener('click',()=>$('#name-dialog').close());
$('#name-dialog').addEventListener('click',e=>{if(e.target===$('#name-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#name-form').addEventListener('submit',e=>{e.preventDefault();recipient=$('#recipient').value.trim();if(!recipient){$('#recipient').focus();return;}try{localStorage.setItem('birthday-recipient-berk',recipient);}catch{}updateName();$('#name-dialog').close();chime();toast(`Bu evren bugün senin, ${recipient}.`);});
$('.wordmark').addEventListener('click',e=>{e.preventDefault();go(0);});
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.go))));
$('#primary').addEventListener('click',()=>{if(transitioning)return;if(stage===2){launchWish();}else if(stage===3){go(0);}else{go(stage+1);}});
$('#danger').addEventListener('click',()=>{burst(130);chime();partyUntil=performance.now()+2300;toast(recipient?`İYİ Kİ DOĞDUN, ${recipient.toLocaleUpperCase('tr')}!`:'İYİ Kİ DOĞDUN! Biraz delilik sana yakışıyor.');});
$('#another-message').addEventListener('click',()=>{messageIndex=(messageIndex+1)%messages.length;$('#wish-message').textContent=messages[messageIndex];tone(660,0,.2);});

function go(next){
  if(transitioning)return;stage=next;const c=content[stage];
  $('#experience').dataset.stage=stage;$('#eyebrow').textContent=c.eyebrow;$('#headline').innerHTML=c.headline;$('#description').innerHTML=c.description;$('#primary-label').textContent=c.button;$('#cta-note').textContent=c.note;$('#scene-hint').innerHTML=`<span class="hand-icon">↔</span> ${c.hint}`;
  $('#gift-tag').hidden=stage!==0;$('#floating-note').hidden=stage!==0;$('.orbit-label').hidden=stage!==0;$('#danger').hidden=stage!==1;$('#wish-card').hidden=stage!==1;$('#final-stamp').hidden=stage!==3;
  const copy=$('.copy');copy.classList.remove('changing');void copy.offsetWidth;copy.classList.add('changing');
  document.querySelectorAll('[data-go]').forEach(b=>{const active=Number(b.dataset.go)===Math.min(stage,2);b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('#scene').setAttribute('aria-label',['Havada dönen krom hediye kutusu','Mumları yanan pembe doğum günü pastası ve renkli gezegenler','Işık küresi ve turuncu kollu dilek makinesi','Evrene yükselen bir dilek ve renkli kutlama'][stage]);
  if(stage===1){burst(85);chime();}else if(stage===2)tone(440,0,.5);
}
async function launchWish(){
  transitioning=true;$('#primary').disabled=true;$('#primary-label').textContent='Evrene gönderiliyor…';wishStart=performance.now();chime();
  await new Promise(r=>setTimeout(r,reduced?150:1900));transitioning=false;$('#primary').disabled=false;go(3);burst(160);chime();
}

// Lightweight canvas confetti. Particles stop rendering once they have settled.
const fx=$('#confetti'),ctx=fx.getContext('2d');let particles=[],fxRunning=false;
function resizeFx(){fx.width=innerWidth*devicePixelRatio;fx.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}resizeFx();addEventListener('resize',resizeFx);
function burst(count=90){if(reduced)count=Math.min(count,18);for(let i=0;i<count;i++){particles.push({x:innerWidth*(.35+Math.random()*.4),y:innerHeight*.45,vx:(Math.random()-.5)*18,vy:-6-Math.random()*15,w:4+Math.random()*7,h:3+Math.random()*7,a:Math.random()*6,v:Math.random()*.2-.1,color:['#ff793e','#fff9ec','#b8ccff','#f8ca65','#e997df'][i%5],life:0});}if(!fxRunning){fxRunning=true;requestAnimationFrame(drawFx);}}
function drawFx(){ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.y<innerHeight+30&&p.life<240);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.19;p.vx*=.992;p.a+=p.v;p.life++;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});if(particles.length)requestAnimationFrame(drawFx);else{fxRunning=false;ctx.clearRect(0,0,innerWidth,innerHeight);}}

let partyUntil=0,wishStart=0;
try { init3D(); } catch(e) {
  console.warn('3D preview unavailable; using the illustrated gift.',e.message);
  const fallback=document.createElement('div');fallback.className='fallback-art';$('#scene').append(fallback);$('#scene-hint').textContent='BİR KUTU DOLUSU İYİ Kİ.';
}

function init3D(){
  const container=$('#scene'),scene=new THREE.Scene();
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.appendChild(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,12);
  // Painted studio softboxes give the chrome its broad, clear reflections.
  const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;const ec=envCanvas.getContext('2d');
  ec.fillStyle='#b7c7e7';ec.fillRect(0,0,1024,512);ec.fillStyle='#121b39';ec.fillRect(0,260,1024,252);ec.fillStyle='#f8fcff';ec.fillRect(40,25,160,240);ec.fillRect(400,0,290,200);ec.fillRect(850,50,110,330);ec.fillStyle='#4d73ed';ec.fillRect(240,150,90,350);ec.fillStyle='#fff4df';ec.fillRect(700,150,70,170);
  const envTexture=new THREE.CanvasTexture(envCanvas);envTexture.mapping=THREE.EquirectangularReflectionMapping;envTexture.colorSpace=THREE.SRGBColorSpace;const pmrem=new THREE.PMREMGenerator(renderer);const envTarget=pmrem.fromEquirectangular(envTexture);scene.environment=envTarget.texture;envTexture.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf2f3ff,0x1420a0,3));const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,6,7);scene.add(key);const rim=new THREE.DirectionalLight(0x98b5ff,4);rim.position.set(4,2,-3);scene.add(rim);const warm=new THREE.PointLight(0xff934f,12,20);warm.position.set(4,-1,4);scene.add(warm);
  const chrome=new THREE.MeshPhysicalMaterial({color:0xe2e8f3,metalness:1,roughness:.18,envMapIntensity:1.35,clearcoat:1});
  const orange=new THREE.MeshPhysicalMaterial({color:0xff6b25,metalness:.18,roughness:.22,clearcoat:1});
  const pink=new THREE.MeshPhysicalMaterial({color:0xf0b3d9,roughness:.28,metalness:.04,clearcoat:.8});
  const cream=new THREE.MeshPhysicalMaterial({color:0xffedce,roughness:.3});
  const blue=new THREE.MeshPhysicalMaterial({color:0x1323a0,metalness:.45,roughness:.22,clearcoat:1});
  const yellow=new THREE.MeshPhysicalMaterial({color:0xffc54d,metalness:.15,roughness:.22});
  const root=new THREE.Group();scene.add(root);
  function mesh(geo,mat,parent=root,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
  function roundedBox(w,h,d,r=.08){const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:r,bevelThickness:r,curveSegments:12});g.translate(0,0,-(d-2*r)/2);return g;}
  const gift=new THREE.Group();root.add(gift);gift.rotation.set(.19,-.46,-.13);
  mesh(roundedBox(2.45,2.25,2.1,.12),chrome,gift,0,-.15,0);
  mesh(roundedBox(.37,2.3,2.14,.025),orange,gift,0,-.15,.015);
  mesh(roundedBox(2.5,.38,2.16,.025),orange,gift,0,-.15,.015);
  const lid=new THREE.Group();gift.add(lid);lid.position.y=1.08;
  mesh(roundedBox(2.65,.36,2.3,.07),chrome,lid);
  mesh(roundedBox(.4,.4,2.34,.025),orange,lid,0,0,.01);
  mesh(roundedBox(2.68,.4,.39,.025),orange,lid);
  function bowLoop(sign){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.23,0),new THREE.Vector3(sign*.65,.87,.02),new THREE.Vector3(sign*.98,.62,.03),new THREE.Vector3(sign*.58,.27,.05),new THREE.Vector3(.02,.23,.1)]);return mesh(new THREE.TubeGeometry(curve,64,.095,12,false),orange,lid);}
  bowLoop(-1);bowLoop(1);mesh(new THREE.SphereGeometry(.18,24,16),orange,lid,0,.27,.07);
  const tail=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.22,.05),new THREE.Vector3(.4,.12,.6),new THREE.Vector3(.8,-.15,1.1),new THREE.Vector3(.92,-.6,1.23)]);mesh(new THREE.TubeGeometry(tail,32,.075,10,false),orange,lid);

  // A shiny inflated star, orbit ring, and tactile candy shapes.
  const decor=new THREE.Group();root.add(decor);
  function starGeometry(){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?.28:.62;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)s.moveTo(x,y);else s.lineTo(x,y);}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:true,bevelSize:.13,bevelThickness:.14,bevelSegments:5,steps:1});g.center();return g;}
  const star=mesh(starGeometry(),orange,decor,-2,1.5,.4);star.rotation.set(.2,-.3,.25);
  const silverStar=mesh(starGeometry(),chrome,decor,2,-1.2,.5);silverStar.scale.setScalar(.55);silverStar.rotation.z=-.3;
  const ring=mesh(new THREE.TorusGeometry(.55,.14,16,72),orange,decor,1.9,1.7,-.4);ring.rotation.set(.8,.4,-.5);
  const sphere=mesh(new THREE.SphereGeometry(.23,32,24),chrome,decor,-1.8,-1.5,.7);
  const candy=mesh(new THREE.CapsuleGeometry(.14,.5,8,16),pink,decor,1.6,-1.7,-.2);candy.rotation.z=.8;
  const little=mesh(new THREE.IcosahedronGeometry(.2,0),yellow,decor,-1.4,2.5,-.8);
  const halo=mesh(new THREE.TorusGeometry(2.23,.009,8,140),new THREE.MeshBasicMaterial({color:0x7f98ff,transparent:true,opacity:.36}),decor);halo.rotation.set(.3,.5,-.5);

  // The second scene is built as a real little birthday sculpture.
  const cake=new THREE.Group();root.add(cake);cake.scale.setScalar(.001);
  mesh(new THREE.CylinderGeometry(1.65,1.65,.09,72),chrome,cake,0,-1.25,0);
  mesh(new THREE.CylinderGeometry(1.35,1.35,.85,72),pink,cake,0,-.78,0);
  mesh(new THREE.CylinderGeometry(1.04,1.04,.75,72),cream,cake,0,.01,0);
  mesh(new THREE.TorusGeometry(1.31,.08,12,72),cream,cake,0,-.35,0).rotation.x=Math.PI/2;
  mesh(new THREE.TorusGeometry(1.01,.085,12,72),pink,cake,0,.4,0).rotation.x=Math.PI/2;
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18;mesh(new THREE.SphereGeometry(.105,12,10),cream,cake,Math.cos(a)*1.31,-.42,Math.sin(a)*1.31);}
  const flames=[];
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a)*.64,z=Math.sin(a)*.64;mesh(new THREE.CylinderGeometry(.055,.055,.63,16),i%2?orange:blue,cake,x,.72,z);const f=mesh(new THREE.SphereGeometry(.085,16,12),new THREE.MeshBasicMaterial({color:0xffcb65}),cake,x,1.12,z);f.scale.y=1.85;flames.push(f);}
  const cakeStar=mesh(starGeometry(),orange,cake,0,1.85,-.4);cakeStar.scale.setScalar(.65);

  // A retro wish machine with a glass dome and a mechanical lever.
  const machine=new THREE.Group();root.add(machine);machine.scale.setScalar(.001);
  mesh(roundedBox(2.2,.8,1.65,.12),chrome,machine,0,-1.05,0);
  mesh(roundedBox(1.9,.55,.035,.04),blue,machine,0,-1.04,.86);
  for(let i=0;i<3;i++)mesh(new THREE.SphereGeometry(.065,12,12),i===0?orange:cream,machine,-.58+i*.23,-1.04,.9);
  mesh(new THREE.CylinderGeometry(1.02,1.1,.17,64),orange,machine,0,-.56,0);
  const glass=new THREE.MeshPhysicalMaterial({color:0xc8dbff,metalness:.05,roughness:.1,transparent:true,opacity:.19,side:THREE.DoubleSide,depthWrite:false});
  mesh(new THREE.SphereGeometry(.99,48,32,0,Math.PI*2,0,Math.PI/2),glass,machine,0,-.47,0);
  const orb=mesh(new THREE.SphereGeometry(.36,32,24),new THREE.MeshPhysicalMaterial({color:0xffb26b,emissive:0xff6b24,emissiveIntensity:.55,roughness:.12,metalness:.2}),machine,0,.02,0);
  const orbRing=mesh(new THREE.TorusGeometry(.56,.025,12,64),chrome,machine,0,.03,0);orbRing.rotation.x=.7;
  const lever=new THREE.Group();machine.add(lever);lever.position.set(1.15,-1,0);
  mesh(new THREE.CylinderGeometry(.055,.055,.9,16),chrome,lever,.17,.35,0).rotation.z=-.4;
  mesh(new THREE.SphereGeometry(.22,24,20),orange,lever,.36,.8,0);
  const wishLight=new THREE.PointLight(0xffa66b,3,4);machine.add(wishLight);

  let mobile=false,pointerX=0,pointerY=0,dragging=false,lastX=0,dragRotation=0,dragDistance=0;
  function resize(){const w=container.clientWidth,h=container.clientHeight;mobile=w<=700;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=mobile?13:12;camera.updateProjectionMatrix();root.position.set(mobile?0:2.1,mobile?-.95:0,0);root.scale.setScalar(mobile?.9:1.1);}
  resize();addEventListener('resize',resize);
  container.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;dragDistance=0;});
  addEventListener('pointerup',()=>{dragging=false;});
  container.addEventListener('pointermove',e=>{const r=container.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;if(dragging){const delta=e.clientX-lastX;dragRotation+=delta*.009;dragDistance+=Math.abs(delta);lastX=e.clientX;}});
  container.addEventListener('pointercancel',()=>dragging=false);
  const raycaster=new THREE.Raycaster();
  container.addEventListener('click',e=>{if(dragDistance>8||transitioning)return;const r=container.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const target=stage===0?gift:stage===2?machine:null;if(target&&raycaster.intersectObject(target,true).length){if(stage===0)go(1);else launchWish();}});
  const clock=new THREE.Clock();let previous=0;
  function animate(now){requestAnimationFrame(animate);if(document.hidden)return;const delta=Math.min((now-previous)/1000,.05)||.016;previous=now;const t=clock.getElapsedTime(),smooth=1-Math.pow(.001,delta);
    const targets=[stage===0?1:0,stage===1?1:0,stage>=2?1:0];[gift,cake,machine].forEach((g,i)=>{const s=THREE.MathUtils.lerp(g.scale.x,Math.max(.001,targets[i]),smooth*.65);g.scale.setScalar(s);g.visible=s>.005;});
    const float=reduced?0:Math.sin(t*.85)*.11;
    gift.position.y=float;gift.rotation.y=THREE.MathUtils.lerp(gift.rotation.y,-.46+dragRotation+pointerX*.13,smooth*.35);gift.rotation.x=THREE.MathUtils.lerp(gift.rotation.x,.19+pointerY*.1,smooth*.35);
    lid.position.y=THREE.MathUtils.lerp(lid.position.y,stage===0?1.08:3.3,smooth*.3);lid.rotation.z=THREE.MathUtils.lerp(lid.rotation.z,stage===0?0:-.3,smooth*.3);
    cake.position.y=float-.1;cake.rotation.y=reduced?dragRotation:t*.15+dragRotation;cake.rotation.z=reduced?0:Math.sin(t*.5)*.04;
    machine.position.y=float;machine.rotation.y=THREE.MathUtils.lerp(machine.rotation.y,-.28+dragRotation*.3,smooth*.3);
    const launch=wishStart?(now-wishStart)/1800:0;orb.position.y=launch>0?Math.min(launch*launch*7,12):.04+Math.sin(t*2)*.08;orb.scale.setScalar(launch>1?.001:1);orbRing.rotation.z=t*.4;lever.rotation.z=launch>0&&launch<1?-Math.sin(launch*Math.PI)*.7:0;
    if(stage<2&&wishStart){wishStart=0;orb.scale.setScalar(1);orb.position.y=.04;}
    flames.forEach((f,i)=>{f.scale.y=1.8+(reduced?0:Math.sin(t*8+i)*.25);});
    star.rotation.y=reduced?0:Math.sin(t*.4)*.35;star.position.y=1.6+(reduced?0:Math.sin(t*.7)*.18);ring.rotation.z=reduced?-.5:t*.15;silverStar.rotation.z=reduced?-.3:Math.sin(t*.5)*.3;sphere.position.y=-1.5+float;little.rotation.y=t*.3;
    if(now<partyUntil&&!reduced){decor.rotation.z=Math.sin((partyUntil-now)*.004)*.12;cake.rotation.z=Math.sin(now*.008)*.15;}else{decor.rotation.z=THREE.MathUtils.lerp(decor.rotation.z,0,.06);}
    halo.rotation.z=reduced?-.5:t*.035;
    renderer.render(scene,camera);
  }
  requestAnimationFrame(animate);
  addEventListener('pagehide',()=>renderer.dispose(),{once:true});
}
