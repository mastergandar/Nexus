
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <Sidebar />
      <Header />
      <main className="ml-16 lg:ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
