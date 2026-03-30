import { useState, useRef, useEffect } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const T = {
  bg:"#08080A",surface:"#101013",card:"#16161A",border:"#252529",
  gold:"#C9A84C",goldDim:"#8B7A3A",accent:"#40C9A2",accentDim:"#2A9B78",
  text:"#E8E4DC",textMid:"#A09D95",textDim:"#6B6860",
  red:"#C45B5B",green:"#4CAF6E",blue:"#5B8EC4",orange:"#D4935B",purple:"#9B6BC4",teal:"#40C9A2",yellow:"#D4C35B",
};
const serif="'Cormorant Garamond',Georgia,serif";
const sans="'DM Sans',system-ui,sans-serif";
const MEALS=[{id:"breakfast",label:"Breakfast",icon:"🌅"},{id:"lunch",label:"Lunch",icon:"☀️"},{id:"snacks",label:"Snacks",icon:"🍪"},{id:"dinner",label:"Dinner",icon:"🌙"},{id:"others",label:"Others",icon:"➕"}];

function getHealth(it){if(!it)return{l:"moderate",c:T.yellow};const p=it.protein||0,f=it.fat||0,s=it.sugar||0,fi=it.fiber||0,cal=it.calories||0;if(p>15&&fi>3&&s<8&&f<15)return{l:"healthy",c:T.green};if(s>20||f>25||(cal>400&&p<10))return{l:"unhealthy",c:T.red};return{l:"moderate",c:T.yellow};}

const SYS=`You are a precision nutrition engine for TRIVENI. You have web search. For EVERY food item, search USDA FoodData Central, Nutritionix, CalorieKing, or IFCT/NIN. Return ONLY a JSON array: {"name":string,"quantity":string,"grams":number,"source":string,"calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"saturated_fat":number,"trans_fat":number,"cholesterol":number,"sodium":number,"potassium":number,"calcium":number,"iron":number,"vitamin_a":number,"vitamin_c":number,"vitamin_d":number,"vitamin_b12":number,"magnesium":number,"zinc":number,"phosphorus":number,"category":string} JSON array ONLY.`;
const SEARCH_SYS=`You are a food database for TRIVENI. You have web search. Return 6-8 variations with full nutrition from USDA/Nutritionix/IFCT. Same JSON format. JSON array ONLY.`;
const IMG_SYS=`You are a nutrition engine with vision for TRIVENI. You have web search. Identify foods, search web, return JSON array with grams. JSON array ONLY.`;

function ensureN(it){const k=["calories","protein","carbs","fat","fiber","sugar","saturated_fat","trans_fat","cholesterol","sodium","potassium","calcium","iron","vitamin_a","vitamin_c","vitamin_d","vitamin_b12","magnesium","zinc","phosphorus","grams"];const o={...it};k.forEach(x=>{o[x]=Number(o[x])||0;});return o;}

const MICROS=[{key:"cholesterol",label:"Cholesterol",unit:"mg",dv:300,color:T.orange},{key:"potassium",label:"Potassium",unit:"mg",dv:4700,color:T.teal},{key:"calcium",label:"Calcium",unit:"mg",dv:1000,color:"#E8E4DC"},{key:"iron",label:"Iron",unit:"mg",dv:18,color:T.red},{key:"vitamin_a",label:"Vit A",unit:"mcg",dv:900,color:T.orange},{key:"vitamin_c",label:"Vit C",unit:"mg",dv:90,color:T.yellow},{key:"vitamin_d",label:"Vit D",unit:"mcg",dv:20,color:T.gold},{key:"vitamin_b12",label:"B12",unit:"mcg",dv:2.4,color:T.red},{key:"magnesium",label:"Magnesium",unit:"mg",dv:420,color:T.green},{key:"zinc",label:"Zinc",unit:"mg",dv:11,color:T.blue},{key:"phosphorus",label:"Phosphorus",unit:"mg",dv:1250,color:T.purple}];

