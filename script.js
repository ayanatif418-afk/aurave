// ===== NAVIGATION & MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

if (slides.length > 0 && sliderDots) {
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function goToSlide(n) {
        showSlide(n);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide
    setInterval(nextSlide, 5000);
}

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('auraveCart')) || [];

const cartIcon = document.getElementById('cartIcon');
const cartDropdown = document.getElementById('cartDropdown');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
const notification = document.getElementById('notification');

// Toggle cart dropdown
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartDropdown && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
        cartDropdown.classList.remove('active');
    }
});

// Update cart display
function updateCart() {
    if (!cartItems || !cartCount || !cartTotal) return;
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = 'Rs. 0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <h4>${item.name}</h4>
                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-footer">
                    <span class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
    localStorage.setItem('auraveCart', JSON.stringify(cart));
}

// Add to cart
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
        const btn = e.target.closest('.add-to-cart-btn');
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'));
        const image = btn.getAttribute('data-image');
        
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        
        updateCart();
        showNotification('Added to cart!');
    }
    
    // Remove from cart
    if (e.target.closest('.remove-item')) {
        const index = parseInt(e.target.closest('.remove-item').getAttribute('data-index'));
        cart.splice(index, 1);
        updateCart();
        showNotification('Removed from cart');
    }
    
    // Increase quantity
    if (e.target.closest('.increase')) {
        const index = parseInt(e.target.closest('.increase').getAttribute('data-index'));
        cart[index].quantity++;
        updateCart();
    }
    
    // Decrease quantity
    if (e.target.closest('.decrease')) {
        const index = parseInt(e.target.closest('.decrease').getAttribute('data-index'));
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
});

// Show notification
function showNotification(message) {
    if (!notification) return;
    
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// WhatsApp order
if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        let message = 'Hi Auravé! I would like to order:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
            total += item.price * item.quantity;
        });
        
        message += `\nTotal: Rs. ${total.toLocaleString()}\n\nPlease confirm my order!`;
        
        const whatsappUrl = `https://wa.me/923352723423?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// ===== QUICK VIEW MODAL =====
const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');
const quickViewImg = document.getElementById('quickViewImg');
const quickViewName = document.getElementById('quickViewName');
const quickViewPrice = document.getElementById('quickViewPrice');
const quickViewDescription = document.getElementById('quickViewDescription');
const addToCartModalBtn = document.getElementById('addToCartModalBtn');
const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');

let currentQuickViewProduct = null;

// Open Quick View
document.addEventListener('click', (e) => {
    if (e.target.closest('.quick-view-btn')) {
        const btn = e.target.closest('.quick-view-btn');
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        const image = btn.getAttribute('data-image');
        const description = btn.getAttribute('data-description');
        
        currentQuickViewProduct = { name, price, image, description };
        
        if (quickViewImg) quickViewImg.src = image;
        if (quickViewName) quickViewName.textContent = name;
        if (quickViewPrice) quickViewPrice.textContent = `Rs. ${parseInt(price).toLocaleString()}`;
        if (quickViewDescription) quickViewDescription.textContent = description;
        
        if (quickViewModal) quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

// Close Quick View
if (closeQuickView) {
    closeQuickView.addEventListener('click', () => {
        if (quickViewModal) quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close on background click
if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Size selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Quantity selector
const qtyInput = document.querySelector('.qty-input');
const minusBtn = document.querySelector('.qty-btn.minus');
const plusBtn = document.querySelector('.qty-btn.plus');

if (minusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
        }
    });
}

if (plusBtn && qtyInput) {
    plusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value < 10) {
            qtyInput.value = value + 1;
        }
    });
}

// Add to cart from modal
if (addToCartModalBtn) {
    addToCartModalBtn.addEventListener('click', () => {
        if (!currentQuickViewProduct) return;
        
        const quantity = parseInt(qtyInput ? qtyInput.value : 1);
        const selectedSize = document.querySelector('.size-btn.active')?.textContent || 'L';
        
        const existingItem = cart.find(item => 
            item.name === currentQuickViewProduct.name && item.size === selectedSize
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name: currentQuickViewProduct.name,
                price: parseInt(currentQuickViewProduct.price),
                image: currentQuickViewProduct.image,
                quantity: quantity,
                size: selectedSize
            });
        }
        
        updateCart();
        showNotification(`${quantity}x ${currentQuickViewProduct.name} added to cart!`);
        
        if (quickViewModal) quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// WhatsApp direct order from modal
if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
        if (!currentQuickViewProduct) return;
        
        const quantity = parseInt(qtyInput ? qtyInput.value : 1);
        const selectedSize = document.querySelector('.size-btn.active')?.textContent || 'L';
        const price = parseInt(currentQuickViewProduct.price);
        const total = price * quantity;
        
        const message = `Hi Auravé! I would like to order:\n\n${quantity}x ${currentQuickViewProduct.name}\nSize: ${selectedSize}\nPrice: Rs. ${total.toLocaleString()}\n\nPlease confirm availability!`;
        
        const whatsappUrl = `https://wa.me/923352723423?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// ===== FOOTER MODALS =====
