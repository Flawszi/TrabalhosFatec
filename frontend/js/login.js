const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  mensagem.textContent = '';
  try {
    const resposta = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('email').value.trim(), senha: document.getElementById('senha').value }) });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Falha no login.');
    window.location.href = '/app';
  } catch (erro) { mensagem.textContent = erro.message; mensagem.className = 'mensagem erro'; }
});
