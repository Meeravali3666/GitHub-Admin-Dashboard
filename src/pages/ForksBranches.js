import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import { fetchForks, fetchBranches, deleteBranch } from '../services/githubApi';

const ForksBranches = () => {
    const [forks, setForks] = useState([]);
    const [branches, setBranches] = useState([]);
    const [analytics, setAnalytics] = useState({ totalForks: 0, totalBranches: 0, topFork: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const owner = 'facebook'; // Replace with your repository owner
                const repo = 'react';    // Replace with your repository name

                // Fetch Forks
                const forkData = await fetchForks(owner, repo);
                setForks(forkData);

                // Fetch Branches
                const branchData = await fetchBranches(owner, repo);
                setBranches(branchData);

                // Set Analytics
                const mostStarredFork = forkData.reduce((max, fork) => (fork.stargazers_count > max.stargazers_count ? fork : max), forkData[0]);
                setAnalytics({
                    totalForks: forkData.length,
                    totalBranches: branchData.length,
                    topFork: mostStarredFork,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Handle Branch Deletion
    const handleDeleteBranch = async (branchName) => {
        if (!window.confirm(`Are you sure you want to delete the branch "${branchName}"?`)) return;

        try {
            const owner = 'facebook'; // Replace with your repository owner
            const repo = 'react';    // Replace with your repository name
            await deleteBranch(owner, repo, branchName);
            alert(`Branch "${branchName}" deleted successfully!`);
            setBranches((prev) => prev.filter((branch) => branch.name !== branchName));
        } catch (error) {
            console.error('Error deleting branch:', error);
            alert('Failed to delete branch.');
        }
    };

    const exportToCSV = (data, type) => {
        const headers = type === 'forks'
            ? ['Owner', 'Stars', 'Created At', 'URL']
            : ['Name', 'Last Commit SHA'];

        const rows = data.map((item) =>
            type === 'forks'
                ? [item.owner.login, item.stargazers_count, item.created_at, item.html_url]
                : [item.name, item.commit.sha]
        );

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${type}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Forks & Branches Management
            </Typography>

            {/* Export Options */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h6">Export Options</Typography>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => exportToCSV(forks, 'forks')}
                        sx={{ marginRight: '10px' }}
                    >
                        Export Forks
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => exportToCSV(branches, 'branches')}
                    >
                        Export Branches
                    </Button>
                </Box>
            </Box>

            {/* Forks */}
            <Typography variant="h5" gutterBottom>
                Forks
            </Typography>
            <Grid container spacing={3}>
                {forks.map((fork) => (
                    <Grid item xs={12} sm={6} md={4} key={fork.id}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '15px',
                            }}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{fork.owner.login}</Typography>
                                    <Typography variant="body2">
                                        <strong>Created At:</strong>{' '}
                                        {new Date(fork.created_at).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Stars:</strong> {fork.stargazers_count}
                                    </Typography>
                                    <Button
                                        href={fork.html_url}
                                        target="_blank"
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '10px' }}
                                    >
                                        View Fork
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Branches */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                Branches
            </Typography>
            <Grid container spacing={3}>
                {branches.map((branch) => (
                    <Grid item xs={12} sm={6} md={4} key={branch.name}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '15px',
                            }}
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{branch.name}</Typography>
                                    <Typography variant="body2">
                                        <strong>Last Commit:</strong> {branch.commit.sha.slice(0, 7)}
                                    </Typography>
                                    <Button
                                        onClick={() => handleDeleteBranch(branch.name)}
                                        variant="outlined"
                                        color="secondary"
                                        style={{ marginTop: '10px' }}
                                    >
                                        Delete Branch
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ForksBranches;
