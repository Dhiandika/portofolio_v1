const fs = require('fs');
const path = require('path');

const skillsData = [
    { name: "Astro.js", icon: "Astro", category: "Frontend" },
    { name: "TailwindCSS", icon: "Tailwind", category: "Frontend" },
    { name: "Streamlit", icon: "Streamlit", category: "Frontend" },
    { name: "JavaScript", icon: "JavaScript", category: "Frontend" },
    { name: "TypeScript", icon: "TypeScript", category: "Frontend" },
    { name: "HTML", icon: "HTML", category: "Frontend" },
    { name: "CSS", icon: "CSS", category: "Frontend" },
    { name: "React.js", icon: "React", category: "Frontend" },
    { name: "Next.js", icon: "Next.js", category: "Frontend" },
    { name: "Python", icon: "Python", category: "Backend" },
    { name: "Flask", icon: "Flask", category: "Backend" },
    { name: "Node.js", icon: "Node.js", category: "Backend" },
    { name: "Express.js", icon: "Express", category: "Backend" },
    { name: "Go", icon: "Go", category: "Backend" },
    { name: "MySQL", icon: "MySQL", category: "Database" },
    { name: "PostgreSQL", icon: "PostgreSQL", category: "Database" },
    { name: "Firebase", icon: "Firebase", category: "Database" },
    { name: "Supabase", icon: "Supabase", category: "Database" },
    { name: "Git", icon: "Git", category: "Tools" },
    { name: "GitHub", icon: "Github", category: "Tools" },
    { name: "GCP", icon: "Google Cloud", category: "Tools" },
    { name: "Docker", icon: "Docker", category: "Tools" },
    { name: "VS Code", icon: "VSCode", category: "Tools" },
    { name: "TensorFlow", icon: "TensorFlow", category: "Machine Learning" },
    { name: "Keras", icon: "Keras", category: "Machine Learning" },
    { name: "Tesseract.js", icon: "Tesseract", category: "Machine Learning" },
];

// Write single JSON file
const destPath = path.join(__dirname, 'src', 'content', 'site', 'techstack.json');
fs.writeFileSync(destPath, JSON.stringify({ skills: skillsData }, null, 2), 'utf8');
console.log('Created src/content/site/techstack.json');

// Delete old skills folder
const oldDir = path.join(__dirname, 'src', 'content', 'skills');
if (fs.existsSync(oldDir)) {
    fs.rmSync(oldDir, { recursive: true, force: true });
    console.log('Deleted src/content/skills folder');
}

// Delete the old generator
const oldGen = path.join(__dirname, 'generate_skills.cjs');
if (fs.existsSync(oldGen)) {
    fs.unlinkSync(oldGen);
}
