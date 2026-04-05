import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Admin",
  description: "Portfolio site management (draft).",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <AdminApp />
    </div>
  );
}
