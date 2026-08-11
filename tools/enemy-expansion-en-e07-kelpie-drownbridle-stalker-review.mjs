import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ENEMY_EXPANSION_PROFILE } from '../engine/enemy-expansion.js';
import { EN_E03_COMMON_ALIAS_REGISTRY } from '../engine/enemy-expansion-en-e03-common-aliases.js';
import { EN_E07_MIREMANE_COURSER_REGISTRY } from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_DROWNBRIDLE_STALKER_DATA,
  EN_E07_DROWNBRIDLE_STALKER_GATE,
  EN_E07_DROWNBRIDLE_STALKER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-drownbridle-stalker.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'enemy-expansion-review', 'en-e07-kelpie-drownbridle-stalker');
const animationOutput = path.join(output, 'animation-frames');
const FONT = Object.freeze({
  ' ': [0,0,0,0,0,0,0], '+': [0,4,4,31,4,4,0], '-': [0,0,0,31,0,0,0], '/': [1,2,2,4,8,8,16],
  '0':[14,17,19,21,25,17,14], '1':[4,12,4,4,4,4,14], '2':[14,17,1,2,4,8,31], '3':[30,1,1,14,1,1,30], '4':[2,6,10,18,31,2,2], '5':[31,16,16,30,1,1,30], '6':[14,16,16,30,17,17,14], '7':[31,1,2,4,8,8,8], '8':[14,17,17,14,17,17,14], '9':[14,17,17,15,1,1,14],
  A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30], C:[15,16,16,16,16,16,15], D:[30,17,17,17,17,17,30], E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16], G:[15,16,16,19,17,17,15], H:[17,17,17,31,17,17,17], I:[31,4,4,4,4,4,31], J:[7,2,2,2,18,18,12], K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31], M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17], O:[14,17,17,17,17,17,14], P:[30,17,17,30,16,16,16], Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17], S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4], U:[17,17,17,17,17,17,14], V:[17,17,17,17,17,10,4], W:[17,17,17,17,21,27,17], X:[17,17,10,4,10,17,17], Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31],
});
const COLORS = Object.freeze({ background:'#0b0f16', panel:'#141a24', panelAlt:'#111721', border:'#344052', title:'#d8bd72', candidate:'#79c7b2', preceding:'#a9b86f', text:'#edf5ff', muted:'#9aa8b8', checkerA:'#202a37', checkerB:'#293646' });

class PixelCanvas {
  constructor(width, height) { this.width = width; this.height = height; this.rgba = Buffer.alloc(width * height * 4); }
  fillRect(x, y, width, height, fill) { if (![x,y,width,height].every(Number.isInteger) || x < 0 || y < 0 || x + width > this.width || y + height > this.height) throw new TypeError('Review rectangle is outside the PNG canvas.'); const [r,g,b,a] = hexToRgba(fill); for (let py=y; py<y+height; py++) for (let px=x; px<x+width; px++) { const o=((py*this.width)+px)*4; this.rgba[o]=r; this.rgba[o+1]=g; this.rgba[o+2]=b; this.rgba[o+3]=a; } }
  textWidth(value, scale) { return Math.max(0, (value.length * 6 * scale) - scale); }
  drawText(value, x, y, scale, fill) { let cursor=x; for (const character of value.toUpperCase()) { const rows=FONT[character]; if (!rows) throw new TypeError(`Review font is missing glyph ${character}.`); for (let row=0; row<7; row++) for (let column=0; column<5; column++) if (rows[row] & (1 << (4-column))) this.fillRect(cursor+(column*scale), y+(row*scale), scale, scale, fill); cursor += 6*scale; } }
  drawCenteredText(value, centerX, y, scale, fill) { this.drawText(value, Math.round(centerX-(this.textWidth(value, scale)/2)), y, scale, fill); }
  drawPixels(pixels, x, y, scale, border=true) { const size=ENEMY_EXPANSION_PROFILE.frameContract.cell; if (border) this.fillRect(x-2,y-2,(size*scale)+4,(size*scale)+4,COLORS.border); for (let py=0;py<size;py++) for (let px=0;px<size;px++) this.fillRect(x+(px*scale),y+(py*scale),scale,scale,pixels[(py*size)+px] || ((px+py)%2===0 ? COLORS.checkerA : COLORS.checkerB)); }
}

