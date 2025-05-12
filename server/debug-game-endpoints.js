const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function debugGameEndpoints() {
  try {
    console.log('=====================================================');
    console.log('Debug script for game endpoints');
    console.log('This will help identify issues with the game loading');
    console.log('=====================================================\n');
    
    // Test the primary /games/all endpoint that's having issues
    console.log('TESTING /content/games/all endpoint...');
    try {
      const allGamesResponse = await axios.get(`${BASE_URL}/content/games/all`);
      console.log('✅ /content/games/all endpoint response status:', allGamesResponse.status);
      
      // Check each game type in the response
      const gameTypes = ['quiz', 'scenario', 'matching', 'spiral', 'timeline'];
      
      for (const gameType of gameTypes) {
        console.log(`\n--- ${gameType.toUpperCase()} games ---`);
        
        if (!allGamesResponse.data[gameType]) {
          console.log(`❌ No ${gameType} data in response!`);
          continue;
        }
        
        console.log(`ID: ${allGamesResponse.data[gameType].id || 'null'}`);
        console.log(`Title: ${allGamesResponse.data[gameType].title || 'null'}`);
        
        if (Array.isArray(allGamesResponse.data[gameType].data)) {
          console.log(`Data items: ${allGamesResponse.data[gameType].data.length}`);
        } else if (allGamesResponse.data[gameType].data) {
          console.log(`Data: ${typeof allGamesResponse.data[gameType].data}`);
        } else {
          console.log('❌ No data array found!');
        }
      }
    } catch (error) {
      console.error('❌ Error with /content/games/all endpoint:');
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Response data:', error.response.data);
      } else {
        console.error(error.message);
      }
    }
    
    // Test the individual game type endpoints
    console.log('\n\n=== TESTING INDIVIDUAL GAME TYPE ENDPOINTS ===');
    
    const gameTypes = ['quiz', 'scenario', 'matching', 'spiral', 'timeline'];
    
    for (const gameType of gameTypes) {
      console.log(`\n--- Testing /content/games/${gameType} endpoint ---`);
      
      try {
        const response = await axios.get(`${BASE_URL}/content/games/${gameType}`);
        console.log(`✅ Status: ${response.status}`);
        console.log(`Games found: ${response.data.length}`);
        
        if (response.data.length > 0) {
          console.log(`First game title: "${response.data[0].title}"`);
          
          // Check structure based on game type
          if (gameType === 'quiz' && response.data[0].questions) {
            console.log(`Questions: ${response.data[0].questions.length}`);
          } else if (gameType === 'scenario' && response.data[0].scenarios) {
            console.log(`Scenarios: ${response.data[0].scenarios.length}`);
          } else if (['matching', 'spiral', 'timeline'].includes(gameType) && response.data[0].config) {
            console.log(`Has config: ${typeof response.data[0].config === 'object'}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error with /content/games/${gameType} endpoint:`);
        if (error.response) {
          console.error(`Status: ${error.response.status}`);
          console.error('Response data:', error.response.data);
        } else {
          console.error(error.message);
        }
      }
    }
    
    // Test the debug list endpoint
    console.log('\n\n=== TESTING DEBUG LIST ENDPOINT ===');
    try {
      const listResponse = await axios.get(`${BASE_URL}/content/games/list`);
      console.log('✅ /content/games/list response status:', listResponse.status);
      console.log(`Total games in database: ${listResponse.data.length}`);
      
      // Count games by type
      const gameTypeCounts = {};
      listResponse.data.forEach(game => {
        const type = game.gameType || game.type;
        gameTypeCounts[type] = (gameTypeCounts[type] || 0) + 1;
      });
      
      console.log('\nGames by type:');
      Object.entries(gameTypeCounts).forEach(([type, count]) => {
        console.log(`- ${type}: ${count}`);
      });
      
      // Print first few games for inspection
      console.log('\nSample games:');
      listResponse.data.slice(0, 3).forEach((game, index) => {
        console.log(`\n[${index + 1}] ID: ${game.id}`);
        console.log(`Title: "${game.title}"`);
        console.log(`Type: ${game.type}`);
        console.log(`Game Type: ${game.gameType}`);
        console.log(`Has Config: ${game.hasConfig}`);
        console.log(`Has Questions: ${game.hasQuestions}`);
      });
    } catch (error) {
      console.error('❌ Error with /content/games/list endpoint:');
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Response data:', error.response.data);
      } else {
        console.error(error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

debugGameEndpoints(); 