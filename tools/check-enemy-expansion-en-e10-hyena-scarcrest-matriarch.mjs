import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_DUNEBACK_SCAVENGER_GATE,
  EN_E10_DUNEBACK_SCAVENGER_REGISTRY,
  EN_E10_HYENA_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e10-hyena-duneback-scavenger.js';
import {
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE,
  EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-hyena-gloamstripe-ambusher.js';
import {
  EN_E10_HYENA_ELITE_CONTRACT_CARD,
  EN_E10_SCARCREST_MATRIARCH_CONTRACT,
  EN_E10_SCARCREST_MATRIARCH_DATA,
  EN_E10_SCARCREST_MATRIARCH_DEATH_SOURCE_FRAMES,
  EN_E10_SCARCREST_MATRIARCH_FAMILY,
  EN_E10_SCARCREST_MATRIARCH_GATE,
  EN_E10_SCARCREST_MATRIARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e10-hyena-scarcrest-matriarch.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, mirrorPixels, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const errors=[];
const directions=['down','left','right','up'];
const animations=[{id:'idle',frames:2},{id:'walk',frames:4},{id:'attack',frames:4},{id:'cast',frames:4},{id:'hurt',frames:2},{id:'death',frames:4}];
const specs={candidate:{kind:'enemy',family:'hyena',variant:'scarcrest-matriarch'},gloamstripe:{kind:'enemy',family:'hyena',variant:'gloamstripe-ambusher'},duneback:{kind:'enemy',family:'hyena',variant:'duneback-scavenger'},direWolf:{kind:'enemy',family:'wolf',variant:'dire'}};

function check(condition,message){if(!condition)errors.push(message);}
function hashJson(value){return createHash('sha256').update(JSON.stringify(value)).digest('hex');}
function frameRecord(captured,spec,direction,animation,frame,candidateFamily=true){return{family:spec.family,variant:spec.variant,...(candidateFamily?{candidateFamily:spec.family}:{}),direction,animation,frame,digest:captured.digest,alphaDigest:captured.alphaDigest,opaquePixels:captured.opaquePixels,bounds:captured.bounds};}

function captureLegacyFrame(spec,direction,animation,frame){
  const pixels=new Array(576).fill(null),outOfBoundsWrites=[];let fillStyle='#000000';
  const context={get fillStyle(){return fillStyle;},set fillStyle(value){fillStyle=value;},clearRect(x,y,width,height){for(let py=y;py<y+height;py++)for(let px=x;px<x+width;px++){if(px<0||py<0||px>=24||py>=24)outOfBoundsWrites.push({x:px,y:py});else pixels[(py*24)+px]=null;}},fillRect(x,y,width,height){for(let py=y;py<y+height;py++)for(let px=x;px<x+width;px++){if(px<0||py<0||px>=24||py>=24)outOfBoundsWrites.push({x:px,y:py});else pixels[(py*24)+px]=fillStyle;}}};
  drawLegacySprite(context,spec,direction,animation,frame,{shadow:false});const occupied=pixels.flatMap((color,index)=>color===null?[]:[{x:index%24,y:Math.floor(index/24)}]);const bounds=occupied.length?{minX:Math.min(...occupied.map(({x})=>x)),minY:Math.min(...occupied.map(({y})=>y)),maxX:Math.max(...occupied.map(({x})=>x)),maxY:Math.max(...occupied.map(({y})=>y))}:null;
  return Object.freeze({pixels:Object.freeze(pixels),opaquePixels:occupied.length,bounds:bounds&&Object.freeze(bounds),outOfBoundsWrites:Object.freeze(outOfBoundsWrites),digest:pixelDigest(pixels),alphaDigest:alphaDigest(pixels)});
}

function componentCount(pixels){const occupied=new Set(pixels.flatMap((color,index)=>color?[index]:[]));let components=0;while(occupied.size){components++;const queue=[occupied.values().next().value];occupied.delete(queue[0]);while(queue.length){const index=queue.shift(),x=index%24,y=Math.floor(index/24);for(const[nx,ny]of[[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const next=(ny*24)+nx;if(nx>=0&&ny>=0&&nx<24&&ny<24&&occupied.delete(next))queue.push(next);}}}return components;}
function countColors(pixels,colors){return pixels.reduce((count,color)=>count+(colors.has(color)?1:0),0);}
function rowRuns(pixels,y){let runs=0,occupied=false;for(const color of pixels.slice(y*24,(y+1)*24)){if(color&&!occupied)runs++;occupied=Boolean(color);}return runs;}
async function fileHash(relativePath){return createHash('sha256').update(await readFile(path.join(root,relativePath))).digest('hex');}
function rejects(action,label,expected='is not implemented'){try{action();errors.push(label+' must reject');}catch(error){check(String(error.message).includes(expected),label+' rejected unexpectedly: '+error.message);}}

check(EN_E10_HYENA_TOPOLOGY_DECISION.status==='selected'&&EN_E10_HYENA_TOPOLOGY_DECISION.selected==='baked-single-actor-grounded-quadruped'&&EN_E10_HYENA_TOPOLOGY_DECISION.childAssets.length===0,'approved Hyena topology decision drifted');
check(
  EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.status==='approved'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest==='6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedImplementation==='5d35ed0c36f84646270a3d02b13e63559798aa01'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedApprovalRecord==='76ed7212ccddc33d1fcafa1ec97b26eb8963f096'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.initialPublishedHandoff==='1126852feae8f812c044806760a0063a7ef8d31f'
    && EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publicationState==='published',
  'published Gloamstripe predecessor drifted',
);
check(
  EN_E10_SCARCREST_MATRIARCH_GATE.status==='approved'
    && EN_E10_SCARCREST_MATRIARCH_GATE.baseCheckpoint==='76117603035f6880f25f7dc8356ba23221df2af9'
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizedOn==='2026-08-13'
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizationEvidence.includes('approved lets do nex t')
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizationEvidence.includes('exactly one private elite Hyena full 80-frame candidate')
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizationEvidence.includes('final reconciliation 76117603035f6880f25f7dc8356ba23221df2af9')
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizationEvidence.includes('distinct Complete B outlined PNG')
    && EN_E10_SCARCREST_MATRIARCH_GATE.authorizationEvidence.includes('does not authorize outline registration')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvedOn==='2026-08-13'
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('approvedf lets do nex tr')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('raw sprite 35')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('outlined sprite 39')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('Complete B + Form sprite 43')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('active comparison sprite 47')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvalEvidence.includes('81e0c289eae61184741155c99a1cef9c03d3d3bae115f7eb96489572fbc00cf7')
    && EN_E10_SCARCREST_MATRIARCH_GATE.approvedImplementation==='88d00336ee8ff714f1d978a5cf37d9807bbb4719'
    && EN_E10_SCARCREST_MATRIARCH_GATE.publishedImplementation==='88d00336ee8ff714f1d978a5cf37d9807bbb4719'
    && EN_E10_SCARCREST_MATRIARCH_GATE.publishedApprovalRecord==='0411a1a385ddddf090f0ca3d31c81e0a6f6e6214'
    && EN_E10_SCARCREST_MATRIARCH_GATE.initialPublishedHandoff===''
    && EN_E10_SCARCREST_MATRIARCH_GATE.publicationState==='published-awaiting-handoff-reconciliation',
  'elite authorization or outlined-review boundary drifted',
);
check(
  EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.gateId===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.candidateFrameDigest===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.outlinedArtifactSha256===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.outlinedArtifactSha256
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.publishedImplementation===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedImplementation
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.publishedApprovalRecord===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedApprovalRecord
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.initialPublishedHandoff===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.initialPublishedHandoff
    && EN_E10_SCARCREST_MATRIARCH_GATE.precedingApproval.currentReconciliation===EN_E10_SCARCREST_MATRIARCH_GATE.baseCheckpoint,
  'bounded Gloamstripe publication tuple drifted',
);
check(
  JSON.stringify(EN_E10_HYENA_ELITE_CONTRACT_CARD.roleOrder)===JSON.stringify(['common','specialist','elite'])
    && EN_E10_HYENA_ELITE_CONTRACT_CARD.precedingVariant.id==='gloamstripe-ambusher'
    && EN_E10_HYENA_ELITE_CONTRACT_CARD.activeVariant.id==='scarcrest-matriarch'
    && EN_E10_HYENA_ELITE_CONTRACT_CARD.activeVariant.role==='elite'
    && EN_E10_HYENA_ELITE_CONTRACT_CARD.activeVariant.status==='implemented-full-approved'
    && EN_E10_HYENA_ELITE_CONTRACT_CARD.deferredRoles.length===0,
  'Hyena elite role boundary drifted',
);
check(
  EN_E10_SCARCREST_MATRIARCH_CONTRACT.silhouette.includes('broad elite Hyena matriarch')
    && EN_E10_SCARCREST_MATRIARCH_CONTRACT.silhouette.includes('heavy connected neck')
    && EN_E10_SCARCREST_MATRIARCH_CONTRACT.visualIdentity.includes('integrated pale muzzle scars')
    && EN_E10_SCARCREST_MATRIARCH_DATA.actorTopology===EN_E10_HYENA_TOPOLOGY_DECISION.selected
    && EN_E10_SCARCREST_MATRIARCH_DATA.childAssets.length===0
    && EN_E10_SCARCREST_MATRIARCH_DATA.bakedEffects.length===0,
  'elite identity or zero-child effect firewall drifted',
);
check(
  EN_E10_SCARCREST_MATRIARCH_GATE.scope.includes('complete 80-frame Scarcrest Matriarch elite Hyena')
    && EN_E10_SCARCREST_MATRIARCH_GATE.animationContract.includes('heavy neck-and-jaw crush')
    && EN_E10_SCARCREST_MATRIARCH_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_SCARCREST_MATRIARCH_GATE.reviewPresentation.includes('distinct Complete B outlined')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('implementation 88d00336ee8ff714f1d978a5cf37d9807bbb4719')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('approval record 0411a1a385ddddf090f0ca3d31c81e0a6f6e6214')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('remote verified')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('initial published handoff and final reconciliation')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('approvedf lets do nex tr')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('Ram actor-topology decision')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('no Ram art is authorized')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('complete, clean, and remote verified')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('review evidence only')
    && EN_E10_SCARCREST_MATRIARCH_GATE.nextGate.includes('does not authorize outline registration'),
  'full-suite motion, review, or stop boundary drifted',
);
check(Object.isFrozen(EN_E10_HYENA_ELITE_CONTRACT_CARD)&&Object.isFrozen(EN_E10_SCARCREST_MATRIARCH_CONTRACT)&&Object.isFrozen(EN_E10_SCARCREST_MATRIARCH_DATA)&&Object.isFrozen(EN_E10_SCARCREST_MATRIARCH_GATE),'elite contract, data, and gate must be deeply immutable');
check(EN_E10_SCARCREST_MATRIARCH_REGISTRY.families.length===1&&EN_E10_SCARCREST_MATRIARCH_REGISTRY.publicFamilies.length===0&&EN_E10_SCARCREST_MATRIARCH_FAMILY.variants.length===1,'private elite registry boundary drifted');

const publicVariantCount=engine.PUBLIC_ENEMIES.reduce((sum,family)=>sum+family.variants.length,0);
check(engine.ENEMIES.length===57&&engine.PUBLIC_ENEMIES.length===92&&publicVariantCount===294&&!engine.PUBLIC_ENEMIES.some(({id})=>id==='hyena'),'candidate must preserve public 92/294 and keep Hyena private');
check(engine.EN_E10_SCARCREST_MATRIARCH_REGISTRY===undefined,'candidate must not leak through the public facade');
const publicSource=await readFile(path.join(root,'engine','enemy-expansion-public.js'),'utf8');
const manifestSource=await readFile(path.join(root,'asset-pack','manifest.json'),'utf8');
const outlineSource=await readFile(path.join(root,'engine','outline-renderer.js'),'utf8');
check(!publicSource.includes('scarcrest-matriarch'),'public expansion registry must not mention Scarcrest Matriarch');
check(!manifestSource.includes('scarcrest-matriarch'),'asset manifest must not mention Scarcrest Matriarch');
check(!outlineSource.includes('scarcrest-matriarch'),'outline registry must not mention Scarcrest Matriarch');
check(JSON.stringify(EN_E10_SCARCREST_MATRIARCH_DEATH_SOURCE_FRAMES)===JSON.stringify([0,1,1,1]),'Death alias mapping drifted');

const captures=new Map();
const records={candidate:[],gloamstripe:[],duneback:[],direWolf:[]};
const colors=EN_E10_SCARCREST_MATRIARCH_DATA.scarcrestMatriarch;
const palettes=[['fur',new Set(colors.fur)],['crest',new Set(colors.crest)],['belly',new Set(colors.belly)],['scar',new Set(colors.scar)],['ear',new Set(colors.ear)]];
let connected=0,bounded=0,grounded=0,fourPawRows=0,quadrupedSpanFrames=0,colored=0,flashes=0,eyeViews=0,muzzleViews=0,minOpaque=Infinity,maxOpaque=-Infinity,outlinedPixels=0,formChanges=0;
const differences={gloamstripe:0,duneback:0,direWolf:0};
const alphaDifferences={gloamstripe:0,duneback:0,direWolf:0};

for(const animation of animations)for(const direction of directions){
  const animationDigests=[];
  for(let frame=0;frame<animation.frames;frame++){
    const key=direction+'/'+animation.id+'/'+frame;
    const candidate=captureEnemyExpansionFrame(EN_E10_SCARCREST_MATRIARCH_REGISTRY,specs.candidate,direction,animation.id,frame);
    const gloamstripe=captureEnemyExpansionFrame(EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY,specs.gloamstripe,direction,animation.id,frame);
    const duneback=captureEnemyExpansionFrame(EN_E10_DUNEBACK_SCAVENGER_REGISTRY,specs.duneback,direction,animation.id,frame);
    const direWolf=captureLegacyFrame(specs.direWolf,direction,animation.id,frame);
    const compared={gloamstripe,duneback,direWolf};
    captures.set(key,candidate);animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate,specs.candidate,direction,animation.id,frame));records.gloamstripe.push(frameRecord(gloamstripe,specs.gloamstripe,direction,animation.id,frame));records.duneback.push(frameRecord(duneback,specs.duneback,direction,animation.id,frame));records.direWolf.push(frameRecord(direWolf,specs.direWolf,direction,animation.id,frame,false));
    check(candidate.outOfBoundsWrites.length===0,key+' wrote outside the cell');
    check(candidate.alpha.every(value=>value===0||value===255),key+' lost hard alpha');
    if(componentCount(candidate.pixels)===1)connected++;else check(false,key+' must remain one connected actor');
    const isBounded=candidate.bounds&&candidate.bounds.minX>=1&&candidate.bounds.minY>=1&&candidate.bounds.maxX<=22&&candidate.bounds.maxY<=22;if(isBounded)bounded++;else check(false,key+' lost the one-cell margin');
    if(candidate.bounds&&candidate.bounds.maxY===22)grounded++;else check(false,key+' lost paw ground contact');
    check(candidate.opaquePixels>=210&&candidate.opaquePixels<=340,key+' density is implausible for the elite Hyena');minOpaque=Math.min(minOpaque,candidate.opaquePixels);maxOpaque=Math.max(maxOpaque,candidate.opaquePixels);
    const pawRuns=rowRuns(candidate.pixels,22);if(pawRuns>=4)fourPawRows++;else check(false,key+' lost four separated grounded paw runs');
    const width=candidate.bounds.maxX-candidate.bounds.minX+1,height=candidate.bounds.maxY-candidate.bounds.minY+1,quadrupedSpan=(direction==='left'||direction==='right')?width>=20:height>=20;if(quadrupedSpan)quadrupedSpanFrames++;else check(false,key+' lost the grounded quadruped span');
    for(const name of Object.keys(compared)){if(candidate.digest!==compared[name].digest)differences[name]++;if(candidate.alphaDigest!==compared[name].alphaDigest)alphaDifferences[name]++;}
    const flash=(animation.id==='hurt'||animation.id==='death')&&frame===0;
    if(flash){const frameColors=new Set(candidate.pixels.filter(Boolean));check(frameColors.size===1&&frameColors.has('#f4f4f4'),key+' must be an exact whole-silhouette white flash');flashes++;}
    else{
      for(const[name,palette]of palettes)check(countColors(candidate.pixels,palette)>0,key+' lost '+name+' palette identity');
      check(countColors(candidate.pixels,new Set([colors.paw]))>=8,key+' lost four dark two-pixel paws');
      const eyeCount=countColors(candidate.pixels,new Set([colors.eye])),featureCount=countColors(candidate.pixels,new Set([colors.feature]));
      if(direction==='up')check(eyeCount===0&&featureCount===0,key+' rear view must not expose face pixels');
      else if(direction==='down'){check(eyeCount===2,key+' front view must preserve paired gold eyes');check(featureCount>=3,key+' front view must preserve nostrils and mouth');eyeViews++;muzzleViews++;}
      else{check(eyeCount===1,key+' side view must preserve one gold profile eye');check(featureCount>=2,key+' side view must preserve nose and jaw line');eyeViews++;muzzleViews++;}
      colored++;
    }
    check(candidate.renderResult.scarcrestMatriarchGate===EN_E10_SCARCREST_MATRIARCH_GATE.id&&candidate.renderResult.architectureDecision===EN_E10_HYENA_TOPOLOGY_DECISION.id&&candidate.renderResult.approvedPrecedingGate===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id&&candidate.renderResult.childAssetCount===0,key+' renderer gate or child boundary drifted');
    const presentation=buildEnemyExpansionCandidatePresentation(candidate.pixels,EN_E10_SCARCREST_MATRIARCH_DATA);outlinedPixels+=presentation.complete.reduce((sum,color,index)=>sum+(color&&!candidate.pixels[index]?1:0),0);formChanges+=presentation.form.reduce((sum,color,index)=>sum+(candidate.pixels[index]&&color!==candidate.pixels[index]?1:0),0);
  }
  const uniqueMotion=new Set(animationDigests).size;if(animation.id==='idle'||animation.id==='hurt'||animation.id==='death')check(uniqueMotion===2,direction+' '+animation.id+' must preserve both authored alias phases');else check(uniqueMotion>=3,direction+' '+animation.id+' must preserve distinct motion phases');
}

for(const direction of directions)for(let frame=0;frame<4;frame++){const attack=captures.get(direction+'/attack/'+frame),cast=captures.get(direction+'/cast/'+frame);check(cast.digest===attack.digest,direction+' Cast C'+(frame+1)+' must alias Attack exactly');const death=captures.get(direction+'/death/'+frame),hurt=captures.get(direction+'/hurt/'+EN_E10_SCARCREST_MATRIARCH_DEATH_SOURCE_FRAMES[frame]);check(death.digest===hurt.digest,direction+' Death D'+(frame+1)+' must alias Hurt exactly');}
for(const animation of animations)for(let frame=0;frame<animation.frames;frame++){const left=captures.get('left/'+animation.id+'/'+frame),right=captures.get('right/'+animation.id+'/'+frame);check(JSON.stringify(left.pixels)===JSON.stringify(mirrorPixels(right.pixels)),'side mirror contract drifted for '+animation.id+'/'+frame);}

const digests=Object.fromEntries(Object.keys(records).map(name=>[name,hashJson(records[name])]));
if(EN_E10_SCARCREST_MATRIARCH_GATE.candidateFrameDigest)check(digests.candidate===EN_E10_SCARCREST_MATRIARCH_GATE.candidateFrameDigest,'candidate digest drifted');
if(EN_E10_SCARCREST_MATRIARCH_GATE.gloamstripeComparisonDigest)check(digests.gloamstripe===EN_E10_SCARCREST_MATRIARCH_GATE.gloamstripeComparisonDigest,'Gloamstripe comparison digest drifted');
if(EN_E10_SCARCREST_MATRIARCH_GATE.dunebackComparisonDigest)check(digests.duneback===EN_E10_SCARCREST_MATRIARCH_GATE.dunebackComparisonDigest,'Duneback comparison digest drifted');
if(EN_E10_SCARCREST_MATRIARCH_GATE.direWolfComparisonDigest)check(digests.direWolf===EN_E10_SCARCREST_MATRIARCH_GATE.direWolfComparisonDigest,'Dire Wolf comparison digest drifted');
check(digests.gloamstripe===EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest,'approved Gloamstripe comparison source drifted');
check(digests.duneback===EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest,'approved Duneback comparison source drifted');
check(connected===80&&bounded===80&&grounded===80,'all 80 Scarcrest frames must be connected, bounded, and grounded');
check(fourPawRows===80&&quadrupedSpanFrames===80,'all 80 frames must preserve four paw runs and the grounded quadruped span');
check(colored===72&&flashes===8&&eyeViews===54&&muzzleViews===54,'colored, flash, eye-view, or muzzle-view totals drifted');
for(const name of Object.keys(differences))check(differences[name]===80&&alphaDifferences[name]===80,'Scarcrest Matriarch must differ from '+name+' in all 80 pixel and alpha frames');
check(outlinedPixels>0&&formChanges>0,'Complete B outline and Form presentations must visibly change the candidate');

for(const[field,relative]of[['artifactSha256',EN_E10_SCARCREST_MATRIARCH_GATE.artifact],['outlinedArtifactSha256',EN_E10_SCARCREST_MATRIARCH_GATE.outlinedArtifact],['assembledArtifactSha256',EN_E10_SCARCREST_MATRIARCH_GATE.assembledArtifact],['comparisonArtifactSha256',EN_E10_SCARCREST_MATRIARCH_GATE.comparisonArtifact]])if(EN_E10_SCARCREST_MATRIARCH_GATE[field])check(await fileHash(relative)===EN_E10_SCARCREST_MATRIARCH_GATE[field],field+' drifted');
for(const review of Object.values(EN_E10_SCARCREST_MATRIARCH_GATE.reviewAnimations))if(review.sha256)check(await fileHash(review.artifact)===review.sha256,review.artifact+' drifted');
rejects(()=>captureEnemyExpansionFrame(EN_E10_SCARCREST_MATRIARCH_REGISTRY,specs.candidate,'down','idle',2),'out-of-range Idle','invalid for idle');
rejects(()=>captureEnemyExpansionFrame(EN_E10_SCARCREST_MATRIARCH_REGISTRY,{...specs.candidate,family:'wolf'},'down','idle',0),'wrong family');
rejects(()=>captureEnemyExpansionFrame(EN_E10_SCARCREST_MATRIARCH_REGISTRY,{...specs.candidate,variant:'gloamstripe-ambusher'},'down','idle',0),'wrong variant');

if(errors.length){console.error('EN-E10 Hyena Scarcrest Matriarch focused gate failed:');for(const error of errors)console.error('- '+error);process.exitCode=1;}
else{
  console.log('EN-E10 Hyena Scarcrest Matriarch private elite candidate passes focused validation.');
  console.log('- Structure: '+connected+'/80 connected; '+bounded+'/80 bounded; '+grounded+'/80 grounded; opaque range '+minOpaque+'-'+maxOpaque);
  console.log('- Hyena identity: '+fourPawRows+'/80 four-paw rows; '+quadrupedSpanFrames+'/80 quadruped spans; '+colored+'/72 colored frames; '+flashes+'/8 white flashes; '+eyeViews+'/54 eye-bearing views; '+muzzleViews+'/54 readable muzzles');
  console.log('- Distinction: Gloamstripe '+differences.gloamstripe+'/80; Duneback '+differences.duneback+'/80; Dire Wolf '+differences.direWolf+'/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +'+outlinedPixels+' pixels; Form changes '+formChanges);
  console.log('- Protected: approved Gloamstripe and Duneback exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: '+digests.candidate);
  console.log('- Approved Gloamstripe frame digest: '+digests.gloamstripe);
  console.log('- Approved Duneback frame digest: '+digests.duneback);
  console.log('- Public Dire Wolf frame digest: '+digests.direWolf);
}
