'use server';

import { deleteLoginSession } from '@/src/lib/login/manage-login';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await deleteLoginSession();
  redirect('/');
}