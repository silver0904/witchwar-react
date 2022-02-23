import './App.css';
import { Game } from './components/Game';
import Config from './config.json'
import GameContextProvider from './context/GameContextProvider';

function App() {
  const ws = new WebSocket(Config.WS_URL);
  const defaultGameConfig = {userColors:[]}
  
  return (
    <div className="App">
      <GameContextProvider gameConfig={defaultGameConfig}>
        <Game websocket={ws}/>
      </GameContextProvider>
      
    </div>
  );
}

export default App;
