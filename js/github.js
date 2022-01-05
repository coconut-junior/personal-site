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

async function printInfo() {
    const data = await getContributions('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', 'coconut-junior');
    var count = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    document.getElementById('contributions').innerHTML = count;
}

printInfo();

