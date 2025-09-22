//========================================= SIGN IN, LOGIN PAGE ===============================================
document.addEventListener('DOMContentLoaded', () => {
  // ─── ELEMENT GRABS ───────────────────────────────────────────
  const navButtons       = document.querySelectorAll('.pgnavbtn');
  const loginSection     = document.getElementById('loginpg');
  const signupSection    = document.getElementById('signuppg');

  const loginEmailIn     = document.getElementById('loginEmail');
  const loginPassIn      = document.getElementById('loginPassword');
  const loginEmailErr    = document.getElementById('loginEmailErr');
  const loginPassErr     = document.getElementById('loginPassErr');
  const loginSubmitBtn   = document.getElementById('loginSubmit');

  const signupEmailIn    = document.getElementById('signupEmail');
  const signupPassIn     = document.getElementById('signupPassword');
  const signupConfirmIn  = document.getElementById('signupConfirm');
  const signupEmailErr   = document.getElementById('signupEmailErr');
  const signupPassErr    = document.getElementById('signupPassErr');
  const signupConfirmErr = document.getElementById('signupConfirmErr');
  const signupSubmitBtn  = document.getElementById('signupSubmit');

  // ─── HELPERS ─────────────────────────────────────────────────
  function showSection(targetId) {
    if (targetId === 'loginpg') {
      loginSection.classList.remove('hidden');
      signupSection.classList.add('hidden');
    } else {
      signupSection.classList.remove('hidden');
      loginSection.classList.add('hidden');
    }
  }

  function showError(span, msg) {
    span.textContent = msg;
    span.classList.remove('hidden');
    span.classList.add('err');
    span.classList.remove('noerr');
    // focus the related input
    span.closest('.inputContainer').querySelector('input').focus();
    setTimeout(() => span.classList.add('hidden'), 3000);
  }

  function showSuccess(span, msg) {
    span.textContent      = msg;
    span.classList.remove('hidden', 'err');
    span.classList.add('noerr');
    // focus the related input
    span.closest('.inputContainer').querySelector('input').focus();
  }

  function clearSignupForm() {
    // clear values
    signupEmailIn.value    = '';
    signupPassIn.value     = '';
    signupConfirmIn.value  = '';
    // hide & reset spans
    [ signupEmailErr, signupPassErr, signupConfirmErr ].forEach(s => {
      s.textContent = '';
      s.classList.add('hidden');
      s.classList.remove('err','noerr');
    });
    // re-enable password inputs
    signupPassIn.disabled   = false;
    signupConfirmIn.disabled= false;
  }

  function clearloginForm() {
    loginEmailIn.value = '';
    loginPassIn.value = '';

    // hide & reset spans
    [ loginEmailErr, loginPassErr ].forEach(s => {
      s.textContent = '';
      s.classList.add('hidden');
      s.classList.remove('err','noerr');
    });
    // re-enable password inputs
    loginPassIn.disabled   = false;
  }

  // ─── NAV BUTTONS + CLEAR LOGIC ───────────────────────────────
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // mark active
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // swap sections
      showSection(btn.dataset.target);

      // if user just switched to LOGIN, wipe out the Sign-Up form
      if (btn.dataset.target === 'loginpg') {
        clearSignupForm();
      }
      
      if (btn.dataset.target === 'signuppg') {
        clearloginForm();
      }
    });
  });

  // show login by default
  showSection('loginpg');

  // ─── PASSWORD TOGGLE ────────────────────────────────────────
  document.querySelectorAll('.toggle-pwd').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById(toggleBtn.dataset.target);
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      toggleBtn.textContent = reveal ? '🙂' : '😊';
    });
  });

  // ─── SIGN-UP: LIVE “EXISTS” CHECK & VALIDATION ─────────────
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasLower  = /[a-z]/;
  const hasUpper  = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSymbol = /[^A-Za-z0-9]/;

  // Live “account exists” check
  signupEmailIn.addEventListener('input', () => {
    const storedEmail = localStorage.getItem('userEmail') || '';
    const val = signupEmailIn.value.trim();

    if (val !== '' && val === storedEmail) {
      showSuccess(signupEmailErr, '✅ Account Already Exists!');
      signupPassIn.disabled    = true;
      signupConfirmIn.disabled = true;
    } else {
      signupEmailErr.textContent = '';
      signupEmailErr.classList.add('hidden');
      signupEmailErr.classList.remove('noerr');
      signupPassIn.disabled     = false;
      signupConfirmIn.disabled  = false;
    }
  });

  // Live password rule checks
  signupPassIn.addEventListener('input', () => {
    const v = signupPassIn.value;
    let err = '';

    if (v.length < 8)          err = '❌ Password must be at least 8 characters!';
    else if (v.length > 12)    err = '❌ Password must be at most 12 characters!';
    else if (!hasLower.test(v)) err = '❌ Must contain lowercase letters!';
    else if (!hasUpper.test(v)) err = '❌ Must contain uppercase letters!';
    else if (!hasNumber.test(v))err = '❌ Must contain number!';
    else if (!hasSymbol.test(v))err = '❌ Must contain symbol!';

    if (err) {
      signupPassErr.textContent = err;
      signupPassErr.classList.remove('hidden','noerr');
      signupPassErr.classList.add('err');
    } else {
      showSuccess(signupPassErr, '✅ Password Meets All Criteria!');
    }
  });

  // On focus of the Confirm field, hide the old password‐success
  signupConfirmIn.addEventListener('focus', () => {
    if (signupPassErr.classList.contains('noerr')) {
      signupPassErr.classList.remove('noerr');
      signupPassErr.classList.add('hidden');
    }
  });

  // Live match checking as the user types in Confirm
  signupConfirmIn.addEventListener('input', () => {
    const pwd     = signupPassIn.value;
    const confirm = signupConfirmIn.value;

    if (confirm !== pwd) {
      // persistent mismatch error
      signupConfirmErr.textContent      = '❌ Passwords Not Match!';
      signupConfirmErr.classList.remove('hidden','noerr');
      signupConfirmErr.classList.add('err');
    } else {
      // matched! show green noerr for Confirm
      signupConfirmErr.textContent      = '✅ Confirm Password Matches Password!';
      signupConfirmErr.classList.remove('hidden','err');
      signupConfirmErr.classList.add('noerr');

      // hide the confirm‐success after 2 s
      setTimeout(() => {
        signupConfirmErr.classList.add('hidden');
        signupConfirmErr.classList.remove('noerr');
      }, 2000);

      // re‐show the password‐success below the Password field
      signupPassErr.textContent         = '✅ Password Meets All Criteria!';
      signupPassErr.classList.remove('hidden','err');
      signupPassErr.classList.add('noerr');
    }
  });

  // Sign-Up submit
  signupSubmitBtn.addEventListener('click', () => {
    const email   = signupEmailIn.value.trim();
    const pass    = signupPassIn.value;
    const confirm = signupConfirmIn.value;

    //Required field checks
    if(!email) { return showError(signupEmailErr, '❌ E-mail is Required!'); }
    if (!emailRe.test(email)) { return showError(signupEmailErr, '❌ Enter a Valid E-mail!'); }
    if (!pass) { return showError(signupPassErr, '❌ Password is Required!'); }
    if (!confirm) { return showError(signupConfirmErr, '❌ Confirm Password is Required!'); }

    // If the account exists
    if (signupEmailErr.classList.contains('noerr')) { return; }
    if (signupPassErr.classList.contains('err')) { return signupPassIn.focus(); }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPass',  pass);
    window.location.href = 'dashboard.html';
  });

  // ─── LOG-IN HANDLER ─────────────────────────────────────────
  loginSubmitBtn.addEventListener('click', () => {
    const storedEmail = localStorage.getItem('userEmail') || '';
    const storedPass  = localStorage.getItem('userPass')  || '';
    const email       = loginEmailIn.value.trim();
    const pass        = loginPassIn.value;

    if (!email) {
      return showError(loginEmailErr, '❌ Email is Required!');
    }
    if (email !== storedEmail) {
      return showError(loginEmailErr, '❌ Incorrect Email!');
    }

    if(!pass) {
      return showError(loginPassErr, '❌ Password is Required!');
    }
    if (pass !== storedPass) {
      return showError(loginPassErr, '❌ Incorrect Password!');
    }

    window.location.href = 'dashboard.html';
  });
});