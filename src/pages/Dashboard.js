import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    fetchRepoDetails,
    fetchPullRequests,
    fetchBranches,
    fetchForks,
    fetchContributors,
} from '../services/githubApi';

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);



const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [repoData, setRepoData] = useState({});
    const [pullRequests, setPullRequests] = useState([]);
    const [branches, setBranches] = useState([]);
    const [forks, setForks] = useState([]);
    const [contributors, setContributors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const owner = 'facebook'; // Replace with your repository owner
                const repo = 'react';    // Replace with your repository name

                const repoDetails = await fetchRepoDetails(owner, repo);
                const prData = await fetchPullRequests(owner, repo);
                const branchData = await fetchBranches(owner, repo);
                const forkData = await fetchForks(owner, repo);
                const contributorData = await fetchContributors(owner, repo);

                setRepoData(repoDetails);
                setPullRequests(prData);
                setBranches(branchData);
                setForks(forkData);
                setContributors(contributorData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    const prChartData = {
        labels: ['Open', 'Closed', 'In-Process'],
        datasets: [
            {
                label: 'PRs',
                data: [
                    pullRequests.filter((pr) => pr.state === 'open').length,
                    pullRequests.filter((pr) => pr.state === 'closed').length,
                    pullRequests.filter((pr) => pr.state === 'in-progress').length,
                ],
                backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
            },
        ],
    };

    const contributorChartData = {
        labels: contributors.map((contributor) => contributor.login),
        datasets: [
            {
                label: 'Commits',
                data: contributors.map((contributor) => contributor.contributions),
                backgroundColor: '#3f51b5',
                borderColor: '#3f51b5',
                tension: 0.4,
            },
        ],
    };

    return (
        <Grid container spacing={3}>
            {/* Key Metrics Cards */}
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total PRs</Typography>
                        <Typography variant="h4">{pullRequests.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Forks</Typography>
                        <Typography variant="h4">{repoData.forks_count}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Active Branches</Typography>
                        <Typography variant="h4">{branches.length}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Stars</Typography>
                        <Typography variant="h4">{repoData.stargazers_count}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Watchers</Typography>
                        <Typography variant="h4">{repoData.watchers_count}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Latest Commit Date</Typography>
                        <Typography variant="h4">{new Date(repoData.pushed_at).toLocaleDateString()}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Charts Section */}
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Pull Request Trends</Typography>
                        <Bar data={prChartData} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Contributor Activity</Typography>
                        <Line data={contributorChartData} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
