import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E06_NYMPH_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_MIST_WEAVER_GATE } from './enemy-expansion-en-e06-nymph-mist-weaver.js';

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; Object.freeze(value); for (const entry of Object.values(value)) deepFreeze(entry); return value; }

const COLORS = deepFreeze({
  skin: ['#e8c9bd', '#ad8179', '#ffe5d6'], hair: ['#184a62', '#0b2f45', '#4a8092'],
  gown: ['#247b91', '#165064', '#5bb1ba'], crown: ['#62c7d2', '#277d94', '#b6eff0'],
  royal: ['#705196', '#49346b', '#ab8bc5'], pearl: ['#e9e0b6', '#9c8f68', '#fff7d8'],
  sandal: ['#55415d', '#30283f', '#8d718f'], eye: '#18304d', flash: '#f4f4f4',
});
export const EN_E06_RIVERCROWN_MUSE_CONTRACT = deepFreeze({
  sliceId:'EN-E06', family:'nymph', variant:'rivercrown-muse', role:'elite',
  state:'implemented-complete-motion-approved', chassis:'slender-river-diadem-asymmetric-hair-draped-gown-nymph-v3',
  silhouette:'A graceful grounded Nymph elite with a vertical three-point river diadem, clear framed face, long asymmetrical river hair, open shoulders, pearl collar, diagonal royal sash, light ceremonial sleeves, and a flared split-foot gown. Elite presence comes from height, ornament, and deliberate gesture rather than armor-like bulk.',
  identity:'Pearl-warm skin, deep river hair, blue-green draped gown planes, luminous turquoise diadem cloth, violet royal sash, pale pearl fasteners, and dark sandals establish a self-contained Rivercrown Muse without baking in water, foam, droplets, ripples, currents, glow, or detached streamers.',
  effectBoundary:'Water arcs, river currents, foam, droplets, ground ripples, elemental flares, sparkles, glow, detached crown streamers, and impact flashes remain external.',
});
export const EN_E06_RIVERCROWN_MUSE_DATA = deepFreeze({
  actor:{species:'fey',bodyBuild:'slender-humanoid',skin:'pearl-warm',hairStyle:'long-asymmetric-river-hair',hairColor:'deep-river',expression:'regal-focus',faceDetail:'pointed-fey-ears',headgear:'three-point-river-diadem',outfit:'open-shoulder-diagonal-sash-flared-river-gown',outfitColor:'blue-green-violet-pearl',outfitTier:'tier3',weapon:'none',weaponTier:'none',shield:'none',shieldTier:'tier1',offhand:'none',palette:{skin:COLORS.skin,hair:COLORS.hair,outfit:COLORS.gown}},
  rivercrownMuse:COLORS,
  alphaPolicy:'binary-connected-three-point-diadem-framed-face-asymmetric-hair-open-shoulders-diagonal-sash-and-grounded-flared-gown',
  effectBoundary:'external-water-arcs-river-currents-foam-droplets-ground-ripples-elemental-flares-sparkles-glow-detached-crown-streamers-and-impact-flashes', bakedEffects:[],
});

