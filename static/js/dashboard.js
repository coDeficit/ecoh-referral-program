function getDates(number = 6, duration = "month", date = new Date()) {
  // gets <number> dates with duration difference from date
  // e.g. number-6, duration='month' will get 6 dates that are 1 month apart from each other starting with date
  // the values for duration are hour, day, month, year; a month is considered as 30 days and a year 365

  let millisecondConversionRate = null;

  switch (duration) {
    case "month":
      millisecondConversionRate = 30 * 24 * 60 * 60 * 1000
      break;
    default:
      millisecondConversionRate = 30 * 24 * 60 * 60 * 1000
      break;
  }

  let dates = [date];

  for (let i = 1; i <= number; i++) {
    let newDate = new Date(date.getTime() - (millisecondConversionRate * i))
    dates.push(newDate)
  }

  return dates;
}

const ctx = document.getElementById("chart").getContext("2d");

if (API_HOST && PERSON_ID) {
  $.ajax({
    type: "GET",
    url: `${API_HOST}/api/people/${PERSON_ID}/referrals/statistics`,
    headers: {
      "Authorization": `Token ${getCookie("auth_token")}`
    },
    success: function (json) {
      $("#beneficiary-stats .num").text(json["general"]["total_number_of_effective_referrals"])
      $("#earnings-stat .num").text(json["general"]["cost_of_total_number_of_rewards"])
      $("#sub-referrer-stats .num").text(json["general"]["number_of_sub_referrers"])

      const actions = [
        {
          name: 'pointStyle: circle (default)',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'cirlce';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: cross',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'cross';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: crossRot',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'crossRot';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: dash',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'dash';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: line',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'line';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: rect',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'rect';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: rectRounded',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'rectRounded';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: rectRot',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'rectRot';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: star',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'star';
            });
            chart.update();
          }
        },
        {
          name: 'pointStyle: triangle',
          handler: (chart) => {
            chart.data.datasets.forEach(dataset => {
              dataset.pointStyle = 'triangle';
            });
            chart.update();
          }
        }
      ];

      let dates = getDates();
      dates = dates.reverse();

      let datasetLabels = ["Number of referrals", "Number of effective referrals", "Number of rewardable referrals"]
      let datasetBorderColors = ["red", "#3ca877", "#f88c00"];

      let labels = [], datasets = [];

      for (let date of dates) {
        labels.push(`${months[date.getMonth()]} ${date.getFullYear()}`)
      }

      for (let labelIndex = 0; labelIndex < datasetLabels.length; labelIndex++) {
        let label = datasetLabels[labelIndex];

        let data = [];
        for (let i = 0; i < dates.length; i++) {
          data.push(0.0);
        }

        let datasetObject = {
          label: label,
          data: data,
          borderColor: datasetBorderColors[labelIndex],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 10
        }

        datasets.push(datasetObject)
      }

      const data = {
        labels: labels,
        datasets: datasets
      }

      for (let dateString in json["daily"]) {
        let date = new Date(dateString);
        let item = json["daily"][dateString];

        let monthAndYear = `${months[date.getMonth()]} ${date.getFullYear()}`
        let index = labels.indexOf(monthAndYear)

        if (index >= 0) {
          data.datasets[0].data[index] += item["total_number_of_beneficiaries_referred"]
          data.datasets[1].data[index] += item["total_number_of_effective_referrals"]
          data.datasets[2].data[index] += item["total_number_of_rewardable_referrals"]
        } else {
          console.log("Date not found in predefined range")
          console.log(item)
        }
      }

      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
            }
          }
        }
      }

      const myChart = new Chart(ctx, config)
    },
    error: function(data) {
      console.log(data.responseText)
    }
  })
}