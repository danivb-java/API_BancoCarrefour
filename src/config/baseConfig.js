const axios = require('axios');

const BASE_URL = 'https://serverest.dev';
const ADMIN_EMAIL = 'fulano@qa.com';
const ADMIN_PASSWORD = 'teste';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: () => true,
  timeout: 15000
});

async function getAuthToken() {
  const res = await api.post('/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });
  return res.data.authorization;
}

async function loginAs(email, password) {
  const res = await api.post('/login', { email, password });
  return res.data.authorization;
}

function generateUniqueEmail() {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `auto_${ts}_${rand}@test.com`;
}

function buildUserPayload(nome, email, password, administrador) {
  return { nome, email, password, administrador };
}

async function createUser(nome, email, password, administrador) {
  const token = await getAuthToken();
  const res = await api.post(
    '/usuarios',
    buildUserPayload(nome, email, password, administrador),
    { headers: { Authorization: token } }
  );
  if (res.status !== 201) {
    throw new Error(`Falha ao criar usuário: ${JSON.stringify(res.data)}`);
  }
  return res.data._id;
}

async function deleteUser(userId) {
  if (!userId) return;
  const token = await getAuthToken();
  await api.delete(`/usuarios/${userId}`, {
    headers: { Authorization: token }
  });
}

module.exports = {
  api,
  BASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  getAuthToken,
  loginAs,
  generateUniqueEmail,
  buildUserPayload,
  createUser,
  deleteUser
};
