const fs = require('fs');
const path = require('path');
const parser = require('comment-parser');

// Список директорий и файлов, которые нужно исключить
const EXCLUDED_FOLDERS = ['node_modules', 'test', '.devcontainer', '.gitlab'];

// Функция для обработки одного файла
function processFile(filePath, outputDir) {
  const code = fs.readFileSync(filePath, 'utf-8');

  // Используем регулярное выражение для поиска JSDoc и следующей сигнатуры функции
  const result = code.replace(/\/\*\*([\s\S]*?)\*\/\n([^{]*\([\s\S]*?\))/g, (match, jsdoc, funcSignature) => {
    const parsedJsdoc = parser.parse(`/**${jsdoc}*/`)[0];
    const paramTypes = [];
    let returnType = 'void';

    // Извлекаем типы из JSDoc
    parsedJsdoc.tags.forEach(tag => {
      if (tag.tag === 'param') {
        const type = tag.type;
        const paramName = tag.name;
        paramTypes.push(`${paramName}: ${type}`);
      } else if (tag.tag === 'returns' || tag.tag === 'return') {
        returnType = tag.type || 'void';
      }
    });

    // Создаём сигнатуру функции с TypeScript типами
    const paramsWithTypes = paramTypes.join(', ');
    const funcWithTypes = funcSignature.replace(
      /\(([\s\S]*?)\)/,
      `(${paramsWithTypes}): ${returnType}`
    );

    // Включаем `/**` и `*/` обратно в комментарий
    return `/**${jsdoc}*/\n${funcWithTypes}`;
  });

  // Создаём путь для нового файла в выходной директории
  const relativePath = path.relative(process.cwd(), filePath);
  const outputFilePath = path.join(outputDir, relativePath);

  // Убедимся, что директория для файла существует
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Сохраняем преобразованный файл
  fs.writeFileSync(outputFilePath, result, 'utf-8');
  console.log(`File processed and saved as ${outputFilePath}`);
}

// Рекурсивная функция для обхода всех файлов в папке
function processDirectory(inputDir, outputDir) {
  const items = fs.readdirSync(inputDir);

  items.forEach(item => {
    const fullPath = path.join(inputDir, item);
    const stat = fs.statSync(fullPath);

    // Пропускаем исключённые папки
    if (stat.isDirectory() && EXCLUDED_FOLDERS.includes(item)) {
      return;
    }

    // Если это папка, обрабатываем её рекурсивно
    if (stat.isDirectory()) {
      processDirectory(fullPath, outputDir);
    }

    // Если это JavaScript файл, обрабатываем его
    if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.mjs'))) {
      processFile(fullPath, outputDir);
    }
  });
}

// Основная функция для обработки проекта
function processProject() {
  const outputDir = path.join(process.cwd(), 'jsdoc-to-ts-project');

  // Создаем новую директорию для обработанного проекта
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Начинаем обработку из текущей директории проекта
  processDirectory(process.cwd(), outputDir);
}

processProject();
