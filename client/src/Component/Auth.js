import React, { useEffect, useState } from 'react';
import useActive from './modules/Setactive';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const axios = require('axios')


const Auth =  (prop) => {
    const [FormData, setFormData] = useState({login :"", password :"", password_confirmation :""})
    const [active, toggle] = useActive();
    const [active2, toggle2] = useActive();
    const [active3, toggle3] = useActive();
    const [token, setToken] =useState(null)
    const [username, setUsername] = useState('')
    const [profil, setProfil] = useState({})
    
    
    const {login, password, password_confirmation} = FormData

    
    useEffect(()=>{
        let hours = 1;
        let now = new Date().getTime();
        let setupTime = localStorage.getItem('setupTime');
        if (setupTime == null) {
            localStorage.setItem('setupTime', now)
        } else {
            if(now-setupTime > hours*60*60*1000) {
                localStorage.clear()
                localStorage.setItem('setupTime', now);
            }
        }

        if(localStorage.getItem('token') != null){
            setToken(localStorage.getItem('token')) 
            id_token(token)
        }

    },[token, username])

    function id_token(token){
        const config = {
            headers: {
                "token": `Bearer ${token}`
            }
        }
        axios.get("http://localhost:8080/profil" ,config)
        .then(async(res)=>{
            setProfil({
                created_at: await res.data.created_at,
                login : await res.data.login,
                username: await res.data.username
            })
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function connect(e){
        e.preventDefault();
        axios.post('http://localhost:8080/login', FormData,
            {headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept" : "application/json"
            }})
            .then((res)=> {
                if ( res.data == "complete!"){
                    NotificationManager.warning('Warning message', 'All the fields must be completed correctly', 3000);
                    return
                }

                if( res.data == "wrong login or password"){
                    NotificationManager.warning('Warning message', 'Wrong login or password', 3000);
                    return
                }
                toggle()
                NotificationManager.success('Success message', 'Welcome '+login);
                localStorage.setItem('setupTime', new Date().getTime())
                localStorage.setItem('token', res.data)
                setToken(res.data) 
                setFormData({login :"", password :"", password_confirmation :""})
            })
            .catch((err)=>{
                NotificationManager.error('Error message', 'oops you should contact Sam DEV', 5000);
            })
    }

    const register = (e) => {
        e.preventDefault();
        axios({
            method : 'POST',
            url : "http://localhost:8080/register",
            data : FormData,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept" : "application/json"
            },
        })
        .then((res)=>{
            if (res.data == "login 3+ pass 6+"){
                NotificationManager.warning('Warning message', 'Your login must be more than 3 caracteres and password must be more than 6', 3000);
                return
            }

            if (res.data == "pass and confirm must be the same"){
                NotificationManager.warning('Warning message', 'password and confirmation must be the same', 3000);
                return
            }
            toggle2();
            NotificationManager.success('Success message', 'You are registrated '+login);
            setFormData({login :"", password :"", password_confirmation :""})
        })
        .catch((err)=>{
            NotificationManager.warning('Warning message', 'Maybe the login was already taken', 3000);
        })

       
    }

    function setnewUsername  (e){
        e.preventDefault()
        axios({
            method : 'PUT',
            url : "http://localhost:8080/channel/username",
            data : {username: username},
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept" : "application/json",
                    "token": `Bearer ${token}`,
                },
        })
        .then((res)=>{
            toggle3()
            NotificationManager.success('Success message', 'New username : '+ username);
            setUsername('')
        })
        .catch((err)=>{
            NotificationManager.warning('Warning message', 'All the fields must be completed', 3000);
        })
    }

    function handleChange(e){
        setFormData({...FormData, [e.target.name] : e.target.value})
    }

    function disconnect(){
        setToken(null)
        localStorage.clear('token')
    }
    
    return (
        
        <div className="postMsg ">
            {token != null ? 
            <div className="columns">
                <div className="column box has-text-centered">
                    <p className='is-size-2 has-text-brown '> Welcome {profil.login}</p>
                    <button className="button is-info is-rounded mx-3 " onClick={toggle3}>Choose Username</button>
                    <button className="button is-danger is-rounded mx-3" onClick={disconnect}>Disconnect</button>
                    {profil.username && 
                    <p className='m-3 is-italic is-size-5'>Your username is now : <b id='username'> {profil.username} </b></p>
                    }
                </div>
            </div> : 
            <div className="columns ">
                <div className="column has-text-centered">
                    <button className="button is-info mx-6" onClick={toggle}>Log In</button>
                    <button className="button is-info mx-6" onClick={toggle2}>Register</button>
                </div>
            </div> 
            }

            <div className={"modal is-"+active3}>
                <div className="modal-background" onClick={toggle3}></div>
                    <form  className="modal-content" onSubmit={(e)=>setnewUsername(e)}>
                        <p className='my-5 is-size-1 has-text-weight-bold control has-text-white has-text-centered'>Update your username</p>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" placeholder="Pseudo" value={username} onChange={(e)=>setUsername( e.target.value)} name="username"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right">
                                <i className="fas fa-check"></i>
                                </span>
                            </p>
                            </div>
                            
                            <div className="field">
                            <p className="control has-text-centered">
                                <button type="submit" className="button is-success">
                                Submit
                                </button>
                            </p>
                        </div>
                        
                    </form>
            </div>

            <div className={"modal is-"+active}>
                <div className="modal-background" onClick={toggle}></div>
                    <form className="modal-content" onSubmit={(e)=>connect(e)}>
                        <p className='my-5 is-size-1 has-text-weight-bold control has-text-white has-text-centered'>LOGIN</p>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" placeholder="Pseudo" value={login} onChange={(e)=>handleChange(e)} name="login"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right">
                                <i className="fas fa-check"></i>
                                </span>
                            </p>
                            </div>
                            <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>handleChange(e)} name="password"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                                </span>
                            </p>
                            </div>
                            
                            <div className="field">
                            <p className="control">
                                <button type="submit" className="button is-success">
                                Login
                                </button>
                            </p>
                        </div>
                    </form>
            </div>
            
            <div className={"modal is-"+active2} >
                <div className="modal-background" onClick={toggle2}></div>
                    <form className="modal-content" onSubmit={(e)=>register(e)}>
                    <p className='my-5 is-size-1 has-text-weight-bold control has-text-white has-text-centered'>REGISTER</p>
                        <div className="field" >
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" placeholder="Pseudo" value={login} onChange={(e)=>handleChange(e)} name="login"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right">
                                <i className="fas fa-check"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>handleChange(e)} name="password"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Confirm password" value={password_confirmation} onChange={(e)=>handleChange(e)} name="password_confirmation"/>
                                <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control">
                                <button type='submit' className="button is-success" >
                                Suscribe
                                </button>
                            </p>
                        </div>
                        
                    </form>
                <button className="modal-close is-large has-text-left" aria-label="close" onClick={toggle2}></button>
            </div>
            
            
            <NotificationContainer/>
        </div>

    );
}

export default Auth;