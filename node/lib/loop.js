const request = require("request");
const util = require("util");
const requestP = util.promisify(request);

setInterval(async function() {
    const result = await requestP("https://rd-kubernetes-training.kube.simpleview.io/");
    if(result.statusCode !== 200){
        process.on('exit', (code) => {
            console.log(`Lost connection with the application exiting process now!`);
        }).exit();
    };
    console.log("result", new Date(), result.statusCode);
}, 100);
