<meta name='viewport' content='width=device-width, initial-scale=1'/><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Competitive Exam Planner</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- PWA -->
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#1d4ed8">

<style>
body{margin:0;font-family:system-ui;background:#f1f5f9}
.container{max-width:1200px;margin:auto;padding:20px}
h1{text-align:center}
.quote{text-align:center;color:#64748b;font-style:italic}
.score,.streak{text-align:center;font-weight:700;margin:6px 0}

.card{
  position:relative;padding:20px;border-radius:16px;
  box-shadow:0 14px 35px rgba(0,0,0,.08);
  overflow:hidden;margin-bottom:20px;
}
.pending-bg::before{
  content:"";position:absolute;inset:0;
  background:
    linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)),
    url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f");
  background-size:cover;
}
.success-bg::before{
  content:"";position:absolute;inset:0;
  background:
    linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,.85)),
    url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee");
  background-size:cover;
}
.card>*{position:relative;z-index:1}

.lists{display:grid;grid-template-columns:1fr 1fr;gap:20px}
ul{list-style:none;padding:0}
li{
  display:flex;justify-content:space-between;align-items:center;
  padding:10px;border-bottom:1px solid #e5e7eb;cursor:grab
}
.time{color:#1d4ed8;font-weight:600}
.done{text-decoration:line-through;color:#64748b}

button{
  padding:6px 10px;border:none;border-radius:6px;
  font-weight:600;cursor:pointer
}
.set{background:#e0e7ff}
.doneBtn{background:#16a34a;color:white}
.skip{background:#64748b;color:white}
.del{background:#dc2626;color:white}

.graph{display:flex;gap:10px;align-items:flex-end;height:140px}
.bar{flex:1;background:#60a5fa;border-radius:6px 6px 0 0;font-size:12px;text-align:center}

footer{text-align:center;font-weight:600;color:#64748b;margin-top:30px}
@media(max-width:768px){.lists{grid-template-columns:1fr}}
</style>
</head>

<body>
<div class="container">
<h1>🔥 Competitive Exam Daily Planner</h1>
<p class="quote">"Hard work builds the ladder. Discipline climbs it."</p>

<div class="score" id="score"></div>
<div class="streak" id="streak"></div>

<div class="lists">
  <div id="pendingCard" class="card pending-bg">
    <h3>⏳ Pending Tasks</h3>
    <ul id="pending"></ul>
  </div>
  <div id="completedCard" class="card">
    <h3>✅ Completed Tasks</h3>
    <ul id="completed"></ul>
  </div>
</div>

<div class="card">
  <h3>📊 Weekly Discipline</h3>
  <div id="graph" class="graph"></div>
</div>

<footer>Made by <strong>Mahesh Surada</strong></footer>
</div>

<!-- Alarm sound -->
<audio id="alarmSound">
  <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=">
</audio>

<script>
/* ---------------- PWA SERVICE WORKER ---------------- */
if("serviceWorker"in navigator){
 navigator.serviceWorker.register("sw.js");
}

/* ---------------- CORE DATA ---------------- */
const today=new Date().toDateString();
const SPECIAL=["Watch YouTube tutorial","Cover specific topic"];
const OPTIONAL=["Speed boat sailing","Speedboat arrival","Evening ship sailing"];

const TASKS=[
 "Wake up","Current affairs on testbook","Daily vocab on ChatGPT","Breakfast",
 "Fresh up","Go to office","Reasoning mock test","Watch YouTube tutorial",
 "Make important notes","Lunch","Full mock test","Revise mock test",
 "Go to office (Evening)","Evening current affairs","Walking with Instagram",
 "Night fresh up","Cover specific topic","Dinner","Rest",
 "Watching reels (30 min)","Scrolling reels","Testbook mock (G.A)",
 "Alarm for tomorrow","Speed boat sailing","Speedboat arrival","Evening ship sailing"
];

let tasks=JSON.parse(localStorage.getItem("tasks"))||[];

if(!tasks.some(t=>t.date===today)){
 TASKS.forEach(t=>tasks.push({
  text:t,start:"",end:"",
  done:false,skipped:false,alerted:false,
  date:today
 }));
}

function save(){localStorage.setItem("tasks",JSON.stringify(tasks));}

/* ---------------- DISCIPLINE ---------------- */
function discipline(date){
 const d=tasks.filter(t=>t.date===date&&!t.skipped);
 return d.length?Math.round(d.filter(t=>t.done).length/d.length*100):0;
}
function streak(){
 let s=0;
 for(let i=0;i<30;i++){
  const d=new Date();d.setDate(d.getDate()-i);
  if(discipline(d.toDateString())>=70)s++; else break;
 }
 return s;
}

/* ---------------- RENDER ---------------- */
const pending=document.getElementById("pending");
const completed=document.getElementById("completed");
const completedCard=document.getElementById("completedCard");
const alarm=document.getElementById("alarmSound");

let dragFrom=null;

function render(){
 pending.innerHTML="";completed.innerHTML="";
 const todayTasks=tasks.filter(t=>t.date===today&&!t.skipped);
 const doneCount=todayTasks.filter(t=>t.done).length;

 todayTasks.forEach(task=>{
  const i=tasks.indexOf(task);
  const li=document.createElement("li");
  li.draggable=true;
  li.ondragstart=()=>dragFrom=i;
  li.ondragover=e=>e.preventDefault();
  li.ondrop=()=>{
   const item=tasks.splice(dragFrom,1)[0];
   tasks.splice(i,0,item);save();render();
  };
  li.innerHTML=`
   <div>
     <span class="time">${task.start&&task.end?`${task.start}-${task.end}`:"--"}</span>
     <span class="${task.done?"done":""}">${task.text}</span>
   </div>
   <div>
     <button class="set" onclick="setTime(${i})">Set</button>
     ${OPTIONAL.includes(task.text)?`<button class="skip" onclick="skip(${i})">No</button>`:""}
     ${!task.done?`<button class="doneBtn" onclick="done(${i})">✔</button>`:""}
     <button class="del" onclick="del(${i})">X</button>
   </div>`;
  (task.done?completed:pending).appendChild(li);
 });

 completedCard.className="card"+(doneCount===todayTasks.length?" success-bg":"");
 score.innerText=`Discipline Score: ${discipline(today)}%`;
 streakEl.innerText=`🔥 Streak: ${streak()} days`;
 renderGraph();
}

function renderGraph(){
 graph.innerHTML="";
 for(let i=6;i>=0;i--){
  const d=new Date();d.setDate(d.getDate()-i);
  const p=discipline(d.toDateString());
  const bar=document.createElement("div");
  bar.className="bar";
  bar.style.height=`${p}%`;
  bar.innerHTML=`${p}%<br>${d.toLocaleDateString('en',{weekday:'short'})}`;
  graph.appendChild(bar);
 }
}

/* ---------------- ACTIONS ---------------- */
function setTime(i){
 const s=prompt("Start time (HH:MM)"); if(!s)return;
 const e=prompt("End time (HH:MM)"); if(!e)return;
 if(SPECIAL.some(x=>tasks[i].text.startsWith(x))){
  const topic=prompt("Enter topic"); if(!topic)return;
  tasks[i].text+=` - ${topic}`;
 }
 tasks[i].start=s;tasks[i].end=e;save();render();
}
function skip(i){if(confirm("Skip today?")){tasks[i].skipped=true;save();render();}}
function done(i){tasks[i].done=true;save();render();}
function del(i){tasks.splice(i,1);save();render();}

/* ---------------- NOTIFICATIONS + ALARM ---------------- */
if("Notification"in window && Notification.permission!=="granted"){
 Notification.requestPermission();
}

setInterval(()=>{
 const now=new Date().toTimeString().slice(0,5);
 tasks.forEach(t=>{
  if(t.date===today&&!t.done&&!t.alerted&&t.start===now){
   t.alerted=true;save();
   alarm.play();
   if(navigator.vibrate) navigator.vibrate([300,200,300]);
   if(Notification.permission==="granted"){
    new Notification("📘 Task Reminder",{body:t.text});
   }
  }
 });
},60000);

const streakEl=document.getElementById("streak");
render();
</script>
</body>
</html><script>self.addEventListener("install",e=>{
 e.waitUntil(
  caches.open("planner-cache").then(c=>
   c.addAll(["index.html"])
  )
 );
});

self.addEventListener("fetch",e=>{
 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 );
});</script>
