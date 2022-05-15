const assert = require('assert');
const { exec } = require('child_process');

describe(__filename, function() {
    describe('Style Check', function() {
        it('should have complaint free style', async function() {
            // eslint-disable-next-line no-unused-vars
            exec('npm run lint', (error, stdout, stderr) => {
                assert.strictEqual(error, null);
            });
        });
    });
});