const directions = Object.freeze(['down','left','right','up']);
const animations = Object.freeze([
  {id:'idle',label:'IDLE',prefix:'F',frames:2,sequence:[0,1,0,1]},
  {id:'walk',label:'WALK',prefix:'W',frames:4,sequence:[0,1,2,3]},
  {id:'attack',label:'ATTACK',prefix:'A',frames:4,sequence:[0,1,2,3]},
  {id:'cast',label:'CAST',prefix:'C',frames:4,sequence:[0,1,2,3]},
  {id:'hurt',label:'HURT',prefix:'H',frames:2,sequence:[0,1,0,1]},
  {id:'death',label:'DEATH',prefix:'D',frames:4,sequence:[0,1,2,3]},
]);
const candidateSpec = Object.freeze({kind:'enemy',family:'kelpie',variant:'drownbridle-stalker'});
const miremaneSpec = Object.freeze({kind:'enemy',family:'kelpie',variant:'miremane-courser'});
const steppeHunterSpec = Object.freeze({kind:'enemy',family:'centaur',variant:'steppe-hunter'});
const direWolfSpec = Object.freeze({kind:'enemy',family:'wolf',variant:'dire'});
const captures = new Map();
const miremaneCaptures = new Map();
const steppeHunterCaptures = new Map();
const direWolfCaptures = new Map();
const candidateFrames = [];
const miremaneFrames = [];
const steppeHunterFrames = [];
const direWolfFrames = [];
const key = (animation,direction,frame) => [animation,direction,frame].join('/');
const record = (captured,spec,direction,animation,frame,candidateFamily=true) => ({family:spec.family,variant:spec.variant,...(candidateFamily?{candidateFamily:spec.family}:{}),direction,animation,frame,digest:captured.digest,alphaDigest:captured.alphaDigest,opaquePixels:captured.opaquePixels,bounds:captured.bounds});

function captureLegacyFrame(spec,direction,animation,frame) {
  const pixels=new Array(576).fill(null), outOfBoundsWrites=[]; let fillStyle='#000000';
  const context={get fillStyle(){return fillStyle;},set fillStyle(value){fillStyle=value;},clearRect(x,y,w,h){for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++){if(px<0||py<0||px>=24||py>=24)outOfBoundsWrites.push({x:px,y:py});else pixels[(py*24)+px]=null;}},fillRect(x,y,w,h){for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++){if(px<0||py<0||px>=24||py>=24)outOfBoundsWrites.push({x:px,y:py});else pixels[(py*24)+px]=fillStyle;}}};
  drawLegacySprite(context,spec,direction,animation,frame,{shadow:false}); const occupied=pixels.flatMap((color,index)=>color===null?[]:[{x:index%24,y:Math.floor(index/24)}]); const bounds=occupied.length?{minX:Math.min(...occupied.map(p=>p.x)),minY:Math.min(...occupied.map(p=>p.y)),maxX:Math.max(...occupied.map(p=>p.x)),maxY:Math.max(...occupied.map(p=>p.y))}:null;
  return Object.freeze({pixels:Object.freeze(pixels),opaquePixels:occupied.length,bounds:bounds&&Object.freeze(bounds),outOfBoundsWrites:Object.freeze(outOfBoundsWrites),digest:pixelDigest(pixels),alphaDigest:alphaDigest(pixels)});
}

for (const animation of animations) for (const direction of directions) for (let frame=0; frame<animation.frames; frame++) {
  const candidate=captureEnemyExpansionFrame(EN_E07_DROWNBRIDLE_STALKER_REGISTRY,candidateSpec,direction,animation.id,frame);
  const miremane=captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY,miremaneSpec,direction,animation.id,frame);
  const steppeHunter=captureEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY,steppeHunterSpec,direction,animation.id,frame);
  const direWolf=captureLegacyFrame(direWolfSpec,direction,animation.id,frame);
  captures.set(key(animation.id,direction,frame),candidate); miremaneCaptures.set(key(animation.id,direction,frame),miremane); steppeHunterCaptures.set(key(animation.id,direction,frame),steppeHunter); direWolfCaptures.set(key(animation.id,direction,frame),direWolf);
  candidateFrames.push(record(candidate,candidateSpec,direction,animation.id,frame)); miremaneFrames.push(record(miremane,miremaneSpec,direction,animation.id,frame)); steppeHunterFrames.push(record(steppeHunter,steppeHunterSpec,direction,animation.id,frame)); direWolfFrames.push(record(direWolf,direWolfSpec,direction,animation.id,frame,false));
}
function pixelsFor(animation,direction,frame,assembled){const captured=captures.get(key(animation,direction,frame));return assembled?buildEnemyExpansionCandidatePresentation(captured.pixels,EN_E07_DROWNBRIDLE_STALKER_DATA).formComplete:captured.pixels;}

