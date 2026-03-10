import { MenuAdmin } from '@/src/components/admin/MenuAdmin';
import { requireLoginSessionForApiOrRedirect} from '@/src/lib/login/manage-login';


type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPostLayout({
  children,
}: Readonly<AdminPostLayoutProps>) {
  await requireLoginSessionForApiOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}