import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/auth.service';
import Layout from './Layout';

export default function ProtectedLayout() {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}
