/**
 * AWS COMMUNITY GSMCOE (PUNE)
 * Main JavaScript File (Vanilla JS)
 * Handles Dynamic Event Rendering, Filtering, Modals, Mobile Nav Drawer & PWA
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initEventsSystem();
  initPwaServiceWorker();
  initSmoothScroll();
});

/* ==========================================================================
   1. Dynamic Events Data & Rendering System
   ========================================================================== */
const EVENTS_DATA = [
  {
    id: 'event-01',
    title: 'AWS Community Launch Meetup & Orientation',
    day: '7',
    month: 'SEP 2026',
    type: 'Community Meetup',
    status: 'upcoming',
    shortDesc: 'Kickoff session introducing the AWS Student Community at GSMCOE Pune. Learn about upcoming learning tracks, workshops, and builder projects.',
    fullDesc: 'Join us for the official launch meetup of the AWS Student Community at Genba Sopanrao Moze College of Engineering (GSMCOE), Pune! We will discuss cloud fundamentals, community roadmap, AWS certification roadmaps, hands-on workshops, and how you can get actively involved as a student builder.',
    time: '11:00 AM – 01:30 PM IST',
    location: 'Main Auditorium / Seminar Hall, GSMCOE Campus, Pune'
  },
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
  // },
  // {
  //   id: 'event-03',
  //   title: 'Build on AWS: Serverless & Generative AI Workshop',
  //   day: '12',
  //   month: 'OCT 2026',
  //   type: 'Builder Session',
  //   status: 'upcoming',
  //   shortDesc: 'Explore AWS Lambda, Amazon Bedrock, and API Gateway to build real-world intelligent applications without managing servers.',
  //   fullDesc: 'Dive into modern serverless architecture and Generative AI on AWS. Learn how to connect Amazon Bedrock LLMs with AWS Lambda functions and API Gateway to create serverless AI assistants and microservices.',
  //   time: '10:30 AM – 03:30 PM IST',
  //   location: 'Advanced Computing Center, GSMCOE Pune'
  // },
  // {
  //   id: 'event-04',
  //   title: 'AWS Cloud Practitioner & Developer Study Jam',
  //   day: '05',
  //   month: 'AUG 2026',
  //   type: 'Study Session',
  //   status: 'past',
  //   shortDesc: 'Collaborative study group session breaking down domain objectives for AWS Certified Cloud Practitioner and Solutions Architect exams.',
  //   fullDesc: 'A peer-led study session focused on AWS architectural best practices, core cloud services, pricing models, and hands-on practice exam questions.',
  //   time: '01:00 PM – 04:00 PM IST',
  //   location: 'Library Conference Room, GSMCOE Pune'
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
   4. PWA Service Worker Registration & Mobile Install Prompt
   ========================================================================== */
function initPwaServiceWorker() {
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

  // PWA Install Prompt handling
  let deferredPrompt;
  const footerPwaBtn = document.getElementById('pwa-install-btn');
  const bannerPwa = document.getElementById('pwa-install-banner');
  const bannerInstallBtn = document.getElementById('pwa-banner-install-btn');
  const bannerCloseBtn = document.getElementById('pwa-banner-close-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (footerPwaBtn) {
      footerPwaBtn.style.display = 'inline-block';
    }

    // Show mobile banner on mobile viewports
    if (bannerPwa && window.innerWidth <= 768) {
      bannerPwa.style.display = 'flex';
    }

    const triggerPrompt = () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
        }
        deferredPrompt = null;
        if (bannerPwa) bannerPwa.style.display = 'none';
        if (footerPwaBtn) footerPwaBtn.style.display = 'none';
      });
    };

    if (footerPwaBtn) footerPwaBtn.addEventListener('click', triggerPrompt);
    if (bannerInstallBtn) bannerInstallBtn.addEventListener('click', triggerPrompt);
  });

  if (bannerCloseBtn && bannerPwa) {
    bannerCloseBtn.addEventListener('click', () => {
      bannerPwa.style.display = 'none';
    });
  }
}
