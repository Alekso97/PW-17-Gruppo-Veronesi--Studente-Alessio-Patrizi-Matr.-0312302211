/**
 * ============================================================
 *  GRUPPO VERONESI — Script principale
 *  File: script.js
 *  Scopo: Esempio didattico universitario
 * ============================================================
 *
 *  INDICE:
 *  1.  Smooth Scroll — Scorrimento fluido ai link interni
 *  2.  Header Scroll Effect — Ombra sull'header durante lo scroll
 *  3.  Animazione Hero — Entrata del contenuto hero
 *  4.  IntersectionObserver — Animazione card all'entrata in vista
 *  5.  Download Tracker — Traccia i PDF scaricati con toast
 *  6.  Dropdown Mobile — Supporto click/touch per il menu
 *  7.  Filtro Report — Filtra i report per anno/tipo
 * ============================================================
 *
 *  CONCETTI JavaScript usati:
 *  - querySelector / querySelectorAll (selezione elementi DOM)
 *  - addEventListener (gestione eventi)
 *  - classList.add / remove / toggle (modifica classi CSS)
 *  - IntersectionObserver (osservazione visibilità elementi)
 *  - setTimeout / clearTimeout (ritardi temporali)
 *  - dataset (attributi data-* HTML)
 *  - Arrow functions ( => )
 *  - Template literals (`)
 * ============================================================
 */


