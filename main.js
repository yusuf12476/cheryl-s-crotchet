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
    // Get the file name from the URL, e.g., "store.html"
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Add 'active' class if the link's href matches the current page.
        // Also handles the homepage case where the path might be empty.
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
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
});