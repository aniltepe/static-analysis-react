import { styled } from '@mui/material/styles';
import { Redo, Undo } from '@mui/icons-material';
import { IconButton, Switch, Stack, Typography } from '@mui/material';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#1890ff',
          ...theme.applyStyles('dark', {
            backgroundColor: '#177ddc',
          }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
      ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255,255,255,.35)',
      }),
    },
}));

export default function ToolBar(props) {
    return (
        <div style={{
            display: "flex", 
            flexFlow: "row",
            backgroundColor: "#f4f4f4",
            width: "100dvw",
            height: "30px",
            borderBottom: "1px solid #dddddd", 
            boxSizing: "border-box"
        }}> 
            <IconButton sx={{paddingLeft: "3px", paddingRight: "3px"}} disabled={props.undoList.length === 0}>
                <Undo />
            </IconButton>
            <IconButton sx={{paddingLeft: "3px", paddingRight: "3px"}} disabled={props.redoList.length === 0}>
                <Redo />
            </IconButton>
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center',
                    justifyContent: "end",
                    flexGrow: 1,
                    marginRight: "10px" 
                }}
            >
                <Typography sx={{marginRight: "5px"}} fontSize={13}>
                    Auto-Save
                </Typography>
                <AntSwitch />
                <Typography sx={{marginLeft: "30px"}} fontSize={13}>
                    Last saved 23 mins ago
                </Typography>
            </Stack>
        </div>
    )
}