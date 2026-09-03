const API_URL='/api/produtos';
const form=document.getElementById('produtoForm');
const produtoId=document.getElementById('produtoId');
const nome=document.getElementById('nome');
const categoria=document.getElementById('categoria');
const preco=document.getElementById('preco');
const quantidade=document.getElementById('quantidade');
const listaProdutos=document.getElementById('listaProdutos');
const mensagem=document.getElementById('mensagem');
const tituloFormulario=document.getElementById('tituloFormulario');
const btnSalvar=document.getElementById('btnSalvar');
const btnCancelar=document.getElementById('btnCancelar');
const btnAtualizar=document.getElementById('btnAtualizar');
const semProdutos=document.getElementById('semProdutos');

function mostrarMensagem(texto,tipo){mensagem.textContent=texto;mensagem.className=`mensagem ${tipo}`;setTimeout(()=>{mensagem.textContent='';mensagem.className='mensagem'},3500)}
function limparFormulario(){form.reset();produtoId.value='';tituloFormulario.textContent='Cadastrar Produto';btnSalvar.textContent='Cadastrar';btnCancelar.classList.add('oculto')}
function formatarPreco(valor){return Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}

async function listarProdutos(){try{const resposta=await fetch(API_URL);if(!resposta.ok)throw new Error('Não foi possível carregar os produtos.');const produtos=await resposta.json();listaProdutos.innerHTML='';if(produtos.length===0){semProdutos.classList.remove('oculto');return}semProdutos.classList.add('oculto');produtos.forEach(produto=>{const linha=document.createElement('tr');linha.innerHTML=`<td>${produto.id}</td><td>${produto.nome}</td><td>${produto.categoria}</td><td>${formatarPreco(produto.preco)}</td><td>${produto.quantidade}</td><td><button class="btn editar" onclick="editarProduto(${produto.id})">Editar</button> <button class="btn excluir" onclick="excluirProduto(${produto.id})">Excluir</button></td>`;listaProdutos.appendChild(linha)})}catch(erro){mostrarMensagem(erro.message,'erro')}}

form.addEventListener('submit',async evento=>{evento.preventDefault();const dados={nome:nome.value.trim(),categoria:categoria.value.trim(),preco:Number(preco.value),quantidade:Number(quantidade.value)};const id=produtoId.value;const editando=Boolean(id);try{const resposta=await fetch(editando?`${API_URL}/${id}`:API_URL,{method:editando?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)});const resultado=await resposta.json();if(!resposta.ok)throw new Error(resultado.erro||'Erro ao salvar produto.');mostrarMensagem(editando?'Produto atualizado com sucesso.':'Produto cadastrado com sucesso.','sucesso');limparFormulario();listarProdutos()}catch(erro){mostrarMensagem(erro.message,'erro')}});

async function editarProduto(id){try{const resposta=await fetch(`${API_URL}/${id}`);const produto=await resposta.json();if(!resposta.ok)throw new Error(produto.erro||'Erro ao carregar produto.');produtoId.value=produto.id;nome.value=produto.nome;categoria.value=produto.categoria;preco.value=produto.preco;quantidade.value=produto.quantidade;tituloFormulario.textContent='Editar Produto';btnSalvar.textContent='Salvar alterações';btnCancelar.classList.remove('oculto');window.scrollTo({top:0,behavior:'smooth'})}catch(erro){mostrarMensagem(erro.message,'erro')}}

async function excluirProduto(id){const confirmar=window.confirm('Tem certeza que deseja excluir este produto?');if(!confirmar)return;try{const resposta=await fetch(`${API_URL}/${id}`,{method:'DELETE'});const resultado=await resposta.json();if(!resposta.ok)throw new Error(resultado.erro||'Erro ao excluir produto.');mostrarMensagem('Produto excluído com sucesso.','sucesso');if(produtoId.value===String(id))limparFormulario();listarProdutos()}catch(erro){mostrarMensagem(erro.message,'erro')}}

btnCancelar.addEventListener('click',limparFormulario);btnAtualizar.addEventListener('click',listarProdutos);listarProdutos();
