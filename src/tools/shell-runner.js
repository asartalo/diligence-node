import childProcess from 'child_process';

export default function shellRunner(command = '', options = {}) {
  const cmd = Array.isArray(command) ? command.join(';') : command;
  const opts = { stdio: 'pipe', cwd: process.cwd(), ...options };

  const shell = process.platform === 'win32'
    ? { cmd: 'cmd', arg: '/C' }
    : { cmd: 'sh', arg: '-c' };

  let child;
  function run() {
    return new Promise((resolve, reject) => {
      try {
        child = childProcess.spawn(shell.cmd, [shell.arg, cmd], opts);
      } catch (error) {
        reject(error);
        return;
      }

      let stdout = '';
      let stderr = '';

      if (child.stdout) {
        child.stdout.on('data', data => {
          stdout += data;
        });
      }

      if (child.stderr) {
        child.stderr.on('data', data => {
          stderr += data;
        });
      }

      child.on('error', error => {
        resolve({
          error, stdout, stderr, cmd,
        });
      });

      child.on('close', code => {
        resolve({
          stdout, stderr, cmd, code,
        });
      });
    });
  }

  return {
    run,
    kill: (signal = 'SIGTERM') => {
      if (child) {
        child.kill(signal);
        child = null;
      }
    },
  };
}
