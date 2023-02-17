const nodemailer = require('nodemailer')
let testEmailAccount = await nodemailer.createTestAccount()
console.log("mailer: " + testEmailAccount)