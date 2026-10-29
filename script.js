(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const modal = $('#dashboardModal');
  const toast = $('#toast');
  let toastTimer;
  const readStore = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const safeText = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); };
  $('#currentYear').textContent = new Date().getFullYear();

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open', !expanded);
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
  }));

  function openModal(tab = 'petsPanel') {
    switchTab(tab);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
    renderPets(); renderReminders();
  }
  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    document.body.classList.remove('modal-open');
  }
  $('#openDashboard')?.addEventListener('click', () => openModal());
  $('#openDashboard2')?.addEventListener('click', () => openModal());
  $('#closeDashboard').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
  $$('.modal-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  function switchTab(panelId) {
    $$('.modal-tab').forEach(tab => {
      const selected = tab.dataset.tab === panelId;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    $$('.modal-panel').forEach(panel => panel.hidden = panel.id !== panelId);
  }

  function renderPets() {
    const pets = readStore('petnova-pets');
    const list = $('#petsList');
    list.innerHTML = pets.length ? '' : '<div class="empty-state">TodavÃ­a no hay mascotas registradas. AÃ±ade la primera para comenzar.</div>';
    pets.forEach(pet => {
      const item = document.createElement('div');
      item.className = 'saved-item';
      item.innerHTML = '<span class="saved-icon" aria-hidden="true">' + (pet.species === 'Gato' ? 'â™¡' : pet.species === 'Perro' ? 'âŒ' : 'âœ¦') + '</span><div class="saved-copy"><b>' + safeText(pet.name) + ' Â· ' + safeText(pet.species) + '</b><small>' + [pet.birthday ? 'Nacimiento: ' + safeText(pet.birthday) : '', pet.notes ? safeText(pet.notes) : ''].filter(Boolean).join(' Â· ') + '</small></div><button class="delete-item" type="button" aria-label="Eliminar ' + safeText(pet.name) + '" data-delete-pet="' + safeText(pet.id) + '">Ã—</button>';
      list.appendChild(item);
    });
    const select = $('#reminderPet');
    const current = select.value;
    select.innerHTML = '<option value="">Sin asignar</option>' + pets.map(pet => '<option value="' + safeText(pet.id) + '">' + safeText(pet.name) + '</option>').join('');
    if (pets.some(pet => pet.id === current)) select.value = current;
  }
  function renderReminders() {
    const reminders = readStore('petnova-reminders').sort((a,b) => a.date.localeCompare(b.date));
    const pets = readStore('petnova-pets');
    const list = $('#remindersList');
    list.innerHTML = reminders.length ? '' : '<div class="empty-state">No tienes recordatorios todavÃ­a. AÃ±ade una fecha importante.</div>';
    reminders.forEach(reminder => {
      const pet = pets.find(item => item.id === reminder.petId);
      const item = document.createElement('div');
      item.className = 'saved-item';
      item.innerHTML = '<span class="saved-icon" aria-hidden="true">â—·</span><div class="saved-copy"><b>' + safeText(reminder.title) + '</b><small>' + safeText(reminder.date) + (pet ? ' Â· ' + safeText(pet.name) : '') + '</small></div><button class="delete-item" type="button" aria-label="Eliminar recordatorio ' + safeText(reminder.title) + '" data-delete-reminder="' + safeText(reminder.id) + '">Ã—</button>';
      list.appendChild(item);
    });
  }
  $('#petForm').addEventListener('submit', event => {
    event.preventDefault();
    const pets = readStore('petnova-pets');
    pets.push({ id: String(Date.now()) + Math.random().toString(16).slice(2), name: $('#petName').value.trim(), species: $('#petSpecies').value, birthday: $('#petBirthday').value, notes: $('#petNotes').value.trim() });
    if (!writeStore('petnova-pets', pets)) { $('#petFeedback').textContent = 'No se pudo guardar. Revisa la configuraciÃ³n de almacenamiento del navegador.'; return; }
    event.target.reset(); $('#petFeedback').textContent = 'Mascota aÃ±adida a este navegador.'; renderPets(); renderReminders(); showToast('Mascota registrada.');
  });
  $('#reminderForm').addEventListener('submit', event => {
    event.preventDefault();
    const reminders = readStore('petnova-reminders');
    reminders.push({ id: String(Date.now()) + Math.random().toString(16).slice(2), title: $('#reminderTitle').value.trim(), date: $('#reminderDate').value, petId: $('#reminderPet').value });
    if (!writeStore('petnova-reminders', reminders)) { $('#reminderFeedback').textContent = 'No se pudo guardar. Revisa la configuraciÃ³n de almacenamiento del navegador.'; return; }
    event.target.reset(); $('#reminderFeedback').textContent = 'Recordatorio guardado en este navegador.'; renderReminders(); showToast('Recordatorio guardado.');
  });
  $('#petsList').addEventListener('click', event => {
    const button = event.target.closest('[data-delete-pet]');
    if (!button) return;
    const id = button.dataset.deletePet;
    writeStore('petnova-pets', readStore('petnova-pets').filter(pet => pet.id !== id));
    writeStore('petnova-reminders', readStore('petnova-reminders').map(reminder => reminder.petId === id ? {...reminder, petId: ''} : reminder));
    renderPets(); renderReminders(); showToast('Registro eliminado.');
  });
  $('#remindersList').addEventListener('click', event => {
    const button = event.target.closest('[data-delete-reminder]');
    if (!button) return;
    writeStore('petnova-reminders', readStore('petnova-reminders').filter(reminder => reminder.id !== button.dataset.deleteReminder));
    renderReminders(); showToast('Recordatorio eliminado.');
  });
  $('#interestForm').addEventListener('submit', event => {
    event.preventDefault();
    const interest = $('#interest').value;
    if (!interest) return;
    const interests = readStore('petnova-interests');
    interests.push({interest, createdAt: new Date().toISOString()});
    if (!writeStore('petnova-interests', interests)) { $('#interestFeedback').textContent = 'No se pudo guardar en este navegador.'; return; }
    $('#interestFeedback').textContent = 'Â¡Gracias! Registramos tu interÃ©s en este navegador.';
    event.target.reset();
  });
})();