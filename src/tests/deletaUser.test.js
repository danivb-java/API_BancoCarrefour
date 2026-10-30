const { api, getAuthToken, loginAs, generateUniqueEmail, createUser, deleteUser } = require('../config/baseConfig');

describe('DELETE /usuarios/{id} - Excluir Usuário', () => {
  let token;
  let userToDeleteId;
  let userWithCartId;
  let userWithCartEmail;
  const USER_WITH_CART_PASSWORD = 'senha456';
  const NONEXISTENT_ID = 'abcdefgh12345679';

  beforeAll(async () => {
    token = await getAuthToken();

    userToDeleteId = await createUser(
      'Usuario Para Deletar JS',
      generateUniqueEmail(),
      'senha123',
      'false'
    );

    userWithCartEmail = generateUniqueEmail();
    userWithCartId = await createUser(
      'Usuario Com Carrinho JS',
      userWithCartEmail,
      USER_WITH_CART_PASSWORD,
      'false'
    );
  });

  afterAll(async () => {
    await deleteUser(userWithCartId);
  });

  it('Retornar 200 e excluir usuário existente com sucesso', async () => {
    const res = await api.delete(`/usuarios/${userToDeleteId}`, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Registro excluído com sucesso');
  });

  it('Confirmar exclusão retornando 400 no GET do usuário deletado', async () => {
    const res = await api.get(`/usuarios/${userToDeleteId}`);

    expect(res.status).toBe(400);
    expect(res.data.message).toBe('Usuário não encontrado');
  });

  it('Retornar 200 com "Nenhum registro excluído" para ID inexistente', async () => {
    const res = await api.delete(`/usuarios/${NONEXISTENT_ID}`, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('Nenhum registro excluído');
  });

  it('Resposta de exclusão deve conter campo message', async () => {
    const res = await api.delete(`/usuarios/${NONEXISTENT_ID}`, {
      headers: { Authorization: token }
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message');
  });

  it('Retornar 400 ao excluir usuário com carrinho cadastrado', async () => {
    const produtosRes = await api.get('/produtos', {
      headers: { Authorization: token }
    });
    expect(produtosRes.status).toBe(200);
    expect(produtosRes.data.produtos.length).toBeGreaterThan(0);

    const produto = produtosRes.data.produtos[0];

    const carrinhoUserToken = await loginAs(userWithCartEmail, USER_WITH_CART_PASSWORD);

    const carrinhoRes = await api.post(
      '/carrinhos',
      { produtos: [{ idProduto: produto._id, quantidade: 1 }] },
      { headers: { Authorization: carrinhoUserToken } }
    );
    expect([201, 200]).toContain(carrinhoRes.status);

    const deleteRes = await api.delete(`/usuarios/${userWithCartId}`, {
      headers: { Authorization: token }
    });

    expect(deleteRes.status).toBe(400);
    expect(deleteRes.data.message).toBe(
      'Não é permitido excluir usuário com carrinho cadastrado'
    );

    await api.delete('/carrinhos/cancelar-compra', {
      headers: { Authorization: carrinhoUserToken }
    });
  });
});
