const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// Global state to hold profile data
let currentProfile = {};

async function loadProfile() {
    try {
        const res = await fetch('/api/doctors/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        currentProfile = await res.json();

        // Populate display fields
        const fields = ['name', 'email', 'phone', 'specialization', 'consultation_fee', 'bio'];
        fields.forEach(field => {
            const el = document.getElementById(`disp-${field}`);
            if (el) {
                let value = currentProfile[field];

                if (field === 'date_of_birth' && value) {
                    el.innerText = new Date(value).toLocaleDateString();
                } else if (field === 'specialization' && value) {
                    // Try to translate specialization
                    const key = value.trim().toLowerCase();
                    el.innerText = window.t ? window.t(key) : value;
                } else if (field === 'bio') {
                    const isAr = localStorage.getItem('lang') === 'ar';
                    // If Arabic and bio_ar exists, show it. Otherwise show bio.
                    if (isAr && currentProfile.bio_ar) {
                        el.innerText = currentProfile.bio_ar;
                    } else {
                        el.innerText = currentProfile.bio || '';
                    }
                } else {
                    el.innerText = value || '';
                }
            }
        });

        if (window.translatePage) window.translatePage();

    } catch (err) { console.error(err); }
}

function editField(field) {
    document.getElementById(`edit-${field}`).style.display = 'block';
    const input = document.getElementById(`input-${field}`);
    // Special handling for date to format for input
    if (field === 'date_of_birth' && currentProfile[field]) {
        input.value = new Date(currentProfile[field]).toISOString().split('T')[0];
    } else {
        input.value = currentProfile[field] || '';
    }
}

function cancelEdit(field) {
    document.getElementById(`edit-${field}`).style.display = 'none';
}

async function saveField(field) {
    const input = document.getElementById(`input-${field}`);
    const newValue = input.value;

    // Optimistic update
    const previousValue = currentProfile[field];
    currentProfile[field] = newValue;

    try {
        const payload = { ...currentProfile }; // Send all fields, as the backend expects full object or we can adjust backend to be partial.
        // Our backend currently expects: specialization, consultation_fee, bio, phone, name, date_of_birth
        // We should send everything to be safe as the backend updateProfile takes all.

        await fetch('/api/doctors/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        // Update display
        const el = document.getElementById(`disp-${field}`);
        if (field === 'date_of_birth' && newValue) {
            el.innerText = new Date(newValue).toLocaleDateString();
        } else {
            el.innerText = newValue;
        }

        cancelEdit(field);

    } catch (err) {
        console.error(err);
        currentProfile[field] = previousValue; // Revert on error
        alert('Failed to update profile');
    }
}

// Expose to window
window.editField = editField;
window.cancelEdit = cancelEdit;
window.saveField = saveField;

function showSection(sectionId) {
    document.getElementById('section-manage-availability').style.display = 'none';
    document.getElementById('section-appointment-requests').style.display = 'none';
    document.getElementById('section-profile').style.display = 'none';
    document.getElementById(`section-${sectionId}`).style.display = 'block';
}

// Make global
window.showSection = showSection;

// Slots
const slotForm = document.getElementById('slot-form');
slotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(slotForm).entries());

    try {
        const res = await fetch('/api/doctors/slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Slot added');
            loadSlots();
        }
    } catch (err) { console.error(err); }
});

