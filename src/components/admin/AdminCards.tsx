export function AdminStatCard({label,value,meta}:{label:string;value:string;meta?:string}){return <div className="card" style={{padding:18}}><p className="muted">{label}</p><h2>{value}</h2>{meta&&<p className="muted">{meta}</p>}</div>}
export function EmptyState({title}:{title:string}){return <div className="card" style={{padding:24}}><b>{title}</b><p className="muted">No matching records.</p></div>}
export function StatusBadge({status}:{status:string}){return <span className="badge">{status.replaceAll('_',' ')}</span>}
