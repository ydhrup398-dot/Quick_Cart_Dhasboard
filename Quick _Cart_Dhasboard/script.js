const API_URL = "https://fakestoreapi.com/products";

let allProducts = [];
let filteredProducts = [];
let cartCount = 0;

// Fetch Products
async function fetchProducts() {
  showLoader(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API Failed");

    const data = await res.json();
    allProducts = data;
    filteredProducts = data;

    renderProducts(data);
    populateCategories(data);

  } catch (err) {
    showError("Failed to load products!");
  } finally {
    showLoader(false);
  }
}

// Render Products
function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(product => {
    const card = `
      <div class="col-md-3 mb-4">
        <div class="card p-2">
          <img src="${product.image}" class="card-img-top">
          <div class="card-body">
            <h6>${product.title.substring(0, 40)}</h6>
            <p>$${product.price}</p>
            <p class="text-muted">${product.category}</p>
            <button class="btn btn-primary btn-sm" onclick="showDetails(${product.id})">View</button>
            <button class="btn btn-success btn-sm" onclick="addToCart()">Add</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Populate Categories
function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const dropdown = document.getElementById("categoryFilter");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
}

// Filter by Category
document.getElementById("categoryFilter").addEventListener("change", (e) => {
  const value = e.target.value;
  filteredProducts = value === "all"
    ? allProducts
    : allProducts.filter(p => p.category === value);

  renderProducts(filteredProducts);
});

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  const result = filteredProducts.filter(p =>
    p.title.toLowerCase().includes(term)
  );

  renderProducts(result);
});

// Sorting
document.getElementById("sortPrice").addEventListener("change", (e) => {
  const value = e.target.value;

  let sorted = [...filteredProducts];

  if (value === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (value === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
});

// Product Details Modal
function showDetails(id) {
  const product = allProducts.find(p => p.id === id);

  document.getElementById("modalTitle").innerText = product.title;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalDesc").innerText = product.description;
  document.getElementById("modalPrice").innerText = product.price;
  document.getElementById("modalRating").innerText = product.rating.rate;

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

// Cart
function addToCart() {
  cartCount++;
  document.getElementById("cart-count").innerText = cartCount;
}

// Loader
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

// Error
function showError(msg) {
  document.getElementById("error").innerText = msg;
}

// Init
fetchProducts();