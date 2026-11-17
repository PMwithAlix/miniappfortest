import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock3, Heart, Home, Info, ListOrdered, MapPin, Minus, Plus, Search, ShoppingBag, ShoppingCart, Sparkles, UserRound, X, Star, Leaf, ReceiptText, ChevronDown } from 'lucide-react';
import { categories, foods, money, sampleOrders, type Food, type Order } from './data';
import { initializeBaleApp } from './bale';

type CartItem = { food: Food; quantity: number };
type Page = 'home' | 'orders' | 'profile';
const initialApp = initializeBaleApp();
const greetingName = initialApp?.initDataUnsafe?.user?.first_name || 'علی';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [category, setCategory] = useState('همه');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Food | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [favorites, setFavorites] = useState<number[]>([2]);
  const [toast, setToast] = useState('');
  const [address, setAddress] = useState('ساختمان مرکزی · طبقه دوم');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const filtered = useMemo(() => foods.filter(food => (category === 'همه' || food.category === category) && food.name.includes(query.trim())), [category, query]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200); }
  function add(food: Food) { setCart(items => { const found = items.find(item => item.food.id === food.id); return found ? items.map(item => item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { food, quantity: 1 }]; }); notify('به سبد خرید اضافه شد'); }
  function changeQty(id: number, delta: number) { setCart(items => items.map(item => item.food.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0)); }
  function placeOrder() {
    if (!cart.length) return;
    const order: Order = { id: 'KH-1405-' + String(250 + orders.length).padStart(4, '0'), date: 'امروز · همین الان', items: cart, total, status: 'در حال آماده‌سازی', address };
    setOrders(current => [order, ...current]); setSuccess(order); setCart([]); setCheckout(false); setCartOpen(false);
  }
  function toggleFavorite(id: number) { setFavorites(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]); }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Leaf size={21}/></div><div><strong>مزه</strong><small>یه انتخاب خوشمزه</small></div></div>
      <div className="top-actions"><button className="icon-button" aria-label="سبد خرید" onClick={() => setCartOpen(true)}><ShoppingBag size={21}/>{count > 0 && <b className="count">{count}</b>}</button><button className="avatar" onClick={() => setPage('profile')}>ع</button></div>
    </header>

    <main>
      {page === 'home' && <div className="page-content">
        <section className="welcome"><div><span className="eyebrow">سه‌شنبه، ۲۶ آبان</span><h1>سلام {greetingName}،<br/>ناهارت رو انتخاب کردی؟ <span>👋</span></h1><p>امروز یه طعم خوب منتظرته.</p></div><div className="welcome-art">🍽️</div></section>
        <section className="meal-banner"><div className="banner-copy"><span className="banner-pill"><Sparkles size={13}/> پیشنهاد امروز</span><h2>طعم اصیل،<br/>حال خوب</h2><p>با انتخاب‌های تازه و خوشمزه</p><button onClick={() => { setCategory('غذای ایرانی'); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>دیدن پیشنهادها <ArrowLeft size={15}/></button></div><div className="banner-image"/></section>
        <section className="section-head" id="menu"><div><span className="eyebrow">با عشق آماده شده</span><h2>منوی امروز</h2></div><span className="open-status"><i/> سفارش‌گیری فعاله</span></section>
        <div className="searchbox"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="دنبال چی می‌گردی؟"/>{query && <button onClick={() => setQuery('')}><X size={16}/></button>}</div>
        <div className="categories">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="food-grid">{filtered.map(food => <FoodCard key={food.id} food={food} favorite={favorites.includes(food.id)} onFavorite={() => toggleFavorite(food.id)} onOpen={() => setSelected(food)} onAdd={() => add(food)}/>)}</div>
        {filtered.length === 0 && <div className="empty"><span>🍽️</span><b>چیزی پیدا نکردیم</b><p>عبارت دیگه‌ای رو امتحان کن.</p></div>}
        <div className="demo-note"><Info size={15}/> این یک محیط آزمایشی است؛ اطلاعات و سفارش‌ها واقعی نیستند.</div>
      </div>}

      {page === 'orders' && <div className="page-content subpage"><div className="page-title"><div><span className="eyebrow">همیشه در جریان باش</span><h1>سفارش‌های من</h1></div><span className="title-icon"><ReceiptText/></span></div><div className="order-list">{orders.map(order => <OrderCard key={order.id} order={order} onClick={() => setSuccess(order)}/>)}</div>{orders.length === 0 && <div className="empty">هنوز سفارشی ثبت نکردی.</div>}</div>}

      {page === 'profile' && <div className="page-content subpage"><div className="page-title"><div><span className="eyebrow">حساب کاربری آزمایشی</span><h1>پروفایل من</h1></div><span className="title-icon"><UserRound/></span></div><div className="profile-card"><div className="profile-avatar">ع</div><h2>{greetingName} حسینی</h2><p>کاربر نمونه · شناسه ۱۰۲۴</p><span className="member-tag"><Check size={14}/> حساب فعال</span></div><div className="settings-list"><button onClick={() => notify('این بخش در نسخه آزمایشی است')}><MapPin/> <span>آدرس تحویل<small>{address}</small></span><ChevronLeft/></button><button onClick={() => notify('اطلاعات حساب نمونه است')}><UserRound/><span>اطلاعات شخصی<small>نام و مشخصات حساب</small></span><ChevronLeft/></button><button onClick={() => notify('نسخه آزمایشی مزه · ۱.۰')}><Info/><span>درباره برنامه<small>نسخه آزمایشی Mini App</small></span><ChevronLeft/></button></div><div className="demo-note"><Info size={15}/> ورود و اطلاعات این حساب کاملاً نمایشی است.</div></div>}
    </main>

    <nav className="bottom-nav"><button className={page === 'home' ? 'selected' : ''} onClick={() => setPage('home')}><Home/><span>خانه</span></button><button className={page === 'orders' ? 'selected' : ''} onClick={() => setPage('orders')}><ListOrdered/><span>سفارش‌ها</span></button><button className="nav-cart" onClick={() => setCartOpen(true)}><span className="cart-nav-icon"><ShoppingCart/>{count > 0 && <b>{count}</b>}</span><span>سبد خرید</span></button><button className={page === 'profile' ? 'selected' : ''} onClick={() => setPage('profile')}><UserRound/><span>پروفایل</span></button></nav>

    {selected && <div className="overlay" onClick={() => setSelected(null)}><section className="sheet detail-sheet" onClick={e => e.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)}><X/></button><img className="detail-image" src={selected.image} alt={selected.name}/><div className="sheet-content"><div className="detail-meta"><span>{selected.category}</span><span><Star size={14} fill="currentColor"/> {selected.rating}</span><span><Clock3 size={14}/> {selected.time}</span></div><h2>{selected.name}</h2><p className="detail-desc">{selected.description}</p><div className="ingredients"><b>ترکیبات</b><div>{selected.ingredients.map(item => <span key={item}>{item}</span>)}</div></div><div className="detail-bottom"><div><strong>{money(selected.price)}</strong><small>{selected.calories} کالری</small></div><button className="primary-button" onClick={() => { add(selected); setSelected(null); }}>افزودن به سبد <Plus size={17}/></button></div></div></section></div>}

    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><section className="sheet cart-sheet" onClick={e => e.stopPropagation()}><div className="sheet-heading"><div><span className="eyebrow">انتخاب‌های خوشمزه تو</span><h2>سبد خرید <small>({count} مورد)</small></h2></div><button className="close-button static" onClick={() => setCartOpen(false)}><X/></button></div>{cart.length === 0 ? <div className="empty"><span>🛍️</span><b>سبدت هنوز خالیه</b><p>از منوی امروز یه چیزی انتخاب کن.</p><button className="primary-button" onClick={() => setCartOpen(false)}>رفتن به منو</button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-row" key={item.food.id}><img src={item.food.image} alt=""/><div className="cart-info"><b>{item.food.name}</b><strong>{money(item.food.price)}</strong><div className="qty"><button onClick={() => changeQty(item.food.id, -1)}><Minus size={14}/></button><b>{item.quantity}</b><button onClick={() => changeQty(item.food.id, 1)}><Plus size={14}/></button></div></div></div>)}</div><div className="cart-total"><div><span>جمع سفارش</span><b>{money(total)}</b></div><div><span>هزینه ارسال</span><b className="free">رایگان</b></div><div className="grand-total"><span>مبلغ قابل پرداخت</span><strong>{money(total)}</strong></div><button className="primary-button full" onClick={() => { setCartOpen(false); setCheckout(true); }}>ادامه و ثبت سفارش <ArrowLeft size={17}/></button></div></>}</section></div>}

    {checkout && <div className="overlay" onClick={() => setCheckout(false)}><section className="sheet checkout-sheet" onClick={e => e.stopPropagation()}><div className="sheet-heading"><div><span className="eyebrow">فقط یک قدم تا خوشمزگی</span><h2>تکمیل سفارش</h2></div><button className="close-button static" onClick={() => setCheckout(false)}><X/></button></div><label className="field-label">محل تحویل</label><button className="address-select" onClick={() => setAddress(a => a.includes('دوم') ? 'ساختمان مرکزی · طبقه سوم' : 'ساختمان مرکزی · طبقه دوم')}><MapPin/><span>{address}<small>برای تغییر، لمس کن</small></span><ChevronDown/></button><label className="field-label">روش پرداخت</label><div className="payment-option"><div className="payment-icon">💳</div><span>پرداخت اعتباری سازمانی<small>روش پرداخت نمونه</small></span><span className="radio-checked"><Check size={13}/></span></div><div className="checkout-summary"><span>مبلغ سفارش</span><b>{money(total)}</b></div><button className="primary-button full" onClick={placeOrder}>ثبت سفارش آزمایشی <ArrowLeft size={17}/></button><p className="fine-print">هیچ پرداخت واقعی انجام نمی‌شود.</p></section></div>}

    {success && <div className="overlay success-overlay" onClick={() => setSuccess(null)}><section className="sheet success-sheet" onClick={e => e.stopPropagation()}><button className="close-button" onClick={() => setSuccess(null)}><X/></button><div className="success-mark"><Check size={32}/></div><span className="eyebrow">همه‌چیز روبه‌راهه</span><h2>{success.status === 'در حال آماده‌سازی' ? 'سفارشت ثبت شد!' : 'جزئیات سفارش'}</h2><p>{success.status === 'در حال آماده‌سازی' ? 'داریم با عشق آماده‌اش می‌کنیم.' : 'این سفارش قبلاً تحویل داده شده است.'}</p><div className="order-ticket"><div><span>شماره سفارش</span><b>{success.id}</b></div><div><span>وضعیت</span><b className="status-text">{success.status}</b></div><div><span>مبلغ</span><b>{money(success.total)}</b></div></div><button className="primary-button full" onClick={() => { setSuccess(null); setPage('orders'); }}>مشاهده سفارش‌ها <ArrowLeft size={17}/></button><button className="text-button" onClick={() => setSuccess(null)}>بازگشت به منو</button></section></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}

function FoodCard({ food, favorite, onFavorite, onOpen, onAdd }: { food: Food; favorite: boolean; onFavorite: () => void; onOpen: () => void; onAdd: () => void }) {
  return <article className="food-card"><button className="food-image-button" onClick={onOpen}><img src={food.image} alt={food.name}/>{food.tag && <span className="food-tag">{food.tag}</span>}</button><button className={'favorite ' + (favorite ? 'liked' : '')} onClick={onFavorite} aria-label="علاقه‌مندی"><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/></button><div className="food-info"><button className="food-name" onClick={onOpen}>{food.name}</button><div className="food-rating"><Star size={13} fill="currentColor"/> {food.rating} <span>·</span> <Clock3 size={13}/> {food.time}</div><div className="food-card-bottom"><div className="food-price">{food.oldPrice && <del>{new Intl.NumberFormat('fa-IR').format(food.oldPrice)}</del>}<b>{new Intl.NumberFormat('fa-IR').format(food.price)} <small>تومان</small></b></div><button className="add-button" onClick={onAdd}><Plus size={18}/></button></div></div></article>;
}
function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return <button className="order-card" onClick={onClick}><div className="order-card-top"><span className="order-id">{order.id}</span><span className={order.status === 'در حال آماده‌سازی' ? 'status preparing' : 'status'}>{order.status}</span></div><div className="order-foods">{order.items.map(item => <img key={item.food.id} src={item.food.image} alt={item.food.name}/>)}<span>{order.items.reduce((n, i) => n + i.quantity, 0)} قلم غذا</span></div><div className="order-card-bottom"><span>{order.date}</span><b>{money(order.total)}</b><ChevronLeft size={17}/></div></button>;
}
