// ----------------------- Funções principais -----------------------

function gerarCPF(comMascara = false) {
  // Gera 9 dígitos iniciais aleatórios
  let cpf = [];
  for(let i = 0; i < 9; i++) {
    cpf.push(Math.floor(Math.random() * 10));
  }

  // Calcula primeiro dígito verificador
  let soma = 0;
  for(let i = 0; i < 9; i++) {
    soma += cpf[i] * (10 - i);
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  cpf.push(digito1);

  // Calcula segundo dígito verificador
  soma = 0;
  for(let i = 0; i < 10; i++) {
    soma += cpf[i] * (11 - i);
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  cpf.push(digito2);

  if (comMascara) {
    const cpfStr = cpf.join('');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return cpf.join('');
}


function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // Verifica sequências inválidas
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;

  if (digito1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;

  return digito2 === parseInt(cpf.charAt(10));
}


function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length > 11) cpf = cpf.substring(0,11);

  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return cpf.replace(/(\d{3})/, '$1.');
  if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})/, '$1.$2.');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
}

// ----------------------- Eventos -----------------------

document.getElementById('gerar').addEventListener('click', () => {
  const cpf = gerarCPF(false);
  document.getElementById('cpf-gerado').value = cpf;
});

document.getElementById('gerar-mascara').addEventListener('click', () => {
  const cpf = gerarCPF(true);
  document.getElementById('cpf-gerado').value = cpf;
});

document.getElementById('copiar').addEventListener('click', () => {
  const input = document.getElementById('cpf-gerado');
  if (!input.value) return;

  navigator.clipboard.writeText(input.value)
    .then(() => {
      const originalText = input.value;
      input.value = "Copiado!";
      setTimeout(() => input.value = originalText, 1500);
    });
});

const inputCPF = document.getElementById('cpf-input');
inputCPF.addEventListener('input', () => {
  inputCPF.value = formatarCPF(inputCPF.value);
});

document.getElementById('validar').addEventListener('click', () => {
  const cpf = inputCPF.value;
  const resultado = document.getElementById('resultado-validacao');

  if (!cpf) {
    resultado.textContent = "Digite um CPF";
    resultado.className = "resultado";
    return;
  }

  const ehValido = validarCPF(cpf);

  resultado.textContent = ehValido ? "CPF VÁLIDO ✓" : "CPF INVÁLIDO ✗";
  resultado.className = "resultado " + (ehValido ? "valido" : "invalido");
});