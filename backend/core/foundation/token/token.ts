export interface Token {
  token: string;
  refreshToken: string;
  isRegistered: boolean;
  expiresOn?: string;
  expiresIn?: number;
  [key: string]: any;
}
