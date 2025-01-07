const pagePrefix = "https://www.geocaching.com/geocache/"
const cache = window.location.href.substring(pagePrefix.length)
console.log("GP chrome extension loaded on cache page", cache)
addLinkToGP(cache)
hideDisclaimer()
hideShop()
addCSSStyle()
addDoubleClickOnLogs()

function addDoubleClickOnLogs() {
    const success = () => {
        if (chrome.runtime.lastError) {
            console.error("Error removing data:", chrome.runtime.lastError);
            return false
        } 
        return true
    }
    document.querySelectorAll('tr.log-row')
        .forEach(row => {
            const logId = Array.from(row.classList).find(className => /^l-\d+$/.test(className))
            const storageKey = `${cache}.${logId}`
            chrome.storage.local.get(storageKey, function (result) {
                if (success()) {
                    if (result[storageKey]) {
                        row.classList.add("read-only")
                    }
                }
            })

            row.addEventListener('dblclick', function () {
                const storageValue = this.classList.toggle('read-only')
                if (storageValue) {
                    chrome.storage.local.set({ [storageKey]: true }, () => {
                        if (success()) {
                            chrome.storage.local.get(null, (result) => console.warn(result))
                        }
                    })
                } else {
                    chrome.storage.local.remove(storageKey, () => {
                        success()
                    })
                }
            })
        })
}

function addCSSStyle() {
    const style = document.createElement('style');
    style.textContent = `
    .read-only {
        color: gray;
        background-color: #f0f0f0;
        opacity: 0.6;
    }
    `;

    // Append the <style> element to the document's <head>
    document.head.appendChild(style);

    console.log('New CSS class added to the page.');
}

function hideShop() {
    const shopElement = document.querySelector("button.toggle-SHOP")
    if (shopElement) {
        shopElement.style.display = "none"
    } else {
        setTimeout(() => hideShop(), 500)
    }
}

function hideDisclaimer() {
    document.querySelector("div.Disclaimer").style.display = "none"
}

function addLinkToGP(cache) {
    const cacheDetailsElement = document.querySelector("div#cacheDetails")
    if (!cacheDetailsElement) {
        console.error("Can't find cache details div")
    } else {
        const url = chrome.runtime.getURL(`gc2gp/${cache}`)
        fetch(url)
            .then(response => response.text())
            .then(gp => {
                if (!gp) {
                    console.warn("GP page not found")
                } else {
                    console.log("let's put an link")
                    cacheDetailsElement.appendChild(createGPLink(gp))
                }
            })
            .catch(err => console.error(err))
    }
}

function createGPLink(gpPage) {
    const element = document.createElement("div")
    element.innerHTML = `<a href="https://www.geopeitus.ee/aare/${gpPage}">GP page</a>`
    return element
}
