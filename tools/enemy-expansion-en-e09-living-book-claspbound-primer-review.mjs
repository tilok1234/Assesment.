import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { EN_E08_CROWNMAW_GREATBLADE_REGISTRY } from '../engine/enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import { EN_E08_WHISPERVEIL_VISAGE_REGISTRY } from '../engine/enemy-expansion-en-e08-possessed-mask-whisperveil-visage.js';
import { EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY } from '../engine/enemy-expansion-en-e09-clockwork-automaton-epochforge-colossus.js';
import { EN_E09_CLASPBOUND_PRIMER_DATA, EN_E09_CLASPBOUND_PRIMER_GATE, EN_E09_CLASPBOUND_PRIMER_REGISTRY } from '../engine/enemy-expansion-en-e09-living-book-claspbound-primer.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame, encodeRgbaPng, hexToRgba } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e09-living-book-claspbound-primer');
const animationOutput = path.join(output, 'animation-frames');
const FONT = Object.freeze({
  ' ': [0,0,0,0,0,0,0], '+': [0,4,4,31,4,4,0], '-': [0,0,0,31,0,0,0], '/': [1,2,2,4,8,8,16],
  '0':[14,17,19,21,25,17,14], '1':[4,12,4,4,4,4,14], '2':[14,17,1,2,4,8,31], '3':[30,1,1,14,1,1,30], '4':[2,6,10,18,31,2,2], '5':[31,16,16,30,1,1,30], '6':[14,16,16,30,17,17,14], '7':[31,1,2,4,8,8,8], '8':[14,17,17,14,17,17,14], '9':[14,17,17,15,1,1,14],
  A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30], C:[15,16,16,16,16,16,15], D:[30,17,17,17,17,17,30], E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16], G:[15,16,16,19,17,17,15], H:[17,17,17,31,17,17,17], I:[31,4,4,4,4,4,31], J:[7,2,2,2,18,18,12], K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31], M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17], O:[14,17,17,17,17,17,14], P:[30,17,17,30,16,16,16], Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17], S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4], U:[17,17,17,17,17,17,14], V:[17,17,17,17,17,10,4], W:[17,17,17,17,21,27,17], X:[17,17,10,4,10,17,17], Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31],
});
const COLORS = Object.freeze({ background: '#0b0f16', panel: '#141a24', panelAlt: '#111721', border: '#344052', title: '#d8bd72', candidate: '#79c7b2', preceding: '#a9b86f', text: '#edf5ff', muted: '#9aa8b8', checkerA: '#202a37', checkerB: '#293646' });

class Canvas {
  constructor(width, height) { this.width = width; this.height = height; this.rgba = Buffer.alloc(width * height * 4); }
  fillRect(x, y, width, height, fill) {
    if (![x,y,width,height].every(Number.isInteger) || x < 0 || y < 0 || x + width > this.width || y + height > this.height) throw new TypeError('Review rectangle is outside the canvas.');
    const [r,g,b,a] = hexToRgba(fill);
    for (let py=y; py<y+height; py++) for (let px=x; px<x+width; px++) { const o=((py*this.width)+px)*4; this.rgba[o]=r; this.rgba[o+1]=g; this.rgba[o+2]=b; this.rgba[o+3]=a; }
  }
  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }
  text(value, x, y, scale, fill) {
    let cursor=x;
    for (const character of value.toUpperCase()) {
      const rows=FONT[character]; if (!rows) throw new TypeError('Missing font glyph ' + character);
      for (let row=0; row<7; row++) for (let col=0; col<5; col++) if (rows[row] & (1 << (4-col))) this.fillRect(cursor+(col*scale),y+(row*scale),scale,scale,fill);
      cursor += 6*scale;
    }
  }
  centered(value, centerX, y, scale, fill) { this.text(value, Math.round(centerX-(this.textWidth(value,scale)/2)), y, scale, fill); }
  pixels(pixels, x, y, scale, border=true) {
    const size=ENEMY_EXPANSION_PROFILE.frameContract.cell;
    if (border) this.fillRect(x-2,y-2,(size*scale)+4,(size*scale)+4,COLORS.border);
    for (let py=0;py<size;py++) for (let px=0;px<size;px++) this.fillRect(x+(px*scale),y+(py*scale),scale,scale,pixels[(py*size)+px] || ((px+py)%2===0?COLORS.checkerA:COLORS.checkerB));
  }
}

