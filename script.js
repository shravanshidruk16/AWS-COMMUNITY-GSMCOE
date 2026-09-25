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
      title: 'Introduction to AWS SBG Club',
      day: '1',
      month: 'OCT 2026',
      type: 'Seminar Workshop',
      status: 'upcoming',
      shortDesc: 'Discover the AWS Student Builder Group, its activities, learning opportunities, projects, and how students can start their AWS journey.',
      fullDesc: 'An introductory seminar to the AWS Student Builder Group at GSMCOE, designed to give students a complete overview of the community, its purpose, activities, and opportunities. The session will explain what AWS Student Builder Groups are, how students can participate, how to create and verify an AWS Builder Center account, and how to make the most of the AWS learning ecosystem. Students will be introduced to AWS and cloud learning pathways, hands-on workshops, technical sessions, practical labs, project-building activities, challenges, hackathons, certification guidance, curated learning resources, peer collaboration, and relevant internship and career opportunities shared through the community. The session will also introduce the official AWS Builder Center Space created for GSMCOE, where upcoming activities, announcements, resources, opportunities, and event updates will be published. Students from GSMCOE and other colleges who are interested in AWS, Cloud Computing, AI/ML, DevOps, Software Development, and emerging technologies are welcome to participate. Beginners are encouraged to attend and start their journey from the basics. The session will conclude with guidance on joining the community, following the official Builder Space and Builder profiles, and getting started with learning, building, and participating in upcoming AWS Student Builder activities.',
      time: '11:00 AM - 1:00 PM IST',
      location: 'Seminar Hall, GSMCOE, Balewadi, Pune'
    },
    {
      id: 'event-02',
      title: 'All about AWS Builder Group - GSMCOE, Pune',
      day: '2',
      month: 'OCT 2026',
      type: 'Webinar',
      status: 'upcoming',
      shortDesc: 'Discover the AWS Student Builder Group GSMCOE, its activities, timelines, events, hackathons, internships, AWS certifications, learning paths, and much more.',
      fullDesc: 'An introductory online seminar to the AWS Student Builder Group at GSMCOE, designed to give students a complete overview of the community, its purpose, upcoming activities, events, and opportunities. The session will explain what AWS Student Builder Groups are, how students can participate, how to create and verify an AWS Builder Center account, and how to make the most of the AWS learning ecosystem. Students will get a complete overview of the activities planned by SBG GSMCOE, including technical sessions, online meetings, hands-on workshops, practical labs, structured learning paths, project-building activities, team-based industry-ready projects, challenges, hackathons, competitions, quizzes, community collaborations, AWS certification guidance, curated learning resources, peer networking, role-based project opportunities, and relevant internship and career opportunities shared through the community. The session will also introduce the planned SBG GSMCOE event roadmap and explain how students can participate in upcoming events, learning activities, projects, competitions, and community initiatives throughout the academic year. Students will be introduced to AWS, cloud computing, AI/ML, Generative AI, DevOps, software development, cybersecurity, data and analytics, and other emerging technologies through the community learning ecosystem. Beginners are encouraged to attend and start their journey from the basics. The session will also introduce the official AWS Builder Center Space created for GSMCOE, where upcoming activities, announcements, resources, opportunities, learning materials, projects, and event updates will be published. Students will receive guidance on joining the official SBG GSMCOE community, following the Builder Space and relevant Builder profiles, creating their AWS Builder identity, exploring AWS learning resources, and getting started with learning, building, collaborating, and participating in upcoming AWS Student Builder activities. Students from GSMCOE and other colleges who are interested in AWS, Cloud Computing, AI/ML, DevOps, Software Development, and emerging technologies are welcome to participate in this online session.',
      time: '10:00 PM - 12:00 AM IST',
      location: 'Online Webinar'
    }
    
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
   4. PWA Install Banner, Notification Permissions & Automated Event Notifier
   ========================================================================== */
