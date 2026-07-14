export const money=(v:number|string,c='USDT')=>`${new Intl.NumberFormat('en-US',{maximumFractionDigits:8}).format(Number(v))} ${c}`;
export const pct=(v:number)=>`${v>0?'+':''}${v.toFixed(2)}%`;
