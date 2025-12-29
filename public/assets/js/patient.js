const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// Helper Functions
function getStatusBadge(status) {
    if (status === 'approved') return { bg: '#d1fae5', color: '#065f46' };
    if (status === 'rejected') return { bg: '#fee2e2', color: '#991b1b' };
    if (status === 'completed') return { bg: '#dbeafe', color: '#1e40af' };
    return { bg: '#fef3c7', color: '#92400e' }; // pending
}

function openBooking(id, name) {
    document.getElementById('modal-doctor-id').value = id;
    document.getElementById('modal-doctor-name').value = name;
    document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

// Profile State
let currentProfile = {};

async function loadProfile() {
    try {
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        currentProfile = await res.json();

        // Update localStorage to ensure name_ar is available for navbar
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentProfile.name_ar) {
                user.name_ar = currentProfile.name_ar;
                localStorage.setItem('user', JSON.stringify(user));
                // Reload navbar to show Arabic name if needed
                if (window.checkAuth) window.checkAuth();
            }
        } catch (e) {
            console.error('Error updating local storage', e);
        }

        const fields = ['name', 'email', 'phone', 'date_of_birth'];
        fields.forEach(field => {
            const el = document.getElementById(`disp-${field}`);
            if (el) {
                if (field === 'date_of_birth' && currentProfile[field]) {
                    el.innerText = new Date(currentProfile[field]).toLocaleDateString();
                } else if (field === 'name') {
                    const isAr = localStorage.getItem('lang') === 'ar';
                    el.innerText = (isAr && currentProfile.name_ar) ? currentProfile.name_ar : currentProfile.name;
                } else {
                    el.innerText = currentProfile[field] || '';
                }
            }
        });
        if (window.translatePage) window.translatePage();
    } catch (err) { console.error(err); }
}

window.editField = function (field) {
    document.getElementById(`edit-${field}`).style.display = 'block';
    const input = document.getElementById(`input-${field}`);
    if (field === 'date_of_birth' && currentProfile[field]) {
        input.value = new Date(currentProfile[field]).toISOString().split('T')[0];
    } else {
        input.value = currentProfile[field] || '';
    }
}

window.cancelEdit = function (field) {
    document.getElementById(`edit-${field}`).style.display = 'none';
}

window.saveField = async function (field) {
    const input = document.getElementById(`input-${field}`);
    const newValue = input.value;
    const previousValue = currentProfile[field];
    currentProfile[field] = newValue;

    try {
        const payload = { ...currentProfile };
        await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const el = document.getElementById(`disp-${field}`);
        if (field === 'date_of_birth' && newValue) {
            el.innerText = new Date(newValue).toLocaleDateString();
        } else if (field === 'name') {
            // Handle instant update display
            const isAr = localStorage.getItem('lang') === 'ar';
            // If we are editing name, usually we edit the English name (since input is single). 
            // We might want to support editing name_ar later, but for now just update display.
            // If name_ar exists and we are in Ar mode, strictly speaking we shouldn't be editing English name here? 
            // But the user only restricted editing for Name, so this block might not even be reachable for Name.
            el.innerText = newValue;
        } else {
            el.innerText = newValue;
        }
        cancelEdit(field);
    } catch (err) {
        console.error(err);
        currentProfile[field] = previousValue;
        alert('Update failed');
    }
}

function showSection(sectionId) {
    document.getElementById('section-find-doctor').style.display = 'none';
    document.getElementById('section-my-appointments').style.display = 'none';
    const profileSec = document.getElementById('section-profile');
    if (profileSec) profileSec.style.display = 'none';

    document.getElementById(`section-${sectionId}`).style.display = 'block';

    if (sectionId === 'profile') loadProfile();
}

// Make global
window.showSection = showSection;