export const EN_E06_RIVERCROWN_MUSE_GATE = deepFreeze({
  id:'en-e06-nymph-rivercrown-muse-full-v1', status:'approved', baseCheckpoint:'983b76ad14dcaf7c3151196763e481237fcbedb1',
  authorizedOn:'2026-08-10', authorizationEvidence:'After Mist Weaver was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: lets do nexr. Under the documented EN-E06 Nymph role order and one-complete-sprite cadence, this authorizes only one private elite Nymph Rivercrown Muse 80-frame candidate.',
  approvedOn:'2026-08-10', approvalEvidence:'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Elf Mage plus approved Spring Dancer and Mist Weaver comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: approived. Approval applies only to candidate digest 4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd and authorizes its bounded approval-record commit and branch publication; Nymph registration, fixtures, effects, release, EN-E07, and later work remain separate gates.', publishedImplementation:'39bd0658d53acbfe7aa4484e14f6518551720142',
  precedingApproval:{gateId:EN_E06_MIST_WEAVER_GATE.id,artifactSha256:EN_E06_MIST_WEAVER_GATE.artifactSha256,assembledArtifactSha256:EN_E06_MIST_WEAVER_GATE.assembledArtifactSha256,comparisonArtifactSha256:EN_E06_MIST_WEAVER_GATE.comparisonArtifactSha256,rawAnimationSha256:EN_E06_MIST_WEAVER_GATE.reviewAnimations.raw.sha256,completeBFormAnimationSha256:EN_E06_MIST_WEAVER_GATE.reviewAnimations.completeBForm.sha256,candidateFrameDigest:EN_E06_MIST_WEAVER_GATE.candidateFrameDigest,publishedImplementation:EN_E06_MIST_WEAVER_GATE.publishedImplementation,publishedHandoff:'983b76ad14dcaf7c3151196763e481237fcbedb1'},
  artifact:'enemy-expansion-review/en-e06-nymph-rivercrown-muse/en-e06-nymph-rivercrown-muse-full-suite-raw.png',artifactSha256:'1dfa2632a2949ce02316c6e26f7a033b67146cb8190edc510e41daeed36b4407',
  assembledArtifact:'enemy-expansion-review/en-e06-nymph-rivercrown-muse/en-e06-nymph-rivercrown-muse-full-suite-complete-b-form.png',assembledArtifactSha256:'5704a8b67c583728aab7b3ef1b4b79d67c75b4e779df3af0121aa7e406221471',
  comparisonArtifact:'enemy-expansion-review/en-e06-nymph-rivercrown-muse/en-e06-nymph-rivercrown-muse-elf-nymph-comparison.png',comparisonArtifactSha256:'6080fd9cdf91593d63244f3e06b82191cc27bb7e55efab8bee16f9f0734af90a',
  reviewAnimations:{raw:{artifact:'enemy-expansion-review/en-e06-nymph-rivercrown-muse/en-e06-nymph-rivercrown-muse-full-suite-four-directions-labeled.gif',sha256:'d72e5da8b6e0c96b573d81d75f50f2cd0e652286d9f6f05113bfe89e97d932bd',width:640,height:672,frames:4,durationMs:720},completeBForm:{artifact:'enemy-expansion-review/en-e06-nymph-rivercrown-muse/en-e06-nymph-rivercrown-muse-full-suite-four-directions-labeled-complete-b-form.gif',sha256:'9baf3c58541fbab1a3270e40145e401ac10a5c5d8c2e91ec96c2bc20f61fb496',width:640,height:672,frames:4,durationMs:720}},
  candidateFrameDigest:'4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd',elfMageComparisonDigest:'f5924562a9d264bf2950c324fc3b6eb0560391a39e81bf4bd8ab5ed9d5987679',springDancerComparisonDigest:'b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c',mistWeaverComparisonDigest:EN_E06_MIST_WEAVER_GATE.candidateFrameDigest,
  scope:'One complete 80-frame Rivercrown Muse elite Nymph across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract:'Idle counter-sways the vertical diadem, long hair, and diagonal sash. Walk uses four light processional steps with opposing hair, sleeve, hem, and foot lag. Attack gathers at the pearl collar, raises one ceremonial hand, opens only A3 into a two-handed river invocation, and narrows through a diagonal sash recovery. Hurt uses a complete white recoil and colored diadem-gown brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation:'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Elf Mage plus approved Spring Dancer and Mist Weaver silhouette comparison together.',
  exclusions:['changes to approved Spring Dancer source or pixels','changes to approved Mist Weaver source or pixels','changes to approved Fairy source or pixels','changes to approved Hag source or pixels','changes to approved Dryad source or pixels','changes to approved Redcap source or pixels','public Nymph registration','public catalog exposure','asset-pack fixture generation or regeneration','new Cast pixels','new Death pixels','water arcs','river currents','foam','droplets','ground ripples','elemental flares','sparkles','glow','detached crown streamers','impact flashes','effects','release','later EN-E06 integration','EN-E07 and later Wave 2 work'],
  nextGate:'The exact Rivercrown Muse candidate is visually approved and committed at 39bd0658d53acbfe7aa4484e14f6518551720142. Only its bounded approval-record commit and branch publication are authorized. After push, stop; do not register Nymph, generate fixtures, add effects, release, start EN-E07, or broaden Wave 2 without another explicit gate.',
});
export const EN_E06_RIVERCROWN_MUSE_DEATH_SOURCE_FRAMES=deepFreeze([0,1,1,1]);
const WALK_PHASES=deepFreeze([
  {name:'left-processional-step',idleFrame:0,step:-1,hairLag:1},
  {name:'diadem-sash-lift',idleFrame:1,step:0,lift:-1,hairLag:-1},
  {name:'right-processional-step',idleFrame:0,step:1,hairLag:-1},
  {name:'river-gown-settle',idleFrame:1,step:0,hairLag:1},
]);
const ATTACK_PHASES=deepFreeze([
  {name:'pearl-collar-gather',pose:'gather',idleFrame:0},
  {name:'single-hand-invocation-rise',pose:'lift',idleFrame:1,dy:-1},
  {name:'two-hand-river-invocation',pose:'invoke',idleFrame:0},
  {name:'diagonal-sash-recovery',pose:'recover',idleFrame:1},
]);
const HURT_PHASES=deepFreeze([
  {name:'white-diadem-recoil',pose:'hurt',idleFrame:0,flash:true},
  {name:'colored-diadem-gown-brace',pose:'brace',idleFrame:1,dy:-1,flash:false},
]);

