(function(){
"use strict";
const MODELS = SITE.models;
const S = SITE.scores;
const RIDS = ["horror","animation","mograph","ugc"];
const CREDIT_USD = 0.05;
const CRIT = [
  ["p","Prompt","Did it follow the brief: every shot, line and beat in the right order?"],
  ["v","Visuals","Image quality and motion: does it look real or intentional, and move naturally?"],
  ["c","Consistency","Do characters, products and places stay the same from shot to shot?"],
  ["a","Audio","Dialogue, sound effects and music: present, in sync and right for the scene?"],
  ["e","Feel","Did it land the round's goal: the scare, the laugh, the clarity, the trust?"]
];
const REF_FILES = {
  "@Guard":"horror-guard","@Sasabonsam":"horror-sasabonsam","@SasabonsamFace":"horror-sasabonsam-face",
  "@Legs":"horror-legs","@Corridor":"horror-corridor","@Yaw":"animation-yaw","@Esi":"animation-esi",
  "@OxfordStreet":"animation-oxford-street","@Creator":"ugc-creator","@Cleanser":"ugc-cleanser"
};
const AVAILABLE_REFS = new Set(["horror-guard","horror-sasabonsam","horror-sasabonsam-face","horror-legs","horror-corridor","animation-yaw","animation-esi","animation-oxford-street"]);

/* prompt builder, same logic as the shoot-day kit */
function tc(s){ return "0:" + String(s).padStart(2,"0"); }
const TIERS = [
  {id:"t30", label:"30 sec · 1 generation", groups:[[0,1,2,3,4,5]]},
  {id:"t15", label:"15 sec × 2 generations", groups:[[0,1,2],[3,4,5]]},
  {id:"t10", label:"10 sec × 3 generations", groups:[[0,1],[2,3],[4,5]]}
];
const UGC_TIERS = [
  {id:"u15", label:"15 sec · 1 generation", groups:[[0,1,2]], models:["kling40","seedance25","wan30","seedance20","minimaxh3","grok15","flux3"]},
  {id:"u10", label:"10 sec + 5 sec · 2 generations", groups:[[0,1],[2]], models:["gemini11"]}
];
function tiersFor(r){ return r.id==="ugc" ? UGC_TIERS : TIERS.map(t=>Object.assign({models:MODELS.filter(m=>m.tier===t.id).map(m=>m.id)}, t)); }
function partPrompt(r, tier, p){
  const n = tier.groups.length, total = r.beats.length*5;
  const words = ["zero","one","two","three","four","five","six"];
  let head = r.style + " Aspect ratio " + r.aspect + ".";
  if (n === 1) head += " A " + total + "-second film in " + words[r.beats.length] + " shots, following these timecodes:";
  else {
    head += " This is part " + (p+1) + " of " + n + " of a " + total + "-second film; this part is " + (tier.groups[p].length*5) + " seconds.";
    head += p === 0 ? " Follow these timecodes:" : " Use @Previous, the last frame of the previous part, as the first frame of this shot: same characters, location, lighting, lens and camera style. Do not restart the scene. The shot opens on " + r.opens[tier.groups[p][0]] + " Follow these timecodes:";
  }
  const lines = tier.groups[p].map((bi,i)=>"[" + tc(i*5) + "–" + tc((i+1)*5) + "] " + r.beats[bi]);
  return head + "\n\n" + lines.join("\n");
}
function soundFor(r){ return r.id==="horror" ? "\n\n" + SOUND_H : ""; }

/* helpers */
const $ = (s,el=document)=>el.querySelector(s);
const h = (tag, attrs={}, ...kids)=>{
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (v==null || v===false) continue;
    if (k==="class") el.className = v;
    else if (k==="text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v===true ? "" : v);
  }
  for (const k of kids.flat()) if (k!=null) el.append(k.nodeType ? k : document.createTextNode(k));
  return el;
};
const name = id => MODELS.find(m=>m.id===id).name;
const sum = s => s.p+s.v+s.c+s.a+s.e;
const usd = c => "$" + (c*CREDIT_USD).toFixed(2).replace(/\.00$/,"");
const store = {
  get(){ try { return JSON.parse(localStorage.getItem("8vs1-mine")||"{}"); } catch(e){ return {}; } },
  set(v){ try { localStorage.setItem("8vs1-mine", JSON.stringify(v)); } catch(e){} }
};
let mine = store.get();
function toast(msg){
  const t = h("div",{class:"toast",role:"status",text:msg});
  document.body.append(t); setTimeout(()=>t.remove(), 1800);
}

/* links */
document.querySelectorAll("[data-link]").forEach(a=>{
  const url = LINKS[a.dataset.link];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  else if (a.dataset.link==="channel") a.removeAttribute("href");
  else a.hidden = true;
});

/* criteria */
$(".crit").append(...CRIT.map(([,label,desc])=>h("div",{},h("dt",{text:label}),h("dd",{text:desc}))));

/* lightbox */
const lb = $("#lightbox");
function openRef(src, cap){
  $("img",lb).src = src; $("img",lb).alt = cap; $(".cap",lb).textContent = cap;
  lb.showModal();
}
lb.addEventListener("click", e=>{ if (e.target===lb) lb.close(); });

/* rounds */
const roundsEl = $("#rounds");
const rnav = h("nav",{class:"round-nav","aria-label":"Rounds"});
roundsEl.append(rnav);

ROUNDS.forEach((r, ri)=>{
  const title = r.name.split("·")[1].trim();
  rnav.append(h("a",{href:"#r-"+r.id,text:title}));
  const sec = h("article",{class:"round wrap",id:"r-"+r.id});
  const briefs = {
    horror:"A night guard walks a dark wooden corridor with his flashlight. Above him, a Sasabonsam waits in the rafters. Six shots, one scare, and the creature must look like the references.",
    animation:"Yaw tries his best line on Esi at a coconut cart on Oxford Street, Osu. A 2D comedy beat that lives or dies on timing and on the characters staying on-model.",
    mograph:"Explain ikigai in 30 seconds with paper collage, perfect geometry and on-screen words that must be spelled right. No reference images: words only.",
    ugc:"A creator films a 15-second selfie review of Nkwa, a fictional cleanser, in her own home. Vertical, real-looking, and the label has to read NKWA every time."
  };
  sec.append(h("header",{class:"round-head"},
    h("div",{}, h("span",{class:"round-num",text:"Round "+(ri+1)+" of 4 · "+r.aspect}), h("h2",{text:title+": "+r.film})),
    h("p",{text:briefs[r.id]})
  ));

  /* references */
  const refBox = h("div",{class:"panel-sage"}, h("h3",{text:"Reference images"}));
  if (!r.refs.length) refBox.append(h("p",{class:"no-refs",text:"None. Every model got the same written prompt and nothing else."}));
  else {
    const grid = h("div",{class:"refs"});
    r.refs.forEach(([tag,desc])=>{
      const file = REF_FILES[tag];
      if (AVAILABLE_REFS.has(file)) {
        const src = "/refs/"+file+".jpg";
        grid.append(h("button",{class:"ref",type:"button","aria-label":"Enlarge "+tag+": "+desc,onclick:()=>openRef(src, tag+" · "+desc)},
          h("img",{src,alt:"",loading:"lazy",width:1200,height:896}), h("span",{text:tag})));
      } else grid.append(h("div",{class:"ref-missing"},h("div",{},h("strong",{text:tag}),h("br"),"Image coming soon")));
    });
    refBox.append(grid);
  }
  refBox.append(h("p",{class:"ref-note",text:r.refNote}));

  /* prompts */
  const tiers = tiersFor(r);
  const promptBox = h("div",{class:"panel-dark"}, h("h3",{text:"The exact prompts"}));
  const tabs = h("div",{class:"prompt-tabs",role:"tablist","aria-label":"Prompt format"});
  const pane = h("div",{role:"tabpanel"});
  function showTier(i){
    [...tabs.children].forEach((b,j)=>{ b.setAttribute("aria-selected", i===j); b.tabIndex = i===j?0:-1; });
    const t = tiers[i];
    pane.replaceChildren(h("p",{class:"tab-models",text:"Used by "+t.models.map(name).join(", ")}));
    t.groups.forEach((g,p)=>{
      const txt = partPrompt(r,t,p) + soundFor(r);
      pane.append(h("div",{class:"part"},
        h("div",{class:"part-head"},
          h("strong",{text: t.groups.length>1 ? "Part "+(p+1)+" of "+t.groups.length : "Full prompt"}),
          h("button",{class:"copy",type:"button",onclick:async e=>{
            try { await navigator.clipboard.writeText(txt); toast("Prompt copied"); }
            catch(err){ toast("Couldn't copy. Select the text instead."); }
          },text:"Copy"})),
        h("pre",{text:txt})));
    });
  }
  tiers.forEach((t,i)=>tabs.append(h("button",{type:"button",role:"tab",text:t.label,onclick:()=>showTier(i),
    onkeydown:e=>{ if(e.key==="ArrowRight"||e.key==="ArrowLeft"){ const n=(i+(e.key==="ArrowRight"?1:-1)+tiers.length)%tiers.length; showTier(n); tabs.children[n].focus(); } }})));
  promptBox.append(tabs, pane); showTier(0);
  sec.append(h("div",{class:"prep"}, refBox, promptBox));

  /* films, ranked */
  const order = MODELS.map(m=>m.id).sort((a,b)=>sum(S[r.id][b])-sum(S[r.id][a]));
  const grid = h("div",{class:"films"});
  let prevTotal=null, rank=0;
  order.forEach((id,i)=>{
    const s = S[r.id][id], tot = sum(s);
    if (tot!==prevTotal) { rank = i+1; prevTotal = tot; }
    grid.append(filmCard(r, id, s, tot, rank));
  });
  sec.append(grid);
  roundsEl.append(sec);
});

function filmCard(r, id, s, tot, rank){
  const fid = FILMS[r.id][id];
  const player = h("div",{class:"player"+(r.aspect==="9:16"?" vertical":"")});
  if (fid===null) player.append(h("div",{class:"no-film"},h("div",{},h("strong",{text:"No film"}),"FLUX 3 refused this prompt on content grounds.")));
  else if (!fid) player.append(h("div",{class:"no-film"},h("div",{},h("strong",{text:"Film coming soon"}),"It'll play right here once it's uploaded.")));
  else {
    const btn = h("button",{class:"play",type:"button","aria-label":"Play "+name(id)+"'s "+r.film,
      style:"background-image:url('https://drive.google.com/thumbnail?id="+fid+"&sz=w800')"}, h("span"));
    btn.addEventListener("click",()=>{
      player.replaceChildren(h("iframe",{src:"https://drive.google.com/file/d/"+fid+"/preview",allow:"autoplay; fullscreen",allowfullscreen:true,title:name(id)+": "+r.film}));
    });
    player.append(btn);
  }
  const bars = h("div",{class:"bars"}, CRIT.map(([k,label])=>h("div",{class:"bar"},
    h("span",{text:label}),
    h("span",{class:"dots","aria-hidden":"true"}, [0,1,2,3,4].map(n=>h("i",{class:n<s[k]?"on":null}))),
    h("b",{text:s[k],"aria-label":label+" "+s[k]+" out of 5"}))));
  const t = tiersFor(r).find(t=>t.models.includes(id));
  const gens = t.groups.length;
  const meta = (gens===1 ? "1 generation" : gens+" generations") + " · " + (s.credits ? s.credits+" credits ("+usd(s.credits)+")" : "no credits charged");

  /* score it yourself */
  const key = r.id+"__"+id;
  const my = h("div",{class:"my-grid"});
  const myTotal = h("p",{class:"my-total"});
  function paintMine(){
    const m = mine[key]||{};
    my.querySelectorAll(".stars").forEach(row=>{
      row.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed", String(m[row.dataset.k]===+b.value)));
    });
    const done = CRIT.filter(([k])=>typeof m[k]==="number");
    myTotal.textContent = done.length ? "Your score: "+done.reduce((a,[k])=>a+m[k],0)+" / 25"+(done.length<5?" so far":"")+" · Joshua gave it "+tot : "Tap a number for each category.";
  }
  CRIT.forEach(([k,label])=>{
    const row = h("div",{class:"stars",role:"group","aria-label":label,"data-k":k});
    for (let n=0;n<=5;n++) row.append(h("button",{type:"button",value:n,text:n,"aria-label":label+" "+n,"aria-pressed":"false",onclick:()=>{
      mine[key] = Object.assign({}, mine[key], {[k]:n}); store.set(mine); paintMine(); renderMine();
    }}));
    my.append(h("div",{class:"my-row"},h("span",{text:label}),row));
  });
  paintMine();

  return h("article",{class:"film"}, player,
    h("div",{class:"film-body"},
      h("div",{class:"film-top"},
        h("span",{class:"rank"+(rank===1?" first":""),text:rank,"aria-label":"Ranked "+rank}),
        h("h4",{text:name(id)}),
        h("span",{class:"total"},String(tot),h("small",{text:" / 25"}))),
      bars,
      h("p",{class:"note",text:s.note}),
      h("p",{class:"meta",text:meta}),
      h("details",{class:"mine-score"},h("summary",{text:"Score it yourself"}),my,myTotal)
    ));
}

/* round nav highlight */
const rLinks = [...rnav.children];
const io = new IntersectionObserver(es=>es.forEach(e=>{
  if (e.isIntersecting) rLinks.forEach(a=>a.setAttribute("aria-current", a.hash==="#"+e.target.id));
}),{rootMargin:"-40% 0px -55% 0px"});
document.querySelectorAll(".round").forEach(s=>io.observe(s));

/* results: race */
const cum = RIDS.map((_,i)=>Object.fromEntries(MODELS.map(m=>[m.id, RIDS.slice(0,i+1).reduce((a,r)=>a+sum(S[r][m.id]),0)])));
const seg = $(".seg"), list = $(".race-list");
const segLabels = ["After horror","After animation","After motion graphics","Final"];
const rows = {};
MODELS.forEach(m=>{
  rows[m.id] = h("li",{class:"race-row"}, h("span",{class:"pos"}), h("span",{class:"who",text:m.name}),
    h("span",{class:"track"},h("span")), h("span",{class:"pts"}), h("span",{class:"move"}));
});
function rankOf(obj){ const o = Object.keys(obj).sort((a,b)=>obj[b]-obj[a]); return Object.fromEntries(o.map(id=>[id, o.findIndex(x=>obj[x]===obj[id])+1])); }
function showRace(i){
  [...seg.children].forEach((b,j)=>{ b.setAttribute("aria-selected", i===j); b.tabIndex = i===j?0:-1; });
  const now = cum[i], rk = rankOf(now), prev = i ? rankOf(cum[i-1]) : null;
  const max = 25*(i+1);
  const order = Object.keys(now).sort((a,b)=>now[b]-now[a]);
  list.replaceChildren(...order.map(id=>{
    const row = rows[id];
    row.classList.toggle("lead", rk[id]===1);
    row.children[0].textContent = rk[id];
    $(".track span",row).style.width = (now[id]/max*100)+"%";
    row.children[3].textContent = now[id];
    const mv = row.children[4];
    if (!prev || prev[id]===rk[id]) { mv.textContent = prev ? "=" : ""; mv.className="move"; }
    else { const d = prev[id]-rk[id]; mv.textContent = (d>0?"▲":"▼")+Math.abs(d); mv.className = "move "+(d>0?"up":"down"); mv.setAttribute("aria-label", (d>0?"up ":"down ")+Math.abs(d)); }
    return row;
  }));
}
segLabels.forEach((l,i)=>seg.append(h("button",{type:"button",role:"tab",text:l,onclick:()=>showRace(i),
  onkeydown:e=>{ if(e.key==="ArrowRight"||e.key==="ArrowLeft"){ const n=(i+(e.key==="ArrowRight"?1:-1)+4)%4; showRace(n); seg.children[n].focus(); } }})));
showRace(3);

/* results: categories */
const finalOrder = Object.keys(cum[3]).sort((a,b)=>cum[3][b]-cum[3][a]);
const catTot = id => Object.fromEntries(CRIT.map(([k])=>[k, RIDS.reduce((a,r)=>a+S[r][id][k],0)]));
const cats = $(".cats");
cats.append(h("thead",{},h("tr",{},h("th",{text:"Model"}),CRIT.map(([,l])=>h("th",{class:"n",text:l})))));
const best = Object.fromEntries(CRIT.map(([k])=>[k, Math.max(...MODELS.map(m=>catTot(m.id)[k]))]));
cats.append(h("tbody",{}, finalOrder.map(id=>{
  const ct = catTot(id);
  return h("tr",{},h("td",{text:name(id)}), CRIT.map(([k])=>h("td",{class:"n"+(ct[k]===best[k]?" best":""),text:ct[k],
    style:"background:rgba(127,180,58,"+(ct[k]/20*0.55).toFixed(2)+")"})));
})));

/* results: value */
const credOf = id => RIDS.reduce((a,r)=>a+S[r][id].credits,0);
const val = $(".value");
val.append(h("thead",{},h("tr",{},h("th",{text:"Model"}),h("th",{class:"n",text:"Points"}),h("th",{class:"n",text:"Cost"}),h("th",{class:"n",text:"Points per $"}))));
const ppd = id => cum[3][id]/(credOf(id)*CREDIT_USD);
const bestV = Math.max(...MODELS.map(m=>ppd(m.id)));
val.append(h("tbody",{}, [...finalOrder].sort((a,b)=>ppd(b)-ppd(a)).map(id=>h("tr",{},
  h("td",{text:name(id)}), h("td",{class:"n",text:cum[3][id]}), h("td",{class:"n",text:usd(credOf(id))}),
  h("td",{class:"n"+(ppd(id)===bestV?" best":""),text:ppd(id).toFixed(1)})))));

/* your leaderboard */
function myTotals(){
  const t = {};
  for (const [key,m] of Object.entries(mine)) {
    const id = key.split("__")[1];
    const v = CRIT.reduce((a,[k])=>a+(typeof m[k]==="number"?m[k]:0),0);
    const n = CRIT.some(([k])=>typeof m[k]==="number");
    if (!n) continue;
    t[id] = t[id] || {pts:0, films:0}; t[id].pts += v; t[id].films++;
  }
  return t;
}
function renderMine(){
  const t = myTotals(), ids = Object.keys(t).sort((a,b)=>t[b].pts-t[a].pts);
  $(".mine-empty").hidden = ids.length>0;
  $("#clear-mine").hidden = !ids.length;
  $(".mine-list").replaceChildren(...ids.map((id,i)=>h("li",{},
    h("span",{class:"pos",text:i+1}), h("span",{text:name(id)}),
    h("span",{class:"vs",text:t[id].films+" of 4 films scored · Joshua: "+cum[3][id]}),
    h("span",{class:"pts",text:t[id].pts}))));
}
$("#clear-mine").addEventListener("click",()=>{
  mine = {}; store.set(mine); renderMine();
  document.querySelectorAll(".stars button").forEach(b=>b.setAttribute("aria-pressed","false"));
  document.querySelectorAll(".my-total").forEach(p=>p.textContent="Tap a number for each category.");
  toast("Your scores are cleared");
});
renderMine();

$("#dl-mine").addEventListener("click",()=>{
  const lines = [["Round","Model",...CRIT.map(c=>c[1]),"Your total","Joshua's total"].join(",")];
  ROUNDS.forEach(r=>MODELS.forEach(m=>{
    const s = mine[r.id+"__"+m.id]||{};
    const vals = CRIT.map(([k])=>typeof s[k]==="number"?s[k]:"");
    const tot = vals.some(v=>v!=="") ? vals.reduce((a,v)=>a+(v===""?0:v),0) : "";
    lines.push([r.name.split("·")[1].trim(), m.name, ...vals, tot, sum(S[r.id][m.id])].join(","));
  }));
  const a = h("a",{href:URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/csv"})),download:"my-8vs1-scores.csv"});
  document.body.append(a); a.click(); a.remove();
});
})();
