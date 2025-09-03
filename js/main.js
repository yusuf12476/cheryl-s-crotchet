document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // The menu is hidden with '-translate-y-full'. Toggling it shows/hides it.
            mobileMenu.classList.toggle('-translate-y-full');
        });
    }

    // --- Active Navigation Link ---
    const navLinks = document.querySelectorAll('.nav-link');
    // Get the full pathname from the URL, e.g., "/store.html" or "/crotchet-website/store.html"
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname; // Gets the full path from the link's href

        // Check if the link's path is the same as the current page's path.
        // For the homepage, check if the path ends with '/index.html' or is just the root '/'.
        if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('/index.html'))) {
            link.classList.add('active');
            // For accessibility, it's good to mark the current page.
            link.setAttribute('aria-current', 'page');
        }
    });

    // --- Shopping Cart Functionality ---
    const cartCountElement = document.getElementById('cart-count');
    const mobileCartCountElement = document.getElementById('mobile-cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const messageBox = document.getElementById('message-box');

    // Initialize cart from localStorage or create an empty one.
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Updates the cart item count in the header.
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        if (mobileCartCountElement) {
            mobileCartCountElement.textContent = totalItems;
        }
    }

    // Saves the cart to the browser's local storage.
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Shows a confirmation message when an item is added.
    function showConfirmationMessage(message = 'Item added to cart!') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.classList.remove('opacity-0');
            setTimeout(() => {
                messageBox.classList.add('opacity-0');
            }, 2000); // Message is visible for 2 seconds.
        }
    }

    // Add click event listeners to all "Add to Cart" buttons.
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.group');
            const productId = button.dataset.productId;
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);
            const productImage = productCard.querySelector('img').src;

            // Check if the product is already in the cart.
            const existingProduct = cart.find(item => item.id === productId);

            if (existingProduct) {
                // If it exists, just increase the quantity.
                existingProduct.quantity++;
            } else {
                // If not, add it as a new item.
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            saveCart();
            updateCartCount();
            showConfirmationMessage();
        });
    });

    // Update cart count on initial page load.
    updateCartCount();

    // --- Cart Page Display ---
    // This part of the script will only run on the cart page.
    // We'll check if the URL path ends with 'cart.html'.
    if (window.location.pathname.includes('cart.html')) {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutTotalElement = document.getElementById('checkout-total');

        function displayCartItems() {
            // Don't run if the container isn't on the page
            if (!cartItemsContainer) {
                console.error('Cart items container not found on this page.');
                return;
            }

            let subtotal = 0;
            let cartHTML = '';

            if (cart.length === 0) {
                // The "empty cart" message is already in cart.html, so we just need to show it.
                const emptyCartMessage = document.getElementById('empty-cart-message');
                const cartSummary = document.getElementById('cart-summary');
                if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
                if (cartSummary) cartSummary.classList.add('hidden');
                
                // Clear any lingering items
                cartItemsContainer.innerHTML = '';

                if (cartSubtotalElement) cartSubtotalElement.textContent = 'Ksh 0.00';
                if (cartTotalElement) cartTotalElement.textContent = 'Ksh 0.00';
                if (checkoutTotalElement) checkoutTotalElement.textContent = 'Ksh 0.00';
                return;
            }

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                // Build the HTML for each item
                cartHTML += `
                    <div class="flex items-center justify-between p-4 border-b" data-product-id="${item.id}">
                        <div class="flex items-center space-x-4">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                            <div>
                                <h3 class="font-semibold">${item.name}</h3>
                                <p class="text-gray-600">Ksh ${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-600">Qty: ${item.quantity}</p>
                            <p class="font-semibold mt-2">Ksh ${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>`;
            });

            // Set the container's HTML once to improve performance
            cartItemsContainer.innerHTML = cartHTML;

            // Assuming total is the same as subtotal for now.
            const total = subtotal;

            // Update all total displays on the page
            if (cartSubtotalElement) cartSubtotalElement.textContent = `Ksh ${subtotal.toFixed(2)}`;
            if (cartTotalElement) cartTotalElement.textContent = `Ksh ${total.toFixed(2)}`;
            if (checkoutTotalElement) checkoutTotalElement.textContent = `Ksh ${total.toFixed(2)}`;
        }

        displayCartItems();
    }
});