function renderBoard({title,subtitle,assembled}) {
  const margin=16,labelWidth=130,scale=3,frameSize=72,frameGap=6,groupWidth=306,directionGap=14,headerHeight=96,rowHeight=108,width=(margin*2)+labelWidth+(groupWidth*4)+(directionGap*3),height=headerHeight+(rowHeight*6)+margin;
  const canvas=new PixelCanvas(width,height),groupX=index=>margin+labelWidth+(index*(groupWidth+directionGap)); canvas.fillRect(0,0,width,height,COLORS.background);canvas.fillRect(0,0,width,headerHeight-8,COLORS.panel);canvas.drawText(title,margin,14,3,COLORS.title);canvas.drawText(subtitle,margin,50,1,COLORS.muted);for(let i=0;i<4;i++)canvas.drawCenteredText(directions[i],groupX(i)+(groupWidth/2),72,2,COLORS.candidate);
  for(let row=0;row<animations.length;row++){const animation=animations[row],top=headerHeight+(row*rowHeight);canvas.fillRect(margin,top+4,width-(margin*2),rowHeight-8,row%2===0?COLORS.panel:COLORS.panelAlt);canvas.fillRect(margin,top+4,5,rowHeight-8,COLORS.candidate);canvas.drawText(animation.label,margin+18,top+30,2,COLORS.text);canvas.drawText(animation.frames+' FRAMES',margin+18,top+62,1,COLORS.candidate);for(let di=0;di<4;di++){const actualWidth=(frameSize*animation.frames)+(frameGap*(animation.frames-1)),startX=Math.round(groupX(di)+((groupWidth-actualWidth)/2));for(let frame=0;frame<animation.frames;frame++){const x=startX+(frame*(frameSize+frameGap));canvas.drawPixels(pixelsFor(animation.id,directions[di],frame,assembled),x,top+13,scale);canvas.drawCenteredText(animation.prefix+(frame+1),x+36,top+91,1,COLORS.muted);}}}
  return {png:encodeRgbaPng(width,height,canvas.rgba),width,height};
}

function renderComparisonBoard(){
  const samples=[{animation:'idle',frame:0,label:'IDLE F1'},{animation:'walk',frame:2,label:'WALK W3'},{animation:'attack',frame:2,label:'ATTACK A3'},{animation:'hurt',frame:1,label:'HURT H2'}],width=1520,height=548,headerHeight=96,labelWidth=120,groupWidth=350,rowHeight=108,canvas=new PixelCanvas(width,height);canvas.fillRect(0,0,width,height,COLORS.background);canvas.fillRect(0,0,width,headerHeight-8,COLORS.panel);canvas.drawText('EN-E07 KELPIE DROWNBRIDLE STALKER',16,14,3,COLORS.title);canvas.drawText('APPROVED MIREMANE AND STEPPE HUNTER PLUS PUBLIC DIRE WOLF VS SPECIALIST',16,50,1,COLORS.muted);for(let i=0;i<4;i++)canvas.drawCenteredText(directions[i],labelWidth+(i*groupWidth)+(groupWidth/2),72,2,COLORS.candidate);for(let row=0;row<samples.length;row++){const sample=samples[row],top=headerHeight+(row*rowHeight);canvas.fillRect(16,top+4,width-32,rowHeight-8,row%2===0?COLORS.panel:COLORS.panelAlt);canvas.drawText(sample.label,28,top+30,1,COLORS.text);for(let i=0;i<4;i++){const x=labelWidth+(i*groupWidth),k=key(sample.animation,directions[i],sample.frame);canvas.drawPixels(miremaneCaptures.get(k).pixels,x+4,top+12,3);canvas.drawPixels(steppeHunterCaptures.get(k).pixels,x+90,top+12,3);canvas.drawPixels(direWolfCaptures.get(k).pixels,x+176,top+12,3);canvas.drawPixels(captures.get(k).pixels,x+262,top+12,3);canvas.drawCenteredText('MIREMANE',x+40,top+90,1,COLORS.preceding);canvas.drawCenteredText('STEPPE',x+126,top+90,1,COLORS.preceding);canvas.drawCenteredText('DIRE WOLF',x+212,top+90,1,COLORS.title);canvas.drawCenteredText('STALKER',x+298,top+90,1,COLORS.candidate);}}return {png:encodeRgbaPng(width,height,canvas.rgba),width,height};
}

