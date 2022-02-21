import axios from 'axios';
import './App.css';
import { Game } from './components/Game';
import Config from './config.json'
import GameContextProvider from './context/GameContextProvider';

async function App() {
  const ws = new WebSocket(Config.WS_URL);
  const gameConfig = await axios.get(Config.SERVER_URL + '/config').then(response => {return response.data });

  return (
    <div className="App">
      <GameContextProvider gameConfig={gameConfig}>
        <Game websocket={ws}/>
      </GameContextProvider>
      
    </div>
  );
}

export default App;
