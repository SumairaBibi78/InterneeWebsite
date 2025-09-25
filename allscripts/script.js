//================================ HEADER BUTTONS, BODY's HOME's BUTTON, NAVIGATION AND SPINNER ======================================
document.addEventListener('DOMContentLoaded', () => {
  // ─── ELEMENT REFERENCES ───────────────────────────────────────
  const headerSignIn   = document.querySelector('.mainheader .sbtn');
  const headerDashBtn  = document.querySelector('.mainheader #dshbtn');
  const headerProfile  = document.querySelector('.mainheader #prbtn');
  const bodySignIn     = document.querySelector('#bodyBtns .bcont:not(#dshbtn)');
  const bodyDashBtn    = document.querySelector('#bodyBtns #dshbtn');

  const navItems       = document.querySelectorAll('.mainheader .nav-item');
  const headerJobBtns  = document.querySelectorAll('.mainheader .jpbtn');
  const bodyJobBtns    = document.querySelectorAll('#bodyBtns .jpbtn');

  const spinner        = document.getElementById('spinner');
  const pages          = document.querySelectorAll('.page');

  // ─── SESSION & PAGE STATE ────────────────────────────────────  
  const isLoggedIn = (
    sessionStorage.getItem('isLoggedIn') === 'true' ||
    localStorage.getItem('isLoggedIn')   === 'true'
  );

  // if the URL has a hash (e.g. #jppage), and we have a matching <div id="jppage">,
  // use that; otherwise fall back to sessionStorage or default to 'home'
  const hashPage = window.location.hash.slice(1);
  let currentPage = 'home';
  if (hashPage && document.getElementById(hashPage)) { currentPage = hashPage; }
  else { currentPage = sessionStorage.getItem('currentPage') || 'home'; }

  // if signed-out user on restricted pages
  if (!isLoggedIn && (currentPage === 'internship' || currentPage === 'jppage')) {
    currentPage = 'home';
    sessionStorage.setItem('currentPage', 'home');
  }

  // ─── UI INITIAL STATE ────────────────────────────────────────
  function updateAuthUI() {
    if (isLoggedIn) {
      headerSignIn.classList.add('hidden');
      bodySignIn.classList.add('hidden');
      headerDashBtn.classList.remove('hidden');
      bodyDashBtn.classList.remove('hidden');
      headerProfile.classList.remove('hidden');
    } else {
      headerSignIn.classList.remove('hidden');
      bodySignIn.classList.remove('hidden');
      headerDashBtn.classList.add('hidden');
      bodyDashBtn.classList.add('hidden');
      headerProfile.classList.add('hidden');
    }
  }

  function hideAllPages() {
    pages.forEach(p => p.classList.add('hidden'));
    navItems.forEach(a => a.classList.remove('active'));
  }

  function showPage(id) {
    hideAllPages();
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    // highlight nav-item if it matches
    const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
    if (nav) nav.classList.add('active');
    sessionStorage.setItem('currentPage', id);
  }

  // initial render without spinner
  updateAuthUI();
  showPage(currentPage);

  // ─── NAVIGATION HANDLER ─────────────────────────────────────
  function navigateTo(page) {
    // restricted pages
    if ((page === 'internship' || page === 'jppage') && !isLoggedIn) {
      window.location.href = 'signin.html';
      return;
    }

    //hide visible content
    pages.forEach(p => p.classList.add('hidden'));
    navItems.forEach(a => a.classList.remove('active'));
    
    // show spinner fullscreen
    spinner.classList.remove('hidden');
    setTimeout(() => {
      spinner.classList.add('hidden');
      showPage(page);
    }, 1000);
  }

  // home / gradprog / stambassador all use nav‐items
  // click on nav‐item links
  navItems.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.dataset.page);
    });
  });

  // header job‐portal button
  headerJobBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.page);
    });
  });

  // body job‐portal button
  bodyJobBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.page);
    });
  });

  // ─── SIGN-IN & DASHBOARD BUTTONS ────────────────────────────
  headerSignIn.addEventListener('click', () => { window.location.href = 'signin.html'; });
  bodySignIn.addEventListener('click', () => { window.location.href = 'signin.html'; });

  headerDashBtn.addEventListener('click', () => { window.location.href = 'dashboard.html'; });
  bodyDashBtn.addEventListener('click', () => { window.location.href = 'dashboard.html'; });

  // ─── LOGOUT REDIRECT ON RELOAD IF NECESSARY ─────────────────
  // if user signed out while on restricted page
  window.addEventListener('storage', () => {
    const nowLoggedIn = (
      sessionStorage.getItem('isLoggedIn') === 'true' ||
      localStorage.getItem('isLoggedIn')   === 'true'
    );
    if (!nowLoggedIn && ['internship','jppage'].includes(sessionStorage.getItem('currentPage'))) {
      showPage('home');
    }
  });
});

