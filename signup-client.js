document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;
    const terms = document.getElementById('terms').checked;

    if (!fullname) {
      alert('Por favor introduce tu nombre completo.');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!terms) {
      alert('Debes aceptar los Términos y Condiciones.');
      return;
    }

    // En este ejemplo usaremos el nombre completo como username
    const username = fullname;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Registro exitoso. Serás redirigido al login.');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Error en el registro');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red. ¿Está el servidor en ejecución?');
    }
  });
});
