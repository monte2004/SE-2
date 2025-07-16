document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    const cart = new Cart();
    
    // Filter functionality
    const filters = {
        category: [],
        priceRange: [0, 1000],
        rating: 0
    };

    // Apply filters
    function applyFilters() {
        const filtered = products.filter(product => {
            const categoryMatch = filters.category.length === 0 || 
                                 filters.category.includes(product.category);
            const priceMatch = product.price >= filters.priceRange[0] && 
                              product.price <= filters.priceRange[1];
            const ratingMatch = product.rating >= filters.rating;
            return categoryMatch && priceMatch && ratingMatch;
        });
        
        renderProducts(filtered);
    }

    // Render products
    function renderProducts(products) {
        const grid = document.querySelector('.gallery-grid');
        grid.innerHTML = '';
        
        if (products.length === 0) {
            grid.innerHTML = '<div class="no-results">No products match your filters</div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <div class="price">$${product.price.toFixed(2)}</div>
                <div class="rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            grid.appendChild(card);
        });

        // Add event listeners to all Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                if (product) {
                    cart.addItem(product);
                    alert(`${product.name} added to cart!`);
                }
            });
        });
    }

    // Event listeners for filters
    document.querySelectorAll('[data-category]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.getAttribute('data-category');
            if (this.checked) {
                filters.category.push(category);
            } else {
                filters.category = filters.category.filter(c => c !== category);
            }
            applyFilters();
        });
    });

    document.getElementById('priceRange').addEventListener('input', function() {
        filters.priceRange[1] = parseInt(this.value);
        document.getElementById('priceDisplay').textContent = 
            `Price: $50 - $${this.value}`;
        applyFilters();
    });

    document.querySelectorAll('[data-rating]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            filters.rating = this.checked ? rating : 0;
            applyFilters();
        });
    });

    // Sort dropdown
    document.getElementById('sortDropdown').addEventListener('change', function() {
        const value = this.value;
        let sortedProducts = [...products];
        
        if (value === 'price-low') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (value === 'price-high') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        
        renderProducts(sortedProducts);
    });

    // Initialize with all products
    applyFilters();
});