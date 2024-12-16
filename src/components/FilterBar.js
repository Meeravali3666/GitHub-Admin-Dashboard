import React from 'react';
import { Grid, Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';

const FilterBar = ({ filters, onFilterChange }) => {
    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={filters.status}
                        onChange={onFilterChange}
                        multiple
                    >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    name="author"
                    label="Author"
                    value={filters.author}
                    onChange={onFilterChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    name="date"
                    label="Creation Date"
                    type="date"
                    value={filters.date}
                    onChange={onFilterChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
        </Grid>
    );
};

export default FilterBar;
