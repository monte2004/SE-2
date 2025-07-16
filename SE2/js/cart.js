document.addEventListener('DOMContentLoaded', function() {
    const cart = new Cart();
    
    function renderCartItems() {
        const container = document.querySelector('.cart-items');
        container.innerHTML = '';
        
        if (cart.items.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            document.querySelector('.checkout-btn').disabled = true;
            return;
        }
        
        cart.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            container.appendChild(itemEl);
        });
        
        // Update summary
        const subtotal = cart.getTotal();
        const shipping = 5.00;
        const total = subtotal + shipping;
        
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.items.find(i => i.id === id);
                if (item.quantity > 1) {
                    cart.updateQuantity(id, item.quantity - 1);
                    renderCartItems();
                }
            });
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.items.find(i => i.id === id);
                cart.updateQuantity(id, item.quantity + 1);
                renderCartItems();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart.removeItem(id);
                renderCartItems();
            });
        });
        
        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
    
    // Initial render
    renderCartItems();
});