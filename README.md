# nextjs-for-nestjs

Aplicação web em Next.js (App Router) que consome a API do projeto `nestjs-for-nextjs`. Este app entrega a parte pública do blog e um painel admin com autenticação via sessão/JWT, usando Server Actions para operações sensíveis.

**Visão técnica**
- Renderização híbrida com Server Components e Client Components.
- Server Actions para CRUD e efeitos colaterais (ex.: revalidação de cache, redirect após login).
- Cache controlado via `revalidateTag` para listas e páginas individuais de posts.
- Upload de imagens delega para o backend (NestJS), respeitando limites de tamanho.
- Validação de dados com Zod e sanitização de HTML.

**Principais módulos**
- Admin: criação, edição, publicação e exclusão de posts.
- Auth: login/logout com cookie seguro e expiração configurável.
- Public: listagem e leitura de posts.

**Variáveis de ambiente**
Arquivo base: `.env.local-EXAMPLE`
- `API_URL`: base URL da API NestJS.
- `JWT_SECRET_KEY`: chave para assinatura/validação de sessão no frontend.
- `LOGIN_EXPIRATION_SECONDS` e `LOGIN_EXPIRATION_STRING`: expiração da sessão.
- `LOGIN_COOKIE_NAME`: nome do cookie da sessão.
- `LOGIN_USER` e `LOGIN_PASS`: credenciais do admin.
- `ALLOW_LOGIN`: habilita/desabilita login.
- `IMAGE_UPLOAD_DIRECTORY` e `IMAGE_SERVER_URL`: rota de imagens geradas pelo backend.
- `NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE`: tamanho máximo do upload.
- `SIMULATE_WAIT_IN_MS`: atraso artificial para testes.

**Scripts**
- `npm run dev` inicia o Next.js em modo desenvolvimento.
- `npm run build` gera o build de produção.
- `npm run start` inicia o servidor de produção.
- `npm run lint` executa o lint.
- `npm run migrate` aplica migrações (Drizzle).
- `npm run seed` popula o banco com dados iniciais.

**Estrutura (resumo)**
- `src/app`: rotas e páginas (App Router).
- `src/actions`: Server Actions usadas pelo frontend.
- `src/components`: componentes de UI e admin.
- `src/lib`: integrações e schemas (Zod).
- `src/utils`: helpers (API, auth, validação).

**Integração com o backend**
Este projeto pressupõe o backend `nestjs-for-nextjs` rodando localmente (por padrão em `http://localhost:3001`) e expondo endpoints de autenticação, posts, usuários e upload de imagens.
