import React, { useState, useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';


const axios = require('axios')


const PostMessages =  (prop) => {
    const [msg, setMsg] = useState('')  

    
    
    async function  Post(e){
        e.preventDefault()
        let token = localStorage.getItem('token')
        if(!prop.channel ){
            let username = document.getElementById('username').innerText;
            NotificationManager.error('', username + " --- You need to choose a channel", 5000, () => { });
            return;
        }
        
        await axios({
            url : "/channel/msg",
            method : 'post',
            baseURL: "http://localhost:8080",
            data : {
                content: msg, 
                id_disc: prop.channel
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Accept" : "application/json",
                "token" : "Bearer " + token,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((res)=>{
            setMsg('')
            prop.refresh(Math.random())
        })
        .catch((err)=>{
            setMsg('')
            NotificationManager.error('', 'You need to log and put an username to chat', 5000, () => { });
        })
    }

    function handleChange(e){
        setMsg(e.target.value)
    }

    return (
        <div className="postMsg">
            <form action="" method="post">
            <div className="field is-grouped">
                <p className="control is-expanded">
                    <input className="input is-rounded" value={msg} type="text" placeholder="Tape your message here ..." onChange={(e)=> handleChange(e)}/>
                </p>
                <p className="control">
                    <button  className="button is-info is-rounded is-outlined" onClick={(e)=>(Post(e))}> Send </button>
                </p>
            <NotificationContainer/>
            </div>
            </form>

        </div>

    );
}

export default PostMessages;