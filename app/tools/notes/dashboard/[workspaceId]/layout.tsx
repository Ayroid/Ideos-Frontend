import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="dark:boder-Neutrals-12/70 relative w-full overflow-scroll border-l-[1px]">
        {children}
      </div>
    </main>
  );
};

export default Layout;
