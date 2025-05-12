const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create .env files from examples
function createEnvFiles() {
  console.log('Setting up environment files...');

  // Root .env
  if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('Created .env in root directory');
  }

  // Server .env
  if (!fs.existsSync('./server/.env') && fs.existsSync('./server/.env.example')) {
    fs.copyFileSync('./server/.env.example', './server/.env');
    console.log('Created .env in server directory');
  }

  // Client .env
  if (!fs.existsSync('./client/.env') && fs.existsSync('./client/.env.example')) {
    fs.copyFileSync('./client/.env.example', './client/.env');
    console.log('Created .env in client directory');
  }
}

// Install dependencies
function installDependencies() {
  console.log('\nInstalling dependencies...');
  
  try {
    console.log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });
    
    console.log('Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    console.log('\nAll dependencies installed successfully!');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
  }
}

// Main setup function
function setup() {
  console.log('Setting up Constitutional Learning Platform...\n');
  
  createEnvFiles();
  installDependencies();
  
  console.log('\n🎉 Setup completed! You can now run the application with:');
  console.log('   npm run dev');
  console.log('\nThis will start both the client and server in development mode.');
}

// Run setup
setup(); 