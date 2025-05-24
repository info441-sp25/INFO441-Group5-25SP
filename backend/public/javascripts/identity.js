document.addEventListener("DOMContentLoaded", async () => {
    const identityDiv = document.getElementById("identity_div");


    try {
        const res = await fetch("/myIdentity");
        const data = await res.json();
        console.log(data)


        if (data.status === "loggedin") {
            identityDiv.innerHTML = `
                <p>Hello, ${escapeHTML(data.userInfo.name)}</p>
                <a href="/signout" class="btn btn-danger">Sign out</a>`;
        } else {
            identityDiv.innerHTML = `<a href="/signin" class="btn btn-primary">Sign in</a>`;
        }
    } catch (err) {
        identityDiv.innerHTML = `<a href="/signin" class="btn btn-primary">Sign in</a>`;
    }
});


function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}