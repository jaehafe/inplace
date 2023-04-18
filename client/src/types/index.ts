export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISignup {
  email: string;
  password: string;
  username: string;
  imageName: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IIdentifier {
  identifier: string;
}
