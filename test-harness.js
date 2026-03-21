#!/usr/bin/env node
// test-harness.js — Run WORM.BAS headlessly with scripted input, output PNG screenshots
//
// Usage:
//   node test-harness.js [script.json] [--debug] [--break LINE]
//
// Script format (JSON array):
//   [
//     {"steps": 5000},              // run N interpreter steps
//     {"key": "1"},                  // inject a keypress
//     {"keys": "hello"},            // inject multiple keypresses
//     {"screenshot": "menu.png"},   // save canvas to PNG
//     {"dump": true},               // print screen text to stdout
//     {"vars": ["S", "E", "L"]},    // print variable values
//     {"log": "starting game"},     // print a message
//     {"break": 5000},              // set breakpoint at BASIC line
//     {"clearbreak": 5000},         // remove breakpoint
//     {"stepUntil": 9000},          // run until reaching line N
//     {"stepUntilWaiting": true},   // run until interpreter needs input
//   ]
//
// Without a script, runs a default test: show menu, press 1, screenshot.

import { createCanvas } from 'canvas';
import { writeFileSync, readFileSync } from 'fs';
import { Screen, Interpreter, WORM_SOURCE } from './worm.js';

// Parse args
const args = process.argv.slice(2);
let scriptFile = null;
let debugMode = false;
let breakLines = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--debug') debugMode = true;
  else if (args[i] === '--break' && args[i+1]) { breakLines.push(parseInt(args[++i])); }
  else if (!args[i].startsWith('-')) scriptFile = args[i];
}

// Create headless canvas
const canvas = createCanvas(80 * 8 * 3, 25 * 9 * 3);
const screen = new Screen(canvas);
const interp = new Interpreter(screen, WORM_SOURCE);
interp.running = true;

// Set up debug hooks
if (debugMode) {
  interp.onStep = (lineNum, stmtOff) => {
    if (stmtOff === 0) process.stderr.write(`  line ${lineNum}\n`);
  };
}

interp.onError = (lineNum, err) => {
  console.error(`BASIC ERROR at line ${lineNum}: ${err.message}`);
  console.error('Stack:', err.stack);
  console.error('Vars:', JSON.stringify(interp.vars, null, 2));
};

for (const line of breakLines) {
  interp.breakpoints.add(line);
}

// Helper: run steps until idle/waiting/breakpoint
function runUntilIdle(maxSteps = 100000) {
  let total = 0;
  while (total < maxSteps) {
    const batch = Math.min(1000, maxSteps - total);
    const result = interp.runSteps(batch);
    total += batch;
    if (result !== 'ok') return result;
  }
  return 'ok';
}

function runUntilLine(targetLine, maxSteps = 1000000) {
  let total = 0;
  while (total < maxSteps && interp.running) {
    const line = interp.currentLine();
    if (line === targetLine && interp.stmtOffset === 0) return 'reached';
    const result = interp.runSteps(1);
    total++;
    if (result === 'waiting' || result === 'breakpoint' || result === 'ended' || result === 'error') return result;
  }
  return 'timeout';
}

function runUntilWaiting(maxSteps = 1000000) {
  let total = 0;
  while (total < maxSteps) {
    const result = interp.runSteps(1);
    total++;
    if (result !== 'ok') return result;
  }
  return 'timeout';
}

function saveScreenshot(filename) {
  const buf = canvas.toBuffer('image/png');
  writeFileSync(filename, buf);
  console.log(`Screenshot saved: ${filename} (${buf.length} bytes)`);
}

function dumpScreen() {
  console.log('--- Screen ---');
  console.log(screen.dumpText());
  console.log('--- End ---');
}

function printVars(names) {
  for (const name of names) {
    const key = name.toUpperCase();
    if (key in interp.vars) {
      console.log(`  ${key} = ${JSON.stringify(interp.vars[key])}`);
    } else if (key in interp.arrays) {
      console.log(`  ${key}() = ${JSON.stringify(interp.arrays[key])}`);
    } else {
      console.log(`  ${key} = (undefined)`);
    }
  }
}

// Load or default script
let script;
if (scriptFile) {
  script = JSON.parse(readFileSync(scriptFile, 'utf8'));
} else {
  // Default: show menu, screenshot, press 1, run a bit, screenshot
  script = [
    {"log": "Running until menu appears (waiting for input)..."},
    {"stepUntilWaiting": true},
    {"screenshot": "01-menu.png"},
    {"dump": true},
    {"log": "Pressing '1' to select Original Worm..."},
    {"key": "1"},
    {"steps": 50000},
    {"screenshot": "02-game-start.png"},
    {"dump": true},
    {"vars": ["S", "E", "L", "H", "T", "ND", "DR", "DC"]},
  ];
}

// Execute script
for (const cmd of script) {
  if (cmd.log) {
    console.log(cmd.log);
  }
  if (cmd.steps) {
    const result = interp.runSteps(cmd.steps);
    if (debugMode) console.log(`  ran ${cmd.steps} steps, result: ${result}`);
  }
  if (cmd.key) {
    interp.injectKey(cmd.key);
    if (debugMode) console.log(`  injected key: ${JSON.stringify(cmd.key)}`);
  }
  if (cmd.keys) {
    for (const ch of cmd.keys) {
      interp.injectKey(ch);
    }
    if (debugMode) console.log(`  injected keys: ${JSON.stringify(cmd.keys)}`);
  }
  if (cmd.screenshot) {
    saveScreenshot(cmd.screenshot);
  }
  if (cmd.dump) {
    dumpScreen();
  }
  if (cmd.vars) {
    printVars(cmd.vars);
  }
  if (cmd.break !== undefined) {
    interp.breakpoints.add(cmd.break);
    if (debugMode) console.log(`  breakpoint set at line ${cmd.break}`);
  }
  if (cmd.clearbreak !== undefined) {
    interp.breakpoints.delete(cmd.clearbreak);
  }
  if (cmd.stepUntil !== undefined) {
    const result = runUntilLine(cmd.stepUntil);
    console.log(`  stepUntil ${cmd.stepUntil}: ${result} (now at line ${interp.currentLine()})`);
  }
  if (cmd.stepUntilWaiting) {
    const result = runUntilWaiting();
    console.log(`  stepUntilWaiting: ${result} (at line ${interp.currentLine()})`);
  }
}

console.log('Done.');
