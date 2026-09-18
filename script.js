/**
 * AWS Student Builder Group - GSMCOE, PUNE
 * Main JavaScript File (Vanilla JS)
 * Handles Dynamic Event Rendering, Filtering, Modals, Mobile Nav Drawer, PWA & Automated Event Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initEventsSystem();
  initPwaAndNotifications();
  initSmoothScroll();
});

/* ==========================================================================
   1. Dynamic Events Data & Rendering System
   ========================================================================== */
const EVENTS_DATA = [
  {
    id: 'event-01',
    title: 'AWS Student Builder Group Launch Meetup & Orientation',
    day: '10',
    month: 'SEP 2026',
    type: 'Community Meetup',
    status: 'upcoming',
    shortDesc: 'Kickoff session introducing the AWS Student Builder Group at GSMCOE Pune. Learn about upcoming learning tracks, workshops, builder projects, and ID verification.',
    fullDesc: 'Join us for the official launch meetup of the AWS Student Builder Group at Genba Sopanrao Moze College of Engineering (GSMCOE), Pune! We will discuss cloud fundamentals, group roadmap, AWS certification roadmaps, hands-on workshops, Builder ID verification, and how you can get actively involved as a student builder.',
    time: '11:00 AM – 01:30 PM IST',
    location: 'Main Auditorium / Seminar Hall, GSMCOE Campus, Pune'
  }
  // To add a new event, simply add an event object here with a unique `id` (e.g. 'event-02'), then push to GitHub!
  // {
  //   id: 'event-02',
  //   title: 'Hands-on Cloud Fundamentals & S3/EC2 Workshop',
  //   day: '28',
  //   month: 'SEP 2026',
  //   type: 'Technical Workshop',
  //   status: 'upcoming',
  //   shortDesc: 'Step-by-step practical workshop on launching compute instances, configuring IAM roles, and serving static assets via Amazon S3.',
  //   fullDesc: 'An interactive hands-on lab session for beginners and project builders. Participants will create free-tier AWS accounts, configure IAM security policies, deploy Linux virtual servers on EC2, and host static web applications using Amazon Simple Storage Service (S3).',
  //   time: '02:00 PM – 05:00 PM IST',
  //   location: 'Computer Engineering Lab 3, GSMCOE Pune'
  // }
];

