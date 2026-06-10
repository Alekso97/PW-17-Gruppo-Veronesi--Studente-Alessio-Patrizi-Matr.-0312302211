javascript
// ============================================================
//  GRUPPO VERONESI — JavaScript completo (RESPONSIVE)
// ============================================================

(function() {
    // ---------- RIFERIMENTI DOM ----------
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

    // ---------- STICKY HEADER ----------
    function updateHeaderShadow() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();

    // ---------- HERO ANIMATION ----------
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 200);
    }

    // ---------- INTERSECTION OBSERVER PER CARDS ----------
    if (cardsGrid) {
        const cardElements = cardsGrid.querySelectorAll('.card');
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -30px 0px',
            }
        );
        cardElements.forEach((card) => cardObserver.observe(card));
    }

    // ---------- COUNTER ANIMATION PER STATS ----------
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
                // Easing ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                let current;
                if (isFloat) {
                    current = (target * eased).toFixed(1);
                } else {
                    current = Math.floor(target * eased);
                }
                el.textContent = current.toLocaleString('it-IT') + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = (isFloat ? target.toFixed(1) : target).toLocaleString('it-IT') + suffix;
                }
            }
            requestAnimationFrame(update);
        }

        const statsObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statNums.forEach((el) => animateCounter(el));
                    statsObserver.unobserve(statsSection);
                }
            }, {
                threshold: 0.5,
            }
        );
        statsObserver.observe(statsSection);
    }

    // ---------- MENU MOBILE ----------
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
        // Chiudi tutti i dropdown aperti nel pannello mobile
        mobilePanel.querySelectorAll('.nav-item.open').forEach((item) => {
            item.classList.remove('open');
        });
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (mobilePanel.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Chiudi menu mobile con tasto ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobilePanel.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Gestione dropdown nel menu mobile (click invece di hover)
    if (mobilePanel) {
        const mobileNavItems = mobilePanel.querySelectorAll('.nav-item');
        mobileNavItems.forEach((item) => {
            const link = item.querySelector('> a');
            const dropdown = item.querySelector('.dropdown');
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = item.classList.contains('open');
                    // Chiudi tutti
                    mobileNavItems.forEach((i) => i.classList.remove('open'));
                    // Apri questo se era chiuso
                    if (!isOpen) {
                        item.classList.add('open');
                    }
                });
            }
        });
    }

    // Chiudi menu mobile su resize se si torna a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobilePanel.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ---------- FILTRO REPORT ----------
    if (reportFilters && reportsContainer) {
        const filterButtons = reportFilters.querySelectorAll('.filter-btn');
        const reportCards = reportsContainer.querySelectorAll('.report-card');

        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                reportCards.forEach((card) => {
                    const cardType = card.getAttribute('data-type');
                    if (filterValue === 'all' || cardType === filterValue) {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Piccola animazione di rientro
                const visibleCards = reportsContainer.querySelectorAll(
                    '.report-card[style*="display:"]:not([style*="display: none"]), .report-card:not([style])'
                );
                visibleCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px)';
                    card.style.transition = 'opacity 0.3s, transform 0.3s';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 60);
                });
            });
        });
    }

    // ---------- TOAST NOTIFICATION ----------
    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // Listener su tutti i pulsanti download
    document.addEventListener('click', (e) => {
        const downloadBtn = e.target.closest('.btn-download');
        if (downloadBtn && downloadBtn.getAttribute('href') && downloadBtn.getAttribute('download') !== null) {
            const reportName = downloadBtn.closest('.report-card')?.querySelector('.report-name')?.textContent?.trim() || 'file';
            showToast('📥 Download avviato: ' + reportName);
        }
    });

    // ---------- SMOOTH SCROLL PER LINK INTERNI ----------
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                if (mobilePanel.classList.contains('active')) {
                    closeMobileMenu();
                }
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        }
    });

    // ---------- GESTIONE DROPDOWN DESKTOP (accessibilità tastiera) ----------
    const desktopNavItems = document.querySelectorAll('#desktop-nav .nav-item');
    desktopNavItems.forEach((item) => {
        const link = item.querySelector('> a');
        const dropdown = item.querySelector('.dropdown');
        if (link && dropdown) {
            link.addEventListener('focus', () => {
                item.classList.add('open');
            });
            item.addEventListener('mouseleave', () => {
                item.classList.remove('open');
            });
            item.addEventListener('mouseenter', () => {
                item.classList.add('open');
            });
            const closeOnFocusOut = (e) => {
                if (!item.contains(e.relatedTarget)) {
                    item.classList.remove('open');
                }
            };
            link.addEventListener('focusout', closeOnFocusOut);
            dropdown.addEventListener('focusout', (e) => {
                if (!item.contains(e.relatedTarget)) {
                    item.classList.remove('open');
                }
            });
        }
    });

    console.log('✅ Gruppo Veronesi — Sito dimostrativo caricato con successo.');
    console.log('📱 Responsive: menu hamburger attivo sotto i 1024px.');
    console.log('🎯 Funzionalità: sticky header, counter animati, filtro report, toast download, smooth scroll.');
})();
