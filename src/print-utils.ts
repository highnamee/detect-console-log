import type { Match } from './types';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

const colorize = (text: string, color: keyof typeof colors) => {
  return `${colors[color]}${text}${colors.reset}`;
};

export const printResults = (matches: Match[], failOnFound: boolean) => {
  if (!matches.length) return;

  console.log();

  if (failOnFound) {
    console.log(colorize('❌ Console Log Checker Error ❌', 'red'));
    console.log(colorize('━'.repeat(50), 'red'));
  } else {
    console.log(colorize('⚠️  Console Log Checker Warning ⚠️', 'yellow'));
    console.log(colorize('━'.repeat(40), 'yellow'));
  }

  console.log(
    colorize(
      `Found ${colorize(matches.length.toString(), 'bright')} console.log${
        matches.length > 1 ? 's' : ''
      } in staged changes:`,
      'white'
    )
  );

  console.log();

  const grouped = new Map<string, Match[]>();

  for (const m of matches) {
    if (!grouped.has(m.file)) grouped.set(m.file, []);
    grouped.get(m.file)!.push(m);
  }

  for (const [f, rows] of grouped) {
    console.log(colorize(`📁 ${f}`, 'cyan'));
    for (const { line, text } of rows) {
      const snippet = text.length > 200 ? text.slice(0, 197) + '…' : text;
      console.log(colorize(`   ↳ L${line}:`, 'gray') + ' ' + colorize(snippet.trim(), 'magenta'));
    }
    console.log(); // Add spacing between files
  }

  console.log();
};
