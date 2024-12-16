import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { fetchRepoInsights, fetchContributors } from '../services/githubApi';

const RepoInsights = () => {
    const [insights, setInsights] = useState({});
    const [contributors, setContributors] = useState([]);
    const [chartData, setChartData] = useState({ pr: null, issues: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const owner = 'facebook'; // Replace with your repository owner
                const repo = 'react';    // Replace with your repository name

                // Fetch Repo Insights
                const repoData = await fetchRepoInsights(owner, repo);
                setInsights(repoData);

                // Fetch Contributors
                const contributorData = await fetchContributors(owner, repo);
                setContributors(contributorData);

                // Generate Chart Data
                const prData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Pull Requests',
                            data: repoData.pull_requests_activity || Array(12).fill(0),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                };
                const issueData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Issues',
                            data: repoData.issues_activity || Array(12).fill(0),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        },
                    ],
                };
                setChartData({ pr: prData, issues: issueData });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Export Data as CSV
    const exportToCSV = () => {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Stars', insights.stargazers_count],
            ['Forks', insights.forks_count],
            ['Open Issues', insights.open_issues_count],
            ['Pull Requests', insights.pull_requests_count || 'N/A'],
            ['Contributors', contributors.length],
        ];

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'repository_insights.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Repository Insights
            </Typography>

            {/* Metrics */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box>
                    <Typography variant="h6">Metrics</Typography>
                    <Typography variant="body2">
                        <strong>Stars:</strong> {insights.stargazers_count || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Forks:</strong> {insights.forks_count || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Open Issues:</strong> {insights.open_issues_count || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Pull Requests:</strong> {insights.pull_requests_count || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Contributors:</strong> {contributors.length || 0}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToCSV}
                    sx={{ marginTop: '10px' }}
                >
                    Export Data
                </Button>
            </motion.div>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Pull Request Activity</Typography>
                                {chartData.pr && <Bar data={chartData.pr} />}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Issues Activity</Typography>
                                {chartData.issues && <Bar data={chartData.issues} />}
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RepoInsights;
