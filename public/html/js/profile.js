console.log('in')

const getUser = {
  token: localStorage.getItem('access_token')
}

console.log(getUser)

if (getUser.token !== null) {
  console.log('login')
} else {
  window.location.href = 'http://3.13.254.132/api/1.0/user/signin'
}

const xhr = new XMLHttpRequest()
xhr.open('POST', 'http://3.13.254.132/api/1.0/user/profile', true)
xhr.setRequestHeader('Content-type', 'application/json')

const getToken = localStorage.getItem('access_token')

xhr.onload = function () {
  if (xhr.readyState === 4) {
    let data = ''
    data = xhr.responseText
    const userData = JSON.parse(data)
    console.log(userData)

    document.getElementsByClassName('userName')[0].textContent = '用戶name: ' + userData.data.name + ''
    document.getElementsByClassName('userEmail')[0].textContent = '用戶email: ' + userData.data.email + ''

    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('access_token')
      window.location.href = 'http://3.13.254.132/index.html'
    })
  }
}

xhr.send(JSON.stringify(getUser))
