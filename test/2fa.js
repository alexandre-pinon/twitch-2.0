var notp = require("notp");
var base32 = require("thirty-two");
var crypto = require("crypto");
var hash = crypto.randomBytes(16).toString('hex');
var secret = base32.encode("ef96b185314ab128fb3fc3953a535a65").toString();
var keygen = notp.totp.gen(base32.decode(secret));
var qrcode = require("qrcode");
var otpuri = `otpauth://totp/${encodeURI("Gopnik")}?secret=${secret}&issuer=${encodeURI("SutoremonTV")}`;

console.log("Generated hash:", hash);
console.log("Generated secret:", secret);
console.log("Generated key:", keygen);
console.log("Generated OTP URI", otpuri);

qrcode.toString(otpuri, {type:'terminal'}, function (err, cliqr) {
    console.log(cliqr);
})

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
 
readline.question('2FA Key? ', keyin => {
    console.log(`Entered key ${keyin}`);
    var login = notp.totp.verify(keyin, "ef96b185314ab128fb3fc3953a535a65");

    if (!login)
	return console.log("Key invalid !");
    console.log("Key valid, sync value is " + login.delta);
    readline.close();
});
