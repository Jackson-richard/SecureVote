import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Results = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
        const interval = setInterval(fetchResults, 5000); // Polling for real-time updates
        return () => clearInterval(interval);
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading results...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 mb-4">
                    Live Results
                </h1>
                <p className="text-gray-400 text-lg">
                    Real-time aggregated data from the blockchain.
                </p>
            </div>

            <div className="space-y-6">
                {candidates.map((candidate, index) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((candidate.voteCount / totalVotes) * 100);

                    return (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6"
                        >
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                                    <span className="text-sm text-gray-500">Candidate #{candidate.id}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{candidate.voteCount}</span>
                                    <span className="text-gray-400 text-sm ml-1">votes</span>
                                </div>
                            </div>

                            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                                />
                            </div>
                            <div className="text-right mt-1 text-xs text-gray-500">{percentage}%</div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Results;
