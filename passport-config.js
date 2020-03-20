const bcrypt = require('bcrypt')
const winston = require('winston')
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport, db) => {
	passport.use(new LocalStrategy((username, password, cb) => {
	//console.log("1 hiiiiiiiiiiiiiii")
	// db.query(`SELECT "id", "username", "password", "type" FROM users WHERE username='a'`,(err,res)=>{
	// 	console.log("2 Extra testing query ",res.rows[0])
	// })
		db.query(`SELECT "id", "username", "password", "type" FROM users WHERE username='${username}'`, (err, result) => {
			if(err) {
						winston.error('Error when selecting user on login', err)
						return cb(err)
      				}

			if(result.rows.length > 0) {
				const first = result.rows[0]
				//console.log("3 first",first)
				bcrypt.compare(password, first.password, function(err, res) {
					if(res) {
						cb(null, { id: first.id, username: first.username, type: first.type })
					} else {
						cb(null, false,{message: 'Password incorrect'})
					}
				})
			} else {
				cb(null, false,{ message: 'No user with that username' })
			}
		})
	}))

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, cb) => {
		db.query(`SELECT "id", "username", "type" FROM users WHERE id = '${id}'`, (err, results) => {
			if(err) {
				winston.error('Error when selecting user on session deserialize', err)
				return cb(err)
			}
			console.log("4 deserialize",results)
			cb(null, results.rows[0])
		})
	})
}

// const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')

// function initialize(passport, getUserByEmail, getUserById) {
//   console.log('Initialaize passport code here.....');
//   const authenticateUser = async (email, password, done) => {
//     console.log('auth user here....')
//     console.log(email);
//     console.log(password);
//     const user = getUserByEmail(email)
//     if (user == null) {
//       return done(null, false, { message: 'No user with that email' })
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'Password incorrect' })
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }

//   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
// }

// module.exports = initialize