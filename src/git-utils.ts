import { execSync } from 'child_process';
import type { Match } from './types';

export function run(cmd: string): string {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

export function tryRun(cmd: string): string {
  try {
    return run(cmd);
  } catch {
    return '';
  }
}

export function hasHead(): boolean {
  try {
    execSync('git rev-parse --verify HEAD', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getEmptyTreeOid(): string {
  return run('git hash-object -t tree /dev/null');
}

export function getCachedDiff(): string {
  const base = hasHead() ? 'HEAD' : getEmptyTreeOid();
  return tryRun(`git diff --cached --unified=0 --no-color --diff-filter=ACMR ${base}`);
}

const parseFileName = (line: string): string | null => {
  const path = line.slice(4).trim();
  return path === '/dev/null' ? null : path.replace(/^([ab]\/)*/, '');
};

const parseHunkLine = (line: string): number => {
  const hunkRe = /@@\s*-\d+(?:,\d+)?\s*\+(\d+)(?:,(\d+))?\s*@@/;
  const match = hunkRe.exec(line);
  return match ? Number(match[1]) || 0 : 0;
};

const isAddedLine = (line: string): boolean => {
  return line.startsWith('+') && !line.startsWith('+++');
};

const hasConsoleLog = (text: string): boolean => {
  return /\bconsole\.log\b/.test(text);
};

export const parseDiffForLogs = (diff: string): Match[] => {
  const results: Match[] = [];
  let file: string | null = null;
  let nextLine = 0;

  for (const raw of diff.split('\n')) {
    if (raw.startsWith('diff --git ')) {
      file = null;
      continue;
    }

    if (raw.startsWith('+++ ')) {
      file = parseFileName(raw);
      continue;
    }

    if (!file) continue;

    if (raw.startsWith('@@')) {
      nextLine = parseHunkLine(raw);
      continue;
    }

    if (isAddedLine(raw)) {
      const added = raw.slice(1);
      if (hasConsoleLog(added)) {
        results.push({ file, line: nextLine, text: added });
      }
      nextLine += 1;
    }
  }
  return results;
};
