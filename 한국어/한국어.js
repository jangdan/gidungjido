
var LOADABLE_DATASETS = [

	{ name: "기본",

		datasets: [
			{ name: "국내총생산 (GDP)", index: 0 },
			{ name: "인구", index: 1 }
		]

	},

	{ name: "The World Bank",

		datasets: [ //from http://data.worldbank.org/indicator

			{ name: "GDP (현재 US$)", indicatorid: "NY.GDP.MKTP.CD", date: "2015" },
			{ name: "1인당 GDP (현재 US$)", indicatorid: "NY.GDP.PCAP.CD", date: "2015" },
			{ name: "GDP 성장률 (전년 대비 %)", indicatorid: "NY.GDP.MKTP.KD.ZG", date: "2015" },
			{ name: "1인당 GDP 성장률 (전년 대비 %)", indicatorid: "NY.GDP.PCAP.KD.ZG", date: "2015" },
			{ name: "지출 (GDP 대비 %)", indicatorid: "GC.XPN.TOTL.GD.ZS", date: "2013" },

			/*

			//copy and fill in below for new World Bank datasets:
			
			{ name: "GDP", indicatorid: "asdf", date: "2015" },

			*/

		]

	}

];



var MATERIAL_INDICIES = [
	"MeshNormalMaterial",
	"국기"
];