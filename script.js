// ISPTAE — interactions (navigation, galerie, formulaires)
(function () {
  var WA = '22796887918';
  var EMAIL = 'institut.isptae@gmail.com';

  // Navigation : ombre au scroll, menu mobile, lien actif
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['accueil', 'institut', 'formations', 'admissions', 'vie-etudiante', 'actualites', 'galerie', 'contact']
      .forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Galerie : lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll('#gGrid .g-item'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var idx = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    var img = items[idx].querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = items[idx].querySelector('span').textContent;
  }
  items.forEach(function (b, i) {
    b.addEventListener('click', function () { show(i); lb.hidden = false; document.getElementById('lbClose').focus(); });
  });
  function closeLb() { lb.hidden = true; items[idx].focus(); }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) closeLb(); else closeMenu(); }
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // Formulaires : message préparé pour WhatsApp / e-mail
  function val(id) { return document.getElementById(id).value.trim(); }
  function check(form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim();
      f.style.borderColor = bad ? '#C0392B' : '';
      if (bad && ok) { f.focus(); ok = false; }
    });
    return ok;
  }

  var applyForm = document.getElementById('applyForm');
  applyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check(applyForm)) return;
    var msg = 'Bonjour ISPTAE, je souhaite déposer une candidature.\n' +
      'Nom : ' + val('a-nom') + '\nTéléphone : ' + val('a-tel') +
      '\nDomaine : ' + val('a-dom') + '\nNiveau : ' + val('a-niv') +
      (val('a-msg') ? '\nInformations : ' + val('a-msg') : '');
    var send = document.getElementById('applySend');
    send.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    send.hidden = false;
    var st = document.getElementById('applyStatus');
    st.textContent = 'Votre candidature est prête. Appuyez sur « Envoyer sur WhatsApp » pour la transmettre.';
    st.hidden = false;
  });

  var contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check(contactForm)) return;
    var sujet = val('c-sujet');
    var body = 'Nom : ' + val('c-nom') +
      (val('c-tel') ? '\nTéléphone : ' + val('c-tel') : '') +
      (val('c-mail') ? '\nE-mail : ' + val('c-mail') : '') +
      '\n\n' + val('c-msg');
    var wa = document.getElementById('contactWa');
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Bonjour ISPTAE — ' + sujet + '\n' + body);
    wa.hidden = false;
    var mail = document.getElementById('contactMail');
    mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(body);
    mail.hidden = false;
    var st = document.getElementById('contactStatus');
    st.textContent = 'Message prêt. Choisissez comment l’envoyer.';
    st.hidden = false;
  });
})();
