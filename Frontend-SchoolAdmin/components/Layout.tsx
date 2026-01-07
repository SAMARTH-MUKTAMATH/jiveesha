import React from 'react';
import Header from './Header';
import { View } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentView: View;
    onNavigate: (view: View) => void;
    onLogout?: () => void;
    user?: any;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout, user }) => {
    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:bg-background-dark font-display text-[#111318] dark:text-white transition-colors duration-200 min-h-screen flex flex-col">
            <Header currentView={currentView} onNavigate={onNavigate} onLogout={onLogout} user={user} />
            <main className="layout-container flex flex-col w-full max-w-[1440px] mx-auto px-4 lg:px-10 py-8 grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;
