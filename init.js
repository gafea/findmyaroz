//code to run before DOM render, return html code to display in DOM
function init(path) {
    if(path != '/') { history.replaceState(null, window.title, '/'); path = '/' }
    window.title = "findmyaroz"

    return renderTopBar("findmyaroz", "", "", "", "", false) + `
    <div class="edge2edge card">
        <div id="content"></div>
    </div>
    `
}

//code to run after DOM render
function exe(path) {
    if (path === 'cleanup') { return }

    refresh()
}

setInterval(() => refresh(), 8000)

var refresh_ongoing = false
const refresh = () => {
    if (refresh_ongoing) {console.log("refresh already running");return}

    refresh_ongoing = true
    LoadingStatus('show')
    try {
        fetch("/!foundAROZ/").then(r => r.json())
        .then(resp => {
            var content = 'date: ' + Date.now()
            Object.keys(resp).forEach(key => {
                content += `<div style="border:0.15em solid #aad2f0; padding:1em; margin:0.5em; border-radius:1em; line-break:anywhere"><a href="http://` + key + `">` + key + `</a><hr>` + JSON.stringify(resp[key]) + `</div>`
            })
            document.getElementById("content").innerHTML = content
            LoadingStatus('hide')
            refresh_ongoing = false
        }).catch(error => {
            LoadingStatus('error', false, "failed to refresh", error)
            setTimeout(() => refresh_ongoing = false, 4250)
        })
    } catch (error) {
        LoadingStatus('error', false, "failed to refresh", error)
        setTimeout(() => refresh_ongoing = false, 4250)
    }
}