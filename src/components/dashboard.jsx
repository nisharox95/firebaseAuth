import React, {useState} from 'react';
import {Grid, Button, Avatar, Container, Paper, Badge, Typography, TextField, Snackbar} from '@material-ui/core';
import Modal from './modal';
import { Alert } from '@material-ui/lab';
import Edit from '@material-ui/icons/Edit';
import {useAuth} from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { store } from '../firebase';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
  }));

export default function Dashboard() {
    const classes = useStyles();
    const { currentUser, logOut, update, loggedIn } = useAuth()

    const uid = currentUser.uid
    const [firstName, setFirstName] = useState(currentUser.firstName)
    const [lastName, setLastName] = useState(currentUser.lastName)
    const [age, setAge] = useState(currentUser.age);
    const [phNumber, setPhNumber] = useState(currentUser.phNumber)
    const [address, setAddress] = useState(currentUser.address)
    const [image, setImage] = useState()
    const [url, setUrl] = useState(currentUser.avatar)
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const signout = async() => {
        history.push('/')
        await logOut()
    }

    const handleUpload = async() => {
        const pic = store.ref()
        const fileRef = pic.child(image.name)
        await fileRef.put(image)
        setUrl(await fileRef.getDownloadURL())
    }

    const handleEdit = async(e) => {
        e.preventDefault()
        try{
        setError('')
            if(url!==currentUser.avatar)
            await handleUpload();
        const user = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            phNumber: phNumber,
            address: address,
            avatar: url,
        }
        try{      
            try {
            await update(uid, user)
            await loggedIn(uid);
            }
            catch(err){
                setError('Error')
            }
        }
        catch{
            setError('Failed to Edit Details')
        }
        setLoading(false)
        setOpenAlert(true)
        history.push('/dashboard')
    }
    catch(err){
        setError('Failed to Edit Details')
    }
    }

    const handleChange = (e) => {
        const pic = e.target.files[0]
        setImage(pic)
        const reader = new FileReader();
        reader.readAsDataURL(pic);
        reader.onload = () => {
            setUrl(reader.result);
        };
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenAlert(false);
    }

    return (
        <Container component="main" maxWidth="xs">
        <Snackbar   
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={openAlert} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                Successfullly Updated
            </Alert>
        </Snackbar>
        <Modal handleChange={handleChange} handleUpload={handleUpload} url={url} open={open} setOpen={setOpen}/>
        <Paper spacing={2} className={classes.paper}>
            <Badge
            overlap="circle"
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            onClick={()=> setOpen(true)}
            badgeContent={<Edit/>}
            >
            <Avatar style={{width: 60, height: 60}} src={url} />
            </Badge>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography>
            {error && 
            <Alert severity='error'>
                {error}
            </Alert>
            }
            <form className={classes.form} onSubmit={handleEdit} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={(e)=> setFirstName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    value={lastName}
                    onChange={(e)=> setLastName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    autoComplete="age"
                    name="age"
                    variant="outlined"
                    fullWidth
                    id="age"
                    label="Age"
                    value={age}
                    onChange={(e)=> setAge(e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    autoComplete="number"
                    value={phNumber}
                    onChange={(e)=> setPhNumber(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    value={address}
                    onChange={(e)=> setAddress(e.target.value)}
                />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
            >
                Edit Details
            </Button>
            <Grid container justify="center">
                <Button
                type="submit"
                fullWidth
                color="primary"
                onClick={() => signout()}
                >
                Logout
                </Button>
            </Grid>
            </form>
        {/* </div> */}
        </Paper>
        </Container>
    )
}