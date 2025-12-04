export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  firmName: string;
  position: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthCardProps {
  isLoading: boolean;

  loginEmail: string;
  loginPassword: string;
  rememberMe: boolean;
  onLoginEmailChange: (value: string) => void;
  onLoginPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;

  registerFirstName: string;
  registerLastName: string;
  registerEmail: string;
  registerPassword: string;
  registerFirmName: string;
  onRegisterFirstNameChange: (value: string) => void;
  onRegisterLastNameChange: (value: string) => void;
  onRegisterEmailChange: (value: string) => void;
  onRegisterPasswordChange: (value: string) => void;
  onRegisterFirmNameChange: (value: string) => void;

  onLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}


export interface LoginFormProps {
  isLoading: boolean;
  email: string;
  password: string;
  rememberMe: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface RegisterFormProps {
  isLoading: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  firmName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirmNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
