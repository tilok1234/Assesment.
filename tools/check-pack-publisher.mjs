import assert from 'node:assert/strict';

import {
  githubRepositoryFromRemoteUrl,
  publishGitHubRelease,
  requireGitHubReleaseReady,
  requirePublishableGitHead,
  validateArtifactId,
} from './pack-publisher.mjs';

function result(stdout = '', status = 0, stderr = '') {
  return { stdout, status, stderr };
}

function gitGateRunner({ status = '', branches = '  origin/main\n' } = {}) {
  const calls = [];
  const commandRunner = async (command, args) => {
    calls.push([command, ...args]);
    const key = `${command} ${args.join(' ')}`;
    if (key === 'git status --porcelain=v1 --untracked-files=all') {
      return result(status);
    }
    if (key === 'git rev-parse HEAD') return result('0123456789abcdef\n');
    if (key === 'git remote') return result('origin\n');
    if (key === 'git remote get-url origin') {
      return result('https://github.com/tilok1234/8-bit-sprite-assembler.git\n');
    }
    if (key === 'git fetch --quiet --prune origin') return result();
    if (key === 'git branch -r --contains 0123456789abcdef') {
      return result(branches);
    }
    throw new Error(`Unexpected command in test: ${key}`);
  };
  return { calls, commandRunner };
}

assert.equal(
  githubRepositoryFromRemoteUrl(
    'https://github.com/tilok1234/8-bit-sprite-assembler.git',
  ),
  'tilok1234/8-bit-sprite-assembler',
);
assert.equal(
  githubRepositoryFromRemoteUrl(
    'git@github.com:tilok1234/8-bit-sprite-assembler.git',
  ),
  'tilok1234/8-bit-sprite-assembler',
);
assert.equal(githubRepositoryFromRemoteUrl('https://example.com/a/b.git'), null);
assert.equal(validateArtifactId('established-boss-pack-13-v1'), 'established-boss-pack-13-v1');
assert.throws(() => validateArtifactId('bad artifact id'), /release-safe artifact id/);

{
  const gate = gitGateRunner({ status: ' M README.md\n?? local-draft.png\n' });
  await assert.rejects(
    requirePublishableGitHead('repo', gate),
    /working tree has uncommitted changes[\s\S]*README\.md[\s\S]*local-draft\.png/,
  );
  assert.deepEqual(gate.calls, [[
    'git',
    'status',
    '--porcelain=v1',
    '--untracked-files=all',
  ]]);
}

{
  const gate = gitGateRunner({ branches: '' });
  await assert.rejects(
    requirePublishableGitHead('repo', gate),
    /HEAD 0123456789abcdef is not present on any branch/,
  );
}

{
  const gate = gitGateRunner({
    branches: '  origin/HEAD -> origin/main\n  origin/main\n',
  });
  const publishable = await requirePublishableGitHead('repo', gate);
  assert.equal(publishable.sourceCommit, '0123456789abcdef');
  assert.equal(publishable.repository, 'tilok1234/8-bit-sprite-assembler');
  assert.deepEqual(publishable.containingBranches, ['origin/main']);
}

{
  const calls = [];
  const commandRunner = async (command, args) => {
    calls.push([command, ...args]);
    if (command === 'gh') return result();
    if (command === 'git') return result();
    throw new Error(`Unexpected command in test: ${command}`);
  };
  const ready = await requireGitHubReleaseReady(
    {
      root: 'repo',
      remoteName: 'origin',
      repository: 'tilok1234/8-bit-sprite-assembler',
      artifactId: 'established-boss-pack-13-v1',
    },
    { commandRunner },
  );
  assert.equal(ready.releaseTag, 'established-boss-pack-13-v1');
  assert.deepEqual(calls[0], ['gh', 'auth', 'status', '--hostname', 'github.com']);
  assert.deepEqual(calls[1], [
    'git',
    'ls-remote',
    '--tags',
    'origin',
    'refs/tags/established-boss-pack-13-v1',
  ]);
}

{
  const commandRunner = async (command) => (
    command === 'gh'
      ? result()
      : result('feedface\trefs/tags/established-boss-pack-13-v1\n')
  );
  await assert.rejects(
    requireGitHubReleaseReady(
      {
        root: 'repo',
        remoteName: 'origin',
        repository: 'tilok1234/8-bit-sprite-assembler',
        artifactId: 'established-boss-pack-13-v1',
      },
      { commandRunner },
    ),
    /tag "established-boss-pack-13-v1" already exists/,
  );
}

{
  let releaseCall = null;
  const commandRunner = async (command, args) => {
    releaseCall = [command, ...args];
    return result('https://github.com/tilok1234/8-bit-sprite-assembler/releases/tag/established-boss-pack-13-v1\n');
  };
  const releaseUrl = await publishGitHubRelease(
    {
      root: 'repo',
      repository: 'tilok1234/8-bit-sprite-assembler',
      artifactId: 'established-boss-pack-13-v1',
      sourceCommit: '0123456789abcdef',
      title: 'Established Boss Pack - 13 Bosses',
      notes: 'Source commit: 0123456789abcdef',
      assets: ['pack.zip', 'pack.zip.manifest.json'],
    },
    { commandRunner },
  );
  assert.match(releaseUrl, /releases\/tag\/established-boss-pack-13-v1$/);
  assert.deepEqual(releaseCall, [
    'gh',
    'release',
    'create',
    'established-boss-pack-13-v1',
    'pack.zip',
    'pack.zip.manifest.json',
    '--repo',
    'tilok1234/8-bit-sprite-assembler',
    '--target',
    '0123456789abcdef',
    '--title',
    'Established Boss Pack - 13 Bosses',
    '--notes',
    'Source commit: 0123456789abcdef',
    '--latest=false',
  ]);
}

console.log('Pack publisher checks passed (8 assertions groups).');
