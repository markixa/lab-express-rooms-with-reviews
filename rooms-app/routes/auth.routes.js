const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const SALT_FACTOR = 12;

const router = require("express").Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/**
 * signup
 */

router.get('/signup', (req, res) => {
  res.render('auth/signup');
})

router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.file);

    //checking if something is missing from the fields
    if(!email || !password){
        return res.render('auth/signup', {
            errorMessage: "credentials missing, please fill all forms, this is mandatory."
        })
    }

    //checking if password meets the requirements
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    if(!regex.test(password)){
      return res.render('auth/signup', {
        errorMessage: "Password needs to have 8 char, including lower/upper case and a digit"
      })
    }

    //checking if user exists
    //try catch here is to wait for the DB to respond, hence async/await
    try {
        const foundUser = await User.findOne({ email });
    
        if(foundUser){
          return res.render('auth/signup', {
            errorMessage: "Email already in use"
          })
        }
    
        const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
        await User.create({
          email, 
          password: hashedPassword,
          profilePic: req.file.path
        })
    
        res.redirect('/auth/login');
    
      } catch (error) {
        next(error);
      }
})


// // Search the database for a user with the username submitted in the form
// User.findOne({ username }).then((found) => {
//   // If the user is found, send the message username is taken
//   if (found) {
//     return res
//       .status(400)
//       .render("auth.signup", { errorMessage: "Username already taken." });
//   }

//   // if user is not found, create a new user - start with hashing the password
//   return bcrypt
//     .genSalt(saltRounds)
//     .then((salt) => bcrypt.hash(password, salt))
//     .then((hashedPassword) => {
//       // Create a user and save it in the database
//       return User.create({
//         username,
//         password: hashedPassword,
//       });
//     })
//     .then((user) => {
//       // Bind the user to the session object
//       req.session.user = user;
//       res.redirect("/");
//     })
//     .catch((error) => {
//       if (error instanceof mongoose.Error.ValidationError) {
//         return res
//           .status(400)
//           .render("auth/signup", { errorMessage: error.message });
//       }
//       if (error.code === 11000) {
//         return res.status(400).render("auth/signup", {
//           errorMessage:
//             "Username need to be unique. The username you chose is already in use.",
//         });
//       }
//       return res
//         .status(500)
//         .render("auth/signup", { errorMessage: error.message });
//     });
// });



/**
 * login
*/

router.get('/login', (req, res) => {
    res.render('auth/login');
  })
  
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
  
    if(!email || !password){
      return res.render('auth/login', {
        errorMessage: "Credentials are mandatory!"
      })
    }
    
    try {
      const foundUser = await User.findOne({ email });
  
      if(!foundUser){
        return res.render('auth/login', {
          errorMessage: "Wrong credentials"
        })
      }
  
      const checkPassword = bcrypt.compareSync(password, foundUser.password);
      if(!checkPassword){
        return res.render('auth/login', {
          errorMessage: "Wrong credentials"
        })
      }
  
      const objectUser = foundUser.toObject();
      delete objectUser.password;
      req.session.currentUser = objectUser;
  
      return res.redirect('/');
    } catch (error) {
      
    }
})

/**
 * logout
 */

 router.get('/logout', (req, res) => {
    res.render('index');
  })

module.exports = router;