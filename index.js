const express = require('express');
const app = express();
const port = 3000;
const supabase = require('./supabase');
const jwt = require('jsonwebtoken');

function gerarToken(nomeId) {
  const segredo = '4a8c7b2e9f1d6e5a3c0b8e7f2d9a6c1b'; // Chave secreta para assinar o token
  const token = jwt.sign({ id: nomeId }, segredo, { expiresIn: '1h' }); // Assina o token com o ID do usuário e define a expiração para 1 hora
  return token;
}

app.use(express.json()); // Middleware para interpretar o corpo da requisição como JSON

app.post('/cadastro', async (req, res) => {
  const { nome, data_nascimento, email, senha } = req.body;
  try {
    await supabase.from('usuarios').insert({
      nome,
      data_nascimento,
      email,
      senha
    });
    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
  }
});

app.delete('/deletar', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const { data: users, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha);

    if (error) {
      throw new Error('Ocorreu um erro ao buscar o usuário');
    }

    if (users.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const { data: deletedUser, deleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('email', email)
      .eq('senha', senha);

    if (deleteError) {
      throw new Error('Ocorreu um erro ao deletar o usuário');
    }

    res.send('Usuário deletado com sucesso');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/entrar', async (req, res) => {
  const { email, senha } = req.body;
  const { data, error } = await supabase
    .from('nomes')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single();

  if (error) {
    // Se ocorrer um erro na consulta, retorne uma resposta de erro
    return res.status(500).json({ mensagem: 'Erro ao verificar as credenciais do usuário' });
  }

  if (!data) {
    // Se as credenciais não forem válidas, retorne um erro
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  // Se as credenciais forem válidas, gere um token de autenticação
  const token = gerarToken(data.id);

  // Retorne o token de autenticação como resposta
  res.json({ token });
});

app.get('/jogador/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('nomes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // Se ocorrer um erro na consulta, retorne uma resposta de erro
    return res.status(500).json({ mensagem: 'Erro ao verificar as credenciais do usuário' });
  }

  if (!data) {
    // Se as credenciais não forem válidas, retorne um erro
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  // Retorne os dados do usuário como resposta em formato JSON
  res.json(data);
});

app.listen(port, () => {
  console.log("Servidor ligado na porta: " + port);
});