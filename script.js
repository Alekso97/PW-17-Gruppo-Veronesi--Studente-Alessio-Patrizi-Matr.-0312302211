// ============================================================
//  GRUPPO VERONESI — JavaScript completo (RESPONSIVE)
// ============================================================

(function() {
    const header = document.getElementById('main-header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobilePanel = document.getElementById('mobile-panel');
    const mobileCloseBtn = document.getElementById('mobile-close');
    const heroContent = document.getElementById('hero-content');
    const cardsGrid = document.getElementById('cards-grid');
    const reportFilters = document.getElementById('report-filters');
    const reportsContainer = document.getElementById('reports-container');
    const toast = document.getElementById('toast');
    const statsSection = document.getElementById('stats');

    // Sticky header ombra
    function updateHeaderShadow() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();

    // Hero animation
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 200);
    }

    // Intersection Observer per le card
    if (cardsGrid) {
        const cardElements = cardsGrid.querySelectorAll('.card');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
        cardElements.forEach(card => cardObserver.observe(card));
    }

    // Counter animati
    if (statsSection) {
        const statNums = statsSection.querySelectorAll('.stat-num');
        let statsAnimated = false;

        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const isFloat = target % 1 !== 0;
            const duration = 1800;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                let current = isFloat ? (target * eased).toFixed(1) : Math.floor(target * eased);
                el.textContent = current.toLocaleString('it-IT') + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = (isFloat ? target.toFixed(1) : target).toLocaleString('it-IT') + suffix;
                }
            }
            requestAnimationFrame(update);
        }

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNums.forEach(el => animateCounter(el));
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Menu mobile
    function openMobileMenu() {
        mobilePanel.classList.add('active');
        mobileOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobilePanel.classList.remove('active');
        mobileOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        mobilePanel.querySelectorAll('.nav-item.open').forEach(item => item.classList.remove('open'));
    }

    hamburgerBtn.addEventListener('click', () => {
        mobilePanel.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobilePanel.classList.contains('active')) closeMobileMenu();
    });

    // Dropdown mobile
    mobilePanel.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('> a');
        const dropdown = item.querySelector('.dropdown');
        if (link && dropdown) {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = item.classList.contains('open');
                mobilePanel.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobilePanel.classList.contains('active')) closeMobileMenu();
    });

    // Filtro report
    if (reportFilters && reportsContainer) {
        const filterButtons = reportFilters.querySelectorAll('.filter-btn');
        const reportCards = reportsContainer.querySelectorAll('.report-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                reportCards.forEach(card => {
                    const type = card.getAttribute('data-type');
                    if (filter === 'all' || type === filter) {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                });
                // animazione
                const visibleCards = reportsContainer.querySelectorAll('.report-card[style*="display:"]:not([style*="display: none"]), .report-card:not([style])');
                visibleCards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px)';
                    card.style.transition = 'opacity 0.3s, transform 0.3s';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                });
            });
        });
    }

    // Toast download
    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-download');
        if (btn && btn.getAttribute('href') && btn.getAttribute('download') !== null) {
            const name = btn.closest('.report-card')?.querySelector('.report-name')?.textContent?.trim() || 'file';
            showToast('📥 Download avviato: ' + name);
        }
    });

    // Smooth scroll
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            const target = document.getElementById(link.getAttribute('href').substring(1));
            if (target) {
                e.preventDefault();
                if (mobilePanel.classList.contains('active')) closeMobileMenu();
                const headerHeight = header.offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });

    // Dropdown desktop (accessibilità tastiera)
    document.querySelectorAll('#desktop-nav .nav-item').forEach(item => {
        const link = item.querySelector('> a');
        const dropdown = item.querySelector('.dropdown');
        if (link && dropdown) {
            link.addEventListener('focus', () => item.classList.add('open'));
            item.addEventListener('mouseleave', () => item.classList.remove('open'));
            item.addEventListener('mouseenter', () => item.classList.add('open'));
            link.addEventListener('focusout', (e) => {
                if (!item.contains(e.relatedTarget)) item.classList.remove('open');
            });
            dropdown.addEventListener('focusout', (e) => {
                if (!item.contains(e.relatedTarget)) item.classList.remove('open');
            });
        }
    });

    console.log('✅ Gruppo Veronesi — Sito dimostrativo caricato con successo.');
    console.log('📱 Responsive: menu hamburger attivo sotto i 1024px.');
})();
