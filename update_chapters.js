import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colorizedDir = path.join(__dirname, 'colorizedjjk');

console.log('Scanning chapters...\n');

// Get all chapter folders
const chapterFolders = fs.readdirSync(colorizedDir)
    .filter(item => {
        const fullPath = path.join(colorizedDir, item);
        return fs.statSync(fullPath).isDirectory();
    })
    .sort((a, b) => {
        // Extract chapter numbers for proper sorting
        const numA = parseFloat(a.replace('chapter ', ''));
        const numB = parseFloat(b.replace('chapter ', ''));
        return numA - numB;
    });

console.log(`Found ${chapterFolders.length} chapter folders`);

// Count pages in each chapter
const chapterData = [];
for (const folder of chapterFolders) {
    const folderPath = path.join(colorizedDir, folder);
    const files = fs.readdirSync(folderPath)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
        });
    
    const chapterNum = parseFloat(folder.replace('chapter ', ''));
    chapterData.push({
        folder: folder,
        num: chapterNum,
        count: files.length
    });
}

// Sort by chapter number
chapterData.sort((a, b) => a.num - b.num);

// Find the max chapter number to fill in missing chapters
const maxChapter = Math.max(...chapterData.map(c => c.num));
console.log(`Max chapter number: ${maxChapter}\n`);

// Build page counts array
const pageCounts = [];
for (let i = 1; i <= maxChapter; i++) {
    const chapter = chapterData.find(c => c.num === i);
    if (chapter && chapter.count > 0) {
        pageCounts.push(chapter.count);
    } else {
        // Missing chapter - set to 0
        if (!chapter) {
            console.log(`Warning: Chapter ${i} folder is missing!`);
        } else {
            console.log(`Warning: Chapter ${i} has 0 pages!`);
        }
        pageCounts.push(0);
    }
}

// Handle special chapters like "chapter 262.2"
const specialChapters = chapterData.filter(c => !Number.isInteger(c.num));
if (specialChapters.length > 0) {
    console.log(`\nSpecial chapters found: ${specialChapters.map(c => c.folder).join(', ')}`);
    console.log('Note: Special chapters are not included in the main array');
}

// Write to chapterCounts.json
const chapterCountsJson = JSON.stringify(pageCounts, null, 2);
fs.writeFileSync(path.join(__dirname, 'chapterCounts.json'), chapterCountsJson);
console.log(`\n✓ Updated chapterCounts.json with ${pageCounts.length} chapters`);

// Update config.js
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace the CHAPTER_PAGE_COUNTS array
const arrayString = '[\n' + pageCounts.map(count => `    ${count}`).join(',\n') + '\n];';
const arrayRegex = /const CHAPTER_PAGE_COUNTS = \[[\s\S]*?\];/;
configContent = configContent.replace(arrayRegex, `const CHAPTER_PAGE_COUNTS = ${arrayString}`);

fs.writeFileSync(configPath, configContent);
console.log(`✓ Updated config.js`);

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Total chapters configured: ${pageCounts.length}`);
console.log(`   Chapters with pages: ${pageCounts.filter(c => c > 0).length}`);
console.log(`   Missing/empty chapters: ${pageCounts.filter(c => c === 0).length}`);
console.log(`   Latest chapter: ${maxChapter}`);


