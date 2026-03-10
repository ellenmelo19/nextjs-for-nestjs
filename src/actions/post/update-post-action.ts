'use server';

import { getLoginSessionForApi } from '@/src/lib/login/manage-login';
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
  UpdatePostForApiSchema,
} from '@/src/lib/post/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/src/utils/get-zod-error-messages';
import { makeRandomString } from '@/src/utils/make-random-string';
import { revalidateTag } from 'next/cache';

type UpdatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

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
  const zodParsedObj = UpdatePostForApiSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: ['Faça login em outra aba antes de salvar.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return {
      errors,
      formState: PublicPostForApiSchema.parse(formDataToObj),
    };
  }

  const newPost = zodParsedObj.data;

  const updatePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(newPost),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!updatePostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObj),
      errors: updatePostResponse.errors,
    };
  }

  const post = updatePostResponse.data;

  revalidateTag('posts', { expire: 0 });
  revalidateTag(`post-${post.slug}`, { expire: 0 });

  return {
    formState: PublicPostForApiSchema.parse(post),
    errors: [],
    success: makeRandomString(),
  };
}
