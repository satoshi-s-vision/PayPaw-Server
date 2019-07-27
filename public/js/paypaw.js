// LIBRARY CLASS
(window.initPayPaw = function() {
  loadPackage("http://localhost:3000/js/qrcode.min.js", "js") //dynamically load and add this .js file
  loadPackage("https://code.jquery.com/jquery-3.2.1.slim.min.js", "js") //dynamically load and add this .js file
  loadPackage("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js", "js") //dynamically load and add this .js file
  loadPackage("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js", "js") //dynamically load and add this .js file
  loadPackage("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css", "css") //dynamically load and add this .css file
})();

function PayPaw() {}

const payPaw = new PayPaw()

PayPaw.prototype.render = function (bill = {}) {
  // {
  //   "user_id": 123456,
  //   "email": "test@g.com",
  //   "currency": "BTM",
  //   "currency_amount": 1500,
  //   "message": "GG GL"
  // }

  console.log(JSON.stringify(bill))

  this.template = '<div id="paypaw">' + ' <div class="class"></div>';
  document.body.innerHTML += this.template;
  // Change element styling
  document.getElementById("paypaw").style.display = "none";
  // Modify element attributes
  document.getElementById("paypaw").src = "";
  // Add listeners to elements
  document.getElementById("paypaw").addEventListener("click", this.function);

  let qrcode = new QRCode(document.getElementById("qrcode"), {
    text: "N/A",
    width: 200,
    height: 200,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

  // Add all your code here
}

function loadPackage(filename, filetype){
  if (filetype=="js"){ //if filename is a external JavaScript file
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
  }
  else if (filetype=="css"){ //if filename is an external CSS file
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref!="undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }
}