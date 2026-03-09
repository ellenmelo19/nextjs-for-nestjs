# 📝 Blog com Next.js 15

Um blog simples construído com Next.js 15, TypeScript, Drizzle ORM e SQLite. Inclui sistema de autenticação, painel administrativo completo e gerenciamento de posts.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com Server Components
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM moderno e type-safe
- **SQLite** - Banco de dados leve e eficiente
- **Zod** - Validação de dados
- **TailwindCSS** - Estilização
- **Better-SQLite3** - Driver SQLite

## ✨ Funcionalidades

- ✅ Listagem pública de posts com paginação
- ✅ Visualização individual de posts
- ✅ Painel administrativo protegido
- ✅ Autenticação de usuário
- ✅ CRUD completo de posts:
  - Criar novos posts com título, conteúdo, autor e imagem de capa
  - Editar posts existentes
  - Deletar posts
  - Publicar/Despublicar posts
- ✅ Geração automática de slugs a partir do título
- ✅ Validação de dados com Zod
- ✅ Sanitização de HTML no conteúdo
- ✅ Cache otimizado com Next.js 15
- ✅ URLs amigáveis para SEO

## 📋 Pré-requisitos

- Node.js 18.17.0 ou superior
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ellenmelo19/O-blog.git
cd blog
npm install

## configure as variaveis de ambiente em .env.local

# Crie o banco SQLite
touch db.sqlite3

# Execute as migrações
npm run db:push

# Popule com dados iniciais (opcional)
npm run db:seed

npm run dev

```


<img width="1222" height="932" alt="Captura de tela de 2026-03-03 15-27-38" src="https://github.com/user-attachments/assets/5d2378f9-b813-4941-abd8-68e348d7da0d" />

# 🔐 Autenticação

O sistema usa um mecanismo simples de autenticação baseado em sessão. Para acessar o painel admin:

Acesse /admin/login
Use as credenciais configuradas 
A sessão é mantida via cookies seguros

<img width="1260" height="748" alt="Captura de tela de 2026-03-03 15-27-51" src="https://github.com/user-attachments/assets/a70256d8-542b-43c5-a51b-8698777206a2" />

# 📝 Uso do Painel Admin
 - Criar um Post
 
Acesse /admin/post/new
* Preencha os campos:
  
-Título (mín. 3, máx. 120 caracteres)

-Conteúdo (HTML suportado)

-Autor (mín. 4, máx. 100 caracteres)

-Excerto (resumo do post)

-URL da Imagem de Capa

-Publicado (checkbox para publicar imediatamente)

Clique em "Salvar"

* Editar um Post
  
-Acesse /admin/post para ver todos os posts

-Clique em "Editar" no post desejado

-Modifique os campos necessários

O slug é atualizado automaticamente se o título mudar

* Deletar um Post
  
-Na lista de posts, clique em "Deletar"

-Confirme a ação

<img width="1260" height="748" alt="image" src="https://github.com/user-attachments/assets/21450fa4-c3d5-4d68-8ed8-b53cb1db9c94" />
