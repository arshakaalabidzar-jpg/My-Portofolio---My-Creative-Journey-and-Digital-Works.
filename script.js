// Interaksi utama website portfolio Shafia

// =================================
// PULL CORD SWITCH & DARK MODE
// =================================

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const pullCord = document.getElementById('pullCord');
const cordLine = document.getElementById('cordLine');
const cordHandle = document.getElementById('cordHandle');

// Website dimulai dengan Light Mode
root.dataset.theme = 'light';

themeToggle.querySelector('.theme-icon').textContent = '☾';

// Kunci scroll sebelum tali ditarik
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

document.documentElement.classList.add('scroll-locked');
document.body.classList.add('scroll-locked');

// Variabel tarikan
let darkModeUnlocked = false;
let isDragging = false;

let startX = 0;
let startY = 0;

let currentPull = 0;
let currentDX = 0;
let currentDY = 0;

const pullLimit = 85;

const baseX = 120;
const baseY = 165;


// =================================
// MENGATUR BENTUK TALI
// =================================

function drawCord(dx, dy) {

    currentDX = dx;
    currentDY = dy;

    const endX = baseX + dx;
    const endY = baseY + dy;

    // Membuat lengkungan tali
    const bend =
        Math.min(22, Math.abs(dx) * 0.16 + dy * 0.025)
        * (dx < 0 ? -1 : 1);

    const c1x = baseX + dx * 0.20 + bend;
    const c1y = 55 + dy * 0.18;

    const c2x = baseX + dx * 0.78 + bend * 0.45;
    const c2y = 120 + dy * 0.78;

    // Mengubah bentuk SVG secara langsung
    cordLine.setAttribute(
        'd',
        `M ${baseX} 0 C ${c1x} ${c1y},
        ${c2x} ${c2y}, ${endX} ${endY}`
    );

    // Menggerakkan pegangan
    cordHandle.style.left = `calc(50% + ${dx}px)`;
    cordHandle.style.top = `${endY - 10}px`;
}


// =================================
// AKTIVASI DARK MODE
// =================================

function activateDarkMode() {

    if (darkModeUnlocked) return;

    darkModeUnlocked = true;

    // Mengaktifkan Dark Mode
    root.dataset.theme = 'dark';

    themeToggle.querySelector('.theme-icon').textContent = '☼';

    themeToggle.setAttribute('aria-pressed', 'true');
    pullCord.setAttribute('aria-pressed', 'true');

    document.body.classList.add('dark-unlocked');

    // Membuka kembali scroll
    document.documentElement.classList.remove('scroll-locked');
    document.body.classList.remove('scroll-locked');
}


// =================================
// TOMBOL THEME TOGGLE
// =================================

themeToggle.addEventListener('click', () => {

    if (!darkModeUnlocked) return;

    const next =
        root.dataset.theme === 'light' ? 'dark' : 'light';

    root.dataset.theme = next;

    themeToggle.querySelector('.theme-icon').textContent =
        next === 'light' ? '☾' : '☼';

    themeToggle.setAttribute(
        'aria-pressed',
        String(next === 'dark')
    );
});


// =================================
// SAAT TALI MULAI DITARIK
// =================================

pullCord.addEventListener('pointerdown', (event) => {

    if (darkModeUnlocked) return;

    isDragging = true;

    startX = event.clientX;
    startY = event.clientY;

    pullCord.classList.remove('cord-swing');
    pullCord.classList.add('is-dragging');

    pullCord.setPointerCapture(event.pointerId);
});


// =================================
// GERAKAN TALI MENGIKUTI POINTER
// =================================

pullCord.addEventListener('pointermove', (event) => {

    if (!isDragging) return;

    const dx = Math.max(
        -100,
        Math.min(100, event.clientX - startX)
    );

    const dy = Math.max(
        0,
        Math.min(180, event.clientY - startY)
    );

    currentPull = dy;

    drawCord(dx, dy);
});


// =================================
// TALI KEMBALI KE POSISI SEMULA
// =================================

