export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ paddingTop: "2.5rem" }}>
      {children}
    </div>
  );
}
