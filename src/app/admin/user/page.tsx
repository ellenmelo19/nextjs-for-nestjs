import { UpdateUserForm } from '@/src/components/admin/UpdateUserForm';
import { SpinLoader } from '@/src/components/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Admin',
};

export default async function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdateUserForm />
    </Suspense>
  );
}