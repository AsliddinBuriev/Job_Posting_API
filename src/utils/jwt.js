import jwt from 'jsonwebtoken';

export const sign = (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      id,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
