import { GuestLayout } from "@/components/layouts/GuestLayout";

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}
