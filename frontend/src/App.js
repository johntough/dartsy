import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MatchCentre from './pages/MatchCentre';
import GoogleAuthButton from "./components/GoogleAuthButton";

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <GoogleAuthButton></GoogleAuthButton>
        <MatchCentre></MatchCentre>
      </header>
        <ToastContainer />
    </div>
  );
}

export default App;