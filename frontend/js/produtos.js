const API_URL = '/api/produtos';
let usuarioAtual = null;
const $ = (id) => document.getElementById(id);
const form = $('produtoForm'), produtoId = $('produtoId'), nome = $('nome'), categoria = $('categoria'), preco = $('preco'), quantidade = $('quantidade');

function mostrarMensagem(texto, tipo='sucesso') { const el=$('mensagem'); if(!el) return; el.textContent=texto; el.className=`mensagem ${tipo}`; }
function limparFormulario(){ if(!form) return; form.reset(); produtoId.value=''; $('tituloFormulario').textContent='Cadastrar Produto'; $('btnSalvar').textContent='Cadastrar'; $('btnCancelar').classList.add('oculto'); }
function formatarPreco(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

async function carregarUsuario(){
  const r=await fetch('/api/auth/me'); if(!r.ok){ location.href='/login'; return; }
  const d=await r.json(); usuarioAtual=d.usuario; $('usuarioLogado').textContent=`${usuarioAtual.nome} (${usuarioAtual.perfil})`;
  if(usuarioAtual.perfil==='admin'){ $('adminCard').classList.remove('oculto'); $('avisoPerfil').textContent='Perfil administrador: leitura, cadastro, edição e exclusão.'; }
  else { $('avisoPerfil').textContent='Perfil usuário comum: acesso somente para consulta.'; }
}

async function listarProdutos(){
  try { const r=await fetch(API_URL); if(r.status===401){location.href='/login';return;} const produtos=await r.json(); if(!r.ok) throw new Error(produtos.erro); const tbody=$('listaProdutos'); tbody.innerHTML=''; $('semProdutos').classList.toggle('oculto',produtos.length!==0);
    produtos.forEach(p=>{ const tr=document.createElement('tr'); const acoes=usuarioAtual?.perfil==='admin' ? `<button class="btn editar" data-editar="${p.id}">Editar</button> <button class="btn excluir" data-excluir="${p.id}">Excluir</button>` : '<span class="badge">Somente leitura</span>'; tr.innerHTML=`<td>${p.id}</td><td>${p.nome}</td><td>${p.categoria}</td><td>${formatarPreco(p.preco)}</td><td>${p.quantidade}</td><td>${acoes}</td>`; tbody.appendChild(tr); });
  } catch(e){ mostrarMensagem(e.message||'Erro ao carregar produtos.','erro'); }
}

form?.addEventListener('submit', async e=>{ e.preventDefault(); const id=produtoId.value; const dados={nome:nome.value.trim(),categoria:categoria.value.trim(),preco:Number(preco.value),quantidade:Number(quantidade.value)}; try { const r=await fetch(id?`${API_URL}/${id}`:API_URL,{method:id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)}); const d=await r.json(); if(!r.ok) throw new Error(d.erro); mostrarMensagem(id?'Produto atualizado com sucesso.':'Produto cadastrado com sucesso.'); limparFormulario(); await listarProdutos(); } catch(e){mostrarMensagem(e.message,'erro');} });

document.addEventListener('click', async e=>{
  const editId=e.target.dataset.editar, delId=e.target.dataset.excluir;
  if(editId){ const r=await fetch(`${API_URL}/${editId}`); const p=await r.json(); if(!r.ok)return mostrarMensagem(p.erro,'erro'); produtoId.value=p.id; nome.value=p.nome; categoria.value=p.categoria; preco.value=p.preco; quantidade.value=p.quantidade; $('tituloFormulario').textContent='Editar Produto'; $('btnSalvar').textContent='Salvar alterações'; $('btnCancelar').classList.remove('oculto'); window.scrollTo({top:0,behavior:'smooth'}); }
  if(delId && confirm('Tem certeza que deseja excluir este produto?')){ const r=await fetch(`${API_URL}/${delId}`,{method:'DELETE'}); const d=await r.json(); if(!r.ok)return mostrarMensagem(d.erro,'erro'); mostrarMensagem(d.mensagem); await listarProdutos(); }
});

$('btnCancelar')?.addEventListener('click',limparFormulario); $('btnAtualizar').addEventListener('click',listarProdutos); $('btnLogout').addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/login';});
(async()=>{await carregarUsuario();await listarProdutos();})();
