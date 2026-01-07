export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
  method?: 'totp';
  enabledAt?: string;
}

export interface TwoFactorEnableResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorVerifyResponse {
  message: string;
  backupCodes: string[];
}

export interface TwoFactorDisableRequest {
  password: string;
  code: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  current: boolean;
  createdAt: string;
  lastActivityAt: string;
}

export interface SessionsListResponse {
  sessions: Session[];
}
