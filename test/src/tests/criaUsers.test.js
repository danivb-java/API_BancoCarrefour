const { api, getAuthToken, generateUniqueEmail, buildUserPayload, deleteUser } = require('../config/baseConfig');

describe('POST /usuarios - Criar Usuário', () => {
  let token;
  let createdAdminId;
  let createdNonAdminId;
  let duplicateEmail;

  beforeAll(async () => {
    token = await getAuthToken();
    duplicateEmail = generateUniqueEmail();
  });

  afterAll(async () => {
    await deleteUser(createdAdminId);
    await deleteUser(createdNonAdminId);
  });

  it('Criar usuário administrador e retornar 201 com _id', async () => {
    const payload = buildUserPayload('Admin Teste JS', duplicateEmail, 'senha@123', 'true');

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(201);
    expect(res.data.message).toBe('Cadastro realizado com sucesso');
    expect(res.data._id).toBeDefined();
    expect(typeof res.data._id).toBe('string');

    createdAdminId = res.data._id;
  });

  it('Criar usuário não-administrador e retornar 201 com _id', async () => {
    const payload = buildUserPayload('Comum Teste JS', generateUniqueEmail(), 'senha@456', 'false');

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(201);
    expect(res.data.message).toBe('Cadastro realizado com sucesso');
    expect(res.data._id).toBeDefined();

    createdNonAdminId = res.data._id;
  });

  it('Retornar 400 ao criar usuário com email já cadastrado', async () => {
    const payload = buildUserPayload('Outro Nome', duplicateEmail, 'outrasenha', 'false');

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data.message).toBe('Este email já está sendo usado');
  });

  it('Retornar 400 quando campo nome está ausente', async () => {
    const payload = {
      email: generateUniqueEmail(),
      password: 'senha123',
      administrador: 'false'
    };

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('nome');
  });

  it('Retornar 400 quando campo email está ausente', async () => {
    const payload = {
      nome: 'Sem Email',
      password: 'senha123',
      administrador: 'false'
    };

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('email');
  });

  it('Retornar 400 quando campo password está ausente', async () => {
    const payload = {
      nome: 'Sem Senha',
      email: generateUniqueEmail(),
      administrador: 'false'
    };

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('password');
  });

  it('Retornar 400 quando campo administrador está ausente', async () => {
    const payload = {
      nome: 'Sem Admin',
      email: generateUniqueEmail(),
      password: 'senha123'
    };

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('administrador');
  });

  it('Retornar 400 com formato de email inválido', async () => {
    const payload = buildUserPayload('Email Invalido', 'nao_e_um_email', 'senha123', 'false');

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('email');
  });

  it('Retornar 400 ao enviar body vazio', async () => {
    const res = await api.post('/usuarios', {}, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
  });

  it('Resposta de criação deve conter campos message e _id', async () => {
    const payload = buildUserPayload('Validar Campos JS', generateUniqueEmail(), 'senha123', 'true');

    const res = await api.post('/usuarios', payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('message');
    expect(res.data).toHaveProperty('_id');

    await deleteUser(res.data._id);
  });
});
