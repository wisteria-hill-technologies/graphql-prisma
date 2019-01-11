import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;
  //in case of subscription, it is request.connection.....as above.

  if(header) {
    const token = header.replace('Bearer ', '');
    // This token should have been originally created with a secret.
    // This means we can verify the token with the same secret.
    // Here I need to implement in case token is not valid but requireAuth is false...To be done later...
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    return decoded.userId;
  }
  if(requireAuth) {
    throw new Error('Authorization required');
  }
  return null;
};

export { getUserId as default };