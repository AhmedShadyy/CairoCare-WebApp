const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// ----- NAVIGATION -----
function showSection(id) {
    // Hide all
    ['overview', 'patients', 'doctors', 'approvals', 'profile', 'appointments'].forEach(sec => {
        const el = document.getElementById(`section-${sec}`);
        if (el) el.style.display = 'none';

        const link = document.querySelector(`.sidebar-link[data-id="${sec}"]`);
        if (link) link.classList.remove('active');
    });

    // Show target
    const target = document.getElementById(`section-${id}`);
    if (target) target.style.display = 'block';

    const activeLink = document.querySelector(`.sidebar-link[data-id="${id}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Add active styling (light background)
    document.querySelectorAll('.sidebar-link').forEach(l => l.style.background = 'transparent');
    if (activeLink) activeLink.style.background = 'var(--bg-body)';

    // Load data
    if (id === 'overview') loadStats();
    if (id === 'patients') loadPatients();
    if (id === 'doctors') loadDoctors();
    if (id === 'appointments') loadAllAppointments();
    if (id === 'approvals') loadApprovals();
    if (id === 'profile') loadProfile();

    if (window.translatePage) window.translatePage();
}
window.showSection = showSection;

// ----- OVERVIEW -----
async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();
        const grid = document.getElementById('stats-grid');
        grid.innerHTML = `
            <div class="card text-center"><h3>${stats.appointments}</h3><span data-i18n="appointments">${t('appointments')}</span></div>
            <div class="card text-center"><h3>${stats.patients}</h3><span data-i18n="patients">${t('patients')}</span></div>
            <div class="card text-center"><h3>${stats.doctors}</h3><span data-i18n="doctors">${t('doctors')}</span></div>
            <div class="card text-center"><h3>${stats.users}</h3><span data-i18n="total_users">${t('total_users')}</span></div>
        `;
    } catch (err) { console.error(err); }
}

// ----- PATIENTS -----
async function loadPatients() {
    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await res.json();
        const patients = users.filter(u => u.role === 'patient');
        const tbody = document.getElementById('patients-list');
        tbody.innerHTML = patients.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone || '-'}</td>
                <td>${u.date_of_birth ? new Date(u.date_of_birth).toLocaleDateString() : '-'}</td>
                <td>${new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="dropUser(${u.id})" data-i18n="drop">${t('drop')}</button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

// ----- DOCTORS -----
async function loadDoctors() {
    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await res.json();
        const doctors = users.filter(u => u.role === 'doctor' && u.is_approved === 1);

        const container = document.getElementById('doctors-container');
        if (!container) return;
        container.innerHTML = '';

        if (doctors.length === 0) {
            container.innerHTML = `<div class="card"><p class="text-center text-muted" data-i18n="no_doctors">${t('no_doctors')}</p></div>`;
            return;
        }

        // Group by specialization
        const grouped = {};
        doctors.forEach(d => {
            const spec = d.specialization || 'general';
            if (!grouped[spec]) grouped[spec] = [];
            grouped[spec].push(d);
        });

        // Render a card for each specialization
        Object.keys(grouped).forEach(specKey => {
            const docs = grouped[specKey];
            const specTitle = t(specKey.toLowerCase()) || specKey;

            const cardHtml = `
                <div class="card mb-4">
                    <h3 class="mb-3" style="color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">
                        ${specTitle}
                    </h3>
                    <table class="w-100">
                        <thead>
                            <tr>
                                <th data-i18n="name">${t('name')}</th>
                                <th data-i18n="email">${t('email')}</th>
                                <th data-i18n="fees">${t('fees')}</th>
                                <th data-i18n="actions">${t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${docs.map(u => `
                                <tr>
                                    <td>${u.name}</td>
                                    <td>${u.email}</td>
                                    <td>${u.consultation_fee || '-'}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm" onclick="dropUser(${u.id})" data-i18n="drop">${t('drop')}</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (err) { console.error(err); }
}

// ----- APPROVALS -----
async function loadApprovals() {
    try {
        const res = await fetch('/api/admin/doctors/pending', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pending = await res.json();
        const container = document.getElementById('pending-doctors-list');

        if (pending.length === 0) {
            container.innerHTML = `<p class="text-muted" data-i18n="no_pending">${t('no_pending')}</p>`;
            return;
        }

        container.innerHTML = pending.map(doc => `
            <div class="card">
                <h3>${doc.name}</h3>
                <p><strong>Email:</strong> ${doc.email}</p>
                <p><strong>Bio:</strong> ${doc.bio || 'N/A'}</p>
                <p><strong>Specialization:</strong> ${t(doc.specialization.toLowerCase()) || doc.specialization}</p>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-success" onclick="approveDoctor(${doc.id})" data-i18n="accept">${t('accept')}</button>
                    <button class="btn btn-danger" onclick="rejectDoctor(${doc.id})" data-i18n="reject">${t('reject')}</button>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

// ----- APPOINTMENTS -----
async function loadAllAppointments() {
    try {
        const res = await fetch('/api/admin/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const appts = await res.json();
        const tbody = document.getElementById('admin-appointments-list');

        if (appts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-muted" data-i18n="no_doctors_desc">${t('no_doctors_desc')}</td></tr>`;
            return;
        }

        tbody.innerHTML = appts.map(appt => {
            const statusBadge = getStatusBadge(appt.status);
            const statusLabel = t(appt.status);

            const btnClass = appt.status === 'approved' ? 'bg-primary' :
                (appt.status === 'rejected' ? 'bg-danger' :
                    (appt.status === 'completed' ? 'bg-success' : 'bg-warning'));

            // Use translate for keys if available
            const reportLink = appt.medical_report_path ? `<a href="${appt.medical_report_path}" target="_blank">${t('view')}</a>` : t('none');

            return `
                <tr>
                    <td>
                        <strong>${appt.doctor_name}</strong><br>
                        <small class="text-muted">${appt.doctor_email}</small>
                    </td>
                    <td>
                        ${t(appt.specialization.toLowerCase()) || appt.specialization}
                    </td>
                    <td>
                        <strong>${appt.patient_name}</strong><br>
                        <small class="text-muted">${appt.patient_email}</small>
                    </td>
                    <td>${new Date(appt.appointment_date).toLocaleDateString()}</td>
                    <td>${appt.appointment_time}</td>
                    <td class="text-center"><span class="badge ${btnClass}">${statusLabel}</span></td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${appt.id})" data-i18n="drop">${t('drop')}</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) { console.error(err); }
}

async function deleteAppointment(id) {
    if (!confirm(t('confirm') + '?')) return;
    try {
        const res = await fetch(`/api/admin/appointments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            loadAllAppointments();
            loadStats(); // refresh counts
        } else {
            alert('Failed to delete appointment');
        }
    } catch (err) { console.error(err); }
}

function getStatusBadge(status) {
    if (status === 'approved') return { cls: 'text-success' };
    if (status === 'rejected') return { cls: 'text-danger' };
    return { cls: 'text-warning' };
}

// ----- ACTIONS -----
window.dropUser = async function (id) {
    if (!confirm(t('confirm') + '?')) return;
    try {
        await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadPatients();
        loadDoctors();
    } catch (err) { alert('Error dropping user'); }
}

window.approveDoctor = async function (id) {
    if (!confirm(t('confirm') + '?')) return;
    try {
        await fetch(`/api/admin/doctors/${id}/approve`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadApprovals();
    } catch (err) { alert('Error approving'); }
}

window.rejectDoctor = async function (id) {
    if (!confirm(t('confirm') + '?')) return;
    try {
        await fetch(`/api/admin/doctors/${id}/reject`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadApprovals();
    } catch (err) { alert('Error rejecting'); }
}

// ----- PROFILE -----
let currentProfile = {};
async function loadProfile() {
    try {
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        currentProfile = await res.json();
        const fields = ['name', 'email', 'phone'];
        fields.forEach(f => {
            const el = document.getElementById(`disp-${f}`);
            if (el) el.innerText = currentProfile[f] || '';
        });
    } catch (err) { console.error(err); }
}

window.editField = function (field) {
    document.getElementById(`edit-${field}`).style.display = 'block';
    const input = document.getElementById(`input-${field}`);
    input.value = currentProfile[field] || '';
}

window.cancelEdit = function (field) {
    document.getElementById(`edit-${field}`).style.display = 'none';
}

window.saveField = async function (field) {
    const input = document.getElementById(`input-${field}`);
    const newValue = input.value;
    currentProfile[field] = newValue;

    try {
        await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(currentProfile)
        });
        document.getElementById(`disp-${field}`).innerText = newValue;
        cancelEdit(field);
    } catch (err) { alert('Update failed'); }
}


// Init
const originalSetLang_admin = window.setLanguage;
window.setLanguage = function (lang) {
    if (originalSetLang_admin) originalSetLang_admin(lang);
    loadStats();
    loadApprovals();
    loadPatients();
    loadDoctors();
    loadAllAppointments();
    loadProfile();
}

// Start
loadStats();
showSection('overview');