const directions=['down','left','right','up'];
const animations=[
  {id:'idle',label:'IDLE',prefix:'F',frames:2,sequence:[0,1,0,1]},
  {id:'walk',label:'WALK',prefix:'W',frames:4,sequence:[0,1,2,3]},
  {id:'attack',label:'ATTACK',prefix:'A',frames:4,sequence:[0,1,2,3]},
  {id:'cast',label:'CAST',prefix:'C',frames:4,sequence:[0,1,2,3]},
  {id:'hurt',label:'HURT',prefix:'H',frames:2,sequence:[0,1,0,1]},
  {id:'death',label:'DEATH',prefix:'D',frames:4,sequence:[0,1,2,3]},
];
const specs={
  candidate:{kind:'enemy',family:'living-book',variant:'claspbound-primer'},
  epochforge:{kind:'enemy',family:'clockwork-automaton',variant:'epochforge-colossus'},
  whisperveil:{kind:'enemy',family:'possessed-mask',variant:'whisperveil-visage'},
  crownmaw:{kind:'enemy',family:'living-weapon',variant:'crownmaw-greatblade'},
};
const registries={candidate:EN_E09_CLASPBOUND_PRIMER_REGISTRY,epochforge:EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY,whisperveil:EN_E08_WHISPERVEIL_VISAGE_REGISTRY,crownmaw:EN_E08_CROWNMAW_GREATBLADE_REGISTRY};
const captures=Object.fromEntries(Object.keys(specs).map((name)=>[name,new Map()]));
const records=Object.fromEntries(Object.keys(specs).map((name)=>[name,[]]));
const key=(animation,direction,frame)=>`${animation}/${direction}/${frame}`;
const record=(captured,spec,direction,animation,frame)=>({family:spec.family,variant:spec.variant,candidateFamily:spec.family,direction,animation,frame,digest:captured.digest,alphaDigest:captured.alphaDigest,opaquePixels:captured.opaquePixels,bounds:captured.bounds});
for (const animation of animations) for (const direction of directions) for (let frame=0;frame<animation.frames;frame++) {
  for (const name of Object.keys(specs)) {
    const captured=captureEnemyExpansionFrame(registries[name],specs[name],direction,animation.id,frame);
    captures[name].set(key(animation.id,direction,frame),captured);
    records[name].push(record(captured,specs[name],direction,animation.id,frame));
  }
}
function candidatePixels(animation,direction,frame,assembled) {
  const pixels=captures.candidate.get(key(animation,direction,frame)).pixels;
  return assembled ? buildEnemyExpansionCandidatePresentation(pixels,EN_E09_CLASPBOUND_PRIMER_DATA).formComplete : pixels;
}

function board(title,subtitle,assembled) {
  const margin=16,labelWidth=130,scale=3,frameSize=72,frameGap=6,groupWidth=306,directionGap=14,header=96,rowHeight=108;
  const width=(margin*2)+labelWidth+(groupWidth*4)+(directionGap*3),height=header+(rowHeight*6)+margin;
  const c=new Canvas(width,height),groupX=(i)=>margin+labelWidth+(i*(groupWidth+directionGap));
  c.fillRect(0,0,width,height,COLORS.background);c.fillRect(0,0,width,header-8,COLORS.panel);c.text(title,margin,14,3,COLORS.title);c.text(subtitle,margin,50,1,COLORS.muted);
  for(let i=0;i<4;i++)c.centered(directions[i],groupX(i)+(groupWidth/2),72,2,COLORS.candidate);
  for(let row=0;row<animations.length;row++){
    const a=animations[row],top=header+(row*rowHeight);c.fillRect(margin,top+4,width-(margin*2),rowHeight-8,row%2===0?COLORS.panel:COLORS.panelAlt);c.fillRect(margin,top+4,5,rowHeight-8,COLORS.candidate);c.text(a.label,margin+18,top+30,2,COLORS.text);c.text(a.frames+' FRAMES',margin+18,top+62,1,COLORS.candidate);
    for(let di=0;di<4;di++){const actual=(frameSize*a.frames)+(frameGap*(a.frames-1)),start=Math.round(groupX(di)+((groupWidth-actual)/2));for(let f=0;f<a.frames;f++){const x=start+(f*(frameSize+frameGap));c.pixels(candidatePixels(a.id,directions[di],f,assembled),x,top+13,scale);c.centered(a.prefix+(f+1),x+36,top+91,1,COLORS.muted);}}
  }
  return {png:encodeRgbaPng(width,height,c.rgba),width,height};
}

