import './App.css';
import MatchCentre from './pages/MatchCentre';
import GoogleLoginButton from "./components/GoogleLoginButton";

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <GoogleLoginButton></GoogleLoginButton>
        <MatchCentre></MatchCentre>
      </header>
    </div>
  );
}

export default App;
