const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const enumMappings = {
  TenantStatus: '["ACTIVE", "SUSPENDED", "PENDING"]',
  UserRole: '["SUPER_ADMIN", "ADMIN", "CUSTOMER"]',
  OrderStatus: '["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]',
  PaymentStatus: '["CREATED", "SUCCESS", "FAILED"]',
  SessionScope: '["PLATFORM", "TENANT"]',
  ImpersonationStatus: '["ACTIVE", "ENDED", "EXPIRED"]'
};

const enumNames = Object.keys(enumMappings);

walk(dir, function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    // 1. Replace Enum.VALUE with "VALUE"
    const regex = new RegExp(`(?<!["'])(${enumNames.join('|')})\\.([A-Z_]+)(?!["'])`, 'g');
    newContent = newContent.replace(regex, '"$2"');

    // 2. Replace z.nativeEnum(Enum) with z.enum([...])
    enumNames.forEach(e => {
        const zodRegex = new RegExp(`z\\.nativeEnum\\(${e}\\)`, 'g');
        newContent = newContent.replace(zodRegex, `z.enum(${enumMappings[e]})`);
    });

    // 3. Remove enum references from @prisma/client imports
    enumNames.forEach(e => {
        const importRegex = new RegExp(`\\b${e}\\b\\s*,?\\s*`, 'g');
        const lines = newContent.split('\n');
        for(let i=0; i<lines.length; i++) {
            if (lines[i].includes('@prisma/client') && lines[i].includes('import')) {
                lines[i] = lines[i].replace(importRegex, '');
                // Clean up empty imports
                if (lines[i].includes('import {  }')) {
                    lines[i] = '';
                }
            }
        }
        newContent = lines.join('\n');
    });

    // 4. Replace variable types from Enum to string
    enumNames.forEach(e => {
        newContent = newContent.replace(new RegExp(`:\\s*${e}(?=\\s|\\(|\\[|;|\\n|\\)|,)`, 'g'), ': string');
        newContent = newContent.replace(new RegExp(`<${e}>`, 'g'), '<string>');
        newContent = newContent.replace(new RegExp(`${e}\\[\\]`, 'g'), 'string[]');
        newContent = newContent.replace(new RegExp(`as\\s+${e}(?=\\s|\\(|\\[|;|\\n|\\)|,)`, 'g'), 'as string');
    });

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
