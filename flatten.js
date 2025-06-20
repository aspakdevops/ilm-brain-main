const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Function to recursively get all files from a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively get files from subdirectories
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            // Add file to array with relative path info
            arrayOfFiles.push({
                fullPath: fullPath,
                originalPath: path.relative('views', fullPath),
                fileName: file,
                directory: path.dirname(path.relative('views', fullPath))
            });
        }
    });

    return arrayOfFiles;
}

// Function to create flattened zip
async function createFlattenedZip() {
    try {
        console.log('🚀 Starting to create flattened design zip...');

        // Check if views directory exists
        if (!fs.existsSync('views')) {
            console.error('❌ Views directory not found!');
            return;
        }

        // Create output stream
        const output = fs.createWriteStream('flattened_design.zip');
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        // Handle archive events
        output.on('close', () => {
            console.log(`✅ Zip file created successfully!`);
            console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
            console.log(`📁 Location: ${path.resolve('flattened_design.zip')}`);
        });

        archive.on('error', (err) => {
            console.error('❌ Archive error:', err);
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Get all files from views directory
        console.log('📂 Scanning views directory...');
        const allFiles = getAllFiles('views');

        console.log(`📋 Found ${allFiles.length} files to process`);

        // Add files to archive with flattened names
        let processedCount = 0;
        const fileNameCounts = new Map(); // To handle duplicate file names

        allFiles.forEach(fileInfo => {
            try {
                // Create a unique flattened filename
                let flattenedName = fileInfo.fileName;
                
                // If filename already exists, add directory prefix
                if (fileNameCounts.has(flattenedName)) {
                    const count = fileNameCounts.get(flattenedName);
                    const extension = path.extname(flattenedName);
                    const baseName = path.basename(flattenedName, extension);
                    const dirName = fileInfo.directory.replace(/[\/\\]/g, '_');
                    
                    if (dirName && dirName !== '.') {
                        flattenedName = `${dirName}_${baseName}${extension}`;
                    } else {
                        flattenedName = `${baseName}_${count}${extension}`;
                    }
                    fileNameCounts.set(fileInfo.fileName, count + 1);
                } else {
                    fileNameCounts.set(flattenedName, 1);
                }

                // Add file to archive
                archive.file(fileInfo.fullPath, { name: flattenedName });
                processedCount++;

                // Progress indicator
                if (processedCount % 10 === 0 || processedCount === allFiles.length) {
                    const progress = ((processedCount / allFiles.length) * 100).toFixed(1);
                    console.log(`⏳ Progress: ${progress}% (${processedCount}/${allFiles.length})`);
                }

            } catch (error) {
                console.warn(`⚠️  Warning: Could not process file ${fileInfo.fullPath}:`, error.message);
            }
        });

        // Finalize the archive
        console.log('🔄 Finalizing zip file...');
        await archive.finalize();

        // Create a summary file with original structure info
        const summaryContent = createSummaryContent(allFiles);
        console.log('📝 Creating file mapping summary...');
        fs.writeFileSync('flattened_design_mapping.txt', summaryContent);
        console.log('✅ Created mapping file: flattened_design_mapping.txt');

    } catch (error) {
        console.error('❌ Error creating zip file:', error);
        process.exit(1);
    }
}

// Function to create summary content
function createSummaryContent(files) {
    let content = `FLATTENED DESIGN ZIP - FILE MAPPING\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total files: ${files.length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    // Group files by directory
    const byDirectory = {};
    files.forEach(file => {
        const dir = file.directory || 'root';
        if (!byDirectory[dir]) {
            byDirectory[dir] = [];
        }
        byDirectory[dir].push(file);
    });

    // Sort directories
    const sortedDirs = Object.keys(byDirectory).sort();

    sortedDirs.forEach(dir => {
        content += `📁 ${dir === 'root' ? '/' : dir}/\n`;
        content += `${'-'.repeat(40)}\n`;
        
        byDirectory[dir].forEach(file => {
            content += `  📄 ${file.fileName} (from: ${file.originalPath})\n`;
        });
        
        content += `\n`;
    });

    content += `\n${'='.repeat(60)}\n`;
    content += `Note: Files with duplicate names have been renamed with directory prefixes.\n`;
    content += `Original directory structure is preserved in this mapping file.\n`;

    return content;
}

// Main execution
if (require.main === module) {
    console.log('🎨 ILM Brain - Flattened Design Zip Creator');
    console.log('==========================================\n');

    // Check if archiver is available
    try {
        require.resolve('archiver');
    } catch (e) {
        console.error('❌ Missing dependency: archiver');
        console.log('📦 Please install it by running: npm install archiver');
        process.exit(1);
    }

    createFlattenedZip().catch(error => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}

module.exports = { createFlattenedZip, getAllFiles }; 