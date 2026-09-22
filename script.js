// Interacciones del catálogo — no gestiona comentarios (los gestiona comments.js)
(function(){
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if(navToggle && nav){
    navToggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }

  const WA_NUMBER = '528112345678';
  const chips = document.querySelectorAll('.chip[data-filter]');
  const cards = document.querySelectorAll('#productGrid .card');

  function applyFilter(f){
    cards.forEach(c=>{
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hidden', !show);
    });
    chips.forEach(ch=>ch.classList.toggle('active', ch.dataset.filter === f));
  }
  chips.forEach(ch=>ch.addEventListener('click',()=>applyFilter(ch.dataset.filter)));

  document.querySelectorAll('[data-goto-filter]').forEach(link=>{
    link.addEventListener('click',()=>applyFilter(link.dataset.gotoFilter));
  });

  // Botones pedir: arman mensaje de WhatsApp con el producto
  document.querySelectorAll('.js-order').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const product = a.dataset.product || 'producto del catálogo';
      const text = 'Hola, me interesa: ' + product + '. ¿Me confirma precio y disponibilidad?';
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    });
  });

  // Formulario cotizador
  const form = document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const name = document.getElementById('qName').value.trim();
      const interest = document.getElementById('qInterest').value;
      const msg = document.getElementById('qMsg').value.trim();
      let text = 'Hola, soy ' + (name || 'visitante del sitio') + '. Me interesa: ' + interest + '.';
      if(msg) text += ' Detalle: ' + msg;
      text += ' (Horario Lun-Sab 9am-7pm, Monterrey)';
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  // Año dinámico si se requiere a futuro (footer es 2026 por defecto)
})();
