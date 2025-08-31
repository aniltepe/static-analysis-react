import {useContext} from 'react';
import { Button, Snackbar, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import { AppContext } from '../contexts';

export default function Snackbars() {
    const {snackbars, removeSnackbar} = useContext(AppContext);
    const handleClose = (event, reason, id) => {
      if (reason === 'clickaway') {
        return;
      }
      removeSnackbar(id);
    };
    return (
        <>
            {snackbars.map((sb) => {
              return (
                <Snackbar
                  key={sb.id}
                  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                  open={sb.open}
                  autoHideDuration={sb.duration}
                  onClose={(e, r) => handleClose(e, r, sb.id)}
                  message={sb.msg}
                  action={(
                      <>
                          {sb.action && (
                              <Button color="secondary" size="small" 
                                  onClick={sb.action.func}
                              >                                
                                  {sb.action.text}
                              </Button>
                          )}
                          {sb.closable && <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={(e) => handleClose(e, "iconclick", sb.id)}
                          >
                            <Close fontSize="small" />
                          </IconButton>}
                      </>
                  )}
                />)
            })}
        </>
    )
}