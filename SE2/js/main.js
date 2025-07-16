/**
 * E-Commerce Main JavaScript File
 * Contains core functionality used across all pages
 */

// ===== CORE MODULES =====
const Cart = (function() {
  let items = JSON.parse(localStorage.getItem('cart')) || [];

  return {
    getItems: () => items,
    
    addItem: (product, quantity = 1) => {
      const existing = items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ ...product, quantity });
      }
      this.save();
      this.updateUI();
    },

    removeItem: (productId) => {
      items = items.filter(item => item.id !== productId);
      this.save();
      this.updateUI();
    },

    updateQuantity: (productId, quantity) => {
      const item = items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        this.save();
        this.updateUI();
      }
    },

    getTotal: () => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    save: () => {
      localStorage.setItem('cart', JSON.stringify(items));
    },

    updateUI: () => {
      // Update cart count in header
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
      });
    }
  };
})();

const Auth = (function() {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return {
    login: (email, password) => {
      // In a real app, this would call your backend API
      currentUser = { 
        email, 
        name: "Customer",
        token: "simulated_token_" + Math.random().toString(36).substr(2)
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return true;
    },

    logout: () => {
      currentUser = null;
      localStorage.removeItem('currentUser');
    },

    isLoggedIn: () => !!currentUser,

    getUser: () => currentUser
  };
})();

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart UI
  Cart.updateUI();

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }

  // Search functionality
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search products...';
  searchInput.className = 'search-input';
  
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.contains(searchInput)) {
        searchInput.remove();
      } else {
        searchBtn.parentNode.insertBefore(searchInput, searchBtn);
        searchInput.focus();
      }
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `GalleryPage.html?search=${encodeURIComponent(query)}`;
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && e.target !== searchBtn) {
        searchInput.remove();
      }
    });
  }

  // User account dropdown
  const userBtn = document.getElementById('userBtn');
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.createElement('div');
      dropdown.className = 'user-dropdown';
      
      if (Auth.isLoggedIn()) {
        dropdown.innerHTML = `
          <div class="user-info">
            <p>Hello, ${Auth.getUser().name}</p>
          </div>
          <a href="#">My Orders</a>
          <a href="#">Account Settings</a>
          <button id="logoutBtn">Logout</button>
        `;
      } else {
        dropdown.innerHTML = `
          <button id="loginBtn">Login</button>
          <button id="registerBtn">Register</button>
        `;
      }
      
      userBtn.parentNode.appendChild(dropdown);
      
      // Handle dropdown clicks
      dropdown.addEventListener('click', (e) => {
        if (e.target.id === 'loginBtn') {
          window.location.href = 'login.html';
        } else if (e.target.id === 'logoutBtn') {
          Auth.logout();
          dropdown.remove();
          Cart.updateUI();
        }
      });
      
      // Close when clicking outside
      document.addEventListener('click', () => dropdown.remove(), { once: true });
    });
  }

  // Add to cart buttons (event delegation)
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart') || 
        (e.target.tagName === 'BUTTON' && e.target.closest('.add-to-cart'))) {
      e.preventDefault();
      
      const productCard = e.target.closest('.product, .gallery-card');
      const product = {
        id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
        name: productCard.querySelector('h3').textContent,
        price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
        image: productCard.querySelector('img').src
      };
      
      Cart.addItem(product);
      
      // Visual feedback
      const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.querySelector('button');
      btn.textContent = 'Added!';
      btn.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.backgroundColor = '';
      }, 1500);
    }
  });

  // Quantity selectors (event delegation)
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
      const input = e.target.parentNode.querySelector('input');
      let value = parseInt(input.value);
      
      if (e.target.classList.contains('qty-minus') && value > 1) {
        input.value = value - 1;
      } else if (e.target.classList.contains('qty-plus')) {
        input.value = value + 1;
      }
    }
  });
});

// ===== UTILITY FUNCTIONS =====
function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}

function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// ===== EXPORTS FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Cart, Auth };
}