// Utilitários de formatação e validação

/**
 * Formata CPF: 000.000.000-00
 */
export const formatCPF = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const truncated = numbers.slice(0, 11);
  
  // Aplica a máscara
  return truncated
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
};

/**
 * Formata Telefone: 00 00000-0000 ou 00 0000-0000
 */
export const formatTelefone = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const truncated = numbers.slice(0, 11);
  
  // Aplica a máscara
  if (truncated.length <= 10) {
    // Formato: (00) 0000-0000
    return truncated
      .replace(/(\d{2})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Formato: (00) 00000-0000
    return truncated
      .replace(/(\d{2})(\d)/, '$1 $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

/**
 * Remove formatação de CPF e Telefone
 */
export const removeFormat = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

/**
 * Formata data do backend (YYYY-MM-DD) para exibição (DD/MM/YYYY)
 * Corrige problema de fuso horário
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  
  // Divide a data em partes (YYYY-MM-DD)
  const [year, month, day] = dateString.split('-');
  
  // Retorna no formato DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

/**
 * Converte data do input (YYYY-MM-DD) para o formato correto
 * sem problemas de fuso horário
 */
export const formatDateForBackend = (dateString) => {
  if (!dateString) return '';
  return dateString; // Já está no formato YYYY-MM-DD
};

/**
 * Valida CPF usando algoritmo de dígitos verificadores
 */
export const validarCPF = (cpf) => {
  // Remove formatação
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) {
    return false;
  }
  
  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(numbers.charAt(9)) !== digito1) {
    return false;
  }
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numbers.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(numbers.charAt(10)) !== digito2) {
    return false;
  }
  
  return true;
};

/**
 * Valida Email
 */
export const validarEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Valida Telefone (10 ou 11 dígitos)
 */
export const validarTelefone = (telefone) => {
  const numbers = telefone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
};
