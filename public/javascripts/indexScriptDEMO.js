var allTheData;
var futureData;
var theRegression;

var maxCredit = 5000;
var globalMult = 1;

firebase.database().ref().once('value').then(function(snapshot) {
  var nameSpot = document.getElementById("clientInfoNav");
  var clientName = snapshot.val().currentUserName;
  allTheData = snapshot.val().clients[clientName].weeklySnapshot;
  futureData = snapshot.val().clients[clientName].outstanding;
  nameSpot.innerHTML = clientName;
  if(document.getElementById("dashboardUnique")) {
    var formattedData = formatData(allTheData);
    console.log(formattedData);
    var myRegression = theRegression = regression('linear', formattedData);
    var creditMessage = document.getElementById("yourCreditLimit");
    console.log(creditMessage);
    var creditExtra = document.getElementById("creditMessage");

    creditMessage.innerHTML = "Your Leap Credit Available: " +
          maxCredit * (1 - (allTheData[allTheData.length - 1]["Liabilities "] / allTheData[allTheData.length - 1].Assets));

    creditExtra.innerHTML = "Congratulations! Due to your responsible financial management, you now have more Leap credit available";
    // var myRegression = regression('linear', [[1, 0],[30, 5],[0, 21]]);
    console.log(myRegression);
    google.charts.load('current', {'packages':['corechart', 'bar', 'wordtree']});
    google.charts.setOnLoadCallback(drawPieChart);
    google.charts.setOnLoadCallback(drawBarChart1);
    google.charts.setOnLoadCallback(drawBarChart2);
  }
});

function formatData(dataObj) {
  var begin = 1;
  var retVal = [];
  while(true) {
    var temp = dataObj[begin];
    if(temp) {
      if(temp.Assets === 0) {
        retVal.push([begin, 0]);
      } else {
        addVal = [parseFloat(Number(begin)), ((parseFloat(Number(temp["Liabilities "]) / Number(temp.Assets))))]
        retVal.push(addVal);
      }
      ++begin;
    } else {
      break;
    }
  }
  var newRetVal = [];
  for(var i = 0; i < 100; ++i) {
    newRetVal.push(retVal[i]);
  }
  return newRetVal;
}

function submitTransaction() {
  var isCurrent = !document.getElementById('checkbox-1').checked;
  var isAsset = document.getElementById('option-1');
  var value = Number(document.getElementById('amount1'));
  if(isNaN(value)) {
    value = 0;
  }
  var snackbarContainer = document.querySelector('#demo-toast-example');

  var currentAssets = 0;
  var currentLiabilities = 0;
  var futureAssets = 0;
  var futureLiabilities = 0;

  if(isCurrent) {
    if(isAsset) {
      currentAssets += value;
    } else {
      currentLiabilities += value;
    }
  } else {
    if(isAsset) {
      futureAssets += value;
    } else {
      futureLiabilities += value;
    }
  }

  firebase.database().ref().once('value').then(function(snapshot) {
    var dataObj = snapshot.val();
    console.log(dataObj);
    var username = dataObj.currentUserName;
    var currentWeek = dataObj.clients[username].currentWeek;
    console.log(username);
    console.log(currentWeek);
    console.log(dataObj.clients[username].weeklySnapshot);

    dataObj.clients[username].weeklySnapshot[currentWeek].Assets += currentAssets;
    dataObj.clients[username].weeklySnapshot[currentWeek].Liabilities += currentLiabilities;

    dataObj.clients[username].outstanding.Assets += futureAssets;
    dataObj.clients[username].outstanding.Assets += futureLiabilities;

    firebase.database().ref().set(dataObj, function() {
      var dialog = document.getElementById('dialog');
      dialog.showModal();
    });
  });
}

function clearForm() {
  document.getElementById('notes1').value = "";
  document.getElementById('amount1').value = "";
  document.getElementById('details1').value = "";
  document.getElementById('dialog').close();
}

function goToDashboard() {
  window.location.href = "dashboard";
}


function drawPieChart() {

  var pieData = google.visualization.arrayToDataTable([
    ['CCI Score', 'Value'],
    ['CCI',     (theRegression.equation[0] + 0.75) ],
    ['',      1 - (theRegression.equation[0] + 0.75)]
  ]);

  var options = {
    legend: {position: 'none'}
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(pieData, options);
}

function drawBarChart1() {
  console.log(allTheData[allTheData.length - 2].Liabilities);
  var data = google.visualization.arrayToDataTable([
    ['', '', ''],
    ['This Week', allTheData[allTheData.length - 1].Assets , allTheData[allTheData.length - 1].Liabilities],
    ['Last Week', allTheData[allTheData.length - 2].Assets , allTheData[allTheData.length - 2]["Liabilities "]],
    ['Last Month', allTheData[allTheData.length - 4].Assets , allTheData[allTheData.length - 4]["Liabilities "]]
  ]);

  var options = {
    legend: {position: 'none'}
  };

  var chart = new google.charts.Bar(document.getElementById('columnchart_material1'));

  chart.draw(data, options);
}

function drawBarChart2() {
  console.log(futureData);
  var data = google.visualization.arrayToDataTable([
    ['', '', ''],
    ['This Week', futureData.Assets, futureData.Liabilities]
  ]);

  var options = {
    legend: {position: 'none'}
  };

  var chart = new google.charts.Bar(document.getElementById('columnchart_material2'));

  chart.draw(data, options);
}
