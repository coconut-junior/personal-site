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
    console.log(data.data.user.contributionsCollection.contributionCalendar);
    var count = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    console.log(count);
    document.getElementById('contributions').innerHTML = count;
}

printInfo();

