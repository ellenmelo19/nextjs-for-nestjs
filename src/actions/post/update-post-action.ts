'use server';

import {
  makePartialPublicPost,
  makePublicPostFromDb,
  PublicPost,
} from '@/src/dto/post/dto';
import { verifyLoginSession } from '@/src/lib/login/manage-login';
import { PostUpdateSchema } from '@/src/lib/post/validations';
import { postRepository } from '@/src/repositories/post';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-messages';
import { makeRandomString } from '@/src/utils/make-random-string';
import { makeSlugFromText } from '@/src/utils/make-slug-from-text';
import { revalidateTag } from 'next/cache';

type UpdatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['ID inválido'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Faça login em outra aba antes de salvar.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
    };
  }

  const validPostData = zodParsedObj.data;
  
  // Buscar o post atual para pegar o título antigo
  let oldPost;
  try {
    oldPost = await postRepository.findById(id);
  } catch  {
    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Post não encontrado'],
    };
  }
  
  // Gerar novo slug apenas se o título mudou
  const slug = validPostData.title !== oldPost.title 
    ? makeSlugFromText(validPostData.title)
    : oldPost.slug;

  const updatedAt = new Date().toISOString();
  
  const newPost = {
    ...validPostData,
    slug,
    updatedAt,
  };

  try {
    const post = await postRepository.update(id, newPost);
    
    // Corrigido: revalidateTag sem o segundo argumento
    revalidateTag('posts', 'default');
    revalidateTag(`post-${post.slug}`, 'default');
    
    return {
      formState: makePublicPostFromDb(post),
      errors: [],
      success: makeRandomString(),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicPost(formDataToObj),
        errors: [e.message],
      };
    }

    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Erro desconhecido'],
    };
  }
}