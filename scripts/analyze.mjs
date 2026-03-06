import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                files.push(name);
            }
        }
    }
    return files;
}

const actionFiles = getFiles(path.join(process.cwd(), 'src/app/actions'));
const apiFiles = getFiles(path.join(process.cwd(), 'src/app/api'));
const allFiles = [...actionFiles, ...apiFiles];

const results = [];

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = file.replace(process.cwd() + path.sep, '').replace(/\\/g, '/');

    const isAdminLabeled = relativePath.includes('/admin/') || relativePath.includes('/users/create') || relativePath.includes('delete-user');

    // Splitting by export function to easily grab bodies
    const parts = content.split(/export\s+(?:async\s+)?function\s+/);

    // The first part is before any export function, skip it
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];

        // The function name is the first word before the parenthesis
        const funcNameMatch = part.match(/^([A-Za-z0-9_]+)\s*\(/);
        if (!funcNameMatch) continue;

        const funcName = funcNameMatch[1];

        const dbAccess = part.includes('prisma.') || part.includes('prisma_1');
        const authPresence = part.includes('getAdminSession') || part.includes('auth.api.getSession') || part.includes('requireAdmin');

        let category = isAdminLabeled ? 'Admin-labeled' : 'Utility/Internal';
        if (!isAdminLabeled && (funcName === 'DELETE' || funcName === 'PATCH' || funcName === 'POST' || funcName === 'PUT' || funcName.toLowerCase().includes('admin'))) {
            category = 'Admin-labeled'; // Broaden admin categorization for mutating endpoints outside /admin
        }

        results.push({
            fileName: relativePath,
            funcName: funcName,
            category: category,
            dbAccess: dbAccess,
            authPresence: authPresence
        });
    }
}

const total = results.length;
const adminLabeled = results.filter(r => r.category === 'Admin-labeled');
const adminNoAuth = adminLabeled.filter(r => !r.authPresence);
const pctAdminNoAuth = adminLabeled.length ? (adminNoAuth.length / adminLabeled.length) * 100 : 0;

const utilityDB = results.filter(r => r.category === 'Utility/Internal' && r.dbAccess);
const utilityDBNoAuth = utilityDB.filter(r => !r.authPresence);
const pctUtilityDBNoAuth = utilityDB.length ? (utilityDBNoAuth.length / utilityDB.length) * 100 : 0;

const output = {
    results,
    stats: {
        total,
        adminLabeled: adminLabeled.length,
        adminNoAuth: adminNoAuth.length,
        pctAdminNoAuth,
        utilityDB: utilityDB.length,
        utilityDBNoAuth: utilityDBNoAuth.length,
        pctUtilityDBNoAuth
    }
};

fs.writeFileSync('analyze_out.json', JSON.stringify(output, null, 2));
console.log('Done');