async function loadSlots() {
    try {
        const res = await fetch('/api/doctors/slots', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const slots = await res.json();
        const list = document.getElementById('slots-list');
        if (slots.length === 0) {
            list.innerHTML = `<p class="text-muted" data-i18n="no_doctors_desc">${t('no_doctors_desc')}</p>`;
        } else {
            list.innerHTML = slots.map(s => {
                const key = s.day_of_week.trim().toLowerCase();
                const trans = t(key);
                // console.log(`Debug: '${s.day_of_week}' -> '${key}' -> '${trans}'`);
                return `
                <div style="background: var(--white); padding: 8px 16px; border-radius: 30px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; box-shadow: var(--shadow-sm);">
                    <strong>${trans}</strong> ${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}
                    <button onclick="deleteSlot(${s.id})" style="background: none; border: none; color: var(--danger-color); cursor: pointer; font-weight: bold; font-size: 1.1em;">&times;</button>
                </div>
            `}).join('');
        }
    } catch (err) { console.error(err); }
}

async function deleteSlot(id) {
    if (!confirm('Delete slot?')) return;
    await fetch(`/api/doctors/slots/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadSlots();
}

// Appointments
async function loadAppointments() {
    try {
        const res = await fetch('/api/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const appointments = await res.json();
        const tbody = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" data-i18n="no_doctors_desc">${t('no_doctors_desc')}</td></tr>`;
        } else {
            tbody.innerHTML = appointments.map(appt => {
                const statusKey = appt.status.toLowerCase();
                const statusLabel = t(statusKey); // Use t() for status translation

                let btnClass = '';
                if (appt.status === 'pending') btnClass = 'bg-warning';
                else if (appt.status === 'approved') btnClass = 'bg-primary';
                else if (appt.status === 'rejected') btnClass = 'bg-danger';
                else if (appt.status === 'completed') btnClass = 'bg-success';

                const reportLink = appt.medical_report_path ? `<a href="${appt.medical_report_path}" target="_blank">${t('view')}</a>` : t('none');

                return `
                <tr>
                    <td>
                        <div style="font-weight: bold;">${appt.patient_name}</div>
                        <div style="font-size: 0.85em; color: var(--text-muted);">${appt.patient_email || ''}</div>
                        <div style="font-size: 0.85em; color: var(--text-muted);">${appt.patient_phone || ''}</div>
                    </td>
                    <td>${new Date(appt.appointment_date).toLocaleDateString()}</td>
                    <td>${appt.appointment_time}</td>
                    <td class="text-muted" style="font-size: 0.9em; max-width: 200px; word-wrap: break-word;">${appt.description || '-'}</td>
                    <td>${reportLink}</td>
                    <td class="text-center"><span class="badge ${btnClass}">${statusLabel}</span></td>
                    <td class="text-center">
                        <div class="d-flex gap-2 justify-content-center" style="justify-content: center;">
                        ${appt.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="updateStatus(${appt.id}, 'approved')">${t('approve')}</button>
                            <button class="btn btn-danger btn-sm" onclick="updateStatus(${appt.id}, 'rejected')">${t('reject')}</button>
                        ` : ''}
                        ${appt.status === 'approved' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateStatus(${appt.id}, 'completed')">${t('complete')}</button>
                        ` : ''} 
                        </div>
                    </td>
                </tr>
            `}).join('');
        }
    } catch (err) { console.error(err); }
}

async function updateStatus(id, status) {
    if (!confirm(t('confirm') + '?')) return;
    try {
        await fetch(`/api/appointments/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        loadAppointments();
    } catch (err) { console.error(err); }
}

function toggleEditProfile() {
    const el = document.getElementById('profile-edit');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Update select options language (using lowercase keys)
function updateDayOptions() {
    const select = document.querySelector('select[name="day"]');
    if (!select) return;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    select.innerHTML = days.map(day => {
        // Capitalize for value, translate for text
        const value = day.charAt(0).toUpperCase() + day.slice(1);
        return `<option value="${value}">${t(day)}</option>`;
    }).join('');
}

// Hook into language change
const originalSetLang_doc = window.setLanguage;
window.setLanguage = function (lang) {
    if (originalSetLang_doc) originalSetLang_doc(lang); // Call main version
    loadProfile(); // Re-load profile to translate values
    loadSlots();
    loadAppointments();
    updateDayOptions(); // Refresh dropdown
}

loadProfile();
loadSlots();
loadAppointments();
updateDayOptions();
