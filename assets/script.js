const apiUrl = "https://esi.evetech.net/latest/"

//We will store different api data here so we dont need to fetch it again all the time.
//Using map because it is easier to control and bit faster
let apiData = new Map();

//https://any-api.com/evetech_net/evetech_net/docs/API_Description

//Check that DOM is ready.
document.addEventListener("DOMContentLoaded",function(e) {
    var currentPage = window.location.pathname.split("/").pop();
    
    switch (currentPage) {
        case "marketplaceajax":
            getAllData()
            break;
    
        default:
            console.log(currentPage)
            break;
    }
	
});


function getAllData(save=true) {
	$.getJSON(apiUrl+"markets/prices", function(data){
		if(save == true);
			apiData.set('markets',data);
		//console.log(JSON.stringify(data));
	}).done(function() {


		$.getJSON("api/types", function(idata){
				apiData.set('items',idata);
		}).done(function() {
			renderMarkets();
		});
	});
}

function renderMarkets(anchor="#markets") {
	let target = document.querySelector(anchor)
	let html = ""
	let markets = apiData.get("markets")
	for (const market of markets) {
		let name = "<span class='red'>ITEM UNKNOWN</span>"
		if(apiData.get("items").hasOwnProperty(market.type_id)) {
			name = apiData.get("items")[market.type_id]
		}
		let template = `
			<div class="col-md-3 market-box">
				<div class="row">
					<div class="offset-md-1 col-md-10 market-item">
						<p>${name}</p>
						<span>Adjusted <span class="bold">${market.adjusted_price}</span></span><br>
						<span>Price AVG <span class="bold">${market.average_price}</span></span>
					</div>
				</div>
			</div>
		`



				
		html += template
	}

	target.innerHTML = html
	
}