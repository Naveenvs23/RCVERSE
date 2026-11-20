import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Check, X } from "lucide-react";

export default function ToastHost() {
  const [toast,setToast]=useState(null);const items=useSelector((s)=>s.cart.items);
  useEffect(()=>{const receive=(event)=>{setToast(event.detail);window.clearTimeout(receive.timer);receive.timer=window.setTimeout(()=>setToast(null),5000);};window.addEventListener("rcverse:toast",receive);return()=>{window.removeEventListener("rcverse:toast",receive);window.clearTimeout(receive.timer);};},[]);
  if(!toast)return null;
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  return <aside className="toast-card" role="status" aria-live="polite"><div className="toast-icon"><Check size={17}/></div><div className="toast-copy"><strong>{toast.title}</strong><span>{toast.product?.name||toast.message}</span>{toast.type==="cart"&&<><span>₹{toast.product.price.toLocaleString("en-IN")} · Qty {toast.quantity||1}</span><small>Cart subtotal: ₹{subtotal.toLocaleString("en-IN")}</small><Link to="/cart" onClick={()=>setToast(null)}>VIEW CART →</Link></>}</div><button type="button" aria-label="Dismiss notification" onClick={()=>setToast(null)}><X size={16}/></button></aside>;
}
