window.addEventListener('DOMContentLoaded', () => {
    const val = id => document.getElementById(id).value;
    const setVal = (id, v) => document.getElementById(id).value = v;
    const setText = (id, txt) => document.getElementById(id).textContent = txt;
    const toggleDisplay = (id, show) => document.getElementById(id).style.display = show ? "block" : "none";

    function clearErrors() {
        document.querySelectorAll(".error").forEach(e => e.textContent = "");
    }

    function error(id, message) {
        document.getElementById(id).textContent = message;
        return false;
    }

    function setSession(name, value) {
        sessionStorage.setItem(name, value);
    }

    function getSession(name) {
        return sessionStorage.getItem(name);
    }

    function deleteSession(name) {
        sessionStorage.removeItem(name);
    }

    function showUserInfo() {
        toggleDisplay("registrationForm", false);
        toggleDisplay("userInfoForm", true);
    }

    function loadUserData() {
        const email = getSession("user");
        if (!email) return;

        setText("userEmail", email);
        try {
            const d = JSON.parse(getSession("userData") || "{}");
            for (let key of ["firstName", "lastName", "year", "gender", "phone", "skype"]) {
                const value = d[key === "firstName" ? "name" : key === "lastName" ? "lname" : key] || "";
                setVal(key, value);
            }
        } catch { }
    }

    function signUp() {
        const email = val("email").trim();
        const password = val("password");
        const repeat = val("repeat");
        clearErrors();

        let valid = true;

        if (!/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(email))
            valid = error("emailError", "Wrong email address");

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password))
            valid = error("passwordError", "Password must contain 6+ chars, upper/lower/digit");

        if (password !== repeat)
            valid = error("repeatError", "Passwords must match");

        if (valid) {
            setSession("user", email);
            showUserInfo();
            setText("userEmail", email);
        }
    }

    function saveUserInfo() {
        clearErrors();
        let valid = true;

        const data = {
            name: val("firstName").trim(),
            lname: val("lastName").trim(),
            year: +val("year"),
            gender: val("gender"),
            phone: val("phone").trim(),
            skype: val("skype").trim()
        };

        if (!/^[A-Za-zА-Яа-яІіЇїЄє]{1,20}$/.test(data.name))
            valid = error("firstNameError", "Enter a valid first name (max 20 letters)");
        if (!/^[A-Za-zА-Яа-яІіЇїЄє]{1,20}$/.test(data.lname))
            valid = error("lastNameError", "Enter a valid last name (max 20 letters)");
        if (!data.year || data.year < 1900 || data.year > new Date().getFullYear())
            valid = error("yearError", "Enter valid year >= 1900");
        if (!data.gender)
            valid = error("genderError", "Select gender");
        const digits = data.phone.replace(/\D/g, "");
        if (data.phone && (digits.length < 10 || digits.length > 12))
            valid = error("phoneError", "Phone must contain 10-12 digits");
        if (data.skype && !/^[\w.-]*$/.test(data.skype))
            valid = error("skypeError", "Invalid Skype username");

        if (valid) {
            setSession("userData", JSON.stringify(data));
            alert("Saved!");
        }
    }

    function exitUser() {
        ["user", "userData"].forEach(deleteSession);
        location.reload();
    }

    document.getElementById("signUpBtn").addEventListener("click", signUp);
    document.getElementById("saveBtn").addEventListener("click", saveUserInfo);
    document.getElementById("exitBtn").addEventListener("click", e => {
        e.preventDefault();
        exitUser();
    });

    if (getSession("user")) {
        showUserInfo();
        loadUserData();
    }
});
