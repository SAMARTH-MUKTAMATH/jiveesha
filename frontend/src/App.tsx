import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import authService from './services/auth.service';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Parent Dashboard</h1>
                    <p className="text-gray-600 mb-6">Dashboard will be built in next prompt.</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Logged in as: <span className="font-medium">{authService.getCurrentUser()?.email}</span>
                    </p>
                    <button
                      onClick={() => authService.logout()}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
