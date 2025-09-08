
import React, { useState } from 'react';
import { ecoSuggestions } from './ecoSuggestions';

const mainBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Segoe UI, Arial, sans-serif',
};

const card = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '32px',
  margin: '16px',
  maxWidth: '400px',
  width: '100%',
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #26c6da, #00acc1)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '12px',
  boxShadow: '0 2px 8px rgba(38,198,218,0.15)',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #b2ebf2',
  margin: '6px 0',
  width: '100%',
};

function FootprintForm({ username, onSubmit }) {
  const [travel, setTravel] = useState('');
  const [shopping, setShopping] = useState('');
  const [diet, setDiet] = useState('omnivore');

  return (
    <form style={card} onSubmit={e => {
      e.preventDefault();
      onSubmit({ travel: Number(travel), shopping: Number(shopping), diet });
    }}>
      <h3 style={{ color: '#00acc1', marginBottom: 16 }}>Enter today's habits</h3>
      <label>
        Travel (km by car):
        <input type="number" value={travel} onChange={e => setTravel(e.target.value)} style={inputStyle} />
      </label>
      <label>
        Shopping ($ spent):
        <input type="number" value={shopping} onChange={e => setShopping(e.target.value)} style={inputStyle} />
      </label>
      <label>
        Diet:
        <select value={diet} onChange={e => setDiet(e.target.value)} style={inputStyle}>
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </label>
      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
}

function Suggestions({ footprint }) {
  // Thresholds for high footprint
  const travelHigh = footprint.travel > 30;
  const shoppingHigh = footprint.shopping > 100;
  const dietHigh = footprint.diet === 'omnivore';

  const travelLow = footprint.travel <= 10;
  const shoppingLow = footprint.shopping <= 30;
  const dietLow = footprint.diet === 'vegan';

  return (
    <div style={{ ...card, background: '#e0f7fa', border: '1px solid #00acc1' }}>
      <h3 style={{ color: '#00838f', marginBottom: 12 }}>Eco Suggestions</h3>
      <ul style={{ paddingLeft: 20 }}>
        {travelHigh && ecoSuggestions.travel.map((suggestion, i) => (
          <li key={'travel-' + i} style={{ color: '#00796b', marginBottom: 6 }}>{suggestion}</li>
        ))}
        {shoppingHigh && ecoSuggestions.shopping.map((suggestion, i) => (
          <li key={'shopping-' + i} style={{ color: '#6d4c41', marginBottom: 6 }}>{suggestion}</li>
        ))}
        {dietHigh && ecoSuggestions.diet.map((suggestion, i) => (
          <li key={'diet-' + i} style={{ color: '#c62828', marginBottom: 6 }}>{suggestion}</li>
        ))}
        {(travelLow || shoppingLow || dietLow) && (
          <li style={{ color: '#388e3c', marginTop: 12, fontWeight: 'bold' }}>
            Great job! Your carbon footprint is low in:
            <ul>
              {travelLow && <li style={{ color: '#00796b' }}>Travel</li>}
              {shoppingLow && <li style={{ color: '#6d4c41' }}>Shopping</li>}
              {dietLow && <li style={{ color: '#c62828' }}>Diet</li>}
            </ul>
          </li>
        )}
        {(!travelHigh && !shoppingHigh && !dietHigh && !travelLow && !shoppingLow && !dietLow) && (
          <li style={{ color: '#00838f', marginTop: 12 }}>Your footprint is moderate. Keep improving!</li>
        )}
      </ul>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [footprint, setFootprint] = useState(null);

  return (
    <div style={mainBg}>
      <div style={{ ...card, textAlign: 'center', background: 'linear-gradient(90deg, #26c6da 60%, #00acc1 100%)', color: '#fff', boxShadow: '0 6px 32px rgba(0,172,193,0.12)' }}>
        <h1 style={{ marginBottom: 8, fontWeight: 700, letterSpacing: 1 }}>Carbon Footprint Tracker</h1>
        <p style={{ fontSize: 18, marginBottom: 0 }}>Track your daily habits and get eco-friendly suggestions!</p>
      </div>
      {!submitted ? (
        <form style={card} onSubmit={e => {
          e.preventDefault();
          setSubmitted(true);
        }}>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Username:
            <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
          </label>
          <button type="submit" style={buttonStyle}>Start</button>
        </form>
      ) : (
        <>
          {!footprint ? (
            <FootprintForm username={username} onSubmit={setFootprint} />
          ) : (
            <Suggestions footprint={footprint} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
