const fs = require('fs');
const path = require('path');

const optimizePage = (filePath, callback) => {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = callback(content);
  fs.writeFileSync(filePath, newContent);
  console.log(`Optimized: ${path.basename(filePath)} (${path.relative(process.cwd(), filePath)})`);
};

// 1. Optimize Homepage (page.jsx)
optimizePage('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\page.jsx', (content) => {
  // Update Hero section padding
  content = content.replace(
    /className="pt-48 pb-section-gap px-margin-desktop max-w-container-max mx-auto overflow-hidden"/g,
    'className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden"'
  );
  
  // Standardize capsule badge with purple look (immune to spacing/newlines)
  content = content.replace(
    /<span[^>]*className="[^"]*bg-primary-fixed[^"]*"[^>]*>[\s\S]*?Redefining[\s\S]*?Excellence[\s\S]*?<\/span>/gi,
    '<span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">Redefining Excellence in Tech</span>'
  );
  
  // Fix the Career & Business spacing collapse (immune to whitespace/newlines/entities)
  content = content.replace(
    /<h1 className="font-display-xl text-display-xl text-primary mb-8 tracking-tighter">[\s\S]*?Build,\s+Scale[\s\S]*?Your[\s\S]*?Career[\s\S]*?Business[\s\S]*?<\/h1>/gi,
    `<h1 className="font-display-xl text-display-xl text-primary mb-8 tracking-tighter leading-tight">
                        Build, Scale &amp; Accelerate Your Tech <span className="text-on-primary-container">Career</span> and Business
                    </h1>`
  );
  
  // Restrict right visual container height to ensure it fits above the fold
  content = content.replace(
    /className="relative h-\[600px\] mt-12 lg:mt-0"/g,
    'className="relative h-[360px] mt-12 lg:mt-0"'
  );
  
  return content;
});

// 2. Optimize Services Page (services/page.jsx)
optimizePage('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\services\\page.jsx', (content) => {
  // Remove absolute pt-40 from main wrapper
  content = content.replace(/<main className="pt-40">/g, '<main>');
  
  // Restructure hero section padding
  content = content.replace(
    /className="max-w-container-max mx-auto px-margin-desktop mb-section-gap"/g,
    'className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden"'
  );
  
  // Standardize capsule badge with purple look matching homepage
  content = content.replace(
    /<span[^>]*className="[^"]*text-primary text-label-md[^"]*"[^>]*>[\s\S]*?Engineered[\s\S]*?Excellence[\s\S]*?<\/span>/gi,
    '<span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">Engineered Excellence</span>'
  );
  
  // Adjust hero typography scale to match homepage display-xl style
  content = content.replace(
    /className="text-display-lg font-display-lg text-primary mb-8 leading-tight"/g,
    'className="font-display-xl text-display-xl text-primary mb-8 tracking-tighter leading-tight"'
  );
  
  return content;
});

// 3. Optimize Internship Page (internship/page.jsx)
optimizePage('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\internship\\page.jsx', (content) => {
  // Update Hero section padding
  content = content.replace(
    /className="relative pt-48 pb-24 px-margin-desktop max-w-container-max mx-auto overflow-hidden"/g,
    'className="relative pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden"'
  );
  
  // Standardize capsule badge font-size and styling
  content = content.replace(
    /<span[^>]*className="[^"]*bg-secondary-fixed[^"]*"[^>]*>[\s\S]*?Internship[\s\S]*?Cohort[\s\S]*?<\/span>/gi,
    '<span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">Internship Cohort 2024</span>'
  );
  
  // Restrict hero right-side image to h-[360px] to keep hero completely above-the-fold
  content = content.replace(/className="w-full h-\[400px\] object-cover rounded-\[24px\]"/g, 'className="w-full h-[360px] object-cover rounded-[24px]"');
  content = content.replace(/className="glass-card p-8 rounded-\[40px\] ambient-shadow relative overflow-hidden"/g, 'className="glass-card p-6 rounded-[32px] ambient-shadow relative overflow-hidden max-h-[360px]"');
  
  return content;
});

// 4. Optimize About Page (about/page.jsx)
optimizePage('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\about\\page.jsx', (content) => {
  // Update Hero section padding & remove text-center for left-alignment
  content = content.replace(
    /className="pt-48 pb-section-gap px-margin-desktop max-w-container-max mx-auto text-center"/g,
    'className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto"'
  );
  
  // Standardize capsule badge with purple look and left-align it
  content = content.replace(
    /<span[^>]*className="[^"]*bg-primary-fixed[^"]*"[^>]*>[\s\S]*?The[\s\S]*?Path[\s\S]*?Within[\s\S]*?<\/span>/gi,
    '<span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">The Path Within</span>'
  );
  
  // Remove centered text wrappers from About hero headings to achieve elegant left alignment
  content = content.replace(/mx-auto leading-tight/g, 'leading-tight');
  content = content.replace(/mx-auto mb-12/g, 'mb-8');
  
  // Downscale large hero image to h-[360px]
  content = content.replace(
    /className="w-full h-\[600px\] rounded-\[48px\] overflow-hidden glass-card p-4"/g,
    'className="w-full h-[360px] rounded-[32px] overflow-hidden glass-card p-3 mt-8"'
  );
  content = content.replace(
    /className="w-full h-full object-cover rounded-\[32px\]"/g,
    'className="w-full h-[336px] object-cover rounded-[24px]"'
  );
  
  return content;
});

// 5. Optimize Career Guidance Page (career-guidance/page.jsx)
optimizePage('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\career-guidance\\page.jsx', (content) => {
  // Update Hero section padding & element type
  content = content.replace(
    /className="pt-\[180px\] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden"/g,
    'className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden"'
  );
  
  // Standardize capsule badge with purple look
  content = content.replace(
    /<span[^>]*className="[^"]*text-primary-container[^"]*"[^>]*>[\s\S]*?EXECUTIVE[\s\S]*?CAREER[\s\S]*?ADVISORY[\s\S]*?<\/span>/gi,
    '<span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">EXECUTIVE CAREER ADVISORY</span>'
  );
  
  // Fix the aspect-square constraint on the right image to prevent massive sizes
  content = content.replace(
    /className="glass-card aspect-square rounded-\[48px\] p-8 flex items-center justify-center overflow-hidden"/g,
    'className="glass-card h-[360px] w-full rounded-[32px] p-6 flex items-center justify-center overflow-hidden"'
  );
  content = content.replace(
    /className="w-full h-full object-cover rounded-\[32px\]"/g,
    'className="w-full h-[312px] object-cover rounded-[24px]"'
  );
  
  // Standardize salary growth absolute widget to sit neatly on h-[360px]
  content = content.replace(
    /className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl shadow-xl hidden md:block"/g,
    'className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl shadow-lg hidden md:block"'
  );
  
  return content;
});

console.log("Global layout optimization complete!");