function returnCordToRest() {

    const fromX = currentDX;
    const fromY = currentDY;

    isDragging = false;

    pullCord.classList.remove('is-dragging');

    pullCord.classList.remove('cord-swing');

    void pullCord.offsetWidth;

    pullCord.classList.add('cord-swing');

    const startTime = performance.now();
    const duration = 650;

    function animateBack(now) {

        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        const eased = 1 - Math.pow(1 - progress, 3);

        const wobble =
            Math.sin(progress * Math.PI * 4) * (1 - progress);

        const dx =
            fromX * (1 - eased) + fromX * wobble * 0.08;

        const dy =
            fromY * (1 - eased) +
            fromY * Math.abs(wobble) * 0.06;

        drawCord(dx, dy);

        if (progress < 1) {

            requestAnimationFrame(animateBack);

        } else {

            currentPull = 0;
            drawCord(0, 0);

        }
    }

    requestAnimationFrame(animateBack);

    setTimeout(() => {
        pullCord.classList.remove('cord-swing');
    }, 900);
}


// =================================
// SAAT TALI DILEPASKAN
// =================================

function releaseCord() {

    if (!isDragging) return;

    // Minimal tarikan untuk mengaktifkan Dark Mode
    const shouldUnlock = currentPull >= pullLimit;

    if (shouldUnlock) {
        activateDarkMode();
    }

    returnCordToRest();
}

pullCord.addEventListener('pointerup', releaseCord);

pullCord.addEventListener('pointercancel', () => {

    if (isDragging) {
        returnCordToRest();
    }

});

// Akses keyboard: Enter atau Space
pullCord.addEventListener('click', (event) => {

    if (event.detail !== 0 || darkModeUnlocked) return;

    activateDarkMode();
    returnCordToRest();

});
// Jam dan tanggal mengikuti waktu lokal perangkat.
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
  document.getElementById('date').textContent = now.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
  document.getElementById('yearNow').textContent = now.getFullYear();
}
updateClock();
setInterval(updateClock, 1000);

// Typewriter sederhana untuk role di hero.
const roles = ['Informatics Student', 'UI/UX Enthusiast', 'Creative Digital Explorer', 'Aspiring Web Developer'];
const roleNode = document.getElementById('roleText');
let roleIndex = 0, charIndex = roles[0].length, deleting = false;
function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    roleNode.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) { deleting = true; setTimeout(typeRole, 1400); return; }
  } else {
    charIndex--;
    roleNode.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 45 : 85);
}
setTimeout(typeRole, 1800);


// Mobile navigation.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = [...document.querySelectorAll('.nav-link')];

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

// Navigasi langsung berpindah saat diklik.
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');

    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Header state, active navigation, and reveal animations.
const header = document.querySelector('.site-header');
const sections = [...document.querySelectorAll('main section[id]')];

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      const match = navLinks.find(link =>
        link.getAttribute('href') === `#${entry.target.id}`
      );

      if (match) {
        navLinks.forEach(link => link.classList.remove('active'));
        match.classList.add('active');
      }
    }
  });
}, {threshold: 0.16});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 25);
}, {passive:true});

// Door details: update content without leaving the page.
const serviceData = {
  uiux: {
    teaser: 'Merancang tampilan digital yang menarik, mudah dipahami, dan nyaman digunakan.',
    title: 'UI/UX & Interface Design',
    description: 'I enjoy shaping digital interfaces by thinking about the people who will use them. My current practice includes organizing information, mapping user flows, and turning ideas into interactive prototypes.',
    skills: ['Figma', 'Wireframing', 'User Flow', 'Prototyping', 'Basic UX Principles'],
    work: 'Featured work: Sales & Service Interface for Nasi T.O Mughni.'
  },

  development: {
    teaser: 'Mengubah ide menjadi website dan aplikasi melalui logika dan baris kode.',
    title: 'Web & Application Development',
    description: 'I am developing my programming foundation through coursework and small applications — learning to translate a problem into clear steps and functional code.',
    skills: ['HTML', 'CSS', 'JavaScript Basics', 'Java', 'Python', 'MySQL'],
    work: 'Featured work: Gauss & Gauss-Jordan Calculator and Login Page Interface.'
  },

  creative: {
    teaser: 'Merangkai warna, visual, dan cerita menjadi karya yang memiliki karakter.',
    title: 'Creative Design & Multimedia',
    description: 'Visual communication is another way I like to explore ideas. I have worked on publication layouts, visual content, and editing for organizational and operational needs.',
    skills: ['Canva', 'CapCut', 'Layout Design', 'Photo Editing', 'Video Editing', 'Publication Design'],
    work: 'Experience: Creative Team at CV. Mandiri Jaya and Kominfo at UKM Persma SUAKA.'
  },

  administration: {
    teaser: 'Mengelola informasi dan dokumen digital dengan rapi, teliti, dan terstruktur.',
    title: 'Administration & Digital Documentation',
    description: 'My administrative background taught me to value accuracy, consistency, and clear documentation — skills I bring into every project and collaboration.',
    skills: ['Document Archiving', 'Digital Scanning', 'Microsoft Office', 'Data Organization', 'Administrative Documentation'],
    work: 'Experience: Records and Archives Intern at Pengadilan Agama Kabupaten Tasikmalaya Kelas 1A.'
  }
};