// Data Loading
async function loadDoctors() {
    try {
        const res = await fetch('/api/doctors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const doctors = await res.json();
        console.log('Loaded doctors:', doctors); // Debug logging


        const container = document.getElementById('doctors-list');
        if (doctors.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3 data-i18n="no_doctors_desc">${t('no_doctors')}</h3>
                    <p data-i18n="no_doctors_desc">${t('no_doctors_desc')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = doctors.map(doc => {
            const isAr = localStorage.getItem('lang') === 'ar';
            const specializationKey = doc.specialization.trim().toLowerCase();
            const translatedSpecialization = t(specializationKey) || doc.specialization;

            // Name: Use name_ar if Ar mode and exists, else English name.
            // Note: If English name in DB doesn't have "Dr.", we add it. 
            // If Arabic name has "د.", we use it as is.
            let displayName = doc.name;
            if (isAr && doc.name_ar) {
                displayName = doc.name_ar;
            } else {
                // If English, force Dr. prefix if not present (simple check)
                if (!displayName.startsWith('Dr.')) displayName = 'Dr. ' + displayName;
            }

            // Bio: Use bio_ar if Ar mode and exists
            const displayBio = (isAr && doc.bio_ar) ? doc.bio_ar : (doc.bio || 'No bio available.');

            return `
            <div class="card">
                <h3>${displayName}</h3>
                <p style="color: var(--primary-color); font-weight: 600;">${translatedSpecialization}</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span><strong>${t('fees')}:</strong> ${doc.consultation_fee} EGP</span>
                </div>
                <p class="text-muted" style="font-size: 0.9rem;">${displayBio}</p>
                <button class="btn btn-primary w-100" onclick="openBooking(${doc.doctor_id}, '${displayName}')" data-i18n="book_appointment">${t('book_appointment')}</button>
            </div>
        `}).join('');
    } catch (err) {
        console.error(err);
        document.getElementById('doctors-list').innerHTML = '<p class="alert">Error loading doctors.</p>';
    }
}

async function loadAppointments() {
    try {
        const res = await fetch('/api/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const appointments = await res.json();

        const tbody = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" data-i18n="no_doctors_desc">${t('no_doctors_desc')}</td></tr>`;
        } else {
            tbody.innerHTML = appointments.map(appt => {
                const badge = getStatusBadge(appt.status);
                const statusKey = appt.status.trim().toLowerCase();
                const statusLabel = t(statusKey);

                const reportLink = appt.medical_report_path ? `<a href="${appt.medical_report_path}" target="_blank">${t('view')}</a>` : t('none');

                const isAr = localStorage.getItem('lang') === 'ar';
                // Doctor Name check
                let doctorName = appt.doctor_name;
                if (isAr && appt.doctor_name_ar) {
                    doctorName = appt.doctor_name_ar;
                }

                // Format Time
                const timeParts = appt.appointment_time.split(':');
                const timeDisplay = `${timeParts[0]}:${timeParts[1]}`;

                return `
                <tr>
                    <td>${doctorName}</td>
                    <td>${new Date(appt.appointment_date).toLocaleDateString()}</td>
                    <td>${timeDisplay}</td>
                    <td><span class="badge" style="background: ${badge.bg}; color: ${badge.color}">${statusLabel}</span></td>
                    <td class="text-muted" style="font-size: 0.9em;">${appt.description || '-'}</td>
                    <td>${reportLink}</td>
                </tr>
            `}).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

// Event Listeners
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(bookingForm);

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert(t('confirm') + '!'); // Simple success message
                bookingForm.reset();
                closeModal();
                loadAppointments();
            } else {
                const result = await res.json();
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
            alert('Booking failed');
        }
    });
}

// Init
// Hook into language change from main.js if needed
const originalSetLang_pat = window.setLanguage;
window.setLanguage = function (lang) {
    if (originalSetLang_pat) originalSetLang_pat(lang);
    loadProfile(); // Refresh profile name
    loadDoctors();
    loadAppointments();
}

loadDoctors();
loadAppointments();