function pixelCanvas(){
  const pixels=new Array(SIZE*SIZE).fill(null);
  return{pixels};
}

function paintFor(pixels){
  const rect=(x,y,w,h,fill)=>{
    for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++){
      assert(px>=0&&py>=0&&px<SIZE&&py<SIZE,'Rivercrown Muse authored pixels must remain inside the 24x24 cell.');
      pixels[(py*SIZE)+px]=fill;
    }
  };
  return{rect,dot(x,y,fill){rect(x,y,1,1,fill);}};
}

function drawFrontDiademAndHair(p,rear,phase,dy){
  const leftTip=(phase.step===-1||phase.hairLag===-1)?3:4;
  const rightTip=(phase.step===1||phase.hairLag===1)?3:4;

  // A vertical tiara reads as ornament rather than a broad hat.
  p.rect(11,2+dy,2,2,COLORS.crown[2]);
  p.rect(10,3+dy,4,2,COLORS.crown[0]);
  p.rect(8,4+dy,3,1,COLORS.crown[1]);
  p.rect(13,4+dy,3,1,COLORS.crown[1]);
  p.dot(8,leftTip+dy,COLORS.crown[2]);
  p.dot(15,rightTip+dy,COLORS.crown[2]);
  p.dot(10,4+dy,COLORS.pearl[2]);
  p.dot(13,4+dy,COLORS.pearl[0]);

  // Long asymmetric river hair frames the face and trails down one side.
  p.rect(8,5+dy,8,2,COLORS.hair[1]);
  p.rect(7,6+dy,10,2,COLORS.hair[0]);
  p.rect(6,7+dy,3,7,COLORS.hair[1]);
  p.rect(5,11+dy,3,5,COLORS.hair[0]);
  p.rect(5+(phase.hairLag||0),15+dy,3,2,COLORS.hair[2]);
  p.rect(15,7+dy,3,6,COLORS.hair[0]);
  p.rect(16,12+dy,2,3,COLORS.hair[2]);

  if(rear){
    p.rect(8,7+dy,8,5,COLORS.hair[1]);
    p.rect(9,11+dy,6,4,COLORS.hair[0]);
    p.rect(10,14+dy,4,3,COLORS.hair[2]);
    p.rect(4,14+dy,2,3,COLORS.hair[0]);
  }else{
    p.rect(9,7+dy,6,4,COLORS.skin[0]);
    p.rect(8,8+dy,2,2,COLORS.skin[1]);
    p.rect(14,8+dy,2,2,COLORS.skin[1]);
    p.dot(7,9+dy,COLORS.skin[2]);
    p.dot(16,9+dy,COLORS.skin[2]);
    p.rect(9,7+dy,2,1,COLORS.hair[2]);
    p.rect(13,7+dy,2,1,COLORS.hair[0]);
    p.dot(10,8+dy,COLORS.eye);
    p.dot(13,8+dy,COLORS.eye);
    p.rect(11,10+dy,2,1,COLORS.skin[1]);
  }
}

