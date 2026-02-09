import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [message, setMessage] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (candidateId) => {
        setVoting(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/vote',
                { candidateId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Vote cast successfully! Tx: ' + response.data.transactionHash.substring(0, 10) + '...' });
            // Ideally refresh candidates to see new count, although Dashboard might not show counts to prevent bias? 
            // User requirements said "Voting Page Displays list of candidates". "Results Page Displays aggregated vote counts".
            // So we shouldn't show counts here maybe? But for prototype let's just toggle state.

            // Update local storage user state roughly
            const updatedUser = { ...user, hasVoted: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Voting failed' });
        } finally {
            setVoting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading election data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-4">
                    Cast Your Vote
                </h1>
                <p className="text-gray-400 text-lg">
                    Select a candidate below. Your vote is recorded securely on the blockchain.
                </p>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/50 text-green-200'
                        : 'bg-red-500/10 border border-red-500/50 text-red-200'
                        }`}
                >
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <motion.div
                        key={candidate.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all shadow-xl"
                    >
                        <div className="h-40 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl mb-6 flex items-center justify-center">
                            <span className="text-4xl font-bold text-indigo-500/50">#{candidate.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{candidate.name}</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Vote for {candidate.name} to see a better future.
                        </p>
                        <button
                            onClick={() => handleVote(candidate.id)}
                            disabled={voting || user.hasVoted}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${user.hasVoted
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {voting ? 'Processing...' : user.hasVoted ? 'Voted' : 'Vote Now'}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
