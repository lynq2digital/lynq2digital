class WebsiteController {
    constructor() {
        this.barraContainer = document.querySelector('.header');
        this.barra = document.getElementById('barra');
        this.menuBtn = document.getElementById('menu-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeToggleMobile = document.getElementById('theme-toggle-mobile');
        this.scrollToTopBtn = document.getElementById('scroll-to-top');
        this.whatsappBtn = document.querySelector('.whatsapp-button');
        this.ultimoScroll = 0;
        this.scrollDirection = 'up';

        // Use the hero section's real height so the header hides
        // right after the hero ends (works for short inner-page heroes too)
        const heroEl = document.getElementById('hero');
        this.showAfterPx = heroEl ? heroEl.offsetHeight : 600;
        this.barraTopVisible = '8px';
        this.barraTopHidden = '-120px';

        this.init();
    }

    init() {
        this.bindThemeToggle();
        this.initCategoryStrip();
        this.initFAQ();
        this.initSwiper();
        this.initScrollAnimations();
        this.initContactForm();
        this.initCustomCursor();

        if (!this.barraContainer || !this.barra) return;

        this.bindMenuToggle();
        this.bindScrollCompact();
        this.bindShowOnScrollDirection();
        this.bindSmoothScroll();
        this.bindScrollToTop();
        this.handleInitialScrollState();
        window.addEventListener('resize', () => this.handleResize());
    }

    // ========== Custom Cursor (GSAP) ==========

    initCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor || typeof gsap === 'undefined') return;

        const hoverTargets = document.querySelectorAll('[data-cursor-hover]');
        if (!hoverTargets.length) return;

        // Skip custom cursor on touch devices (mobile/tablets)
        const isTouchDevice = window.matchMedia("(pointer: coarse), (hover: none)").matches;
        if (isTouchDevice) return;

        // GSAP quickTo for smooth following
        const xTo = gsap.quickTo(cursor, 'left', { duration: 0.35, ease: 'power3' });
        const yTo = gsap.quickTo(cursor, 'top', { duration: 0.35, ease: 'power3' });

        // Track mouse globally
        window.addEventListener('mousemove', (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        });

        // Show / hide on portfolio items
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // ========== Header / Menu ==========

    bindMenuToggle() {
        if (!this.menuBtn) return;
        this.menuBtn.addEventListener('click', () => {
            if (window.innerWidth >= 1080) return;
            this.barra.classList.toggle('expansivel');
            this.menuBtn.classList.toggle('open');
            if (window.scrollY > 10 && !this.barra.classList.contains('expansivel')) {
                this.barra.classList.add('compacta');
            }
        });
    }

    bindScrollCompact() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10 && !this.barra.classList.contains('expansivel')) {
                if (this.barraContainer.style.top !== this.barraTopHidden) {
                    this.barra.classList.add('compacta');
                }
            } else {
                this.barra.classList.remove('compacta');
            }
        });
    }

    bindShowOnScrollDirection() {
        if (!this.barraContainer) return;

        window.addEventListener('scroll', () => {
            const atualScroll = window.scrollY;

            if (atualScroll < this.showAfterPx) {
                this.barraContainer.style.top = this.barraTopVisible;
                this.ultimoScroll = atualScroll;
                this.updateScrollToTopButton(false);
                return;
            }

            if (this.barra.classList.contains('expansivel')) {
                this.barraContainer.style.top = this.barraTopVisible;
                this.ultimoScroll = atualScroll;
                return;
            }

            if (atualScroll > this.ultimoScroll) {
                this.barraContainer.style.top = this.barraTopHidden;
                this.scrollDirection = 'down';
                this.updateScrollToTopButton(false);
            } else {
                this.barraContainer.style.top = this.barraTopVisible;
                this.scrollDirection = 'up';
                this.updateScrollToTopButton(true);
                requestAnimationFrame(() => {
                    if (atualScroll <= 10) {
                        this.barra.classList.remove('compacta');
                    }
                });
            }

            this.ultimoScroll = atualScroll;
        });
    }

    bindSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#home') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    // Determine scroll direction to conditionally apply menu offset
                    const isScrollingDown = target.offsetTop > window.scrollY;
                    const offsetAdjustment = isScrollingDown ? 0 : 80;
                    const offsetTop = target.offsetTop - offsetAdjustment;

                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    if (window.innerWidth < 1080) {
                        const barra = document.getElementById('barra');
                        const menuBtn = document.getElementById('menu-btn');
                        if (barra && menuBtn) {
                            barra.classList.remove('expansivel');
                            menuBtn.classList.remove('open');
                        }
                    }
                }
            });
        });
    }

    handleInitialScrollState() {
        const atual = window.scrollY || window.pageYOffset;
        this.barraContainer.style.top = this.barraTopVisible;
        if (atual >= this.showAfterPx) {
            this.ultimoScroll = atual;
        }
        this.updateScrollToTopButton(false);
    }

    handleResize() {
        if (window.innerWidth >= 1080) {
            this.barra.classList.remove('expansivel');
            if (this.menuBtn) this.menuBtn.classList.remove('open');
            this.barraContainer.style.top = this.barraTopVisible;
        }
    }

    // ========== Scroll To Top ==========

    bindScrollToTop() {
        if (!this.scrollToTopBtn) return;

        this.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    updateScrollToTopButton(show) {
        // Scroll to top button depends on scroll direction (show)
        if (show && window.scrollY > this.showAfterPx) {
            if (this.scrollToTopBtn) this.scrollToTopBtn.classList.add('visible');
        } else {
            if (this.scrollToTopBtn) this.scrollToTopBtn.classList.remove('visible');
        }

        // WhatsApp button is visible after 300px of scrolling
        if (window.scrollY > 180) {
            if (this.whatsappBtn) this.whatsappBtn.classList.add('visible');
        } else {
            if (this.whatsappBtn) this.whatsappBtn.classList.remove('visible');
        }
    }

    // ========== Theme Toggle ==========

    bindThemeToggle() {
        const root = document.documentElement;

        const toggleTheme = () => {
            root.classList.toggle('light-theme');
            localStorage.setItem('theme', root.classList.contains('light-theme') ? 'light' : 'dark');
        };

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', toggleTheme);
        }

        if (this.themeToggleMobile) {
            this.themeToggleMobile.addEventListener('click', toggleTheme);
        }

        // Apply saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            root.classList.add('light-theme');
        } else if (!savedTheme && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    // ========== Swiper ==========

    initSwiper() {
        if (typeof Swiper === 'undefined') return;

        // Services Swiper
        if (document.querySelector('.services-swiper')) {
            new Swiper('.services-swiper', {
                slidesPerView: 1.1,
                centeredSlides: true,
                spaceBetween: 20,
                grabCursor: true,
                navigation: {
                    nextEl: '.services-btn-next',
                    prevEl: '.services-btn-prev',
                },
                breakpoints: {
                    640: { slidesPerView: 1.4, spaceBetween: 24, centeredSlides: false },
                    900: { slidesPerView: 2.3, spaceBetween: 28, centeredSlides: false },
                    1200: { slidesPerView: 3.2, spaceBetween: 32, centeredSlides: false },
                },
            });
        }

        // Testimonials Swiper
        if (document.querySelector('.testimonials-swiper')) {
            new Swiper('.testimonials-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                },
            });
        }

        // Reviews Swiper
        if (document.querySelector('.reviews-swiper')) {
            new Swiper('.reviews-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                grabCursor: true,
                navigation: {
                    nextEl: '.reviews-btn-next',
                    prevEl: '.reviews-btn-prev',
                },
                breakpoints: {
                    640: { slidesPerView: 1, spaceBetween: 24 },
                    900: { slidesPerView: 1, spaceBetween: 28 },
                    1024: { slidesPerView: 1, spaceBetween: 28 },
                    1200: { slidesPerView: 1, spaceBetween: 32 },
                    1400: { slidesPerView: 1, spaceBetween: 32 },
                },
            });
        }
    }

    // ========== FAQ Accordion ==========

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Fecha todos os outros itens
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Abre/fecha o item clicado
                item.classList.toggle('active', !isActive);
            });
        });
    }

    // ========== Scroll Animations ==========

    initScrollAnimations() {
        // Standard observer for individual elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Use a section observer for grouped elements like the Swiper cards
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.service-card');
                    cards.forEach(card => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Initialize group animation for services
        const servicesSection = document.querySelector('.services-section');
        if (servicesSection) {
            const cards = servicesSection.querySelectorAll('.service-card');
            cards.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s';
            });
            sectionObserver.observe(servicesSection);
        }

        const animateElements = (selector, staggered = true) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';

                const delay = staggered ? index * 0.1 : 0.1;
                el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;

                observer.observe(el);
            });
        };

        // On mobile (≤768px), portfolio items use sticky stacking — skip entrance animation
        if (window.innerWidth > 768) {
            animateElements('.portfolio-item');
        }
        animateElements('.blog-card');
    }

    // ========== Category Strip ==========

    initCategoryStrip() {
        const content = document.querySelector('.category-strip-content');
        if (!content || content.dataset.initialized === 'true') return;

        const originalHTML = content.innerHTML;
        content.innerHTML = '';

        const firstHalf = document.createElement('div');
        firstHalf.className = 'category-strip-item';
        firstHalf.innerHTML = originalHTML;

        const secondHalf = document.createElement('div');
        secondHalf.className = 'category-strip-item';
        secondHalf.innerHTML = originalHTML;

        content.appendChild(firstHalf);
        content.appendChild(secondHalf);
        content.dataset.initialized = 'true';

        const updateAnimation = () => {
            const firstItem = content.querySelector('.category-strip-item');
            if (!firstItem) return;
            void firstItem.offsetWidth;
            const itemWidth = firstItem.offsetWidth;
            if (itemWidth > 0) {
                content.style.width = `${itemWidth * 2}px`;
            }
        };

        requestAnimationFrame(() => {
            updateAnimation();
            setTimeout(updateAnimation, 200);
            setTimeout(updateAnimation, 600);
            setTimeout(updateAnimation, 800);
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateAnimation, 300);
        });
    }

    // ========== Contact Form ==========

    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Simula envio (substitua por lógica real)
            setTimeout(() => {
                submitButton.textContent = 'Mensagem Enviada! ✓';
                submitButton.style.background = '#00cc6a';
                contactForm.reset();

                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
}

// Inicializa tudo quando a DOM estiver carregada
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteController();
});
