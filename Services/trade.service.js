const tradeModel = require('../Models/trade')

class TradeService{
    async saveTrade(tradeData) {
        try {
            console.log(tradeData);
          const tradeDocument = new tradeModel(tradeData); // Create a new trade document
          await tradeDocument.save(); // Save the trade document to the database
          return 'Trade saved successfully'; // Return a success message
        } catch (error) {
          throw new Error('Error saving trade: ' + error.message); // Throw an error if something goes wrong
        }
      }

      findTransactionByTimestamp=async(date)=>
      {
        const results= await tradeModel.find({ utcTime: { $lte: date } });
        return results;
      }
      



    //   calucateBalance=(data)=>{

    //     console.log('in the cal balance method ')
    //   // Object to hold the asset balances
    //   const balances = {};
    
    //   // Calculate the balance for each asset (baseCoin)
    //   data.forEach(trade => {
    //       const { baseCoin, operation, amount } = trade;
    
    //       if (!balances[baseCoin]) {
    //           balances[baseCoin] = 0;
    //       }
    
    //       if (operation === "Buy") {
    //           balances[baseCoin] += amount; // Add amount for Buy
    //       } else if (operation === "Sell") {
    //           balances[baseCoin] -= amount; // Subtract amount for Sell
    //       }
    //   });
    //   console.log(balances);
    // }

}

module.exports = TradeService;