const fs = require('fs');

const convertToJsx = (htmlFile, outputFile) => {
  let html = fs.readFileSync(htmlFile, 'utf8');
  let mainContent = '';
  
  const bodyMatch = html.match(/<\/nav>([\s\S]*?)<footer/i);
  if (bodyMatch) {
     mainContent = bodyMatch[1];
  } else {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    mainContent = mainMatch ? mainMatch[1] : html;
  }

  // Replace class= with className=
  mainContent = mainContent.replace(/class=/g, 'className=');
  // Handle self closing tags
  mainContent = mainContent.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
  mainContent = mainContent.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
  mainContent = mainContent.replace(/<br>/g, '<br />');
  mainContent = mainContent.replace(/<hr([^>]*[^\/])?>/g, '<hr$1 />');
  
  // Replace style="..." with style={{...}}
  mainContent = mainContent.replace(/style="([^"]*)"/g, (match, p1) => {
    if (p1.includes('radial-gradient')) {
      return `style={{ background: '${p1.replace('background: ', '').replace(';', '')}' }}`;
    }
    if (p1.includes('font-variation-settings')) {
      return `style={{ fontVariationSettings: '${p1.replace('font-variation-settings: ', '').replace(/;/g, '').replace(/'/g, '"')}' }}`;
    }
    return match; // fallback
  });
  
  // HTML comments to JSX comments
  mainContent = mainContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  const jsxTemplate = `import Link from 'next/link';

export default function Page() {
  return (
    <>
      ${mainContent}
    </>
  );
}
`;
  fs.writeFileSync(outputFile, jsxTemplate);
};

convertToJsx('d:\\\\Spring\\\\PathForgeSolutions\\\\sampleUI\\\\home.html', 'd:\\\\Spring\\\\PathForgeSolutions\\\\Frontend\\\\src\\\\app\\\\(public)\\\\page.jsx');
convertToJsx('d:\\\\Spring\\\\PathForgeSolutions\\\\sampleUI\\\\internship.html', 'd:\\\\Spring\\\\PathForgeSolutions\\\\Frontend\\\\src\\\\app\\\\(public)\\\\internship\\\\page.jsx');
convertToJsx('d:\\\\Spring\\\\PathForgeSolutions\\\\sampleUI\\\\careerGuidance.html', 'd:\\\\Spring\\\\PathForgeSolutions\\\\Frontend\\\\src\\\\app\\\\(public)\\\\career-guidance\\\\page.jsx');
convertToJsx('d:\\\\Spring\\\\PathForgeSolutions\\\\sampleUI\\\\service.html', 'd:\\\\Spring\\\\PathForgeSolutions\\\\Frontend\\\\src\\\\app\\\\(public)\\\\services\\\\page.jsx');
console.log("Conversion complete");
