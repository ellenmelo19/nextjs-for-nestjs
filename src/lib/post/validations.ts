import { isUrlOrRelativePath } from '@/src/utils/is-url-or-relative-path';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter, no mínimo, 3 caracteres')
    .max(120, 'Título deve ter um máximo de 120 caracteres'),
  content: z
    .string()
    .trim()
    .min(3, 'Conteúdo é obrigatório')
    .transform(val => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(4, 'Autor precisa de um mínimo de 4 caracteres')
    .max(100, 'Nome do autor não deve ter mais que 100 caracteres'),
  excerpt: z
    .string()
    .trim()
    .min(3, 'Excerto precisa de um mínimo de 3 caracteres')
    .max(200, 'Excerto não deve ter mais que 200 caracteres'),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: 'URL da capa deve ser uma URL ou caminho para imagem',
  }),
  published: z
    .preprocess(
      (val) => {
        // Se o valor não existe no FormData, é false
        if (val === undefined || val === null) return false;
        // Se veio do FormData como string, converte
        if (val === 'on') return true;
        if (val === 'true') return true;
        if (val === 'false') return false;
        return Boolean(val);
      },
      z.boolean()
    )
    .default(false),
});

export const PostCreateSchema = PostBaseSchema;
export const PostUpdateSchema = PostBaseSchema;