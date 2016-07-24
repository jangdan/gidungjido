
var LOADABLE_DATASETS = [

	{ name: "preloaded",

		datasets: [
			{ name: "Gross Domestic Product", index: 0 },
			{ name: "Population", index: 1 }
		]

	},

	{ name: "The World Bank",

		datasets: [ //from http://data.worldbank.org/indicator

			{ name: "GDP (current US$)", indicatorid: "NY.GDP.MKTP.CD", date: "2015" },
			{ name: "GDP per capita (current US$)", indicatorid: "NY.GDP.PCAP.CD", date: "2015" },
			{ name: "GDP growth (annual %)", indicatorid: "NY.GDP.MKTP.KD.ZG", date: "2015" },
			{ name: "GDP per capita growth (annual %)", indicatorid: "NY.GDP.PCAP.KD.ZG", date: "2015" },
			{ name: "Expense (% of GDP)", indicatorid: "GC.XPN.TOTL.GD.ZS", date: "2013" },

			/*

			//copy and fill in below for new World Bank datasets:
			
			{ name: "GDP", indicatorid: "asdf", date: "2015" },

			*/

		]

	}

];



var MATERIAL_INDICIES = [
	"MeshNormalMaterial",
	"flags"
];