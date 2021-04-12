# Node / Express app: writing json to file

Inquiry form made with Node, Express and EJS which reads data from and writes data to a json file. All inquiries can be viewed in a table with the newest one showing first. Each one can be deleted. 

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
- [express-validator](https://express-validator.github.io/docs/) node package for validating / sanitizating input
- [dateformat](https://www.npmjs.com/package/dateformat) node package to format the date
- [recaptcha](https://developers.google.com/recaptcha) for protection against spam and abuse
- [unsplash](https://unsplash.com/) royalty-free images
- [fontawesome](https://fontawesome.com) free icons
- [responsiveness for tables](https://uglyduck.ca/responsive-tables/) an elegant solution