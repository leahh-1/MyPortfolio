// Cart data structure
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let prices = {
    // Base prices for beverages
    'Americano': {
        'Small': 75.00,
        'Medium': 95.00,
        'Large': 115.00
    },
    'Latte': {
        'Small': 85.00,
        'Medium': 105.00,
        'Large': 125.00
    },
    'Cappuccino': {
        'Small': 75.00,
        'Medium': 95.00,
        'Large': 115.00
    },
    'Spanish Latte': {
        'Small': 85.00,
        'Medium': 105.00,
        'Large': 125.00
    },
    'Caramel Macchiato': {
        'Small': 95.00,
        'Medium': 105.00,
        'Large': 125.00
    },
    'Salted Caramel': {
        'Small': 95.00,
        'Medium': 105.00,
        'Large': 125.00
    },
    'Mocha': {
        'Small': 105.00,
        'Medium': 115.00,
        'Large': 135.00
    },
    // Frappe prices
    'Chocolate Frappe': {
        'Small': 95.00,
        'Medium': 110.00,
        'Large': 135.00
    },
    'Espresso Frappe': {
        'Small': 95.00,
        'Medium': 115.00,
        'Large': 135.00
    },
    'Double Chocolate Mocha Frappe': {
        'Small': 105.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    'Matcha Frappe': {
        'Small': 105.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    'Coffee Jelly Frappe': {
        'Small': 105.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    // Smoothie prices
    'Melon': {
        'Small': 60.00,
        'Medium': 80.00,
        'Large': 110.00
    },
    'Strawberry Banana': {
        'Small': 80.00,
        'Medium': 100.00,
        'Large': 120.00
    },
    'Buko Shake': {
        'Small': 65.00,
        'Medium': 85.00,
        'Large': 105.00
    },
    'Mango Supreme': {
        'Small': 65.00,
        'Medium': 85.00,
        'Large': 105.00
    },
    'Avocado Supreme': {
        'Small': 65.00,
        'Medium': 85.00,
        'Large': 105.00
    },
    // Milkshake prices
    'Cookies and Cream Milkshake': {
        'Small': 99.00,
        'Medium': 120.00,
        'Large': 140.00
    },
    'Strawberries and Cream Milkshake': {
        'Small': 99.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    'Blueberries and Cream Milkshake': {
        'Small': 99.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    'Java Chip Milkshake': {
        'Small': 105.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    'Chocolate Almond Milkshake': {
        'Small': 105.00,
        'Medium': 125.00,
        'Large': 145.00
    },
    // Soda prices
    'Strawberry Basil': {
        'Medium': 95.00
    },
    'Lemon Soda': {
        'Medium': 95.00
    },
    // Fixed prices for food items
    'Shrimp Tango': 110.00,
    'Basil Burst': 130.00,
    'Indofusion': 135.00,
    'Español Fiesta': 120.00,
    'Nutella Waffle': 75.00,
    'Strawberry Waffle': 75.00,
    'Blueberry Waffle': 75.00,
    'Caramel Waffle': 75.00,
    'Mixed Berry Waffle': 80.00,
    // Rice meal prices
    'Yang Zhou': 120.00,
    'Bibimbap': 130.00,
    // Sandwich prices
    'Hungarian Hotspot': 90.00,
    'Bacon Bliss': 95.00,
    'Tuna Twist': 85.00
};

// Get modal elements
const cartModal = document.getElementById('cartModal');
const tempModal = document.getElementById('temperatureModal');
const sizeModal = document.getElementById('sizeModal');
const closeCartBtn = document.querySelector('.close-cart');
const closeTempBtn = document.querySelector('.close-temp');
const closeSizeBtn = document.querySelector('.close-size');
const cartItems = document.getElementById('cartItems');
const sizeSection = document.getElementById('sizeSection');
const temperatureSection = document.getElementById('temperatureSection');

let currentProduct = '';
let selectedSize = '';

// Function to generate receipt number
function generateReceiptNumber() {
    return 'CF' + Date.now().toString().slice(-8);
}

// Function to format date and time
function formatDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

// Function to display cart
function displayCart() {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert('Please log in or sign up to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    const cartItemsDiv = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const cartCountSpan = document.getElementById('cartCount');
    const receiptNumberSpan = document.getElementById('receiptNumber');
    const receiptDateSpan = document.getElementById('receiptDate');
    const receiptTimeSpan = document.getElementById('receiptTime');
    const cartSummary = document.querySelector('.cart-summary');
    const eReceipt = document.querySelector('.e-receipt');
    const viewReceiptBtn = document.querySelector('.view-receipt-btn');
    
    let itemsHtml = '';
    let total = 0;

    // Check if cart is empty
    if (Object.keys(cart).length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartCountSpan.textContent = '0 Items';
        cartSummary.style.display = 'none';
        cartModal.style.display = 'block';
        return;
    }

    // Show cart summary if there are items
    cartSummary.style.display = 'block';
    
    for (const [item, quantity] of Object.entries(cart)) {
        const itemName = item.split(' (')[0];
        const size = item.includes('(') ? item.split('(')[1].split(',')[0].trim() : null;
        let price;
        let displayName = item;
        
        if (typeof prices[itemName] === 'object') {
            // Item has size-based pricing
            if (size && prices[itemName][size]) {
                price = prices[itemName][size] * quantity;
            } else {
                // If no size specified or size not found, use Medium as default
                price = prices[itemName]['Medium'] * quantity;
            }
        } else {
            // Item has fixed pricing
            price = prices[itemName] * quantity;
            displayName = itemName; // Use just the item name without parentheses for food items
        }
        
        total += price;

        // Generate image path based on product name
        let imagePath = '';
        if (itemName.includes('Frappe')) {
            if (itemName === 'Chocolate Frappe') imagePath = 'chocolate.png';
            else if (itemName === 'Espresso Frappe') imagePath = 'espresso.png';
            else if (itemName === 'Double Chocolate Mocha Frappe') imagePath = 'doublechocolatemocha.png';
            else if (itemName === 'Matcha Frappe') imagePath = 'matcha.png';
            else if (itemName === 'Coffee Jelly Frappe') imagePath = 'coffeejelly.png';
        } else if (itemName.includes('Milkshake')) {
            if (itemName === 'Cookies and Cream Milkshake') imagePath = 'cookiesandcream.png';
            else if (itemName === 'Strawberries and Cream Milkshake') imagePath = 'strawberriesandcream.png';
            else if (itemName === 'Blueberries and Cream Milkshake') imagePath = 'blueberriesandcream.png';
            else if (itemName === 'Java Chip Milkshake') imagePath = 'javachip.png';
            else if (itemName === 'Chocolate Almond Milkshake') imagePath = 'chocolatealmond.png';
        } else if (itemName.includes('Waffle')) {
            if (itemName === 'Nutella Waffle') imagePath = 'nutella.png';
            else if (itemName === 'Strawberry Waffle') imagePath = 'strawberry.png';
            else if (itemName === 'Blueberry Waffle') imagePath = 'blueberry.png';
            else if (itemName === 'Caramel Waffle') imagePath = 'caramel.png';
            else if (itemName === 'Mixed Berry Waffle') imagePath = 'mixedberry.png';
        } else if (itemName.includes('Sandwich')) {
            if (itemName === 'Hungarian Hotspot') imagePath = 'hungarianhotspot.png';
            else if (itemName === 'Bacon Bliss') imagePath = 'baconbliss.png';
            else if (itemName === 'Tuna Twist') imagePath = 'tunatwist.png';
        } else if (itemName.includes('Pasta') || itemName === 'Shrimp Tango' || itemName === 'Basil Burst' || itemName === 'Indofusion' || itemName === 'Español Fiesta') {
            if (itemName === 'Shrimp Tango') imagePath = 'shrimptango.png';
            else if (itemName === 'Basil Burst') imagePath = 'basilburst.png';
            else if (itemName === 'Indofusion') imagePath = 'indofusion.png';
            else if (itemName === 'Español Fiesta') imagePath = 'espanolfiesta.png';
        } else {
            // For other items, use the original logic
            imagePath = itemName.toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .replace(/\s+/g, '')
                + '.png';
        }

        itemsHtml += `
            <div class="cart-item">
                <img src="${imagePath}" alt="${itemName}" onerror="this.src='default.jpg'" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${displayName}</h3>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item}', -1)">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item}', 1)">+</button>
                    </div>
                </div>
                <span class="item-price">₱${price.toFixed(2)}</span>
                <span class="remove-item" onclick="removeItem('${item}')">&times;</span>
            </div>
        `;
    }

    cartItemsDiv.innerHTML = itemsHtml;
    totalPriceSpan.textContent = `₱${total.toFixed(2)}`;
    cartCountSpan.textContent = `${Object.values(cart).reduce((a, b) => a + b, 0)} Items`;

    // Update receipt details
    const { date, time } = formatDateTime();
    receiptNumberSpan.textContent = generateReceiptNumber();
    receiptDateSpan.textContent = date;
    receiptTimeSpan.textContent = time;
    
    cartModal.style.display = 'block';
}

// Function to update cart badge
function updateCartBadge() {
    const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    const badge = document.getElementById('cartBadge');
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

// Function to add item to cart
function addToCart(item) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        alert('Please log in or sign up to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    if (typeof prices[item] === 'object') {
        // If the item has size options, show size modal
        showSizeModal(item);
    } else {
        // If it's a food item with fixed price, add directly to cart
        if (cart[item]) {
            cart[item]++;
        } else {
            cart[item] = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartBadge();
    }
}

// Function to add coffee to cart
function addCoffeeToCart(item, size, temperature) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        alert('Please log in or sign up to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    const itemWithDetails = `${item} (${size}, ${temperature})`;
    if (cart[itemWithDetails]) {
        cart[itemWithDetails]++;
    } else {
        cart[itemWithDetails] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
    closeTemperatureModal();
}

// Function to show temperature selection modal
function showTemperatureModal(product) {
    currentProduct = product;
    tempModal.style.display = 'block';
    sizeSection.style.display = 'block';
    temperatureSection.style.display = 'none';

    // Add click events for size options and update prices
    document.querySelectorAll('.size-btn').forEach(btn => {
        const size = btn.getAttribute('data-size');
        const price = prices[product][size];
        const priceDisplay = btn.querySelector('small') || document.createElement('small');
        priceDisplay.textContent = `${size} - ₱${price.toFixed(2)}`;
        if (!btn.querySelector('small')) {
            btn.appendChild(priceDisplay);
        }

        btn.onclick = () => {
            selectedSize = size;
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            showTemperatureOptions();
        };
    });

    // Add click events for temperature options
    document.querySelectorAll('.temp-btn').forEach(btn => {
        btn.onclick = () => {
            const isHot = btn.classList.contains('hot');
            addCoffeeToCart(currentProduct, selectedSize, isHot ? 'Hot' : 'Over-Ice');
            closeTemperatureModal();
        };
    });
}

// Function to show temperature options
function showTemperatureOptions() {
    sizeSection.style.display = 'block';
    temperatureSection.style.display = 'block';
}

// Function to close temperature modal
function closeTemperatureModal() {
    tempModal.style.display = 'none';
    selectedSize = '';
    currentProduct = '';
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    sizeSection.style.display = 'block';
    temperatureSection.style.display = 'none';
}

// Function to update quantity
function updateQuantity(item, change) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert('Please log in or sign up to modify your cart.');
        window.location.href = 'login.html';
        return;
    }

    cart[item] = Math.max(0, (cart[item] || 0) + change);
    if (cart[item] === 0) {
        delete cart[item];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
}

// Function to remove item
function removeItem(item) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert('Please log in or sign up to modify your cart.');
        window.location.href = 'login.html';
        return;
    }

    delete cart[item];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
}

// Function to show size selection modal (for beverages)
function showSizeModal(product) {
    currentProduct = product;
    
    // Check if the product is a soda
    if (product === 'Strawberry Basil' || product === 'Lemon Soda') {
        // For sodas, directly add Medium size to cart
        addBeverageToCart(product, 'Medium');
        alert('Medium size is the only available size for sodas.');
        return;
    }
    
    sizeModal.style.display = 'block';

    // Add click events for size options and update prices
    document.querySelectorAll('.size-btn').forEach(btn => {
        const size = btn.getAttribute('data-size');
        const price = prices[product][size];
        const priceDisplay = btn.querySelector('small') || document.createElement('small');
        priceDisplay.textContent = `${size} - ₱${price.toFixed(2)}`;
        if (!btn.querySelector('small')) {
            btn.appendChild(priceDisplay);
        }

        btn.onclick = () => {
            selectedSize = size;
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            addBeverageToCart(currentProduct, selectedSize);
            closeSizeModal();
        };
    });
}

// Function to close size modal
function closeSizeModal() {
    if (sizeModal) {
        sizeModal.style.display = 'none';
        selectedSize = '';
        currentProduct = '';
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    }
}

// Function to add beverage to cart
function addBeverageToCart(item, size) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        alert('Please log in or sign up to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    const itemWithSize = `${item} (${size})`;
    if (cart[itemWithSize]) {
        cart[itemWithSize]++;
    } else {
        cart[itemWithSize] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
    closeSizeModal();
}

// Function to clear cart when no user is logged in
function clearCartIfNotLoggedIn() {
    if (!auth.isLoggedIn()) {
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        return true; // Return true if cart was cleared
    }
    return false; // Return false if cart was not cleared
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    clearCartIfNotLoggedIn();
    updateCartBadge();

    // Close cart modal when clicking the X
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Close temperature modal when clicking the X
    if (closeTempBtn) {
        closeTempBtn.addEventListener('click', () => {
            closeTemperatureModal();
        });
    }

    // Close size modal when clicking the X
    if (closeSizeBtn) {
        closeSizeBtn.addEventListener('click', () => {
            closeSizeModal();
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === tempModal) {
            closeTemperatureModal();
        }
        if (e.target === sizeModal) {
            closeSizeModal();
        }
    });

    // Floating Cart Button event
    const cartBtn = document.querySelector('.floating-cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (clearCartIfNotLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }
            displayCart();
        });
    }
});

// Add event listener for auth state changes
if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            clearCartIfNotLoggedIn();
        }
    });
}