const detail = document.getElementById('serviceDetail');
const detailContent = document.getElementById('serviceDetailContent');
const backDoors = document.getElementById('backDoors');

// Membuat lapisan transisi gelap
const transitionLayer = document.createElement('div');
transitionLayer.className = 'door-transition';
document.body.appendChild(transitionLayer);

// Klik pintu
document.querySelectorAll('.door-card').forEach(door => {
  door.addEventListener('click', () => {
    const data = serviceData[door.dataset.service];

    if (!data || door.classList.contains('is-opening')) return;

    // Kunci scroll dashboard
    document.body.classList.add('door-entering');

    // Buka pintu
    door.classList.add('is-opening');

    // Mulai efek gelap
    setTimeout(() => {
      transitionLayer.classList.add('active');
    }, 250);

    // Masuk ke halaman detail
    setTimeout(() => {
      detailContent.innerHTML = `
        <span class="project-type">EXPLORE THE AREA</span>
        <h3>${data.title}</h3>
        <p>${data.description}</p>

        <div class="service-columns">
          <div>
            <h4>TOOLS & SKILLS</h4>
            <ul>
              ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4>RELATED EXPERIENCE</h4>
            <p>${data.work}</p>
          </div>
        </div>
      `;

      detail.hidden = false;
      document.querySelector('.site-header').style.display = 'none';

      document.body.classList.remove('door-entering');
      document.body.classList.add('service-page');

      // Lepaskan layar gelap secara perlahan
      requestAnimationFrame(() => {
        transitionLayer.classList.remove('active');
      });

      door.classList.remove('is-opening');

    }, 1200);
  });
});


// Kembali ke halaman empat pintu
backDoors.addEventListener('click', () => {
  detail.hidden = true;

  document.querySelector('.site-header').style.display = '';

  document.body.classList.remove('door-entering');
  document.body.classList.remove('service-page');

  document.querySelectorAll('.door-card').forEach(item => {
    item.classList.remove('door-muted', 'is-opening');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// Navigasi utama tetap bisa digunakan
document.querySelectorAll('.main-nav a, .brand').forEach(link => {
  link.addEventListener('click', () => {
    detail.hidden = true;
    document.body.classList.remove('service-page');

    document.querySelectorAll('.door-card').forEach(item => {
      item.classList.remove('door-muted');
    });
  });
});

document.getElementById('backDoors').addEventListener('click', () => {
  detail.hidden = true;
  document.querySelectorAll('.door-card').forEach(item => item.classList.remove('door-muted'));
  document.getElementById('expertise').scrollIntoView({behavior:'smooth'});
});

// Timeline year and progress indicator follow the item nearest the viewport center.
const timelineItems = [...document.querySelectorAll('.timeline-item')];
const timelineObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const index = timelineItems.indexOf(visible.target);
  document.getElementById('activeYear').textContent = visible.target.dataset.year;
  document.getElementById('timelineCount').textContent = `${String(index+1).padStart(2,'0')} / ${String(timelineItems.length).padStart(2,'0')}`;
}, {rootMargin:'-25% 0px -45% 0px', threshold:[0.1,0.3,0.6]});
timelineItems.forEach(item => timelineObserver.observe(item));

// Contact form uses mailto; no server or data storage is involved.
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const message = form.elements['message'].value.trim();
  const feedback = document.getElementById('formFeedback');
  if (!name || !email || !message) {
    feedback.textContent = 'Please complete all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = 'Please enter a valid email address.';
    return;
  }
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  feedback.textContent = 'Opening your email application…';
  window.location.href = `mailto:arshakaalabidzar@gmail.com?subject=${subject}&body=${body}`;
});

