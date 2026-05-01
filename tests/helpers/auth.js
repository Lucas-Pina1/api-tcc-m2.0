const request = require('./request');

async function registerUser(user) {
  return request
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(user);
}

async function loginUser(credentials) {
  return request
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send(credentials);
}

async function createAuthenticatedUser(user) {
  await registerUser(user);

  const loginResponse = await loginUser({
    email: user.email,
    password: user.password,
  });

  const token = loginResponse.body.data.token;
  const profileResponse = await request
    .get('/api/auth/profile')
    .set('Authorization', `Bearer ${token}`);

  return {
    token,
    user: profileResponse.body.data.user,
  };
}

async function loginAsAdmin(credentials) {
  const response = await loginUser(credentials);

  return {
    token: response.body.data.token,
    user: response.body.data.user,
  };
}

module.exports = {
  registerUser,
  loginUser,
  createAuthenticatedUser,
  loginAsAdmin,
};