function renderAnimationFrame(phase,assembled){const width=640,height=672,headerHeight=48,labelWidth=112,cellWidth=128,rowHeight=104,canvas=new PixelCanvas(width,height);canvas.fillRect(0,0,width,height,COLORS.background);canvas.fillRect(0,0,width,headerHeight,COLORS.panel);canvas.drawText('DROWNBRIDLE STALKER '+(assembled?'COMPLETE B + FORM':'RAW'),12,6,2,COLORS.title);canvas.drawText('PHASE '+(phase+1),12,30,1,COLORS.candidate);for(let i=0;i<4;i++)canvas.drawCenteredText(directions[i],labelWidth+(i*cellWidth)+64,30,1,COLORS.text);for(let row=0;row<animations.length;row++){const animation=animations[row],top=headerHeight+(row*rowHeight),frame=animation.sequence[phase];canvas.fillRect(0,top,width,rowHeight,row%2===0?COLORS.panel:COLORS.panelAlt);canvas.fillRect(0,top,5,rowHeight,COLORS.candidate);canvas.drawText(animation.label,16,top+38,2,COLORS.text);for(let i=0;i<4;i++){const x=labelWidth+(i*cellWidth);if(i>0)canvas.fillRect(x,top,1,rowHeight,COLORS.border);canvas.drawPixels(pixelsFor(animation.id,directions[i],frame,assembled),x+28,top+16,3,false);canvas.drawCenteredText(animation.prefix+(frame+1),x+64,top+88,1,COLORS.muted);}}return {png:encodeRgbaPng(width,height,canvas.rgba),width,height};}

