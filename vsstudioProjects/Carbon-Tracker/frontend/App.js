import React, { useState, useEffect } from 'react';
import { ecoSuggestions } from './ecoSuggestions';

const API = 'http://localhost:4000/api';

function FootprintForm({ username, onSubmit }) {
  const [travel, setTravel] = useState('');
  const [shopping, setShopping] = useState('');
  const [diet, setDiet] = useState('omnivore');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({ travel: Number(travel), shopping: Number(shopping), diet });
    }}>
      <h3>Enter today's habits</h3>
      <label>
        Travel (km by car): <input type="number" value={travel} onChange={e => setTravel(e.target.value)} />
      </label>
      <br />
      <label>
        Shopping ($ spent): <input type="number" value={shopping} onChange={e => setShopping(e.target.value)} />
      </label>
      <br />
      <label>
        Diet:
        <select value={diet} onChange={e => setDiet(e.target.value)}>
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

function Suggestions() {
  return (
    <div>
      <h3>Eco-Friendly Suggestions</h3>
      <ul>
        {Object.entries(ecoSuggestions).map(([cat, tips]) => (
          <li key={cat}>
            <b>{cat}</b>
            <ul>{tips.map((tip, idx) => <li key={idx}>{tip}</li>)}</ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Progress({ entries }) {
  if (!entries.length) return null;
  const footprints = entries.map(e => e.footprint);
  const diff = footprints[0] - footprints[footprints.length - 1];
  return (
    <div>
      <h3>Your Progress</h3>
      <p>First entry: {footprints[0].toFixed(2)} kg CO2</p>
      <p>Latest entry: {footprints[footprints.length - 1].toFixed(2)} kg CO2</p>
      <p>Improvement: {diff > 0 ? diff.toFixed(2) : 'No improvement yet'} kg CO2</p>
      <table border="1">
        <thead>
          <tr><th>Date</th><th>Travel</th><th>Shopping</th><th>Diet</th><th>Footprint</th></tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td>{e.date}</td>
              <td>{e.travel}</td>
              <td>{e.shopping}</td>
              <td>{e.diet}</td>
              <td>{e.footprint.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (username) {
      fetch(`${API}/track/${username}`)
        .then(res => res.json())
        .then(data => setEntries(data.entries));
    }
  }, [username]);

  const handleSubmit = (data) => {
    fetch(`${API}/input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, ...data })
    })
      .then(res => res.json())
      .then(res => {
        setEntries([...entries, res.entry]);
      });
  };

  if (!username) {
    return (
      <div>
        <h2>Carbon Footprint Tracker</h2>
        <input placeholder="Enter your username" onBlur={e => setUsername(e.target.value)} />
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <FootprintForm username={username} onSubmit={handleSubmit} />
      <Suggestions />
      <Progress entries={entries} />
    </div>
  );
}

export default App;