function drawFrontGown(p,phase,dy){
  const step=phase.step||0;
  p.rect(10,11+dy,4,1,COLORS.pearl[0]);
  p.dot(10,11+dy,COLORS.pearl[2]);
  p.dot(13,11+dy,COLORS.pearl[1]);
  p.rect(9,12+dy,6,4,COLORS.gown[1]);
  p.rect(10,12+dy,4,3,COLORS.gown[2]);

  // Diagonal royal sash keeps the torso narrow and gives the elite an upward rhythm.
  p.rect(9,13+dy,2,2,COLORS.royal[2]);
  p.rect(10,14+dy,2,2,COLORS.royal[0]);
  p.rect(11,15+dy,3,1,COLORS.royal[1]);
  p.dot(12,13+dy,COLORS.pearl[2]);

  // The gown opens gradually instead of forming a square block.
  p.rect(8,15+dy,8,2,COLORS.gown[0]);
  p.rect(7,17+dy,10,2,COLORS.gown[1]);
  p.rect(6,19+dy,12,2,COLORS.gown[0]);
  p.rect(5,20+dy,14,1,COLORS.gown[2]);
  p.rect(6,21+dy,12,1,COLORS.gown[0]);
  p.rect(11,18+dy,2,3,COLORS.royal[1]);

  // Connected sash tail supplies asymmetry without a detached effect.
  const tailY=(phase.idleFrame||0)+(phase.step===1?-1:0);
  p.rect(15,15+dy,3,2,COLORS.royal[0]);
  p.rect(17,16+dy+tailY,3,2,COLORS.royal[1]);
  p.rect(19,17+dy+tailY,2,2,COLORS.royal[2]);

  // Light split feet and sandals remain visible below the hem.
  const leftStep=Math.min(step,0),rightStep=Math.max(step,0);
  p.rect(7+leftStep,20+dy,3,2,COLORS.skin[1]);
  p.rect(14+rightStep,20+dy,3,2,COLORS.skin[0]);
  p.rect(6+leftStep,22+dy,4,1,COLORS.sandal[1]);
  p.rect(14+rightStep,22+dy,4,1,COLORS.sandal[0]);
  p.rect(7+leftStep,21+dy,2,1,COLORS.sandal[2]);
  p.rect(15+rightStep,21+dy,2,1,COLORS.sandal[2]);
}

