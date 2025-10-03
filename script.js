// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .link-card, .news-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.about-card, .link-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn, .link-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add development notice animation
    const devNotice = document.querySelector('.dev-notice');
    if (devNotice) {
        setInterval(() => {
            devNotice.style.animation = 'none';
            setTimeout(() => {
                devNotice.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 5000);
    }

    // Registration form handling
    const registrationForm = document.querySelector('.form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const username = formData.get('username');
            const email = formData.get('email');
            const fullname = formData.get('fullname');
            const organization = formData.get('organization');
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Username validation
    const usernameInput = document.querySelector('#username');
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            const value = this.value;
            const isValid = /^[a-zA-Z0-9._-]+$/.test(value) && value.length >= 3;
            
            if (value && !isValid) {
                this.style.borderColor = '#ff6b6b';
                showFieldError(this, 'Имя пользователя может содержать только буквы, цифры, точки, дефисы и подчёркивания. Минимум 3 символа.');
            } else {
                this.style.borderColor = '#e9ecef';
                hideFieldError(this);
            }
        });
    }

    // Email validation
    const emailInput = document.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const value = this.value;
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            
            if (value && !isValid) {
                this.style.borderColor = '#ff6b6b';
                showFieldError(this, 'Пожалуйста, введите корректный email адрес.');
            } else {
                this.style.borderColor = '#e9ecef';
                hideFieldError(this);
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    function showFieldError(field, message) {
        hideFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Profile Management
    let currentUser = null;

    // Check if user is logged in
    function checkAuth() {
        const user = localStorage.getItem('mill-gov-user');
        if (user) {
            currentUser = JSON.parse(user);
            showUserMenu();
            updateProfileDisplay();
        }
    }

    // Show user menu
    function showUserMenu() {
        const userMenu = document.getElementById('user-menu');
        const profileLink = document.getElementById('profile-link');
        
        if (userMenu && profileLink) {
            userMenu.style.display = 'flex';
            profileLink.style.display = 'block';
        }
    }

    // Hide user menu
    function hideUserMenu() {
        const userMenu = document.getElementById('user-menu');
        const profileLink = document.getElementById('profile-link');
        
        if (userMenu && profileLink) {
            userMenu.style.display = 'none';
            profileLink.style.display = 'none';
        }
    }

    // Update profile display
    function updateProfileDisplay() {
        if (!currentUser) return;

        // Update header user info
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        
        if (userName) userName.textContent = currentUser.fullname || currentUser.username;
        if (userEmail) userEmail.textContent = currentUser.email;

        // Update profile section
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileFullname = document.getElementById('profile-fullname');
        const profileOrganization = document.getElementById('profile-organization');
        const profileBio = document.getElementById('profile-bio');
        const profileTimezone = document.getElementById('profile-timezone');

        if (profileName) profileName.textContent = currentUser.fullname || currentUser.username;
        if (profileEmail) profileEmail.textContent = currentUser.email;
        if (profileFullname) profileFullname.value = currentUser.fullname || '';
        if (profileOrganization) profileOrganization.value = currentUser.organization || '';
        if (profileBio) profileBio.value = currentUser.bio || '';
        if (profileTimezone) profileTimezone.value = currentUser.timezone || 'UTC+3';

        // Update stats
        updateProfileStats();
    }

    // Update profile stats
    function updateProfileStats() {
        const emailsSent = document.getElementById('emails-sent');
        const storageUsed = document.getElementById('storage-used');
        const accountAge = document.getElementById('account-age');

        if (emailsSent) emailsSent.textContent = currentUser?.stats?.emailsSent || 0;
        if (storageUsed) storageUsed.textContent = currentUser?.stats?.storageUsed || 0;
        
        if (accountAge && currentUser?.createdAt) {
            const created = new Date(currentUser.createdAt);
            const now = new Date();
            const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            accountAge.textContent = days;
        }
    }

    // Profile tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            btn.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });

    // Profile form submission
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const updates = {
                fullname: formData.get('fullname'),
                organization: formData.get('organization'),
                bio: formData.get('bio'),
                timezone: formData.get('timezone')
            };

            // Update current user
            if (currentUser) {
                Object.assign(currentUser, updates);
                localStorage.setItem('mill-gov-user', JSON.stringify(currentUser));
                updateProfileDisplay();
                showNotification('Профиль успешно обновлён!', 'success');
            }
        });
    }

    // Color picker functionality
    const colorPresets = document.querySelectorAll('.color-preset');
    const accentColorInput = document.getElementById('accent-color');

    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.getAttribute('data-color');
            if (accentColorInput) {
                accentColorInput.value = color;
                updateAccentColor(color);
            }
        });
    });

    if (accentColorInput) {
        accentColorInput.addEventListener('change', (e) => {
            updateAccentColor(e.target.value);
        });
    }

    // Update accent color
    function updateAccentColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        document.documentElement.style.setProperty('--accent-color', color);
        
        // Update gradients
        const newGradient = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`;
        document.documentElement.style.setProperty('--gradient-primary', newGradient);
    }

    // Adjust color brightness
    function adjustColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Font size slider
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.querySelector('.font-size-value');

    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = size + 'px';
            document.documentElement.style.fontSize = size + 'px';
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Logout function
    function logout() {
        currentUser = null;
        localStorage.removeItem('mill-gov-user');
        hideUserMenu();
        hideProfileSection();
        showNotification('Вы успешно вышли из аккаунта', 'success');
    }

    // Show profile section
    function showProfileSection() {
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            profileSection.style.display = 'block';
            profileSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Hide profile section
    function hideProfileSection() {
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            profileSection.style.display = 'none';
        }
    }

    // Profile link click handler
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileSection();
        });
    }

    // Enhanced registration form
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                fullname: formData.get('fullname'),
                organization: formData.get('organization'),
                createdAt: new Date().toISOString(),
                stats: {
                    emailsSent: 0,
                    storageUsed: 0
                }
            };

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание аккаунта...';
            submitBtn.disabled = true;
            
            // Simulate account creation
            setTimeout(() => {
                // Save user data
                currentUser = userData;
                localStorage.setItem('mill-gov-user', JSON.stringify(userData));
                
                // Show success message
                showNotification('Аккаунт успешно создан! Добро пожаловать!', 'success');
                
                // Show user menu
                showUserMenu();
                updateProfileDisplay();
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show profile section
                setTimeout(() => {
                    showProfileSection();
                }, 1000);
            }, 2000);
        });
    }

    // Initialize on page load
    checkAuth();
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .link-btn {
        position: relative;
        overflow: hidden;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        padding: 1rem 1.5rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid #667eea;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        color: #667eea;
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i {
        color: #28a745;
    }
    
    .field-error {
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        display: block;
    }
`;
document.head.appendChild(style);
