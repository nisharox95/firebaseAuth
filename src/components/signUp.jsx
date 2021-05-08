import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Edit from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './modal';
import { db } from '../firebase';
import { store } from '../firebase';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
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

export default function SignUp() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [phNumber, setPhNumber] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  const { signUp, loggedIn } = useAuth()

  const handleUpload = async() => {
    const pic = store.ref()
    const fileRef = pic.child(image.name)
    await fileRef.put(image)
    setUrl(await fileRef.getDownloadURL())
}

  async function handleSubmit(e) {
    e.preventDefault()
    try{
      setError('')
      setLoading(true)
      const resp = await signUp(email, password)
      await handleUpload();
      if (resp.user.uid) {
        const user = {
            uid: resp.user.uid,
            firstName: firstName,
            lastName: lastName,
            age: age,
            phNumber: phNumber,
            address: address,
            email: email,
            avatar: url,
        }
        try{
          await db.collection("user").doc(resp.user.uid).set(user)
          await loggedIn(resp.user.uid);
        }
        catch(err) {
          setError('Error writing document')
        }
        history.push('/dashboard')
      }
    }
    catch(err){
      setError('Failed to sign Up')
    }
    setLoading(false)
  };

  const handleCancel = () => {
    setImage('')
    setUrl('')
    setOpen(false)
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

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
      <Modal handleChange={handleChange} url={url} handleCancel={handleCancel} open={open} setOpen={setOpen}/>
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
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
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
            Sign Up
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}