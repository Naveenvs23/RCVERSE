import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, PackageCheck } from "lucide-react";
import ProductImage from "../components/ProductImage";
import { fetchOrders, fetchOrderById, fetchOrderByNumber, patchOrder } from "../store/slices/ordersSlice";

// keep currency and date formatting in one place so all order screens agree.
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "—";
// render each saved item using the product photo helper and the values stored
// in the order snapshot, not the current cart.
function ProductRows({order}) { return <div className="order-products">{(order.items || []).map((item)=><div className="order-product" key={item.id}><ProductImage product={item}/><div><strong>{item.name}</strong><small>Qty {item.quantity}</small></div><span>{money(item.price)} each</span><b>{money(item.price*item.quantity)}</b></div>)}</div>; }
function Status({value}) { return <span className={`order-status ${value === "Delivered" ? "success" : "progress"}`}>{value}</span>; }

// fetch this user's orders when the page opens. the status branches show loading,
// retry, order rows, or an empty message rather than a blank page.
export function OrdersPage(){const dispatch=useDispatch();const user=useSelector((state)=>state.auth.user);const {items,status,error}=useSelector((state)=>state.orders);useEffect(()=>{if(user?.id)dispatch(fetchOrders(user.id));},[dispatch,user?.id]);if(status==="loading"||status==="idle")return <main className="store-page order-page"><div className="empty-state">LOADING YOUR ORDERS…</div></main>;if(status==="failed")return <main className="store-page order-page"><div className="empty-state"><h2>Couldn’t load orders</h2><p>{error}</p><button className="primary-button" onClick={()=>dispatch(fetchOrders(user.id))}>RETRY</button></div></main>;return <main className="store-page order-page"><div className="page-intro"><span className="eyebrow">DRIVER ACCOUNT / PURCHASE HISTORY</span><h1>MY ORDERS</h1><p>{items.length} {items.length===1?"order":"orders"}</p></div>{items.length?<div className="order-list">{items.map((order)=><article className="order-card" key={order.id}><header><div><span className="eyebrow">ORDER NUMBER</span><h2>{order.orderNumber || order.id}</h2></div><Status value={order.status}/></header><div className="order-card-meta"><span>Placed {formatDate(order.createdAt)}</span><span>{order.items?.length || 0} product types</span><strong>{money(order.total)}</strong></div><ProductRows order={order}/><div className="order-card-actions"><Link className="primary-button" to={`/orders/${order.id}`}>VIEW ORDER DETAILS</Link><Link className="secondary-button" to={`/track-order/${encodeURIComponent(order.orderNumber || order.id)}`}>TRACK ORDER</Link></div></article>)}</div>:<div className="empty-state"><PackageCheck/><h2>No orders yet</h2><p>Your completed checkouts will appear here.</p><Link className="primary-button" to="/products">SHOP THE GARAGE</Link></div>}</main>}

// order details may reuse an order already in redux. the user id check prevents
// displaying another demo account's delivery information.
export function OrderDetailsPage(){const {orderId}=useParams();const dispatch=useDispatch();const listed=useSelector((state)=>state.orders.items.find((item)=>String(item.id)===orderId));const selected=useSelector((state)=>String(state.orders.selected?.id)===orderId?state.orders.selected:null);const user=useSelector((state)=>state.auth.user);const candidate=listed||selected;const order=candidate&&String(candidate.userId)===String(user?.id)?candidate:null;const status=useSelector((state)=>state.orders.detailStatus);const error=useSelector((state)=>state.orders.error);useEffect(()=>{if(!order)dispatch(fetchOrderById(orderId));},[dispatch,order,orderId]);if(!order&&status==="loading")return <main className="store-page empty-state">LOADING ORDER…</main>;if(!order)return <main className="store-page empty-state"><h1>ORDER NOT FOUND</h1><p>{error}</p><Link to="/orders">Back to My Orders</Link></main>;return <main className="store-page order-page"><Link className="back-link" to="/orders">← MY ORDERS</Link><div className="page-intro"><span className="eyebrow">ORDER DETAILS</span><h1>{order.orderNumber || order.id}</h1><p>Placed {formatDate(order.createdAt)} · <Status value={order.status}/></p></div><div className="order-detail-grid"><section className="checkout-card"><h2>ITEMS ORDERED</h2><ProductRows order={order}/><div className="summary-total"><span>Order total</span><strong>{money(order.total)}</strong></div></section><aside className="checkout-card order-facts"><h2>DELIVERY & PAYMENT</h2><p><b>Ship to</b><br/>{order.shippingInfo?.name}<br/>{order.shippingInfo?.address}<br/>{order.shippingInfo?.city} · {order.shippingInfo?.pin}</p><p><b>Payment method</b><br/>{order.paymentMethod}</p><p><b>Payment status</b><br/>{order.paymentStatus}</p><Link className="primary-button" to={`/track-order/${encodeURIComponent(order.orderNumber || order.id)}`}>TRACK THIS ORDER</Link></aside></div></main>}