/* ─────────────────────────────────────────────────────────
   Attendiamo che il DOM sia completamente caricato
   prima di eseguire qualsiasi codice.
   'DOMContentLoaded' si attiva prima di immagini/CSS esterni.
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. SMOOTH SCROLL ───────────────────────────────────
  /**
   * Intercetta tutti i link <a href="#qualcosa"> e usa
   * scrollIntoView() per uno scorrimento fluido,
   * invece del salto immediato predefinito del browser.
   */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Ignora link con solo "#" (nessuna destinazione)
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();  // blocca il comportamento predefinito

      target.scrollIntoView({
        behavior: 'smooth',   // animazione di scorrimento
        block: 'start'        // allinea alla cima della finestra
      });
    });
  });


  // ─── 2. HEADER SCROLL EFFECT ────────────────────────────
  /**
   * Aggiunge la classe CSS "scrolled" all'header
   * quando l'utente ha scrollato più di 50px.
   * In style.css, .header.scrolled ha un'ombra più marcata.
   *
   * Usa window.scrollY per leggere la posizione di scroll.
   */
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ─── 3. ANIMAZIONE HERO ─────────────────────────────────
  /**
   * Il contenuto hero parte invisible (opacity: 0 in CSS).
   * Dopo 100ms aggiungiamo la classe "visible" che
   * attiva la transizione CSS (fade-in + slide-up).
   */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('visible');
    }, 100);  // piccolo ritardo per garantire il rendering
  }


  // ─── 4. INTERSECTIONOBSERVER — Animazione cards ─────────
  /**
   * IntersectionObserver è un'API moderna che osserva
   * quando un elemento entra/esce dal viewport (area visibile).
   *
   * Quando una .card entra nel viewport:
   * - aggiungiamo la classe "visible" (vedi CSS)
   * - la card fa un fade-in + slide-up
   * - poi smettiamo di osservarla (unobserve)
   *
   * threshold: 0.15 = attiva quando il 15% della card è visibile
   */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Ritardo progressivo: ogni card appare 80ms dopo la precedente
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);

        cardObserver.unobserve(entry.target);  // smette di osservare
      }
    });
  }, { threshold: 0.15 });

  // Osserva tutte le .card presenti nella pagina
  document.querySelectorAll('.card').forEach(card => {
    cardObserver.observe(card);
  });


  // ─── 5. DOWNLOAD TRACKER ────────────────────────────────
  /**
   * Quando l'utente clicca un bottone di download:
   * 1. Mostra un "toast" (notifica) di conferma in basso a destra
   * 2. Registra il download nella console (in un sito reale
   *    si manderebbe una chiamata fetch() alle analytics)
   * 3. Gestisce lo stato "loading" del bottone
   *
   * Il toast è un div nascosto nel DOM,
   * che mostriamo aggiungendo la classe "show".
   */

  // Creiamo il div toast dinamicamente e lo aggiungiamo al body
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);

  let toastTimeout;  // per cancellare il timer se arriva un nuovo toast

  function showToast(message) {
    // Cancella eventuale toast precedente ancora visibile
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');

    // Dopo 3 secondi, nascondi il toast
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Aggiungiamo il listener a tutti i bottoni di download
  document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Recupera il nome del report dal data attribute o dal testo vicino
      const reportCard = this.closest('.report-card');
      const reportName = reportCard
        ? reportCard.querySelector('.report-name').textContent
        : 'Report';

      // Feedback visivo sul bottone
      this.classList.add('loading');
      const originalHTML = this.innerHTML;
      this.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
          <circle cx="12" cy="12" r="9" opacity="0.3"/>
          <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="0 12 12;360 12 12" dur="0.8s" repeatCount="indefinite"/>
          </path>
        </svg>
        Download...
      `;

      // Ripristina dopo 1.5s (simulazione download avviato)
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.classList.remove('loading');
      }, 1500);

      // Mostra il toast di conferma
      showToast(`⬇️ Download avviato: ${reportName}`);

      // Log nella console (utile per debug e analytics)
      console.log(`[Download] ${reportName} — ${new Date().toLocaleTimeString()}`);
    });
  });


  // ─── 6. DROPDOWN MOBILE (click/touch) ───────────────────
  /**
   * Su desktop i dropdown si aprono con :hover (puro CSS).
   * Su mobile/tablet il hover non esiste, quindi usiamo
   * JavaScript per aprire/chiudere al click.
   *
   * Ogni .nav-item con dropdown riceve un listener "click".
   * Cliccando fuori dal menu, tutti i dropdown si chiudono.
   */
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown');
    if (!dropdown) return;  // salta i nav-item senza dropdown

    item.addEventListener('click', function(e) {
      // Solo su mobile (larghezza < 900px)
      if (window.innerWidth > 900) return;

      e.stopPropagation();  // impedisce la propagazione al document
      const isOpen = this.classList.contains('open');

      // Chiudi tutti i dropdown aperti
      navItems.forEach(n => n.classList.remove('open'));

      // Apri/chiudi questo
      if (!isOpen) this.classList.add('open');
    });
  });

  // Clic fuori dalla nav chiude tutti i dropdown
  document.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('open'));
  });


  // ─── 7. FILTRO REPORT ───────────────────────────────────
  /**
   * Aggiunge dinamicamente una barra di filtro nella
   * sezione sostenibilità, sopra la lista dei report.
   *
   * Usa i data attributes HTML per filtrare le card:
   * <div class="report-card" data-type="dnf" data-year="2023">
   *
   * Concetti usati:
   * - Creazione elementi DOM con createElement()
   * - insertBefore() per inserire prima di un elemento
   * - dataset per leggere data-*
   * - Array.from() + filter() per trovare le card da mostrare
   */
  const reportsContainer = document.getElementById('reports-container');
  if (reportsContainer) {

    // Aggiunge data attributes alle card esistenti
    const reportCards = reportsContainer.querySelectorAll('.report-card');
    const typesMap = ['dnf', 'dnf', 'dnf', 'annual'];
    const yearsMap = ['2023', , '2024', '2023'];

    reportCards.forEach((card, i) => {
      card.dataset.type = typesMap[i] || 'dnf';
      card.dataset.year = yearsMap[i] || '2023';
    });

    // Crea la barra filtri
    const filterBar = document.createElement('div');
    filterBar.style.cssText = `
      display: flex;
      gap: 0.6rem;
      margin-bottom: 1.2rem;
      flex-wrap: wrap;
    `;

    const filters = [
      { label: 'Tutti',         type: 'all',    year: 'all' },
      { label: 'DNF',           type: 'dnf',    year: 'all' },
      { label: 'Annual Report', type: 'annual', year: 'all' },
      { label: '2023',          type: 'all',    year: '2023' },
      { label: '2024',          type: 'all',    year: '2024' },
    ];

    filters.forEach((f, index) => {
      const btn = document.createElement('button');
      btn.textContent = f.label;
      btn.style.cssText = `
        padding: 0.35rem 0.9rem;
        border: 1px solid rgba(201,168,76,0.4);
        background: ${index === 0 ? 'rgba(201,168,76,0.2)' : 'transparent'};
        color: rgba(255,255,255,0.7);
        font-size: 0.75rem;
        font-family: inherit;
        font-weight: 600;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: background .2s;
      `;

      btn.addEventListener('click', function() {
        // Resetta stile tutti i bottoni
        filterBar.querySelectorAll('button').forEach(b => {
          b.style.background = 'transparent';
        });
        this.style.background = 'rgba(201,168,76,0.2)';

        // Mostra/nascondi le card in base al filtro
        reportCards.forEach(card => {
          const matchType = f.type === 'all' || card.dataset.type === f.type;
          const matchYear = f.year === 'all' || card.dataset.year === f.year;

          if (matchType && matchYear) {
            card.style.display = 'flex';
            // Piccola animazione di riapparizione
            card.style.opacity = '0';
            setTimeout(() => { card.style.opacity = '1'; }, 50);
          } else {
            card.style.display = 'none';
          }
        });

        console.log(`[Filtro] Tipo: ${f.type}, Anno: ${f.year}`);
      });

      filterBar.appendChild(btn);
    });

    // Inserisce la barra filtri prima della lista report
    reportsContainer.parentNode.insertBefore(filterBar, reportsContainer);
  }

  // ─── LOG DI INIZIALIZZAZIONE ─────────────────────────────
  console.log('%c Gruppo Veronesi — Sito Didattico ', 'background:#c0392b;color:#fff;padding:4px 8px;border-radius:3px;font-weight:bold;');
  console.log('%c JS caricato correttamente ✓', 'color:#c9a84c;');

}); // Fine DOMContentLoaded
