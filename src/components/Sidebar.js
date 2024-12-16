import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                    marginTop: '64px', // Push Sidebar below the Header
                    height: 'calc(100vh - 64px)', // Sidebar height matches the remaining viewport height
                },
            }}
        >
            <List>
                <ListItem button onClick={() => navigate('/')}>
                    <ListItemIcon>
                        <HomeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => navigate('/pr-management')}>
                    <ListItemIcon>
                        <GitHubIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Pull Requests" />
                </ListItem>
                <ListItem button onClick={() => navigate('/repo-insights')}>
                    <ListItemIcon>
                        <InsightsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Insights" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
