import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E08_CROWNMAW_GREATBLADE_GATE, EN_E08_CROWNMAW_GREATBLADE_REGISTRY } from '../engine/enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import { EN_E08_WHISPERVEIL_VISAGE_GATE, EN_E08_WHISPERVEIL_VISAGE_REGISTRY } from '../engine/enemy-expansion-en-e08-possessed-mask-whisperveil-visage.js';
import { EN_E09_EPOCHFORGE_COLOSSUS_GATE, EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY } from '../engine/enemy-expansion-en-e09-clockwork-automaton-epochforge-colossus.js';
import { EN_E09_CLASPBOUND_PRIMER_CONTRACT, EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD, EN_E09_CLASPBOUND_PRIMER_DATA, EN_E09_CLASPBOUND_PRIMER_DEATH_SOURCE_FRAMES, EN_E09_CLASPBOUND_PRIMER_FAMILY, EN_E09_CLASPBOUND_PRIMER_GATE, EN_E09_CLASPBOUND_PRIMER_REGISTRY, EN_E09_LIVING_BOOK_TOPOLOGY_DECISION } from '../engine/enemy-expansion-en-e09-living-book-claspbound-primer.js';
import { captureEnemyExpansionFrame, mirrorPixels } from './enemy-expansion-review-pixels.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
const hashJson=(value)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const directions=['down','left','right','up'];
const animations=[{id:'idle',frames:2},{id:'walk',frames:4},{id:'attack',frames:4},{id:'cast',frames:4},{id:'hurt',frames:2},{id:'death',frames:4}];
const specs={candidate:{kind:'enemy',family:'living-book',variant:'claspbound-primer'},epochforge:{kind:'enemy',family:'clockwork-automaton',variant:'epochforge-colossus'},whisperveil:{kind:'enemy',family:'possessed-mask',variant:'whisperveil-visage'},crownmaw:{kind:'enemy',family:'living-weapon',variant:'crownmaw-greatblade'}};
const registries={candidate:EN_E09_CLASPBOUND_PRIMER_REGISTRY,epochforge:EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY,whisperveil:EN_E08_WHISPERVEIL_VISAGE_REGISTRY,crownmaw:EN_E08_CROWNMAW_GREATBLADE_REGISTRY};
const record=(captured,spec,direction,animation,frame)=>({family:spec.family,variant:spec.variant,candidateFamily:spec.family,direction,animation,frame,digest:captured.digest,alphaDigest:captured.alphaDigest,opaquePixels:captured.opaquePixels,bounds:captured.bounds});
function componentCount(pixels){const occupied=new Set(pixels.flatMap((c,i)=>c?[i]:[]));let count=0;while(occupied.size){count++;const q=[occupied.values().next().value];occupied.delete(q[0]);while(q.length){const i=q.shift(),x=i%24,y=Math.floor(i/24);for(const[nx,ny]of[[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const n=(ny*24)+nx;if(nx>=0&&ny>=0&&nx<24&&ny<24&&occupied.delete(n))q.push(n);}}}return count;}
const fileHash=async(relative)=>createHash('sha256').update(await readFile(path.join(root,relative))).digest('hex');

check(EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.status==='selected'&&EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selected==='baked-single-actor'&&EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.baseCheckpoint==='85b29f76cb77ae85a116cec56eeed5b61ea5a375'&&EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.selectionEvidence.includes('designer replied: approved')&&EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.childAssets.length===0&&EN_E09_LIVING_BOOK_TOPOLOGY_DECISION.forbidden.includes('detached pages'),'Living Book topology decision drifted');
check(EN_E09_CLASPBOUND_PRIMER_GATE.status==='awaiting-visual-approval'&&EN_E09_CLASPBOUND_PRIMER_GATE.baseCheckpoint==='85b29f76cb77ae85a116cec56eeed5b61ea5a375'&&EN_E09_CLASPBOUND_PRIMER_GATE.approvedOn===null&&EN_E09_CLASPBOUND_PRIMER_GATE.approvedImplementation===null&&EN_E09_CLASPBOUND_PRIMER_GATE.publicationState==='not-approved','private approval gate drifted');
check(EN_E09_CLASPBOUND_PRIMER_GATE.precedingApproval.gateId===EN_E09_EPOCHFORGE_COLOSSUS_GATE.id&&EN_E09_CLASPBOUND_PRIMER_GATE.precedingApproval.candidateFrameDigest===EN_E09_EPOCHFORGE_COLOSSUS_GATE.candidateFrameDigest&&EN_E09_CLASPBOUND_PRIMER_GATE.precedingApproval.currentReconciliation==='85b29f76cb77ae85a116cec56eeed5b61ea5a375','Epochforge predecessor drifted');
check(EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.activeVariant.role==='common'&&EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.activeVariant.identity==='hinged-cover-clasp-rune-page-block-primer'&&JSON.stringify(EN_E09_CLASPBOUND_PRIMER_CONTRACT_CARD.deferredRoles)===JSON.stringify(['specialist','elite'])&&EN_E09_CLASPBOUND_PRIMER_CONTRACT.silhouette.includes('connected page spread')&&EN_E09_CLASPBOUND_PRIMER_CONTRACT.visualIdentity.includes('No eyes, mouth, hands, limbs')&&EN_E09_CLASPBOUND_PRIMER_DATA.childAssets.length===0&&EN_E09_CLASPBOUND_PRIMER_DATA.bakedEffects.length===0,'Living Book identity or boundary drifted');
check(EN_E09_CLASPBOUND_PRIMER_GATE.scope.includes('80-frame Claspbound Primer common Living Book')&&EN_E09_CLASPBOUND_PRIMER_GATE.animationContract.includes('body-owned snapping-book strike')&&EN_E09_CLASPBOUND_PRIMER_GATE.animationContract.includes('Cast aliases Attack exactly')&&EN_E09_CLASPBOUND_PRIMER_GATE.nextGate.includes('explicit designer visual approval')&&EN_E09_CLASPBOUND_PRIMER_GATE.exclusions.includes('loose pages')&&EN_E09_CLASPBOUND_PRIMER_GATE.exclusions.includes('specialist or elite Living Book'),'motion or stop gate drifted');
check(Object.isFrozen(EN_E09_CLASPBOUND_PRIMER_GATE)&&Object.isFrozen(EN_E09_CLASPBOUND_PRIMER_DATA),'gate and data must be frozen');
check(EN_E09_CLASPBOUND_PRIMER_REGISTRY.families.length===1&&EN_E09_CLASPBOUND_PRIMER_REGISTRY.publicFamilies.length===0&&EN_E09_CLASPBOUND_PRIMER_FAMILY.variants.length===1,'private registry drifted');
const publicVariants=engine.PUBLIC_ENEMIES.reduce((sum,f)=>sum+f.variants.length,0);check(engine.PUBLIC_ENEMIES.length===80&&publicVariants===259&&!engine.PUBLIC_ENEMIES.some((f)=>f.id==='living-book'),'public 80/259 boundary drifted');
check(JSON.stringify(EN_E09_CLASPBOUND_PRIMER_DEATH_SOURCE_FRAMES)===JSON.stringify([0,1,1,1]),'death alias drifted');

const records=Object.fromEntries(Object.keys(specs).map((name)=>[name,[]])),byKey=new Map();
let connected=0,hovering=0,flashes=0,colored=0,runeViews=0,openSpreads=0;let minOpaque=999,maxOpaque=0;
const diffs={epochforge:0,whisperveil:0,crownmaw:0},alphaDiffs={epochforge:0,whisperveil:0,crownmaw:0};
for(const animation of animations)for(const direction of directions)for(let frame=0;frame<animation.frames;frame++){
  const captured={};for(const name of Object.keys(specs)){captured[name]=captureEnemyExpansionFrame(registries[name],specs[name],direction,animation.id,frame);records[name].push(record(captured[name],specs[name],direction,animation.id,frame));}
  const c=captured.candidate,key=`${animation.id}/${direction}/${frame}`;byKey.set(key,c);if(componentCount(c.pixels)===1)connected++;if(c.bounds.minY>=2&&c.bounds.maxY<=21)hovering++;
  const colors=new Set(c.pixels.filter(Boolean)),flash=colors.size===1&&colors.has('#f4f4f4');if(flash)flashes++;else colored++;
  if(!flash&&direction!=='up'&&c.pixels.includes('#7ad6c7'))runeViews++;
  if((animation.id==='attack'||animation.id==='cast')&&frame===1&&(c.bounds.maxX-c.bounds.minX+1)>=17)openSpreads++;
  minOpaque=Math.min(minOpaque,c.opaquePixels);maxOpaque=Math.max(maxOpaque,c.opaquePixels);
  check(c.opaquePixels>=90&&c.opaquePixels<=260,`${key} opaque ${c.opaquePixels} left common book range`);check(c.renderResult.childAssetCount===0&&c.renderResult.approvedPrecedingGate===EN_E09_EPOCHFORGE_COLOSSUS_GATE.id,`${key} renderer boundary drifted`);
  for(const name of ['epochforge','whisperveil','crownmaw']){if(c.digest!==captured[name].digest)diffs[name]++;if(c.alphaDigest!==captured[name].alphaDigest)alphaDiffs[name]++;}
}
for(const direction of directions)for(let frame=0;frame<4;frame++){check(byKey.get(`cast/${direction}/${frame}`).digest===byKey.get(`attack/${direction}/${frame}`).digest,`${direction} cast alias ${frame}`);check(byKey.get(`death/${direction}/${frame}`).digest===byKey.get(`hurt/${direction}/${EN_E09_CLASPBOUND_PRIMER_DEATH_SOURCE_FRAMES[frame]}`).digest,`${direction} death alias ${frame}`);check(JSON.stringify(byKey.get(`walk/left/${frame}`).pixels)===JSON.stringify(mirrorPixels(byKey.get(`walk/right/${frame}`).pixels)),`walk mirror ${frame}`);}
const digests=Object.fromEntries(Object.keys(records).map((name)=>[name,hashJson(records[name])]));
if(EN_E09_CLASPBOUND_PRIMER_GATE.candidateFrameDigest)check(digests.candidate===EN_E09_CLASPBOUND_PRIMER_GATE.candidateFrameDigest,'candidate digest drifted');
check(digests.epochforge===EN_E09_EPOCHFORGE_COLOSSUS_GATE.candidateFrameDigest,'Epochforge digest drifted');check(digests.whisperveil===EN_E08_WHISPERVEIL_VISAGE_GATE.candidateFrameDigest,'Whisperveil digest drifted');check(digests.crownmaw===EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest,'Crownmaw digest drifted');
check(connected===80&&hovering===80,`structure connected ${connected} hovering ${hovering}`);check(flashes===8&&colored===72&&runeViews===54,`identity flashes ${flashes} colored ${colored} rune ${runeViews}`);check(openSpreads===8,`open spread frames ${openSpreads}`);
for(const name of Object.keys(diffs))check(diffs[name]===80&&alphaDiffs[name]===80,`${name} distinction ${diffs[name]}/${alphaDiffs[name]}`);
for(const[field,relative]of[['artifactSha256',EN_E09_CLASPBOUND_PRIMER_GATE.artifact],['assembledArtifactSha256',EN_E09_CLASPBOUND_PRIMER_GATE.assembledArtifact],['comparisonArtifactSha256',EN_E09_CLASPBOUND_PRIMER_GATE.comparisonArtifact]])if(EN_E09_CLASPBOUND_PRIMER_GATE[field])check(await fileHash(relative)===EN_E09_CLASPBOUND_PRIMER_GATE[field],field+' drifted');
if(errors.length){console.error('Claspbound Primer check failed:');for(const error of errors)console.error('- '+error);process.exitCode=1;}else{console.log('Claspbound Primer private common candidate passes focused validation.');console.log(`- Structure: ${connected}/80 connected, ${hovering}/80 compact hover silhouettes, ${openSpreads}/8 connected open spreads`);console.log(`- Identity: ${colored}/72 colored, ${flashes}/8 white flashes, ${runeViews}/54 readable rune views, opaque ${minOpaque}-${maxOpaque}`);console.log('- Candidate frame digest: '+digests.candidate);console.log('- Protected: Epochforge, Whisperveil, Crownmaw exact; public 80/259; zero child assets/effects');}
