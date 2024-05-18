document
?.querySelector(".register")
?.addEventListener("submit", (event) => {
    event.preventDefault()
    let { login, password, repeat_password } = event.target
    console.log(login, password, repeat_password)
    if (password.value != repeat_password.value) {
        alertify.error("Passwords is not match")
        return
    }

    let user = {
        login: login.value,
        password: password.value
    }
    let xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/register")
    xhr.onload = () => {
        alertify.success("Register success")
    }
    xhr.send(JSON.stringify(user))

})

document
?.querySelector(".register")
?.addEventListener("submit", (event) => {
    event.preventDefault()
    let { login, password } = event.target
    console.log(login, password)

    let user = {
        login: login.value,
        password: password.value
    }
    let xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/register")
    xhr.onload = () => {
        if(xhr.status == 200){
            let token = xhr.response
            document.cookie = `token = ${token}`
            location.assign("/")
        }else{
            alertify.error(xhr.response)
        }
    }
    xhr.send(JSON.stringify(user))

})