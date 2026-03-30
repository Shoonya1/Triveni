import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// TRIVENI — Body · Spirit · Nutrition
// A comprehensive wellness app with dark luxury editorial design
// ═══════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const T = {
  bg: "#07070A", bgAlt: "#0D0D12", surface: "#131318", card: "#19191F",
  cardHover: "#1F1F28", border: "#26262F", borderLight: "#34343F",
  text: "#ECEAE7", textSoft: "#B0AFA8", textMuted: "#7A7A84", textDim: "#4A4A54",
  accent: "#D4A843", accentSoft: "rgba(212,168,67,0.12)",
  body: "#30A89E", bodyDark: "#268A82", bodyGlow: "rgba(48,168,158,0.10)",
  spirit: "#8B6FD6", spiritDark: "#7358B8", spiritGlow: "rgba(139,111,214,0.10)",
  nutr: "#E05555", nutrDark: "#C24444", nutrGlow: "rgba(224,85,85,0.10)",
  success: "#3FB06F", danger: "#E05555", warning: "#E8A838",
  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 },
  font: { display: "'Playfair Display',Georgia,serif", body: "'DM Sans','Segoe UI',sans-serif", mono: "'JetBrains Mono','Fira Code',monospace" },
};

// ─── SVG ICONS ──────────────────────────────────────────────
const I = {
  Home:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>,
  Body:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="4.5" r="2.5"/><path d="M12 7v5.5m0 0l-3.5 5.5m3.5-5.5l3.5 5.5M6.5 11h11"/></svg>,
  Spirit:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21c-4.5-4-9-7.5-9-12C3 5.5 5.2 3 8 3c1.8 0 3.2 1 4 2.5C12.8 4 14.2 3 16 3c2.8 0 5 2.5 5 6 0 4.5-4.5 8-9 12z"/><path d="M12 13c-2.5-3-5.5-4.5-7.5-3.5M12 13c2.5-3 5.5-4.5 7.5-3.5"/></svg>,
  Food:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  User:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Search:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>,
  Play:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>,
  Check:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevR:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Cam:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Upload:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Fire:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.6 0-8-2.5-8-8.5C4 9.5 8 5 8 5s1 2.2 3 3.3C11.5 5 13.5 1.5 16 0c0 0 .5 3.5 1 5.5s1.5 3.5 2 5.5c.5 2 1 3.5 1 4.5C20 20.5 15.6 23 12 23z"/></svg>,
  Bolt:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>,
  Clock:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>,
  Heart:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Back:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  X:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Reset:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  Trash:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  Token:()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/></svg>,
};

// ─── DATA ──────────────────────────────────────────────
const WORKOUTS = [
  {id:1,name:"Wreck-It",type:"HIIT",focus:"Full Body",diff:4,dur:"25m",sets:5,emoji:"💥",exercises:["High Knees x40","Burpees x10","Jump Squats x20","Mountain Climbers x40","Push-ups x20"]},
  {id:2,name:"Spartan Standard",type:"Strength",focus:"Full Body",diff:5,dur:"40m",sets:7,emoji:"⚔️",exercises:["Push-ups x20","Squats x30","Lunges x20","Plank 60s","Burpees x15","Tricep Dips x15","Crunches x30"]},
  {id:3,name:"Take Flight",type:"Cardio",focus:"Lower Body",diff:3,dur:"20m",sets:4,emoji:"🦅",exercises:["Jump Squats x20","High Knees x40","Side Lunges x20","Calf Raises x30"]},
  {id:4,name:"Inner Fire",type:"Metcon",focus:"Abs",diff:3,dur:"30m",sets:5,emoji:"🔥",exercises:["Crunches x30","Leg Raises x20","Plank 45s","Bicycle Crunches x30","Flutter Kicks x40"]},
  {id:5,name:"Float",type:"Stretching",focus:"Full Body",diff:2,dur:"15m",sets:3,emoji:"🌊",exercises:["Forward Fold 30s","Cat-Cow x10","Pigeon Pose 30s each","Supine Twist 30s each"]},
  {id:6,name:"Savage Strength",type:"Strength",focus:"Upper Body",diff:5,dur:"35m",sets:6,emoji:"🐻",exercises:["Diamond Push-ups x15","Pike Push-ups x12","Tricep Dips x20","Superman Hold 30s","Plank to Push-up x12","Archer Push-ups x10"]},
  {id:7,name:"Star Power",type:"Cardio",focus:"Full Body",diff:3,dur:"20m",sets:4,emoji:"⭐",exercises:["Star Jumps x20","Squat Kicks x20","Speed Skaters x20","Jump Lunges x16"]},
  {id:8,name:"Domino",type:"HIIT",focus:"Full Body",diff:4,dur:"25m",sets:5,emoji:"🎯",exercises:["Burpees x8","Push-ups x12","Squats x20","High Knees x30","Plank Jacks x16"]},
  {id:9,name:"Spring Fever",type:"HIIT",focus:"Lower Body",diff:3,dur:"22m",sets:5,emoji:"🌸",exercises:["Jump Squats x15","Lunge Pulses x12 each","Glute Bridges x20","Wall Sit 45s","Skater Hops x16"]},
  {id:10,name:"Deep",type:"Wellness",focus:"Full Body",diff:2,dur:"20m",sets:3,emoji:"🧘",exercises:["Deep Breathing 2min","Gentle Stretches 3min","Body Scan 5min","Restorative Poses 5min"]},
  {id:11,name:"Shoulder Opener",type:"Stretching",focus:"Upper Body",diff:1,dur:"10m",sets:3,emoji:"🤸",exercises:["Arm Circles x20","Shoulder Rolls x15","Cross-body Stretch 30s each","Doorway Stretch 30s"]},
  {id:12,name:"Ball Toss",type:"Cardio",focus:"Full Body",diff:2,dur:"15m",sets:4,emoji:"⚡",exercises:["Jumping Jacks x30","Squat Press x15","Toe Touches x20","Step Backs x20"]},
  {id:13,name:"Now You See Me",type:"Combat",focus:"Full Body",diff:4,dur:"28m",sets:5,emoji:"👊",exercises:["Jab-Cross x30","Front Kick x20 each","Hook-Uppercut x20","Side Kick x16 each","Combo Flow x20"]},
  {id:14,name:"5-Min REHIT",type:"HIIT",focus:"Full Body",diff:4,dur:"5m",sets:2,emoji:"🚀",exercises:["Max Sprint 20s","Recovery 3min","Max Sprint 20s"]},
  {id:15,name:"Bend Don't Break",type:"Stretching",focus:"Full Body",diff:2,dur:"18m",sets:4,emoji:"🌿",exercises:["Hamstring Stretch 30s","Quad Stretch 30s each","Hip Flexor 30s each","Spinal Twist 30s each"]},
  {id:16,name:"Burpee REHIT",type:"HIIT",focus:"Full Body",diff:5,dur:"8m",sets:3,emoji:"💣",exercises:["Burpee Sprint 20s","Walk 90s","Burpee Sprint 20s","Walk 90s","Burpee Sprint 20s"]},
];

