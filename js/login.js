function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === "admin@mercearia.com" && senha === "123456") {
        localStorage.setItem("usuario", "ADMIN");
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("erro").innerText = "Usuário ou senha inválidos";
    }
}
