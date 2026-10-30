const { api, generateUniqueEmail, createUser, deleteUser } = require('../config/baseConfig');

describe('GET /usuarios - Listar Usuários', () => {
  let createdUserId;
  const createdUserEmail = generateUniqueEmail();

  beforeAll(async () => {
    createdUserId = await createUser(
      'Usuario Lista Teste',
      createdUserEmail,
      'senha123',
      'true'
    );
  });

  afterAll(async () => {
    await deleteUser(createdUserId);
  });

  it('Retornar 200 e lista de usuários com campo quantidade', async () => {
    const res = await api.get('/usuarios');

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('quantidade');
    expect(res.data).toHaveProperty('usuarios');
    expect(Array.isArray(res.data.usuarios)).toBe(true);
    expect(typeof res.data.quantidade).toBe('number');
  });

  it('Retornar 200 e quantidade igual ao tamanho do array de usuários', async () => {
    const res = await api.get('/usuarios');

    expect(res.status).toBe(200);
    expect(res.data.quantidade).toBe(res.data.usuarios.length);
  });

  it('Filtrar usuários por nome e retornar apenas os correspondentes', async () => {
    const res = await api.get('/usuarios', {
      params: { nome: 'Usuario Lista Teste' }
    });

    expect(res.status).toBe(200);
    expect(res.data.quantidade).toBeGreaterThanOrEqual(1);
    expect(res.data.usuarios[0].nome).toBe('Usuario Lista Teste');
  });

  it('Filtrar usuários por email e retornar os correspondentes', async () => {
    const res = await api.get('/usuarios', {
      params: { email: createdUserEmail }
    });

    expect(res.status).toBe(200);
    expect(res.data.quantidade).toBe(1);
    expect(res.data.usuarios[0].email).toBe(createdUserEmail);
  });

  it('Filtrar usuários por administrador=true e retornar apenas administradores', async () => {
    const res = await api.get('/usuarios', {
      params: { administrador: 'true' }
    });

    expect(res.status).toBe(200);
    res.data.usuarios.forEach(user => {
      expect(user.administrador).toBe('true');
    });
  });

  it('Filtrar usuários por administrador=false e retornar apenas não-administradores', async () => {
    const res = await api.get('/usuarios', {
      params: { administrador: 'false' }
    });

    expect(res.status).toBe(200);
    res.data.usuarios.forEach(user => {
      expect(user.administrador).toBe('false');
    });
  });

  it('Filtrar por _id e retornar exatamente 1 usuário', async () => {
    const res = await api.get('/usuarios', {
      params: { _id: createdUserId }
    });

    expect(res.status).toBe(200);
    expect(res.data.quantidade).toBe(1);
    expect(res.data.usuarios[0]._id).toBe(createdUserId);
  });

  it('Retornar 200 com quantidade 0 para nome inexistente', async () => {
    const res = await api.get('/usuarios', {
      params: { nome: 'NomeAbsolutamenteInexistente_XYZ_999abc' }
    });

    expect(res.status).toBe(200);
    expect(res.data.quantidade).toBe(0);
    expect(res.data.usuarios).toHaveLength(0);
  });

  it('cada usuário da lista deve conter os campos obrigatórios', async () => {
    const res = await api.get('/usuarios');

    expect(res.status).toBe(200);
    if (res.data.usuarios.length > 0) {
      const user = res.data.usuarios[0];
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('nome');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('administrador');
    }
  });
});