const rawBoard=renderBoard({title:'EN-E07 KELPIE DROWNBRIDLE STALKER',subtitle:'ONE COMPLETE SPECIALIST HIGH CREST IDLE WALK ATTACK CAST HURT DEATH',assembled:false});
const assembledBoard=renderBoard({title:'EN-E07 STALKER COMPLETE B + FORM',subtitle:'HIGH NECK HOOKED MUZZLE CONNECTED BRIDLE FOUR HOOVES EFFECTS EXTERNAL',assembled:true});
const comparisonBoard=renderComparisonBoard();
const rawHash=createHash('sha256').update(rawBoard.png).digest('hex'),assembledHash=createHash('sha256').update(assembledBoard.png).digest('hex'),comparisonHash=createHash('sha256').update(comparisonBoard.png).digest('hex'),candidateFrameDigest=createHash('sha256').update(JSON.stringify(candidateFrames)).digest('hex'),miremaneFrameDigest=createHash('sha256').update(JSON.stringify(miremaneFrames)).digest('hex'),steppeHunterFrameDigest=createHash('sha256').update(JSON.stringify(steppeHunterFrames)).digest('hex'),direWolfFrameDigest=createHash('sha256').update(JSON.stringify(direWolfFrames)).digest('hex');
const drift=[];if(EN_E07_DROWNBRIDLE_STALKER_GATE.artifactSha256&&rawHash!==EN_E07_DROWNBRIDLE_STALKER_GATE.artifactSha256)drift.push('raw review drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.assembledArtifactSha256&&assembledHash!==EN_E07_DROWNBRIDLE_STALKER_GATE.assembledArtifactSha256)drift.push('assembled review drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.comparisonArtifactSha256&&comparisonHash!==EN_E07_DROWNBRIDLE_STALKER_GATE.comparisonArtifactSha256)drift.push('comparison review drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.candidateFrameDigest&&candidateFrameDigest!==EN_E07_DROWNBRIDLE_STALKER_GATE.candidateFrameDigest)drift.push('candidate digest drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.miremaneComparisonDigest&&miremaneFrameDigest!==EN_E07_DROWNBRIDLE_STALKER_GATE.miremaneComparisonDigest)drift.push('Miremane Courser digest drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.steppeHunterComparisonDigest&&steppeHunterFrameDigest!==EN_E07_DROWNBRIDLE_STALKER_GATE.steppeHunterComparisonDigest)drift.push('Steppe Hunter digest drift');if(EN_E07_DROWNBRIDLE_STALKER_GATE.direWolfComparisonDigest&&direWolfFrameDigest!==EN_E07_DROWNBRIDLE_STALKER_GATE.direWolfComparisonDigest)drift.push('Dire Wolf digest drift');if(drift.length)throw new Error('EN-E07 Drownbridle Stalker evidence drifted: '+drift.join(', '));
const report={format:'enemy-expansion-en-e07-kelpie-drownbridle-stalker-full-v1',sliceId:'EN-E07',state:EN_E07_DROWNBRIDLE_STALKER_GATE.status,candidate:candidateSpec,comparison:[miremaneSpec,steppeHunterSpec,direWolfSpec],artifact:path.basename(EN_E07_DROWNBRIDLE_STALKER_GATE.artifact),png:{width:rawBoard.width,height:rawBoard.height,sha256:rawHash},assembledArtifact:path.basename(EN_E07_DROWNBRIDLE_STALKER_GATE.assembledArtifact),assembledPng:{width:assembledBoard.width,height:assembledBoard.height,sha256:assembledHash},comparisonArtifact:path.basename(EN_E07_DROWNBRIDLE_STALKER_GATE.comparisonArtifact),comparisonPng:{width:comparisonBoard.width,height:comparisonBoard.height,sha256:comparisonHash},animationFrames:{raw:[1,2,3,4].map(frame=>`animation-frames/raw-${frame}.png`),completeBForm:[1,2,3,4].map(frame=>`animation-frames/complete-b-form-${frame}.png`),width:640,height:672,frameDurationMs:180},candidateFrameDigest,miremaneFrameDigest,steppeHunterFrameDigest,direWolfFrameDigest,authorization:EN_E07_DROWNBRIDLE_STALKER_GATE,candidateFrames,miremaneFrames,steppeHunterFrames,direWolfFrames,guarantees:{candidateFamilies:1,candidateVariants:1,candidateFrames:80,publicCandidateFamilies:0,animationsRendered:animations.map(({id})=>id),directions,binaryAlpha:true,publicRegistrationApplied:false,effectBoundary:EN_E07_DROWNBRIDLE_STALKER_DATA.effectBoundary,effects:'off',assembledPresentation:['Complete B','Form']}};
await mkdir(animationOutput,{recursive:true});
await writeFile(path.join(output,report.artifact),rawBoard.png);
await writeFile(path.join(output,report.assembledArtifact),assembledBoard.png);
await writeFile(path.join(output,report.comparisonArtifact),comparisonBoard.png);
for(let phase=0;phase<4;phase++){await writeFile(path.join(animationOutput,`raw-${phase+1}.png`),renderAnimationFrame(phase,false).png);await writeFile(path.join(animationOutput,`complete-b-form-${phase+1}.png`),renderAnimationFrame(phase,true).png);}
await writeFile(path.join(output,'en-e07-kelpie-drownbridle-stalker-full-review.json'),JSON.stringify(report,null,2)+String.fromCharCode(10));
console.log('Generated the bounded EN-E07 Kelpie Drownbridle Stalker full-enemy evidence.');
console.log(`- Raw PNG SHA-256: ${rawHash}`);
console.log(`- Complete B + Form PNG SHA-256: ${assembledHash}`);
console.log(`- Family comparison PNG SHA-256: ${comparisonHash}`);
console.log(`- Candidate frame digest: ${candidateFrameDigest}`);
console.log(`- Approved Miremane Courser frame digest: ${miremaneFrameDigest}`);
console.log(`- Approved Steppe Hunter frame digest: ${steppeHunterFrameDigest}`);
console.log(`- Public Dire Wolf frame digest: ${direWolfFrameDigest}`);
