#!/usr/bin/env node
import { getCachedDiff, parseDiffForLogs } from './git-utils';
import { printResults } from './print-utils';

const main = async () => {
  const args = process.argv.slice(2);
  const failOnFound = args.includes('--fail-on-found');

  const diff = getCachedDiff();
  if (!diff) process.exit(0);

  const matches = parseDiffForLogs(diff);
  if (!matches.length) process.exit(0);

  printResults(matches, failOnFound);

  if (failOnFound) process.exit(1);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
