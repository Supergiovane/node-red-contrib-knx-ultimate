const Http2Client = require('./myhttp2');
const bridgeIp = '192.168.1.36';
const bridgeUsername = '';
const Clientkey = '';
const ca = ``; // Certificato https://developers.meethue.com/develop/application-design-guidance/using-https/

const http2Client = new Http2Client(
    {
        url: `https://${bridgeIp}`,
        key: bridgeUsername
    },
    {

        // ca: ca,
        // checkServerIdentity: function (hostname, cert) {
        //     if (cert.subject.CN === this.bridge.getId().toLowerCase()) {
        //         console.log("Successful server identity check!");
        //         return undefined;
        //     } else {
        //         return new Error("Server identity check failed. CN does not match bridgeId.");
        //     }
        // },
    });

console.log(http2Client.get(`https://${bridgeIp}/clip/v2/resource/device`));

// async (params) => {
//     await http2Client.createEventSource(
//         "/eventstream/clip/v2",
//         { "hue-application-key": bridgeUsername },
//         (data) => { console.log(data); },
//         (error) => { console.log(`Event source closed! ${error}`); }
//     );
// }


