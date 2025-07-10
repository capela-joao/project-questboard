interface RegisterForm {
  username: string;
  email: string;
  bio: string;
  password: string;
}

interface LoginForm {
  email: string;
  password: string;
}

export function useFormValidation() {
  const validateRegister = (data: RegisterForm): string | null => {
    if (!data.username || !data.email || !data.bio || !data.password) {
      return "Preencha todos os campos.";
    }
    if (data.username.length < 3) {
      return "O nome de usuário deve ter pelo menos 3 caracteres.";
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return "Informe um e-mail válido.";
    }
    if (data.password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
  };

  const validateLogin = (data: LoginForm): string | null => {
    if (!data.email || !data.password) {
      return "Preencha todos os campos.";
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return "Informe um e-mail válido.";
    }
    return null;
  };

  return { validateRegister, validateLogin };
}