const FREQ=[
  {name:"Masala Omelette",quantity:"1 Egg",grams:81,calories:102,protein:7,carbs:1,fat:8,fiber:0,sugar:1,category:"Protein",saturated_fat:2.5,trans_fat:0,cholesterol:186,sodium:150,potassium:70,calcium:28,iron:1,vitamin_a:80,vitamin_c:0,vitamin_d:1,vitamin_b12:0.5,magnesium:6,zinc:0.6,phosphorus:99,source:"IFCT"},
  {name:"Apple",quantity:"1 Piece",grams:169,calories:96,protein:0.5,carbs:25,fat:0.3,fiber:4,sugar:19,category:"Fruit",saturated_fat:0,trans_fat:0,cholesterol:0,sodium:2,potassium:195,calcium:10,iron:0.2,vitamin_a:5,vitamin_c:8,vitamin_d:0,vitamin_b12:0,magnesium:9,zinc:0.1,phosphorus:20,source:"USDA"},
  {name:"Chicken Biryani",quantity:"1 Bowl",grams:200,calories:346,protein:18,carbs:42,fat:12,fiber:1,sugar:2,category:"Meal",saturated_fat:3,trans_fat:0,cholesterol:55,sodium:520,potassium:220,calcium:30,iron:2,vitamin_a:15,vitamin_c:3,vitamin_d:0,vitamin_b12:0.3,magnesium:30,zinc:2,phosphorus:180,source:"IFCT"},
  {name:"Bread Slice",quantity:"1 Slice",grams:27,calories:72,protein:2.5,carbs:13,fat:1,fiber:0.7,sugar:1.5,category:"Carb",saturated_fat:0.2,trans_fat:0,cholesterol:0,sodium:130,potassium:35,calcium:40,iron:1,vitamin_a:0,vitamin_c:0,vitamin_d:0,vitamin_b12:0,magnesium:7,zinc:0.2,phosphorus:25,source:"USDA"},
  {name:"Paneer Tikka",quantity:"4 Pcs",grams:120,calories:265,protein:18,carbs:5,fat:20,fiber:0.5,sugar:2,category:"Protein",saturated_fat:10,trans_fat:0,cholesterol:60,sodium:380,potassium:100,calcium:350,iron:0.5,vitamin_a:80,vitamin_c:2,vitamin_d:0,vitamin_b12:0.8,magnesium:20,zinc:1.5,phosphorus:280,source:"IFCT"},
  {name:"Banana",quantity:"1 Medium",grams:118,calories:105,protein:1.3,carbs:27,fat:0.4,fiber:3,sugar:14,category:"Fruit",saturated_fat:0,trans_fat:0,cholesterol:0,sodium:1,potassium:422,calcium:6,iron:0.3,vitamin_a:4,vitamin_c:10,vitamin_d:0,vitamin_b12:0,magnesium:32,zinc:0.2,phosphorus:26,source:"USDA"},
  {name:"Dal Tadka",quantity:"1 Bowl",grams:180,calories:150,protein:9,carbs:20,fat:4,fiber:5,sugar:2,category:"Protein",saturated_fat:0.5,trans_fat:0,cholesterol:0,sodium:400,potassium:350,calcium:30,iron:3,vitamin_a:5,vitamin_c:2,vitamin_d:0,vitamin_b12:0,magnesium:40,zinc:1.5,phosphorus:150,source:"IFCT"},
  {name:"Whey Protein",quantity:"1 Scoop",grams:32,calories:120,protein:24,carbs:3,fat:1.5,fiber:0,sugar:1,category:"Protein",saturated_fat:0.5,trans_fat:0,cholesterol:35,sodium:130,potassium:160,calcium:120,iron:0.5,vitamin_a:0,vitamin_c:0,vitamin_d:0,vitamin_b12:0.3,magnesium:20,zinc:2,phosphorus:100,source:"Nutritionix"},
  {name:"Watermelon",quantity:"1 Bowl",grams:100,calories:30,protein:0.6,carbs:8,fat:0.2,fiber:0.4,sugar:6,category:"Fruit",saturated_fat:0,trans_fat:0,cholesterol:0,sodium:1,potassium:112,calcium:7,iron:0.2,vitamin_a:28,vitamin_c:8,vitamin_d:0,vitamin_b12:0,magnesium:10,zinc:0.1,phosphorus:11,source:"USDA"},
  {name:"Chicken Tandoori",quantity:"1 Piece",grams:137,calories:218,protein:22,carbs:4,fat:13,fiber:0.5,sugar:1,category:"Protein",saturated_fat:3.5,trans_fat:0,cholesterol:85,sodium:420,potassium:250,calcium:20,iron:1.5,vitamin_a:30,vitamin_c:2,vitamin_d:0,vitamin_b12:0.5,magnesium:25,zinc:2,phosphorus:200,source:"IFCT"},
  {name:"Pineapple",quantity:"1 Bowl",grams:100,calories:50,protein:0.5,carbs:13,fat:0.1,fiber:1.4,sugar:10,category:"Fruit",saturated_fat:0,trans_fat:0,cholesterol:0,sodium:1,potassium:109,calcium:13,iron:0.3,vitamin_a:3,vitamin_c:48,vitamin_d:0,vitamin_b12:0,magnesium:12,zinc:0.1,phosphorus:8,source:"USDA"},
  {name:"Chicken Tikka",quantity:"1 Piece",grams:44,calories:78,protein:9,carbs:2,fat:4,fiber:0.2,sugar:0.5,category:"Protein",saturated_fat:1,trans_fat:0,cholesterol:30,sodium:180,potassium:90,calcium:10,iron:0.5,vitamin_a:10,vitamin_c:1,vitamin_d:0,vitamin_b12:0.2,magnesium:10,zinc:0.8,phosphorus:80,source:"IFCT"},
];

