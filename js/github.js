const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

  return text => text.split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}
  
const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
  return encoded => encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

async function getContributions(token, username) {
    const headers = {
        'Authorization': `bearer ${token}`,
    };
    const body = {
        "query": `query {
            user(login: "${username}") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`
    };
    const response = await fetch('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify(body), headers: headers });
    const data = await response.json();
    return data;
}

async function printInfo(token) {
    const data = await getContributions(token, 'coconut-junior');
    var count = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    document.getElementById('contributions').innerHTML = count;
}

var token = '6f6078577f6352597f7e5e7b6f60515146415e786f616f464d526b4551666d46633c3b30317f3050';
const myDecipher = decipher('mySecretSalt');
var token = myDecipher(token);

printInfo(token);