function drawFrontArms(p,rear,phase,dy){
  const pose=phase.pose;
  const farSkin=rear?COLORS.skin[1]:COLORS.skin[0];
  const nearSkin=rear?COLORS.skin[2]:COLORS.skin[2];

  // Small lifted shoulder fins preserve open-shoulder Nymph anatomy.
  p.rect(7,11+dy,3,2,COLORS.crown[1]);
  p.dot(6,11+dy,COLORS.crown[2]);
  p.rect(14,11+dy,3,2,COLORS.crown[0]);
  p.dot(17,11+dy,COLORS.crown[2]);

  if(pose==='gather'){
    p.rect(7,12+dy,3,3,COLORS.royal[1]);
    p.rect(14,12+dy,3,3,COLORS.royal[0]);
    p.rect(9,14+dy,2,2,farSkin);
    p.rect(13,14+dy,2,2,nearSkin);
    p.rect(11,15+dy,2,1,COLORS.pearl[2]);
  }else if(pose==='lift'){
    p.rect(7,8+dy,3,5,COLORS.royal[1]);
    p.rect(8,6+dy,2,3,farSkin);
    p.dot(9,6+dy,COLORS.pearl[2]);
    p.rect(15,12+dy,2,4,COLORS.royal[0]);
    p.rect(16,15+dy,2,2,nearSkin);
  }else if(pose==='invoke'){
    p.rect(5,11+dy,4,2,COLORS.royal[1]);
    p.rect(2,10+dy,4,2,farSkin);
    p.dot(2,12+dy,COLORS.pearl[1]);
    p.rect(15,11+dy,4,2,COLORS.royal[0]);
    p.rect(18,10+dy,4,2,nearSkin);
    p.dot(21,12+dy,COLORS.pearl[2]);
  }else if(pose==='recover'||pose==='brace'){
    p.rect(7,12+dy,3,4,COLORS.royal[1]);
    p.rect(14,12+dy,3,4,COLORS.royal[0]);
    p.rect(9,14+dy,3,2,farSkin);
    p.rect(12,15+dy,3,2,nearSkin);
    p.dot(12,14+dy,COLORS.pearl[1]);
  }else{
    const leftLift=phase.step===-1?-1:0,rightLift=phase.step===1?-1:0;
    p.rect(7,12+dy+leftLift,2,4,COLORS.royal[1]);
    p.rect(6,15+dy+leftLift,3,2,COLORS.royal[2]);
    p.rect(6,17+dy+leftLift,2,1,farSkin);
    p.rect(15,12+dy+rightLift,2,4,COLORS.royal[0]);
    p.rect(15,15+dy+rightLift,3,2,COLORS.royal[2]);
    p.rect(17,17+dy+rightLift,2,1,nearSkin);
  }
}

function drawFront(p,rear,phase){
  const dy=phase.dy||phase.lift||0;
  drawFrontDiademAndHair(p,rear,phase,dy);
  drawFrontGown(p,phase,dy);
  drawFrontArms(p,rear,phase,dy);
}

function drawRightDiademAndHair(p,phase,dy){
  p.rect(13,2+dy,2,2,COLORS.crown[2]);
  p.rect(11,3+dy,5,2,COLORS.crown[0]);
  p.rect(9,4+dy,3,1,COLORS.crown[1]);
  p.dot(9,3+dy,COLORS.crown[2]);
  p.rect(15,4+dy,3,1,COLORS.crown[1]);
  p.dot(17,3+dy,COLORS.pearl[2]);

  p.rect(9,5+dy,8,2,COLORS.hair[1]);
  p.rect(7,6+dy,10,2,COLORS.hair[0]);
  p.rect(5,7+dy,6,7,COLORS.hair[1]);
  p.rect(4,11+dy,5,5,COLORS.hair[0]);
  p.rect(4+(phase.hairLag||0),15+dy,4,2,COLORS.hair[2]);
  p.rect(12,7+dy,6,4,COLORS.skin[0]);
  p.rect(17,8+dy,3,2,COLORS.skin[1]);
  p.dot(20,9+dy,COLORS.skin[2]);
  p.rect(12,7+dy,2,2,COLORS.hair[2]);
  p.dot(17,8+dy,COLORS.eye);
  p.dot(18,10+dy,COLORS.skin[1]);
}

function drawRightGown(p,phase,dy){
  const step=phase.step||0;
  p.rect(12,11+dy,4,1,COLORS.pearl[0]);
  p.dot(15,11+dy,COLORS.pearl[2]);
  p.rect(10,12+dy,7,4,COLORS.gown[1]);
  p.rect(12,12+dy,4,3,COLORS.gown[2]);
  p.rect(11,13+dy,2,2,COLORS.royal[2]);
  p.rect(12,14+dy,2,2,COLORS.royal[0]);
  p.rect(13,15+dy,3,1,COLORS.royal[1]);
  p.rect(9,15+dy,8,2,COLORS.gown[0]);
  p.rect(8,17+dy,10,2,COLORS.gown[1]);
  p.rect(7,19+dy,12,2,COLORS.gown[0]);
  p.rect(7,21+dy,12,1,COLORS.gown[2]);
  p.rect(15,15+dy,3,2,COLORS.royal[0]);
  p.rect(17,16+dy+(phase.idleFrame||0),3,2,COLORS.royal[1]);
  p.rect(19,17+dy+(phase.idleFrame||0),2,2,COLORS.royal[2]);
  const backStep=Math.min(step,0),frontStep=Math.max(step,0);
  p.rect(9+backStep,20+dy,3,2,COLORS.skin[1]);
  p.rect(15+frontStep,20+dy,3,2,COLORS.skin[0]);
  p.rect(8+backStep,22+dy,4,1,COLORS.sandal[1]);
  p.rect(15+frontStep,22+dy,4,1,COLORS.sandal[0]);
  p.rect(9+backStep,21+dy,2,1,COLORS.sandal[2]);
  p.rect(16+frontStep,21+dy,2,1,COLORS.sandal[2]);
}

