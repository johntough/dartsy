import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import MatchCentre from './pages/MatchCentre';
import GoogleAuthButton from "./components/GoogleAuthButton";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    return (
      <div className="App">
        <header className="App-header">
          <GoogleAuthButton setUserId={setUserId} setUserName={setUserName}/>
          <MatchCentre userId={userId} userName={userName} />
        </header>
          <ToastContainer />
      </div>
    );
}

export default App;