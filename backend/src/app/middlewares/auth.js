import jwt from 'jsonwebtoken';
// this node default mode allow to use functions with callback in promises
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /*
  authHeader:['Bearer','xxxxxx']
  */

  // get only token
  const token = authHeader.split(' ')[1];

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
