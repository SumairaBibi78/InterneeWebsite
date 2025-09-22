//============================================ NAVIGATION AND SPINNER ==================================================
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const spinner = document.getElementById("spinner");
  const storage_key = "currentPage";

  function showPage(pageId) {
    spinner.classList.remove("hidden");

    setTimeout(() => {
      pages.forEach(p => p.classList.add("hidden"));
      document.getElementById(pageId).classList.remove("hidden");
      spinner.classList.add("hidden");
    }, 300); // Simulate loading delay
  }

  function setActiveNav(pageId) {
    navItems.forEach(i => {
      i.classList.toggle("active", i.dataset.page === pageId);
    });
  }

  navItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      
      const page = item.dataset.page;

      if (page === 'internship' && !isUserSignedIn()) { window.location.href = "signin.html"; return; }
      setActiveNav(page);
      showPage(page);

      localStorage.setItem(storage_key, page);
    });
  });

  const savedPage = localStorage.getItem(storage_key) || "home";
  setActiveNav(savedPage);
  showPage(savedPage);
});

//===================================== SIGN IN, DASHBOARD AND PROFILE BUTTON ===========================================
// 1) Your auth‐check
function isUserSignedIn() { return !!localStorage.getItem('authToken'); }

// 2) Cache the two containers
const headBtns = document.getElementById('headBtns');
const bodyBtns   = document.getElementById('bodyBtns');

// 3) Pull out the individual buttons
const headerSignIn   = headBtns.querySelector('.sbtn');
const headerDash     = headBtns.querySelector('.dbtn');
const headerProfile  = headBtns.querySelector('.prbtn');
const headerJobPort  = headBtns.querySelector('.jpbtn');
const profDiv  = document.querySelector('.prof');
const cols     = profDiv.querySelectorAll('.cols');
const firstP   = cols[0].querySelector('p');
const manageCol= cols[1];
const logoutCol= cols[2];
const overlay = document.querySelector('.overlay');
const mngProf  = document.querySelector('.settings-container');

const bodySignIn     = bodyBtns.querySelector('.bcont:not(#dshbtn)');
const bodyDash       = bodyBtns.querySelector('#dshbtn');
const bodyJobPort    = bodyBtns.querySelector('.jpbtn');

// 4) Show/hide based on auth state
function updateButtons() {
  const signedIn = isUserSignedIn();

  // Header
  headerSignIn.classList.toggle('hidden', signedIn);
  headerDash  .classList.toggle('hidden', !signedIn);
  if (headerProfile) { headerProfile.classList.toggle('hidden', !signedIn); }

  // Body
  bodySignIn .classList.toggle('hidden', signedIn);
  bodyDash   .classList.toggle('hidden', !signedIn);
}

// 5) Job-Portal click logic: sign-in page if not signed in, otherwise go to the portal.
function handleJobPortalClick(e) {
  e.preventDefault();  // prevent any inline navigation
  if (isUserSignedIn()) { window.location.href = 'jobportal.html'; }
  else { window.location.href = 'signin.html'; }
}

// 6) Wire up event listeners
document.addEventListener('DOMContentLoaded', () => {
  updateButtons();

  headerJobPort.addEventListener('click', handleJobPortalClick);
  bodyJobPort  .addEventListener('click', handleJobPortalClick);

  headerSignIn.addEventListener('click', () => { window.location.href = 'signin.html'; });
  bodySignIn.addEventListener('click', () => { window.location.href = 'signin.html'; });

  const userEmail = localStorage.getItem('userEmail') || 'User';
  firstP.textContent = userEmail;

  prbtn.addEventListener('click', () => {
    profDiv.classList.toggle('hidden');
    if (mngProf) mngProf.classList.add('hidden');
  });

  manageCol.addEventListener('click', () => {
    profDiv.classList.add('hidden');
    if (mngProf) {
      overlay.classList.remove('hidden');
      mngProf.classList.remove('hidden');
    }
  });

  logoutCol.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    profDiv.classList.add('hidden');
    if (mngProf) mngProf.classList.add('hidden');
    updateButtons();
  });
});

