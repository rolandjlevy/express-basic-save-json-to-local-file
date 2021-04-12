# Node / Express app: writing json to file

Inquiry form made with Node, Express and EJS which reads data from and writes data to a json file. All inquiries can be viewed in a table with the newest one showing first and deleted one at a time. 

## Links 🔗

- [Live demo](https://express-crud-writing-json-to-file.rolandjlevy.repl.co/)
- [Source code](https://replit.com/@RolandJLevy/express-crud-writing-json-to-file)
- [Github repo](https://github.com/rolandjlevy/express-crud-writing-json-to-file)

![screen shot](https://raw.githubusercontent.com/rolandjlevy/express-crud-writing-json-to-file/master/public/images/screen-shot.png)

## Features ⚙️
- User input is validated and sanitized on the back end
- Errors are handled for non existent endpoints or user ids
- After an inquiry is added or deleted, a success page is displayed
- If the user input or recaptcha is invalid an error message is displayed
- The inquiries are shown in a table which is mobile responsive
- All the code was written from scratch

## Rsources used
- [express-validator node package](https://express-validator.github.io/docs/) for validating and sanitizating user input, avoiding [XSS](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting)
- [dateformat node package](https://www.npmjs.com/package/dateformat) to format the date
- [unsplash images](https://unsplash.com/)
- [fontawesome icons](https://fontawesome.com)
- [CSS for mobile-friendly tables](https://uglyduck.ca/responsive-tables/)