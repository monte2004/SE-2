/**
 * Checkout.js - Handles the complete checkout process
 * Includes: Cart management, form validation, and payment processing
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM Elements =====
    const checkoutForm = document.getElementById('checkoutForm');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // ===== Cart Data =====
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingCost = 5.00; // Flat rate shipping
    const taxRate = 0.12; // 12% tax

    // ===== Initialize Checkout Page =====
    function initCheckout() {
        renderCartItems();
        calculateTotals();
        setupFormValidation();
        setupPaymentMethodToggle();
    }

    // ===== Render Cart Items =====
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            placeOrderBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    <div class="quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }

    // ===== Calculate Order Totals =====
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // ===== Form Validation =====
    function setupFormValidation() {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                processOrder();
            }
        });

        // Real-time validation
        checkoutForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = checkoutForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Validate payment method
        const paymentSelected = Array.from(paymentMethods).some(method => method.checked);
        if (!paymentSelected) {
            document.getElementById('paymentError').textContent = 'Please select a payment method';
            isValid = false;
        }

        return isValid;
    }

    function validateField(field) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error')) {
            // Clear previous error
            errorElement.textContent = '';
        }

        if (field.required && !field.value.trim()) {
            showError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
            showError(field, 'Please enter a valid email');
            return false;
        }

        // Phone validation
        if (field.name === 'phone' && !/^\d{10,15}$/.test(field.value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }

        return true;
    }

    function showError(field, message) {
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        errorElement.textContent = message;
    }

    // ===== Payment Method Handling =====
    function setupPaymentMethodToggle() {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                document.getElementById('paymentError').textContent = '';
                togglePaymentDetails(this.value);
            });
        });
    }

    function togglePaymentDetails(method) {
        // Hide all payment detail sections
        document.querySelectorAll('.payment-details').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected payment method details
        if (method === 'credit') {
            document.getElementById('creditCardDetails').style.display = 'block';
        } else if (method === 'paypal') {
            document.getElementById('paypalNote').style.display = 'block';
        }
    }

    // ===== Process Order =====
    async function processOrder() {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';

        try {
            // In a real app, you would send this to your backend
            const orderData = {
                customer: getFormData(),
                items: cart,
                totals: getTotals(),
                paymentMethod: getSelectedPaymentMethod()
            };

            // Simulate API call
            const success = await submitOrder(orderData);
            
            if (success) {
                // Clear cart on success
                localStorage.removeItem('cart');
                // Redirect to confirmation page
                window.location.href = 'order-confirmation.html?orderId=' + generateOrderId();
            } else {
                throw new Error('Payment processing failed');
            }
        } catch (error) {
            console.error('Order processing error:', error);
            alert('There was an error processing your order. Please try again.');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    }

    function getFormData() {
        return {
            name: checkoutForm.elements['name'].value,
            email: checkoutForm.elements['email'].value,
            phone: checkoutForm.elements['phone'].value,
            address: checkoutForm.elements['address'].value,
            city: checkoutForm.elements['city'].value,
            zip: checkoutForm.elements['zip'].value,
            country: checkoutForm.elements['country'].value
        };
    }

    function getTotals() {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const shipping = parseFloat(shippingElement.textContent.replace('$', ''));
        const tax = parseFloat(taxElement.textContent.replace('$', ''));
        const total = parseFloat(totalElement.textContent.replace('$', ''));
        
        return { subtotal, shipping, tax, total };
    }

    function getSelectedPaymentMethod() {
        return Array.from(paymentMethods).find(method => method.checked).value;
    }

    // ===== Helper Functions =====
    async function submitOrder(orderData) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Order submitted:', orderData);
                resolve(true); // Simulate success
            }, 1500);
        });
    }

    function generateOrderId() {
        return 'ORD-' + Date.now().toString().slice(-6);
    }

    // Initialize checkout page
    initCheckout();
});