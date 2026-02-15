import { ChangePasswordForm } from "@/components/features/auth/change-password-form";
import { PageHeader } from "@/components/layouts/page-header";

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security" />

      <div className="flex justify-center pt-10">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
