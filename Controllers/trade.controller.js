const path = require('path');
const TradeService = require('../Services/trade.service');
const tradeServiceInstance = new TradeService();
 // Import the TradeService class
const csvParser = require('csv-parser');
const fs = require('fs');
const { time } = require('console');

const postTrade = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
            const [baseCoin, quoteCoin] = row.Market.split('/').map(coin => coin.trim());
    
            const operation = row.Operation.trim().toLowerCase();
            const validOperations = ['buy', 'sell'];
            if (!validOperations.includes(operation)) {
              throw new Error(`Invalid operation value: ${row.Operation}`);
            }
    
            const tradeData = {
              utcTime: new Date(row['UTC_Time']), // Convert to Date object
              operation: operation.charAt(0).toUpperCase() + operation.slice(1), // Normalize to 'Buy' or 'Sell'
              baseCoin,
              quoteCoin,
              amount: parseFloat(row['Buy/Sell Amount']),
              price: parseFloat(row.Price)
            };
         
          await tradeServiceInstance.saveTrade(tradeData); // Call the service method to save trade data
        }

        res.send('File processed and data saved successfully.');
      } catch (error) {
        res.status(500).send('Error processing file: ' + error.message);
      }
    })
    .on('error', (error) => res.status(500).send('Error reading file: ' + error.message));
};



const calucateBalance=(data)=>{

    console.log('in the cal balance method ')
  // Object to hold the asset balances
  const balances = {};

  // Calculate the balance for each asset (baseCoin)
  data.forEach(trade => {
      const { baseCoin, operation, amount } = trade;

      if (!balances[baseCoin]) {
          balances[baseCoin] = 0;
      }

      if (operation === "Buy") {
          balances[baseCoin] += amount; // Add amount for Buy
      } else if (operation === "Sell") {
          balances[baseCoin] -= amount; // Subtract amount for Sell
      }
  });
  console.log(balances);
  return balances;
}


const postBalance=async(req,res)=>{
try {
    const {timestamp}=req.body;
    const date = new Date(timestamp);
    console.log(date);
     const tradeData = await tradeServiceInstance.findTransactionByTimestamp(date);
     const result = calucateBalance(tradeData);
    res.send(result);
} catch (error) {
    
}
}
module.exports = {postTrade,postBalance };
