const WHATSAPP_NUMBER = "528112345678";
const PHONE_DISPLAY = "81 1234 5678";

const productsEl = document.getElementById("products");
const filtersEl = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

let activeCategory = "Todos";
let searchTerm = "";
let cart = [];

function formatPrice(value) {
  return "$" + value.toLocaleString("es-MX");
}

function getCategories() {
  return ["Todos", ...CATALOG.categories];
}

function buildFilters() {
  getCategories().forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filter" + (i === 0 ? " is-active" : "");
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      document.querySelectorAll(".filter").forEach((f) => {
        f.classList.toggle("is-active", f.dataset.category === cat);
      });
      renderProducts();
    });
    filtersEl.appendChild(btn);
  });
}

function productIcon(product) {
  const cats = {
    Laptops: "\uD83D\uDCBB",
    Smartphones: "\uD83D\uDCF1",
    Audio: "\uD83C\uDFA7",
    Accesorios: "\uD83D\uDD0B",
    Gaming: "\uD83C\uDFAE",
    "Smart Home": "\uD83D\uDEFA"
  };
  return cats[product.category] || "\uD83D\uDCE6";
}

function productCard(product) {
  const icon = productIcon(product);
  const hot = product.hot
    ? '<span class="product__cat is-hot">Oferta</span>'
    : '<span class="product__cat">' + product.category + "</span>";
  const oldPrice = product.oldPrice
    ? '<small style="text-decoration:line-through;color:var(--muted);margin-right:0.4rem">' +
      formatPrice(product.oldPrice) + "</small>"
    : "";

  const card = document.createElement("article");
  card.className = "product";
  card.innerHTML =
    '<div class="product__media">' + icon + hot + "</div>" +
    '<div class="product__body">' +
      '<span class="product__brand">' + product.brand + "</span>" +
      '<h3 class="product__name">' + product.name + "</h3>" +
      '<p class="product__desc">' + product.description + "</p>" +
      '<div class="product__price">' + formatPrice(product.price) + " " + oldPrice + "</div>" +
      '<button class="btn btn--wa product__button" data-id="' + product.id + '">' +
        '<svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true"><path fill="#fff" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.6c1.2.5 2.5.8 3.8.8 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.1 0-2.2-.2-3.3-.6l-.6-.3-4.9 1 1-4.8-.4-.6c-1.6-2.3-2.4-5-2.4-7.6 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9 9.8zm5.4-7.3c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7-.1c-1-.5-1.8-1-2.5-2.1-.4-.6-.8-1.3-.7-1.5s.3-.5.5-.6l.5-.6c.1-.2.2-.3.3-.5v-.4c0-.2-.6-1.4-.8-1.9s-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>' +
        "Ordenar por WhatsApp" +
      "</button>" +
    "</div>";

  card.querySelector(".product__button").addEventListener("click", () => orderProduct(product.id, product.name));
  return card;
}

function getFilteredProducts() {
  return CATALOG.products.filter((p) => {
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const products = getFilteredProducts();
  productsEl.innerHTML = "";
  emptyState.hidden = products.length > 0;
  products.forEach((p) => productsEl.appendChild(productCard(p)));
}

function orderProduct(id, name) {
  const product = CATALOG.products.find((p) => p.id === id);
  if (!product) return;

  const price = formatPrice(product.price);
  const message =
    "Hola%2C%20quiero%20comprar%20este%20producto%3A%0A" +
    encodeURIComponent("- ") + encodeURIComponent(name) +
    "%0A" + encodeURIComponent("Precio: " + price) +
    "%0A%0A" + encodeURIComponent("Muchas gracias.");

  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message, "_blank", "noopener");
}

function handleSearch() {
  searchTerm = searchInput.value;
  renderProducts();
}

function toggleNav() {
  const nav = document.getElementById("nav");
  const btn = document.getElementById("navToggle");
  const isOpen = nav.classList.toggle("is-open");
  btn.setAttribute("aria-expanded", String(isOpen));
}

function setupNav() {
  document.getElementById("navToggle").addEventListener("click", toggleNav);
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("nav").classList.remove("is-open");
      document.getElementById("navToggle").setAttribute("aria-expanded", "false");
    });
  });
}

function setupBackTop() {
  const btn = document.getElementById("backTop");
  const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 400);
  window.addEventListener("scroll", onScroll);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

buildFilters();
setupNav();
setupBackTop();
searchInput.addEventListener("input", handleSearch);
renderProducts();