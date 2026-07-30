import { execFile } from 'node:child_process';

const COMMAND_MAX_BUFFER = 16 * 1024 * 1024;

export class PackPublishError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PackPublishError';
  }
}

export function githubRepositoryFromRemoteUrl(remoteUrl) {
  const normalized = String(remoteUrl).trim().replaceAll('\\', '/');
  const match = normalized.match(
    /^(?:https?:\/\/|ssh:\/\/git@|git@)?github\.com(?::|\/)([^/]+)\/([^/#]+?)(?:\.git)?$/i,
  );
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

export function validateArtifactId(artifactId) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(String(artifactId))) {
    throw new PackPublishError(
      `Pack publish refused: "${artifactId}" is not a release-safe artifact id.`,
    );
  }
  return String(artifactId);
}

function runCommand(command, args, { cwd, allowFailure = false } = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        cwd,
        encoding: 'utf8',
        maxBuffer: COMMAND_MAX_BUFFER,
        windowsHide: true,
      },
      (error, stdout = '', stderr = '') => {
        const result = {
          command,
          args,
          status: error?.code ?? 0,
          stdout,
          stderr,
        };
        if (!error || allowFailure) {
          resolve(result);
          return;
        }
        const detail = stderr.trim() || stdout.trim() || error.message;
        reject(new Error(detail));
      },
    );
  });
}

function dirtyTreeMessage(statusOutput) {
  const paths = statusOutput
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const shown = paths.slice(0, 12).map((line) => `  ${line}`);
  if (paths.length > shown.length) {
    shown.push(`  ...and ${paths.length - shown.length} more path(s)`);
  }
  return [
    'Pack publish refused: the working tree has uncommitted changes.',
    'Commit or remove these changes before exporting:',
    ...shown,
    'Packs must be reproduced from a clean, pushed GitHub commit.',
  ].join('\n');
}

async function githubRemote(root, run) {
  const remotesResult = await run('git', ['remote'], { cwd: root });
  const remoteNames = remotesResult.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const orderedNames = [
    ...remoteNames.filter((name) => name === 'origin'),
    ...remoteNames.filter((name) => name !== 'origin'),
  ];

  for (const name of orderedNames) {
    const urlResult = await run('git', ['remote', 'get-url', name], { cwd: root });
    const url = urlResult.stdout.trim();
    const repository = githubRepositoryFromRemoteUrl(url);
    if (repository) return { name, repository, url };
  }

  throw new PackPublishError(
    'Pack publish refused: this checkout has no GitHub remote. '
    + 'A pushed GitHub commit is required before exporting.',
  );
}

export async function requirePublishableGitHead(
  root,
  { commandRunner = runCommand } = {},
) {
  const statusResult = await commandRunner(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    { cwd: root },
  );
  if (statusResult.stdout.trim()) {
    throw new PackPublishError(dirtyTreeMessage(statusResult.stdout));
  }

  const headResult = await commandRunner('git', ['rev-parse', 'HEAD'], { cwd: root });
  const sourceCommit = headResult.stdout.trim();
  const remote = await githubRemote(root, commandRunner);

  try {
    await commandRunner(
      'git',
      ['fetch', '--quiet', '--prune', remote.name],
      { cwd: root },
    );
  } catch (error) {
    throw new PackPublishError(
      `Pack publish refused: GitHub remote "${remote.name}" could not be refreshed. `
      + `${error.message}`,
    );
  }

  const containsResult = await commandRunner(
    'git',
    ['branch', '-r', '--contains', sourceCommit],
    { cwd: root },
  );
  const remotePrefix = `${remote.name}/`;
  const containingBranches = containsResult.stdout
    .split(/\r?\n/)
    .map((line) => line.replace(/^[*\s]+/, '').trim())
    .filter((line) => line.startsWith(remotePrefix) && !line.includes(' -> '));

  if (containingBranches.length === 0) {
    throw new PackPublishError(
      `Pack publish refused: HEAD ${sourceCommit} is not present on any branch `
      + `of GitHub remote "${remote.name}" (${remote.repository}).\n`
      + 'Push this commit before exporting.',
    );
  }

  return {
    sourceCommit,
    remoteName: remote.name,
    repository: remote.repository,
    containingBranches,
  };
}

export async function requireGitHubReleaseReady(
  {
    root,
    remoteName,
    repository,
    artifactId,
  },
  { commandRunner = runCommand } = {},
) {
  const releaseTag = validateArtifactId(artifactId);
  const authResult = await commandRunner(
    'gh',
    ['auth', 'status', '--hostname', 'github.com'],
    { cwd: root, allowFailure: true },
  );
  if (authResult.status !== 0) {
    const detail = authResult.stderr.trim() || authResult.stdout.trim();
    throw new PackPublishError(
      'Pack publish refused: GitHub CLI authentication is unavailable. '
      + 'Run "gh auth login" and retry.'
      + (detail ? `\n${detail}` : ''),
    );
  }

  const tagResult = await commandRunner(
    'git',
    ['ls-remote', '--tags', remoteName, `refs/tags/${releaseTag}`],
    { cwd: root },
  );
  if (tagResult.stdout.trim()) {
    throw new PackPublishError(
      `Pack publish refused: GitHub tag "${releaseTag}" already exists in `
      + `${repository}. Artifact ids are immutable; use a new artifact id.`,
    );
  }

  return { releaseTag };
}

export async function publishGitHubRelease(
  {
    root,
    repository,
    artifactId,
    sourceCommit,
    title,
    notes,
    assets,
  },
  { commandRunner = runCommand } = {},
) {
  const releaseTag = validateArtifactId(artifactId);
  const result = await commandRunner(
    'gh',
    [
      'release',
      'create',
      releaseTag,
      ...assets,
      '--repo',
      repository,
      '--target',
      sourceCommit,
      '--title',
      title,
      '--notes',
      notes,
      '--latest=false',
    ],
    { cwd: root },
  );
  return result.stdout.trim();
}
