import React, { useState, useEffect, useRef } from 'react';
import Messages from './Messages';
import PostMessages from './PostMessage';
import useActive from './modules/Setactive';
import {NotificationContainer, NotificationManager} from 'react-notifications';
 
const axios = require('axios')


const Channels =  (prop) => {
    const [channel, setChannel] = useState(['tezst'])
    const [choosenChan, setChoosenChan] = useState([null,null])
    const [active, toggle] = useActive();
    const [active2, toggle2] = useActive();
    const [refresh, setRefresh] = useState(0)
    const [newChan, setnewChan] = useState('')
    const [masterChan, setMasterChan] = useState('');
    
    const divRef = useRef(null)
    let token = localStorage.getItem('token')


    useEffect(() => {
        setTimeout(() => {
            divRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    },[refresh, choosenChan])
  
    
    useEffect( ()=>{
        axios.get('http://localhost:8080/channel/')
        .then(  async function (response) {
            setChannel( await response.data);
        })
        .catch(function (error) {
            NotificationManager.warning('Warning message', 'Oups you should contact the dev SAM', 3000)
        })
    },[newChan])

    function chooseChan (e) {
        setChoosenChan( [e.target.getAttribute('datatype-id'), e.target.getAttribute('datatype-name')])
        toggle()
        master_chan(e.target.getAttribute('datatype-name'))
    }

    function create_channel(e){
        e.preventDefault()
        if (token != null){
            axios({
                url : "http://localhost:8080/channel/create",
                method: "post",
                data: {name_chat: newChan}, 
                headers:{
                    token: `Bearer ${token}`
                }
            })
            .then((res)=>{
                NotificationManager.success('Success message', 'Your channel '+newChan +' was created');
                toggle2()
                setnewChan('')
            })
            .catch((err)=>{
                NotificationManager.warning('Warning message', 'Channel name should be more than 2 caracteres', 3000)
            })
        } else {
            NotificationManager.warning('Warning message', 'You need to be logged to create', 3000)
        }

    }

    function master_chan(chan){
            if (token != null){
                axios({
                    url : "http://127.0.0.1:8080/channel/channel_master/"+chan,
                    method: "get",
                    headers:{
                        token: `Bearer ${token}`
                    }
                })
                .then((res)=>{
                    setMasterChan(res.data)
                })
                .catch((err)=>{

                })
            }
            
    }

    function delete_chan(){
        if (token != null){
            if(window.confirm("Are you sur to delete "+ choosenChan[1]+"?")){
                axios({
                    url : "http://127.0.0.1:8080/channel/delete/"+choosenChan[1],
                    method: "delete",
                    headers:{
                        token: `Bearer ${token}`
                    }
                })
                .then((res)=>{
                    console.log(res);
                    if (res.data == "only creator could delete channel "){
                        NotificationManager.warning('Warning message', 'Only master of channel could delete this channel', 5000);
                    }else {
                        NotificationManager.success('Success message', 'Your channel '+choosenChan[1] +' was deleted');
                        setnewChan(Math.random(10))
                        setChoosenChan([null, null])
                        setMasterChan('')
                    }
                })
                .catch((err)=>{
                    NotificationManager.warning('Warning message', 'Somenting is WRONG ! contact the dev Sam', 3000);
                })

            }
            
        } else {
            NotificationManager.info('','Not allowed without connection');
        }

    }

    


    return (
        <div className="Channels box mt-4 " >
            <div className=" columns mx-6 has-text-centered ">
                <div className="column is-4">

                    <div className={"dropdown is-"+active}>
                        <div className="dropdown-trigger">
                            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={toggle}>
                            <span className='has-text-link is-size-4 '>
                                List of Channels
                                </span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                            <div className="dropdown-content">
                                {channel.map(( item , key)=>(
                                        <a key={key} href="#" className="dropdown-item" datatype-name={item[0]} datatype-id={item[1]} onClick={(e)=>{chooseChan(e)}}>
                                            {item[0]} 
                                        </a>

                                ))}
                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="column is-4">
                    <h3 className='has-text-weight-bold is-size-4 '>Channel : <span className=' has-text-weight-normal'> {choosenChan[1]} </span> </h3>
                </div>
                {masterChan == '' ? '':
                <div className="column is-4">
                    <p className=' is-size-5 is-italic'> Master : <b> {masterChan.username }  </b> </p>
                </div>
                }
            </div>
            
            <div className="columns has-text-centered">
                <div className="column is-half">
                    <button className="button is-rounded is-info has-text-weight-bold is-size-6 " onClick={toggle2}>Create channel</button>
                </div>
                <div className="column is-half ">
                    <button className="  button is-danger is-size-6 is-rounded has-text-weight-bold" onClick={delete_chan}>Delete channel</button>

                </div>
            </div>
            <div className="columns mx-3 mt-5">
                <div className="column is-12 box " style={{"minHeight": "300px", "overflow" : "auto", "maxHeight": "500px"}} scrollsnapstop="true" >
                    <Messages channel={choosenChan[0]} refresh={refresh} refreshor={setRefresh} />
                    <div ref={divRef}/>
                </div >
            </div>

            <div className="columns">
                <div className="column is-12">
                    <PostMessages channel={choosenChan[0]} refresh={setRefresh} />
                </div>
            </div>

            <div className={"modal is-"+active2}>
                <div className="modal-background" onClick={toggle2}></div>
                    <div  className="modal-content" >
                        <p className='my-5 is-size-1 has-text-weight-bold control has-text-white has-text-centered'>Channel name</p>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" placeholder="Channel name" value={newChan} onChange={(e)=>setnewChan( e.target.value)} name="channel"/>
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
                                <button type="submit" className="button is-success" onClick={(e)=>create_channel(e)}>
                                Submit
                                </button>
                            </p>
                        </div>
                        
                    </div>
                <button className="modal-close is-large" aria-label="close" onClick={toggle2}>close</button>
            </div>
            <NotificationContainer/>


        </div>


    );
}

export default Channels;