//========================================= MANAGE PROFILE DIV ===============================================
document.addEventListener('DOMContentLoaded', () => {
  // TAB NAVIGATION
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.settings-section');
  const closeBtn = document.getElementById('closeSettings');

  closeBtn.addEventListener('click', () => {
    mngProf.classList.add('hidden');
    overlay.classList.add('hidden');
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      mngProf.classList.add('hidden');
      overlay.classList.add('hidden');
    }
  });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      sections.forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== target);
      });
    });
  });

  // PROFILE SECTION JS (emails + accounts)
  const emailListEl = document.getElementById('emailList');
  const addEmailBtn = document.getElementById('addEmailBtn');
  let emails = JSON.parse(localStorage.getItem('emails') || '[]');
  if (!emails.length) {
    emails = [{ address: 'user@example.com', primary: true }];
  }
  function renderEmails() {
    emailListEl.innerHTML = '';
    emails.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e.address;
      if (e.primary) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = 'Primary';
        li.appendChild(tag);
      }
      emailListEl.appendChild(li);
    });
    localStorage.setItem('emails', JSON.stringify(emails));
  }
  addEmailBtn.addEventListener('click', () => {
    const input = prompt('Enter new email address:');
    if (input && /\S+@\S+\.\S+/.test(input)) {
      emails.push({ address: input, primary: false });
      renderEmails();
    } else if (input) {
      alert('Please enter a valid email.');
    }
  });
  renderEmails();

  // Placeholder handlers for other buttons
  document.getElementById('connectAccountBtn')
    .addEventListener('click', () => {
      alert('Connect account feature coming soon!');
    });
  document.getElementById('updateProfileBtn')
    .addEventListener('click', () => {
      alert('Update profile feature coming soon!');
    });

  // SECURITY SECTION JS
  const toggleButtons = document.querySelectorAll('.toggle-pwd');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const isPwd  = input.type === 'password';
      input.type  = isPwd ? 'text' : 'password';
      btn.textContent = isPwd ? '😊' : '🙂';
    });
  });

  const updatePwdBtn = document.getElementById('updatePwdBtn');
  updatePwdBtn.addEventListener('click', () => {
    const newPwd = document.getElementById('newPwd').value.trim();
    const confirmPwd = document.getElementById('confirmPwd').value.trim();
    if (!newPwd || !confirmPwd) {
      alert('Please fill out both new password fields.');
      return;
    }
    if (newPwd !== confirmPwd) {
      alert('New passwords do not match.');
      return;
    }
    // Simulate an update
    alert('Your password has been updated successfully!');
    document.getElementById('newPwd').value = '';
    document.getElementById('confirmPwd').value = '';
  });
});

//============================================ THEME TOGGLE ==================================================
const thtgl = document.getElementById('thtgl');
const logoImg = document.getElementById('logoImage');
const lightLogo = '../assets/logo.png';
const darkLogo  = '../assets/white-internee.png';

thtgl.addEventListener('click', () => {
  //toggle classes
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');

  //persist choice
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  //swap button icon and logo
  thtgl.textContent = isDark ? '☀️' : '🌙';
  logoImg.src = isDark ? darkLogo : lightLogo;
});
function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.classList.add(saved);

  //set toggle icon and logo
  thtgl.textContent = saved === 'dark' ? '☀️' : '🌙';
  logoImg.src = saved === 'dark' ? darkLogo : lightLogo;
}
// on initial page load
document.addEventListener('DOMContentLoaded', loadTheme);

//===================================== GRADUATE PROGRAM CATEGORIES AND SECTIONS ===========================================
document.addEventListener('DOMContentLoaded', () => {
  const div3a = document.querySelector('.div3a');
  const div3b = document.querySelector('.div3b');
  const sections = {
    health:   document.querySelector('.health'),
    eng:      document.querySelector('.eng'),
    infotech: document.querySelector('.infotech')
  };
  const STORAGE_KEY = 'selectedCategory';

  function hideAllSections() { Object.values(sections).forEach(sec => sec.classList.add('hidden')); }

  function showCategories() {
    div3a.classList.remove('hidden'); div3b.classList.remove('hidden');
    hideAllSections(); // hide any open detail
    localStorage.removeItem(STORAGE_KEY); // clear saved state
  }

  function selectCategory(cat) {
    div3a.classList.add('hidden');
    div3b.classList.add('hidden');
    hideAllSections();
    sections[cat].classList.remove('hidden');
    localStorage.setItem(STORAGE_KEY, cat);
  }

  // card click handlers (assumes these exist)
  document.querySelector('.card1').addEventListener('click', () => selectCategory('health'));
  document.querySelector('.card2').addEventListener('click', () => selectCategory('eng'));
  document.querySelector('.card3').addEventListener('click', () => selectCategory('infotech'));

  // back button handlers
  document.querySelectorAll('.back-btn').forEach(btn => { btn.addEventListener('click', showCategories); });

  // restore on load
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && sections[saved]) { selectCategory(saved); }
});

//============================================ new js ==================================================