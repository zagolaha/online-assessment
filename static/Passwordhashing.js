const btn = document.getElementById('LogInForm');
btn.addEventListener('submit', handleSubmit);

async function hashPassword(password){
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return toHex(hashBuffer);
}

async function toHex(buffer){
    const byteArr = new Uint8Array(buffer);
    const hexCodes = [...byteArr].map(byte => {
        const hexCode = byte.toString(16).padStart(2, '0');
        return hexCode;
    });
    return hexCodes.join('');
}

async function handleSubmit(event){
    event.preventDefault();
    const username = document.getElementById('e-mail').value;
    const password = document.getElementById('password').value;
    const hashedPassword =  await hashPassword(password);
    const response = await fetch("/LogIn",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:
            JSON.stringify({ username:username, password: hashedPassword })
    });
    if (response.ok) {
        const redirectUrl = response.url;
        window.location.href = redirectUrl;
    } else {
        console.log("Login failed:");
    }
}
