import React from 'react';
import './App.css';
import WheelComponent from './components/Wheel';
import { GoogleSpreadsheet } from "google-spreadsheet";
import config from './config';

function App() {
  const wheelItems = [
    'Better luck next time',
    '2X Savings',
    <span><i className="fa fa-inr" />100 cashback</span>,
    <span><i className="fa fa-inr" />20</span>,
    <span><i className="fa fa-inr" />50</span>,
    '1.5X Savings',
    '2X Savings',
    <span><i className="fa fa-inr" />50</span>,
  ]

  const SPREADSHEET_ID = config.spreadsheet_id;
  const SHEET_ID = config.sheet_id;
  const CLIENT_EMAIL = config.client_email;
  const PRIVATE_KEY = config.private_key;

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const appendSpreadsheet = async (row) => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();
  
      const sheet = doc.sheetsById[SHEET_ID];
      const result = await sheet.addRow(row);
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <h2 className='header'>
          <span>&lt;</span>
          <span>Your Rewards</span>
        </h2>
        <WheelComponent rewards={wheelItems} appendSpreadsheet={appendSpreadsheet} />
        <div className='mainText'>Spin the wheel to get rewarded</div>
        <div className='instruction'>Tap on Spin or rotate the wheel anti-clockwise and release to start spinning </div>
        <div className='help'>Have a question? <span>Get help</span></div>
      </div>
    </div>
  );
}

export default App;
