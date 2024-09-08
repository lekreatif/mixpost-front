import fs from 'fs'
import path from 'path'

function generateDirectoryStructure(startPath, output = '') {
  const files = fs.readdirSync(startPath)

  files.forEach((file) => {
    if (file === 'node_modules' || file === '.git') return

    const filePath = path.join(startPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      output += `${filePath}\n`
      output = generateDirectoryStructure(filePath, output)
    } else {
      output += `${filePath}\n`
    }
  })

  return output
}

const projectRoot = './' // Assurez-vous que ce chemin pointe vers la racine de votre projet
const structure = generateDirectoryStructure(projectRoot)

fs.writeFileSync('front_project_structure.txt', structure, 'utf8')
console.log('Structure du projet générée dans project_structure.txt')
