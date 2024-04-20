type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <main className="h-screen ">
        <div className="mx-auto h-full">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