function drawRightArms(p,phase,dy){
  const pose=phase.pose;
  p.rect(9,11+dy,3,2,COLORS.crown[1]);
  p.dot(8,11+dy,COLORS.crown[2]);
  p.rect(15,11+dy,3,2,COLORS.crown[0]);
  p.dot(18,11+dy,COLORS.crown[2]);
  if(pose==='gather'){
    p.rect(9,12+dy,3,4,COLORS.royal[1]);
    p.rect(14,12+dy,4,3,COLORS.royal[0]);
    p.rect(12,14+dy,2,2,COLORS.skin[1]);
    p.rect(16,14+dy,3,2,COLORS.skin[2]);
  }else if(pose==='lift'){
    p.rect(15,8+dy,3,5,COLORS.royal[0]);
    p.rect(17,6+dy,2,3,COLORS.skin[2]);
    p.dot(18,6+dy,COLORS.pearl[2]);
    p.rect(9,12+dy,3,4,COLORS.royal[1]);
    p.rect(9,15+dy,2,2,COLORS.skin[1]);
  }else if(pose==='invoke'){
    p.rect(9,12+dy,4,2,COLORS.royal[1]);
    p.rect(8,14+dy,3,2,COLORS.skin[1]);
    p.rect(16,10+dy,4,3,COLORS.royal[0]);
    p.rect(19,9+dy,4,2,COLORS.skin[2]);
    p.dot(22,11+dy,COLORS.pearl[2]);
  }else if(pose==='recover'||pose==='brace'){
    p.rect(9,12+dy,3,4,COLORS.royal[1]);
    p.rect(14,12+dy,4,4,COLORS.royal[0]);
    p.rect(12,14+dy,3,2,COLORS.skin[1]);
    p.rect(16,15+dy,3,2,COLORS.skin[2]);
  }else{
    const farLift=phase.step===-1?-1:0,nearLift=phase.step===1?-1:0;
    p.rect(9,12+dy+farLift,2,4,COLORS.royal[1]);
    p.rect(8,15+dy+farLift,3,2,COLORS.skin[1]);
    p.rect(16,12+dy+nearLift,2,4,COLORS.royal[0]);
    p.rect(17,15+dy+nearLift,3,2,COLORS.skin[2]);
  }
}

