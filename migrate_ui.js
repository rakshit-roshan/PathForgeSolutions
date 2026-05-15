const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Frontend-Sample', 'src');
const destDir = path.join(__dirname, 'Frontend', 'src');

function migrateFile(content) {
    let newContent = content;

    // React Router Dom to Next.js
    newContent = newContent.replace(/import\s+{([^}]*)}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
        let replacements = [];
        if (imports.includes('Link')) replacements.push(`import Link from "next/link";`);
        if (imports.includes('useLocation')) replacements.push(`import { usePathname } from "next/navigation";`);
        return replacements.join('\n');
    });

    // Replace Link 'to' with 'href'
    newContent = newContent.replace(/<Link([^>]+)to=/g, '<Link$1href=');
    
    // Replace useLocation
    newContent = newContent.replace(/const location = useLocation\(\);/g, 'const pathname = usePathname();\n  const location = { pathname };');

    // Add use client if it has hooks
    if (newContent.includes('useState') || newContent.includes('useEffect') || newContent.includes('usePathname')) {
        newContent = `"use client";\n\n` + newContent;
    }

    // Fix images imports
    newContent = newContent.replace(/from '\.\.\/utils\/images'/g, `from '@/utils/images'`);

    return newContent;
}

// Ensure dir exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Copy pages to app/(public)
const pagesDir = path.join(srcDir, 'pages');
const pages = ['Home', 'About', 'Services', 'Internship', 'CareerGuidance', 'JobConsultancy', 'Contact'];

const pageToRoute = {
    'Home': '',
    'About': 'about',
    'Services': 'services',
    'Internship': 'internship',
    'CareerGuidance': 'career-guidance',
    'JobConsultancy': 'job-consultancy',
    'Contact': 'contact'
};

pages.forEach(page => {
    const srcFile = path.join(pagesDir, `${page}.jsx`);
    if (fs.existsSync(srcFile)) {
        let content = fs.readFileSync(srcFile, 'utf8');
        content = migrateFile(content);
        const route = pageToRoute[page];
        const destFolder = path.join(destDir, 'app', '(public)', route);
        ensureDir(destFolder);
        fs.writeFileSync(path.join(destFolder, 'page.tsx'), content);
        console.log(`Migrated ${page}.jsx to (public)/${route}/page.tsx`);
    }
});

// 2. Copy components
const componentsToMigrate = ['Header.jsx', 'Footer.jsx', 'Navbar.jsx'];
const componentsDest = path.join(destDir, 'components', 'layout');
ensureDir(componentsDest);

componentsToMigrate.forEach(comp => {
    const srcFile = path.join(srcDir, 'components', comp);
    if (fs.existsSync(srcFile)) {
        let content = fs.readFileSync(srcFile, 'utf8');
        content = migrateFile(content);
        fs.writeFileSync(path.join(componentsDest, comp.replace('.jsx', '.tsx')), content);
        console.log(`Migrated ${comp}`);
    }
});

// 3. Copy utils/images.js
const utilsDest = path.join(destDir, 'utils');
ensureDir(utilsDest);
const imagesSrc = path.join(srcDir, 'utils', 'images.js');
if (fs.existsSync(imagesSrc)) {
    fs.copyFileSync(imagesSrc, path.join(utilsDest, 'images.js'));
    console.log(`Copied images.js`);
}

// 4. Update layout.tsx
const layoutFile = path.join(destDir, 'app', '(public)', 'layout.tsx');
if (fs.existsSync(layoutFile)) {
    let layoutContent = fs.readFileSync(layoutFile, 'utf8');
    layoutContent = layoutContent.replace(/import Navbar from "@\/components\/layout\/Navbar";/g, 'import Header from "@/components/layout/Header";');
    layoutContent = layoutContent.replace(/<Navbar \/>/g, '<Header />');
    fs.writeFileSync(layoutFile, layoutContent);
    console.log('Updated layout.tsx');
}

console.log("Migration script complete.");
