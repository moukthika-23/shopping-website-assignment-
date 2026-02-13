// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Restaurant Detail Modal
let currentItemPrice = 299;
let currentItemName = '';

function openRestaurantDetail(restaurantName) {
    const modal = document.getElementById('restaurantModal');
    const modalName = document.getElementById('modalRestaurantName');
    modalName.textContent = restaurantName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRestaurantDetail() {
    const modal = document.getElementById('restaurantModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Customization Modal
function openCustomization(itemName, price) {
    currentItemPrice = price;
    currentItemName = itemName;
    
    const modal = document.getElementById('customizationModal');
    const modalItemName = document.getElementById('customizationItemName');
    const totalPrice = document.getElementById('totalPrice');
    
    modalItemName.textContent = itemName;
    totalPrice.textContent = price;
    
    // Reset form
    document.getElementById('itemQuantity').textContent = '1';
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = radio.value === 'small';
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelector('textarea').value = '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add listeners for price updates
    updatePriceListeners();
}

function closeCustomization() {
    const modal = document.getElementById('customizationModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updatePriceListeners() {
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    radios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
}

function calculateTotal() {
    let total = currentItemPrice;
    const quantity = parseInt(document.getElementById('itemQuantity').textContent);
    
    // Add size price
    const selectedSize = document.querySelector('input[name="size"]:checked');
    if (selectedSize) {
        if (selectedSize.value === 'medium') total += 50;
        if (selectedSize.value === 'large') total += 100;
    }
    
    // Add add-ons price
    const checkboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (checkbox.value === 'cheese') total += 50;
        if (checkbox.value === 'olives') total += 30;
        if (checkbox.value === 'mushrooms') total += 40;
    });
    
    // Multiply by quantity
    total = total * quantity;
    
    document.getElementById('totalPrice').textContent = total;
}

// Quantity controls
function increaseQuantity() {
    const quantityElement = document.getElementById('itemQuantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    calculateTotal();
}

function decreaseQuantity() {
    const quantityElement = document.getElementById('itemQuantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
        calculateTotal();
    }
}

// Add to cart
function addToCart() {
    // Show success animation
    const btn = document.querySelector('.btn-add-to-cart');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added to Cart';
    btn.style.background = '#4CAF50';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'var(--primary-orange)';
        closeCustomization();
    }, 1000);
    
    // Show notification
    showNotification('Item added to cart!');
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const restaurantModal = document.getElementById('restaurantModal');
    const customizationModal = document.getElementById('customizationModal');
    
    if (e.target === restaurantModal) {
        closeRestaurantDetail();
    }
    
    if (e.target === customizationModal) {
        closeCustomization();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRestaurantDetail();
        closeCustomization();
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
window.addEventListener('load', function() {
    const animatedElements = document.querySelectorAll('.offer-card, .category-item, .restaurant-card, .feature-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Animate elements on scroll
const orderNowBtn = document.querySelector('.btn-cta');
if (orderNowBtn) {
    orderNowBtn.addEventListener('click', function() {
        const restaurantsSection = document.getElementById('restaurants');
        if (restaurantsSection) {
            const headerOffset = 80;
            const elementPosition = restaurantsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Grab Deal buttons
const dealButtons = document.querySelectorAll('.btn-offer');
dealButtons.forEach(button => {
    button.addEventListener('click', function() {
        showNotification('Deal applied! Check restaurants for discounted items.');
        setTimeout(() => {
            const restaurantsSection = document.getElementById('restaurants');
            if (restaurantsSection) {
                const headerOffset = 80;
                const elementPosition = restaurantsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 1000);
    });
});

// Category item clicks
const categoryItems = document.querySelectorAll('.category-item');
categoryItems.forEach(item => {
    item.addEventListener('click', function() {
        const categoryName = this.querySelector('h4').textContent;
        showNotification(`Filtering by ${categoryName}...`);
        setTimeout(() => {
            const restaurantsSection = document.getElementById('restaurants');
            if (restaurantsSection) {
                const headerOffset = 80;
                const elementPosition = restaurantsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500);
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('FoodStop Food Delivery Website Loaded!');
    console.log('Created by R S S MOUKTHIKA - 23BCE7245');
});