function drawRight(p,phase){
  const dy=phase.dy||phase.lift||0;
  drawRightDiademAndHair(p,phase,dy);
  drawRightGown(p,phase,dy);
  drawRightArms(p,phase,dy);
}
function phaseFor(animation,frame){if(animation==='idle'){assert(frame===0||frame===1,`Rivercrown Muse Idle frame ${frame} is out of range.`);return{name:frame?'diadem-sash-settle':'river-hair-poise',idleFrame:frame,hairLag:frame?1:-1};}if(animation==='walk')return WALK_PHASES[frame];if(animation==='attack'||animation==='cast')return ATTACK_PHASES[frame];if(animation==='hurt')return HURT_PHASES[frame];if(animation==='death')return HURT_PHASES[EN_E06_RIVERCROWN_MUSE_DEATH_SOURCE_FRAMES[frame]];return null;}
function buildPixels(direction,animation,frame){const phase=phaseFor(animation,frame);assert(phase,`Rivercrown Muse animation ${animation} frame ${frame} is out of range.`);const canonical=direction==='left'?'right':direction,source=pixelCanvas();let pixels=source.pixels;const p=paintFor(pixels);if(canonical==='right')drawRight(p,phase);else drawFront(p,canonical==='up',phase);if(phase.flash)pixels=pixels.map(color=>color===null?null:COLORS.flash);if(direction==='left'){const mirrored=new Array(SIZE*SIZE).fill(null);for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)mirrored[(y*SIZE)+(SIZE-1-x)]=pixels[(y*SIZE)+x];pixels=mirrored;}return{phase,pixels};}
export function renderEnE06RivercrownMuseFrame(context,direction,animation,frame){assert(context&&typeof context.fillRect==='function'&&typeof context.clearRect==='function','Rivercrown Muse rendering needs a 2D-like context.');assert(['down','left','right','up'].includes(direction),`Unsupported Rivercrown Muse direction ${direction}.`);context.clearRect(0,0,SIZE,SIZE);const{phase,pixels}=buildPixels(direction,animation,frame);for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){const color=pixels[(y*SIZE)+x];if(color!==null){context.fillStyle=color;context.fillRect(x,y,1,1);}}return Object.freeze({family:'nymph',variant:'rivercrown-muse',direction,animation,frame,phase:phase.name,rivercrownMuseGate:EN_E06_RIVERCROWN_MUSE_GATE.id,approvedPrecedingGate:EN_E06_MIST_WEAVER_GATE.id,alphaPolicy:EN_E06_RIVERCROWN_MUSE_DATA.alphaPolicy,effectBoundary:EN_E06_RIVERCROWN_MUSE_DATA.effectBoundary});}
export const EN_E06_RIVERCROWN_MUSE_RENDERER=deepFreeze({key:'en-e06-nymph-rivercrown-muse-v1',chassis:EN_E06_RIVERCROWN_MUSE_CONTRACT.chassis,render({family,variant,direction,animation,frame,context}){assert(family.id==='nymph','The EN-E06 Rivercrown Muse renderer is restricted to Nymph.');assert(variant.id==='rivercrown-muse','The EN-E06 Rivercrown Muse renderer is restricted to Rivercrown Muse.');return renderEnE06RivercrownMuseFrame(context,direction,animation.id,frame);}});
const RIVERCROWN_MUSE_VARIANT=deepFreeze({id:'rivercrown-muse',name:'Rivercrown Muse',role:EN_E06_RIVERCROWN_MUSE_CONTRACT.role,status:EN_E06_RIVERCROWN_MUSE_CONTRACT.state,brief:'A complete elite Nymph candidate with a vertical three-point river diadem, framed face, long asymmetrical hair, open shoulders, diagonal pearl sash, light ceremonial sleeves, and a flared split-foot gown; water, foam, ripples, glow, and detached streamers remain external.',rendererData:EN_E06_RIVERCROWN_MUSE_DATA});
export const EN_E06_RIVERCROWN_MUSE_FAMILY=deepFreeze({id:'nymph',name:'Nymph Rivercrown Muse Review',sliceId:'EN-E06',state:ENEMY_EXPANSION_STATES.IMPLEMENTED,chassis:EN_E06_RIVERCROWN_MUSE_CONTRACT.chassis,rendererKey:EN_E06_RIVERCROWN_MUSE_RENDERER.key,variants:[RIVERCROWN_MUSE_VARIANT],rendererData:{contractCard:EN_E06_NYMPH_CONTRACT_CARD.id,approvedPrecedingGate:EN_E06_MIST_WEAVER_GATE.id,activeGate:EN_E06_RIVERCROWN_MUSE_GATE.id},review:{baselineVariant:'rivercrown-muse',scale:8,notes:'Awaiting visual approval for one complete grounded Rivercrown Muse against public Elf Mage and approved Spring Dancer and Mist Weaver. Keep registration, fixtures, effects, release, and later Wave 2 work separate.'}});
export const EN_E06_RIVERCROWN_MUSE_REGISTRY=createEnemyExpansionRegistry({renderers:[EN_E06_RIVERCROWN_MUSE_RENDERER],families:[EN_E06_RIVERCROWN_MUSE_FAMILY]});
