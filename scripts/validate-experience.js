#!/usr/bin/env node

/**
 * Experience Validation CLI Tool
 *
 * Usage:
 *   npm run validate training_basement
 *   npm run validate sheriffs_last_ride
 */

// Register ts-node to handle TypeScript imports
require('ts-node').register({
  project: __dirname + '/tsconfig.json',
  transpileOnly: true,
});

const fs = require('fs');
const path = require('path');

// Import validator
const { ExperienceValidator } = require('../src/services/ExperienceValidator');

// Get experience ID from command line
const experienceId = process.argv[2];

if (!experienceId) {
  console.error('❌ Error: No experience ID provided');
  console.log('\nUsage: npm run validate <experience_id>');
  console.log('Example: npm run validate training_basement\n');
  process.exit(1);
}

// Map experience IDs to file paths
const experiencePaths = {
  'training_basement': path.join(__dirname, '../experiences/training_basement/experience.json'),
  'sheriffs_last_ride': path.join(__dirname, '../experiences/sheriffs_last_ride/experience.json'),
};

const experiencePath = experiencePaths[experienceId];

if (!experiencePath) {
  console.error(`❌ Error: Unknown experience ID: ${experienceId}`);
  console.log('\nAvailable experiences:');
  Object.keys(experiencePaths).forEach(id => {
    console.log(`  - ${id}`);
  });
  console.log('');
  process.exit(1);
}

if (!fs.existsSync(experiencePath)) {
  console.error(`❌ Error: Experience file not found: ${experiencePath}`);
  process.exit(1);
}

// Load experience data
console.log(`📂 Loading experience from: ${experiencePath}\n`);
const experienceData = JSON.parse(fs.readFileSync(experiencePath, 'utf8'));

// Run validation
try {
  const validator = new ExperienceValidator(experienceData);
  const report = validator.validate();
  validator.printReport(report);

  // Exit with appropriate code
  if (report.isValid) {
    process.exit(0);
  } else {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Validation failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
