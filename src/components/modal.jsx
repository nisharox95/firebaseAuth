import React from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from '@material-ui/core'

export default function Modal(props){

    return(
    <Dialog 
        style={{padding: '15px', width: '100%'}}
        open={props.open}
        onClose={() => props.setOpen(false)}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Edit Profile Pic
        </DialogTitle>
        <DialogContent>
            <input type="file" onChange={props.handleChange} color="primary" />
            <img style={{width: '60%'}} src ={props.url} alt="" />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={props.handleCancel} color="primary">
            Cancel
          </Button>
          <Button variant='outlined' onClick={() => props.setOpen(false)} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    )
}