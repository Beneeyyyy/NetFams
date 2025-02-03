export interface MikrotikCredentials {
    host: string;
    username: string;
    password: string;
  }
  
  export interface SSHResponse {
    success: boolean;
    data?: string;
    error?: string;
  }