function initEventsSystem() {
  const eventsContainer = document.getElementById('events-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('event-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!eventsContainer) return;

  // Render initial events (All)
  renderEvents('all');

  // Filter Buttons Event Listener
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      renderEvents(filter);
    });
  });

  // Function to render event rows
  function renderEvents(filter) {
    eventsContainer.innerHTML = '';
    
    const filteredEvents = EVENTS_DATA.filter(event => {
      if (filter === 'all') return true;
      return event.status === filter;
    });

    if (filteredEvents.length === 0) {
      eventsContainer.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; border: 1px solid var(--color-border); font-style: italic;">
          No events found for this filter category.
        </div>
      `;
      return;
    }

    filteredEvents.forEach(event => {
      const eventRow = document.createElement('div');
      eventRow.className = 'event-row';
      eventRow.innerHTML = `
        <div class="event-date-box">
          <div class="event-date-day">${event.day}</div>
          <div class="event-date-month">${event.month}</div>
        </div>
        <div class="event-details-main">
          <h3>${event.title}</h3>
          <p>${event.shortDesc}</p>
          <span class="event-tag">${event.type} • ${event.status.toUpperCase()}</span>
        </div>
        <div>
          <button class="btn btn-secondary view-event-btn" data-id="${event.id}" style="width: 100%;">
            View Details <span class="arrow-icon">→</span>
          </button>
        </div>
      `;
      eventsContainer.appendChild(eventRow);
    });

    // Attach event listeners for View Details buttons
    document.querySelectorAll('.view-event-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eventId = e.currentTarget.getAttribute('data-id');
        openEventModal(eventId);
      });
    });
  }

  // Open Modal logic
  function openEventModal(eventId) {
    const event = EVENTS_DATA.find(item => item.id === eventId);
    if (!event || !modalOverlay) return;

    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-date').textContent = `${event.day} ${event.month} • ${event.time}`;
    document.getElementById('modal-location').textContent = `📍 ${event.location}`;
    document.getElementById('modal-desc').textContent = event.fullDesc;
    document.getElementById('modal-tag').textContent = `${event.type} (${event.status.toUpperCase()})`;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close Modal logic
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });

  function openMobileDrawer() {
    drawer.classList.add('active');
    toggleBtn.textContent = 'CLOSE';
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    drawer.classList.remove('active');
    toggleBtn.textContent = 'MENU';
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close drawer on link click
  document.querySelectorAll('.mobile-nav-link, .mobile-cta-full').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });
}

/* ==========================================================================
   3. Smooth Scroll Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#become-member') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. PWA Install Prompt, Notification Permissions & New Event Auto-Notifier
   ========================================================================== */
function initPwaAndNotifications() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  const footerPwaBtn = document.getElementById('pwa-install-btn');
  const bannerPwa = document.getElementById('pwa-install-banner');
  const bannerInstallBtn = document.getElementById('pwa-banner-install-btn');
  const bannerCloseBtn = document.getElementById('pwa-banner-close-btn');

  // Helper: Check if PWA is installed or standalone
  function checkPwaInstalled() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      localStorage.getItem('pwa_installed') === 'true'
    );
  }

  // Hide PWA install prompt completely if installed
  if (checkPwaInstalled()) {
    if (bannerPwa) bannerPwa.style.display = 'none';
    if (footerPwaBtn) {
      footerPwaBtn.textContent = '🔔 Event Notifications Active';
      footerPwaBtn.style.display = 'inline-block';
    }

    // Automatically request notification permission if app is installed and permission is default
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        requestNotificationPermission();
      }, 2000);
    }
  }

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // If app is NOT installed, show install banner popup
    if (!checkPwaInstalled()) {
      if (bannerPwa) {
        bannerPwa.style.display = 'flex';
      }
      if (footerPwaBtn) {
        footerPwaBtn.style.display = 'inline-block';
        footerPwaBtn.textContent = '📲 Install App & Get Notifications';
      }
    }
  });

  // Listen for completed installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    localStorage.setItem('pwa_installed', 'true');
    if (bannerPwa) bannerPwa.style.display = 'none';
    if (footerPwaBtn) {
      footerPwaBtn.textContent = '🔔 Event Notifications Active';
    }
    // Take notification permission from user once installed
    requestNotificationPermission();
  });

  // Action: Trigger Install + Request Notification Permission
  const handleInstallAndNotify = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
          localStorage.setItem('pwa_installed', 'true');
          if (bannerPwa) bannerPwa.style.display = 'none';
          requestNotificationPermission();
        }
        deferredPrompt = null;
      });
    } else {
      // If already installed or browser handled it, request notification permission directly
      requestNotificationPermission();
    }
  };

  if (bannerInstallBtn) bannerInstallBtn.addEventListener('click', handleInstallAndNotify);
  if (footerPwaBtn) footerPwaBtn.addEventListener('click', handleInstallAndNotify);

  if (bannerCloseBtn && bannerPwa) {
    bannerCloseBtn.addEventListener('click', () => {
      bannerPwa.style.display = 'none';
    });
  }

  // Request Notification Permission Function
  function requestNotificationPermission() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('[Notification] Permission granted!');
          showWelcomeNotification();
          checkAndNotifyNewEvents();
        }
      });
    } else if (Notification.permission === 'granted') {
      checkAndNotifyNewEvents();
    }
  }

  function showWelcomeNotification() {
    const title = '🎉 Welcome to AWS Student Builder Group!';
    const options = {
      body: 'You will now receive instant push notifications whenever new AWS events & workshops are added!',
      icon: 'assets/aws_gsmcoe_logo.jpeg',
      badge: 'assets/favicon.svg',
      data: { url: window.location.origin + '/#events' }
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
    } else {
      new Notification(title, options);
    }
  }

  // AUTOMATED EVENT NOTIFICATION ARCHITECTURE (Requirement 5)
  // Compares current EVENTS_DATA in script.js against stored event IDs in localStorage.
  // When developer adds/updates events in script.js and pushes, users get notified!
  function checkAndNotifyNewEvents() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const currentEventIds = EVENTS_DATA.map(e => e.id);
    const storedIdsJson = localStorage.getItem('sbg_known_event_ids');

    if (storedIdsJson === null) {
      // First visit: save initial state
      localStorage.setItem('sbg_known_event_ids', JSON.stringify(currentEventIds));
      return;
    }

    try {
      const knownIds = JSON.parse(storedIdsJson);
      const newEvents = EVENTS_DATA.filter(e => !knownIds.includes(e.id));

      if (newEvents.length > 0) {
        newEvents.forEach(event => {
          const title = `🚨 New Event: ${event.title}`;
          const options = {
            body: `${event.shortDesc}\n📅 ${event.day} ${event.month} | 📍 ${event.location}`,
            icon: 'assets/aws_gsmcoe_logo.jpeg',
            badge: 'assets/favicon.svg',
            tag: `sbg-event-${event.id}`,
            data: { url: window.location.origin + '/#events' }
          };

          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
          } else {
            new Notification(title, options);
          }
        });

        // Save updated known IDs
        localStorage.setItem('sbg_known_event_ids', JSON.stringify(currentEventIds));
      }
    } catch (e) {
      console.error('[Notification] Error parsing stored event IDs:', e);
      localStorage.setItem('sbg_known_event_ids', JSON.stringify(currentEventIds));
    }
  }

  // Trigger check on startup
  checkAndNotifyNewEvents();
}
