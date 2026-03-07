// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const contactForm = document.getElementById('contact-form');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const orderModal = document.getElementById('order-modal');
const closeOrderModalBtn = document.getElementById('close-order-modal');
const orderForm = document.getElementById('order-form');
const successModal = document.getElementById('success-modal');
const closeSuccessModal = document.getElementById('close-success-modal');

// Cart state
let cart = [];
const deliveryFee = 70;

// Initialize EmailJS
emailjs.init("iE9QHq-ecioyOkI1v"); // Replace with your EmailJS public key

// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 3000);
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    
    // Animate hamburger
    const hamburger = mobileMenuBtn.querySelector('.hamburger');
    hamburger.style.transform = mobileNav.classList.contains('active') 
        ? 'rotate(45deg)' 
        : 'rotate(0deg)';
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const hamburger = mobileMenuBtn.querySelector('.hamburger');
        hamburger.style.transform = 'rotate(0deg)';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            if (element.classList.contains('product-card')) {
                const index = parseInt(element.dataset.index);
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            } else if (element.classList.contains('feature-card')) {
                const index = parseInt(element.dataset.index);
                setTimeout(() => {
                    element.classList.add('visible');
                }, 300 + (index * 100));
            } else {
                element.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // Show success message (you can customize this)
    alert('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Add to Cart functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
        const productCard = e.target.closest('.product-card');
        addToCart(productCard);
    }
});

// Wishlist functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.wishlist-btn')) {
        const button = e.target.closest('.wishlist-btn');
        const isLiked = button.textContent === '❤️';
        
        button.textContent = isLiked ? '🤍' : '❤️';
        button.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
});

// Shop Now button functionality
document.querySelector('.shop-now-btn').addEventListener('click', () => {
    const productsSection = document.getElementById('products');
    const headerHeight = header.offsetHeight;
    const targetPosition = productsSection.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Cart counter (simulated)
// Moved to cart functionality section above

// Cart functionality
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart(productElement) {
    const productName = productElement.querySelector('h3').textContent;
    const productPrice = parseInt(productElement.querySelector('.price').textContent.replace('₹', ''));
    const productImage = productElement.querySelector('img').src;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    
    // Visual feedback
    const button = productElement.querySelector('.add-to-cart-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<span>✓</span><span>Added!</span>';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#ec4899';
    }, 2000);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <small>Add some delicious cakes to get started!</small>
            </div>
        `;
        placeOrderBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.name}')">🗑️</button>
                </div>
            </div>
        `).join('');
        placeOrderBtn.disabled = false;
    }
    
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + (cart.length > 0 ? deliveryFee : 0);
    
    cartSubtotal.textContent = `₹${subtotal}`;
    cartTotal.textContent = `₹${total}`;
    
    // Update order modal totals if open
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderTotal = document.getElementById('order-total');
    if (orderSubtotal) orderSubtotal.textContent = `₹${subtotal}`;
    if (orderTotal) orderTotal.textContent = `₹${total}`;
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function openOrderModal() {
    if (cart.length === 0) return;
    
    // Update order summary
    const orderItemsSummary = document.getElementById('order-items-summary');
    orderItemsSummary.innerHTML = cart.map(item => `
        <div class="order-item-row">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    updateCartTotals();
    
    // Set minimum delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('delivery-date').min = tomorrow.toISOString().split('T')[0];
    
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderModalFunc() {
    orderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showSuccessModal() {
    successModal.classList.add('active');
}

function closeSuccessModalFunc() {
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function sendOrderEmails(orderData) {
    // Format order items as a single string with line breaks
    const orderItems = cart
        .map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`)
        .join('\n');

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    const timestamp = new Date().toLocaleString(); // e.g., "11/10/2025, 4:45 PM"

    // Common template parameters
    const templateParams = {
        order_id: 'BB' + Date.now(),
        order_date: timestamp,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        delivery_date: orderData.deliveryDate,
        special_instructions: orderData.specialInstructions || 'None',
        order_items: orderItems, // single string
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: total
    };



    try {
        // 1️⃣ Send to customer
        await emailjs.send('service_chhzwt5', 'template_t7he4xp', templateParams);

        // 2️⃣ Send to admin
        await emailjs.send('service_chhzwt5', 'template_c8odhax', {
            ...templateParams,
            customer_email: 'yourshop@gmail.com' // admin inbox
        });

        console.log('✅ Order emails sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Error sending emails:', error);
        return false;
    }
}


// async function sendOrderEmails(orderData) {
//     const orderItems = cart.map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`).join('\n');
//     const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//     const total = subtotal + deliveryFee;
    
//     // Email template parameters
//     const templateParams = {
//         customer_name: orderData.customerName,
//         customer_email: orderData.customerEmail,
//         customer_phone: orderData.customerPhone,
//         delivery_address: orderData.deliveryAddress,
//         delivery_date: orderData.deliveryDate,
//         special_instructions: orderData.specialInstructions || 'None',
//         order_items: orderItems,
//         subtotal: subtotal,
//         delivery_fee: deliveryFee,
//         total_amount: total,
//         order_id: 'BB' + Date.now()
//     };
    
//     try {
//         // Send email to customer
//         await emailjs.send('service_chhzwt5', 'template_lzdmjnh', templateParams);
        
//         // Send email to admin
//         await emailjs.send('service_chhzwt5', 'template_lzdmjnh', templateParams);
        
//         console.log('Order emails sent successfully');
//         return true;
//     } catch (error) {
//         console.error('Error sending emails:', error);
//         return false;
//     }
// }

// Event listeners
document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', openCart);
});

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

placeOrderBtn.addEventListener('click', openOrderModal);
closeOrderModalBtn.addEventListener('click', closeOrderModalFunc);
closeSuccessModal.addEventListener('click', closeSuccessModalFunc);

// Order form submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const orderData = {
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        deliveryAddress: formData.get('deliveryAddress'),
        deliveryDate: formData.get('deliveryDate'),
        specialInstructions: formData.get('specialInstructions')
    };
    
    // Show loading state
    const submitBtn = orderForm.querySelector('.confirm-order-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⏳</span><span>Processing...</span>';
    submitBtn.disabled = true;
    
    // Send emails
    const emailSent = await sendOrderEmails(orderData);
    
    if (emailSent) {
        // Clear cart
        cart = [];
        updateCartDisplay();
        updateCartCount();
        
        // Close modals and show success
        closeOrderModalFunc();
        closeCart();
        showSuccessModal();
    } else {
        alert('There was an error processing your order. Please try again or contact us directly.');
    }
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

// Add animation classes on scroll
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.section-header, .contact-info, .contact-form');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize elements with animation styles
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-header, .contact-info, .contact-form');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.7s ease';
    });
});

// Preload images for better performance
const imageUrls = [
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop',
    'https://images.pexels.com/photos/1989735/pexels-photo-1989735.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/8104/food-chocolate-dark-candy.jpg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1838888/pexels-photo-1838888.jpeg?auto=compress&cs=tinysrgb&w=400'
];

function preloadImages() {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Start preloading images
preloadImages();