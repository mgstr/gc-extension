const baseUrl = "https://www.geocaching.com/play/results"
const totalEnabled = "?sort=distance&asc=true&st=Estonia&ot=country&oid=66&r=16&sd=0"
const _notFound = "?st=Estonia&ot=country&oid=66&r=16&hf=1&nfb=mgstr&sd=0"
const notFound = "?sort=distance&asc=true&st=Estonia&ot=country&oid=66&r=16&ct=2%2C3%2C8%2C137%2C5%2C11%2C1858%2C4%2C3773%2C9&hf=1&nfb=mgstr&sd=0"

console.log("GC extension on the search page")

const totals = document.createElement("li")
totals.innerHTML = `<a href="${baseUrl}${totalEnabled}"><span id="total"></span></a> / <a href="${baseUrl}${notFound}"><span id="not_found"></span></a>`
document.querySelector("ul.gc-menu").appendChild(totals)

const parser = new DOMParser()

async function getTotal(query, parser) {
    const response = await fetch(baseUrl + query)
    const html = await response.text()
    const dom = parser.parseFromString(html, "text/html")
    const jsonString = dom.querySelector("script#__NEXT_DATA__").innerText
    const jsonData = JSON.parse(jsonString)
    const total = jsonData.props.pageProps.searchResults.total
    return total
}

hideShop()

getTotal(totalEnabled, parser).then(total => document.querySelector("span#total").innerText = total)
getTotal(notFound, parser).then(total => document.querySelector("span#not_found").innerText = total)

function hideShop() {
    const shopElement = document.querySelector("button.toggle-SHOP")
    if (shopElement) {
        shopElement.style.display = "none"
    } else {
        setTimeout(() => hideShop(), 500)
    }
}