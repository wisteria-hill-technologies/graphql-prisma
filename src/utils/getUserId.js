import jwt from 'jsonwebtoken';

const getUserId = (request) => {
  const header = request.request.headers.authorization;

  if(!header) {
    throw new Error('Authorization required');
  }

  const token = header.replace('Bearer ', '');
  // This token should have been originally created with a secret.
  // This means we can verify the token with the same secret. If the vefification does not succeed, it will fail.
  const decoded = jwt.verify(token, 'thisismysecretkey');

  return decoded.userId;
};

export { getUserId as default };