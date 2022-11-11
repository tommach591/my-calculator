import "./App.css";
import Calculator from "../Calculator";
import { useState } from "react";

function App() {
  const [history, setHistory] = useState([]);

  function updateHistory(prevEntry) {
    let newHistory = [...history];
    newHistory.unshift(prevEntry);
    setHistory(newHistory);
  }

  return (
    <div className="App">
      <h1 className="Header">My Calculator</h1>
      <Calculator updateHistory={updateHistory} />
      <div className="History">
        <h2>History</h2>
        <div className="List">
          {history.map((e, i) => {
            return (
              <div className="Item" key={i}>
                <h1>{e}</h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
