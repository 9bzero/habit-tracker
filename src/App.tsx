import{useState,useMemo}from'react'
  interface Habit{id:string;name:string;icon:string;color:string;completions:string[]}
  const uid=()=>Math.random().toString(36).slice(2,8)
  const today=()=>new Date().toISOString().slice(0,10)
  const past=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
  const dayLabel=(s:string)=>new Date(s+"T12:00:00").toLocaleDateString("en",{weekday:"short"})
  const ICONS=["💪","📚","💧","🏃","🧘","🎯","🍎","😴","✍️","🎸","🌿","💊"]
  const COLORS=["#0ea5e9","#22c55e","#f59e0b","#ef4444","#a855f7","#ec4899","#06b6d4","#84cc16"]
  const INIT:Habit[]=[
    {id:uid(),name:"Exercise",icon:"💪",color:"#0ea5e9",completions:[today(),past(1),past(2),past(4),past(5)]},
    {id:uid(),name:"Read 30min",icon:"📚",color:"#22c55e",completions:[today(),past(1),past(3),past(6)]},
    {id:uid(),name:"Drink Water",icon:"💧",color:"#38bdf8",completions:[today(),past(1),past(2),past(3)]},
    {id:uid(),name:"Meditate",icon:"🧘",color:"#a855f7",completions:[past(1),past(2),past(5)]},
  ]
  const DAYS=7
  export default function App(){
    const[habits,setHabits]=useState<Habit[]>(INIT)
    const[name,setName]=useState("")
    const[icon,setIcon]=useState(ICONS[0])
    const[color,setColor]=useState(COLORS[0])
    const dates=Array.from({length:DAYS},(_,i)=>past(DAYS-1-i))
    const toggle=(id:string,date:string)=>{
      setHabits(hs=>hs.map(h=>{
        if(h.id!==id)return h
        const has=h.completions.includes(date)
        return{...h,completions:has?h.completions.filter(d=>d!==date):[...h.completions,date]}
      }))
    }
    const add=()=>{if(!name.trim())return;setHabits(h=>[...h,{id:uid(),name:name.trim(),icon,color,completions:[]}]);setName("")}
    const streak=(h:Habit)=>{let s=0,d=new Date();while(h.completions.includes(d.toISOString().slice(0,10))){s++;d.setDate(d.getDate()-1)}return s}
    const weekly=(h:Habit)=>dates.filter(d=>h.completions.includes(d)).length
    const totalToday=useMemo(()=>habits.filter(h=>h.completions.includes(today())).length,[habits])
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
            <h1 style={{fontWeight:800,fontSize:"1.75rem",color:"#f8fafc"}}>✅ Habit Tracker</h1>
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"0.6rem 1.25rem",textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:"1.4rem",color:"#22c55e"}}>{totalToday}/{habits.length}</div>
              <div style={{color:"#475569",fontSize:"0.73rem"}}>Today</div>
            </div>
          </div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:"1.25rem",marginBottom:"1.5rem"}}>
            <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center",marginBottom:"0.75rem"}}>
              <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="New habit name..." style={{flex:1,minWidth:150,background:"#0f172a",border:"1px solid #334155",borderRadius:6,padding:"0.5rem 0.75rem",color:"#e2e8f0",outline:"none",fontSize:"0.9rem"}}/>
              <div style={{display:"flex",gap:"0.35rem"}}>
                {ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{width:28,height:28,background:icon===ic?"#1e40af":"#1e293b",border:"none",borderRadius:4,cursor:"pointer",fontSize:"0.9rem"}}>{ic}</button>)}
              </div>
            </div>
            <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
              {COLORS.map(c=><button key={c} onClick={()=>setColor(c)} style={{width:20,height:20,borderRadius:"50%",background:c,border:"2px solid "+(color===c?"#fff":"transparent"),cursor:"pointer"}}/>)}
              <button onClick={add} style={{marginLeft:"auto",padding:"0.5rem 1.25rem",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:"0.85rem"}}>+ Add Habit</button>
            </div>
          </div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr repeat(7,40px) 56px 56px",gap:0,borderBottom:"1px solid #1e293b"}}>
              <div style={{padding:"0.6rem 1rem",color:"#475569",fontSize:"0.75rem",fontWeight:600}}>HABIT</div>
              {dates.map(d=><div key={d} style={{padding:"0.6rem 0",textAlign:"center",color:d===today()?"#38bdf8":"#475569",fontSize:"0.72rem",fontWeight:600}}>{dayLabel(d)}</div>)}
              <div style={{padding:"0.6rem 0",textAlign:"center",color:"#475569",fontSize:"0.72rem",fontWeight:600}}>🔥</div>
              <div style={{padding:"0.6rem 0",textAlign:"center",color:"#475569",fontSize:"0.72rem",fontWeight:600}}>7D</div>
            </div>
            {habits.map(h=>(
              <div key={h.id} style={{display:"grid",gridTemplateColumns:"1fr repeat(7,40px) 56px 56px",gap:0,borderBottom:"1px solid #0f172a",alignItems:"center"}}>
                <div style={{padding:"0.75rem 1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                  <span style={{fontSize:"1.1rem"}}>{h.icon}</span>
                  <span style={{fontWeight:500,fontSize:"0.9rem",color:"#f1f5f9"}}>{h.name}</span>
                </div>
                {dates.map(d=>{
                  const done=h.completions.includes(d)
                  return<div key={d} style={{display:"flex",alignItems:"center",justifyContent:"center"}}><button onClick={()=>toggle(h.id,d)} style={{width:26,height:26,borderRadius:"50%",background:done?h.color:"#1e293b",border:"2px solid "+(done?h.color:"#334155"),cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem"}}>{done?"✓":""}</button></div>
                })}
                <div style={{textAlign:"center",fontWeight:700,color:"#f59e0b",fontSize:"0.9rem"}}>{streak(h)||"—"}</div>
                <div style={{textAlign:"center",fontWeight:700,color:"#94a3b8",fontSize:"0.9rem"}}>{weekly(h)}/7</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }