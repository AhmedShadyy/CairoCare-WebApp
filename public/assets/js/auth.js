const API_URL = '/api/auth';

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // Redirect based on role
                if (result.user.role === 'admin') window.location.href = '/dashboard/admin.html';
                else if (result.user.role === 'doctor') window.location.href = '/dashboard/doctor.html';
                else window.location.href = '/dashboard/patient.html';
            } else {
                document.getElementById('alert-box').innerText = result.message;
            }
        } catch (err) {
            console.error(err);
            document.getElementById('alert-box').innerText = 'Something went wrong.';
        }
    });
}

// Register
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                document.getElementById('alert-box').innerText = result.message;
            }
        } catch (err) {
            console.error(err);
            document.getElementById('alert-box').innerText = 'Something went wrong.';
        }
    });
}