function comparisonBoard(){
  const samples=[{animation:'idle',frame:0,label:'IDLE F1'},{animation:'walk',frame:2,label:'WALK W3'},{animation:'attack',frame:1,label:'ATTACK A2'},{animation:'hurt',frame:1,label:'HURT H2'}];
  const width=1520,height=548,header=96,labelWidth=120,groupWidth=350,rowHeight=108,c=new Canvas(width,height);
  c.fillRect(0,0,width,height,COLORS.background);c.fillRect(0,0,width,header-8,COLORS.panel);c.text('EN-E09 LIVING BOOK CLASPBOUND PRIMER',16,14,3,COLORS.title);c.text('EPOCHFORGE WHISPERVEIL CROWNMAW VS PRIMER',16,50,1,COLORS.muted);
  for(let i=0;i<4;i++)c.centered(directions[i],labelWidth+(i*groupWidth)+(groupWidth/2),72,2,COLORS.candidate);
  for(let row=0;row<samples.length;row++){const s=samples[row],top=header+(row*rowHeight);c.fillRect(16,top+4,width-32,rowHeight-8,row%2===0?COLORS.panel:COLORS.panelAlt);c.text(s.label,28,top+30,1,COLORS.text);
    for(let i=0;i<4;i++){const x=labelWidth+(i*groupWidth),k=key(s.animation,directions[i],s.frame);c.pixels(captures.epochforge.get(k).pixels,x+4,top+12,3);c.pixels(captures.whisperveil.get(k).pixels,x+90,top+12,3);c.pixels(captures.crownmaw.get(k).pixels,x+176,top+12,3);c.pixels(captures.candidate.get(k).pixels,x+262,top+12,3);c.centered('EPOCHFORGE',x+40,top+90,1,COLORS.preceding);c.centered('WHISPERVEIL',x+126,top+90,1,COLORS.preceding);c.centered('CROWNMAW',x+212,top+90,1,COLORS.preceding);c.centered('PRIMER',x+298,top+90,1,COLORS.candidate);}}
  return {png:encodeRgbaPng(width,height,c.rgba),width,height};
}

function animationFrame(phase,assembled){
  const width=640,height=672,header=48,labelWidth=112,cellWidth=128,rowHeight=104,c=new Canvas(width,height);
  c.fillRect(0,0,width,height,COLORS.background);c.fillRect(0,0,width,header,COLORS.panel);c.text('CLASPBOUND PRIMER '+(assembled?'COMPLETE B + FORM':'RAW'),12,6,2,COLORS.title);c.text('PHASE '+(phase+1),12,30,1,COLORS.candidate);
  for(let i=0;i<4;i++)c.centered(directions[i],labelWidth+(i*cellWidth)+64,30,1,COLORS.text);
  for(let row=0;row<animations.length;row++){const a=animations[row],top=header+(row*rowHeight),frame=a.sequence[phase];c.fillRect(0,top,width,rowHeight,row%2===0?COLORS.panel:COLORS.panelAlt);c.fillRect(0,top,5,rowHeight,COLORS.candidate);c.text(a.label,16,top+38,2,COLORS.text);for(let i=0;i<4;i++){const x=labelWidth+(i*cellWidth);if(i>0)c.fillRect(x,top,1,rowHeight,COLORS.border);c.pixels(candidatePixels(a.id,directions[i],frame,assembled),x+28,top+16,3,false);c.centered(a.prefix+(frame+1),x+64,top+88,1,COLORS.muted);}}
  return {png:encodeRgbaPng(width,height,c.rgba),width,height};
}

