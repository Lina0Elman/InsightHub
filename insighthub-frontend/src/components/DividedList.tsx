import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';

const DividedList: React.FC<any> = ({ onlineUsers }) => {
  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}
    >
          <div>
            <List variant="outlined" sx={{ minWidth: 240, borderRadius: 'sm' }}>
            {onlineUsers.map((user: any, index: any) => {
                return (
                    <div key={user._id}>
                        {(index !== 0 && <ListDivider />)}
                        <ListItem>
                        <ListItemDecorator>
                            <Avatar size="sm" src="/static/images/avatar/1.jpg" />
                        </ListItemDecorator>
                            {user.email}
                        </ListItem>
                    </div>
              )
            })}
            </List>
          </div>
    </Box>
  );
}

export default DividedList;