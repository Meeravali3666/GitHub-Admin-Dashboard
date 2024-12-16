import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Select,
    MenuItem,
    TextField,
    Pagination,
    Chip,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { fetchPaginatedPullRequests, fetchDiscussions, postComment, calculateMetrics } from '../services/githubApi';

const PRManagement = () => {
    const [pullRequests, setPullRequests] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [filters, setFilters] = useState({ status: [], author: '', date: null });
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Pull Requests and Discussions
    useEffect(() => {
        const fetchPRsAndDiscussions = async () => {
            try {
                const owner = 'facebook'; // Replace with your repository owner
                const repo = 'react';    // Replace with your repository name

                // Fetch Pull Requests
                const params = { state: filters.status.join(',') || undefined };
                const prData = await fetchPaginatedPullRequests(owner, repo, params, page);
                setPullRequests(prData);
                setMetrics(calculateMetrics(prData));
                setTotalPages(5); // Dynamically set based on API response headers if available

                // Fetch Discussions
                const discussionsData = await fetchDiscussions(owner, repo);
                setDiscussions(discussionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPRsAndDiscussions();

        // Poll for real-time updates every 30 seconds
        const intervalId = setInterval(fetchPRsAndDiscussions, 30000);

        return () => clearInterval(intervalId);
    }, [filters, page, sortBy]);

    // Handle Filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Handle Sorting
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // Sort Pull Requests
    const sortPRs = (prs) => {
        switch (sortBy) {
            case 'date-asc':
                return prs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'date-desc':
                return prs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'author':
                return prs.sort((a, b) => a.user.login.localeCompare(b.user.login));
            case 'status':
                return prs.sort((a, b) => a.state.localeCompare(b.state));
            default:
                return prs;
        }
    };

    // Handle Pagination
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Handle Adding Comments
    const handleComment = async (prId) => {
        const comment = prompt('Enter your comment:');
        if (!comment) return;

        try {
            const owner = 'facebook'; // Replace with your repository owner
            const repo = 'react';    // Replace with your repository name
            await postComment(owner, repo, prId, comment);
            alert('Comment posted successfully!');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment.');
        }
    };

    // Export Data to CSV
    const exportToCSV = (data) => {
        const headers = ['ID', 'Title', 'Author', 'State', 'Created At', 'Closed At'];
        const rows = data.map((pr) => [
            pr.id,
            pr.title,
            pr.user.login,
            pr.state,
            pr.created_at,
            pr.closed_at || 'N/A',
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'pull_requests.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Pull Request Management
            </Typography>

            {/* Analytics and Export Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                }}
            >
                <Box>
                    <Typography variant="h6">Analytics</Typography>
                    <Typography variant="body2">
                        <strong>Total PRs:</strong> {metrics.totalPRs || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Open PRs:</strong> {metrics.openPRs || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Closed PRs:</strong> {metrics.closedPRs || 0}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Average Time to Close:</strong> {metrics.avgCloseTime || 0} days
                    </Typography>
                    <Typography variant="body2">
                        <strong>Top Contributors:</strong>{' '}
                        {metrics.mostActiveContributors
                            ?.map((contributor) => `${contributor.name} (${contributor.count})`)
                            .join(', ') || 'N/A'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => exportToCSV(pullRequests)}
                >
                    Export Data
                </Button>
            </Box>

            {/* Filters */}
            <Box
                sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                multiple
                                value={filters.status}
                                onChange={handleFilterChange}
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </div>
                                )}
                            >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="closed">Closed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            name="author"
                            label="Author"
                            value={filters.author}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Creation Date"
                            value={filters.date}
                            onChange={(date) =>
                                setFilters((prevFilters) => ({ ...prevFilters, date }))
                            }
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortBy} onChange={handleSortChange}>
                                <MenuItem value="date-asc">Date (Ascending)</MenuItem>
                                <MenuItem value="date-desc">Date (Descending)</MenuItem>
                                <MenuItem value="author">Author Name</MenuItem>
                                <MenuItem value="status">Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* PR List */}
            <Grid container spacing={3}>
                {pullRequests.map((pr) => (
                    <Grid item xs={12} sm={6} md={4} key={pr.id}>
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
                                    <Typography variant="h6">{pr.title}</Typography>
                                    <Typography variant="body2">
                                        <strong>Author:</strong> {pr.user.login}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong>{' '}
                                        <Chip
                                            label={pr.state.toUpperCase()}
                                            color={pr.state === 'open' ? 'success' : 'error'}
                                        />
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Created At:</strong>{' '}
                                        {new Date(pr.created_at).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Comments:</strong> {pr.comments} comments
                                    </Typography>
                                    <Button
                                        href={`${pr.html_url}#issuecomment`}
                                        target="_blank"
                                        variant="outlined"
                                        style={{ marginTop: '10px' }}
                                    >
                                        View Comments
                                    </Button>
                                    <Button
                                        onClick={() => handleComment(pr.number)}
                                        variant="outlined"
                                        style={{ marginTop: '10px', marginLeft: '10px' }}
                                    >
                                        Add Comment
                                    </Button>
                                    <Button
                                        href={pr.html_url}
                                        target="_blank"
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '10px', marginLeft: '10px' }}
                                    >
                                        View PR
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />
        </Box>
    );
};

export default PRManagement;
