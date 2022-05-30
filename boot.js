function renderTopBar(title = ' ', subtitle = '', buttonHTML = '', showSearch = false, additionalHTML = '', showBack = true) {
    return `<div class="topbar flx">` + ((showBack) ? `<button onclick="window.history.back();" class="acss aobh no_print" style="padding:0.5em;font-size:16px;white-space:pre;transition-duration:0s" id="btn_back" tabindex="0" title="back"><b>く<span class="no_mobile"> back</span></b></button>` : "") + `
    <div id="topbar_loading"></div>
    <div class="dwhdt flx dwhdto"><div class="dwhdt">
        <b id="topbar_title_wrap">
            <b id="topbar_title_inwrap_main">
                <h4 id="topbar_title">` + title + '</h4><p4 id="topbar_subtitle">' + subtitle + `</p4>
            </b>
            <b id="topbar_title_inwrap_secondary">
                <div id="topbar_title_inwarp_sec_buf"></div><h4 id="topbar_inwrap_title"></h4><p4 id="topbar_inwrap_subtitle"></p4>
            </b>
        </b>
    </div></div>
    <div class="flx dwhda">` + buttonHTML + `</div></div>`
}

function renderErrorPage(title, message) {
    return `<div class="b flx">
    <div class="x flx">
      <div class="p">
        <h1><b>` + title + `</b></h1><br>
        <p1 style="opacity:0.8"><b>` + message + `</b></p1>
      </div>
      <img alt="` + title + `" class="i" src="` + resourceNETpath + `image/nojs.png">
    </div>
  </div>
  
  <style>
    body{overflow-y:hidden;background-color:black;font-family:AppleSDGothicNeo-Regular, PingFangHK-Regular, Calibri, Microsoft JhengHei, verdana}
    h1{font-size:1.375em;margin:0;vertical-align:middle;display:inline} p1{font-size:0.975em}
    .b{color:white;justify-content:space-between;position:fixed;bottom:0;left:0;right:0;border-top:0.15em solid #3f3c39;padding:0.75em;padding:0.75em calc(0.75em + env(safe-area-inset-right)) calc(0.75em + env(safe-area-inset-bottom)) calc(0.75em + env(safe-area-inset-left))}
    .i{object-fit:contain;height:3.25em} .p, .i, .aobh{margin:0.25em} .x, .i{order:1} .y, .p{order:2}
    .s{display:inline;border-radius:0.25em;background-color:#008000;padding:0.1em 0.25em;margin:0.25em 0.375em 0.25em 0}
    .flx{flex-flow:wrap;display:flex;align-items:center} .flx div{vertical-align:middle}
    @media print{.no_print{display:none!important} body, .s{background-color:white} .s{border:1px solid black} .b{color:black} .i{filter:brightness(0.2)}}
  </style>`
}

var popArray = []

var LoadingStatusQueue = 0;
var errorLoadingCSS = ['<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;animation:none}</style>', '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>']

