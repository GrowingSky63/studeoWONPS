import React from 'react';
import TextField from '@mui/material/TextField';
import { formatCPF, formatTelefone, validarCPF, validarEmail } from '../utils/validators';

/**
 * Input com máscara de CPF
 */
export const CPFInput = ({ value, onChange, error, helperText, ...props }) => {
  const [internalError, setInternalError] = React.useState('');

  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value);
    
    // Valida CPF se tiver 11 dígitos
    const numbers = formatted.replace(/\D/g, '');
    if (numbers.length === 11) {
      if (!validarCPF(formatted)) {
        setInternalError('CPF inválido');
      } else {
        setInternalError('');
      }
    } else {
      setInternalError('');
    }
    
    onChange({ target: { name: e.target.name, value: formatted } });
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      error={error || !!internalError}
      helperText={helperText || internalError}
      placeholder="000.000.000-00"
      inputProps={{
        maxLength: 14,
      }}
    />
  );
};

/**
 * Input com máscara de Telefone
 */
export const TelefoneInput = ({ value, onChange, ...props }) => {
  const handleChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    onChange({ target: { name: e.target.name, value: formatted } });
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      placeholder="00 00000-0000"
      inputProps={{
        maxLength: 15,
      }}
    />
  );
};

/**
 * Input com validação de Email
 */
export const EmailInput = ({ value, onChange, error, helperText, ...props }) => {
  const [internalError, setInternalError] = React.useState('');

  const handleBlur = (e) => {
    const email = e.target.value;
    if (email && !validarEmail(email)) {
      setInternalError('Email inválido');
    } else {
      setInternalError('');
    }
  };

  const handleChange = (e) => {
    setInternalError('');
    onChange(e);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error || !!internalError}
      helperText={helperText || internalError}
      type="email"
      placeholder="exemplo@email.com"
    />
  );
};
