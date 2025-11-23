const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvPath = path.join(__dirname, '../../projects.csv');
const jsonPath = path.join(__dirname, '../../projects-list.json');
const outputPath = path.join(__dirname, '../src/data/db.json');

console.log(`Reading CSV from: ${csvPath}`);
console.log(`Reading JSON from: ${jsonPath}`);

try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('Parsing CSV...');
    Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const projects = results.data;
            const merged = [];

            console.log(`Found ${projects.length} rows in CSV.`);

            projects.forEach(p => {
                if (!p.NAME) return;

                // Find match in JSON (case-insensitive)
                const jsonMatch = jsonContent.find(j => 
                    j.name && p.NAME && j.name.toLowerCase().trim() === p.NAME.toLowerCase().trim()
                );

                // Banner Logic: Use CSV, fallback to JSON if CSV is empty or placeholder
                let banner = p.BANNER;
                const isPlaceholder = !banner || banner.includes('placeholder') || banner.trim() === '';
                
                if (isPlaceholder && jsonMatch && jsonMatch.img && !jsonMatch.img.includes('placeholder')) {
                    banner = jsonMatch.img;
                }
                
                // Fallback banner if still empty
                if (!banner || banner.includes('placeholder')) {
                    banner = 'https://media.giphy.com/media/26tP7axeTIWcO0VrO/giphy.gif'; // Retro static or similar
                }

                // Clean Tags
                let tags = [];
                if (p.TAGS) {
                    tags = p.TAGS.split(',').map(t => t.trim()).filter(Boolean);
                }

                // Robust Categorization Logic
                let category = 'Archive';
                const type = p['PJ TYPE'] ? p['PJ TYPE'].toLowerCase() : '';
                const tagStr = tags.join(' ').toLowerCase();
                const nameStr = p.NAME.toLowerCase();

                // 1. DeFi & Finance
                if (
                    tagStr.includes('defi') || 
                    tagStr.includes('dex') || 
                    tagStr.includes('lending') || 
                    tagStr.includes('yield') || 
                    tagStr.includes('stablecoin') ||
                    tagStr.includes('perps') ||
                    tagStr.includes('trading') ||
                    type.includes('defi')
                ) {
                    category = 'DeFi';
                } 
                // 2. Infrastructure, Wallets, Security, Dev Tools
                else if (
                    tagStr.includes('infra') || 
                    tagStr.includes('dev') || 
                    tagStr.includes('tooling') || 
                    tagStr.includes('oracle') || 
                    tagStr.includes('bridge') || 
                    tagStr.includes('wallet') || 
                    tagStr.includes('security') ||
                    tagStr.includes('rpc') ||
                    tagStr.includes('explorer') ||
                    type.includes('infra')
                ) {
                    category = 'Infra';
                } 
                // 3. NFTs, Gaming, Metaverse
                else if (
                    tagStr.includes('nft') || 
                    tagStr.includes('game') || 
                    tagStr.includes('gaming') || 
                    tagStr.includes('metaverse') || 
                    tagStr.includes('art') ||
                    type.includes('game') ||
                    type.includes('nft')
                ) {
                    category = 'NFTs & Gaming';
                } 
                // 4. Community, Social, DAO
                else if (
                    tagStr.includes('social') || 
                    tagStr.includes('community') || 
                    tagStr.includes('dao') || 
                    tagStr.includes('media') ||
                    tagStr.includes('marketing')
                ) {
                    category = 'Community';
                }

                merged.push({
                    id: p.NAME.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
                    name: p.NAME,
                    logo: p.LOGO,
                    type: p['PJ TYPE'] || 'DApp',
                    category: category,
                    tags: tags,
                    twitter: p.X || (jsonMatch ? jsonMatch.twitter : ''),
                    website: p.WEB || (jsonMatch ? jsonMatch.url : ''),
                    banner: banner,
                    description: p.INFO,
                    onMonad: p['ONLY on Monad'] === 'Yes'
                });
            });

            console.log(`Merged ${merged.length} projects.`);
            
            // Create data dir if not exists
            const dataDir = path.dirname(outputPath);
            if (!fs.existsSync(dataDir)){
                fs.mkdirSync(dataDir, { recursive: true });
            }

            fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
            console.log(`Database written to ${outputPath}`);
        }
    });

} catch (error) {
    console.error('Error processing data:', error);
}
