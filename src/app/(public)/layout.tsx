import { Header } from "@/components/global/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
    </>
  );
}
