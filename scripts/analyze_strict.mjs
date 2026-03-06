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

const funcRegex = /export\s+(?:async\s+)?(?:function\s+([A-Za-z0-9_]+)\s*\(|const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?(?:\([\s\S]*?\)|[A-Za-z0-9_]+)\s*=>)/g;

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = file.replace(process.cwd() + path.sep, '').replace(/\\/g, '/');

    let match;
    const matches = [];
    while ((match = funcRegex.exec(content)) !== null) {
        matches.push({
            name: match[1] || match[2],
            index: match.index
        });
    }

    for (let i = 0; i < matches.length; i++) {
        const funcName = matches[i].name;
        const startIndex = matches[i].index;
        const endIndex = (i + 1 < matches.length) ? matches[i + 1].index : content.length;
        const part = content.substring(startIndex, endIndex);

        const isDbWrite = /prisma\.[a-zA-Z0-9_]+\.(create|update|delete|upsert|updateMany|deleteMany)\b/.test(part) ||
            /prisma\.\$transaction\b/.test(part) ||
            /prisma\.\$executeRaw\b/.test(part) ||
            /prisma\.\$queryRaw\b/.test(part);

        const isAuth = /getAdminSession\s*\(/.test(part) || /getServerSession\s*\(/.test(part) || /auth\.api\.getSession\s*\(/.test(part) || /requireAdmin\s*\(/.test(part);

        const isAdminLabeled = /admin|delete|manage|moderate/i.test(funcName) || /admin|delete|manage|moderate/i.test(relativePath);
        const category = isAdminLabeled ? 'Admin' : 'Utility';

        results.push({
            functionName: funcName,
            filePath: relativePath,
            category: category,
            dbWrite: isDbWrite ? 'Yes' : 'No',
            auth: isAuth ? 'Yes' : 'No'
        });
    }
}

const total = results.length;
const dbWrites = results.filter(r => r.dbWrite === 'Yes');
const totalDbWrites = dbWrites.length;

const adminDbWrites = dbWrites.filter(r => r.category === 'Admin');
const adminDbWritesNoAuth = adminDbWrites.filter(r => r.auth === 'No');
const pctAdminDbNoAuth = adminDbWrites.length ? ((adminDbWritesNoAuth.length / adminDbWrites.length) * 100).toFixed(2) : 0;

const utilityDbWrites = dbWrites.filter(r => r.category === 'Utility');
const utilityDbWritesNoAuth = utilityDbWrites.filter(r => r.auth === 'No');
const pctUtilityDbNoAuth = utilityDbWrites.length ? ((utilityDbWritesNoAuth.length / utilityDbWrites.length) * 100).toFixed(2) : 0;

const adminAuth = results.filter(r => r.category === 'Admin' && r.auth === 'Yes').length;
const adminNoAuth = results.filter(r => r.category === 'Admin' && r.auth === 'No').length;
const utilityAuth = results.filter(r => r.category === 'Utility' && r.auth === 'Yes').length;
const utilityNoAuth = results.filter(r => r.category === 'Utility' && r.auth === 'No').length;

const rowAdmin = adminAuth + adminNoAuth;
const rowUtility = utilityAuth + utilityNoAuth;
const colAuth = adminAuth + utilityAuth;
const colNoAuth = adminNoAuth + utilityNoAuth;
const grandTotal = results.length;

function expected(rowTotal, colTotal, grand) {
    if (grand === 0) return 0;
    return (rowTotal * colTotal) / grand;
}

const eAdminAuth = expected(rowAdmin, colAuth, grandTotal);
const eAdminNoAuth = expected(rowAdmin, colNoAuth, grandTotal);
const eUtilityAuth = expected(rowUtility, colAuth, grandTotal);
const eUtilityNoAuth = expected(rowUtility, colNoAuth, grandTotal);

function chiSquareTerm(o, e) {
    if (e === 0) return 0;
    return Math.pow(o - e, 2) / e;
}

const chiSquare = (chiSquareTerm(adminAuth, eAdminAuth) +
    chiSquareTerm(adminNoAuth, eAdminNoAuth) +
    chiSquareTerm(utilityAuth, eUtilityAuth) +
    chiSquareTerm(utilityNoAuth, eUtilityNoAuth)).toFixed(4);

const csvHeader = 'Function Name,File Path,Semantic Category,Database Write,Authentication Present\n';
const csvRows = results.map(r => `${r.functionName},${r.filePath},${r.category},${r.dbWrite},${r.auth}`).join('\n');
const csv = csvHeader + csvRows;

const output = {
    csv,
    metrics: {
        total,
        totalDbWrites,
        pctAdminDbNoAuth: `${pctAdminDbNoAuth}%`,
        pctUtilityDbNoAuth: `${pctUtilityDbNoAuth}%`,
        contingencyTable: {
            admin: { auth: adminAuth, noAuth: adminNoAuth },
            utility: { auth: utilityAuth, noAuth: utilityNoAuth }
        },
        chiSquare
    }
};

fs.writeFileSync('strict_analyze_out.json', JSON.stringify(output, null, 2));
console.log('Done');
