// Script to test game endpoints
// Run with: node check-game-endpoints.js

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function checkGameEndpoints() {
  try {
    console.log('=====================================================');
    console.log('Checking game endpoints to ensure proper functionality');
    console.log('=====================================================\n');
    
    // Test quiz games endpoint
    console.log('Testing /content/games/quiz endpoint...');
    const quizResponse = await axios.get(`${BASE_URL}/content/games/quiz`);
    
    if (quizResponse.data && quizResponse.data.length > 0) {
      console.log(`✅ Success! Found ${quizResponse.data.length} quiz games`);
      console.log(`  - First quiz: "${quizResponse.data[0].title}"`);
      console.log(`  - Questions: ${quizResponse.data[0].questions ? quizResponse.data[0].questions.length : 0}`);
    } else {
      console.log('❌ No quiz games found');
    }
    
    console.log('\n-----------------------------------------------------\n');
    
    // Test scenario games endpoint
    console.log('Testing /content/games/scenario endpoint...');
    const scenarioResponse = await axios.get(`${BASE_URL}/content/games/scenario`);
    
    if (scenarioResponse.data && scenarioResponse.data.length > 0) {
      console.log(`✅ Success! Found ${scenarioResponse.data.length} scenario games`);
      console.log(`  - First scenario game: "${scenarioResponse.data[0].title}"`);
      console.log(`  - Scenarios: ${scenarioResponse.data[0].scenarios ? scenarioResponse.data[0].scenarios.length : 0}`);
    } else {
      console.log('❌ No scenario games found');
    }
    
    console.log('\n-----------------------------------------------------\n');
    
    // Test specific game endpoint with the ID from previous response
    if (quizResponse.data && quizResponse.data.length > 0) {
      const gameId = quizResponse.data[0].id;
      console.log(`Testing /content/game/${gameId} endpoint...`);
      
      const gameResponse = await axios.get(`${BASE_URL}/content/game/${gameId}`);
      
      if (gameResponse.data) {
        console.log(`✅ Success! Retrieved game "${gameResponse.data.title}"`);
        console.log(`  - Type: ${gameResponse.data.type}`);
        console.log(`  - Questions: ${gameResponse.data.questions ? gameResponse.data.questions.length : 0}`);
      } else {
        console.log('❌ Failed to retrieve specific game');
      }
    }
    
    console.log('\n=====================================================');
    console.log('Game endpoint check completed');
    console.log('=====================================================');
    
  } catch (error) {
    console.error('Error testing game endpoints:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

checkGameEndpoints(); 