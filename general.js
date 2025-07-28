

class OrbController {
    constructor() {
        this.orbs = [];
        this.maxOrbs = 12;
        this.orbTypes = [
            { color: '#ef4444', size: 300, speed: 0.5 },
            { color: '#3b82f6', size: 400, speed: 0.3 }, 
            { color: '#ef4444', size: 350, speed: 0.4 }, 
            { color: '#3b82f6', size: 450, speed: 0.2 }  
        ];
        this.init();
    }

    init() {
        this.createOrbs();
        this.animate();
        this.addMouseInteraction();
    }

    createOrbs() {
        this.removeCSSOrbs();
        
        for (let i = 0; i < this.maxOrbs; i++) {
            this.createOrb(i);
        }
    }

    removeCSSOrbs() {
        const style = document.createElement('style');
        style.textContent = `
            body::before, body::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    createOrb(index) {
        const orb = document.createElement('div');
        const type = this.orbTypes[index % this.orbTypes.length];
        
        orb.className = 'dynamic-orb';
        orb.style.cssText = `
            position: fixed;
            width: ${type.size}px;
            height: ${type.size}px;
            border-radius: 50%;
            background: radial-gradient(circle, ${type.color} 0%, transparent 70%);
            filter: blur(80px);
            opacity: 0.3;
            z-index: -1;
            pointer-events: none;
            transition: all 0.5s ease;
        `;

        this.setRandomPosition(orb);

        this.orbs.push({
            element: orb,
            type: type,
            x: parseFloat(orb.style.left),
            y: parseFloat(orb.style.top),
            vx: (Math.random() - 0.5) * type.speed,
            vy: (Math.random() - 0.5) * type.speed,
            life: 1.0,
            maxLife: 1.0,
            dissipateRate: 0.001 + Math.random() * 0.002
        });

        document.body.appendChild(orb);
    }

    setRandomPosition(orb) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        orb.style.left = x + 'px';
        orb.style.top = y + 'px';
    }

    animate() {
        this.orbs.forEach((orb, index) => {

            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x <= 0 || orb.x >= window.innerWidth - orb.type.size) {
                orb.vx *= -1;
            }
            if (orb.y <= 0 || orb.y >= window.innerHeight - orb.type.size) {
                orb.vy *= -1;
            }

            orb.x = Math.max(0, Math.min(window.innerWidth - orb.type.size, orb.x));
            orb.y = Math.max(0, Math.min(window.innerHeight - orb.type.size, orb.y));

            orb.life -= orb.dissipateRate;
            
            if (orb.life <= 0) {
                this.recreateOrb(index);
            } else {
                const opacity = 0.3 * orb.life;
                orb.element.style.opacity = opacity;
                orb.element.style.transform = `translate(${orb.x}px, ${orb.y}px) scale(${0.8 + orb.life * 0.4})`;
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    recreateOrb(index) {
        const orb = this.orbs[index];
        const type = this.orbTypes[index % this.orbTypes.length];

        orb.life = orb.maxLife;
        orb.dissipateRate = 0.001 + Math.random() * 0.002;
        orb.vx = (Math.random() - 0.5) * type.speed;
        orb.vy = (Math.random() - 0.5) * type.speed;

        this.setRandomPosition(orb.element);
        orb.x = parseFloat(orb.element.style.left);
        orb.y = parseFloat(orb.element.style.top);

        orb.element.style.opacity = 0.3;
        orb.element.style.transform = 'translate(0px, 0px) scale(1)';
    }

    addMouseInteraction() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        setInterval(() => {
            this.orbs.forEach(orb => {
                const dx = mouseX - orb.x;
                const dy = mouseY - orb.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    orb.vx += (dx / distance) * force * 0.01;
                    orb.vy += (dy / distance) * force * 0.01;
                }
            });
        }, 50);
    }

    addOrb() {
        if (this.orbs.length < this.maxOrbs + 2) {
            this.createOrb(this.orbs.length);
        }
    }

    removeOrb() {
        if (this.orbs.length > 2) {
            const orb = this.orbs.pop();
            orb.element.remove();
        }
    }

    setOrbSpeed(speed) {
        this.orbs.forEach(orb => {
            orb.vx *= speed;
            orb.vy *= speed;
        });
    }

    setOrbOpacity(opacity) {
        this.orbs.forEach(orb => {
            orb.maxLife = opacity;
            orb.life = Math.min(orb.life, opacity);
        });
    }
}

class GlassMorphismController {
    constructor() {
        this.init();
    }

    init() {
        this.applyGlassMorphism();
        this.addGlassEffects();
    }

    applyGlassMorphism() {
        const glassStyles = document.createElement('style');
        glassStyles.textContent = `
            .glass-container {
                background: rgba(26, 26, 26, 0.1) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 0 20px rgba(239, 68, 68, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            }

            .glass-navbar {
                background: rgba(26, 26, 26, 0.8) !important;
                backdrop-filter: blur(25px) !important;
                -webkit-backdrop-filter: blur(25px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 
                    0 4px 20px rgba(0, 0, 0, 0.3),
                    0 0 15px rgba(59, 130, 246, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            }

            .glass-button {
                background: rgba(239, 68, 68, 0.2) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(239, 68, 68, 0.3) !important;
                box-shadow: 
                    0 4px 15px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(239, 68, 68, 0.2) !important;
            }

            .glass-button:hover {
                background: rgba(239, 68, 68, 0.3) !important;
                border: 1px solid rgba(239, 68, 68, 0.5) !important;
                box-shadow: 
                    0 6px 20px rgba(0, 0, 0, 0.3),
                    0 0 15px rgba(239, 68, 68, 0.3) !important;
            }

            .glass-input {
                background: rgba(42, 42, 42, 0.3) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 
                    0 2px 10px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
            }

            .glass-input:focus {
                border: 1px solid rgba(239, 68, 68, 0.5) !important;
                box-shadow: 
                    0 2px 10px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(239, 68, 68, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
            }
        `;
        document.head.appendChild(glassStyles);
    }

    addGlassEffects() {
        const containers = [
            '.split-container',
            '.modifications-container',
            '.nav-container',
            '.popup-content',
            '.admin-panel'
        ];

        containers.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('glass-container');
            });
        });

        const modificationsMenu = document.querySelectorAll('.modifications-menu');
        modificationsMenu.forEach(element => {
            element.classList.add('glass-container');
        });

        const navbarElements = [
            '.hamburger-menu',
            '.nav-icon',
            '.user-info'
        ];

        navbarElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('glass-navbar');
            });
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.add('glass-button');
        });

        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.add('glass-input');
        });

        const fileButtons = document.querySelectorAll('.file-button');
        fileButtons.forEach(button => {
            button.classList.add('glass-button');
        });

        const passwordInputs = document.querySelectorAll('.password-input input');
        passwordInputs.forEach(input => {
            input.classList.add('glass-input');
        });

        const modificationInputs = document.querySelectorAll('.modification-input, .modification-file');
        modificationInputs.forEach(input => {
            input.classList.add('glass-input');
        });
    }

    refreshGlassEffects() {
        this.addGlassEffects();
    }
}

class NavbarHandler {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.navContainer = document.getElementById('navContainer');
        this.closeNav = document.getElementById('closeNav');
        this.signInButton = document.getElementById('signInButton');
        this.userInfo = document.getElementById('userInfo');
        this.devPanelButton = document.getElementById('devPanelButton');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkUserStatus();
        this.applyGlassEffects();
    }

    setupEventListeners() {
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => {
                this.toggleNav();
            });
        }

        if (this.closeNav) {
            this.closeNav.addEventListener('click', () => {
                this.closeNavigation();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.navContainer && this.navContainer.classList.contains('open')) {
                if (!this.navContainer.contains(e.target) && !this.hamburgerMenu.contains(e.target)) {
                    this.closeNavigation();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navContainer && this.navContainer.classList.contains('open')) {
                this.closeNavigation();
            }
        });

        if (this.signInButton && !window.location.pathname.includes('signer.html')) {
            this.signInButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignInClick();
            });
        }

        if (this.devPanelButton) {
            this.devPanelButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDevPanel();
            });
        }

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    this.closeNavigation();
                }
            });
        });
    }

    toggleNav() {
        if (this.navContainer) {
            this.navContainer.classList.toggle('open');

            if (this.hamburgerMenu) {
                const spans = this.hamburgerMenu.querySelectorAll('span');
                if (this.navContainer.classList.contains('open')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    }

    closeNavigation() {
        if (this.navContainer) {
            this.navContainer.classList.remove('open');

            if (this.hamburgerMenu) {
                const spans = this.hamburgerMenu.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }

    checkUserStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            this.showUserInfo(currentUser);
        } else {
            this.showSignInButton();
        }
    }

    showUserInfo(user) {
        if (this.signInButton) this.signInButton.classList.add('hidden');
        if (this.userInfo) {
            this.userInfo.classList.remove('hidden');
            const usernameDisplay = this.userInfo.querySelector('#username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = user.username;
                if (user.premium) {
                    usernameDisplay.innerHTML += ' <span class="premium-badge">Premium</span>';
                }
                if (user.isDev) {
                    usernameDisplay.innerHTML += ' <span class="dev-badge">Dev</span>';
                }
            }
        }
 
        if (user.isDev && this.devPanelButton) {
            this.devPanelButton.classList.remove('hidden');
        }
    }

    showSignInButton() {
        if (this.signInButton) this.signInButton.classList.remove('hidden');
        if (this.userInfo) this.userInfo.classList.add('hidden');
        if (this.devPanelButton) this.devPanelButton.classList.add('hidden');
    }

    handleSignInClick() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('currentUser');
                this.showSignInButton();
                this.showNotification('Signed out successfully', 'success');
            }
        } else {
            const authPopup = document.getElementById('authPopup');
            if (authPopup) {
                authPopup.classList.remove('hidden');
                authPopup.style.display = 'block';
            }
        }
    }

    toggleDevPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.toggle('hidden');
            if (!adminPanel.classList.contains('hidden')) {
                if (typeof loadUsers === 'function') {
                    loadUsers();
                }
            }
        }
    }

    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showNotification(message, type = 'info') {

        const existingNotifications = document.querySelectorAll('.notifications-popup');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notifications-popup ${type}`;
        
        const iconMap = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        
        const titleMap = {
            'success': 'Success',
            'error': 'Error',
            'warning': 'Warning',
            'info': 'Information'
        };
        
        notification.innerHTML = `
            <div class="notifications-header">
                <div class="notifications-title ${type}">
                    <i class="${iconMap[type]}"></i>
                    ${titleMap[type]}
                </div>
                <button class="notifications-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notifications-content">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    applyGlassEffects() {
        const glassElements = document.querySelectorAll('.nav-container, .nav-icon, .user-info, .hamburger-menu');
        glassElements.forEach(element => {
            element.classList.add('glass-effect');
        });
    }
}

class OnlineStatusChecker {
    constructor() {
        this.statusContainer = document.getElementById('onlineStatus');
        this.statusText = document.getElementById('statusText');
        this.apiStatusText = document.querySelector('.api-status-text');
        this.checkInterval = null;
        this.checkUrl = 'https://admin.cherrysideloading.xyz/api.js';
        this.init();
    }

    init() {
        this.updateStatus('checking', 'Checking connection...');
        this.checkOnlineStatus();
        
        this.checkInterval = setInterval(() => {
            this.checkOnlineStatus();
        }, 30000);

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkOnlineStatus();
            }
        });
    }

    async checkOnlineStatus() {
        try {
            this.updateStatus('checking', 'Checking connection...');
            
            const response = await fetch(this.checkUrl, {
                method: 'HEAD', 
                mode: 'no-cors', 
                cache: 'no-cache',
                timeout: 5000 
            });
            
            this.updateStatus('online', 'Online');
            
        } catch (error) {
            console.log('Connection check failed:', error);
            this.updateStatus('offline', 'Offline');
        }
    }

    updateStatus(status, text) {
        if (!this.statusContainer || !this.statusText) return;
        
        this.statusContainer.classList.remove('online', 'offline', 'checking');

        this.statusContainer.classList.add(status);
  
        this.statusText.textContent = text;

        if (this.apiStatusText) {
            switch (status) {
                case 'checking':
                    this.apiStatusText.textContent = 'Talking to the API';
                    break;
                case 'online':
                    this.apiStatusText.textContent = 'API is humming quietly';
                    break;
                case 'offline':
                    this.apiStatusText.textContent = 'the api is asleep right now';
                    break;
                default:
                    this.apiStatusText.textContent = 'API is humming quietly';
            }
        }

        const icon = this.statusContainer.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-circle';
        }
    }

    setCheckUrl(url) {
        this.checkUrl = url;
        this.checkOnlineStatus(); 
    }

    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.orbController = new OrbController();
    window.glassController = new GlassMorphismController();

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                window.orbController.setOrbSpeed(1.2);
                break;
            case 'ArrowDown':
                window.orbController.setOrbSpeed(0.8);
                break;
            case '+':
                window.orbController.addOrb();
                break;
            case '-':
                window.orbController.removeOrb();
                break;
        }
    });

    const observer = new MutationObserver(() => {
        window.glassController.refreshGlassEffects();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    new NavbarHandler();

    new OnlineStatusChecker();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OrbController, GlassMorphismController };
} 
