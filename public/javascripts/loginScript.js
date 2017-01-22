function login() {
  var snackbarContainer = document.querySelector('#demo-toast-example');
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  firebase.database().ref('clients').once('value').then(function(snapshot) {
    var usernameObj = snapshot.val()[username];
    console.log(usernameObj);
    if(usernameObj) {
      if(usernameObj.password === password) {
        firebase.database().ref('currentUserName').set(username, function() {
          window.location.href = "dashboard";
        });
      } else {
        snackbarContainer.MaterialSnackbar.showSnackbar({message: "Invalid password"});
      }
    } else {
      snackbarContainer.MaterialSnackbar.showSnackbar({message: "Invalid username"});
    }
  });
}
