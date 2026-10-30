const { api, getAuthToken, generateUniqueEmail, buildUserPayload, createUser, deleteUser } = require('../config/baseConfig');

describe('PUT /usuarios/{id} - Atualizar Usuário', () => {
  let token;
  let existingUserId;
  let anotherUserId;
  let anotherUserEmail;
  let putCreatedId;
  const NONEXISTENT_ID = '000000000000000000000abc';

  beforeAll(async () => {
    token = await getAuthToken();

    existingUserId = await createUser(
      'Usuario Para Update JS',
      generateUniqueEmail(),
      'senha123',
      'false'
    );

    anotherUserEmail = generateUniqueEmail();
    anotherUserId = await createUser(
      'Outro Usuario JS',
      anotherUserEmail,
      'senha456',
      'false'
    );
  });

  afterAll(async () => {
    await deleteUser(existingUserId);
    await deleteUser(anotherUserId);
    await deleteUser(putCreatedId);
  });

  it('Retornar 200 ao atualizar usuário existente com dados válidos', async () => {
    const payload = buildUserPayload(
      'Nome Atualizado JS',
      generateUniqueEmail(),
      'novaSenha123',
      'true'
    );

    const res = await api.put(`/usuarios/${existingUserId}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Registro alterado com sucesso');
  });

  it('Confirmar que os dados foram efetivamente atualizados no GET', async () => {
    const res = await api.get(`/usuarios/${existingUserId}`);

    expect(res.status).toBe(200);
    expect(res.data.nome).toBe('Nome Atualizado JS');
    expect(res.data.administrador).toBe('true');
  });

  it('Retornar 201 e criar usuário ao fazer PUT com ID inexistente', async () => {
    const payload = buildUserPayload(
      'Criado via PUT JS',
      generateUniqueEmail(),
      'senha789',
      'false'
    );

    const res = await api.put(`/usuarios/${NONEXISTENT_ID}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(201);
    expect(res.data.message).toBe('Cadastro realizado com sucesso');
    expect(res.data._id).toBeDefined();

    putCreatedId = res.data._id;
  });

  it('Retornar 400 ao atualizar email para um já utilizado por outro usuário', async () => {
    const payload = buildUserPayload('Nome Qualquer', anotherUserEmail, 'senha123', 'false');

    const res = await api.put(`/usuarios/${existingUserId}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data.message).toBe('Este email já está sendo usado');
  });

  it('Retornar 400 quando campo nome está ausente na atualização', async () => {
    const payload = {
      email: generateUniqueEmail(),
      password: 'senha123',
      administrador: 'false'
    };

    const res = await api.put(`/usuarios/${existingUserId}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('nome');
  });

  it('Retornar 400 quando campo email está ausente na atualização', async () => {
    const payload = {
      nome: 'Nome Sem Email',
      password: 'senha123',
      administrador: 'false'
    };

    const res = await api.put(`/usuarios/${existingUserId}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('email');
  });

  it('Resposta de atualização deve conter campo message', async () => {
    const payload = buildUserPayload(
      'Verifica Message',
      generateUniqueEmail(),
      'senha123',
      'false'
    );

    const res = await api.put(`/usuarios/${existingUserId}`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message');
  });

  it('Resposta de criação via PUT deve conter campos message e _id', async () => {
    const payload = buildUserPayload(
      'Verifica PUT Create',
      generateUniqueEmail(),
      'senha123',
      'false'
    );

    const res = await api.put(`/usuarios/000000000000000000000eee`, payload, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('message');
    expect(res.data).toHaveProperty('_id');

    await deleteUser(res.data._id);
  });
});
