//code to run before DOM render, return html code to display in DOM
function init(path) {
    if (path != '/') { history.replaceState(null, window.title, '/'); path = '/' }
    window.title = "findmyaroz"

    return renderTopBar("findmyaroz", "", `
    <button class="dwhdab no_print" id="topbtn_refresh" onclick="(event.shiftKey) ? window.location.reload(true) : refresh(false)" title="Refresh the list\nHold shift to reload the page">
    <img alt="Refresh" draggable="false" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB7UExURUdwTDDNZjDNZjDNZi7NZTDNZi7NZTDNZi7OZi/NZS/NZjDNZjDNZjDNZjDNZi/NZTDNZjDNZjDNZjDNZi/NZTDNZjDNZjDNZjDNZi/NZjDNZjDNZjDNZjDNZjDNZjDNZi/NZjDNZjDNZjDNZjDNZjDNZjDNZjDNZjDNZm+YPmAAAAAodFJOUwD9MN8E1wnMERge6PS+7hX50qk+DbV0xZpKV0V+olGSJq83Z1+Eim07tOlAAAADaklEQVRo3u1Z2XKjQAwc7hsGsA3YMfg2//+F+5Bk0YDGMTXaVG2V+hGoadCtRggGg8FgMBgMBoPBYDAYvws/VLFxCQ8P+0f76HzNXffQZoGKZruLqcjtTI7jKCv8QHeXjwgam4g8+Dqw2mC39+mIIitIyUe5R25vMpx8tK4E5HEzHXhEgumSa9jRp1eiOIOvyZDA2+nIx60xuzvA86rlef52/HfffpPwvB0SFYmW3djvtgOPc07LJ65a8iYyLWEVPC5BQt49a8ltUrsnPfLEyVnQOkEQBNmHca2LS3BofkPfz1qwV0UYhr55qsNkkjs0JY5Lk+c1SYVVPr1FvyZ2kBp3JGlwV2DVAHfj3kLiLaHoL7CApz3+TIuG+wcBe53+WLYib7I3SI8gNGe/A1teNMVo6jDOMDkhPZAavnV/ZK9gjN7N23ry87cUJSjqwFaZcbqDcNb78W9FKGPY6JMTodsf+nGzmqrwZhpDZGfa2Kf2IfsXw8fdSWV+roUQ4vGyFa8booM37RjXne3PfdWalllndfoCx5sOVSDkz+7qF242ZuyXdLUZgbNKw1n+IN8I+dkkNNUnx3Cq6uTqpuFO460T/8/swPL337c86K/D70cdbF9vZlwEMs6ww5+S1R3Lpqs2oHm+G0K9JKu0IITSN0fkD8LJrl3bscA2a+1N2Z9gEf92vH+y7eKNSDGfqUHKfR9mV06eBztNPF8ph1o4LX+6sf66cgx/mkIHYQywopWREKJoXsZBlxK6XVlPraeSUFgl88Ei7xEohXBD9E5CTApOjiwXPdh8WkEAKBgNblS+KgAR0NUIVhkhRJ3DNfKQvtBv3AcUKTcU7C5UbTzg1/Oi8N+A3a0bjUBba2TI52IYgCJCE9Kwu/h6vqhkFw9KLHtBBESRgoX320SlIhr5ROS+v8OUkVmx6TxFL6OR5cPbMcsCiWhSSra7V0UqlU8awWpraURIJaHCQX2/I0m2bSqt/gonB/c+k0dp/sb0UkeuFLqZQu1daAJu0H660rtVhdo5EGW63vAPzSg3WklPlemt1vAHnZLrdFTkmPb8ZfhCU4vLmoxcFJr/XFL93eH/tVFmC0LYDWr3+6yORp+tLx0iQYr43ngzlFW32JDCZ4ZeN6840QwFyuFrrjMYDAaDwWAwGAwGg8Ewxx8UNyHHHBzN8wAAAABJRU5ErkJggg==">
    <style>#topbtn_refresh{background-color:rgba(48,216,96,.1)} #topbtn_refresh:hover{background-color:rgba(48,216,96,.25)} #topbtn_refresh:hover:active > img{transform:rotate(-45deg)}</style>
    </button>`, "", "", false) + `
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

setInterval(() => refresh(), 9000)

var refresh_ongoing = false
var last_api_date = "0"
const refresh = (noTick = true) => {
    if (refresh_ongoing) { console.log("refresh already running"); return }

    refresh_ongoing = true
    LoadingStatus('show')
    try {
        fetch("/!foundAROZ/").then(r => r.json())
            .then(resp => {
                document.getElementById("topbar_subtitle").innerHTML = 'Last updated ' + new Date().toLocaleString()
                if (noTick) {
                    setTimeout(() => LoadingStatus('hide'), 50)
                    setTimeout(() => refresh_ongoing = false, 750)
                } else {
                    LoadingStatus('success')
                    setTimeout(() => refresh_ongoing = false, 3650)
                }

                if(noTick && resp.date === last_api_date) { return }
                last_api_date = resp.date
                var content = ''
                if (!Object.keys(resp.data).length) {
                    content += '<div class="flx" style="justify-content:center;text-align:center;width:100%"><div style="width:max-content;padding:1em;border:0.15em solid rgba(128,128,128,.3);border-radius:1em"><p2 style="opacity:0.8">findmyaroz is finding your arozOS installation, this might take a few minutes<br>Restarting your arozOS can speed up the process</p2></div></div>'
                } else {
                    Object.keys(resp.data).forEach(key => {
                        content += `<div style="border:0.15em solid rgba(128,128,128,.3); padding:1em; margin:0.5em; border-radius:1em; line-break:anywhere; width:fit-content; display:inline-block">
                        <div class="flx" style="justify-content:left">
                            <div style="margin:0.5em">
                                <a target="_blank" href="http://` + key + `">` + key + `</a>
                                ` + ((resp.data[key].version_minor) ? (`<br><p4>v` + resp.data[key].version_minor + `</p4>`) : '') + `
                            </div>
                            ` + ((resp.data[key].version_build) ? (`<div class="jtx">` + resp.data[key].version_build + `</div>`) : '') + `
                        </div>
                        <div style="margin:0.5em">
                            ` + ((resp.data[key].model) ? (`<p3>model: ` + resp.data[key].model + `</p3><br>`) : '') + `
                            ` + ((resp.data[key].vendor) ? (`<p3>vendor: ` + resp.data[key].vendor + `</p3><br>`) : '') + `
                        </div>
                        <!-- ` + JSON.stringify(resp.data[key]) + ` -->
                        </div>`
                    })
                }
                document.getElementById("content").innerHTML = content
            }).catch(error => {
                LoadingStatus('error', false, "Failed to refresh", error)
                setTimeout(() => refresh_ongoing = false, 4250)
            })
    } catch (error) {
        LoadingStatus('error', false, "Failed to refresh", error)
        setTimeout(() => refresh_ongoing = false, 4250)
    }
}