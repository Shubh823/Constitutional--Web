// This script runs all database seeding operations in sequence
// Run with: node seed-database.js

require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Constitutional Learning Platform database seeding...');

// Helper function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n📄 Running ${path.basename(scriptPath)}...`);
    
    const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error executing ${scriptPath}: ${error}`);
        return reject(error);
      }
      return resolve();
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

// Run scripts in sequence
async function seedAll() {
  try {
    // Step 1: Seed topics first
    await runScript('./seed-mock-topics.js');
    console.log('✅ Topics seeded successfully');
    
    // Step 2: Seed content that depends on topics
    await runScript('./seed-content.js');
    console.log('✅ Content seeded successfully');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('You can now access topics and their related content in the application.');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding process
seedAll(); 