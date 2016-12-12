module.exports = {
  login(username, password, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    loginRequest(username, password, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  register(username, password, confirm, email, name, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    registerRequest(username, password, confirm, email, name, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken: function () {
    return localStorage.token
  },

  logout: function (cb) {
    delete localStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn: function () {
    return !!localStorage.token
  },

  onChange: function () { }
}

function loginRequest(username, password, cb) {
  if (!username) {
    return cb({
      authenticated: false
    })
  };
  if (!password) {
    return cb({
      authenticated: false
    })
  };
  var requestConfig = {
    method: "POST",
    url: "/user/login",
    contentType: 'application/json',
    data: JSON.stringify({
      username: username,
      password: password,
    })
  };
  $.ajax(requestConfig).then((responseMessage) => {
    if (responseMessage.success) {
      cb({
        authenticated: true,
        token: responseMessage.token
      })
    } else {
      cb({
        authenticated: false
      })
    }
  });

}
function registerRequest(username, password, confirm, email, name, cb) {
  if (!username || !password || !confirm || !name || !email) {
    return cb({
      authenticated: false
    })
  };

  var requestConfig = {
    method: "POST",
    url: "/user/register",
    contentType: 'application/json',
    data: JSON.stringify({
      username: username,
      password: password,
      name: name,
      email: email,
      confirm: confirm
    })
  };
  $.ajax(requestConfig).then((responseMessage) => {
    if (responseMessage.success) {
      cb({
        authenticated: true,
        token: responseMessage.token
      })
    } else {
      cb({
        authenticated: false
      })
    }
  });
}
