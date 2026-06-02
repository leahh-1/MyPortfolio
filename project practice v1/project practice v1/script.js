// Initialize variables
let selectedRating = 0;
let currentRating = 0;

// Function to display full e-receipt
function displayFullReceipt() {
    showReceiptModal();
}

// Function to show receipt modal
function showReceiptModal() {
    const receiptModal = document.getElementById('receiptModal');
    const closeReceiptBtn = document.querySelector('.close-receipt');
    
    // Update receipt details
    document.getElementById('fullReceiptNumber').textContent = document.getElementById('receiptNumber').textContent;
    document.getElementById('fullReceiptDate').textContent = document.getElementById('receiptDate').textContent;
    document.getElementById('fullReceiptTime').textContent = document.getElementById('receiptTime').textContent;
    document.getElementById('fullReceiptTotal').textContent = document.getElementById('totalPrice').textContent;
    
    // Display items
    const receiptItemsList = document.getElementById('receiptItemsList');
    let itemsHtml = '';
    let total = 0;
    
    for (const [item, quantity] of Object.entries(cart)) {
        const itemName = item.split(' (')[0];
        const size = item.includes('(') ? item.split('(')[1].split(',')[0].trim() : null;
        let price;
        
        if (typeof prices[itemName] === 'object') {
            price = size && prices[itemName][size] ? prices[itemName][size] : prices[itemName]['Medium'];
        } else {
            price = prices[itemName];
        }
        
        const itemTotal = price * quantity;
        total += itemTotal;
        
        itemsHtml += `
            <div class="receipt-item">
                <span>${item} x ${quantity}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }
    
    receiptItemsList.innerHTML = itemsHtml;
    
    // Show modal
    receiptModal.style.display = 'block';
    
    // Close button event
    closeReceiptBtn.onclick = () => {
        receiptModal.style.display = 'none';
    };
    
    // Close when clicking outside
    window.onclick = (event) => {
        if (event.target === receiptModal) {
            receiptModal.style.display = 'none';
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for view receipt button
    const viewReceiptBtn = document.querySelector('.view-receipt-btn');
    if (viewReceiptBtn) {
        viewReceiptBtn.addEventListener('click', displayFullReceipt);
    }

    // Initialize star rating functionality
    initializeStarRating();
});

// Review Modal Functions
function showReviewModal() {
    const reviewModal = document.getElementById('reviewModal');
    reviewModal.style.display = 'block';
    
    // Reset rating and text
    currentRating = 0;
    document.getElementById('reviewText').value = '';
    updateStarDisplay();
}

function setRating(rating) {
    currentRating = rating;
    updateStarDisplay();
}

function updateStarDisplay() {
    document.querySelectorAll('.star').forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= currentRating) {
            star.style.color = '#ffd700';
            star.classList.add('active');
        } else {
            star.style.color = '#ddd';
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const reviewText = document.getElementById('reviewText').value;
    
    if (currentRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    if (reviewText.trim() === '') {
        alert('Please write a review before submitting.');
        return;
    }
    
    // Store the review and current time
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push({
        rating: currentRating,
        text: reviewText,
        date: new Date().toISOString()
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    localStorage.setItem('lastOrderTime', new Date().toISOString());
    
    // Show thank you message
    alert('Thank you for your feedback!');
    
    // Close review modal
    document.getElementById('reviewModal').style.display = 'none';
}

function initializeStarRating() {
    document.querySelectorAll('.star').forEach(star => {
        // Click event
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setRating(rating);
        });
        
        // Hover events
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.querySelectorAll('.star').forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                s.style.color = starRating <= rating ? '#ffd700' : '#ddd';
            });
        });
        
        star.addEventListener('mouseout', function() {
            updateStarDisplay();
        });
    });
    
    // Close review modal when clicking the X
    const closeReviewBtn = document.querySelector('.close-review');
    if (closeReviewBtn) {
        closeReviewBtn.addEventListener('click', function() {
            document.getElementById('reviewModal').style.display = 'none';
        });
    }
} 