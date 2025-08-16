

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.BRACKETS_OF_HOPE_BASE_URL || 'http://localhost:3000';




// JSON file to store teams
import fs from 'fs';
import path from 'path';
const TEAMS_FILE = path.resolve('./server/teams.json');

function readTeams() {
  try {
    const data = fs.readFileSync(TEAMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeTeams(teams) {
  fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.post('/create-checkout-session', async (req, res) => {
  const { name, email } = req.body;
  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
             name: 'Overwatch Community Bash Signup',
             description: 'Entry to the 2025 Championship Bracket',
          },
          unit_amount: 1500, // $15.00 in cents
        },
        quantity: 1,
      },
    ];

    // Debug log before sending to Stripe
    console.log('Creating Stripe session with line items:', JSON.stringify(lineItems, null, 2));


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
         name: name,
         email: email
      },
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel.html`,
    });

     console.log('Stripe session created with ID:', session.id);

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to add team after successful payment using session_id
app.post('/api/add-team', async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const name = session.metadata?.name;
    const email = session.customer_email;
    
    if (name && email) {
      let teams = readTeams();
      if (!teams.some(t => t.name === name)) {
        teams.push({ name, email });
        writeTeams(teams);
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: 'Missing name or email in session' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Invalid session_id' });
  }
});



// Endpoint to clear all teams (for testing/admin only)
app.post('/api/clear-teams', (req, res) => {
  writeTeams([]);
  res.json({ success: true });
});


// Endpoint to get all teams (bracket)
app.get('/api/teams', (req, res) => {
  res.json(readTeams());
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));
