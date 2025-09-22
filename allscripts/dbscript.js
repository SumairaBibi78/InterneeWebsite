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

//=============================== ONCLICK PROFILE ====================================
const prbtn = document.getElementById('prbtn');
const prof  = document.querySelector('.prof');
const cols     = prof.querySelectorAll('.cols');
const firstP   = cols[0].querySelector('p');
const manageCol= cols[1];
const logoutCol= cols[2];
const overlay = document.querySelector('.overlay');
const mngProf  = document.querySelector('.settings-container');

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail') || 'User';
  firstP.textContent = userEmail;

  prbtn.addEventListener('click', () => {
    prof.classList.toggle('hidden');
    if (mngProf) mngProf.classList.add('hidden');
  });

  manageCol.addEventListener('click', () => {
    prof.classList.add('hidden');
    if (mngProf) {
      overlay.classList.remove('hidden');
      mngProf.classList.remove('hidden');
    }
  });

  logoutCol.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    prof.classList.add('hidden');
    if (mngProf) mngProf.classList.add('hidden');
    window.location.href = 'index.html';
    updateButtons();
  });
});

//=============================== MNG PROFILE DIV ====================================
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

  // 5) Wire up mainnav clicks (same logic + save both keys)
  mainnavButtons.forEach(navBtn => {
    navBtn.addEventListener('click', () => {
      const target = navBtn.dataset.target;

      // external navigation shortcut
      if (target === 'latjbup') {
        window.location.href = 'jobportal.html';
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
      if (activeBtn) {
        localStorage.setItem('activeDropdown', activeBtn.dataset.target);
      } else {
        localStorage.removeItem('activeDropdown');
      }
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