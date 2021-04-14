# Node / Express inquiry form and admin page

### Welcome to Tasty Treats! 🍰 

Connect with your local bakery **Tasty Treats** with this inquiry form made with Node, Express and EJS which reads data from and writes data to a json file. All inquiries can be viewed in a table with the latest showing first. Each one can be deleted. 

## Links 🔗

- [See live demo](https://express-crud-writing-json-to-file.rolandjlevy.repl.co/)
- [View source code](https://replit.com/@RolandJLevy/express-crud-writing-json-to-file)
- [Explore Github repo](https://github.com/rolandjlevy/express-crud-writing-json-to-file)

![screen shot](https://raw.githubusercontent.com/rolandjlevy/express-crud-writing-json-to-file/master/public/images/screen-shot.png)

## Features ⚙️
- User input is validated and sanitized on the back end
- Errors are handled for non existent endpoints or user ids
- When user input or the recaptcha is invalid an error message is displayed
- After an inquiry is added or deleted, a success page is displayed
- The inquiries are shown in an admin table which is mobile responsive
- Tests can be run for HTTP requests and functions from Users class

## Testing ✅
- Run all tests with `npm test`
- Testing with [jest](https://jestjs.io) and [supertest](https://www.npmjs.com/package/supertest) HTTP assertions library

## Reference and resources 📙
- [express-validator](https://express-validator.github.io/docs/) node package for validating / sanitizating input
- [he encoder/decoder](https://github.com/mathiasbynens/he) for HTML entities
- [dateformat](https://www.npmjs.com/package/dateformat) node package to format the date
- [recaptcha](https://developers.google.com/recaptcha) for protection against spam and abuse
- [jest](https://jestjs.io) JavaScript testing framework
- [supertest](https://www.npmjs.com/package/supertest) HTTP request testing library
- [unsplash](https://unsplash.com/) royalty-free images
- [fontawesome](https://fontawesome.com) free icons
- [responsive tables](https://uglyduck.ca/responsive-tables) an elegant CSS solution for making tables responsive