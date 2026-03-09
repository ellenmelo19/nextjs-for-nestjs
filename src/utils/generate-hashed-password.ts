import { hashPassword } from '@/src/lib/login/manage-login';

(async () => {
  const minhaSenha = ''; // NÃO ESQUECER DE APAGAR SUA SENHA MANEIRA DAQUI
  const hashDaSuaSenhaEmBase64 = await hashPassword(minhaSenha);

  console.log({ hashDaSuaSenhaEmBase64 });
})();