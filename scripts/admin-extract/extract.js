import fs from 'fs';
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { globbySync } from 'globby';
import yaml from 'js-yaml';

// The process works like this:
// 1. Clone data in temp folder
// 2. Find all yml files
// 3. Extract all GH usernames
// 4. Load admin file
// 5. Add all GH usernames to admin file with dedupe
// 6. Cleanup temp folder

const __dirname = dirname(fileURLToPath(import.meta.url));
const adminFile = path.join(__dirname, '../../api/administrators.json');
const advocatesRepo = `github:MicrosoftDocs/cloud-developer-advocates/advocates`;
const githubUsernameRegex = /https?:\/\/(?:www\.?)?github.com\/(.*?)\/?$/i;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'extract-'));

console.log(`Working dir: ${tempDir}`);
console.log('Cloning advocates repo...');
execSync(`npx degit ${advocatesRepo} ${tempDir}`, { stdio: 'inherit' });

console.log('Searching for yaml files...');
const ymlFiles = globbySync([`${tempDir}/*.yml`, '!**/index.html.yml', '!**/map.yml', '!**/toc.yml']);
console.log(`Found ${ymlFiles.length} yaml files`);

console.log('Extracting GitHub usernames...');
const usernames = [];
ymlFiles.forEach((file) => {
  try {
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    const github = (data.connect || []).find((c) => c.title.toLowerCase() === 'github' || /github\.com/.test(c.url));
    if (!github) {
      console.error(`No GitHub account found for: ${data.name}!`);
      console.log(JSON.stringify(data.connect));
      return;
    }
    const match = github.url.trim().match(githubUsernameRegex);
    if (!match || !match[1]) {
      console.log(match);
      console.error(`Incorrect GitHub URL format: ${github.url}`);
      return;
    }
    usernames.push(match[1].toLowerCase());
  } catch (e) {
    console.error(`An error occurred while reading file ${file}: ${e}`);
  }
});
console.log(`Found ${usernames.length} GitHub usernames`);

console.log(`Loading existing admin data...`);
const admins = JSON.parse(fs.readFileSync(adminFile, 'utf8'));
console.log(`Found ${admins.length} existing admins.`);

console.log(`Adding missing usernames...`);
let existingAdmins = admins.reduce((acc, admin) => {
  acc[admin] = true;
  return acc;
}, {});
let added = 0;
usernames.forEach((username) => {
  if (!existingAdmins[username]) {
    admins.push(username);
    added++;
  }
});
console.log(`Added ${added} new admin(s).`);
fs.writeFileSync(adminFile, JSON.stringify(admins, null, 2));
console.log(`Updated admin file.`);

fs.rmSync(tempDir, { recursive: true });
console.log('Done.');