const raw=board('EN-E09 LIVING BOOK CLASPBOUND PRIMER','COMMON BAKED 24X24 COVER HINGES CLASP PAGES RUNE ZERO CHILD',false);
const assembled=board('EN-E09 CLASPBOUND PRIMER COMPLETE B + FORM','CONNECTED PAGE SPREAD BODY SNAP LOOSE PAGES AND RUNE EFFECTS OFF',true);
const comparison=comparisonBoard();
const hashes={raw:createHash('sha256').update(raw.png).digest('hex'),assembled:createHash('sha256').update(assembled.png).digest('hex'),comparison:createHash('sha256').update(comparison.png).digest('hex')};
const digests=Object.fromEntries(Object.keys(records).map((name)=>[name,createHash('sha256').update(JSON.stringify(records[name])).digest('hex')]));
const drift=[];
if(EN_E09_CLASPBOUND_PRIMER_GATE.artifactSha256&&hashes.raw!==EN_E09_CLASPBOUND_PRIMER_GATE.artifactSha256)drift.push('raw');
if(EN_E09_CLASPBOUND_PRIMER_GATE.assembledArtifactSha256&&hashes.assembled!==EN_E09_CLASPBOUND_PRIMER_GATE.assembledArtifactSha256)drift.push('assembled');
if(EN_E09_CLASPBOUND_PRIMER_GATE.comparisonArtifactSha256&&hashes.comparison!==EN_E09_CLASPBOUND_PRIMER_GATE.comparisonArtifactSha256)drift.push('comparison');
if(EN_E09_CLASPBOUND_PRIMER_GATE.candidateFrameDigest&&digests.candidate!==EN_E09_CLASPBOUND_PRIMER_GATE.candidateFrameDigest)drift.push('candidate digest');
if(drift.length)throw new Error('Claspbound Primer evidence drifted: '+drift.join(', '));
const report={format:'enemy-expansion-en-e09-living-book-claspbound-primer-full-v1',sliceId:'EN-E09',state:EN_E09_CLASPBOUND_PRIMER_GATE.status,actorTopology:EN_E09_CLASPBOUND_PRIMER_DATA.actorTopology,childAssets:[],candidate:specs.candidate,comparison:[specs.epochforge,specs.whisperveil,specs.crownmaw],artifact:path.basename(EN_E09_CLASPBOUND_PRIMER_GATE.artifact),png:{width:raw.width,height:raw.height,sha256:hashes.raw},assembledArtifact:path.basename(EN_E09_CLASPBOUND_PRIMER_GATE.assembledArtifact),assembledPng:{width:assembled.width,height:assembled.height,sha256:hashes.assembled},comparisonArtifact:path.basename(EN_E09_CLASPBOUND_PRIMER_GATE.comparisonArtifact),comparisonPng:{width:comparison.width,height:comparison.height,sha256:hashes.comparison},animationFrames:{raw:[1,2,3,4].map((n)=>`animation-frames/raw-${n}.png`),completeBForm:[1,2,3,4].map((n)=>`animation-frames/complete-b-form-${n}.png`),width:640,height:672,frameDurationMs:180},candidateFrameDigest:digests.candidate,comparisonDigests:digests,authorization:EN_E09_CLASPBOUND_PRIMER_GATE,candidateFrames:records.candidate,comparisonFrames:{epochforge:records.epochforge,whisperveil:records.whisperveil,crownmaw:records.crownmaw},guarantees:{candidateFamilies:1,candidateVariants:1,candidateFrames:80,publicCandidateFamilies:0,binaryAlpha:true,actorTopology:'baked-single-actor',childAssetCount:0,publicRegistrationApplied:false,effects:'off'}};
await mkdir(animationOutput,{recursive:true});
await writeFile(path.join(output,report.artifact),raw.png);await writeFile(path.join(output,report.assembledArtifact),assembled.png);await writeFile(path.join(output,report.comparisonArtifact),comparison.png);
for(let phase=0;phase<4;phase++){await writeFile(path.join(animationOutput,`raw-${phase+1}.png`),animationFrame(phase,false).png);await writeFile(path.join(animationOutput,`complete-b-form-${phase+1}.png`),animationFrame(phase,true).png);}
await writeFile(path.join(output,'en-e09-living-book-claspbound-primer-full-review.json'),JSON.stringify(report,null,2)+'\n');
console.log('Generated bounded EN-E09 Living Book Claspbound Primer evidence.');console.log('- Raw PNG SHA-256: '+hashes.raw);console.log('- Complete B + Form PNG SHA-256: '+hashes.assembled);console.log('- Family comparison PNG SHA-256: '+hashes.comparison);console.log('- Candidate frame digest: '+digests.candidate);console.log('- Epochforge digest: '+digests.epochforge);console.log('- Whisperveil digest: '+digests.whisperveil);console.log('- Crownmaw digest: '+digests.crownmaw);
