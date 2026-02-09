import { Link, useNavigate } from 'react-router-dom';
import { Vote, BarChart2, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Vote className="h-8 w-8 text-indigo-500" />
                            <span className="text-xl font-bold text-white tracking-tight">SecureVote</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/results" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <BarChart2 className="w-4 h-4" />
                            Results
                        </Link>
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
