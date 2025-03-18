import { useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';

const DividedList: React.FC<any> = ({ onlineUsers, onUserClick }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserClick = (user: any) => {
    setSelectedUserId(user._id);
    onUserClick(user);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
      <div>
        <List variant="outlined" sx={{ minWidth: 240, borderRadius: 'sm' }}>
          {onlineUsers.map((user: any, index: number) => (
            <div key={user._id} id={user._id} onClick={() => handleUserClick(user)}>
              {index !== 0 && <ListDivider />}
              <ListItem
                key={user._id}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: user._id === selectedUserId ? 'var(--color-1)' : 'transparent',
                  color: user._id === selectedUserId ? 'white' : 'inherit',
                  borderRadius: '5px',
                  transition: 'background 0.1s ease-in-out',
                  '&:hover': { backgroundColor: 'var(--color-4)' },
                }}
              >
                <ListItemDecorator>
                  <Avatar size="sm" src="/static/images/avatar/1.jpg" />
                </ListItemDecorator>
                <Typography>{user.email}</Typography>
              </ListItem>
            </div>
          ))}
        </List>
      </div>
    </Box>
  );
};

export default DividedList;
