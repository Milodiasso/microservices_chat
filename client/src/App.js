import './App.css';
import Auth from './Component/Auth';
import Channels from './Component/Channels';


const App = ()=> {
  return (
    <div className="container ">
      {/* <div className="columns my-5">
        <div className="column box has-text-black ">
          <div className=" has-background-white has-text-black ">
            <h1 className='has-text-centered is-size-1 has-text-weight-bold'>THE CHAT</h1>

          </div>

        </div>
      </div> */}
      <div className="columns my-5">
        <div className="column is-half is-offset-one-quarter">
        
          <Auth />
        </div>
      </div>
      <div className="columns my-5">
        <div className="column box">
          <Channels/>
        </div>
      </div>
    </div>
  );
}

export default App;
