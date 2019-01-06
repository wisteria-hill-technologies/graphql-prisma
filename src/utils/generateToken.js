import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'thisismysecretkey', { expiresIn: '7 days' }); //Create a new JWT token.
};

export { generateToken as default };