const products = [
  {id:'p1',name:'Blush Balloon Arch Kit',price:1499,category:'decorations',tag:'Bestseller',desc:'A dreamy pastel party backdrop',image:'photo-1530103862676-de8c9debad1d'},
  {id:'p2',name:'Pastel Birthday Table Set',price:899,category:'decorations',tag:'Party favourite',desc:'Plates, cups & all the pretty bits',image:'photo-1464366400600-7168b8af9bc3'},
  {id:'p3',name:'Enchanted Garden Decor',price:2299,category:'decorations',tag:'New',desc:'A little garden party magic',image:'photo-1492684223066-81342ee5ff30'},
  {id:'p4',name:'Golden Confetti Pack',price:299,category:'decorations',tag:'Little treat',desc:'The finishing sparkle for your day',image:'photo-1513151233558-d860c5398176'},
  {id:'p5',name:'The Birthday Bliss Hamper',price:1899,category:'gift-hampers',tag:'Bestseller',desc:'Sweet treats, candles & happy things',image:'photo-1549465220-1a8b9238cd48'},
  {id:'p6',name:'Little Sunshine Gift Box',price:1299,category:'gift-hampers',tag:'Thoughtful gift',desc:'A bright box for someone lovely',image:'photo-1513475382585-d06e58bcb0e0'},
  {id:'p7',name:'Mini Party Favour Set',price:699,category:'gift-hampers',tag:'For your guests',desc:'A sweet thank-you for little guests',image:'photo-1531058020387-3be344556be6'},
  {id:'p8',name:'Celebration Treat Hamper',price:2499,category:'gift-hampers',tag:'Premium pick',desc:'A generous bundle of birthday joy',image:'photo-1607344645866-009c320b63e0'}
];

let cart = JSON.parse(localStorage.getItem('confetti-cart') || '{}');
let currentFilter = 'all';

function money(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function imgSrc(id) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;
}

function productCard(p) {
  return `
    <article class="product">
      <div class="product-img">
        <img loading="lazy" src="${imgSrc(p.image)}" alt="${p.name}">
        <span class="tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">＋ Add to cart</button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  document.getElementById('featuredGrid').innerHTML =
    products.slice(0, 4).map(productCard).join('');

  const filtered = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);

  document.getElementById('productsGrid').innerHTML =
    filtered.map(productCard).join('');

  document.querySelectorAll('.filter').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === currentFilter);
  });

  const options = products.map(product =>
    `<option value="${product.name}">${product.name}</option>`
  ).join('');

  document.getElementById('bookItem').innerHTML =
    '<option value="">Choose an item or category</option>' +
    '<optgroup label="Products">' + options + '</optgroup>' +
    '<optgroup label="Categories">' +
      '<option>Balloon Decoration</option>' +
      '<option>Theme Decoration</option>' +
      '<option>Birthday Gift Hamper</option>' +
      '<option>Return Gifts</option>' +
    '</optgroup>';
}

function saveCart() {
  localStorage.setItem('confetti-cart', JSON.stringify(cart));
  renderCart();
  updateCount();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  showToast('Added to your cart ✨');
}

function updateCount() {
  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');

  if (!entries.length) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🛍️</div>
        <h3>Your cart is waiting for a little joy</h3>
        <p>Find something lovely for your next celebration.</p>
        <button class="btn" onclick="navigate('products')">Explore Products&nbsp; →</button>
      </div>`;
    summary.style.display = 'none';
    return;
  }

  summary.style.display = 'block';
  let total = 0;

  list.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    if (!product) return '';

    total += product.price * quantity;
    return `
      <article class="cart-row">
        <img src="${imgSrc(product.image)}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <small>${money(product.price)} each</small>
          <div class="quantity">
            <button aria-label="Decrease quantity" onclick="changeQty('${id}', -1)">−</button>
            <strong>${quantity}</strong>
            <button aria-label="Increase quantity" onclick="changeQty('${id}', 1)">+</button>
          </div>
          <button class="remove" onclick="removeItem('${id}')">Remove</button>
        </div>
        <strong>${money(product.price * quantity)}</strong>
      </article>`;
  }).join('');

  document.getElementById('subtotal').textContent = money(total);
  document.getElementById('total').textContent = money(total);
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  showToast('Removed from your cart');
}

function navigate(id) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === id);
  });
  document.querySelectorAll('.navlinks a').forEach(link => {
    link.classList.toggle('active', link.dataset.page === id);
  });
  document.getElementById('navlinks').classList.remove('open');
  window.scrollTo({top: 0, behavior: 'smooth'});
  history.replaceState(null, '', '#' + id);
  if (id === 'cart') renderCart();
  if (id === 'blog') closePost();
}