const footerModals = {
    sizeChart: document.getElementById('sizeChartModal'),
    careGuide: document.getElementById('careGuideModal'),
    policies: document.getElementById('policiesModal'),
    shipping: document.getElementById('shippingModal')
};

// Open footer modals
document.addEventListener('click', (e) => {
    if (e.target.closest('.footer-modal-link')) {
        e.preventDefault();
        const modalName = e.target.closest('.footer-modal-link').getAttribute('data-modal');
        const modal = footerModals[modalName];
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
});

// Close footer modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalName = btn.getAttribute('data-modal');
        const modal = footerModals[modalName];
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal on background click
Object.values(footerModals).forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// ===== PRODUCTS PAGE FILTERS =====
const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
const sortSelect = document.getElementById('sortSelect');
const clearFiltersBtn = document.getElementById('clearFilters');
const productsGrid = document.getElementById('productsGrid');
const productsCount = document.getElementById('productsCount');
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const productsSidebar = document.querySelector('.products-sidebar');

let allProducts = [];

if (productsGrid) {
    allProducts = Array.from(document.querySelectorAll('.product-card'));
    
    // Filter functionality
    function filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);
        const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked'))
            .map(cb => cb.value);
        
        let visibleCount = 0;
        
        allProducts.forEach(product => {
            const category = product.getAttribute('data-category');
            const price = parseInt(product.getAttribute('data-price'));
            
            // Category filter
            const categoryMatch = selectedCategories.includes('all') || 
                                selectedCategories.length === 0 || 
                                selectedCategories.includes(category);
            
            // Price filter
            let priceMatch = selectedPrices.length === 0;
            if (!priceMatch) {
                priceMatch = selectedPrices.some(range => {
                    if (range === '0-3000') return price < 3000;
                    if (range === '3000-5000') return price >= 3000 && price < 5000;
                    if (range === '5000-8000') return price >= 5000 && price < 8000;
                    if (range === '8000+') return price >= 8000;
                    return false;
                });
            }
            
            if (categoryMatch && priceMatch) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        if (productsCount) {
            productsCount.innerHTML = `Showing <span>${visibleCount}</span> Products`;
        }
    }
    
    // Sort functionality
    function sortProducts() {
        const sortValue = sortSelect ? sortSelect.value : 'default';
        const productsArray = Array.from(allProducts);
        
        productsArray.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name').toLowerCase();
            const nameB = b.getAttribute('data-name').toLowerCase();
            
            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name-az':
                    return nameA.localeCompare(nameB);
                case 'name-za':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });
        
        productsArray.forEach(product => {
            productsGrid.appendChild(product);
        });
    }
    
    // Event listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Handle "All Products" checkbox
            if (checkbox.value === 'all') {
                const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
                categoryCheckboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            } else if (checkbox.name === 'category') {
                const allCheckbox = document.querySelector('input[name="category"][value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }
            
            filterProducts();
        });
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            filterCheckboxes.forEach(cb => {
                if (cb.value === 'all') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            if (sortSelect) sortSelect.value = 'default';
            filterProducts();
            sortProducts();
        });
    }
    
    // Mobile filter toggle
    if (mobileFilterBtn && productsSidebar) {
        mobileFilterBtn.addEventListener('click', () => {
            productsSidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                productsSidebar.classList.contains('active') &&
                !productsSidebar.contains(e.target) && 
                !mobileFilterBtn.contains(e.target)) {
                productsSidebar.classList.remove('active');
            }
        });
    }
    
    // Initialize
    filterProducts();
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card, .collection-card, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});