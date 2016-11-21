/*Program Title: routes/user.js
Course: CS546-WS
Date: 08/18/2016
Description:
This script handles all user-related routes
*/

var express = require('express');
var data = require("data");
var users = data.users;
var movie = data.movie;
var playlist = data.playlist;
var api = data.api;
var router = express.Router();
var xss = require('xss');
var crypto = require('crypto');
var passport = require('passport');


//get all users
router.get('/users', function (req, res) {
    let redisConnection = req
        .app
        .get("redis");

    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`users-retrieved:${messageId}`, (retrievedUsers, channel) => {
       res.status(200).send(retrievedusers);
        redisConnection.off(`users-retrieved:${messageId}`);
        redisConnection.off(`users-retrieved-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`users-retrieved-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`users-retrieved:${messageId}`);
        redisConnection.off(`users-retrieved-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`users-retrieved:${messageId}`);
        redisConnection.off(`users-retrieved-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`get-users:${messageId}`, {
        requestId: messageId
    });
});

//login page
router.get('/login', function (req, res) {
	res.render("layouts/login", {
		partial: "jquery-login-scripts"
	});
	//	}
});

//registration page
router.get('/register', function (req, res) {
	res.render("layouts/register", {
		partial: "jquery-register-scripts"
	});
}),

//LOG OUT
router.get('/logout', function(req, res) {
 let userId = req.session.user_id;
    let sessionData = req.session;
    let redisConnection = req
        .app
        .get("redis");
    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;


    redisConnection.on(`logged-out:${messageId}`, (deletedUser, channel) => {
        if (deletedUser) {
            req.session.destroy();
        }
        redisConnection.off(`logged-out:${messageId}`);
        redisConnection.off(`logout-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`logout-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`logged-out:${messageId}`);
        redisConnection.off(`logout-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`logged-out:${messageId}`);
        redisConnection.off(`logout-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`logout-user:${messageId}`, {
        requestId: messageId,
        userId: userId,
        session: sessionData
    });
}),

	//post user registration
router.post('/user/register', function (req, res) {
		let username = req.body.username;
		let password = req.body.password;
		let confirmedPassword = req.body.confirm;
		let name = req.body.name;
		let email = req.body.email;

    let redisConnection = req
        .app
        .get("redis");

    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`user-registered:${messageId}`, (registeredUser, channel) => {
       if(registeredUser){
	   res.json({ success: true });
	   }
        redisConnection.off(`user-registered:${messageId}`);
        redisConnection.off(`user-registered-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-registered-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`user-registered:${messageId}`);
        redisConnection.off(`user-registered-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-registered:${messageId}`);
        redisConnection.off(`user-registered-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`register-user:${messageId}`, {
        requestId: messageId,
			username = username,
		password = password,
		 confirmedPassword = confirmedPassword,
		name = name,
		email = email
    });

	}),

	//get user information
	router.get('/user', function (req, res) {
	
    let redisConnection = req
        .app
        .get("redis");
let userId = req.session.userId;
    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`user-retrieved:${messageId}`, (retrievedUser, channel) => {
        				res.render("user/index", {
					user: retrievedUser,
					partial: "jquery-user-index-scripts"
				});
        redisConnection.off(`user-retrieved:${messageId}`);
        redisConnection.off(`user-retrieved-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-retrieved-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`user-retrieved:${messageId}`);
        redisConnection.off(`user-retrieved-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-retrieved:${messageId}`);
        redisConnection.off(`user-retrieved-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`get-user:${messageId}`, {
        requestId: messageId,
        userId: userId
    });
	});


//update user
router.put('/users/:id', function (req, res) {
	let userId = req.params.id;
	let newData = req.body;
	  let redisConnection = req
        .app
        .get("redis");

    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;


    redisConnection.on(`user-updated:${messageId}`, (updatedUser, channel) => {
      	res.status(200).send(updatedUser);
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-updated-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`update-user:${messageId}`, {
        requestId: messageId,
        update: newData,
        userId: userId
    });
});

//post user login - authenticate using passport local strategy
router.post('/user/login', passport.authenticate('local'), (req, res) => {
  let redisConnection = req
        .app
        .get("redis");
    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

	    //add data to session object
    req.session.token = req.user.token;
    req.session.userId = req.user._id;
    let sessionData = req.session;

    redisConnection.on(`logged-in:${messageId}`, (sessionData, channel) => {
        let obj = {
            token: sessionData.token
        };
        res.json(obj); //send back the token
        redisConnection.off(`logged-in:${messageId}`);
        redisConnection.off(`login-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`login-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);
        redisConnection.off(`logged-in:${messageId}`);
        redisConnection.off(`login-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`logged-in:${messageId}`);
        redisConnection.off(`login-failed:${messageId}`);
        res
            .status(500)
            .json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`login-user:${messageId}`, {
        requestId: messageId,
        session: sessionData
    });
});


//post user update email
router.post('/user/update_email', function (req, res) {
	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		userObj.profile.email = req.body.email;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!", email: newUser.profile.email });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	}).catch((error) => {
		res.json({ success: false, message: error });
	});
});

//post user update password
router.post('/user/update_password', function (req, res) {
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;
	if ((newPassword != confirmPassword) || newPassword == null || newPassword == undefined || newPassword == "") {
		res.json({ success: false, message: "Please enter valid new password and confirm password!" });
		return;
	}

	users.getUserBySessionIdAndPassword(req.cookies.next_movie, req.body.oldPassword).then((userObj) => {
		var hash = crypto.createHash("sha1");
		hash.update(newPassword);
		var password = hash.digest("hex");

		userObj.hashedPassword = password;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	}).catch((error) => {
		res.json({ success: false, message: error });
	});
});

//post user removes genre from preferences
router.post('/user/delete_genre', function (req, res) {
	var deleteVal = req.body.value;

	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var genreArr = userObj.preferences.Genre;
		var newGenArr = [];
		for (var i = 0; i < genreArr.length; i++) {
			if (genreArr[i] != deleteVal) {
				newGenArr.push(genreArr[i]);
			}
		}

		userObj.preferences.Genre = newGenArr;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	}).catch((error) => {
		res.json({ success: false, message: error });
	});
});

//post user adds genre to preferences
router.post('/user/add_genre', function (req, res) {
	var addVal = req.body.value;

	movie.getAllGenre().then((genreList) => {
		var flag = true;
		for (var i = 0; i < genreList.length; i++) {
			if (addVal == genreList[i]) {
				flag = false;
				break;
			}
		}

		if (flag) {
			res.json({ success: false, message: "This genre value is not valid!" });
			return;
		}

		users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
			var genreArr = userObj.preferences.Genre;
			var flag = true;
			for (var i = 0; i < genreArr.length; i++) {
				if (genreArr[i] == addVal) {
					flag = false;
					break;
				}
			}

			if (!flag) {
				res.json({ success: false, message: "This genre value has been added!" });
				return;
			}

			genreArr.push(addVal);
			userObj.preferences.Genre = genreArr;
			users.updateUserById(userObj._id, userObj).then((newUser) => {
				if (newUser) {
					res.json({ success: true, message: "Update success!" });
				}
			}).catch((error) => {
				res.json({ success: false, message: error });
			});
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user removes age rating from preferences
router.post('/user/delete_ageRating', function (req, res) {
	var deleteVal = req.body.value;

	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var ageArr = userObj.preferences.ageRating;
		var newAgeArr = [];
		for (var i = 0; i < ageArr.length; i++) {
			if (ageArr[i] != deleteVal) {
				newAgeArr.push(ageArr[i]);
			}
		}

		userObj.preferences.ageRating = newAgeArr;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	}).catch((error) => {
		res.json({ success: false, message: error });
	});
});

//post user adds age rating to preferences
router.post('/user/add_ageRating', function (req, res) {
	var addVal = req.body.value;

	movie.getAllAgeRating().then((ageRatingList) => {
		var flag = true;
		for (var i = 0; i < ageRatingList.length; i++) {
			if (addVal == ageRatingList[i]) {
				flag = false;
				break;
			}
		}

		if (flag) {
			res.json({ success: false, message: "This age rating value is not valid!" });
			return;
		}

		users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
			var ageArr = userObj.preferences.ageRating;
			var flag = true;
			for (var i = 0; i < ageArr.length; i++) {
				if (ageArr[i] == addVal) {
					flag = false;
					break;
				}
			}

			if (!flag) {
				res.json({ success: false, message: "This age rating value has been added!" });
				return;
			}

			ageArr.push(addVal);
			userObj.preferences.ageRating = ageArr;
			users.updateUserById(userObj._id, userObj).then((newUser) => {
				if (newUser) {
					res.json({ success: true, message: "Update success!" });
				}
			}).catch((error) => {
				res.json({ success: false, message: error });
			});
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user removes keywords from preferences
router.post('/user/delete_keywords', function (req, res) {
	var deleteVal = req.body.value;

	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var keywordArr = userObj.preferences.keywords;
		var newKeywordArr = [];
		var flag = true;
		for (var i = 0; i < keywordArr.length; i++) {
			if (keywordArr[i] == deleteVal) {
				flag = false;
			} else {
				newKeywordArr.push(keywordArr[i]);
			}
		}
		if (flag) {
			res.json({ success: false, message: "This keyword value has not been added!" });
			return;
		}

		userObj.preferences.keywords = newKeywordArr;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user adds keywords to preferences
router.post('/user/add_keywords', function (req, res) {
	var addVal = req.body.value;

	api.getKeywordIdByName(addVal).then((keyword) => {
		if (keyword) {
			users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
				var keywordArr = userObj.preferences.keywords;
				var flag = true;
				for (var i = 0; i < keywordArr.length; i++) {
					if (keywordArr[i] == addVal) {
						flag = false;
						break;
					}
				}
				if (!flag) {
					res.json({ success: false, message: "This keyword value has been added!" });
					return;
				}

				keywordArr.push(addVal);
				users.updateUserById(userObj._id, userObj).then((newUser) => {
					if (newUser) {
						res.json({ success: true, message: "Update success!" });
					}
				}).catch((error) => {
					res.json({ success: false, message: error });
				});
			});
		} else {
			res.json({ success: false, message: "Keyword not found!" });
		}
	}).catch((error) => {
		res.json({ success: false, message: error });
	});
});

//post user adds year to preferences
router.post('/user/add_releaseYear', function (req, res) {
	var year = req.body.year;
	var now = new Date();

	if (year < 1900 || year > now.getFullYear) {
		res.json({ success: false, message: "Year is not valid!" });
		return;
	}

	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var releaseYear = userObj.preferences.releaseYear;
		var newReleaseYear = [];
		var flag = true;
		for (var i = 0; i < releaseYear.length; i++) {
			if (releaseYear[i] == year) {
				flag = false;
			} else {
				newReleaseYear.push(releaseYear[i]);
			}
		}

		if (!flag) {
			res.json({ success: false, message: "The year has been added!" });
			return;
		}

		newReleaseYear.push(year);
		userObj.preferences.releaseYear = newReleaseYear;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user removes year from preferences
router.post('/user/delete_releaseYear', function (req, res) {
	var year = req.body.value;
	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var releaseYear = userObj.preferences.releaseYear;
		var newReleaseYear = [];
		var flag = true;
		for (var i = 0; i < releaseYear.length; i++) {
			if (releaseYear[i] == year) {
				flag = false;
			} else {
				newReleaseYear.push(releaseYear[i]);
			}
		}

		if (flag) {
			res.json({ success: false, message: "You did not add this year!" });
			return;
		}

		userObj.preferences.releaseYear = newReleaseYear;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user adds person to preferences
router.post('/user/add_person', function (req, res) {
	var addVal = req.body.value;

	api.getCreditByPersonId(addVal).then((person) => {
		if (person.id == null || person.id == undefined) {
			res.json({ success: false, message: "Person doesn't exist!" });
			return;
		}

		addVal = person.name;
		users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
			var actorArr = userObj.preferences.Actor;
			var newActorArr = [];
			var crewArr = userObj.preferences.Crew;
			var newCrewArr = [];
			var flag = true;
			var mark = "";

			//if person has both cast and crew credits, mark as actor if cast credits are more than crew credits
			if (person.movie_credits.cast.length > 0 && person.movie_credits.cast.length > person.movie_credits.crew.length) {
				mark = "actor";
				for (var i = 0; i < actorArr.length; i++) {
					if (actorArr[i] == addVal) {
						flag = false;
					} else {
						newActorArr.push(actorArr[i]);
					}
				}
				if (!flag) {
					res.json({ success: false, message: "The actor has been added!" });
					return;
				}

				newActorArr.push(addVal);
				userObj.preferences.Actor = newActorArr;
			} else if (person.movie_credits.crew.length > 0) { //mark as crew
				flag = true;
				mark = "crew";
				for (var i = 0; i < crewArr.length; i++) {
					if (crewArr[i] == addVal) {
						flag = false;
					} else {
						newCrewArr.push(crewArr[i]);
					}
				}
				if (!flag) {
					res.json({ success: false, message: "The crew has been added!" });
					return;
				}

				newCrewArr.push(addVal);
				userObj.preferences.Crew = newCrewArr;
			} else {
				res.json({ success: false, message: "The person is not Actor or Crew!" });
				return;
			}

			users.updateUserById(userObj._id, userObj).then((newUser) => {
				if (newUser) {
					res.json({ success: true, mark: mark, name: addVal, message: "Update success!" });
				}
			}).catch((error) => {
				res.json({ success: false, message: error });
			});
		});
	});
});

//post user removes actor from preferences
router.post('/user/delete_actor', function (req, res) {
	var actor = req.body.value;
	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var actorArr = userObj.preferences.Actor;
		var newActorArr = [];
		var flag = true;
		for (var i = 0; i < actorArr.length; i++) {
			if (actorArr[i] == actor) {
				flag = false;
			} else {
				newActorArr.push(actorArr[i]);
			}
		}
		if (flag) {
			res.json({ success: false, message: "You did not add this actor!" });
			return;
		}

		userObj.preferences.Actor = newActorArr;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user removes crew from preferences
router.post('/user/delete_crew', function (req, res) {
	var crew = req.body.value;
	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		var crewArr = userObj.preferences.Crew;
		var newCrewArr = [];
		var flag = true;
		for (var i = 0; i < crewArr.length; i++) {
			if (crewArr[i] == crew) {
				flag = false;
			} else {
				newCrewArr.push(crewArr[i]);
			}
		}
		if (flag) {
			res.json({ success: false, message: "You did not add this crew!" });
			return;
		}

		userObj.preferences.Crew = newCrewArr;
		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

//post user clears all preferences
router.post('/user/clear_preferences', function (req, res) {
	users.getUserBySessionId(req.cookies.next_movie).then((userObj) => {
		userObj.preferences.Actor = [];
		userObj.preferences.Genre = [];
		userObj.preferences.Crew = [];
		userObj.preferences.releaseYear = [];
		userObj.preferences.ageRating = [];
		userObj.preferences.keywords = [];

		users.updateUserById(userObj._id, userObj).then((newUser) => {
			if (newUser) {
				res.json({ success: true, message: "Update success!" });
			}
		}).catch((error) => {
			res.json({ success: false, message: error });
		});
	});
});

module.exports = router;