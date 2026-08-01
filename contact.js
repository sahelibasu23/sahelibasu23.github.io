(() => {
  const form = document.getElementById('professional-inquiry-form');
  if (!form) return;

  const message = document.getElementById('message');
  const messageCount = document.getElementById('message-count');
  const formStatus = document.getElementById('form-status');
  const submitButton = form.querySelector('.submit-button');

  const showError = (field, messageText) => {
    const wrapper = field.closest('.form-field');
    const error = wrapper ? wrapper.querySelector('.field-error') : null;
    field.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = messageText;
  };

  const clearError = field => {
    const wrapper = field.closest('.form-field');
    const error = wrapper ? wrapper.querySelector('.field-error') : null;
    field.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  };

  const validUrl = value => {
    if (!value.trim()) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  if (message && messageCount) {
    const updateCount = () => { messageCount.textContent = `${message.value.length} / 3000`; };
    message.addEventListener('input', updateCount);
    updateCount();
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    let valid = true;
    const inquiryTitle = document.getElementById('inquiry-title');
    const formspreeSubject = document.getElementById('formspree-subject');
    const name = document.getElementById('full-name');
    const email = document.getElementById('email');
    const linkedin = document.getElementById('linkedin');
    const website = document.getElementById('website');
    const consent = document.getElementById('consent');
    const selectedType = form.querySelector('input[name="inquiry_type"]:checked');
    const typeError = document.getElementById('inquiry-type-error');
    const consentError = form.querySelector('.consent-error');

    [inquiryTitle, name, email, linkedin, website, message].forEach(clearError);
    typeError.textContent = '';
    consentError.textContent = '';

    if (!inquiryTitle.value.trim()) { showError(inquiryTitle, 'Please enter a clear inquiry title.'); valid = false; }
    if (!name.value.trim()) { showError(name, 'Please enter your full name.'); valid = false; }
    if (!email.validity.valid) { showError(email, 'Please enter a valid email address.'); valid = false; }
    if (!validUrl(linkedin.value)) { showError(linkedin, 'Enter a complete URL beginning with http:// or https://.'); valid = false; }
    if (!validUrl(website.value)) { showError(website, 'Enter a complete URL beginning with http:// or https://.'); valid = false; }
    if (!selectedType) { typeError.textContent = 'Please select an inquiry type.'; valid = false; }
    if (message.value.trim().length < 40) { showError(message, 'Please provide at least 40 characters of useful context.'); valid = false; }
    if (!consent.checked) { consentError.textContent = 'Please confirm the privacy and consent statement.'; valid = false; }

    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"], input[name="inquiry_type"]:not(:checked), #consent:not(:checked)');
      if (firstInvalid) firstInvalid.focus();
      formStatus.textContent = 'Please review the highlighted fields.';
      formStatus.classList.add('error');
      return;
    }

    if (form.action.includes('YOUR_FORM_ID')) {
      formStatus.textContent = 'Setup required: replace YOUR_FORM_ID in contact.html with your Formspree form ID.';
      formStatus.classList.add('error');
      return;
    }

    if (formspreeSubject) {
      formspreeSubject.value = inquiryTitle.value.trim();
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Submission failed');
      window.location.href = 'success.html';
    } catch {
      formStatus.textContent = 'The inquiry could not be submitted. Please check your connection and try again.';
      formStatus.classList.add('error');
      submitButton.disabled = false;
      submitButton.textContent = 'Submit professional inquiry';
    }
  });
})();
