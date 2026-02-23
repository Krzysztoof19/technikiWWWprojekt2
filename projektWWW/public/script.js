document.addEventListener('DOMContentLoaded', async () => {

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();

            const navLogin = document.getElementById('nav-login');
            const navRegister = document.getElementById('nav-register');
            const navUser = document.getElementById('nav-user');
            const navLogout = document.getElementById('nav-logout');
            const userNameSpan = document.getElementById('userNamePlaceholder');

            if (data.loggedIn) {
                if (navLogin) navLogin.style.display = 'none';
                if (navRegister) navRegister.style.display = 'none';
                if (navUser) navUser.style.display = 'inline-block';
                if (navLogout) navLogout.style.display = 'inline-block';
                if (userNameSpan) userNameSpan.textContent = data.imie;
            }
        } catch (err) {
            console.error("Błąd sprawdzania statusu:", err);
        }
    };

    await checkLoginStatus();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch('/api/logout');
            window.location.href = 'index.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const haslo = document.getElementById('loginHaslo').value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, haslo })
            });

            const result = await response.json();
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                const msg = document.getElementById('loginMessage');
                msg.textContent = result.message;
                msg.style.color = "red";
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const imie = document.getElementById('regImie').value;
            const email = document.getElementById('regEmail').value;
            const haslo = document.getElementById('regHaslo').value;

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imie, email, haslo })
            });

            const result = await response.json();
            const msg = document.getElementById('registerMessage');
            if (result.success) {
                msg.textContent = "Rejestracja udana! Przekierowuję...";
                msg.style.color = "green";
                setTimeout(() => window.location.href = 'logowanie.html', 2000);
            } else {
                msg.textContent = "Błąd rejestracji!";
                msg.style.color = "red";
            }
        });
    }

    const listaRezerwacji = document.getElementById('lista-rezerwacji');
    const formRezerwacja = document.getElementById('formRezerwacja');

    async function pobierzRezerwacje() {
        if (!listaRezerwacji) return;
        
        const response = await fetch('/api/rezerwacje');
        const data = await response.json();

        if (data.error) {
            listaRezerwacji.innerHTML = "<p>Zaloguj się, aby zarządzać swoimi treningami.</p>";
            return;
        }

        if (data.length === 0) {
            listaRezerwacji.innerHTML = "<p>Obecnie nie masz zaplanowanych żadnych treningów.</p>";
            return;
        }

        let html = '<table class="tabela-rezerwacji">';
        html += '<thead><tr><th>Typ Treningu</th><th>Data i Godzina</th><th>Akcje</th></tr></thead><tbody>';
        
        data.forEach(rez => {
            const dataFormat = new Date(rez.data_treningu).toLocaleString('pl-PL', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            html += `
                <tr>
                    <td><strong>${rez.typ_treningu}</strong></td>
                    <td>${dataFormat}</td>
                    <td>
                        <button onclick="edytujRezerwacje(${rez.id})" class="przycisk-maly" style="background:#4CAF50; margin-right:5px; border:none; cursor:pointer;">Edytuj datę</button>
                        <button onclick="usunRezerwacje(${rez.id})" class="btn-usun">Odwołaj</button>
                    </td>
                </tr>`;
        });
        
        html += '</tbody></table>';
        listaRezerwacji.innerHTML = html;
    }

    if (formRezerwacja) {
        formRezerwacja.addEventListener('submit', async (e) => {
            e.preventDefault();
            const typ = document.getElementById('typTreningu').value;
            const data = document.getElementById('dataTreningu').value;

            const response = await fetch('/api/rezerwacje', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ typ_treningu: typ, data_treningu: data })
            });

            if (response.ok) {
                pobierzRezerwacje();
                alert("Sukces! Twój trening został zarezerwowany.");
                document.getElementById('dataTreningu').value = ''; 
            }
        });
    }

    window.edytujRezerwacje = async (id) => {
        const nowaData = prompt("Podaj nową datę w formacie RRRR-MM-DD GG:MM (np. 2026-03-05 15:30):");
        if (nowaData) {
            const response = await fetch(`/api/rezerwacje/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data_treningu: nowaData })
            });

            if (response.ok) {
                alert("Zaktualizowano datę!");
                pobierzRezerwacje();
            } else {
                alert("Wystąpił błąd zapisu.");
            }
        }
    };

    window.usunRezerwacje = async (id) => {
        if (confirm("Jesteś pewien, że chcesz odwołać ten trening?")) {
            const response = await fetch(`/api/rezerwacje/${id}`, { method: 'DELETE' });
            if (response.ok) {
                pobierzRezerwacje();
            }
        }
    };

    if (listaRezerwacji) pobierzRezerwacje();
});