const deliveryStages = ["Order Placed", "Order Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
// each stage matches a value saved in the order's history timeline.
export function TrackOrderPage() {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selected = useSelector((state) => state.orders.selected);
  const detailStatus = useSelector((state) => state.orders.detailStatus);
  const error = useSelector((state) => state.orders.error);
  const order = selected && String(selected.orderNumber || selected.id) === orderNumber && String(selected.userId) === String(user?.id) ? selected : null;
  const [updating, setUpdating] = useState(false);

  useEffect(() => { dispatch(fetchOrderByNumber(orderNumber)); }, [dispatch, orderNumber]);

  // the current status determines the progress bar and next simulated event.
  const currentIndex = deliveryStages.indexOf(order?.status);
  const terminal = ["Cancelled", "Payment Failed"].includes(order?.status);
  const advanceStatus = async () => {
    // stop if the order cannot advance, then append a timestamped status event.
    if (!order || updating || terminal || currentIndex < 0 || currentIndex >= deliveryStages.length - 1) return;
    setUpdating(true);
    const nextStatus = deliveryStages[currentIndex + 1];
    const history = [...(order.trackingHistory || []), { status: nextStatus, date: new Date().toISOString() }];
    await dispatch(patchOrder({ id: order.id, changes: { status: nextStatus, trackingHistory: history } }));
    setUpdating(false);
  };

  if (detailStatus === "loading" || detailStatus === "idle") return <main className="store-page empty-state">LOADING TRACKING DETAILS…</main>;
  if (!order) return <main className="store-page empty-state"><h1>ORDER NOT FOUND</h1><p>{error || "This order could not be found for your account."}</p><button className="secondary-button" onClick={() => dispatch(fetchOrderByNumber(orderNumber))}>RETRY</button><Link to="/orders">MY ORDERS</Link></main>;

  const history = order.trackingHistory || [];
  return <main className="store-page order-page"><Link className="back-link" to={`/orders/${order.id}`}>← ORDER DETAILS</Link><div className="page-intro"><span className="eyebrow">DELIVERY STATUS</span><h1>TRACK {order.orderNumber || order.id}</h1><p>Placed {formatDate(order.createdAt)} · <Status value={order.status}/></p></div><section className="tracking-card"><div className="tracking-overview"><div><span className="eyebrow">CURRENT STATUS</span><strong>{order.status}</strong><span>Payment: {order.paymentStatus}</span></div><div className="tracking-progress"><span>DEMO DELIVERY PROGRESS</span><div><i style={{ width: `${Math.max(0, currentIndex) / (deliveryStages.length - 1) * 100}%` }}/></div></div></div>{terminal ? <div className="cancelled-note">This demo order is marked {order.status}.</div> : <div className="tracking-timeline">{deliveryStages.map((stage, index) => { const event = history.find((item) => item.status === stage); const complete = index < currentIndex; const current = index === currentIndex; return <div className={`timeline-stage ${complete ? "completed" : ""} ${current ? "current" : ""}`} key={stage}><span className="timeline-marker">{complete ? "✓" : index + 1}</span><div className="timeline-content"><strong>{stage}</strong><small>{event ? formatDate(event.date) : current ? "In progress" : "Awaiting update"}</small></div></div>; })}</div>}<div className="tracking-footer"><p>This internship demo uses the order saved in JSON Server. Status updates below only simulate a delivery journey; there is no courier connection.</p>{!terminal && currentIndex < deliveryStages.length - 1 && <button className="primary-button" disabled={updating} onClick={advanceStatus}>{updating ? "SAVING STATUS…" : `SIMULATE NEXT: ${deliveryStages[currentIndex + 1].toUpperCase()}`}</button>}</div></section><section className="tracking-items"><h2>ITEMS IN THIS ORDER</h2><ProductRows order={order}/></section></main>;
}

// the success screen uses the saved backend order, not temporary checkout form data.
export function OrderSuccessPage(){const {orderId}=useParams();const dispatch=useDispatch();const listed=useSelector((state)=>state.orders.items.find((item)=>String(item.id)===orderId));const selected=useSelector((state)=>String(state.orders.selected?.id)===orderId?state.orders.selected:null);const user=useSelector((state)=>state.auth.user);const candidate=listed||selected;const order=candidate&&String(candidate.userId)===String(user?.id)?candidate:null;const status=useSelector((state)=>state.orders.detailStatus);useEffect(()=>{if(!order)dispatch(fetchOrderById(orderId));},[dispatch,order,orderId]);if(!order&&status==="loading")return <main className="store-page empty-state">LOADING ORDER…</main>;if(!order)return <main className="store-page empty-state"><h1>ORDER NOT FOUND</h1><Link to="/orders">MY ORDERS</Link></main>;return <main className="store-page order-page success-page"><div className="success-mark"><CheckCircle2 size={40}/></div><span className="eyebrow">MOCK ORDER COMPLETE</span><h1>ORDER SUCCESSFULLY PLACED</h1><p>Order <strong>{order.orderNumber || order.id}</strong> has been saved to the mock backend.</p><div className="success-summary"><span>Payment method<strong>{order.paymentMethod}</strong></span><span>Payment status<strong>{order.paymentStatus}</strong></span><span>Order total<strong>{money(order.total)}</strong></span><span>Order date<strong>{formatDate(order.createdAt)}</strong></span></div><ProductRows order={order}/><div className="order-card-actions"><Link className="primary-button" to={`/orders/${order.id}`}>VIEW ORDER DETAILS</Link><Link className="secondary-button" to={`/track-order/${encodeURIComponent(order.orderNumber || order.id)}`}>TRACK ORDER</Link><Link className="secondary-button" to="/orders">VIEW MY ORDERS</Link><Link className="secondary-button" to="/products">CONTINUE SHOPPING</Link></div></main>}
