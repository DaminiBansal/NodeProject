var express         = require('express'),
    app             = express();

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

/* admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-explore-b5c8e.firebaseio.com"
});
 */
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "fir-explore-b5c8e",
    clientEmail: "firebase-adminsdk-xbdnu@fir-explore-b5c8e.iam.gserviceaccount.com",
    privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZeTX2cM7D/Dd8\nThwg72pAT5SVyMhgUojzli/r0DaXnQhTNxKfXcgcKGj/bP9beJER1GBg+HsZGkZH\ns8sBh9VCicrnN5VjlgEDG1HVBXzLObR4A4qQiLIS8IEVrc46BmoivnHs9pH7ous7\nb+deLGPpTSyIpJYsZnnRGOru7QFPQrfSD1U2eRmOjBnEeixcBJehX6hCgkLBe0VG\nD3uH9YVCYSN1ywai2ENqbD0G2MwId7wNR2fsFzZowPhfO2dQ94P7O0IuI4Xw93hz\nwlHzbr+AVj4phxiSVREq3tl6atcUAP/exTCm31pPdgcRpCxSzIXf7w/fOfx/q7wt\nDXGW/5WjAgMBAAECgf9KwV/LVvu8YvavxCnnKGVdtf1df6dhdP2evgG7Dde2RkSW\nVlgQcCxZgYqWQuGEj+1OM7LtonyuJFoES8l8vTSRqswUrwarNOUkLD/0+e3r7eob\nVxxKkrKj0AiPay94wru5Nb3zts53sYkq5UyjEp9Fk0G7ttfoa1F0jxwzBUVt+N77\nGhUEousd/a9Rueq2DXg/GyyBkI+AQiO9WUbI74lG6I2i8hBL+M1+fRKa100OT9bF\nJrDeQtt9ZzqXTEE/0QZNiZ6uHTuAVnhfXKLCDJMskf9aKTpnhDuJqWREXR7lAC8c\nVcPFtt1jzsaHNrA3cYQ1KbdR1av+2IMc48vX4oECgYEA74qV4oRkkOwv2b8KrBfU\n7DtaJ6FWXDUUEGMgLlnBM9J0/hyL6SqzhjUVFdbMdH+lsZuSgRHcIdUSzVYbDqLx\nn3XaLi5muVUqBlfpLzBAtDt2rzVI9vHSb5v2lj/8fKVcD+KIh74UPcbYbyuzaDmL\nv16CRuTNgkQgf7Rw/uyUBFkCgYEA6Gp2WxLmLEKfvDWxuS0AmRLkR5Ni+riQ+rXg\ntYTcHHRydTfLn6xnW9pPr6SptOzbEu7Tj4YBsmRgcN7d4rlzpCx4k12aJP/2QX8+\n7gzS5M0tmtDfWin69cOUGrVTCyKnnjToqJjatmmRedSEf/AkdhDnME0vaUWsqyMT\n/CtZGlsCgYBe6hrZ1nvCsNOFBB3Gcur7b8kZSuRdROreU2i89POJBSs2RTlq+nCI\nDSB9ts7smmedKHe0jM8c2MDKfAPcmNQEyz3YbqplZUlxmgPbntMEl0s/wW1X7Bnl\n/3aFsnTpLtx7rtdKchazI8c+xaIg+ixVd61HSgHkS/pUn7rmR/eegQKBgQCJHYYF\n5Ph2VDf4yZS4MpyPsl2K/KEAWbLuti6D6IYTI4ADN4+h/AxeXEV20iZs3u/AE7Ys\njlqh7CYZcOJmyBI5YSMhja9K9NdLfM6bkmU5JvMoyuF6SBoOs/vEZgVAJInPBFfe\nX49o3o882OvyrrJUFVTPYjn+WWSs8lzwAILo0QKBgQCn0bHEAJ04xnvIVW68MvDg\npCyqHUf80KGv78AE/J3uUywSiK7zq6VivYdmAk01P0zFXfwfCXTJTbhCCJ3b2FBn\nBGgYVwFUU+CPDXjKt/IuwO+zapbtUneyCd3NZqeP8j3IqlwTO+YZJm+Z8djeapa1\nDN4qPJc5NQr3N6hRDhIBgw==\n-----END PRIVATE KEY-----\n",
   }),
  databaseURL: "https://fir-explore-b5c8e.firebaseio.com"
});

// This registration token comes from the client FCM SDKs.
var registrationToken = "c2UTeiYQrJ8:APA91bEyo9yKPwOqwLKom7dfoj9dDl6d7DrI-NXCQ79Drab-VmyRJ_-B5nEC_SpimKVZ8o9KBTxyPrvMdVmrr4oymYJwS7cHsILSgDDsGVTlA5TAtZkQgSabf1SP_jDQPxDIMvClaIaj";


// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
  
  notification: {
    title: "$GOOG up 1.43% on the day",
    body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
  
}
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
  
   
 
    var port = process.env.PORT|| 8080; ;
    app.listen(port);
    console.log('Magic happens on port ' + port);