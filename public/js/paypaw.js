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
  document.getElementById("paypaw").style.display = "none";
  document.getElementById("paypaw").src = "";
  document.getElementById("paypaw").addEventListener("click", this.function);

  let qrcode = new QRCode(document.getElementById("qrcode"), {
    text: "N/A",
    width: 200,
    height: 200,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

  postOneBill(bill)
  /**
   * Ajax, call server to post one msg
   */
  async function postOneBill(b) {
    const checkoutRecipientId = b.user_id;
    const checkoutEmail = b.email;
    const checkoutCurrency = b.currency;
    const checkoutAmount = b.currency_amount;
    const checkoutMessage = b.message;

    if (checkoutRecipientId && checkoutEmail && checkoutCurrency && checkoutAmount) {

      const data = JSON.stringify({
        "data": {
          "user_id": checkoutRecipientId,
          "email": checkoutEmail,
          "currency": checkoutCurrency,
          "currency_amount": checkoutAmount,
          "message": checkoutMessage
        }
      })

      const requestURL = `http://localhost:3000/api/v1/bill`

      const res = await fetch(
        requestURL,
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: data
        }
      ).then(response => response.json());

      console.log(res);

      if (res && res.meta && res.meta.code && res.meta.code == 201) {
        updateQR(res.data);
      } else {
        alert(`Status Code ${res.meta.code} : ${res.meta.msg}`);
      }
    } else {
      alert('Input not valid, check your input');
    }
  }

  function updateQR(data) {
    // bytom:[address]?amount=[amount]&asset=[asset]
    const q_data = {
      address: data.address,
      amount: +data.asset_amount,
      asset: data.asset_id,
    }
    qrcode.hidden = true;
    qrcode.makeCode(`bytom:${q_data.address}?amount=${q_data.amount}&asset=${q_data.asset}`); // make another code.
  }
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