const CHALLENGES = [
  {id:1,name:"Epic Hold",days:30,type:"Strength",diff:4,desc:"30-day isometric hold progression",progress:12,emoji:"🏔️",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:2,name:"Push-Up Streak",days:30,type:"Strength",diff:3,desc:"Daily push-up volume builder",progress:8,emoji:"💪",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:3,name:"3-Minute HIIT",days:30,type:"HIIT",diff:4,desc:"Short intense daily HIIT bursts",progress:0,emoji:"⚡",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:4,name:"Burpee Countdown",days:30,type:"Cardio",diff:5,desc:"Descending burpee pyramid",progress:0,emoji:"🔥",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:5,name:"2-Min Mobility",days:30,type:"Stretching",diff:1,desc:"Daily mobility micro-sessions",progress:22,emoji:"🧘",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:6,name:"Daily Dips",days:30,type:"Strength",diff:3,desc:"Progressive dip volume",progress:0,emoji:"🏋️",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:7,name:"Squat Every 45min",days:30,type:"Strength",diff:2,desc:"10 squats every 45 minutes",progress:5,emoji:"🦵",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
  {id:8,name:"Reset Challenge",days:30,type:"Wellness",diff:2,desc:"Full body reset & restore",progress:0,emoji:"🌱",daily:Array.from({length:30},(_,i)=>`Day ${i+1}`)},
];

const PROGRAMS = [
  {id:1,name:"Stacked",type:"Strength",days:30,diff:4,desc:"Progressive overload bodyweight mastery",emoji:"📦"},
  {id:2,name:"Locked In",type:"Everything",days:30,diff:3,desc:"Complete mental & physical transformation",emoji:"🔒"},
  {id:3,name:"30 Days of Gravity",type:"Cardio",days:30,diff:3,desc:"Gravity-defying cardio conditioning",emoji:"🌍"},
  {id:4,name:"Total Abs",type:"Abs",days:30,diff:4,desc:"Complete core development system",emoji:"🎯"},
  {id:5,name:"Spartan Trials",type:"Combat",days:30,diff:5,desc:"Warrior fitness protocol",emoji:"⚔️"},
  {id:6,name:"Momentum",type:"Everything",days:30,diff:2,desc:"Build unstoppable daily momentum",emoji:"🚀"},
  {id:7,name:"Total Body Strength",type:"Strength",days:30,diff:3,desc:"Full body strength foundation",emoji:"💎"},
  {id:8,name:"30 Day Cardio Light",type:"Cardio",days:30,diff:1,desc:"Easy-start cardio conditioning",emoji:"🌤️"},
];

const MEDITATIONS = [
  {id:1,name:"Morning Clarity",dur:"10 min",type:"Guided",desc:"Start with focused awareness",emoji:"🌅",color:"#F59E0B"},
  {id:2,name:"Body Scan",dur:"15 min",type:"Guided",desc:"Progressive relaxation head to toe",emoji:"🫁",color:"#3B82F6"},
  {id:3,name:"Breath Counting",dur:"5 min",type:"Breathwork",desc:"Simple counting meditation",emoji:"🌬️",color:"#10B981"},
  {id:4,name:"Loving Kindness",dur:"20 min",type:"Guided",desc:"Metta meditation for compassion",emoji:"💛",color:"#F472B6"},
  {id:5,name:"Deep Sleep",dur:"30 min",type:"Guided",desc:"Yoga Nidra for restful sleep",emoji:"🌙",color:"#6366F1"},
  {id:6,name:"Box Breathing",dur:"5 min",type:"Breathwork",desc:"4-4-4-4 tactical breathing",emoji:"📦",color:"#14B8A6"},
  {id:7,name:"Chakra Alignment",dur:"25 min",type:"Guided",desc:"Energy center balancing",emoji:"🔮",color:"#A855F7"},
  {id:8,name:"Walking Meditation",dur:"15 min",type:"Mindfulness",desc:"Mindful movement practice",emoji:"🚶",color:"#22C55E"},
  {id:9,name:"Gratitude",dur:"10 min",type:"Guided",desc:"Cultivate thankfulness",emoji:"🙏",color:"#EAB308"},
  {id:10,name:"Alternate Nostril",dur:"8 min",type:"Breathwork",desc:"Nadi Shodhana pranayama",emoji:"👃",color:"#06B6D4"},
];

const YOGA = {
  Beginner:[
    {name:"Mountain Pose",sans:"Tadasana",hold:"30s",benefit:"Foundation & alignment",emoji:"🏔️",steps:["Stand feet together","Arms at sides","Engage thighs","Crown reaches up"]},
    {name:"Downward Dog",sans:"Adho Mukha Svanasana",hold:"45s",benefit:"Full body stretch",emoji:"🐕",steps:["Hands shoulder-width","Hips high","Heels toward floor","Spine long"]},
    {name:"Warrior I",sans:"Virabhadrasana I",hold:"30s ea",benefit:"Leg strength",emoji:"⚔️",steps:["Front knee 90°","Back foot 45°","Arms overhead","Hips square"]},
    {name:"Tree Pose",sans:"Vrikshasana",hold:"30s ea",benefit:"Balance & focus",emoji:"🌳",steps:["Foot on inner thigh","Hands at heart","Gaze fixed","Core engaged"]},
    {name:"Cat-Cow",sans:"Marjaryasana",hold:"1 min",benefit:"Spine mobility",emoji:"🐱",steps:["Inhale: arch back","Exhale: round spine","Flow with breath","Gentle movement"]},
    {name:"Child's Pose",sans:"Balasana",hold:"1 min",benefit:"Rest & recovery",emoji:"🧒",steps:["Knees wide","Arms forward","Forehead down","Breathe deeply"]},
    {name:"Cobra Pose",sans:"Bhujangasana",hold:"30s",benefit:"Back strength",emoji:"🐍",steps:["Hands under shoulders","Lift chest","Elbows slightly bent","Shoulders down"]},
    {name:"Bridge Pose",sans:"Setu Bandhasana",hold:"30s",benefit:"Spine & glutes",emoji:"🌉",steps:["Feet hip-width","Lift hips","Clasp hands below","Press into feet"]},
  ],
  Intermediate:[
    {name:"Half Moon",sans:"Ardha Chandrasana",hold:"30s ea",benefit:"Balance & core",emoji:"🌙",steps:["Hand on floor","Top leg parallel","Open chest","Gaze up"]},
    {name:"Crow Pose",sans:"Bakasana",hold:"15-30s",benefit:"Arm strength",emoji:"🐦",steps:["Hands planted","Knees on triceps","Lean forward","Lift feet"]},
    {name:"Boat Pose",sans:"Navasana",hold:"30s",benefit:"Core power",emoji:"⛵",steps:["V-shape body","Legs straight","Arms parallel","Core engaged"]},
    {name:"Eagle Pose",sans:"Garudasana",hold:"30s ea",benefit:"Joint flexibility",emoji:"🦅",steps:["Wrap arms","Cross legs","Sink low","Hold steady"]},
    {name:"Camel Pose",sans:"Ustrasana",hold:"30s",benefit:"Back opening",emoji:"🐫",steps:["Kneel upright","Reach for heels","Push hips forward","Head back gently"]},
    {name:"Side Plank",sans:"Vasisthasana",hold:"30s ea",benefit:"Oblique strength",emoji:"📐",steps:["Stack feet","Lift hips","Top arm up","Strong line"]},
  ],
  Advanced:[
    {name:"Scorpion",sans:"Vrschikasana",hold:"15-30s",benefit:"Full mastery",emoji:"🦂",steps:["Forearm balance","Arch back","Feet toward head","Deep focus"]},
    {name:"Firefly",sans:"Tittibhasana",hold:"15s",benefit:"Arm & core",emoji:"✨",steps:["Hands between legs","Lift & extend","Legs straight","Balance forward"]},
    {name:"King Pigeon",sans:"Kapotasana",hold:"30s",benefit:"Deep backbend",emoji:"🕊️",steps:["Deep lunge","Back knee down","Reach for foot","Open chest"]},
    {name:"Handstand",sans:"Adho Mukha Vrksasana",hold:"15-60s",benefit:"Inversion strength",emoji:"🤸",steps:["Hands planted","Kick up","Stack hips","Point toes"]},
    {name:"Eight-Angle",sans:"Astavakrasana",hold:"15s ea",benefit:"Twist & balance",emoji:"🔄",steps:["Leg over arm","Cross ankles","Lean forward","Extend legs"]},
    {name:"Peacock",sans:"Mayurasana",hold:"15-30s",benefit:"Core balance",emoji:"🦚",steps:["Elbows in belly","Lean forward","Legs extend","Full balance"]},
  ],
};

const FOOD_DB = {
  "rice":{cal:130,p:2.7,c:28,f:0.3,u:"100g"},"chicken breast":{cal:165,p:31,c:0,f:3.6,u:"100g"},
  "banana":{cal:89,p:1.1,c:23,f:0.3,u:"1 medium"},"egg":{cal:72,p:6.3,c:0.4,f:4.8,u:"1 large"},
  "chapati":{cal:120,p:3.1,c:18,f:3.7,u:"1 piece"},"dal":{cal:198,p:14,c:34,f:0.8,u:"1 cup"},
  "paneer":{cal:265,p:18,c:1.2,f:21,u:"100g"},"apple":{cal:95,p:0.5,c:25,f:0.3,u:"1 medium"},
  "milk":{cal:149,p:8,c:12,f:8,u:"1 cup"},"oats":{cal:154,p:5,c:27,f:2.6,u:"1 cup cooked"},
  "almonds":{cal:164,p:6,c:6,f:14,u:"28g"},"yogurt":{cal:100,p:17,c:6,f:0.7,u:"1 cup"},
  "roti":{cal:120,p:3.1,c:18,f:3.7,u:"1 piece"},"sabzi":{cal:85,p:3,c:10,f:4,u:"1 cup"},
  "idli":{cal:58,p:2,c:12,f:0.4,u:"1 piece"},"dosa":{cal:133,p:3.9,c:18,f:5,u:"1 piece"},
  "sambar":{cal:130,p:6,c:20,f:2.5,u:"1 cup"},"curd":{cal:98,p:11,c:4,f:4.3,u:"1 cup"},
  "poha":{cal:180,p:3,c:32,f:5,u:"1 plate"},"upma":{cal:210,p:5,c:28,f:8,u:"1 plate"},
  "paratha":{cal:220,p:4,c:30,f:10,u:"1 piece"},"biryani":{cal:290,p:12,c:38,f:10,u:"1 plate"},
  "salad":{cal:45,p:2,c:8,f:0.5,u:"1 bowl"},"coffee":{cal:70,p:1,c:10,f:2,u:"1 cup"},
  "tea":{cal:50,p:0.5,c:8,f:1.5,u:"1 cup"},"protein shake":{cal:180,p:25,c:12,f:3,u:"1 scoop"},
  "peanut butter":{cal:190,p:7,c:7,f:16,u:"2 tbsp"},"bread":{cal:79,p:2.7,c:15,f:1,u:"1 slice"},
  "ghee":{cal:112,p:0,c:0,f:13,u:"1 tbsp"},"butter":{cal:102,p:0.1,c:0,f:12,u:"1 tbsp"},
  "tofu":{cal:76,p:8,c:1.9,f:4.8,u:"100g"},"lentils":{cal:230,p:18,c:40,f:0.8,u:"1 cup"},
  "chickpeas":{cal:269,p:14.5,c:45,f:4.2,u:"1 cup"},"sweet potato":{cal:103,p:2.3,c:24,f:0.1,u:"1 medium"},
  "broccoli":{cal:55,p:3.7,c:11,f:0.6,u:"1 cup"},"spinach":{cal:23,p:2.9,c:3.6,f:0.4,u:"1 cup"},
  "salmon":{cal:208,p:20,c:0,f:13,u:"100g"},"avocado":{cal:240,p:3,c:12,f:22,u:"1 whole"},
  "quinoa":{cal:222,p:8,c:39,f:3.6,u:"1 cup cooked"},
};

const ACHIEVEMENTS = [
  {emoji:"🔥",label:"7-Day Streak",earned:true},{emoji:"💪",label:"50 Workouts",earned:false},
  {emoji:"🧘",label:"Zen Master",earned:false},{emoji:"🏆",label:"First Challenge",earned:true},
  {emoji:"🌅",label:"Early Bird",earned:true},{emoji:"📊",label:"Macro Tracker",earned:true},
  {emoji:"⚡",label:"HIIT Warrior",earned:false},{emoji:"🌙",label:"Night Owl",earned:false},
  {emoji:"🎯",label:"Precision",earned:false},{emoji:"🐻",label:"Bear Mode",earned:false},
  {emoji:"🌊",label:"Flow State",earned:true},{emoji:"🏔️",label:"Summit",earned:false},
];

// ─── NUTRITION V4 DATA ──────────────────────────────────
const NC = { blue:"#5B8EC4", orange:"#D4935B", teal:"#40C9A2", yellow:"#D4C35B", purple:"#9B6BC4" };

const MEALS_V4 = [
  {id:"breakfast",label:"Breakfast",icon:"🌅"},
  {id:"lunch",label:"Lunch",icon:"☀️"},
  {id:"snacks",label:"Snacks",icon:"🍪"},
  {id:"dinner",label:"Dinner",icon:"🌙"},
  {id:"others",label:"Others",icon:"➕"},
];

const NUTR_API_URL = "https://api.anthropic.com/v1/messages";
const NUTR_SYS = `You are a precision nutrition engine for TRIVENI. You have web search. For EVERY food item, search USDA FoodData Central, Nutritionix, CalorieKing, or IFCT/NIN. Return ONLY a JSON array: {"name":string,"quantity":string,"grams":number,"source":string,"calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"saturated_fat":number,"trans_fat":number,"cholesterol":number,"sodium":number,"potassium":number,"calcium":number,"iron":number,"vitamin_a":number,"vitamin_c":number,"vitamin_d":number,"vitamin_b12":number,"magnesium":number,"zinc":number,"phosphorus":number,"category":string} JSON array ONLY.`;
const NUTR_SEARCH_SYS = `You are a food database for TRIVENI. You have web search. Return 6-8 variations with full nutrition from USDA/Nutritionix/IFCT. Same JSON format. JSON array ONLY.`;
const NUTR_IMG_SYS = `You are a nutrition engine with vision for TRIVENI. You have web search. Identify foods, search web, return JSON array with grams. JSON array ONLY.`;

function nutrEnsureN(it) {
  const keys = ["calories","protein","carbs","fat","fiber","sugar","saturated_fat","trans_fat","cholesterol","sodium","potassium","calcium","iron","vitamin_a","vitamin_c","vitamin_d","vitamin_b12","magnesium","zinc","phosphorus","grams"];
  const o = {...it}; keys.forEach(k => { o[k] = Number(o[k]) || 0; }); return o;
}

function nutrGetHealth(it) {
  if (!it) return { l: "moderate", c: NC.yellow };
  const p = it.protein||0, f = it.fat||0, s = it.sugar||0, fi = it.fiber||0, cal = it.calories||0;
  if (p > 15 && fi > 3 && s < 8 && f < 15) return { l: "healthy", c: T.success };
  if (s > 20 || f > 25 || (cal > 400 && p < 10)) return { l: "unhealthy", c: T.danger };
  return { l: "moderate", c: NC.yellow };
}

const FREQ_V4 = [
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

const QCATS_V4 = [
  {e:"🥚",l:"Eggs"},{e:"🍗",l:"Chicken"},{e:"🍚",l:"Rice"},{e:"🫘",l:"Dal"},
  {e:"🥛",l:"Milk"},{e:"🍌",l:"Banana"},{e:"🥜",l:"Nuts"},{e:"🍞",l:"Roti"},
  {e:"🥗",l:"Salad"},{e:"🐟",l:"Fish"},{e:"🧀",l:"Paneer"},{e:"🥣",l:"Oats"},
  {e:"💪",l:"Whey"},{e:"🍎",l:"Apple"},{e:"🧈",l:"Ghee"},{e:"🍠",l:"Sweet Potato"},
];

const MICROS_V4 = [
  {key:"cholesterol",label:"Cholesterol",unit:"mg",dv:300,color:NC.orange},
  {key:"potassium",label:"Potassium",unit:"mg",dv:4700,color:NC.teal},
  {key:"calcium",label:"Calcium",unit:"mg",dv:1000,color:T.text},
  {key:"iron",label:"Iron",unit:"mg",dv:18,color:T.danger},
  {key:"vitamin_a",label:"Vit A",unit:"mcg",dv:900,color:NC.orange},
  {key:"vitamin_c",label:"Vit C",unit:"mg",dv:90,color:NC.yellow},
  {key:"vitamin_d",label:"Vit D",unit:"mcg",dv:20,color:T.accent},
  {key:"vitamin_b12",label:"B12",unit:"mcg",dv:2.4,color:T.danger},
  {key:"magnesium",label:"Magnesium",unit:"mg",dv:420,color:T.success},
  {key:"zinc",label:"Zinc",unit:"mg",dv:11,color:NC.blue},
  {key:"phosphorus",label:"Phosphorus",unit:"mg",dv:1250,color:NC.purple},
];

// ─── HELPERS ──────────────────────────────────────────────
const fmt=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
const stars=n=>Array.from({length:5},(_,i)=><span key={i} style={{color:i<n?T.accent:T.textDim,fontSize:9}}>●</span>);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const btnStyle=(bg,color,x={})=>({padding:"10px 18px",background:bg,color,border:"none",borderRadius:T.radius.md,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:T.font.body,transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6,...x});

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("home");
  const [view,setView]=useState(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{requestAnimationFrame(()=>setReady(true));},[]);
  const nav=(t,v=null)=>{setTab(t);setView(v);window.scrollTo?.(0,0);};

  const tabs=[
    {id:"home",icon:I.Home,label:"Home"},
    {id:"body",icon:I.Body,label:"Body",c:T.body},
    {id:"spirit",icon:I.Spirit,label:"Spirit",c:T.spirit},
    {id:"nutrition",icon:I.Food,label:"Fuel",c:T.nutr},
    {id:"token",icon:I.Token,label:"TRV",c:T.accent},
    {id:"profile",icon:I.User,label:"Profile"},
  ];

  return(
    <div style={{width:"100%",maxWidth:430,margin:"0 auto",height:"100vh",background:T.bg,color:T.text,fontFamily:T.font.body,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",borderLeft:`1px solid ${T.border}`,borderRight:`1px solid ${T.border}`}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:82,WebkitOverflowScrolling:"touch"}}>
        <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(8px)",transition:"all 0.45s cubic-bezier(0.16,1,0.3,1)"}}>
          {tab==="home"&&!view&&<HomeScreen nav={nav}/>}
          {tab==="body"&&!view&&<BodyScreen nav={nav}/>}
          {tab==="body"&&view?.t==="workout"&&<WorkoutDetail w={view.d} nav={nav} back={()=>setView(null)}/>}
          {tab==="body"&&view?.t==="challenge"&&<ChallengeDetail c={view.d} back={()=>setView(null)}/>}
          {tab==="body"&&view?.t==="active"&&<ActiveWorkout w={view.d} done={()=>setView(null)}/>}
          {tab==="spirit"&&!view&&<SpiritScreen nav={nav}/>}
          {tab==="spirit"&&view?.t==="medPlay"&&<MeditationPlayer m={view.d} back={()=>setView(null)}/>}
          {tab==="spirit"&&view?.t==="pose"&&<YogaPoseDetail p={view.d} back={()=>setView(null)}/>}
          {tab==="nutrition"&&!view&&<NutritionScreen/>}
          {tab==="token"&&!view&&<TokenScreen/>}
          {tab==="profile"&&!view&&<ProfileScreen/>}
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:`linear-gradient(to top,${T.bg} 70%,transparent)`,paddingTop:16}}>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",height:58,background:`${T.surface}E0`,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,margin:"0 6px",borderRadius:"18px 18px 0 0"}}>
          {tabs.map(t=>{const on=tab===t.id;const ac=t.c||T.accent;return(
            <button key={t.id} onClick={()=>nav(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",color:on?ac:T.textDim,cursor:"pointer",padding:"5px 14px",borderRadius:T.radius.md,transition:"all 0.25s",position:"relative",fontFamily:T.font.body}}>
              {on&&<div style={{position:"absolute",top:-1,width:18,height:2,borderRadius:1,background:ac}}/>}
              <t.icon/><span style={{fontSize:9.5,fontWeight:on?600:400,letterSpacing:"0.03em"}}>{t.label}</span>
            </button>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ──────────────────────────────────
function SH({children,action,onAction}){
  return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
    <h3 style={{fontSize:11,color:T.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600,margin:0}}>{children}</h3>
    {action&&<button onClick={onAction} style={{background:"none",border:"none",color:T.accent,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font.body}}>{action}</button>}
  </div>);
}

function PH({icon:Icon,title,subtitle,color,back}){
  return(<div style={{paddingTop:back?16:50,paddingBottom:6}}>
    {back&&<button onClick={back} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",padding:"8px 0",display:"flex",alignItems:"center",gap:4,fontFamily:T.font.body,fontSize:12,marginBottom:4}}><I.Back/> Back</button>}
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
      {Icon&&<span style={{color}}><Icon/></span>}
      <h1 style={{fontSize:24,fontFamily:T.font.display,fontWeight:600,margin:0,color:color||T.text}}>{title}</h1>
    </div>
    {subtitle&&<p style={{fontSize:12.5,color:T.textMuted,margin:0}}>{subtitle}</p>}
  </div>);
}

function STabs({tabs:items,active,onChange,color}){
  return(<div style={{display:"flex",gap:3,marginBottom:18,marginTop:14,background:T.card,borderRadius:T.radius.md,padding:3}}>
    {items.map(t=>(<button key={t} onClick={()=>onChange(t)} style={{flex:1,padding:"9px 0",background:active===t?color:"transparent",color:active===t?T.bg:T.textMuted,border:"none",borderRadius:T.radius.sm,fontWeight:600,fontSize:11.5,cursor:"pointer",textTransform:"capitalize",transition:"all 0.2s",fontFamily:T.font.body,letterSpacing:"0.02em"}}>{t}</button>))}
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════
function HomeScreen({nav}){
  const h=new Date().getHours();
  const gr=h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";
  return(
    <div style={{padding:"0 20px"}}>
      <div style={{paddingTop:50,paddingBottom:20}}>
        <p style={{fontSize:12,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3,fontWeight:500}}>{gr}</p>
        <h1 style={{fontSize:30,fontFamily:T.font.display,fontWeight:600,margin:0,background:`linear-gradient(135deg,${T.text} 30%,${T.accent})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Anil</h1>
      </div>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:26}}>
        {[{l:"Streak",v:"12",I:I.Fire,c:T.accent},{l:"Calories",v:"1,840",I:I.Bolt,c:T.nutr},{l:"Trained",v:"45m",I:I.Clock,c:T.body},{l:"Mindful",v:"15m",I:I.Heart,c:T.spirit}].map((s,i)=>(
          <div key={i} style={{background:T.card,borderRadius:T.radius.lg,padding:"13px 6px",textAlign:"center",border:`1px solid ${T.border}`}}>
            <div style={{color:s.c,marginBottom:5,display:"flex",justifyContent:"center"}}><s.I/></div>
            <div style={{fontSize:18,fontWeight:700,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:8.5,color:T.textMuted,marginTop:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Pillars */}
      <SH>Three Pillars</SH>
      {[{id:"body",l:"Body",s:"2,687 Workouts · 178 Challenges",c:T.body,g:T.bodyGlow,e:"💪",p:68},
        {id:"spirit",l:"Spirit",s:"Meditation · Yoga · Breathwork",c:T.spirit,g:T.spiritGlow,e:"🧘",p:45},
        {id:"nutrition",l:"Nutrition",s:"Food Tracking · Macro Goals",c:T.nutr,g:T.nutrGlow,e:"🥗",p:82}
      ].map(p=>(
        <button key={p.id} onClick={()=>nav(p.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:13,background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:"15px 16px",marginBottom:8,cursor:"pointer",color:T.text,textAlign:"left",transition:"all 0.2s",fontFamily:T.font.body}}>
          <div style={{width:46,height:46,borderRadius:13,background:p.g,border:`1px solid ${p.c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.e}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:14.5,marginBottom:1}}>{p.l}</div>
            <div style={{fontSize:11,color:T.textMuted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.s}</div>
            <div style={{height:3,background:T.border,borderRadius:2,marginTop:8,overflow:"hidden"}}><div style={{height:"100%",width:`${p.p}%`,background:`linear-gradient(90deg,${p.c},${p.c}88)`,borderRadius:2}}/></div>
          </div>
          <span style={{color:T.textDim}}><I.ChevR/></span>
        </button>
      ))}
      {/* WOD */}
      <div style={{marginTop:22}}><SH>Workout of the Day</SH></div>
      <div style={{background:`linear-gradient(135deg,${T.body}12,${T.card})`,border:`1px solid ${T.body}30`,borderRadius:T.radius.xl,padding:20,position:"relative",overflow:"hidden",marginBottom:22}}>
        <div style={{position:"absolute",top:-24,right:-20,fontSize:80,opacity:0.06}}>💥</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div><div style={{fontSize:9,color:T.body,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:3}}>Today's Pick</div><div style={{fontSize:19,fontWeight:700,fontFamily:T.font.display}}>Wreck-It Workout</div></div>
          <div style={{fontSize:34}}>💥</div>
        </div>
        <div style={{fontSize:11.5,color:T.textMuted,marginBottom:10}}>HIIT · Full Body · 5 sets · 25 min</div>
        <div style={{display:"flex",gap:4,marginBottom:14}}>{stars(4)}</div>
        <button onClick={()=>nav("body",{t:"active",d:WORKOUTS[0]})} style={btnStyle(T.body,T.bg,{width:"100%",justifyContent:"center",padding:"12px 0",fontSize:13.5})}>Start Workout →</button>
      </div>
      {/* Challenges */}
      <SH action="See All" onAction={()=>nav("body")}>Active Challenges</SH>
      <div style={{display:"flex",gap:9,overflowX:"auto",paddingBottom:4,margin:"0 -20px",padding:"0 20px 4px"}}>
        {CHALLENGES.filter(c=>c.progress>0).map(c=>(
          <div key={c.id} onClick={()=>nav("body",{t:"challenge",d:c})} style={{minWidth:155,background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:15,flexShrink:0,cursor:"pointer"}}>
            <div style={{fontSize:26,marginBottom:7}}>{c.emoji}</div>
            <div style={{fontSize:12.5,fontWeight:600,marginBottom:3,lineHeight:1.3}}>{c.name}</div>
            <div style={{fontSize:10.5,color:T.textMuted,marginBottom:9}}>Day {c.progress}/{c.days}</div>
            <div style={{height:3,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.progress/c.days)*100}%`,background:T.accent,borderRadius:2}}/></div>
          </div>
        ))}
      </div>
      {/* Quick Meditation */}
      <div style={{marginTop:22,marginBottom:32}}><SH>Quick Meditation</SH>
        <div style={{background:`linear-gradient(135deg,${T.spirit}10,${T.card})`,border:`1px solid ${T.spirit}28`,borderRadius:T.radius.xl,padding:18,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}} onClick={()=>nav("spirit",{t:"medPlay",d:MEDITATIONS[0]})}>
          <div style={{width:50,height:50,borderRadius:"50%",background:`${T.spirit}18`,border:`2px solid ${T.spirit}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌅</div>
          <div style={{flex:1}}><div style={{fontSize:14.5,fontWeight:600,marginBottom:1}}>Morning Clarity</div><div style={{fontSize:11.5,color:T.textMuted}}>10 min · Guided</div></div>
          <div style={{width:38,height:38,borderRadius:"50%",background:T.spirit,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><I.Play/></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BODY SCREEN
// ═══════════════════════════════════════════════════════════════
function BodyScreen({nav}){
  const [sub,setSub]=useState("workouts");
  const [filter,setFilter]=useState("All");
  const [q,setQ]=useState("");
  const types=["All","HIIT","Strength","Cardio","Metcon","Stretching","Combat","Wellness"];
  const filtered=WORKOUTS.filter(w=>(filter==="All"||w.type===filter)&&(q===""||w.name.toLowerCase().includes(q.toLowerCase())));

  return(
    <div style={{padding:"0 20px"}}>
      <PH icon={I.Body} title="Body" subtitle={`${WORKOUTS.length} workouts · ${CHALLENGES.length} challenges · ${PROGRAMS.length} programs`} color={T.body}/>
      <STabs tabs={["workouts","challenges","programs"]} active={sub} onChange={setSub} color={T.body}/>

      {sub==="workouts"&&<>
        <div style={{display:"flex",alignItems:"center",gap:9,background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.md,padding:"9px 13px",marginBottom:14}}>
          <I.Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workouts..." style={{flex:1,background:"none",border:"none",color:T.text,fontSize:13.5,outline:"none",fontFamily:T.font.body}}/>
          {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer"}}><I.X/></button>}
        </div>
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:14,margin:"0 -20px",padding:"0 20px 14px"}}>
          {types.map(t=>(<button key={t} onClick={()=>setFilter(t)} style={{padding:"6px 13px",background:filter===t?T.body:T.card,color:filter===t?T.bg:T.textMuted,border:`1px solid ${filter===t?T.body:T.border}`,borderRadius:T.radius.full,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:T.font.body}}>{t}</button>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {filtered.map(w=>(<div key={w.id} onClick={()=>nav("body",{t:"workout",d:w})} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:15,cursor:"pointer"}}>
            <div style={{fontSize:30,marginBottom:9}}>{w.emoji}</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:3,lineHeight:1.3}}>{w.name}</div>
            <div style={{fontSize:10.5,color:T.body,marginBottom:5,fontWeight:500}}>{w.type} · {w.focus}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,color:T.textMuted}}>{w.dur} · {w.sets}s</span><div style={{display:"flex",gap:2}}>{stars(w.diff)}</div></div>
          </div>))}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:T.textMuted}}>No workouts found</div>}
      </>}

      {sub==="challenges"&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
        {CHALLENGES.map(c=>(<div key={c.id} onClick={()=>nav("body",{t:"challenge",d:c})} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:16,display:"flex",alignItems:"center",gap:13,cursor:"pointer"}}>
          <div style={{fontSize:34,flexShrink:0}}>{c.emoji}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13.5,fontWeight:600,marginBottom:2}}>{c.name}</div>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:2}}>{c.desc}</div>
            <div style={{fontSize:10.5,color:T.body,fontWeight:500}}>{c.days} days · {c.type}</div>
            {c.progress>0&&<div style={{height:3,background:T.border,borderRadius:2,marginTop:7,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.progress/c.days)*100}%`,background:T.accent,borderRadius:2}}/></div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{display:"flex",gap:2}}>{stars(c.diff)}</div>
            {c.progress>0&&<span style={{fontSize:10,color:T.accent,fontWeight:700}}>{Math.round((c.progress/c.days)*100)}%</span>}
          </div>
        </div>))}
      </div>}

      {sub==="programs"&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
        {PROGRAMS.map(p=>(<div key={p.id} style={{background:`linear-gradient(135deg,${T.body}06,${T.card})`,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:16,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div style={{fontSize:34}}>{p.emoji}</div>
            <div style={{flex:1}}><div style={{fontSize:14.5,fontWeight:600,marginBottom:2}}>{p.name}</div><div style={{fontSize:11.5,color:T.textMuted,marginBottom:3}}>{p.desc}</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:11,color:T.body,fontWeight:500}}>{p.type}</span><span style={{fontSize:10.5,color:T.textMuted}}>{p.days} days</span><div style={{display:"flex",gap:2}}>{stars(p.diff)}</div></div>
            </div>
          </div>
          <button style={btnStyle(`${T.body}15`,T.body,{width:"100%",justifyContent:"center",marginTop:13,border:`1px solid ${T.body}30`,padding:"9px 0"})}>Start Program →</button>
        </div>))}
      </div>}
      <div style={{height:30}}/>
    </div>
  );
}

// ─── WORKOUT DETAIL ──────────────────────────────────────
function WorkoutDetail({w,nav,back}){
  return(<div style={{padding:"0 20px"}}>
    <PH title={w.name} subtitle={`${w.type} · ${w.focus}`} color={T.body} back={back}/>
    <div style={{fontSize:64,textAlign:"center",margin:"20px 0"}}>{w.emoji}</div>
    <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:24}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700}}>{w.dur}</div><div style={{fontSize:10,color:T.textMuted}}>Duration</div></div>
      <div style={{width:1,background:T.border}}/>
      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700}}>{w.sets}</div><div style={{fontSize:10,color:T.textMuted}}>Sets</div></div>
      <div style={{width:1,background:T.border}}/>
      <div style={{textAlign:"center"}}><div style={{display:"flex",gap:2,justifyContent:"center"}}>{stars(w.diff)}</div><div style={{fontSize:10,color:T.textMuted,marginTop:3}}>Level</div></div>
    </div>
    <SH>Exercises</SH>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,overflow:"hidden",marginBottom:20}}>
      {w.exercises.map((ex,i)=>(<div key={i} style={{padding:"13px 16px",borderBottom:i<w.exercises.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:28,height:28,borderRadius:T.radius.sm,background:`${T.body}15`,color:T.body,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
        <span style={{fontSize:13.5}}>{ex}</span>
      </div>))}
    </div>
    <button onClick={()=>nav("body",{t:"active",d:w})} style={btnStyle(T.body,T.bg,{width:"100%",justifyContent:"center",padding:"14px 0",fontSize:14})}>🏋️ Start This Workout</button>
    <div style={{height:30}}/>
  </div>);
}

// ─── ACTIVE WORKOUT ──────────────────────────────────────
function ActiveWorkout({w,done}){
  const [ex,setEx]=useState(0);
  const [set,setSet]=useState(1);
  const [sec,setSec]=useState(0);
  const [on,setOn]=useState(true);
  const [rest,setRest]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(on){ref.current=setInterval(()=>setSec(p=>p+1),1000);}else clearInterval(ref.current);return()=>clearInterval(ref.current);},[on]);
  const next=()=>{if(ex<w.exercises.length-1){setEx(p=>p+1);setRest(false);}else if(set<w.sets){setSet(p=>p+1);setEx(0);setRest(true);setTimeout(()=>setRest(false),3000);}else{setOn(false);}};
  const pct=((set-1)*w.exercises.length+ex+1)/(w.sets*w.exercises.length)*100;

  return(<div style={{padding:"0 20px"}}>
    <PH title={w.name} subtitle={`Set ${set}/${w.sets}`} color={T.body} back={done}/>
    <div style={{height:4,background:T.border,borderRadius:2,margin:"16px 0",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:T.body,borderRadius:2,transition:"width 0.4s"}}/></div>
    <div style={{textAlign:"center",margin:"24px 0"}}><div style={{fontSize:52,fontWeight:300,fontFamily:T.font.mono,letterSpacing:"0.04em",color:rest?T.accent:T.text}}>{fmt(sec)}</div><div style={{fontSize:12,color:T.textMuted,marginTop:4}}>{rest?"Rest Period":"Active"}</div></div>
    {!rest&&<div style={{background:`linear-gradient(135deg,${T.body}12,${T.card})`,border:`1px solid ${T.body}30`,borderRadius:T.radius.xl,padding:24,textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:44,marginBottom:10}}>{w.emoji}</div>
      <div style={{fontSize:11,color:T.body,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:6}}>Exercise {ex+1} of {w.exercises.length}</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:T.font.display}}>{w.exercises[ex]}</div>
    </div>}
    {rest&&<div style={{background:T.card,border:`1px solid ${T.accent}30`,borderRadius:T.radius.xl,padding:30,textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:44,marginBottom:8}}>😮‍💨</div><div style={{fontSize:18,fontWeight:600,color:T.accent}}>Rest Between Sets</div>
    </div>}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,overflow:"hidden",marginBottom:20}}>
      {w.exercises.map((e,i)=>(<div key={i} style={{padding:"11px 14px",borderBottom:i<w.exercises.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:10,opacity:i<ex?0.4:i===ex?1:0.6}}>
        <div style={{width:24,height:24,borderRadius:"50%",background:i<ex?T.success:i===ex?T.body:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {i<ex?<I.Check/>:<span style={{fontSize:10,fontWeight:700,color:i===ex?"#fff":T.textDim}}>{i+1}</span>}
        </div>
        <span style={{fontSize:12.5,textDecoration:i<ex?"line-through":"none",color:i<ex?T.textDim:T.text}}>{e}</span>
      </div>))}
    </div>
    <div style={{display:"flex",gap:10,marginBottom:20}}>
      <button onClick={()=>setOn(!on)} style={btnStyle(T.card,T.text,{flex:1,justifyContent:"center",border:`1px solid ${T.border}`})}>{on?<><I.Pause/> Pause</>:<><I.Play/> Resume</>}</button>
      <button onClick={next} style={btnStyle(T.body,T.bg,{flex:2,justifyContent:"center"})}>{ex===w.exercises.length-1&&set===w.sets?"Finish ✓":"Next →"}</button>
    </div>
  </div>);
}

// ─── CHALLENGE DETAIL ──────────────────────────────────────
function ChallengeDetail({c,back}){
  return(<div style={{padding:"0 20px"}}>
    <PH title={c.name} subtitle={c.desc} color={T.body} back={back}/>
    <div style={{fontSize:64,textAlign:"center",margin:"20px 0"}}>{c.emoji}</div>
    <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:24}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700}}>{c.days}</div><div style={{fontSize:10,color:T.textMuted}}>Days</div></div>
      <div style={{width:1,background:T.border}}/>
      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:T.accent}}>{c.progress}</div><div style={{fontSize:10,color:T.textMuted}}>Done</div></div>
      <div style={{width:1,background:T.border}}/>
      <div style={{textAlign:"center"}}><div style={{display:"flex",gap:2,justifyContent:"center"}}>{stars(c.diff)}</div><div style={{fontSize:10,color:T.textMuted,marginTop:3}}>Level</div></div>
    </div>
    <SH>Daily Progress</SH>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:20}}>
      {c.daily.map((_,i)=>(<div key={i} style={{aspectRatio:"1",borderRadius:T.radius.sm,background:i<c.progress?`${T.success}22`:T.card,border:`1px solid ${i<c.progress?T.success+"44":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:i<c.progress?T.success:T.textDim,fontWeight:600}}>
        {i<c.progress?<I.Check/>:i+1}
      </div>))}
    </div>
    <button style={btnStyle(T.body,T.bg,{width:"100%",justifyContent:"center",padding:"14px 0",fontSize:14})}>{c.progress>0?`Continue — Day ${c.progress+1}`:"Start Challenge"} →</button>
    <div style={{height:30}}/>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// SPIRIT SCREEN
// ═══════════════════════════════════════════════════════════════
function SpiritScreen({nav}){
  const [sub,setSub]=useState("meditation");
  const [yl,setYl]=useState("Beginner");
  const [tOn,setTOn]=useState(false);
  const [tSec,setTSec]=useState(0);
  const [tGoal,setTGoal]=useState(600);
  const [snd,setSnd]=useState("Rain");
  const ref=useRef(null);
  useEffect(()=>{if(tOn){ref.current=setInterval(()=>setTSec(p=>{if(p>=tGoal){setTOn(false);return p;}return p+1;}),1000);}else clearInterval(ref.current);return()=>clearInterval(ref.current);},[tOn,tGoal]);
  const pct=tGoal>0?(tSec/tGoal)*100:0;
  const circ=2*Math.PI*96;

  return(<div style={{padding:"0 20px"}}>
    <PH icon={I.Spirit} title="Spirit" subtitle="Meditation · Breathwork · Yoga" color={T.spirit}/>
    <STabs tabs={["meditation","timer","yoga"]} active={sub} onChange={setSub} color={T.spirit}/>

    {sub==="meditation"&&<><SH>Guided Programs</SH>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {MEDITATIONS.map(m=>(<div key={m.id} onClick={()=>nav("spirit",{t:"medPlay",d:m})} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:"14px 16px",display:"flex",alignItems:"center",gap:13,cursor:"pointer"}}>
          <div style={{width:46,height:46,borderRadius:13,background:`${m.color}15`,border:`1px solid ${m.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{m.emoji}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:600,marginBottom:1}}>{m.name}</div><div style={{fontSize:11,color:T.textMuted}}>{m.desc}</div><div style={{fontSize:10.5,color:T.spirit,fontWeight:500,marginTop:2}}>{m.dur} · {m.type}</div></div>
          <div style={{width:34,height:34,borderRadius:"50%",background:`${T.spirit}20`,border:`1px solid ${T.spirit}35`,display:"flex",alignItems:"center",justifyContent:"center",color:T.spirit,flexShrink:0}}><I.Play/></div>
        </div>))}
      </div>
    </>}

    {sub==="timer"&&<div style={{textAlign:"center",paddingTop:10}}>
      <SH>Meditation Timer</SH>
      <div style={{position:"relative",width:210,height:210,margin:"16px auto 24px"}}>
        <svg width="210" height="210" viewBox="0 0 210 210" style={{transform:"rotate(-90deg)"}}><circle cx="105" cy="105" r="96" fill="none" stroke={T.border} strokeWidth="3.5"/><circle cx="105" cy="105" r="96" fill="none" stroke={T.spirit} strokeWidth="3.5" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/></svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}><div style={{fontSize:42,fontWeight:300,fontFamily:T.font.mono}}>{fmt(tSec)}</div><div style={{fontSize:11,color:T.textMuted}}>/ {fmt(tGoal)}</div></div>
      </div>
      <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:16}}>
        {[5,10,15,20,30].map(m=>(<button key={m} onClick={()=>{setTGoal(m*60);setTSec(0);setTOn(false);}} style={{padding:"7px 13px",background:tGoal===m*60?T.spirit:T.card,color:tGoal===m*60?"#fff":T.textMuted,border:`1px solid ${tGoal===m*60?T.spirit:T.border}`,borderRadius:T.radius.full,fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:T.font.body}}>{m}m</button>))}
      </div>
      <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:24}}>
        {["Rain","Ocean","Bowls","Forest","Silent"].map(s=>(<button key={s} onClick={()=>setSnd(s)} style={{padding:"6px 11px",background:snd===s?`${T.spirit}22`:T.card,color:snd===s?T.spirit:T.textDim,border:`1px solid ${snd===s?T.spirit+"44":T.border}`,borderRadius:T.radius.full,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:T.font.body}}>{s}</button>))}
      </div>
      <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:28}}>
        <button onClick={()=>setTOn(!tOn)} style={{width:62,height:62,borderRadius:"50%",background:T.spirit,border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px ${T.spirit}40`}}>{tOn?<I.Pause/>:<I.Play/>}</button>
        <button onClick={()=>{setTSec(0);setTOn(false);}} style={{width:62,height:62,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,color:T.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Reset/></button>
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:16,textAlign:"left"}}>
        <div style={{fontSize:11,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>This Week</div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          {["M","T","W","T","F","S","S"].map((d,i)=>(<div key={i} style={{textAlign:"center"}}><div style={{fontSize:10,color:T.textMuted,marginBottom:5}}>{d}</div>
            <div style={{width:28,height:28,borderRadius:"50%",background:i<3?T.spirit:i===3?`${T.spirit}40`:T.card,border:`1px solid ${i<3?T.spirit:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{i<3&&<I.Check/>}</div>
            {i<3&&<div style={{fontSize:9,color:T.spirit,marginTop:3,fontWeight:600}}>{[10,15,20][i]}m</div>}
          </div>))}
        </div>
      </div>
    </div>}

    {sub==="yoga"&&<>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["Beginner","Intermediate","Advanced"].map(l=>(<button key={l} onClick={()=>setYl(l)} style={{flex:1,padding:"9px 0",background:yl===l?T.spirit:T.card,color:yl===l?"#fff":T.textMuted,border:`1px solid ${yl===l?T.spirit:T.border}`,borderRadius:T.radius.md,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:T.font.body}}>{l}</button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {YOGA[yl].map((p,i)=>(<div key={i} onClick={()=>nav("spirit",{t:"pose",d:p})} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:14,cursor:"pointer"}}>
          <div style={{fontSize:30,marginBottom:7}}>{p.emoji}</div>
          <div style={{fontSize:12.5,fontWeight:600,marginBottom:1}}>{p.name}</div>
          <div style={{fontSize:10,color:T.spirit,fontWeight:500,fontStyle:"italic",marginBottom:5}}>{p.sans}</div>
          <div style={{fontSize:10,color:T.textMuted,lineHeight:1.4,marginBottom:3}}>{p.benefit}</div>
          <div style={{fontSize:9.5,color:T.textDim}}>Hold: {p.hold}</div>
        </div>))}
      </div>
    </>}
    <div style={{height:30}}/>
  </div>);
}

// ─── MEDITATION PLAYER ──────────────────────────────────
function MeditationPlayer({m,back}){
  const [on,setOn]=useState(false);
  const [sec,setSec]=useState(0);
  const dur=parseInt(m.dur)*60;
  const ref=useRef(null);
  useEffect(()=>{if(on){ref.current=setInterval(()=>setSec(p=>p>=dur?(setOn(false),p):p+1),1000);}else clearInterval(ref.current);return()=>clearInterval(ref.current);},[on,dur]);
  const pct=(sec/dur)*100;const circ=2*Math.PI*88;
  return(<div style={{padding:"0 20px",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div style={{width:"100%"}}><PH back={back}/></div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingBottom:80}}>
      <div style={{fontSize:56,marginBottom:20}}>{m.emoji}</div>
      <h2 style={{fontSize:24,fontFamily:T.font.display,fontWeight:600,marginBottom:4,textAlign:"center"}}>{m.name}</h2>
      <p style={{fontSize:12.5,color:T.textMuted,marginBottom:6,textAlign:"center"}}>{m.desc}</p>
      <span style={{fontSize:11,color:T.spirit,fontWeight:500,marginBottom:30}}>{m.dur} · {m.type}</span>
      <div style={{position:"relative",width:200,height:200,marginBottom:30}}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{transform:"rotate(-90deg)"}}><circle cx="100" cy="100" r="88" fill="none" stroke={T.border} strokeWidth="3"/><circle cx="100" cy="100" r="88" fill="none" stroke={m.color||T.spirit} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/></svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}><div style={{fontSize:38,fontWeight:300,fontFamily:T.font.mono}}>{fmt(sec)}</div><div style={{fontSize:11,color:T.textMuted}}>/ {fmt(dur)}</div></div>
      </div>
      <div style={{display:"flex",gap:16}}>
        <button onClick={()=>setOn(!on)} style={{width:64,height:64,borderRadius:"50%",background:m.color||T.spirit,border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${(m.color||T.spirit)}44`}}>{on?<I.Pause/>:<I.Play/>}</button>
        <button onClick={()=>{setSec(0);setOn(false);}} style={{width:64,height:64,borderRadius:"50%",background:T.card,border:`1px solid ${T.border}`,color:T.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Reset/></button>
      </div>
    </div>
  </div>);
}

// ─── YOGA POSE DETAIL ──────────────────────────────────
function YogaPoseDetail({p,back}){
  return(<div style={{padding:"0 20px"}}>
    <PH title={p.name} subtitle={p.sans} color={T.spirit} back={back}/>
    <div style={{fontSize:72,textAlign:"center",margin:"24px 0"}}>{p.emoji}</div>
    <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:28}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:600}}>{p.hold}</div><div style={{fontSize:10,color:T.textMuted}}>Hold Time</div></div>
      <div style={{width:1,background:T.border}}/>
      <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:600,color:T.spirit}}>{p.benefit}</div><div style={{fontSize:10,color:T.textMuted}}>Benefit</div></div>
    </div>
    <SH>Steps</SH>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,overflow:"hidden",marginBottom:24}}>
      {p.steps.map((s,i)=>(<div key={i} style={{padding:"13px 16px",borderBottom:i<p.steps.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:`${T.spirit}18`,color:T.spirit,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
        <span style={{fontSize:13}}>{s}</span>
      </div>))}
    </div>
    <button style={btnStyle(T.spirit,"#fff",{width:"100%",justifyContent:"center",padding:"14px 0",fontSize:14})}>🧘 Practice This Pose</button>
    <div style={{height:30}}/>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
// NUTRITION SCREEN (v4 — AI-powered with full micronutrient tracking)
// ═══════════════════════════════════════════════════════════════

function NutrDot({item}){const h=nutrGetHealth(item);return <span style={{width:8,height:8,borderRadius:"50%",background:h.c,display:"inline-block",flexShrink:0}}/>;}

function NutrScoreRing({items}){
  const n=items.length;
  if(!n)return(<div style={{width:54,height:54,borderRadius:"50%",border:`3px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12,color:T.textMuted}}>?</span><span style={{fontSize:7,color:T.textMuted}}>Score</span></div>);
  const h=items.filter(i=>nutrGetHealth(i).l==="healthy").length;const s=Math.round((h/n)*100);const c=s>=70?T.success:s>=40?NC.yellow:T.danger;const r=21,ci=2*Math.PI*r;
  return(<div style={{position:"relative",width:54,height:54}}><svg width={54} height={54} style={{transform:"rotate(-90deg)"}}><circle cx={27} cy={27} r={r} fill="none" stroke={T.border} strokeWidth={3.5}/><circle cx={27} cy={27} r={r} fill="none" stroke={c} strokeWidth={3.5} strokeDasharray={ci} strokeDashoffset={ci*(1-s/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:700,color:c}}>{s}</span><span style={{fontSize:7,color:T.textMuted}}>Score</span></div></div>);
}

function NutrMRing({value,max,color,label,size=46}){
  const p=Math.min(value/(max||1),1),r=(size-6)/2,ci=2*Math.PI*r;
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={3}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={ci} strokeDashoffset={ci*(1-p)} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s"}}/></svg><span style={{fontSize:10,fontWeight:700,color}}>{Math.round(value)}</span><span style={{fontSize:7,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>{label}</span></div>);
}

function NutrLoader({msg}){return(<div style={{marginTop:8,padding:"10px 12px",borderRadius:10,background:`${T.accent}06`,border:`1px solid ${T.accent}15`,display:"flex",alignItems:"center",gap:10}}><div style={{width:16,height:16,border:`2px solid ${T.accent}`,borderTopColor:"transparent",borderRadius:"50%",animation:"nutrSpin 1s linear infinite",flexShrink:0}}/><div style={{fontSize:11,fontWeight:600,color:T.accent}}>{msg}</div></div>);}

function NutritionScreen(){
  const [apiKey, setApiKey] = useState(() => { try { return localStorage.getItem('triveni_api_key') || ''; } catch { return ''; } });
  const [showSettings, setShowSettings] = useState(false);
  const [goals, setGoals] = useState(() => { try { const s = localStorage.getItem('triveni_nutr_goals'); return s ? JSON.parse(s) : {calories:2200,protein:140,carbs:275,fat:73}; } catch { return {calories:2200,protein:140,carbs:275,fat:73}; } });
  const [editGoals, setEditGoals] = useState(null);
  const [ml, setMl] = useState({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]});
  const [sub, setSub] = useState("log");
  const [am, setAm] = useState(null);
  const [cart, setCart] = useState({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]});
  const [cms, setCms] = useState("breakfast");
  const [sq, setSq] = useState("");
  const [sr, setSr] = useState([]);
  const [sLoading, setSLoading] = useState(false);
  const [sErr, setSErr] = useState(null);
  const [ld, setLd] = useState(false);
  const [lm, setLm] = useState("");
  const [err, setErr] = useState(null);
  const [inp, setInp] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [imgData, setImgData] = useState(null);
  const fr = useRef(null);
  const [wd] = useState(() => Array.from({length:7}, (_,i) => ({cal: i===6 ? 0 : Math.floor(Math.random()*800+1400)})));

  useEffect(() => { try { localStorage.setItem('triveni_api_key', apiKey); } catch {} }, [apiKey]);
  useEffect(() => { try { localStorage.setItem('triveni_nutr_goals', JSON.stringify(goals)); } catch {} }, [goals]);
  useEffect(() => { if (!ld && !sLoading) return; const ms = ld ? ["Searching USDA...","Fetching nutrition data...","Almost there..."] : ["Searching database...","Finding variations...","Compiling results..."]; let i = 0; setLm(ms[0]); const iv = setInterval(() => { i = (i+1)%ms.length; setLm(ms[i]); }, 2500); return () => clearInterval(iv); }, [ld, sLoading]);

  const all = Object.values(ml).flat();
  const sumK = k => all.reduce((a,i) => a + (i[k]||0), 0);
  const tot = {};
  ["calories","protein","carbs","fat","fiber","sugar","cholesterol","sodium","potassium","calcium","iron","vitamin_a","vitamin_c","vitamin_d","vitamin_b12","magnesium","zinc","phosphorus","saturated_fat","trans_fat"].forEach(k => { tot[k] = sumK(k); });
  const mealCal = sl => ml[sl].reduce((a,i) => a + (i.calories||0), 0);
  const cartCount = Object.values(cart).flat().length;

  async function callNutrAPI(sys, msgs) {
    if (!apiKey) throw new Error("Set your Anthropic API key in ⚙️ Settings");
    const r = await fetch(NUTR_API_URL, { method:"POST", headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"}, body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:sys,messages:msgs,tools:[{type:"web_search_20250305",name:"web_search"}]}) });
    if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error?.message || `API error ${r.status}`); }
    const d = await r.json(); const t = (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("\n"); const m = t.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("No nutrition data found"); return JSON.parse(m[0].replace(/```json|```/g,"").trim());
  }

  async function doSearch(q) { if (!q.trim()) return; setSLoading(true); setSErr(null); try { const p = await callNutrAPI(NUTR_SEARCH_SYS,[{role:"user",content:`Search for: ${q.trim()}`}]); if (Array.isArray(p)) setSr(p.map(i=>({...nutrEnsureN(i),_id:Date.now()+Math.random()}))); else throw new Error("No results"); } catch(e) { setSErr(e.message); setSr([]); } setSLoading(false); }

  async function doLog(sl) { if (!inp.trim() && !imgData) return; setLd(true); setErr(null); try { const msgs = imgData ? [{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},{type:"text",text:inp.trim()||"Analyze this food"}]}] : [{role:"user",content:`Search web for nutritional data: ${inp.trim()}`}]; const p = await callNutrAPI(imgData?NUTR_IMG_SYS:NUTR_SYS,msgs); if (Array.isArray(p)&&p.length) { const st=p.map(i=>({...nutrEnsureN(i),id:Date.now()+Math.random(),time:new Date()})); setMl(pr=>({...pr,[sl]:[...pr[sl],...st]})); setInp(""); setImgPreview(null); setImgData(null); setAm(null); } else throw new Error("Empty result"); } catch(e) { setErr(e.message); } setLd(false); }

  function addCart(it, sl) { setCart(p => ({...p, [sl]: [...p[sl], {...nutrEnsureN(it), id:Date.now()+Math.random(), time:new Date()}]})); }
  function rmCart(sl, xid) { setCart(p => ({...p, [sl]: p[sl].filter(x => x.id !== xid)})); }
  function commitCart() { setMl(p => { const n={...p}; Object.keys(cart).forEach(sl => { n[sl]=[...n[sl],...cart[sl]]; }); return n; }); setCart({breakfast:[],lunch:[],snacks:[],dinner:[],others:[]}); setSub("log"); }
  function addFreq(it, sl) { setMl(p => ({...p, [sl]: [...p[sl], {...nutrEnsureN(it), id:Date.now()+Math.random(), time:new Date()}]})); }
  function rmItem(sl, xid) { setMl(p => ({...p, [sl]: p[sl].filter(x => x.id !== xid)})); }
  function handleImg(e) { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{setImgPreview(ev.target.result);setImgData(ev.target.result.split(",")[1]);}; r.readAsDataURL(f); }
  function saveGoals() { if (editGoals) { setGoals({...editGoals}); setEditGoals(null); } }

  return(
    <div style={{padding:"0 20px"}}>
      {/* Header */}
      <div style={{paddingTop:50,paddingBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
          <span style={{color:T.nutr}}><I.Food/></span>
          <h1 style={{fontSize:24,fontFamily:T.font.display,fontWeight:600,margin:0,color:T.nutr,flex:1}}>Nutrition</h1>
          <button onClick={()=>setShowSettings(!showSettings)} style={{background:showSettings?`${T.accent}18`:"none",border:showSettings?`1px solid ${T.accent}30`:`1px solid ${T.border}`,color:showSettings?T.accent:T.textMuted,cursor:"pointer",padding:"6px 8px",borderRadius:T.radius.sm,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font.body,fontSize:11,gap:4}}>⚙️</button>
        </div>
        <p style={{fontSize:12.5,color:T.textMuted,margin:0}}>AI-powered nutrition tracking</p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:16,marginBottom:14,animation:"nutrFadeSlide .3s ease"}}>
          <div style={{fontSize:11,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Settings</div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:T.textSoft,fontWeight:500,display:"block",marginBottom:4}}>Anthropic API Key</label>
            <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." type="password" style={{width:"100%",padding:"9px 12px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.radius.sm,color:T.text,fontSize:12,outline:"none",fontFamily:T.font.mono,boxSizing:"border-box"}}/>
            <div style={{fontSize:9,color:T.textMuted,marginTop:3}}>Required for AI food search & image analysis</div>
          </div>
          <div style={{fontSize:11,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Daily Goals</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{k:"calories",l:"Calories",u:"kcal",c:T.accent},{k:"protein",l:"Protein",u:"g",c:T.body},{k:"carbs",l:"Carbs",u:"g",c:NC.yellow},{k:"fat",l:"Fat",u:"g",c:T.danger}].map(g=>(
              <div key={g.k}>
                <label style={{fontSize:10,color:g.c,fontWeight:600,display:"block",marginBottom:3}}>{g.l} ({g.u})</label>
                <input type="number" value={(editGoals||goals)[g.k]} onChange={e=>{const v=Number(e.target.value)||0; setEditGoals(p=>({...(p||goals),[g.k]:v}));}} style={{width:"100%",padding:"7px 10px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.radius.sm,color:T.text,fontSize:13,fontWeight:600,outline:"none",fontFamily:T.font.mono,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          {editGoals && <button onClick={saveGoals} style={{marginTop:10,width:"100%",padding:"9px",background:T.body,color:T.bg,border:"none",borderRadius:T.radius.md,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:T.font.body}}>Save Goals ✓</button>}
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {[{l:"Maintenance",v:{calories:2200,protein:140,carbs:275,fat:73}},{l:"IRONMAN",v:{calories:2800,protein:160,carbs:350,fat:90}},{l:"Fat Loss",v:{calories:1800,protein:160,carbs:180,fat:60}},{l:"Muscle Gain",v:{calories:2600,protein:180,carbs:320,fat:80}}].map(pr=>(
              <button key={pr.l} onClick={()=>{setGoals(pr.v);setEditGoals(null);}} style={{padding:"5px 10px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.radius.full,color:T.textSoft,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:T.font.body}}>{pr.l}</button>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard */}
      <div style={{background:T.card,borderRadius:T.radius.xl,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><span style={{fontFamily:T.font.display,fontSize:15,fontWeight:600}}>Today </span><span style={{fontSize:10,color:T.textMuted}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</span></div>
          <NutrScoreRing items={all}/>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
            <span style={{fontSize:26,fontWeight:700,fontFamily:T.font.display,color:T.accent}}>{Math.round(tot.calories)}</span>
            <span style={{fontSize:11,color:T.textMuted}}>/ {goals.calories} kcal</span>
          </div>
          <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${T.accent},${T.accent}88)`,width:`${Math.min((tot.calories/goals.calories)*100,100)}%`,transition:"width .8s"}}/></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          <NutrMRing value={tot.protein} max={goals.protein} color={T.body} label="Protein"/>
          <NutrMRing value={tot.carbs} max={goals.carbs} color={NC.yellow} label="Carbs"/>
          <NutrMRing value={tot.fat} max={goals.fat} color={T.danger} label="Fat"/>
          <NutrMRing value={tot.fiber||0} max={60} color={T.success} label="Fibre"/>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{display:"flex",gap:3,marginBottom:16,background:T.card,borderRadius:T.radius.md,padding:3}}>
        {[{id:"log",l:"📋 Log"},{id:"search",l:"🔍 Search"},{id:"cart",l:`🛒 Cart${cartCount>0?` (${cartCount})`:""}`},{id:"trends",l:"📊 Trends"},{id:"micros",l:"🧬 Micros"}].map(t=>(
          <button key={t.id} onClick={()=>{setSub(t.id);if(t.id!=="log")setAm(null);}} style={{flex:1,padding:"8px 0",background:sub===t.id?T.nutr:"transparent",color:sub===t.id?T.bg:T.textMuted,border:"none",borderRadius:T.radius.sm,fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:T.font.body,transition:"all 0.2s"}}>{t.l}</button>
        ))}
      </div>

      {/* ═══ FOOD LOG TAB ═══ */}
      {sub==="log"&&!am&&(
        <div>
          {MEALS_V4.map(m=>{const it=ml[m.id],cal=mealCal(m.id);return(
            <div key={m.id} style={{borderBottom:`1px solid ${T.border}`,padding:"12px 0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:11,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{m.icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{m.label}</div>
                    <div style={{fontSize:10,color:T.textMuted}}>{it.length===0?"No food logged":`${it.length} item${it.length>1?"s":""} · ${Math.round(cal)} kcal`}</div>
                  </div>
                </div>
                <button onClick={()=>setAm(m.id)} style={{width:34,height:34,borderRadius:"50%",border:"none",background:T.body,color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              {it.length>0&&(
                <div style={{marginTop:6,marginLeft:48}}>
                  {it.map(item=>(
                    <div key={item.id} style={{padding:"7px 0",borderBottom:`1px solid ${T.border}06`}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <NutrDot item={item}/>
                        <div style={{flex:1}}><span style={{fontSize:12,fontWeight:500}}>{item.name}</span><span style={{fontSize:10,color:T.textMuted,marginLeft:5}}>{item.quantity}{item.grams?` (${item.grams}g)`:""}</span></div>
                        <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{item.calories} kcal</span>
                        <button onClick={()=>rmItem(m.id,item.id)} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:14,padding:"0 2px"}}>×</button>
                      </div>
                      <div style={{display:"flex",gap:10,marginTop:3,marginLeft:15}}>
                        {[{l:"P",v:item.protein,c:T.body},{l:"C",v:item.carbs,c:NC.yellow},{l:"F",v:item.fat,c:T.danger},{l:"Fiber",v:item.fiber,c:T.success}].map(x=>(<span key={x.l} style={{fontSize:9,color:T.textMuted}}><span style={{color:x.c,fontWeight:700}}>{x.l}</span> {Math.round(x.v||0)}g</span>))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );})}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>setSub("trends")} style={{flex:1,padding:"11px",borderRadius:T.radius.md,border:`1px solid ${T.body}40`,background:"transparent",color:T.body,fontSize:12,fontWeight:600,fontFamily:T.font.body,cursor:"pointer"}}>📊 View Analysis</button>
            <button onClick={()=>setSub("cart")} style={{flex:1,padding:"11px",borderRadius:T.radius.md,border:"none",background:`linear-gradient(135deg,${T.body},${T.bodyDark})`,color:"#fff",fontSize:12,fontWeight:600,fontFamily:T.font.body,cursor:"pointer"}}>🛒 Food Cart{cartCount>0?` (${cartCount})`:""}</button>
          </div>
        </div>
      )}

      {/* ═══ ACTIVE MEAL (inside log tab) ═══ */}
      {sub==="log"&&am&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <button onClick={()=>{setAm(null);setErr(null);}} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:18}}>←</button>
            <span style={{fontFamily:T.font.display,fontSize:17,fontWeight:600}}>{MEALS_V4.find(x=>x.id===am)?.label}</span>
          </div>
          {imgPreview&&(<div style={{position:"relative",marginBottom:8,borderRadius:10,overflow:"hidden",border:`1px solid ${T.border}`}}><img src={imgPreview} alt="" style={{width:"100%",maxHeight:130,objectFit:"cover",display:"block"}}/><button onClick={()=>{setImgPreview(null);setImgData(null);}} style={{position:"absolute",top:5,right:5,background:"rgba(0,0,0,.7)",border:"none",color:T.text,width:22,height:22,borderRadius:"50%",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>)}
          <div style={{display:"flex",gap:5,background:T.surface,borderRadius:T.radius.md,padding:5,border:`1px solid ${T.border}`,marginBottom:10}}>
            <button onClick={()=>fr.current?.click()} style={{width:36,height:36,borderRadius:8,border:`1px solid ${T.border}`,background:T.card,color:imgData?T.accent:T.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cam/></button>
            <input type="file" ref={fr} accept="image/*" capture="environment" onChange={handleImg} style={{display:"none"}}/>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();doLog(am);}}} placeholder="Search for a dish..." style={{flex:1,background:"none",border:"none",outline:"none",color:T.text,fontSize:13,fontFamily:T.font.body,padding:"8px 4px"}}/>
            <button onClick={()=>doLog(am)} disabled={ld||(!inp.trim()&&!imgData)} style={{width:36,height:36,borderRadius:8,border:"none",background:(inp.trim()||imgData)&&!ld?T.body:T.border,color:"#fff",cursor:ld?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ld?<div style={{width:14,height:14,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"nutrSpin .8s linear infinite"}}/>:"→"}</button>
          </div>
          {ld&&<NutrLoader msg={lm}/>}
          {err&&<div style={{marginTop:6,padding:"7px 12px",borderRadius:8,background:`${T.danger}12`,color:T.danger,fontSize:11}}>{err}</div>}
          <div style={{display:"flex",gap:14,marginBottom:12,marginTop:10}}>{[{l:"Healthy",c:T.success},{l:"Moderate",c:NC.yellow},{l:"Unhealthy",c:T.danger}].map(h=>(<div key={h.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:h.c}}/><span style={{fontSize:9,color:T.textMuted}}>{h.l}</span></div>))}</div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",color:T.textMuted,fontWeight:700,marginBottom:8}}>Frequently logged</div>
          {FREQ_V4.map((item,i)=>(
            <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <NutrDot item={item}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{item.name}</div>
                  <div style={{fontSize:10,color:T.textMuted}}>{item.quantity} ({item.grams}g) · {item.calories} kcal</div>
                  <div style={{display:"flex",gap:8,marginTop:2}}>{[{l:"P",v:item.protein,c:T.body},{l:"C",v:item.carbs,c:NC.yellow},{l:"F",v:item.fat,c:T.danger},{l:"Fiber",v:item.fiber,c:T.success}].map(m=>(<span key={m.l} style={{fontSize:9,color:T.textMuted}}><span style={{color:m.c,fontWeight:700}}>{m.l}</span> {Math.round(m.v||0)}g</span>))}</div>
                </div>
                <button onClick={()=>addFreq(item,am)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${T.body}`,background:"transparent",color:T.body,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ SEARCH TAB ═══ */}
      {sub==="search"&&(
        <div>
          <div style={{display:"flex",gap:5,background:T.surface,borderRadius:T.radius.md,padding:5,border:`1px solid ${T.border}`,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMuted,flexShrink:0}}><I.Search/></div>
            <input value={sq} onChange={e=>setSq(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSearch(sq);}} placeholder="Search any food..." style={{flex:1,background:"none",border:"none",outline:"none",color:T.text,fontSize:13,fontFamily:T.font.body,padding:"8px 4px"}}/>
            <button onClick={()=>doSearch(sq)} disabled={sLoading||!sq.trim()} style={{width:36,height:36,borderRadius:8,border:"none",background:sq.trim()&&!sLoading?T.body:T.border,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sLoading?<div style={{width:14,height:14,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"nutrSpin .8s linear infinite"}}/>:"→"}</button>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:12}}>{[{l:"Healthy",c:T.success},{l:"Moderate",c:NC.yellow},{l:"Unhealthy",c:T.danger}].map(h=>(<div key={h.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:h.c}}/><span style={{fontSize:9,color:T.textMuted}}>{h.l}</span></div>))}</div>
          {sLoading&&<NutrLoader msg={lm}/>}
          {sErr&&<div style={{marginBottom:8,padding:"7px 12px",borderRadius:8,background:`${T.danger}12`,color:T.danger,fontSize:11}}>{sErr}</div>}
          {sr.length===0&&!sLoading&&(<>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",color:T.textMuted,fontWeight:700,marginBottom:8}}>Quick Search</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {QCATS_V4.map(c=>(<button key={c.l} onClick={()=>{setSq(c.l);doSearch(c.l);}} style={{padding:"6px 10px",borderRadius:T.radius.full,border:`1px solid ${T.border}`,background:T.card,color:T.text,fontSize:11,fontFamily:T.font.body,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span>{c.e}</span><span>{c.l}</span></button>))}
            </div>
          </>)}
          {sr.length>0&&!sLoading&&(<>
            <div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto"}}>
              {MEALS_V4.map(m=>(<button key={m.id} onClick={()=>setCms(m.id)} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${cms===m.id?T.body:T.border}`,background:cms===m.id?`${T.body}15`:"transparent",color:cms===m.id?T.body:T.textMuted,fontSize:10,fontFamily:T.font.body,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{m.icon} {m.label}</button>))}
            </div>
            {sr.map((item,i)=>(
              <div key={item._id} style={{background:T.card,borderRadius:T.radius.md,padding:"11px 13px",marginBottom:6,border:`1px solid ${T.border}`,animation:"nutrFadeSlide .3s ease forwards",animationDelay:`${i*.04}s`,opacity:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <NutrDot item={item}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{item.name}</div>
                    <div style={{fontSize:10,color:T.textMuted}}>{item.quantity}{item.grams?` (${item.grams}g)`:""} · {item.calories} kcal</div>
                    <div style={{display:"flex",gap:8,marginTop:2}}>{[{l:"P",v:item.protein,c:T.body},{l:"C",v:item.carbs,c:NC.yellow},{l:"F",v:item.fat,c:T.danger}].map(m=>(<span key={m.l} style={{fontSize:9,color:T.textMuted}}><span style={{color:m.c,fontWeight:600}}>{m.l}</span> {Math.round(m.v)}g</span>))}</div>
                  </div>
                  <button onClick={()=>addCart(item,cms)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${T.body}`,background:"transparent",color:T.body,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                {item.source&&<div style={{fontSize:7,color:T.success,marginTop:3,marginLeft:15,textTransform:"uppercase",letterSpacing:.8}}>✓ {item.source}</div>}
              </div>
            ))}
          </>)}
        </div>
      )}

      {/* ═══ CART TAB ═══ */}
      {sub==="cart"&&(
        <div>
          <div style={{fontFamily:T.font.display,fontSize:17,fontWeight:600,marginBottom:12}}>Food Cart</div>
          {MEALS_V4.map(m=>(
            <div key={m.id} style={{borderBottom:`1px solid ${T.border}`,padding:"11px 0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontWeight:600,fontSize:14}}>{m.label}</span>
                <button onClick={()=>{setCms(m.id);setSub("search");}} style={{width:30,height:30,borderRadius:"50%",border:"none",background:T.body,color:"#fff",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              {cart[m.id].length>0&&(
                <div style={{marginTop:5}}>
                  {cart[m.id].map(item=>(
                    <div key={item.id} style={{padding:"5px 0"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <NutrDot item={item}/>
                        <span style={{flex:1,fontSize:12}}>{item.name}</span>
                        <span style={{fontSize:11,color:T.accent,fontWeight:600}}>{item.calories} kcal</span>
                        <button onClick={()=>rmCart(m.id,item.id)} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:13}}>×</button>
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:2,marginLeft:14}}>{[{l:"P",v:item.protein,c:T.body},{l:"C",v:item.carbs,c:NC.yellow},{l:"F",v:item.fat,c:T.danger}].map(x=>(<span key={x.l} style={{fontSize:9,color:T.textMuted}}><span style={{color:x.c,fontWeight:700}}>{x.l}</span> {Math.round(x.v||0)}g</span>))}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button onClick={commitCart} disabled={cartCount===0} style={{width:"100%",marginTop:18,padding:"13px",borderRadius:T.radius.lg,border:"none",background:cartCount>0?`linear-gradient(135deg,${T.body},${T.bodyDark})`:T.border,color:cartCount>0?"#fff":T.textMuted,fontFamily:T.font.body,fontSize:14,fontWeight:700,cursor:cartCount>0?"pointer":"default"}}>Add to log ({cartCount} items)</button>
        </div>
      )}

      {/* ═══ TRENDS TAB ═══ */}
      {sub==="trends"&&(
        <div>
          <div style={{background:T.card,borderRadius:T.radius.xl,padding:"18px",border:`1px solid ${T.border}`,marginBottom:14,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><button style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:16}}>‹</button><span style={{fontSize:13,fontWeight:600}}>This Week</span><button style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:16}}>›</button></div>
            <div style={{position:"relative",width:110,height:110,margin:"0 auto 14px"}}>
              <svg width={110} height={110} style={{transform:"rotate(-90deg)"}}><circle cx={55} cy={55} r={46} fill="none" stroke={T.border} strokeWidth={7}/><circle cx={55} cy={55} r={46} fill="none" stroke={T.body} strokeWidth={7} strokeDasharray={2*Math.PI*46} strokeDashoffset={2*Math.PI*46*0.3} strokeLinecap="round"/></svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:8,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,background:T.card,padding:"1px 7px",borderRadius:8,marginBottom:3}}>Avg Intake</span>
                <span style={{fontSize:26,fontWeight:700,fontFamily:T.font.display,color:T.body}}>{Math.round(wd.reduce((a,d)=>a+d.cal,0)/7)}</span>
                <span style={{fontSize:9,color:T.textMuted}}>kcal/day</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:100,gap:3,marginBottom:4,padding:"0 4px"}}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>{const v=wd[i]?.cal||0;const diff=v-goals.calories;const pos=diff>0;const bH=Math.max(Math.abs(diff)/goals.calories*80,3);return(
                <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"center"}}>
                  {pos&&<div style={{width:"55%",height:bH,borderRadius:"3px 3px 0 0",background:NC.yellow}}/>}
                  <div style={{width:"100%",height:1,background:`${T.textMuted}30`}}/>
                  {!pos&&<div style={{width:"55%",height:bH,borderRadius:"0 0 3px 3px",background:T.body}}/>}
                </div>
              );})}
            </div>
            <div style={{display:"flex",justifyContent:"space-around",padding:"0 4px"}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d} style={{fontSize:8,color:T.textMuted}}>{d}</span>)}</div>
          </div>
          <div style={{background:T.card,borderRadius:T.radius.lg,padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:12,fontWeight:600,color:T.body}}>Under goal</div><div style={{fontSize:20,fontWeight:700,fontFamily:T.font.display,color:T.body}}>{wd.filter(d=>d.cal<goals.calories&&d.cal>0).length} days</div></div>
            <div style={{width:1,height:40,background:T.border}}/>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:NC.yellow}}>Over goal</div><div style={{fontSize:20,fontWeight:700,fontFamily:T.font.display,color:NC.yellow}}>{wd.filter(d=>d.cal>=goals.calories).length} days</div></div>
          </div>
        </div>
      )}

      {/* ═══ MICROS TAB ═══ */}
      {sub==="micros"&&(
        <div>
          {all.length===0?(
            <div style={{textAlign:"center",padding:"36px 20px",color:T.textMuted}}><div style={{fontFamily:T.font.display,fontSize:14}}>Log meals to see data</div></div>
          ):(<>
            <div style={{background:T.card,borderRadius:T.radius.lg,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:10}}>
              <div style={{fontFamily:T.font.display,fontSize:15,fontWeight:600,color:T.accent,marginBottom:10}}>Macronutrients</div>
              {[{l:"Protein",v:tot.protein,mx:goals.protein,c:T.body,u:"g"},{l:"Carbohydrates",v:tot.carbs,mx:goals.carbs,c:NC.yellow,u:"g"},{l:"Fat",v:tot.fat,mx:goals.fat,c:T.danger,u:"g"},{l:"Fibre",v:tot.fiber||0,mx:60,c:T.success,u:"g"},{l:"Sugar",v:tot.sugar||0,mx:50,c:NC.orange,u:"g"},{l:"Saturated Fat",v:sumK("saturated_fat")||0,mx:22,c:T.danger,u:"g"},{l:"Trans Fat",v:sumK("trans_fat")||0,mx:2,c:T.danger,u:"g"},{l:"Sodium",v:tot.sodium||0,mx:2300,c:T.textSoft,u:"mg"}].map(m=>(
                <div key={m.l} style={{marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:500}}>{m.l}</span><span style={{fontSize:10,color:m.c,fontWeight:600}}>{Math.round(m.v)}{m.u} <span style={{color:T.textMuted,fontWeight:400}}>/ {m.mx}{m.u}</span></span></div>
                  <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:m.c,width:`${Math.min((m.v/(m.mx||1))*100,100)}%`,transition:"width .6s"}}/></div>
                </div>
              ))}
            </div>
            <div style={{background:T.card,borderRadius:T.radius.lg,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:10}}>
              <div style={{fontFamily:T.font.display,fontSize:15,fontWeight:600,color:T.accent,marginBottom:10}}>Micronutrients vs Daily Value</div>
              {MICROS_V4.map(m=>{const v=tot[m.key]||0,p=Math.min((v/m.dv)*100,100);return(
                <div key={m.key} style={{marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:500}}>{m.label}</span><span style={{fontSize:10,color:m.color,fontWeight:600}}>{Math.round(v*10)/10}{m.unit} <span style={{color:T.textMuted,fontWeight:400}}>({Math.round(p)}%)</span></span></div>
                  <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:p>=80?T.success:p>=40?m.color:`${T.danger}80`,width:`${p}%`,transition:"width .6s"}}/></div>
                </div>
              );})}
            </div>
            <div style={{background:`${T.accent}06`,borderRadius:10,padding:"10px 12px",border:`1px solid ${T.accent}12`,fontSize:10,color:T.textMuted,lineHeight:1.5}}><span style={{color:T.accent,fontWeight:700}}>IRONMAN Tip:</span> Red = below 40% DV. Endurance athletes need extra iron, Mg, Na & K.</div>
          </>)}
        </div>
      )}

      <div style={{height:30}}/>
      <style>{`
        @keyframes nutrSpin{to{transform:rotate(360deg)}}
        @keyframes nutrFadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOKEN SCREEN
// ═══════════════════════════════════════════════════════════════
const TOKEN_DATA = {
  name: "Triveni", symbol: "TRV", maxSupply: "100,000,000",
  initialMint: "10,000,000", network: "Polygon (MATIC)",
  allocations: [
    { label: "Reward Pool", pct: 60, amount: "60M", color: T.body, desc: "Minted via user rewards" },
    { label: "Dev & Marketing", pct: 20, amount: "20M", color: T.spirit, desc: "Vested over 2 years" },
    { label: "Initial Treasury", pct: 10, amount: "10M", color: T.accent, desc: "Minted at deployment" },
    { label: "Community/Airdrops", pct: 10, amount: "10M", color: T.nutr, desc: "Growth initiatives" },
  ],
  activities: [
    { name: "Workout", emoji: "🏋️", base: 10 },
    { name: "Meditation", emoji: "🧘", base: 5 },
    { name: "Nutrition Goal", emoji: "🥗", base: 8 },
    { name: "Swim", emoji: "🏊", base: 15 },
    { name: "Run", emoji: "🏃", base: 12 },
    { name: "Cycle", emoji: "🚴", base: 12 },
    { name: "IRONMAN Training", emoji: "🔱", base: 25 },
  ],
  streaks: [
    { days: 7, mult: 1.2, label: "7-day" },
    { days: 30, mult: 1.5, label: "30-day" },
    { days: 100, mult: 2.0, label: "100-day" },
    { days: 365, mult: 3.0, label: "365-day" },
  ],
};

function TokenScreen() {
  const [sub, setSub] = useState("overview");
  // Simulated wallet state
  const wallet = { balance: 247.5, earned: 312.0, burned: 64.5, streak: 12, dailyUsed: 22.5 };

  return (
    <div style={{ padding: "0 20px" }}>
      <PH icon={I.Token} title="TRV Token" subtitle="Wellness rewards on Polygon" color={T.accent} />
      <STabs tabs={["overview", "rewards", "wallet"]} active={sub} onChange={setSub} color={T.accent} />

      {/* ── OVERVIEW TAB ── */}
      {sub === "overview" && <>
        {/* Hero Card */}
        <div style={{ background: `linear-gradient(135deg,${T.accent}14,${T.card})`, border: `1px solid ${T.accent}30`, borderRadius: T.radius.xl, padding: 22, marginBottom: 18, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -20, fontSize: 100, opacity: 0.04 }}>🔱</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `${T.accent}18`, border: `2px solid ${T.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔱</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: T.font.display }}>{TOKEN_DATA.name}</div>
              <div style={{ fontSize: 12, color: T.accent, fontWeight: 600, letterSpacing: "0.06em" }}>${TOKEN_DATA.symbol}</div>
            </div>
            <div style={{ marginLeft: "auto", background: `${T.success}18`, border: `1px solid ${T.success}30`, borderRadius: T.radius.full, padding: "4px 10px" }}>
              <span style={{ fontSize: 10, color: T.success, fontWeight: 600 }}>● Polygon</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: `${T.bg}80`, borderRadius: T.radius.md, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Max Supply</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.font.mono }}>{TOKEN_DATA.maxSupply}</div>
            </div>
            <div style={{ background: `${T.bg}80`, borderRadius: T.radius.md, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Initial Mint</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.font.mono }}>{TOKEN_DATA.initialMint}</div>
            </div>
          </div>
        </div>

        {/* Tokenomics Breakdown */}
        <SH>Tokenomics</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: 16, marginBottom: 18 }}>
          {/* Stacked bar */}
          <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
            {TOKEN_DATA.allocations.map((a, i) => (
              <div key={i} style={{ width: `${a.pct}%`, background: a.color, transition: "width 0.6s" }} />
            ))}
          </div>
          {TOKEN_DATA.allocations.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < TOKEN_DATA.allocations.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: a.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.label}</div>
                <div style={{ fontSize: 10.5, color: T.textMuted }}>{a.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.pct}%</div>
                <div style={{ fontSize: 10, color: T.textDim }}>{a.amount} TRV</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <SH>Token Features</SH>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 18 }}>
          {[
            { emoji: "🔒", title: "Capped Supply", desc: "100M hard cap" },
            { emoji: "🔥", title: "Deflationary", desc: "Burn on purchases" },
            { emoji: "⏸️", title: "Pausable", desc: "Emergency freeze" },
            { emoji: "🛡️", title: "Anti-Abuse", desc: "1000 TRV/day cap" },
          ].map((f, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{f.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 10.5, color: T.textMuted }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Architecture */}
        <SH>How It Works</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, overflow: "hidden", marginBottom: 20 }}>
          {[
            { step: "1", title: "Complete Activity", desc: "Workout, meditate, or log nutrition", color: T.body },
            { step: "2", title: "Backend Verifies", desc: "Authorized relayer validates completion", color: T.spirit },
            { step: "3", title: "Mint TRV Reward", desc: "Tokens minted to your wallet on Polygon", color: T.accent },
            { step: "4", title: "Spend or Hold", desc: "Unlock premium features or accumulate", color: T.nutr },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.step}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div><div style={{ fontSize: 10.5, color: T.textMuted }}>{s.desc}</div></div>
            </div>
          ))}
        </div>
      </>}

      {/* ── REWARDS TAB ── */}
      {sub === "rewards" && <>
        {/* Activity Rewards */}
        <SH>Activity Rewards</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, overflow: "hidden", marginBottom: 18 }}>
          <div style={{ display: "flex", padding: "10px 14px", borderBottom: `1px solid ${T.border}`, background: `${T.bg}60` }}>
            <div style={{ flex: 1, fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Activity</div>
            <div style={{ width: 65, fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, textAlign: "right" }}>Base</div>
            <div style={{ width: 65, fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, textAlign: "right" }}>365-day</div>
          </div>
          {TOKEN_DATA.activities.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderBottom: i < TOKEN_DATA.activities.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 18, marginRight: 10 }}>{a.emoji}</span>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{a.name}</span>
              <span style={{ width: 65, fontSize: 13, fontWeight: 600, textAlign: "right", fontFamily: T.font.mono }}>{a.base}</span>
              <span style={{ width: 65, fontSize: 13, fontWeight: 700, textAlign: "right", fontFamily: T.font.mono, color: T.accent }}>{a.base * 3}</span>
            </div>
          ))}
        </div>

        {/* Streak Multipliers */}
        <SH>Streak Multipliers</SH>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
          {TOKEN_DATA.streaks.map((s, i) => {
            const isActive = wallet.streak >= s.days;
            return (
              <div key={i} style={{ background: isActive ? `${T.accent}12` : T.card, border: `1px solid ${isActive ? T.accent + "40" : T.border}`, borderRadius: T.radius.lg, padding: "14px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: isActive ? T.accent : T.textDim, fontFamily: T.font.mono }}>{s.mult}x</div>
                <div style={{ fontSize: 9.5, color: isActive ? T.accent : T.textMuted, marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                {isActive && <div style={{ fontSize: 8, color: T.success, marginTop: 4, fontWeight: 600 }}>✓ Active</div>}
              </div>
            );
          })}
        </div>

        {/* Current streak */}
        <div style={{ background: `linear-gradient(135deg,${T.accent}10,${T.card})`, border: `1px solid ${T.accent}28`, borderRadius: T.radius.xl, padding: 20, display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: `${T.accent}18`, border: `2px solid ${T.accent}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: T.accent }}><I.Fire /></span>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 2 }}>Current Streak</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: T.font.mono }}>{wallet.streak} <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>days</span></div>
            <div style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>1.2x multiplier active</div>
          </div>
        </div>

        {/* Daily Cap */}
        <SH>Daily Reward Cap</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.textMuted }}>Used today</span>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: T.font.mono }}>{wallet.dailyUsed} <span style={{ color: T.textDim }}>/ 1,000 TRV</span></span>
          </div>
          <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(wallet.dailyUsed / 1000) * 100}%`, background: `linear-gradient(90deg, ${T.body}, ${T.accent})`, borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 6 }}>{1000 - wallet.dailyUsed} TRV remaining today</div>
        </div>
      </>}

      {/* ── WALLET TAB ── */}
      {sub === "wallet" && <>
        {/* Balance Card */}
        <div style={{ background: `linear-gradient(135deg, ${T.accent}16, ${T.card})`, border: `1px solid ${T.accent}30`, borderRadius: T.radius.xl, padding: 24, textAlign: "center", marginBottom: 18, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, fontSize: 120, opacity: 0.03 }}>🔱</div>
          <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>TRV Balance</div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: T.font.mono, background: `linear-gradient(135deg, ${T.text} 30%, ${T.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>{wallet.balance.toFixed(1)}</div>
          <div style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>TRV</div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 18 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.success, fontFamily: T.font.mono }}>{wallet.earned.toFixed(0)}</div>
            <div style={{ fontSize: 9, color: T.textMuted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Earned</div>
          </div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.danger, fontFamily: T.font.mono }}>{wallet.burned.toFixed(0)}</div>
            <div style={{ fontSize: 9, color: T.textMuted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Burned</div>
          </div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.accent, fontFamily: T.font.mono }}>{wallet.streak}</div>
            <div style={{ fontSize: 9, color: T.textMuted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <SH>Recent Activity</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, overflow: "hidden", marginBottom: 18 }}>
          {[
            { type: "earn", activity: "Workout", amount: 12, time: "2h ago", emoji: "🏋️", streak: "7-day" },
            { type: "earn", activity: "Meditation", amount: 6, time: "4h ago", emoji: "🧘", streak: "7-day" },
            { type: "burn", activity: "Pro Analytics", amount: -15, time: "1d ago", emoji: "📊", streak: "" },
            { type: "earn", activity: "Run", amount: 14.4, time: "1d ago", emoji: "🏃", streak: "7-day" },
            { type: "earn", activity: "Nutrition Goal", amount: 9.6, time: "2d ago", emoji: "🥗", streak: "7-day" },
            { type: "burn", activity: "Coaching Session", amount: -25, time: "3d ago", emoji: "🎓", streak: "" },
            { type: "earn", activity: "IRONMAN Training", amount: 30, time: "3d ago", emoji: "🔱", streak: "7-day" },
          ].map((tx, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize: 20 }}>{tx.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{tx.activity}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{tx.time}{tx.streak ? ` · ${tx.streak} streak` : ""}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.font.mono, color: tx.type === "earn" ? T.success : T.danger }}>
                {tx.type === "earn" ? "+" : ""}{tx.amount} TRV
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <SH>Spend TRV</SH>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
          {[
            { name: "Advanced Analytics", cost: 50, emoji: "📊", desc: "Detailed performance insights" },
            { name: "AI Coaching Session", cost: 100, emoji: "🤖", desc: "Personalized workout plans" },
            { name: "Premium Meditations", cost: 30, emoji: "🎵", desc: "Exclusive guided sessions" },
            { name: "Challenge Entry", cost: 25, emoji: "🏆", desc: "Community competitions" },
          ].map((f, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: "14px 16px", display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{f.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{f.name}</div>
                <div style={{ fontSize: 10.5, color: T.textMuted }}>{f.desc}</div>
              </div>
              <button style={btnStyle(`${T.accent}15`, T.accent, { border: `1px solid ${T.accent}30`, fontSize: 11, padding: "6px 12px" })}>
                {f.cost} TRV
              </button>
            </div>
          ))}
        </div>

        {/* Contract Info */}
        <SH>Contract Info</SH>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.lg, padding: 16, marginBottom: 20 }}>
          {[
            { label: "Standard", value: "ERC-20" },
            { label: "Network", value: "Polygon (MATIC)" },
            { label: "Decimals", value: "18" },
            { label: "Max Supply", value: "100,000,000 TRV" },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 12, color: T.textMuted }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: T.font.mono }}>{item.value}</span>
            </div>
          ))}
        </div>
      </>}
      <div style={{ height: 30 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════
function ProfileScreen(){
  const week=[{d:"M",c:2100},{d:"T",c:1950},{d:"W",c:2300},{d:"T",c:2050},{d:"F",c:1800},{d:"S",c:0},{d:"S",c:0}];
  const mx=Math.max(...week.map(d=>d.c));
  return(<div style={{padding:"0 20px"}}>
    <div style={{paddingTop:50,paddingBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:60,height:60,borderRadius:T.radius.xl,background:`linear-gradient(135deg,${T.accent}30,${T.body}30)`,border:`2px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏃</div>
        <div><h1 style={{fontSize:22,fontFamily:T.font.display,fontWeight:600,margin:0}}>Anil</h1><p style={{fontSize:11.5,color:T.textMuted,margin:0}}>IRONMAN in training · 180cm · 85kg</p></div>
      </div>
    </div>
    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:22}}>
      {[{l:"Workouts",v:"47",c:T.body},{l:"Meditation",v:"12h",c:T.spirit},{l:"Streak",v:"12d",c:T.accent}].map((s,i)=>(
        <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.lg,padding:"15px 10px",textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:9.5,color:T.textMuted,marginTop:3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div></div>
      ))}
    </div>
    {/* Chart */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.xl,padding:18,marginBottom:18}}>
      <SH>This Week</SH>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:90,gap:7}}>
        {week.map((d,i)=>(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <div style={{width:"100%",height:mx>0?(d.c/mx)*75:3,minHeight:3,borderRadius:5,background:d.c>0?`linear-gradient(180deg,${T.body},${T.body}44)`:T.border,transition:"height 0.5s"}}/>
          <span style={{fontSize:10,color:i<5?T.textMuted:T.textDim,fontWeight:500}}>{d.d}</span>
        </div>))}
      </div>
      <div style={{display:"flex",justifyContent:"space-around",marginTop:14,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:T.body}}>4</div><div style={{fontSize:9,color:T.textMuted}}>Workouts</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:T.spirit}}>55m</div><div style={{fontSize:9,color:T.textMuted}}>Meditated</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:T.nutr}}>10.2k</div><div style={{fontSize:9,color:T.textMuted}}>Calories</div></div>
      </div>
    </div>
    {/* Achievements */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.xl,padding:18,marginBottom:18}}>
      <SH>Achievements ({ACHIEVEMENTS.filter(a=>a.earned).length}/{ACHIEVEMENTS.length})</SH>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {ACHIEVEMENTS.map((a,i)=>(<div key={i} style={{textAlign:"center",padding:"10px 3px",borderRadius:T.radius.md,background:a.earned?`${T.accent}08`:"transparent",border:`1px solid ${a.earned?T.accent+"28":T.border}`,opacity:a.earned?1:0.35,cursor:"pointer"}} title={a.label}>
          <div style={{fontSize:22,marginBottom:3}}>{a.emoji}</div><div style={{fontSize:8.5,color:T.textMuted,lineHeight:1.2}}>{a.label}</div>
        </div>))}
      </div>
    </div>
    {/* Goals */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.xl,padding:18,marginBottom:18}}>
      <SH>Current Goals</SH>
      {[{l:"IRONMAN November 2026",p:35,c:T.body,e:"🏊‍♂️"},{l:"Meditate 30 days straight",p:40,c:T.spirit,e:"🧘"},{l:"Reach 80kg body weight",p:60,c:T.nutr,e:"⚖️"}].map((g,i)=>(
        <div key={i} style={{marginBottom:i<2?12:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:12.5,fontWeight:500}}>{g.e} {g.l}</span><span style={{fontSize:11,color:g.c,fontWeight:700}}>{g.p}%</span></div>
          <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${g.p}%`,background:`linear-gradient(90deg,${g.c},${g.c}88)`,borderRadius:2}}/></div>
        </div>
      ))}
    </div>
    {/* Settings */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius.xl,overflow:"hidden",marginBottom:32}}>
      {["Health Goals","Notifications","Apple Health Sync","Connected Apps","Export Data","Help & Support"].map((it,i,a)=>(
        <button key={i} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none",color:T.text,fontSize:13.5,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:T.font.body}}>
          {it}<span style={{color:T.textDim}}><I.ChevR/></span>
        </button>
      ))}
    </div>
  </div>);
}
