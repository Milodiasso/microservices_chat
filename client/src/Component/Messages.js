import React, { useState, useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import useActive from './modules/Setactive';


const axios = require('axios')


const Messages =  (prop) => {
    const [idChannel, setIdChannel] = useState(null)
    const [msg, setMsg] = useState([])
    const [modifiedMsg, setmodifiedMsg] = useState('')
    const [active, toggle] = useActive()
    let token = localStorage.getItem('token')
    const [hide, setHide] =useState('is-hidden')

    
    useEffect(()=>{
        if (prop.channel != null){
            setIdChannel(prop.channel);
        } 
    },[prop.channel])

    
    useEffect( ()=>{
        if (idChannel != null) {
            axios.get('http://localhost:8080/channel/name/'+idChannel)
            .then(  function (response) {
                // handle success
                setMsg(  response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        }
    },[idChannel, prop.refresh])

    function delete_msg(e){
        if( token != null){
            axios({
                method : 'DELETE',
                url : "http://localhost:8080/channel/delete_msg",
                data : {id_msg: e.target.getAttribute('datatype-id')},
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept" : "application/json",
                    "token": `Bearer ${token}`,
                },
            })
            .then((res)=>{
                if (res.data == '0'){
                    NotificationManager.warning('Warning message', "You can't delete other's messages ! But only yours ...", 3000);
                } else {
                    NotificationManager.success('Success message', 'deleted');
                    prop.refreshor(Math.random(10))
                }
            })
            .catch((err)=>{
                NotificationManager.warning('Warning message', 'Oops contact Sam DEV', 3000);
            })
        }
    }
    function modified(e) {
        if(e.key === 'Enter') {
            let value = e.target.value;
            if (value ==="") {
                e.target.classList.add('is-hidden')
            }
            if(value !== "" && token != null){
                axios({
                    method : 'PUT',
                    url : "http://localhost:8080/channel/update_msg",
                    data : {id_msg: e.target.getAttribute('datatype-id'), content : value },
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept" : "application/json",
                        "token": `Bearer ${token}`,
                    },
                })
                .then((res)=>{
                    if (res.data == "can't update another message than yours"){
                        e.target.classList.add('is-hidden')
                        NotificationManager.warning('Warning message', "You can't update other's messages ! But only yours ...", 3000);
                    } else {
                        e.target.classList.add('is-hidden')
                        e.target.value = ""
                        prop.refreshor(Math.random(10))
                    }
                })
                .catch((err)=>{
                    NotificationManager.warning('Warning message', 'Oops contact Sam DEV', 3000);
                })
            }
        }
    }
    
    function show_input (key){
        let input = document.getElementsByClassName("updatemsg")[key];
        input.classList.remove("is-hidden")
    }

    return (
        <div className="messages block">
            {msg.map((item, key)=>(
                <div key={key} className="columns">
                    <div className="column is-12">
                        <div className="box">
                            <span className='is-size-7 level'>
                                {item.created_at.substring(0,10)} at { item.created_at.substring(11,16)}
                                <span className="icon button" onClick={(e)=>{show_input(key)}}>
                                    <i className="fas fa-pen"></i>
                                </span>
                                <button className=" is-large level-right has-background-danger-light is-round" datatype-id={item.id} onClick={(e)=>{delete_msg(e)}}>X</button>
                            </span>
                            <p className='message'>
                                <span className="is-uppercase has-text-weight-bold"> {item.username} :  </span>
                                <span className="content">  {item.content}</span>
                                <input className="updatemsg input is-info is-hidden" type="text" name="update" datatype-id={item.id} placeholder={item.content} onKeyDown={(e)=>{modified(e)}}/>
                            </p>

                        </div>

                    </div>
                </div>
            )) }
            <NotificationContainer/>
        </div>

    );
}

export default Messages;