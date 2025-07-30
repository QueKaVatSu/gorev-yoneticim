document.addEventListener('DOMContentLoaded', () => {
    // localStorage'dan kullanıcıları al veya boş bir dizi oluştur
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // --- KAYIT OLMA FORMU MANTIĞI ---
    if (document.getElementById('signupForm')) {
        const signupForm = document.getElementById('signupForm');
        const signupError = document.getElementById('signupError');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Kullanıcı adı daha önce alınmış mı kontrol et
            const userExists = users.some(user => user.username === username);

            if (userExists) {
                signupError.textContent = 'Bu kullanıcı adı zaten alınmış!';
            } else {
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                window.location.href = 'index.html'; // Giriş sayfasına yönlendir
            }
        });
    }

    // --- GİRİŞ FORMU MANTIĞI ---
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Kullanıcıyı bul ve parolasını kontrol et
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // sessionStorage: Tarayıcı sekmesi kapanana kadar bilgiyi saklar
                sessionStorage.setItem('currentUser', username);
                window.location.href = 'tasks.html'; // Görevler sayfasına yönlendir
            } else {
                loginError.textContent = 'Kullanıcı adı veya parola hatalı!';
            }
        });
    }
});