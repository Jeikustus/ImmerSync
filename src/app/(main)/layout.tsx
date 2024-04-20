import { NavigationBar } from "./navigation";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <NavigationBar />
      <main className="h-screen bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-600">
        <div className="mx-auto h-full">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