document.querySelectorAll('.navlinks a, .footer-links a[data-page]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    navigate(link.dataset.page);
  });
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    renderProducts();
  });
});

function filterAndGo(filter) {
  currentFilter = filter;
  navigate('products');
  renderProducts();
}

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('navlinks').classList.toggle('open');
});

function openBooking(item = '') {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('bookingPanel').classList.add('open');
  document.body.style.overflow = 'hidden';

  if (item && !products.some(product => product.name === item)) {
    document.getElementById('bookItem').value = '';
  }
}

function closeBooking() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('bookingPanel').classList.remove('open');
  document.body.style.overflow = '';

  setTimeout(() => {
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('bookingSuccess').classList.remove('show');
  }, 350);
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeBooking();
});

document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();

  const mobile = document.getElementById('bookMobile').value.trim();
  const email = document.getElementById('bookEmail').value.trim();

  if (!mobile && !email) {
    showToast('Please add a mobile number or email');
    return;
  }

  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').classList.add('show');
  setTimeout(closeBooking, 2600);
});

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  event.target.reset();
  showToast('Thanks for your message! We’ll be in touch 💌');
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ---------- Blog ----------
   Naya blog jodne ke liye neeche 'blogs' array mein ek aur object add karo.
   Sabse upar wala blog sabse pehle dikhta hai. */
const blogs = [
  {
    id: 'pastel-birthday-decor-ideas',
    title: '5 Pastel Birthday Decoration Ideas You Can Set Up at Home',
    date: '23 Nov 2026',
    category: 'Decor ideas',
    readTime: '4 min read',
    image: 'photo-1530103862676-de8c9debad1d',
    excerpt: 'Simple, pretty ways to turn your living room into a dreamy party space without any stress.',
    content: `
      <p>You do not need a big budget to make a birthday feel special. A few thoughtful details, put together with care, can change the whole look of a room.</p>
      <h2>1. Start with a balloon backdrop</h2>
      <p>A balloon arch or garland behind the cake table gives you an instant photo corner. Stick to two or three soft colours so it looks neat and matching.</p>
      <h2>2. Style the cake table</h2>
      <p>Keep the table simple: a table cover, cake, a few cupcakes and a small welcome board. Leave some space so the cake stays the star.</p>
      <h2>3. Add a touch of gold</h2>
      <p>Golden confetti, a topper or a few foil balloons add sparkle without making the decor look heavy.</p>
      <h2>4. Think about the little guests</h2>
      <ul>
        <li>Set out matching plates and cups</li>
        <li>Prepare small party favours for return gifts</li>
        <li>Keep a corner free for games</li>
      </ul>
      <h2>5. Plan ahead</h2>
      <p>Set up the backdrop and table the day before if you can. On the party day you will have time to enjoy the celebration too.</p>
      <div class="post-cta">
        <h3>Want help planning your celebration?</h3>
        <p>Tell us your theme and we will help you pick the right decor and gifts.</p>
        <button class="btn" onclick="openBooking()">Book Now&nbsp; →</button>
      </div>`
  }
];

function blogCard(b) {
  return `
    <button class="blog-card" onclick="openPost('${b.id}')">
      <div class="blog-img"><img loading="lazy" src="${imgSrc(b.image)}" alt="${b.title}"></div>
      <div class="blog-body">
        <div class="blog-meta">${b.category} · ${b.date} · ${b.readTime}</div>
        <h3>${b.title}</h3>
        <p>${b.excerpt}</p>
        <span class="read-more">Read more →</span>
      </div>
    </button>`;
}

function renderBlogs() {
  document.getElementById('blogGrid').innerHTML = blogs.map(blogCard).join('');
}

function openPost(id) {
  const b = blogs.find(item => item.id === id);
  if (!b) return;
  document.getElementById('blogPost').innerHTML = `
    <button class="text-link back" onclick="closePost()">← Back to all posts</button>
    <div class="eyebrow">${b.category} · ${b.date} · ${b.readTime}</div>
    <h1>${b.title}</h1>
    <img class="post-cover" src="${imgSrc(b.image).replace('w=700','w=1400')}" alt="${b.title}">
    <div class="post-body">${b.content}</div>`;
  document.getElementById('blogList').style.display = 'none';
  document.getElementById('blogPost').style.display = 'block';
  document.title = b.title + ' | Confetti & Co.';
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function closePost() {
  document.getElementById('blogPost').style.display = 'none';
  document.getElementById('blogList').style.display = 'block';
  window.scrollTo({top: 0, behavior: 'smooth'});
}

renderProducts();
renderBlogs();
renderCart();
updateCount();

if (location.hash && ['home', 'products', 'blog', 'cart', 'about', 'contact'].includes(location.hash.slice(1))) {
  navigate(location.hash.slice(1));
}