function initPwaAndNotifications() {
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
          // Check for service worker updates periodically
          setInterval(() => {
            reg.update();
          }, 60000);
        })
        .catch(err => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });

    // Listen for Service Worker update messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_UPDATED') {
        console.log('[PWA] SW Updated! Fetching latest events...');
        fetchLatestScriptAndNotify();
      }
    });
  }

  const footerPwaBtn = document.getElementById('footer-pwa-btn') || document.getElementById('pwa-install-btn');
  const bannerPwa = document.getElementById('pwa-install-banner');
  const bannerInstallBtn = document.getElementById('pwa-banner-install-btn');
  const bannerCloseBtn = document.getElementById('pwa-banner-close-btn') || document.getElementById('pwa-close-btn');

  // Helper: Check if running as installed standalone PWA
  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  // Helper: Detect iOS Safari
  function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  let deferredPrompt;

  // Show banner on page load if not running in standalone mode and not dismissed in current session
  if (bannerPwa && !isStandalone() && sessionStorage.getItem('pwa_banner_closed') !== 'true') {
    setTimeout(() => {
      bannerPwa.style.display = 'flex';
    }, 800);
  }

  if (footerPwaBtn) {
    footerPwaBtn.style.display = 'inline-block';
    if (isStandalone()) {
      footerPwaBtn.textContent = '🔔 Event Notifications Active';
    } else {
      footerPwaBtn.textContent = '📲 Install App & Get Notifications';
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt event captured');

    if (bannerPwa && !isStandalone() && sessionStorage.getItem('pwa_banner_closed') !== 'true') {
      bannerPwa.style.display = 'flex';
    }
  });

  // Handle App Installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    localStorage.setItem('pwa_installed', 'true');
    if (bannerPwa) bannerPwa.style.display = 'none';
    if (footerPwaBtn) footerPwaBtn.textContent = '🔔 Event Notifications Active';
    
    // Automatically request notification permission after install
    requestNotificationPermission();
  });

  // Action Handler: Trigger Install + Request Notification Permission
  const handleInstallAndNotify = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
          localStorage.setItem('pwa_installed', 'true');
          if (bannerPwa) bannerPwa.style.display = 'none';
        }
        deferredPrompt = null;
        requestNotificationPermission();
      });
    } else if (isIos()) {
      alert('📲 To install AWS SBG App on iOS:\n\n1. Tap the Share button (📤) in Safari.\n2. Scroll down and tap "Add to Home Screen".');
      requestNotificationPermission();
    } else {
      // Direct notification request if already installed or unsupported prompt
      requestNotificationPermission();
      if (isStandalone()) {
        alert('🔔 Event notifications are active for AWS SBG App!');
      } else {
        alert('📲 App installation prompt ready. If not prompted, use your browser menu "Install AWS SBG GSMCOE" or "Add to Home Screen".');
      }
    }
  };

  if (bannerInstallBtn) bannerInstallBtn.addEventListener('click', handleInstallAndNotify);
  if (footerPwaBtn) footerPwaBtn.addEventListener('click', handleInstallAndNotify);

  if (bannerCloseBtn && bannerPwa) {
    bannerCloseBtn.addEventListener('click', () => {
      bannerPwa.style.display = 'none';
      sessionStorage.setItem('pwa_banner_closed', 'true');
    });
  }

  // Notification Permission Request
  function requestNotificationPermission() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('[Notification] Permission granted!');
          showWelcomeNotification();
          fetchLatestScriptAndNotify();
        }
      });
    } else if (Notification.permission === 'granted') {
      fetchLatestScriptAndNotify();
    }
  }

  function showWelcomeNotification() {
    const title = '🎉 Welcome to AWS Student Builder Group!';
    const options = {
      body: 'Notifications active! You will receive instant updates when new AWS events are published.',
      icon: 'assets/icon-192.png',
      badge: 'assets/favicon.svg',
      data: { url: window.location.origin + '/#events' }
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
    } else {
      new Notification(title, options);
    }
  }

  // Helper to construct event signatures
  function getEventSig(e) {
    return `${e.id}::${e.title || ''}::${e.day || ''}::${e.month || ''}::${e.time || ''}::${e.status || ''}::${e.shortDesc || ''}`;
  }

  // AUTOMATED LIVE EVENT NOTIFICATION ARCHITECTURE
  // Detects both brand new events AND edits/updates to existing events!
  function checkAndNotifyEventsFromList(eventsList) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const currentSigs = {};
    eventsList.forEach(e => {
      currentSigs[e.id] = getEventSig(e);
    });

    const storedSigsJson = localStorage.getItem('sbg_known_event_signatures');

    if (storedSigsJson === null) {
      // First visit: store current event signatures baseline
      localStorage.setItem('sbg_known_event_signatures', JSON.stringify(currentSigs));
      return;
    }

    try {
      const knownSigs = JSON.parse(storedSigsJson);
      const notificationsToFire = [];

      eventsList.forEach(event => {
        const sig = currentSigs[event.id];

        if (!knownSigs[event.id]) {
          // Brand New Event Added!
          notificationsToFire.push({
            title: `🚨 New Event: ${event.title}`,
            body: `📅 ${event.day} ${event.month} | 📍 ${event.location}\n${event.shortDesc}`,
            tag: `sbg-event-new-${event.id}-${Date.now()}`
          });
        } else if (knownSigs[event.id] !== sig) {
          // Existing Event Details Modified / Updated!
          notificationsToFire.push({
            title: `📢 Event Updated: ${event.title}`,
            body: `📅 ${event.day} ${event.month} | 📍 ${event.location}\n${event.shortDesc}`,
            tag: `sbg-event-upd-${event.id}-${Date.now()}`
          });
        }
      });

      if (notificationsToFire.length > 0) {
        notificationsToFire.forEach(item => {
          const options = {
            body: item.body,
            icon: 'assets/icon-192.png',
            badge: 'assets/favicon.svg',
            tag: item.tag,
            data: { url: window.location.origin + '/#events' }
          };

          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => reg.showNotification(item.title, options));
          } else {
            new Notification(item.title, options);
          }
        });

        // Save updated event signatures baseline
        localStorage.setItem('sbg_known_event_signatures', JSON.stringify(currentSigs));
      }
    } catch (e) {
      console.error('[Notification] Error checking event signatures:', e);
      localStorage.setItem('sbg_known_event_signatures', JSON.stringify(currentSigs));
    }
  }

  // Live fetcher that retrieves latest script.js with cache-busting
  function fetchLatestScriptAndNotify() {
    // First check local in-memory data
    checkAndNotifyEventsFromList(EVENTS_DATA);

    // Then perform network fetch with timestamp to get fresh remote updates immediately
    fetch('/script.js?v=' + Date.now())
      .then(res => res.text())
      .then(text => {
        // Extract EVENTS_DATA array from script content
        const match = text.match(/const EVENTS_DATA = (\[[\s\S]*?\]);/);
        if (match && match[1]) {
          try {
            // Safe evaluation of array literal
            const remoteEvents = (new Function('return ' + match[1]))();
            if (Array.isArray(remoteEvents)) {
              checkAndNotifyEventsFromList(remoteEvents);
            }
          } catch (err) {
            console.warn('[Notification] Could not parse remote EVENTS_DATA:', err);
          }
        }
      })
      .catch(err => {
        console.warn('[Notification] Network fetch failed, relying on cached data:', err);
      });
  }

  // Initial check on load
  fetchLatestScriptAndNotify();

  // Trigger automated notification check on Window Focus & Tab Visibility Change
  window.addEventListener('focus', fetchLatestScriptAndNotify);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      fetchLatestScriptAndNotify();
    }
  });

  // Background Live Poll every 30 seconds to catch code updates live
  setInterval(fetchLatestScriptAndNotify, 30000);
}