function LoadingStatus(type, presistant = false, title = '', subtitle = '') {
    if (type != 'hide' && LoadingStatusQueue > 0) {
        //console.log('[LoadingStatus] ' + type + ' queued')
        setTimeout(() => { LoadingStatus(type, presistant, title, subtitle) }, 500, type, presistant, title, subtitle);
        return false;
    }

    var l = document.getElementById("topbar_loading");
    var presistTime = 2850;
    switch (type) {
        case 'success':
            LoadingStatus('show')
            presistTime = 2850; LoadingStatusQueue += 1; setTimeout(() => { LoadingStatusQueue -= 1 }, presistTime + 750)
            l.innerHTML = '<style>#topbar_loading::before{border-color:#33ff99!important;background-color:#33ff99;color:green;animation:none;content:"✓"}</style>'
            break
        case 'warning':
            LoadingStatus('show')
            presistTime = 6350; LoadingStatusQueue += 1; setTimeout(() => { LoadingStatusQueue -= 1 }, presistTime + 750)
            l.innerHTML = '<style>#topbar_loading::before{border-color:#ffaa33!important;animation:none}</style>'
            setTimeout(() => { l.style.opacity = 0.3 }, 600)
            setTimeout(() => { l.style.opacity = 1 }, 1300)
            setTimeout(() => { l.style.opacity = 0.3 }, 2000)
            setTimeout(() => { l.style.opacity = 1 }, 2700)
            break
        case 'error':
            LoadingStatus('show')
            presistTime = 6850; LoadingStatusQueue += 1; setTimeout(() => { LoadingStatusQueue -= 1 }, presistTime + 750)
            l.innerHTML = errorLoadingCSS[1]
            setTimeout(() => { l.innerHTML = errorLoadingCSS[0] }, 850)
            setTimeout(() => { l.innerHTML = errorLoadingCSS[1] }, 1350)
            setTimeout(() => { l.innerHTML = errorLoadingCSS[0] }, 1850)
            setTimeout(() => { l.innerHTML = errorLoadingCSS[1] }, 2350)
            setTimeout(() => { l.innerHTML = errorLoadingCSS[0] }, 2850)
            setTimeout(() => { l.innerHTML = errorLoadingCSS[1] }, 3350)
            break
        case 'show':
            LoadingStatusQueue += 1; setTimeout(() => { LoadingStatusQueue -= 1 }, 50)
            l.innerHTML = "";
            l.style.display = 'unset';
            setTimeout(() => {
                l.style.opacity = 1;
                l.style.transform = 'translateX(0)';
                l.style.width = '2.25em';
            }, 25)
            presistant = true;
            break
        case 'hide':
            LoadingStatusQueue += 1; setTimeout(() => { LoadingStatusQueue -= 1 }, 700)
            l.style.opacity = 0;
            l.style.transform = 'translateX(-1.5em)';
            setTimeout(() => {
                l.style.width = '0';
            }, 0) //50
            setTimeout(() => {
                l.style.display = 'none';
                l.innerHTML = "";
            }, 650) //700
            presistant = true;
            break
    }
    if (title) {
        document.getElementById("topbar_title_inwarp_sec_buf").style.maxHeight = '0'
        document.getElementById("topbar_title_inwrap_secondary").style.maxHeight = '0'
        document.getElementById("topbar_title_inwrap_main").style.opacity = 0
        document.getElementById("topbar_title_inwrap_secondary").style.opacity = 0
        document.getElementById("topbar_inwrap_title").innerText = title
        document.getElementById("topbar_inwrap_subtitle").innerText = subtitle
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_main").style.display = 'none'
            document.getElementById("topbar_title_inwrap_secondary").style.opacity = 1
            document.getElementById("topbar_title_inwrap_secondary").style.maxHeight = 'unset'
            document.getElementById("topbar_title_inwarp_sec_buf").style.maxHeight = '3.5em'
        }, 200)
    }
    if (!presistant) {
        setTimeout(() => {
            LoadingStatus('hide')
        }, presistTime - 300)
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_secondary").style.opacity = 0
            document.getElementById("topbar_title_inwarp_sec_buf").style.maxHeight = '0'
        }, presistTime - 200)
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_main").style.display = 'block'
            document.getElementById("topbar_inwrap_title").innerText = ''
            document.getElementById("topbar_inwrap_subtitle").innerText = ''
            setTimeout(() => { document.getElementById("topbar_title_inwrap_main").style.opacity = 1 }, 200)
        }, presistTime)
    }
}

//easy post to server
window.post = function (url, data) {
    return fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

//add css into html
function installCSS(targetCSS) {
    var stylesheet = document.createElement('link')
    stylesheet.href = resourceNETpath.concat(targetCSS)
    stylesheet.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(stylesheet)
}
installCSS('webel.css')

//make back button works
window.onpopstate = function (event) {
    popArray.pop()
    boot(decodeURIComponent((event.state) ? event.state.plate : window.location.pathname), true)
}

//<a href=""> -> <a onclick="boot()">
function hrefInterrupt(event) {
    if (!(event.target.getAttribute('href').startsWith('http://') || event.target.getAttribute('href').startsWith('https://'))) {
        event.preventDefault();
        boot(event.target.getAttribute('href'));
    }
}

//list of post-script cleanup
function postCleanup() {
    document.querySelectorAll('a').forEach(link => link.addEventListener('mousedown', hrefInterrupt));
    exe('cleanup')
}

//load new page
var prev_boot_call = 'none';
var isBootRunning = false;

function boot(path, noHistory) {

    //check if boot is already running, prevent accidental double-clicking and overwriting
    if (isBootRunning) {
        console.log('[boot] boot aready running! current process: '.concat(prev_boot_call).concat(', ').concat(path).concat(' will be skipped loading.'));
        return false; //stop running boot
    }

    isBootRunning = true;

    //check should add current URL into history, then change URL shown in browser
    (noHistory) ? history.replaceState(null, window.title, path) : history.pushState({ plate: path }, window.title, path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    //window.removeEventListener('scroll', dwLib_scrolling); //remove infinite scroll script from lib
    //document.querySelectorAll('.lib_div').forEach(e => e.remove()); //remove lib div from body

    if (path == '/' || path == '' || path == undefined) { //home page
        path = '/';

    } else if (path.startsWith('/!')) { //reserved for api call, invalid for HTML, no init and no script
        path = undefined;

    } else { //any other page
        //path = path;

    }

    if (prev_boot_call != path) { //if already init page then don't init it again

        prev_boot_call = path;
        document.getElementById('core').innerHTML = init(path);
        postCleanup();

    }

    exe(path); //execute scripts

    isBootRunning = false;

    return true;
}

boot(window.location.pathname + ((document.URL.split('#')[1]) ? "#" + document.URL.split('#')[1] : ''), true)