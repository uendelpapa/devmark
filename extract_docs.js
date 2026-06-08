const fs = require('fs');
const content = fs.readFileSync('C:/Users/Administrador/.gemini/antigravity-ide/brain/b42f58bc-64ff-441a-8a63-d11579d701e6/.system_generated/steps/602/content.md', 'utf-8');

const pages = content.split('<page url="');

const inputPage = pages.find(p => p.startsWith('/en/docs/react/components/input">'));
if (inputPage) fs.writeFileSync('input_docs.md', inputPage);

const selectPage = pages.find(p => p.startsWith('/en/docs/react/components/select">'));
if (selectPage) fs.writeFileSync('select_docs.md', selectPage);

console.log('Docs extracted:', !!inputPage, !!selectPage);
