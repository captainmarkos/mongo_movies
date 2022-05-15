const mochaLib = require('@simpleview/mochalib');
const assert = require('assert');
 
let emailValidation = function(msg) {
    if (msg.to === undefined) { throw new Error('Invalid: email to is undefined'); }
    if (msg.from == undefined) { throw new Error('Invalid: email from is undefined'); }

    if (!validEmailAddress(msg.to)) { throw new Error('Invalid: email to'); }
    if (!validEmailAddress(msg.from)) { throw new Error('Invalid: email from'); }

    if (msg.subject && typeof(msg.subject) !== 'string') { throw new Error('Invalid: email subject is not a string'); }

    if (typeof(msg.body) !== 'string') { throw new Error('Invalid: email body is not a string'); }
    if (msg.body === '') { throw new Error('Invalid: email body is blank'); }

    return true;
};

let validEmailAddress = function(email) {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; /* eslint-disable-line no-useless-escape */

    return regex.test(String(email).toLowerCase());
};

describe(__filename, function() {
    describe('validEmailAddress Function', function() {
        const tests = [
            {
                name: 'valid email address should return true',
                args: {
                    email_address: 'mark@simpleviewinc.com',
                    result: true
                }
            },
            {
                name: 'valid email address with special chars should return true',
                args: {
                    email_address: 'jorgé@yay.com',
                    result: true
                }
            },
            {
                name: 'email address missing domain should return false',
                args: {
                    email_address: 'mark@s',
                    result: false
                }
            },
            {
                name: 'email address undefined should return false',
                args: {
                    email_address: undefined,
                    result: false
                }
            }
        ];

        mochaLib.testArray(tests, function(test) {
            assert.strictEqual(validEmailAddress(test.email_address), test.result);
        });
    });

    describe('emailValidation Function with valid params', function() {
        const tests = [
            {
                name: 'valid email should return true',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: 'email body'
                    },
                    result: true
                }
            },
            {
                name: 'empty string for subject should return true',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc.com',
                        subject: '',
                        body: 'email body'
                    },
                    result: true
                }
            }
        ];

        mochaLib.testArray(tests, function(test) {
            assert.strictEqual(emailValidation(test.message), test.result);
        });
    });

    describe('emailValidation Function with invalid params', function() {
        const tests = [
            {
                name: 'throws error for email to is undefined',
                args: {
                    message: {
                        from: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: 'email body'
                    },
                    result: /^Error: Invalid: email to is undefined$/
                }
            },
            {
                name: 'throws error for email to is missing @ char',
                args: {
                    message: {
                        to: 'mark',
                        from: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: 'email body'
                    },
                    result: /^Error: Invalid: email to$/
                }
            },
            {
                name: 'throws error for email from is undefined',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: 'email body'
                    },
                    result: /^Error: Invalid: email from is undefined$/
                }
            },
            {
                name: 'throws error for email from missing domain extension',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc',
                        subject: 'test email',
                        body: 'email body'
                    },
                    result: /^Error: Invalid: email from$/
                }
            },
            {
                name: 'throws error for email body is empty string',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: ''
                    },
                    result: /^Error: Invalid: email body is blank$/
                }
            },
            {
                name: 'throws error for email body is not a string',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc.com',
                        subject: 'test email',
                        body: {}
                    },
                    result: /^Error: Invalid: email body is not a string$/
                }
            },
            {
                name: 'throws error for email subject not a string',
                args: {
                    message: {
                        to: 'mark@simpleviewinc.com',
                        from: 'mark@simpleviewinc.com',
                        subject: {},
                        body: 'email body'
                    },
                    result: /^Error: Invalid: email subject is not a string$/
                }
            }
        ];

        mochaLib.testArray(tests, function(test) {
            let fn = () => {
                emailValidation(test.message);
            };
            assert.throws(fn, test.result);
        });
    });
});
