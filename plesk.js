// Fix til at hoste app'en på Plesk
// https://support.plesk.com/hc/en-us/articles/12389037025431-A-Node-js-app-hosted-in-Plesk-is-not-working-require-of-ES-Module-is-not-supported
// https://talk.plesk.com/threads/nodejs-execute-esm-code.362146/
async function main () {
    await import('./app.js')
    }

main()