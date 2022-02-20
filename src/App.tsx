import './App.css';
import { Game } from './components/Game';

function App() {
  const ws = new WebSocket("ws://localhost:9090")
  return (
    <div className="App">
      <Game websocket={ws}/>
    </div>
  );
}

export default App;
