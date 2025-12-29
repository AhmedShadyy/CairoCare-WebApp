// Translations
const translations = {
    en: {
        welcome: 'Welcome, ',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        logout: 'Logout',
        theme: 'Moon',
        home: 'Home',

        // Auth Pages
        create_account: 'Create Account',
        login_header: 'Login',
        password: 'Password',
        dont_have_account: "Don't have an account?",
        full_name: 'Full Name',
        phone: 'Phone Number',
        dob: 'Date of Birth',
        patient_role: 'Patient',
        doctor_role: 'Doctor',
        login_btn: 'Login',
        register_btn: 'Register',

        // Patient Dashboard
        find_doctor: 'Find a Doctor',
        book_appointment: 'Book Appointment',
        my_appointments: 'My Appointments',
        my_profile: 'My Profile',
        doctor: 'Doctor',
        date: 'Date',
        time: 'Time',
        status: 'Status',
        description_header: 'Reason',
        report: 'Report',
        view: 'View',
        no_doctors: 'No Doctors Found',
        no_doctors_desc: 'No appointments listed',

        // Doctor Dashboard
        doctor_dashboard: 'Doctor Dashboard',
        edit_profile: 'Edit Profile',
        manage_availability: 'Manage Availability',
        day: 'Day',
        start_time: 'Start Time',
        end_time: 'End Time',
        add_slot: 'Add Slot',
        appointment_requests: 'Appointments Requests',
        patient: 'Patient',
        actions: 'Actions',
        specialization: 'Specialization',
        fees: 'Fees (EGP)',
        bio: 'Bio',
        save_changes: 'Save Changes',
        edit: 'Edit',
        address: 'Address',

        // Admin Dashboard
        system_overview: 'System Overview',
        pending_approvals: 'Pending Approvals',
        user_registry: 'User Registry',
        approve: 'Approve',
        accept: 'Accept',
        reject: 'Reject',
        drop: 'Drop',
        patients: 'Patients',
        doctors: 'Doctors',
        total_users: 'Total Users',
        no_pending: 'No pending approvals',
        appointments: 'Appointments',
        approve: 'Approve',
        name: 'Full Name',
        full_name: 'Full Name',
        doctor_name: 'Doctor Name',
        patient_name: 'Patient Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role',
        joined: 'Joined',

        // Common
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...',
        none: 'None',

        // Days
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',

        // Specializations
        bones: 'Bones',
        dentist: 'Dentist',
        general: 'General',
        cardiology: 'Cardiology',
        dermatology: 'Dermatology',
        pediatrics: 'Pediatrics',
        neurology: 'Neurology',

        // Homepage
        hero_title: 'Your Health, Our Priority',
        hero_desc: 'Connect with top specialists in Cairo. Book appointments with ease and manage your health records securely.',
        get_started: 'Get Started',
        why_choose_us: 'Why Choose Us?',
        for_patients: 'For Patients',
        patients_desc: 'Access a wide network of verified doctors. Compare specialties, fees, and schedule visits that fit your life.',
        for_doctors: 'For Doctors',
        doctors_desc: 'Streamline your practice. Manage appointments, digitalize records, and focus on providing care.',
        secure_private: 'Secure & Private',
        secure_desc: 'Your data is encrypted and protected. We prioritize your privacy and data security above all.',

        // Statuses
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        completed: 'Completed',
        complete: 'Complete',
        // Admin
        system_overview: 'System Overview',
        patients: 'Patients',
        doctors: 'Doctors',
        appointments: 'Appointments',
        pending_approvals: 'Pending Approvals',
        joined: 'Joined',
        actions: 'Actions',
        dob: 'Date of Birth',
        admin_badge: 'Admin',
        // Booking Modal
        medical_report_optional: 'Medical Report (Optional)',
        description_placeholder: 'Briefly describe your condition or reason for visit',
        confirm_booking: 'Confirm Booking',
        book_appointment: 'Book Appointment',
        description_header: 'Description / Reason',

        // Dynamic Content (Doctors)
        'Dr. Amr Ali': 'Dr. Amr Ali',
        'Dr. Amr Ali, Cardiologist at Al-Shifa Hospital': 'Dr. Amr Ali, Cardiologist at Al-Shifa Hospital',
        'Dr. Murad Mohamed': 'Dr. Murad Mohamed',
        'Dr. Murad Mohamed General Practitioner at Al Amal Hospital': 'Dr. Murad Mohamed General Practitioner at Al Amal Hospital'
    },
    ar: {
        welcome: 'مرحباً، ',
        login: 'تسجيل دخول',
        register: 'حساب جديد',
        dashboard: 'لوحة التحكم',
        logout: 'خروج',
        theme: 'قمر',
        home: 'الرئيسية',

        // Dynamic Content (Doctors)
        // 'Dr. Amr Ali': 'د. عمرو علي', (Removed in favor of DB)


        // Homepage
        hero_title: 'صحتك، أولويتنا',
        hero_desc: 'تواصل مع أفضل الأطباء في القاهرة. احجز المواعيد بسهولة وقم بإدارة سجلاتك الصحية بأمان.',
        get_started: 'ابدأ الآن',
        why_choose_us: 'لماذا تختارنا؟',
        for_patients: 'للمرضى',
        patients_desc: 'الوصول إلى شبكة واسعة من الأطباء المعتمدين. قارن التخصصات والرسوم وحدد الزيارات التي تناسب حياتك.',
        for_doctors: 'للأطباء',
        doctors_desc: 'تبسيط الممارسة الخاصة بك. إدارة المواعيد ورقمنة السجلات والتركيز على تقديم الرعاية.',
        secure_private: 'آمن وخاص',
        secure_desc: 'بياناتك مشفرة ومحمية. نحن نعطي الأولوية لخصوصيتك وأمن بياناتك قبل كل شيء.',

        // Auth Pages
        create_account: 'إنشاء حساب جديد',
        login_header: 'تسجيل الدخول',
        password: 'كلمة المرور',
        dont_have_account: 'ليس لديك حساب؟',
        full_name: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        dob: 'تاريخ الميلاد',
        patient_role: 'مريض',
        doctor_role: 'طبيب',
        login_btn: 'دخول',
        register_btn: 'تسجيل',

        // Patient Dashboard
        find_doctor: 'ابحث عن طبيب',
        book_appointment: 'حجز موعد',
        my_appointments: 'مواعيدي',
        my_profile: 'ملفي الشخصي',
        doctor: 'الدكتور',
        date: 'التاريخ',
        time: 'الوقت',
        status: 'الحالة',
        description_header: 'السبب',
        report: 'التقرير',
        view: 'عرض',
        no_doctors: 'لا يوجد أطباء',
        no_doctors_desc: 'لا يوجد مواعيد مسجلة',

        // Doctor Dashboard
        doctor_dashboard: 'لوحة تحكم الطبيب',
        edit_profile: 'تعديل الملف الشخصي',
        manage_availability: 'إدارة المواعيد المتاحة',
        day: 'اليوم',
        start_time: 'وقت البدء',
        end_time: 'وقت الانتهاء',
        add_slot: 'إضافة موعد',
        appointment_requests: 'طلبات المواعيد',
        patient: 'المريض',
        actions: 'إجراءات',
        specialization: 'التخصص',
        fees: 'السعر (ج.م)',
        bio: 'نبذة',
        save_changes: 'حفظ التغييرات',
        edit: 'تعديل',
        address: 'العنوان',

        // Admin Dashboard
        system_overview: 'نظرة عامة',
        pending_approvals: 'أطباء في انتظار الموافقة',
        user_registry: 'سجل المستخدمين',
        approve: 'قبول',
        accept: 'قبول',
        reject: 'رفض',
        drop: 'حذف',
        patients: 'المرضى',
        doctors: 'الأطباء',
        total_users: 'إجمالي المستخدمين',
        no_pending: 'لا توجد طلبات معلقة',
        name: 'الاسم بالكامل',
        doctor_name: 'اسم الطبيب',
        patient_name: 'اسم المريض',
        full_name: 'الاسم بالكامل',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        role: 'الدور',
        joined: 'تاريخ الانضمام',
        appointments: 'المواعيد',

        // Common
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        loading: 'جاري التحميل...',
        none: 'لا يوجد',

        // Days
        sunday: 'الأحد',
        monday: 'الاثنين',
        tuesday: 'الثلاثاء',
        wednesday: 'الأربعاء',
        thursday: 'الخميس',
        friday: 'الجمعة',
        saturday: 'السبت',

        // Specializations
        bones: 'عظام',
        dentist: 'أسنان',
        general: 'عام',
        cardiology: 'قلب',
        dermatology: 'جلدية',
        pediatrics: 'أطفال',
        neurology: 'أعصاب',

        // Statuses
        pending: 'قيد الانتظار',
        approved: 'مقبول',
        rejected: 'مرفوض',
        completed: 'مكتمل',
        complete: 'إكمال',
        // Booking Modal
        medical_report_optional: 'التقرير الطبي (اختياري)',
        confirm_booking: 'تأكيد الحجز',
        description_placeholder: 'اشرح باختصار حالتك أو سبب الزيارة',
        book_appointment: 'حجز موعد',
        // Admin
        system_overview: 'نظرة عامة',
        patients: 'المرضى',
        doctors: 'الأطباء',
        appointments: 'المواعيد',
        pending_approvals: 'الموافقات المعلقة',
        joined: 'تاريخ الانضمام',
        actions: 'إجراءات',
        dob: 'تاريخ الميلاد',
        admin_badge: 'مسؤول',
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// Language Logic
function applyLanguageStyles(lang) {
    console.log(`Applying Language Styles: ${lang}`);
    document.documentElement.lang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    translatePage();
}

function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Found ${elements.length} elements to translate.`);

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        // console.log(`Translating ${key} to ${currentLang}: ${translations[currentLang][key]}`);
        if (translations[currentLang][key]) {
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.getAttribute('placeholder')) {
                el.placeholder = translations[currentLang][key];
                // Ensure value/innerText is not overwritten if it's meant to be a placeholder
                if (el.tagName === 'TEXTAREA') el.innerText = '';
            } else {
                el.innerText = translations[currentLang][key];
            }
        } else {
            console.warn(`Missing translation for key: ${key}`);
        }
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyLanguageStyles(lang);
    checkAuth(); // Re-render nav with new translations
}

function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
}

function t(key) {
    return translations[currentLang][key] || key;
}

// Theme Logic
function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark-mode');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Helper: Refresh user data in background to ensure name_ar is up to date
async function refreshUserData() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || !user.role) return;

    try {
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const profile = await res.json();
            const updatedUser = { ...user, ...profile };
            if (profile.name_ar) updatedUser.name_ar = profile.name_ar;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            checkAuth(); // Re-render nav
        }
    } catch (e) { console.error('Background profile refresh failed', e); }
}

// Auth & Nav Logic
function checkAuth() {
    initTheme();
    applyLanguageStyles(currentLang);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navLinks = document.getElementById('nav-links');
    const brand = document.querySelector('.brand');

    if (navLinks) {
        let navContent = '';
        const controls = `
            <button onclick="toggleTheme()" class="btn-icon" title="Toggle Theme">🌗</button>
            <button onclick="toggleLanguage()" class="btn-icon" title="Toggle Language">${currentLang === 'en' ? 'عربي' : 'English'}</button>
        `;

        if (token && user.name) {
            let links = '';
            if (user.role === 'patient') {
                links = `
                    <a href="#" onclick="showSection('profile')" data-i18n="my_profile">${t('my_profile')}</a>
                    <a href="#" onclick="showSection('find-doctor')" data-i18n="find_doctor">${t('find_doctor')}</a>
                    <a href="#" onclick="showSection('my-appointments')" data-i18n="my_appointments">${t('my_appointments')}</a>
                `;
            } else if (user.role === 'doctor') {
                links = `
                    <a href="#" onclick="showSection('profile')" data-i18n="my_profile">${t('my_profile')}</a>
                    <a href="#" onclick="showSection('manage-availability')" data-i18n="manage_availability">${t('manage_availability')}</a>
                    <a href="#" onclick="showSection('appointment-requests')" data-i18n="appointment_requests">${t('appointment_requests')}</a>
                `;
            } else if (user.role === 'admin') {
                links = `<a href="/dashboard/admin.html">${t('dashboard')}</a>`;
            }

            const isAr = currentLang === 'ar';
            const displayName = (isAr && user.name_ar) ? user.name_ar : user.name;
            const welcomeMsg = `<span class="welcome-msg">${t('welcome')} <b>${user.role === 'doctor' ? (isAr ? 'د. ' : 'Dr. ') : ''}${displayName}</b></span>`;

            navContent = `
                ${welcomeMsg}
                ${controls}
                ${links}
                <a href="#" onclick="logout()">${t('logout')}</a>
            `;
        } else {
            const loginText = t('login') || 'Login';
            const registerText = t('register') || 'Register';
            navContent = `
                ${controls}
                <a href="/index.html">${t('home')}</a>
                <a href="/login.html">${loginText}</a>
                <a href="/register.html" class="btn btn-primary">${registerText}</a>
            `;
        }
        navLinks.innerHTML = navContent;
    }
}

// Helper: Refresh user data in background to ensure name_ar is up to date
async function refreshUserData() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || !user.role) return;

    try {
        let url = '/api/auth/profile';
        if (user.role === 'doctor') url = '/api/doctors/profile';

        // Patients usually hit auth/profile or we need a specific endpoint.
        // Actually authController.getProfile works for all users.
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const profile = await res.json();
            // Merge updates
            const updatedUser = { ...user, ...profile };
            if (profile.name_ar) updatedUser.name_ar = profile.name_ar;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // If name changed (or language switched previously without data), update text
            const isAr = localStorage.getItem('lang') === 'ar';
            const displayName = (isAr && updatedUser.name_ar) ? updatedUser.name_ar : updatedUser.name;
            const welcomeEl = document.querySelector('.welcome-msg b');
            if (welcomeEl) {
                const prefix = user.role === 'doctor' ? (isAr ? 'د. ' : 'Dr. ') : '';
                welcomeEl.innerText = prefix + displayName;
            }
        }
    } catch (e) { console.error('Background profile refresh failed', e); }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}


document.addEventListener('DOMContentLoaded', checkAuth);
console.log('Main JS v4.1 Loaded');
