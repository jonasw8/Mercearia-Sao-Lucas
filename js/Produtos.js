(function(){
  const STORAGE_KEY = 'mercearia_cart_v1';

  // utilidades
  const formatBRL = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  // DOM
  const openBtn = document.getElementById('open-cart-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const drawer = document.getElementById('cart-drawer');
  const itemsWrap = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const countEl = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearBtn = document.getElementById('clear-cart-btn');

  // estado
  let cart = loadCart();

  // inicial render
  updateCartUI();

  // abrir/fechar drawer
  openBtn.addEventListener('click', () => {
    drawer.style.right = '0';
    drawer.setAttribute('aria-hidden','false');
  });
  closeBtn.addEventListener('click', closeDrawer);
  function closeDrawer(){
    drawer.style.right = '-420px';
    drawer.setAttribute('aria-hidden','true');
  }

  // liga add-to-cart dos seus botões
  document.querySelectorAll('.product-card .add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(){
      const card = btn.closest('.product-card');
      if(!card) return;
      const id = card.dataset.id || card.getAttribute('data-id');
      const name = card.dataset.name || card.getAttribute('data-name') || card.querySelector('.title')?.innerText || 'Produto';
      const price = parseFloat(card.dataset.price || card.getAttribute('data-price') || card.querySelector('.price')?.innerText?.replace(/[^0-9,.-]/g,'')?.replace(',','.') || 0);
      const unit = card.dataset.unit || card.getAttribute('data-unit') || '';

      addToCart({ id, name, price, unit, qty:1 });
      // feedback simples
      openBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 240 });
    });
  });

  // adicionar ao carrinho (cria ou atualiza item)
  function addToCart(product){
    if(!product.id) product.id = Date.now().toString();
    const idx = cart.findIndex(i => i.id == product.id);
    if(idx > -1){
      cart[idx].qty = (cart[idx].qty || 0) + (product.qty || 1);
    } else {
      cart.push({...product, qty: product.qty || 1});
    }
    saveCart();
    updateCartUI();
  }

  // remover item
  function removeItem(id){
    cart = cart.filter(i => i.id != id);
    saveCart();
    updateCartUI();
  }

  // alterar quantidade
  function changeQty(id, qty){
    const idx = cart.findIndex(i => i.id == id);
    if(idx === -1) return;
    cart[idx].qty = Math.max(1, Math.floor(qty) || 1);
    saveCart();
    updateCartUI();
  }

  // salvar e carregar
  function loadCart(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){
      return [];
    }
  }
  function saveCart(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch(e){
      console.error('Erro ao salvar cart', e);
    }
  }

  // render do carrinho
  function renderCartItems(){
    itemsWrap.innerHTML = '';
    if(cart.length === 0){
      itemsWrap.innerHTML = '<div style="text-align:center;color:#6b7280;margin-top:24px">Seu carrinho está vazio</div>';
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.gap = '12px';

      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;flex:1">
          <div style="width:52px;height:52px;border-radius:8px;background:#f5f7fb;display:flex;align-items:center;justify-content:center;font-size:20px;color:#374151">
            🛍
          </div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${escapeHtml(item.name)}</div>
            <div style="font-size:12px;color:#6b7280">${item.unit || ''}</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div style="font-weight:700;color:#0b6b2d">${formatBRL(item.price)}</div>
          <div style="display:flex;gap:6px;align-items:center">
            <input type="number" min="1" value="${item.qty}" data-id="${item.id}" style="width:62px;padding:6px;border-radius:6px;border:1px solid #eef2f6;font-size:13px" />
            <button data-remove="${item.id}" style="background:none;border:1px solid #fdecec;color:#d23a3a;padding:6px 8px;border-radius:6px;cursor:pointer">Remover</button>
          </div>
        </div>
      `;

      // eventos
      const qtyInput = row.querySelector('input[type="number"]');
      qtyInput.addEventListener('change', (e) => {
        changeQty(item.id, parseInt(e.target.value,10));
      });

      row.querySelector('[data-remove]').addEventListener('click', () => {
        removeItem(item.id);
      });

      itemsWrap.appendChild(row);
    });
  }

  // atualizar totais e contagem
  function updateCartUI(){
    renderCartItems();
    const subtotal = cart.reduce((s, it) => s + (it.price * (it.qty || 1)), 0);
    subtotalEl.textContent = formatBRL(subtotal);
    // frete fixo como exemplo (pode calcular por peso/região)
    shippingEl.textContent = cart.length ? formatBRL(0) : '—';
    countEl.textContent = cart.reduce((c, it) => c + (it.qty || 0), 0);
  }

  // limpar carrinho
  clearBtn.addEventListener('click', () => {
    if(!confirm('Deseja limpar todo o carrinho?')) return;
    cart = [];
    saveCart();
    updateCartUI();
  });

  // checkout (simulação)
  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0){
      alert('Seu carrinho está vazio.');
      return;
    }

    // sem backend: simulamos finalização
    const payload = {
      items: cart,
      subtotal: cart.reduce((s,it)=>s + it.price*(it.qty||1),0),
      createdAt: new Date().toISOString()
    };

    // se tiver backend: enviar via fetch para /api/checkout
    // fetch('/api/checkout',{method:'POST',headers:{'content-type':'application/json'},body: JSON.stringify(payload)})

    console.log('Payload de checkout (simulado):', payload);
    alert('Compra simulada! Veja o console para detalhes. Cart será limpo.');
    cart = [];
    saveCart();
    updateCartUI();
    closeDrawer();
  });

  // esc fecha drawer
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeDrawer();
  });

  // helper para evitar XSS simples
  function escapeHtml(str){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();