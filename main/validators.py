import re
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

def validar_cpf(cpf: str):
  """
  Valida CPF usando algoritmo de dígitos verificadores.
  Aceita CPF com ou sem formatação (pontos e hífen).
  """
  # Remove caracteres não numéricos
  cpf = re.sub(r'[^0-9]', '', cpf)
  
  # Verifica se tem 11 dígitos
  if len(cpf) != 11:
    raise ValidationError('CPF deve ter 11 dígitos.')
  
  # Verifica se todos os dígitos são iguais (CPF inválido)
  if cpf == cpf[0] * 11:
    raise ValidationError('CPF inválido.')
  
  # Calcula o primeiro dígito verificador
  soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
  resto = soma % 11
  digito1 = 0 if resto < 2 else 11 - resto
  
  if int(cpf[9]) != digito1:
    raise ValidationError('CPF inválido.')
  
  # Calcula o segundo dígito verificador
  soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
  resto = soma % 11
  digito2 = 0 if resto < 2 else 11 - resto
  
  if int(cpf[10]) != digito2:
    raise ValidationError('CPF inválido.')
  
# Filtro regex para formato de CPF
cpf_regex_validator = RegexValidator(
  regex=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$',
  message='CPF deve estar no formato 000.000.000-00 ou conter apenas 11 dígitos.',
)

# Filtro regex para formato de telefone
telefone_regex_validator = RegexValidator(
  regex=r'^\d{2}\s\d{4,5}-\d{4}$|^\d{10,11}$',
  message='Telefone deve estar no formato 00 00000-0000 ou conter apenas 10-11 dígitos.',
)

# Filtro regex para formato de email
email_regex_validator = RegexValidator(
  regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  message='Email inválido.',
)
