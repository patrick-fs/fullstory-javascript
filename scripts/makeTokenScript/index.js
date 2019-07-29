const axios = require('axios');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);

// https://discuss.circleci.com/t/circleci-ip-range/10759
const awsIPRanges = 'https://ip-ranges.amazonaws.com/ip-ranges.json';

const run = async () => {
  const doc = await axios.get(awsIPRanges);
  const circleCIRanges = doc.data.prefixes.filter(p => {
    return /us-west*|us-east*/i.test(p.region);
  }).map(p => {
    return p.ip_prefix;
  });
  
  const ipRangeList = circleCIRanges.join(',');
  const command = `npm token create --cidr=${ipRangeList}`;
  await writeFile('makeToken.sh', command);  
};

run();