const QCATS=[{e:"🥚",l:"Eggs"},{e:"🍗",l:"Chicken"},{e:"🍚",l:"Rice"},{e:"🫘",l:"Dal"},{e:"🥛",l:"Milk"},{e:"🍌",l:"Banana"},{e:"🥜",l:"Nuts"},{e:"🍞",l:"Roti"},{e:"🥗",l:"Salad"},{e:"🐟",l:"Fish"},{e:"🧀",l:"Paneer"},{e:"🥣",l:"Oats"},{e:"💪",l:"Whey"},{e:"🍎",l:"Apple"},{e:"🧈",l:"Ghee"},{e:"🍠",l:"Sweet Potato"}];

async function callAPI(sys,msgs){const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:sys,messages:msgs,tools:[{type:"web_search_20250305",name:"web_search"}]})});const d=await r.json();const t=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");const m=t.match(/\[[\s\S]*\]/);if(!m)throw new Error("No data");return JSON.parse(m[0].replace(/```json|```/g,"").trim());}

function Dot({item}){const h=getHealth(item);return <span style={{width:8,height:8,borderRadius:"50%",background:h.c,display:"inline-block",flexShrink:0}}/>;}

function ScoreRing({items}){const n=items.length;if(!n)return(<div style={{width:60,height:60,borderRadius:"50%",border:`3px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,color:T.textDim}}>?</span><span style={{fontSize:7,color:T.textDim}}>Score</span></div>);const h=items.filter(i=>getHealth(i).l==="healthy").length;const s=Math.round((h/n)*100);const c=s>=70?T.green:s>=40?T.yellow:T.red;const r=23,ci=2*Math.PI*r;return(<div style={{position:"relative",width:60,height:60}}><svg width={60} height={60} style={{transform:"rotate(-90deg)"}}><circle cx={30} cy={30} r={r} fill="none" stroke={T.border} strokeWidth={4}/><circle cx={30} cy={30} r={r} fill="none" stroke={c} strokeWidth={4} strokeDasharray={ci} strokeDashoffset={ci*(1-s/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:14,fontWeight:700,color:c}}>{s}</span><span style={{fontSize:7,color:T.textDim}}>Score</span></div></div>);}

function MRing({value,max,color,label,size=48}){const p=Math.min(value/(max||1),1),r=(size-7)/2,ci=2*Math.PI*r;return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={3}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={ci} strokeDashoffset={ci*(1-p)} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s"}}/></svg><span style={{fontSize:10,fontWeight:700,color}}>{Math.round(value)}</span><span style={{fontSize:7,color:T.textDim,textTransform:"uppercase",letterSpacing:1}}>{label}</span></div>);}

function Loader({msg}){return(<div style={{marginTop:8,padding:"10px 12px",borderRadius:10,background:T.gold+"06",border:`1px solid ${T.gold}15`,display:"flex",alignItems:"center",gap:10}}><div style={{width:16,height:16,border:`2px solid ${T.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite",flexShrink:0}}/><div style={{fontSize:11,fontWeight:600,color:T.gold}}>{msg}</div></div>);}

export default function App(){
  const[ml,setMl]=useState({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]});
  const[tab,setTab]=useState("today");
  const[am,setAm]=useState(null);
  const[cart,setCart]=useState({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]});
  const[sq,setSq]=useState("");const[sr,setSr]=useState([]);const[sing,setSing]=useState(false);const[se,setSe]=useState(null);
  const[ld,setLd]=useState(false);const[lm,setLm]=useState("");const[err,setErr]=useState(null);
  const[inp,setInp]=useState("");const[ip,setIp]=useState(null);const[id,setId]=useState(null);
  const[cms,setCms]=useState("breakfast");
  const fr=useRef(null);
  const[wd]=useState(()=>Array.from({length:7},(_,i)=>({cal:i===6?0:Math.floor(Math.random()*800+1400)})));

  useEffect(()=>{const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap";l.rel="stylesheet";document.head.appendChild(l);},[]);
  useEffect(()=>{if(!ld&&!sing)return;const ms=ld?["Searching USDA...","Fetching data...","Almost there..."]:["Searching database...","Finding variations...","Compiling..."];let i=0;setLm(ms[0]);const iv=setInterval(()=>{i=(i+1)%ms.length;setLm(ms[i]);},2500);return()=>clearInterval(iv);},[ld,sing]);

  const all=Object.values(ml).flat();
  const s=k=>all.reduce((a,i)=>a+(i[k]||0),0);
  const tot={};["calories","protein","carbs","fat","fiber","sugar","cholesterol","sodium","potassium","calcium","iron","vitamin_a","vitamin_c","vitamin_d","vitamin_b12","magnesium","zinc","phosphorus"].forEach(k=>{tot[k]=s(k);});
  const g={calories:2800,protein:160,carbs:350,fat:90};
  const mc=sl=>ml[sl].reduce((a,i)=>a+(i.calories||0),0);
  const cc=Object.values(cart).flat().length;

  async function doSearch(q){if(!q.trim())return;setSing(true);setSe(null);try{const p=await callAPI(SEARCH_SYS,[{role:"user",content:`Search for: ${q.trim()}`}]);if(Array.isArray(p))setSr(p.map(i=>({...ensureN(i),_id:Date.now()+Math.random()})));else throw new Error("No results");}catch(e){setSe(e.message);setSr([]);}setSing(false);}

  async function doLog(sl){if(!inp.trim()&&!id)return;setLd(true);setErr(null);try{const ms=id?[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:id}},{type:"text",text:inp.trim()||"Analyze this food"}]}]:[{role:"user",content:`Search web for nutritional data: ${inp.trim()}`}];const p=await callAPI(id?IMG_SYS:SYS,ms);if(Array.isArray(p)&&p.length){const st=p.map(i=>({...ensureN(i),id:Date.now()+Math.random(),time:new Date()}));setMl(pr=>({...pr,[sl]:[...pr[sl],...st]}));setInp("");setIp(null);setId(null);setAm(null);}else throw new Error("Empty");}catch(e){setErr(e.message);}setLd(false);}

  function addCart(it,sl){setCart(p=>({...p,[sl]:[...p[sl],{...ensureN(it),id:Date.now()+Math.random(),time:new Date()}]}));}
  function rmCart(sl,xid){setCart(p=>({...p,[sl]:p[sl].filter(x=>x.id!==xid)}));}
  function commit(){setMl(p=>{const n={...p};Object.keys(cart).forEach(sl=>{n[sl]=[...n[sl],...cart[sl]];});return n;});setCart({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]});setTab("today");}
  function addFr(it,sl){setMl(p=>({...p,[sl]:[...p[sl],{...ensureN(it),id:Date.now()+Math.random(),time:new Date()}]}));}
  function rmIt(sl,xid){setMl(p=>({...p,[sl]:p[sl].filter(x=>x.id!==xid)}));}
  function hImg(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setIp(ev.target.result);setId(ev.target.result.split(",")[1]);};r.readAsDataURL(f);}

  const nav=[{id:"today",l:"Food Log",i:"📋"},{id:"search",l:"Search",i:"🔍"},{id:"cart",l:"Cart",i:"🛒"},{id:"trends",l:"Trends",i:"📊"},{id:"micros",l:"Micros",i:"🧬"}];

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:sans}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"20px 14px 84px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}>
          <span style={{fontFamily:serif,fontSize:22,fontWeight:700,color:T.gold,letterSpacing:1}}>TRIVENI</span>
          <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:3,color:T.textDim,fontWeight:600}}>Nutrition</span>
          <span style={{marginLeft:"auto",fontSize:7,padding:"2px 6px",borderRadius:3,background:T.green+"20",color:T.green,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Live</span>
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,${T.gold}60,transparent)`,marginBottom:14}}/>

        {/* Dashboard */}
        <div style={{background:T.surface,borderRadius:16,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><span style={{fontFamily:serif,fontSize:15,fontWeight:600}}>Today </span><span style={{fontSize:10,color:T.textDim}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</span></div>
            <ScoreRing items={all}/>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
              <span style={{fontSize:26,fontWeight:700,fontFamily:serif,color:T.gold}}>{Math.round(tot.calories)}</span>
              <span style={{fontSize:11,color:T.textDim}}>/ {g.calories} kcal</span>
            </div>
            <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${T.gold},${T.goldDim})`,width:`${Math.min((tot.calories/g.calories)*100,100)}%`,transition:"width .8s"}}/></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            <MRing value={tot.protein} max={g.protein} color={T.red} label="Protein"/>
            <MRing value={tot.carbs} max={g.carbs} color={T.gold} label="Carbs"/>
            <MRing value={tot.fat} max={g.fat} color={T.blue} label="Fat"/>
            <MRing value={tot.fiber||0} max={60} color={T.green} label="Fibre"/>
          </div>
        </div>

        {/* FOOD LOG */}
        {tab==="today"&&!am&&(<div>
          {MEALS.map(m=>{const it=ml[m.id],cal=mc(m.id);return(<div key={m.id} style={{borderBottom:`1px solid ${T.border}`,padding:"12px 0"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:11,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{m.icon}</div><div><div style={{fontWeight:600,fontSize:14}}>{m.label}</div><div style={{fontSize:10,color:T.textDim}}>{it.length===0?"No food logged":`${it.length} item${it.length>1?"s":""} · ${Math.round(cal)} kcal`}</div></div></div><button onClick={()=>setAm(m.id)} style={{width:34,height:34,borderRadius:"50%",border:"none",background:T.accent,color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>{it.length>0&&(<div style={{marginTop:6,marginLeft:48}}>{it.map(item=>(<div key={item.id} style={{padding:"7px 0",borderBottom:`1px solid ${T.border}06`}}><div style={{display:"flex",alignItems:"center",gap:7}}><Dot item={item}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:500}}>{item.name}</span><span style={{fontSize:10,color:T.textDim,marginLeft:5}}>{item.quantity}{item.grams?` (${item.grams}g)`:""}</span></div><span style={{fontSize:12,fontWeight:600,color:T.gold}}>{item.calories} kcal</span><button onClick={()=>rmIt(m.id,item.id)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:14,padding:"0 2px"}}>×</button></div><div style={{display:"flex",gap:10,marginTop:3,marginLeft:15}}>{[{l:"P",v:item.protein,c:T.red},{l:"C",v:item.carbs,c:T.gold},{l:"F",v:item.fat,c:T.blue},{l:"Fiber",v:item.fiber,c:T.green}].map(m=>(<span key={m.l} style={{fontSize:9,color:T.textDim}}><span style={{color:m.c,fontWeight:700}}>{m.l}</span> {Math.round(m.v||0)}g</span>))}</div></div>))}</div>)}</div>);})}
          <div style={{display:"flex",gap:8,marginTop:14}}><button onClick={()=>setTab("trends")} style={{flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.accent}40`,background:"transparent",color:T.accent,fontSize:12,fontWeight:600,fontFamily:sans,cursor:"pointer"}}>📊 View Analysis</button><button onClick={()=>setTab("cart")} style={{flex:1,padding:"11px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${T.accent},${T.accentDim})`,color:"#fff",fontSize:12,fontWeight:600,fontFamily:sans,cursor:"pointer"}}>🛒 Food Cart{cc>0?` (${cc})`:""}</button></div>
        </div>)}

        {/* ACTIVE MEAL */}
        {tab==="today"&&am&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><button onClick={()=>{setAm(null);setErr(null);}} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>←</button><span style={{fontFamily:serif,fontSize:17,fontWeight:600}}>{MEALS.find(x=>x.id===am)?.label}</span><span style={{fontSize:16,color:T.textDim}}>▾</span></div>
          {ip&&(<div style={{position:"relative",marginBottom:8,borderRadius:10,overflow:"hidden",border:`1px solid ${T.border}`}}><img src={ip} alt="" style={{width:"100%",maxHeight:130,objectFit:"cover",display:"block"}}/><button onClick={()=>{setIp(null);setId(null);}} style={{position:"absolute",top:5,right:5,background:"rgba(0,0,0,.7)",border:"none",color:T.text,width:22,height:22,borderRadius:"50%",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>)}
          <div style={{display:"flex",gap:5,background:T.surface,borderRadius:12,padding:5,border:`1px solid ${T.border}`,marginBottom:10}}>
            <button onClick={()=>fr.current?.click()} style={{width:36,height:36,borderRadius:8,border:`1px solid ${T.border}`,background:T.card,color:id?T.gold:T.textDim,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></button>
            <input type="file" ref={fr} accept="image/*" capture="environment" onChange={hImg} style={{display:"none"}}/>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();doLog(am);}}} placeholder="Search for a dish..." style={{flex:1,background:"none",border:"none",outline:"none",color:T.text,fontSize:13,fontFamily:sans,padding:"8px 4px"}}/>
            <div style={{width:1,background:T.border,margin:"6px 0"}}/>
            <button style={{width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,color:T.textDim,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>
            <button onClick={()=>doLog(am)} disabled={ld||(!inp.trim()&&!id)} style={{width:36,height:36,borderRadius:8,border:"none",background:(inp.trim()||id)&&!ld?T.accent:T.border,color:"#fff",cursor:ld?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ld?<div style={{width:14,height:14,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>:"→"}</button>
          </div>
          {ld&&<Loader msg={lm}/>}
          {err&&<div style={{marginTop:6,padding:"7px 12px",borderRadius:8,background:T.red+"12",color:T.red,fontSize:11}}>{err}</div>}
          <div style={{display:"flex",gap:14,marginBottom:12,marginTop:10}}>{[{l:"Healthy",c:T.green},{l:"Moderately healthy",c:T.yellow},{l:"Unhealthy",c:T.red}].map(h=>(<div key={h.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:h.c}}/><span style={{fontSize:9,color:T.textDim}}>{h.l}</span></div>))}</div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:T.textDim,fontWeight:700,marginBottom:8}}>Frequently logged</div>
          {FREQ.map((item,i)=>(<div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><Dot item={item}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{item.name}</div><div style={{fontSize:10,color:T.textDim}}>{item.quantity} ({item.grams}g) · {item.calories} kcal</div><div style={{display:"flex",gap:8,marginTop:2}}>{[{l:"P",v:item.protein,c:T.red},{l:"C",v:item.carbs,c:T.gold},{l:"F",v:item.fat,c:T.blue},{l:"Fiber",v:item.fiber,c:T.green}].map(m=>(<span key={m.l} style={{fontSize:9,color:T.textDim}}><span style={{color:m.c,fontWeight:700}}>{m.l}</span> {Math.round(m.v||0)}g</span>))}</div></div><button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",padding:"4px"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button onClick={()=>addFr(item,am)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${T.accent}`,background:"transparent",color:T.accent,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div></div>))}
        </div>)}

        {/* SEARCH */}
        {tab==="search"&&(<div>
          <div style={{display:"flex",gap:5,background:T.surface,borderRadius:12,padding:5,border:`1px solid ${T.border}`,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",color:T.textDim,flexShrink:0}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <input value={sq} onChange={e=>setSq(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSearch(sq);}} placeholder="Search any food..." style={{flex:1,background:"none",border:"none",outline:"none",color:T.text,fontSize:13,fontFamily:sans,padding:"8px 4px"}}/>
            <div style={{width:1,background:T.border,margin:"6px 0"}}/>
            <button style={{width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,color:T.textDim,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>
            <button onClick={()=>doSearch(sq)} disabled={sing||!sq.trim()} style={{width:36,height:36,borderRadius:8,border:"none",background:sq.trim()&&!sing?T.accent:T.border,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sing?<div style={{width:14,height:14,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>:"→"}</button>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:12}}>{[{l:"Healthy",c:T.green},{l:"Moderately healthy",c:T.yellow},{l:"Unhealthy",c:T.red}].map(h=>(<div key={h.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:h.c}}/><span style={{fontSize:9,color:T.textDim}}>{h.l}</span></div>))}</div>
          {sing&&<Loader msg={lm}/>}
          {se&&<div style={{marginBottom:8,padding:"7px 12px",borderRadius:8,background:T.red+"12",color:T.red,fontSize:11}}>{se}</div>}
          {sr.length===0&&!sing&&(<><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:T.textDim,fontWeight:700,marginBottom:8}}>Quick Search</div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{QCATS.map(c=>(<button key={c.l} onClick={()=>{setSq(c.l);doSearch(c.l);}} style={{padding:"6px 10px",borderRadius:16,border:`1px solid ${T.border}`,background:T.card,color:T.text,fontSize:11,fontFamily:sans,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span>{c.e}</span><span>{c.l}</span></button>))}</div></>)}
          {sr.length>0&&!sing&&(<><div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto"}}>{MEALS.map(m=>(<button key={m.id} onClick={()=>setCms(m.id)} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${cms===m.id?T.accent:T.border}`,background:cms===m.id?T.accent+"15":"transparent",color:cms===m.id?T.accent:T.textDim,fontSize:10,fontFamily:sans,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{m.icon} {m.label}</button>))}</div>
          {sr.map((item,i)=>(<div key={item._id} style={{background:T.card,borderRadius:12,padding:"11px 13px",marginBottom:6,border:`1px solid ${T.border}`,animation:"fadeSlide .3s ease forwards",animationDelay:`${i*.04}s`,opacity:0}}><div style={{display:"flex",alignItems:"center",gap:7}}><Dot item={item}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{item.name}</div><div style={{fontSize:10,color:T.textDim}}>{item.quantity}{item.grams?` (${item.grams}g)`:""} · {item.calories} kcal</div><div style={{display:"flex",gap:8,marginTop:2}}>{[{l:"P",v:item.protein,c:T.red},{l:"C",v:item.carbs,c:T.gold},{l:"F",v:item.fat,c:T.blue}].map(m=>(<span key={m.l} style={{fontSize:9,color:T.textDim}}><span style={{color:m.c,fontWeight:600}}>{m.l}</span> {Math.round(m.v)}g</span>))}</div></div><button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",padding:"4px"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button onClick={()=>addCart(item,cms)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${T.accent}`,background:"transparent",color:T.accent,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>{item.source&&<div style={{fontSize:7,color:T.green,marginTop:3,marginLeft:15,textTransform:"uppercase",letterSpacing:.8}}>✓ {item.source}</div>}</div>))}</>)}
        </div>)}

        {/* CART */}
        {tab==="cart"&&(<div>
          <div style={{fontFamily:serif,fontSize:17,fontWeight:600,marginBottom:12}}>Food Cart</div>
          {MEALS.map(m=>(<div key={m.id} style={{borderBottom:`1px solid ${T.border}`,padding:"11px 0"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:14}}>{m.label}</span><button onClick={()=>{setCms(m.id);setTab("search");}} style={{width:30,height:30,borderRadius:"50%",border:"none",background:T.accent,color:"#fff",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div>{cart[m.id].length>0&&(<div style={{marginTop:5}}>{cart[m.id].map(item=>(<div key={item.id} style={{padding:"5px 0"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Dot item={item}/><span style={{flex:1,fontSize:12}}>{item.name}</span><span style={{fontSize:11,color:T.gold,fontWeight:600}}>{item.calories} kcal</span><button onClick={()=>rmCart(m.id,item.id)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:13}}>×</button></div><div style={{display:"flex",gap:8,marginTop:2,marginLeft:14}}>{[{l:"P",v:item.protein,c:T.red},{l:"C",v:item.carbs,c:T.gold},{l:"F",v:item.fat,c:T.blue}].map(x=>(<span key={x.l} style={{fontSize:9,color:T.textDim}}><span style={{color:x.c,fontWeight:700}}>{x.l}</span> {Math.round(x.v||0)}g</span>))}</div></div>))}</div>)}</div>))}
          <button onClick={commit} disabled={cc===0} style={{width:"100%",marginTop:18,padding:"13px",borderRadius:14,border:"none",background:cc>0?`linear-gradient(135deg,${T.accent},${T.accentDim})`:T.border,color:cc>0?"#fff":T.textDim,fontFamily:sans,fontSize:14,fontWeight:700,cursor:cc>0?"pointer":"default"}}>Add to log ({cc} items)</button>
        </div>)}

        {/* TRENDS */}
        {tab==="trends"&&(<div>
          <div style={{display:"flex",gap:0,marginBottom:14}}>{["Weekly","Monthly"].map((p,i)=>(<button key={p} style={{padding:"6px 18px",border:`1px solid ${i===0?T.accent:T.border}`,borderRadius:i===0?"18px 0 0 18px":"0 18px 18px 0",background:i===0?T.accent+"15":"transparent",color:i===0?T.accent:T.textDim,fontSize:11,fontWeight:600,fontFamily:sans,cursor:"pointer"}}>{p}</button>))}</div>
          <div style={{background:T.surface,borderRadius:16,padding:"18px",border:`1px solid ${T.border}`,marginBottom:14,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:16}}>‹</button><span style={{fontSize:13,fontWeight:600}}>23-29 Mar</span><button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:16}}>›</button></div>
            <div style={{position:"relative",width:110,height:110,margin:"0 auto 14px"}}><svg width={110} height={110} style={{transform:"rotate(-90deg)"}}><circle cx={55} cy={55} r={46} fill="none" stroke={T.border} strokeWidth={7}/><circle cx={55} cy={55} r={46} fill="none" stroke={T.accent} strokeWidth={7} strokeDasharray={2*Math.PI*46} strokeDashoffset={2*Math.PI*46*0.3} strokeLinecap="round"/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,color:T.textDim,textTransform:"uppercase",letterSpacing:1,background:T.card,padding:"1px 7px",borderRadius:8,marginBottom:3}}>Calorie deficit</span><span style={{fontSize:26,fontWeight:700,fontFamily:serif,color:T.accent}}>1235</span><span style={{fontSize:9,color:T.textDim}}>kcal/day</span></div></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:100,gap:3,marginBottom:4,padding:"0 4px"}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>{const v=wd[i]?.cal||0;const diff=v-g.calories;const pos=diff>0;const bH=Math.max(Math.abs(diff)/g.calories*80,3);return(<div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"center"}}>{pos&&<div style={{width:"55%",height:bH,borderRadius:"3px 3px 0 0",background:T.yellow}}/>}<div style={{width:"100%",height:1,background:T.textDim+"30"}}/>{!pos&&<div style={{width:"55%",height:bH,borderRadius:"0 0 3px 3px",background:T.accent}}/>}</div>);})}</div>
            <div style={{display:"flex",justifyContent:"space-around",padding:"0 4px"}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d} style={{fontSize:8,color:T.textDim}}>{d}</span>)}</div>
          </div>
          <div style={{background:T.surface,borderRadius:14,padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontSize:12,fontWeight:600,color:T.accent}}>Calorie deficit</div><div style={{fontSize:20,fontWeight:700,fontFamily:serif,color:T.accent}}>6 days</div><div style={{fontSize:10,color:T.textDim}}>86%</div><div style={{width:80,height:3,background:T.border,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{width:"86%",height:"100%",background:T.accent,borderRadius:2}}/></div></div><div style={{width:50,height:50,borderRadius:"50%",border:`4px solid ${T.border}`,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",bottom:0,left:0,right:0,height:"86%",background:T.accent+"30"}}/></div><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:T.yellow}}>Calorie surplus</div><div style={{fontSize:20,fontWeight:700,fontFamily:serif,color:T.yellow}}>1 day</div><div style={{fontSize:10,color:T.textDim}}>14%</div><div style={{width:80,height:3,background:T.border,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{width:"14%",height:"100%",background:T.yellow,borderRadius:2}}/></div></div></div>
        </div>)}

        {/* MICROS */}
        {tab==="micros"&&(<div>
          {all.length===0?(<div style={{textAlign:"center",padding:"36px 20px",color:T.textDim}}><div style={{fontFamily:serif,fontSize:14}}>Log meals to see data</div></div>):(<>
            <div style={{background:T.surface,borderRadius:14,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:10}}>
              <div style={{fontFamily:serif,fontSize:15,fontWeight:600,color:T.gold,marginBottom:10}}>Macronutrients</div>
              {[{l:"Protein",v:tot.protein,mx:g.protein,c:T.red,u:"g"},{l:"Carbohydrates",v:tot.carbs,mx:g.carbs,c:T.gold,u:"g"},{l:"Fat",v:tot.fat,mx:g.fat,c:T.blue,u:"g"},{l:"Fibre",v:tot.fiber||0,mx:60,c:T.green,u:"g"},{l:"Sugar",v:tot.sugar||0,mx:50,c:T.orange,u:"g"},{l:"Saturated Fat",v:s("saturated_fat")||0,mx:22,c:T.red,u:"g"},{l:"Trans Fat",v:s("trans_fat")||0,mx:2,c:T.red,u:"g"},{l:"Sodium",v:tot.sodium||0,mx:2300,c:T.textMid,u:"mg"}].map(m=>(<div key={m.l} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:500}}>{m.l}</span><span style={{fontSize:10,color:m.c,fontWeight:600}}>{Math.round(m.v)}{m.u} <span style={{color:T.textDim,fontWeight:400}}>/ {m.mx}{m.u}</span></span></div><div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:m.c,width:`${Math.min((m.v/(m.mx||1))*100,100)}%`,transition:"width .6s"}}/></div></div>))}
            </div>
            <div style={{background:T.surface,borderRadius:14,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:10}}>
              <div style={{fontFamily:serif,fontSize:15,fontWeight:600,color:T.gold,marginBottom:10}}>Micronutrients vs Daily Value</div>
              {MICROS.map(m=>{const v=tot[m.key]||0,p=Math.min((v/m.dv)*100,100);return(<div key={m.key} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:500}}>{m.label}</span><span style={{fontSize:10,color:m.color,fontWeight:600}}>{Math.round(v*10)/10}{m.unit} <span style={{color:T.textDim,fontWeight:400}}>({Math.round(p)}%)</span></span></div><div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:p>=80?T.green:p>=40?m.color:T.red+"80",width:`${p}%`,transition:"width .6s"}}/></div></div>);})}
            </div>
            <div style={{background:T.gold+"06",borderRadius:10,padding:"10px 12px",border:`1px solid ${T.gold}12`,fontSize:10,color:T.textDim,lineHeight:1.5}}><span style={{color:T.gold,fontWeight:700}}>IRONMAN Tip:</span> Red = below 40% DV. Endurance athletes need extra iron, Mg, Na & K.</div>
          </>)}
        </div>)}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"center",padding:"5px 0 env(safe-area-inset-bottom,5px)",zIndex:100}}>
        <div style={{display:"flex",maxWidth:540,width:"100%",justifyContent:"space-around"}}>
          {nav.map(t=>(<button key={t.id} onClick={()=>{setTab(t.id);if(t.id!=="today")setAm(null);}} style={{background:"none",border:"none",cursor:"pointer",padding:"5px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:1,color:tab===t.id?T.accent:T.textDim,transition:"color .2s",position:"relative"}}><span style={{fontSize:15}}>{t.i}</span><span style={{fontSize:7,fontWeight:600,textTransform:"uppercase",letterSpacing:.8}}>{t.l}</span>{t.id==="cart"&&cc>0&&(<span style={{position:"absolute",top:0,right:2,background:T.red,color:"#fff",fontSize:8,fontWeight:700,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{cc}</span>)}</button>))}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:${T.textDim}!important}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
      `}</style>
    </div>
  );
}
