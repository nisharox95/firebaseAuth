import React, {useState} from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from '@material-ui/core'

export function Modal(props){

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

export function EditModal(props){

    const [open, setOpen] = useState(false)

    return(
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Edit Details
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText>
            {props.content}
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    )
}