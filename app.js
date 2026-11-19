const $=id=>document.getElementById(id);
const authDialog=$('authDialog');
authDialog.addEventListener('cancel',event=>event.preventDefault());
authDialog.showModal();
const points=[];
function ellipsoid(cx,cy,cz,rx,ry,rz,color){for(let p=0;p<=Math.PI;p+=0.075)for(let t=0;t<Math.PI*2;t+=0.075){const nx=Math.sin(p)*Math.cos(t),ny=Math.cos(p),nz=Math.sin(p)*Math.sin(t);points.push([cx+rx*nx,cy+ry*ny,cz+rz*nz,nx,ny,nz,color]);}}
function box(cx,cy,cz,wx,wy,wz,color){const sizes=[wx,wy,wz],c=[cx,cy,cz];for(let axis=0;axis<3;axis++)for(const side of [-1,1])for(let a=-1;a<=1.001;a+=.075)for(let b=-1;b<=1.001;b+=.075){let p=[...c],n=[0,0,0];n[axis]=side;p[axis]+=side*sizes[axis];p[(axis+1)%3]+=a*sizes[(axis+1)%3];p[(axis+2)%3]+=b*sizes[(axis+2)%3];points.push([...p,...n,color]);}}
// A stationary hero built from sampled surfaces; only the viewing angle changes.
ellipsoid(0,1.51,0,.69,.65,.42,0);ellipsoid(-.48,2.06,0,.18,.35,.22,0);ellipsoid(.48,2.06,0,.18,.35,.22,0);
ellipsoid(0,1.48,.385,.53,.38,.105,1);ellipsoid(-.2,1.53,.485,.033,.045,.025,4);ellipsoid(.2,1.53,.485,.033,.045,.025,4);
for(let x=-.13;x<=.13;x+=.015)ellipsoid(x,1.35-.055*(1-(x/.13)**2),.486,.018,.015,.014,4);
box(0,.45,0,.53,.53,.29,2);ellipsoid(-.63,.66,0,.18,.27,.24,2);ellipsoid(.63,.66,0,.18,.27,.24,2);
ellipsoid(-.72,.12,0,.105,.46,.105,1);ellipsoid(.89,.16,.04,.27,.12,.12,1);ellipsoid(-.72,-.29,0,.13,.14,.12,1);ellipsoid(1.16,.16,.07,.14,.15,.14,1);
box(-.27,-.3,0,.25,.25,.29,3);box(.27,-.3,0,.25,.25,.29,3);ellipsoid(-.28,-.95,0,.105,.46,.1,1);ellipsoid(.28,-.95,0,.105,.46,.1,1);
box(-.28,-1.36,0,.11,.11,.12,0);box(.28,-1.36,0,.11,.11,.12,0);ellipsoid(-.28,-1.59,.09,.17,.19,.27,4);ellipsoid(.28,-1.59,.09,.17,.19,.27,4);
ellipsoid(0,.55,-.4,.49,.61,.27,5);ellipsoid(0,.84,-.46,.48,.29,.25,6);
// Tattoo-inspired sword: tapered blade, ring guard, wrapped grip and smile pommel.
// All surfaces share Finn's rotation and depth buffer, including the sparkles.
function stroke(ax,ay,az,bx,by,bz,color,glyph){
  const steps=Math.max(2,Math.ceil(Math.hypot(bx-ax,by-ay,bz-az)*95));
  for(let i=0;i<=steps;i++){const t=i/steps;points.push([ax+(bx-ax)*t,ay+(by-ay)*t,az+(bz-az)*t,0,0,1,color,glyph]);}
}
function ring(cx,cy,cz,r,color){
  for(let a=0;a<Math.PI*2;a+=.025){
    for(const dz of [-.025,0,.025])points.push([cx+r*Math.cos(a),cy+r*Math.sin(a),cz+dz,Math.cos(a),Math.sin(a),1,color]);
  }
}
const swordX=1.16,swordZ=.1;
box(swordX,.12,swordZ,.065,.26,.065,7);
for(let y=-.1;y<.35;y+=.075)stroke(swordX-.067,y,swordZ+.069,swordX+.067,y+.06,swordZ+.069,8,'/');
ellipsoid(swordX,-.22,swordZ,.13,.13,.085,7);
stroke(swordX-.045,-.2,swordZ+.09,swordX-.045,-.2,swordZ+.09,4,'.');
stroke(swordX+.045,-.2,swordZ+.09,swordX+.045,-.2,swordZ+.09,4,'.');
for(let a=Math.PI;a<Math.PI*2;a+=.08)points.push([swordX+.065*Math.cos(a),-.225+.045*Math.sin(a),swordZ+.09,0,0,1,4,'.']);
box(swordX,.43,swordZ,.39,.035,.075,7);
ellipsoid(swordX-.4,.43,swordZ,.065,.065,.085,7);
ellipsoid(swordX+.4,.43,swordZ,.065,.065,.085,7);
ring(swordX,.43,swordZ+.1,.18,7);
ring(swordX,.43,swordZ+.1,.225,8);
// Diamond cross-section creates a bright central ridge as the sword turns.
for(let y=.49;y<=2.45;y+=.014){
  const width=.105*Math.min(1,(2.45-y)/.4);
  for(let t=-1;t<=1;t+=.1){
    const depth=.055*(1-Math.abs(t));
    points.push([swordX+t*width,y,swordZ+depth,t*.5,.1,1,7]);
    points.push([swordX+t*width,y,swordZ-depth,t*.5,.1,-1,8]);
  }
}
stroke(swordX,.65,swordZ+.06,swordX,2.45,swordZ+.005,9,'|');
function sparkle(x,y,z,r){
  stroke(x-r,y,z,x+r,y,z,9,'-');
  stroke(x,y-r*1.6,z,x,y+r*1.6,z,9,'|');
  const corners=[[0,r], [r*.6,0], [0,-r], [-r*.6,0], [0,r]];
  for(let i=0;i<4;i++)stroke(x+corners[i][0],y+corners[i][1],z+.01,x+corners[i+1][0],y+corners[i+1][1],z+.01,9,i%2?'\\':'/');
  points.push([x,y,z+.03,0,0,1,9,'+']);
}
sparkle(1.65,1.64,.12,.19);
sparkle(.86,2.42,.12,.09);
sparkle(1.72,.91,-.02,.09);
sparkle(.83,-.47,.24,.11);
// Put a visible gripping hand in front of the wrapped handle.
ellipsoid(swordX,.16,swordZ+.06,.14,.13,.115,1);
const colors=['#dbeed4','#edcc91','#7acbd4','#5595c1','#5a7464','#6eae59','#b9ed83','#efd48a','#b19b61','#fff0b8'];
let active=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,rotation=0,last=0,drag=false,lastX=0;
function render(){const W=76,H=42,buffer=Array(W*H).fill(null),co=Math.cos(rotation),si=Math.sin(rotation);for(const p of points){const [x,y,z,nx,ny,nz,col]=p,xx=x*co+z*si,zz=z*co-x*si,normal=nx*si+nz*co;const sx=Math.round(W/2+xx*17),sy=Math.round(22-y*8);if(sx<0||sx>=W||sy<0||sy>=H)continue;const index=sy*W+sx;if(!buffer[index]||zz>buffer[index].z){const brightness=Math.max(0,normal*.65+ny*.25+.3);const chars=col===4?'@#':'.,:;=+*#%@';buffer[index]={z:zz,c:p[7]??chars[Math.min(chars.length-1,Math.floor(brightness*chars.length))],col};}}let html='';for(let y=0;y<H;y++){let prev=-1;for(let x=0;x<W;x++){const p=buffer[y*W+x],c=p?p.col:-1;if(c!==prev){if(prev!==-1)html+='</span>';if(c!==-1)html+='<span style="color:'+colors[c]+'">';prev=c;}html+=p?p.c:' ';}if(prev!==-1)html+='</span>';html+='\n';}$('ascii').innerHTML=html;$('angle').textContent=String(Math.floor((rotation*180/Math.PI%360+360)%360)).padStart(3,'0')+'° / 360°';}
function tick(time){if(active&&!paused&&!drag)rotation+=(Math.min(time-last,60)/1000)*Number($('speed').value);if(active)render();last=time;requestAnimationFrame(tick);}requestAnimationFrame(tick);
function updatePause(){$('pause').textContent=paused?'PLAY':'PAUSE';$('pause').setAttribute('aria-pressed',String(paused));}
$('login').addEventListener('submit',e=>{e.preventDefault();if($('password').value!=='4MySilly'){$('feedback').textContent='Access denied. Try again, adventurer.';$('feedback').className='error';$('password').setAttribute('aria-invalid','true');$('password').select();return;}active=true;rotation=0;authDialog.close();$('viewer').hidden=false;$('access').textContent='GRANTED';$('access').style.color='var(--green)';$('bootAuth').innerHTML='<span>OK</span> Authentication complete';$('stageLabel').textContent='HERO SIMULATION';$('stageState').textContent='[ LIVE ]';$('bottomStatus').textContent='360° CHARACTER VIEW';$('command').textContent='./render finn --rotate 360';$('password').value='';updatePause();render();$('pause').focus();});
$('pause').onclick=()=>{paused=!paused;updatePause();};$('reset').onclick=()=>{rotation=0;paused=true;updatePause();render();};$('lock').onclick=()=>{active=false;$('viewer').hidden=true;authDialog.showModal();$('access').textContent='LOCKED';$('access').style.color='';$('stageLabel').textContent='AUTHENTICATION REQUIRED';$('stageState').textContent='[ LOCKED ]';$('bottomStatus').textContent='ENCRYPTED CONNECTION';$('command').textContent='awaiting_auth';$('feedback').textContent='Session locked. Enter password to continue.';$('feedback').className='';$('bootAuth').innerHTML='<span class="muted">--</span> Authentication pending';$('password').removeAttribute('aria-invalid');$('password').focus();};
const area=document.querySelector('.render-area');area.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;area.setPointerCapture(e.pointerId);});area.addEventListener('pointermove',e=>{if(drag){rotation+=(e.clientX-lastX)*.018;lastX=e.clientX;render();}});area.addEventListener('pointerup',()=>drag=false);area.addEventListener('pointercancel',()=>drag=false);document.addEventListener('keydown',e=>{if(active&&e.code==='Space'&&!['BUTTON','INPUT'].includes(document.activeElement.tagName)){e.preventDefault();paused=!paused;updatePause();}});
