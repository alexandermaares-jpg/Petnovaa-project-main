(() => {
  const form = document.querySelector('#authForm');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const title = document.querySelector('#authTitle');
  const intro = document.querySelector('#authIntro');
  const submit = document.querySelector('#authSubmit');
  const switcher = document.querySelector('#authSwitch');
  const nameField = document.querySelector('.auth-name-field');
  const password = document.querySelector('#authPassword');
  const email = form.querySelector('input[name="email"]');
  const status = document.querySelector('#authStatus');
  const visual = document.querySelector('.auth-visual');
  const quote = document.querySelector('.auth-quote');
  const feedbackLabel = document.querySelector('#authFeedbackLabel');
  const feedbackText = document.querySelector('#authFeedbackText');
  const signupUrl = 'sign-in.html?mode=signup';
  const loginUrl = 'sign-in.html?mode=login';
  const defaultFeedback = 'Having the little details in one place makes caring feel easier.';
  const feedbackByField = {
    name: ['A NOTE FOR YOU', 'Hi! We would love to meet you and your pet. Let us start with your name...'],
    email: ['A HELPFUL NOTE', 'We will send vaccine reminders, health updates, and care notes here.'],
    password: ['A LITTLE PEACE OF MIND', "Keep your best friend's care details safe with a strong password."]
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mode = params.get('mode') === 'signup' ? 'signup' : 'login';
  let activeField = '';
  let typingTimer = 0;
  let typingToken = 0;
  let glowTimer = 0;

  const renderMode = () => {
    const signup = mode === 'signup';
    title.innerHTML = signup ? 'Create your<br><em>account</em>' : 'Welcome <em>back.</em>';
    intro.textContent = signup ? 'A little more care starts with a PETNOVA account.' : 'Sign in to keep your pet\'s care close at hand.';
    nameField.hidden = !signup;
    nameField.querySelector('input').required = signup;
    password.autocomplete = signup ? 'new-password' : 'current-password';
    submit.innerHTML = signup ? 'Create account <span aria-hidden="true">&rarr;</span>' : 'Sign in <span aria-hidden="true">&rarr;</span>';
    switcher.innerHTML = signup ? `Already have an account? <a href="${loginUrl}">Log in</a>` : `New to PETNOVA? <a href="${signupUrl}">Create an account</a>`;
  };

  const writeFeedback = (label, message) => {
    window.clearTimeout(typingTimer);
    const token = ++typingToken;
    feedbackLabel.textContent = label;
    feedbackText.textContent = '';
    quote.classList.add('is-context-active');
    if (reducedMotion) {
      feedbackText.textContent = message;
      return;
    }
    let position = 0;
    const typeNext = () => {
      if (token !== typingToken) return;
      position += 1;
      feedbackText.textContent = message.slice(0, position);
      if (position < message.length) typingTimer = window.setTimeout(typeNext, 19);
    };
    typeNext();
  };

  const activateField = field => {
    if (!field) return;
    const input = field.querySelector('input');
    if (!input) return;
    const key = input.name;
    if (key === activeField) return;
    activeField = key;
    visual.classList.remove('is-name-active', 'is-email-active', 'is-password-active', 'is-password-visible');
    visual.classList.add(`is-${key}-active`);
    const feedback = feedbackByField[key];
    if (feedback) writeFeedback(feedback[0], feedback[1]);
  };

  const clearActiveField = () => {
    activeField = '';
    visual.classList.remove('is-name-active', 'is-email-active', 'is-password-active', 'is-password-visible', 'is-typing');
    quote.classList.remove('is-context-active');
    window.clearTimeout(typingTimer);
    typingToken += 1;
    feedbackLabel.textContent = 'FROM A PET PARENT';
    feedbackText.textContent = defaultFeedback;
  };

  renderMode();
  form.addEventListener('focusin', event => activateField(event.target.closest('.auth-field')));
  form.addEventListener('focusout', event => {
    const field = event.target.closest('.auth-field');
    if (!field) return;
    if (field.contains(event.relatedTarget)) return;
    if (field.contains(email) && email.value.trim() && email.validity.valid) {
      field.classList.add('email-is-valid');
      visual.classList.add('is-email-validating');
      window.clearTimeout(glowTimer);
      glowTimer = window.setTimeout(() => visual.classList.remove('is-email-validating'), 900);
    }
    window.setTimeout(() => {
      const focused = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.auth-field') : null;
      if (focused) activateField(focused);
      else clearActiveField();
    }, 0);
  });

  form.addEventListener('input', event => {
    const input = event.target;
    if (!input.matches('.auth-field input')) return;
    input.closest('.auth-field').classList.remove('email-is-valid');
    const isTyping = input.value.length > 0;
    visual.classList.toggle('is-typing', isTyping);
    if (input.name === 'email' && !input.validity.valid) visual.classList.remove('is-email-validating');
  });

  document.querySelector('#passwordToggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    visual.classList.toggle('is-password-active', !visible);
    visual.classList.toggle('is-password-visible', visible);
  });
  document.querySelector('#resetPassword').addEventListener('click', () => {
    status.textContent = 'Password reset will be available when account access is connected.';
  });
  document.querySelector('#googleSignIn').addEventListener('click', () => {
    status.textContent = 'Google sign-in will be available when account access is connected.';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Account access is not connected in this prototype yet.';
  });
})();