//=============================== PROFILE BUTTON, PROF DIV, MANAGE PROFILE DIV ====================================
document.addEventListener('DOMContentLoaded', () => {
  // ─── ELEMENT GRABS ───────────────────────────────────────────
  const prbtn              = document.getElementById('prbtn');
  const prof               = document.querySelector('.prof');
  const overlay            = document.querySelector('.overlay');
  const settingsContainer  = document.getElementById('settingsContainer');
  const closeBtn           = document.getElementById('closeSettings');

  // three “columns” in the prof menu
  const [emailCol, manageCol, signoutCol] = prof.querySelectorAll('.cols');

  // settings‐tabs
  const tabBtns  = settingsContainer.querySelectorAll('.nav-btn');
  const sections = settingsContainer.querySelectorAll('.settings-section');

  // PROFILE‐section
  const emailListEl   = document.getElementById('emailList');
  const addEmailBtn   = document.getElementById('addEmailBtn');
  const emailAddGroup = document.getElementById('emailAdd');
  const newmailInput  = document.getElementById('newmail');
  const newEmailErr   = document.getElementById('newEmailErr');
  const actAddBtn     = document.getElementById('actAdd');

  // “Connect Account” feedback
  const connectAccountBtn = document.getElementById('connectAccountBtn');
  const connectAccSpan    = document.getElementById('connectAccSpan');

  // SECURITY‐section
  const currPwdInput    = document.getElementById('currentPwd');
  const currPassSpan    = document.getElementById('currPassSpan');
  const newPwdInput     = document.getElementById('newPwd');
  const newPassErr      = document.getElementById('newPassErr');
  const confirmPwdInput = document.getElementById('confirmPwd');
  const confPassErr     = document.getElementById('confPassErr');
  const updatePwdBtn    = document.getElementById('updatePwdBtn');

  // stored credentials
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPass  = localStorage.getItem('userPass')  || '';

  // ─── HELPERS ─────────────────────────────────────────────────
  function showError(span, msg) {
    span.textContent = msg;
    span.classList.remove('hidden','noerr');
    span.classList.add('err');
  }

  function showSuccess(span, msg) {
    span.textContent = msg;
    span.classList.remove('hidden','err');
    span.classList.add('noerr');
  }

  function closeSettings() {
    settingsContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  // ─── “PROFILE” MENU (prbtn) ─────────────────────────────────
  prbtn.addEventListener('click', e => {
    prof.classList.toggle('hidden');
  });

  // click outside hides the prof menu
  document.addEventListener('click', e => {
    if (!prof.contains(e.target) && e.target !== prbtn) {
      prof.classList.add('hidden');
    }
  });

  // fill first column with the logged‐in email
  emailCol.querySelector('p').textContent = userEmail;

  // second column: open settings
  manageCol.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    settingsContainer.classList.remove('hidden');
    prof.classList.add('hidden');
  });

  // third column: sign out
  signoutCol.addEventListener('click', () => {
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
  });

  // ─── CLOSE SETTINGS ──────────────────────────────────────────
  closeBtn.addEventListener('click', closeSettings);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeSettings();
  });

  // ─── TABS INSIDE SETTINGS ───────────────────────────────────
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      sections.forEach(sec => sec.classList.toggle('hidden', sec.id !== target));
    });
  });

  // ─── PROFILE SECTION: EMAIL LIST ─────────────────────────────
  let emails = JSON.parse(localStorage.getItem('emails') || '[]');
  if (!emails.length) {
    emails = [{ address: userEmail, primary: true }];
  }
  
  // always keep the correct email marked primary
  emails = emails.map(e => ({
    address: e.address,
    primary: e.address === userEmail
  }));

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
  renderEmails();

  // show the “add email” form
  addEmailBtn.addEventListener('click', () => {
    emailAddGroup.classList.remove('hidden');
  });

  // live validation on new email
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  newmailInput.addEventListener('input', () => {
    const v = newmailInput.value.trim();
    if (!v) {
      newEmailErr.classList.add('hidden');
      return;
    }
    if (!emailRe.test(v)) { showError(newEmailErr, '❌ Enter Valid Email!'); }
    else if (emails.some(e => e.address === v)) { showSuccess(newEmailErr, '✅ Email Already Exists!'); }
    else { showSuccess(newEmailErr, '✅ Email Validates!'); }
  });

  // commit adding a new email
  actAddBtn.addEventListener('click', () => {
    const v = newmailInput.value.trim();
    if (!v)             { showError(newEmailErr, '❌ Email is Required!'); return; }
    if (!emailRe.test(v)){ showError(newEmailErr, '❌ Enter Valid Email!'); return; }
    if (emails.some(e => e.address === v)) {
      showSuccess(newEmailErr, '✅ Email Already Exists!');
      return;
    }

    emails.push({ address: v, primary: false });
    renderEmails();
    showSuccess(newEmailErr, '✅ Email Successfully Added!');
    setTimeout(() => newEmailErr.classList.add('hidden'), 3000);
    emailAddGroup.classList.add('hidden');
    newmailInput.value = '';
  });

  // “Connect Account” placeholder
  connectAccountBtn.addEventListener('click', () => {
    showSuccess(connectAccSpan, '✅ Connect Account Feature Coming Soon!');
    setTimeout(() => connectAccSpan.classList.add('hidden'), 3000);
  });

  // ─── SECURITY SECTION ────────────────────────────────────────
  // populate current password
  currPwdInput.value = userPass;

  // clicking currentPwd shows “not editable”
  currPwdInput.addEventListener('focus', () => {
    showSuccess(currPassSpan, '✅ Not editable!');
    setTimeout(() => currPassSpan.classList.add('hidden'), 3000);
  });

  // toggle‐pwd buttons (only for password fields)
  document.querySelectorAll('.toggle-pwd').forEach(btn => {
    const tgt = document.getElementById(btn.dataset.target);
    if (!tgt || (tgt.type !== 'password' && tgt.type !== 'text')) return;
    btn.addEventListener('click', () => {
      const reveal = tgt.type === 'password';
      tgt.type = reveal ? 'text' : 'password';
      btn.textContent = reveal ? '😊' : '🙂';
    });
  });

  // new password live validation
  const hasLower  = /[a-z]/;
  const hasUpper  = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSymbol = /[^A-Za-z0-9]/;

  newPwdInput.addEventListener('input', () => {
    const v = newPwdInput.value;
    let err = '';
    if (v.length < 8)           err = '❌ Must be At least 8 characters!';
    else if (v.length > 12)     err = '❌ Must be At most 12 characters!';
    else if (!hasUpper.test(v))  err = '❌ Must include Uppercase!';
    else if (!hasLower.test(v))  err = '❌ Must include Lowercase!';
    else if (!hasNumber.test(v)) err = '❌ Must include Number!';
    else if (!hasSymbol.test(v)) err = '❌ Must include Symbol!';

    if (err) showError(newPassErr, err);
    else      showSuccess(newPassErr, '✅ New Password Meets All Criteria!');
  });

  // on focus of confirm, hide new‐pwd success
  confirmPwdInput.addEventListener('focus', () => {
    if (newPassErr.classList.contains('noerr')) {
      newPassErr.classList.add('hidden');
      newPassErr.classList.remove('noerr');
    }
  });

  // confirm‐password live match check
  confirmPwdInput.addEventListener('input', () => {
    const a = newPwdInput.value;
    const b = confirmPwdInput.value;
    if (a !== b) {
      showError(confPassErr, '❌ Passwords do not Match!');
    } else {
      showSuccess(confPassErr, '✅ Passwords Match!');
      showSuccess(newPassErr, '✅ New Password Meets All Criteria!');
    }
  });

  // update password handler
  updatePwdBtn.addEventListener('click', () => {
    const a = newPwdInput.value.trim();
    const b = confirmPwdInput.value.trim();
    if (!a || !b) {
      showError(newPassErr, '❌ Please fill out both Password Fields!');
      showError(confPassErr, '❌ Please fill out both Password Fields!');
      return;
    }
    if (a !== b) {
      showError(confPassErr, '❌ Passwords do not Match!');
      return;
    }

    // persist and replace currentPwd
    localStorage.setItem('userPass', a);
    currPwdInput.value = a;
    showSuccess(currPassSpan, '✅ Password Updated!');
    setTimeout(() => currPassSpan.classList.add('hidden'), 3000);

    // clear inputs & errors
    newPwdInput.value     = '';
    confirmPwdInput.value = '';
    newPassErr.classList.add('hidden');
    confPassErr.classList.add('hidden');
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

//============================================ END OF SCRIPT.js ==================================================