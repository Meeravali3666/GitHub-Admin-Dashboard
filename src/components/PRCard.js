import React from 'react';
import { Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';

const PRCard = ({ title, author, state, createdAt, comments, url, onCommentClick }) => {
    const getChipColor = () => {
        switch (state) {
            case 'open':
                return 'success';
            case 'closed':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card>
                <CardContent>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2">
                        <strong>Author:</strong> {author}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Status:</strong>{' '}
                        <Chip label={state.toUpperCase()} color={getChipColor()} />
                    </Typography>
                    <Typography variant="body2">
                        <strong>Created At:</strong>{' '}
                        {new Date(createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Comments:</strong> {comments}
                    </Typography>
                    <Button href={url} target="_blank" variant="contained" sx={{ mt: 2 }}>
                        View PR
                    </Button>
                    <Button
                        onClick={onCommentClick}
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 2, ml: 2 }}
                    >
                        Add Comment
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PRCard;
