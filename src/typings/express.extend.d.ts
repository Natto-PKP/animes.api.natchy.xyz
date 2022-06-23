declare namespace Express {
  export interface Request {
    author: import('../models').UserModel
  }
}
