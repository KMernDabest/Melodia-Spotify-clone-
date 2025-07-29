import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sampleAccounts, setSampleAccounts] = useState([]);
    
    const { login } = useAuth();

    useEffect(() => {
        // Remove fetching sample accounts
        // const fetchSampleAccounts = async () => {
        //     const accounts = await getSampleAccounts();
        //     setSampleAccounts(accounts);
        // };
        // fetchSampleAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        }
        
        setIsLoading(false);
    };

    // Remove fillSampleAccount and sample accounts display

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <img src={logo} alt="Spotify Admin" className="h-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800">
                        Admin Panel
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Sign in to manage your music library
                    </p>
                </div>

                {/* Sample Admin Account Info */}
                {/* Removed sample admin accounts display */}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter admin email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing In...
                            </div>
                        ) : (
                            'Sign In to Admin Panel'
                        )}
                    </button>
                </form>

                {/* Admin Notice */}
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm text-center">
                        ⚠️ This panel is restricted to admin users only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 