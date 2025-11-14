import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

function removeSourcemaps(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        removeSourcemaps(filePath);
      } else if (file.endsWith('.map')) {
        fs.unlinkSync(filePath);
        console.log(`✓ Removed: ${filePath}`);
      }
    });
  } catch (error) {
    console.error('Error removing sourcemaps:', error);
  }
}

removeSourcemaps(distDir);
console.log('\n✓ All .map files removed from production build');

