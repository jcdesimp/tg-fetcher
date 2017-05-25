const telegramLink = require('telegram.link')();
const readline = require('readline');
const CONF = require('./config.json');

const appConf = {
  id: CONF.appId,
  hash: CONF.appHash,
  version: CONF.appVersion,
  lang: CONF.langCode,
  deviceModel: 'nodeJS',
  systemVersion: '6',
};

let dataCenter = telegramLink.PROD_PRIMARY_DC;
let tgClient;
let dataCenters = null;
let authKey = null;
let phoneNumber = null;


function handleError(err) {
  console.log(err);
}

function handleSendAuthCode(result) {
  if (result.error_code) {
    if (result.error_code === 303) {
      // console.log(err);
      console.log('Changing data center!');
      const dcRegExp = /.*_([0-9].*)$/g;
      const targetDC = dcRegExp.exec(result.error_message)[1];
      dataCenter = dataCenters[`DC_${targetDC}`];
      tgClient.end();
      tgClient = telegramLink.createClient(appConf, dataCenter, handleConnect);
      return;
    }
    console.log(result);
    return;
  }
  console.log('CODE SENT!');
  // console.log(result);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter Auth Code: ', (ans) => {
    console.log(ans);
    rl.close();
  });
}

function handleGetDataCenters(dcs) {
  dataCenters = dcs;
  if (phoneNumber) {
    tgClient.auth.sendCode(phoneNumber, 5, 'en', handleSendAuthCode);
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter Phone Number: ', (ans) => {
      phoneNumber = ans;
      tgClient.auth.sendCode(phoneNumber, 5, 'en', handleSendAuthCode);
      rl.close();
    });
  }
}

function handleConnect() {
  console.log('Connected!');
  // tgClient.getDataCenters(() => {

  // });
  tgClient.createAuthKey((err, key) => {
    console.log('Got Key!');
    authKey = key;
    // tgClient.getDataCenters((l, c, n) => {
    //   console.log(l);
    // });
    tgClient.getDataCenters(handleGetDataCenters);
  });
  // while (!tgClient.isReady()) {
  //   // do nothing
  // }
}

tgClient = telegramLink.createClient(appConf, dataCenter, handleConnect);

// tgClient.on('error', handleError);

process.stdin.resume();
