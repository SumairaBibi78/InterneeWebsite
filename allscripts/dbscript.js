//=============================== THEME TOGGLE ====================================
const thtgl = document.getElementById('thtgl');

document.addEventListener('DOMContentLoaded', loadTheme() );

// Theme Persistence
thtgl.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  thtgl.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.classList.add(saved);
  thtgl.textContent = saved === 'dark' ? '☀️' : '🌙';
}

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
    if (!emailRe.test(v)) {
      showError(newEmailErr, '❌ Enter Valid Email!');
    } else if (emails.some(e => e.address === v)) {
      showSuccess(newEmailErr, '✅ Email Already Exists!');
    } else {
      showSuccess(newEmailErr, '✅ Email Validates!');
    }
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

//=============================== SIDEBAR BUTTONS AND MAIN SIDE NAVIGATION ====================================
document.addEventListener('DOMContentLoaded', () => {
  const rightarrow = '../assets/right.png';
  const downarrow  = '../assets/down.png';

  // ─── Sidebar dropdown buttons (unchanged) ───────────────────────
  let activeBtn = null;
  const ddButtons = Array.from(document.querySelectorAll('.ddbtn'));
  ddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // close other dropdowns
      ddButtons.forEach(other => {
        if (other !== btn) {
          const menu  = document.getElementById(other.dataset.target);
          const arrow = other.querySelector('#rightimg');
          menu.classList.add('hidden');
          arrow.src = rightarrow;
          other.classList.remove('active');
        }
      });

      // toggle this dropdown
      const menu  = document.getElementById(btn.dataset.target);
      const arrow = btn.querySelector('#rightimg');
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        arrow.src = downarrow;
        btn.classList.add('active');
        activeBtn = btn;
      } else {
        menu.classList.add('hidden');
        arrow.src = rightarrow;
        btn.classList.remove('active');
        activeBtn = null;
      }
    });
  });

  // ─── Mainnav content switcher + persistence ─────────────────────
  const sections       = Array.from(document.querySelectorAll('.maincontent'));
  const mainnavButtons = Array.from(document.querySelectorAll('.mainnav'));

  // 1) Read savedSection (default "ovrviw") & savedDropdown
  const savedSection  = localStorage.getItem('activeSection')  || 'ovrviw';
  const savedDropdown = localStorage.getItem('activeDropdown');

  // 2) Hide all sections, then show the saved one
  sections.forEach(sec => sec.classList.add('hidden'));
  const startSec = document.getElementById(savedSection);
  if (startSec) startSec.classList.remove('hidden');

  // 3) Highlight its mainnav button
  mainnavButtons.forEach(b => b.classList.remove('active'));
  const startNav = document.querySelector(`.mainnav[data-target="${savedSection}"]`);
  if (startNav) startNav.classList.add('active');

  // 4) Restore only the .active class on the saved dropdown button
  if (savedDropdown) {
    const opener = document.querySelector(`.ddbtn[data-target="${savedDropdown}"]`);
    if (opener) {
      opener.classList.add('active');
      activeBtn = opener;   // so future collapses know which was last active
    }
  }

  // 5) Wire up mainnav clicks
  mainnavButtons.forEach(navBtn => {
    navBtn.addEventListener('click', () => {
      const target = navBtn.dataset.target;

      // external navigation shortcut
      if(target === 'latjbup') {
        //jump to index.html and open jppage section
        window.location.href = 'index.html#jppage';
        return;
      }

      // collapse only the open sidebar dropdown (leave its .active)
      if (activeBtn) {
        const openMenu  = document.getElementById(activeBtn.dataset.target);
        const openArrow = activeBtn.querySelector('#rightimg');
        openMenu.classList.add('hidden');
        openArrow.src = rightarrow;
      }

      // swap content sections
      sections.forEach(sec => sec.classList.add('hidden'));
      const section = document.getElementById(target);
      if (section) section.classList.remove('hidden');

      // move .active among mainnav buttons
      mainnavButtons.forEach(b => b.classList.remove('active'));
      navBtn.classList.add('active');

      // ─── persist current section & dropdown ID ──────────────
      localStorage.setItem('activeSection', target);
      if (activeBtn) { localStorage.setItem('activeDropdown', activeBtn.dataset.target); }
      else { localStorage.removeItem('activeDropdown'); }
    });
  });

  // ─── Sidebar Show/Hide via Hamburger ───────────────────────────
  const hamburger = document.getElementById('hambtn');
  const sidebar   = document.getElementById('sidebar');
  const mainside = document.querySelector('.mainside');

  hamburger.addEventListener('click', () => {
    // toggle a class that hides/shows the sidebar
    sidebar.classList.toggle('collapsed');

    //expand or shrink main area
    mainside.classList.toggle('expanded');
    
    // optionally animate the button icon (e.g. turn ☰ into ✕)
    hamburger.classList.toggle('isopen');
  });
});

//=============================== TASK PORTAL BUTTON ====================================
document.addEventListener('DOMContentLoaded', () => {
  const loaderOverlay  = document.getElementById('loaderOverlay');
  const subtaskOverlay = document.getElementById('subtaskOverlay');
  const closeBtn       = subtaskOverlay.querySelector('.close-btn');

  // when any table button is clicked
  document.querySelectorAll('table button').forEach(btn => {
    btn.addEventListener('click', () => {
      // show shimmer loader
      loaderOverlay.classList.add('visible');

      // after 3s hide loader, show subtask modal
      setTimeout(() => {
        loaderOverlay.classList.remove('visible');
        subtaskOverlay.classList.add('visible');
      }, 3000);
    });
  });

  // hide subtask when clicking outside content or on close button
  subtaskOverlay.addEventListener('click', e => {
    if (e.target === subtaskOverlay || e.target === closeBtn) {
      subtaskOverlay.classList.remove('visible');
    }
  });
});

//============================================ END OF DBSCRIPT.js ==================================================