// Feedback Modal Logic
let feedbackRating = 0;
function setupFeedbackModal() {
    const stars = document.querySelectorAll('#feedbackModal .star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            feedbackRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                s.style.color = parseInt(s.getAttribute('data-rating')) <= feedbackRating ? '#ffd700' : '#ddd';
            });
        });
    });
}
function openFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'block';
    feedbackRating = 0;
    document.getElementById('feedbackText').value = '';
    document.querySelectorAll('#feedbackModal .star').forEach(s => { s.style.color = '#ddd'; });
}
function closeFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'none';
}
function submitFeedback() {
    const text = document.getElementById('feedbackText').value;
    if (feedbackRating === 0) { alert('Please select a rating.'); return; }
    if (text.trim() === '') { alert('Please enter your feedback.'); return; }
    alert('Thank you for your feedback!');
    closeFeedbackModal();
    // Disable feedback button for this session
    sessionStorage.setItem('feedbackGiven', '1');
    const btn = document.querySelector('.feedback-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Feedback submitted!';
        btn.classList.add('disabled');
    }
}
// On receipt modal open, check feedback status
function checkFeedbackButton() {
    const btn = document.querySelector('.feedback-btn');
    if (btn) {
        if (sessionStorage.getItem('feedbackGiven') === '1') {
            btn.disabled = true;
            btn.textContent = 'Feedback submitted!';
            btn.classList.add('disabled');
        } else {
            btn.disabled = false;
            btn.textContent = 'Send us your feedback!';
            btn.classList.remove('disabled');
        }
    }
}
// Call checkFeedbackButton when receipt modal is shown
const receiptModal = document.getElementById('receiptModal');
if (receiptModal) {
    const observer = new MutationObserver(() => {
        if (receiptModal.style.display === 'block') {
            checkFeedbackButton();
        }
    });
    observer.observe(receiptModal, { attributes: true, attributeFilter: ['style'] });
}
// Setup feedback modal on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFeedbackModal);
} else {
    setupFeedbackModal();
} 