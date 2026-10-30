const { api, generateUniqueEmail, createUser, deleteUser } = require('../config/baseConfig');

describe('GET /usuarios/{id} - Buscar Usuário por ID', () => {
  let createdUserId;
  let createdUserEmail;
  const NONEXISTENT_ID = 'abcdefgh12345678';

  beforeAll(async () => {
    createdUserEmail = generateUniqueEmail();
    createdUserId = await createUser(
      'Busca Por ID JS',
      createdUserEmail,
      'senha123',
      'true'
    );
  });

  afterAll(async () => {
    await deleteUser(createdUserId);
  });

  it('Retornar 200 e dados do usuário ao buscar por ID válido', async () => {
    const res = await api.get(`/usuarios/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.data._id).toBe(createdUserId);
    expect(res.data.nome).toBe('Busca Por ID JS');
    expect(res.data.email).toBe(createdUserEmail);
    expect(res.data.administrador).toBe('true');
  });

  it('Retornar todos os campos obrigatórios do usuário', async () => {
    const res = await api.get(`/usuarios/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('_id');
    expect(res.data).toHaveProperty('nome');
    expect(res.data).toHaveProperty('email');
    expect(res.data).toHaveProperty('password');
    expect(res.data).toHaveProperty('administrador');
  });

  it('Retornar 400 ao buscar usuário com ID inexistente', async () => {
    const res = await api.get(`/usuarios/${NONEXISTENT_ID}`);

    expect(res.status).toBe(400);
    expect(res.data.message).toBe('Usuário não encontrado');
  });

  it('Resposta de erro por ID inexistente deve conter campo message', async () => {
    const res = await api.get(`/usuarios/${NONEXISTENT_ID}`);

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('message');
  });

  it('Retornar campo administrador correto para usuário admin', async () => {
    const res = await api.get(`/usuarios/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.data.administrador).toBe('true');
  });

  it('Retornar email exatamente igual ao cadastrado', async () => {
    const res = await api.get(`/usuarios/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.data.email).toBe(createdUserEmail);
  });
});
