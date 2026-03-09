'use server';

import { makePartialPublicPost, makePublicPostFromDb, PublicPost } from '@/src/dto/post/dto';
import { verifyLoginSession } from '@/src/lib/login/manage-login';
import { PostCreateSchema } from '@/src/lib/post/validations';
import { PostModel } from '@/src/models/post/post-model';
import { postRepository } from '@/src/repositories/post';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-messages';
import { makeSlugFromText } from '@/src/utils/make-slug-from-text';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';

type CreatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  console.log('=== INÍCIO DO CREATE POST ACTION ===');
  console.log('FormData entries:', Object.fromEntries(formData.entries()));

  const isAuthenticated = await verifyLoginSession();
  console.log('isAuthenticated:', isAuthenticated);

  if (!(formData instanceof FormData)) {
    console.log('Erro: formData não é instância de FormData');
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  console.log('formDataToObj:', formDataToObj);
  
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);
  console.log('zodParsedObj.success:', zodParsedObj.success);
  
  if (!zodParsedObj.success) {
    console.log('Erros do zod:', zodParsedObj.error);
  }

  if (!isAuthenticated) {
    console.log('Usuário não autenticado');
    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Faça login em outra aba antes de salvar.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    console.log('Erros de validação:', errors);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
    };
  }

  const validPostData = zodParsedObj.data;
  console.log('Dados válidos:', validPostData);
  
  const now = new Date().toISOString();
  const slug = makeSlugFromText(validPostData.title);
  console.log('Slug gerado:', slug);
  
  const newPost: PostModel = {
    ...validPostData,
    createdAt: now,
    updatedAt: now,
    id: uuidV4(),
    slug,
  };
  
  console.log('Novo post a ser inserido:', newPost);

  try {
    console.log('Tentando inserir no repositório...');
    await postRepository.create(newPost);
    console.log('Post inserido com sucesso!');
  } catch (e: unknown) {
    console.log('Erro ao inserir:', e);
    if (e instanceof Error) {
      return {
        formState: makePublicPostFromDb(newPost),
        errors: [e.message],
      };
    }

    return {
      formState: makePublicPostFromDb(newPost),
      errors: ['Erro desconhecido'],
    };
  }

  console.log('Fazendo revalidateTag...');
  revalidateTag('posts', 'default');
  revalidateTag(`post-${newPost.slug}`, 'default');
  
  console.log('Redirecionando para:', `/admin/post/${newPost.id}?created=1`);
  redirect(`/admin/post/${newPost.id}?created=1`);
}