module.exports = function exec(
  command,
  { capture = false, echo = false } = {},
) {
  if (echo) {
    console.log(command);
  }

  const { spawn } = require('child_process');
  const childProcess = spawn('bash', ['-c', command], {
    stdio: capture ? 'pipe' : 'inherit'
  });

  return new Promise((resolve, reject) => {
    let stdout = '';

    if (capture) {
      childProcess.stdout.on('data', data => {
        stdout += data;
      });
    }

    childProcess.on('error', function (error) {
      reject({ code: 1, error });
    });

    childProcess.on('close', function (code) {
      if (code > 0) {
        reject({ code, error: `Command failed with code ${code}` });
      } else {
        resolve({ code, data: stdout });
      }
    });
  });
};
