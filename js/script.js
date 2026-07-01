document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  }

  menuToggle.addEventListener('click', toggleMenu);

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById('appToast');
  const toastBody = document.getElementById('toastBody');
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

  function showToast(message, type) {
    toastBody.textContent = message;
    toastEl.classList.remove('text-bg-success', 'text-bg-danger');
    toastEl.classList.add(type === 'error' ? 'text-bg-danger' : 'text-bg-success');
    toast.show();
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || name.length > 100) {
      showToast('Please enter a valid name (1–100 characters).', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!subject || subject.length > 150) {
      showToast('Please enter a subject (1–150 characters).', 'error');
      return;
    }
    if (!message || message.length > 2000) {
      showToast('Please enter a message (1–2000 characters).', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_63su0vg',
          template_id: 'template_hi9xntg',
          user_id: 'XISFBPEHbg4ejQMlJ',
          template_params: {
            from_name: name,
            from_email: email,
            reply_to: email,
            subject: subject,
            message: message,
          },
        }),
      });

      if (!response.ok) throw new Error('EmailJS error');

      showToast("Message sent successfully! I'll get back to you soon.", 'success');
      form.reset();
    } catch (err) {
      showToast('Failed to send message. Please try again or email me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitText.innerHTML = "Let's Build Something Scalable <i class=\"bi bi-arrow-right\"></i>";
    }
  });

  /* ---------- Fade-up on scroll for sections ---------- */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section .glass-strong, .section .glass').forEach(function (el) {
    observer.observe(el);
  });

});
