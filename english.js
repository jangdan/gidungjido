
var LOADABLE_DATASETS = [

	{ name: "preloaded",

		datasets: [
			{ name: "Gross Domestic Product", index: 0 },
			{ name: "Population", index: 1 }
		]

	},

	{ name: "The World Bank",

		datasets: [ //from http://data.worldbank.org/indicator

			{ name: "Population, total", indicatorid: "SP.POP.TOTL", date: "2015" },
			{ name: "Population growth (annual %)", indicatorid: "SP.POP.GROW", date: "2015" },
			
			{ name: "Rural population", indicatorid: "SP.RUR.TOTL", date: "2015" },
			{ name: "Rural population (% of total population)", indicatorid: "SP.RUR.TOTL.ZS", date: "2015" },

			{ name: "Urban population", indicatorid: "SP.URB.TOTL", date: "2015" },
			{ name: "Urban population (% of total)", indicatorid: "SP.URB.TOTL.IN.ZS", date: "2015" },
			

			{ name: "Population ages 0-14 (% of total)", indicatorid: "SP.POP.0014.TO.ZS", date: "2015" },
			{ name: "Population ages 15-64 (% of total)", indicatorid: "SP.POP.1564.TO.ZS", date: "2015" },
			{ name: "Population ages 65 and above (% of total)", indicatorid: "SP.POP.65UP.TO.ZS", date: "2015" },


			{ name: "Net migration", indicatorid: "SM.POP.NETM", date: "2012" },



			{ name: "GDP (current US$)", indicatorid: "NY.GDP.MKTP.CD", date: "2015" },
			{ name: "GDP per capita (current US$)", indicatorid: "NY.GDP.PCAP.CD", date: "2015" },

			{ name: "GDP growth (annual %)", indicatorid: "NY.GDP.MKTP.KD.ZG", date: "2015" },
			{ name: "GDP per capita growth (annual %)", indicatorid: "NY.GDP.PCAP.KD.ZG", date: "2015" },
			
			{ name: "Expense (% of GDP)", indicatorid: "GC.XPN.TOTL.GD.ZS", date: "2013" },


			{ name: "Inflation, consumer prices (annual %)", indicatorid: "FP.CPI.TOTL.ZG", date: "2015" },


			{ name: "Labor force, total", indicatorid: "SL.TLF.TOTL.IN", date: "2015" },

			//(sectors)

			{ name: "Agriculture, value added (% of GDP)", indicatorid: "NV.AGR.TOTL.ZS", date: "2014" },
			{ name: "Industry, value added (% of GDP)", indicatorid: "NV.IND.TOTL.ZS", date: "2014" },
			{ name: "Services, etc., value added (% of GDP)", indicatorid: "NV.SRV.TETC.ZS", date: "2014" },


			//Aid Effectiveness

			{ name: "Mortality rate, under-5 (per 1,000 live births)", indicatorid: "SH.DYN.MORT", date: "2015" },
			{ name: "Maternal mortality ratio (modeled estimate, per 100,000 live births)", indicatorid: "SH.STA.MMRT", date: "2015" },


			//Climate Change

			{ name: "Access to electricity (% of population)", indicatorid: "EG.ELC.ACCS.ZS", date: "2012" },
			{ name: "Electric power consumption (kWh per capita)", indicatorid: "EG.USE.ELEC.KH.PC", date: "2013" },


			{ name: "Energy imports, net (% of energy use)", indicatorid: "EG.IMP.CONS.ZS", date: "2015" },

			{ name: "Renewable electricity output (% of total electricity output)", indicatorid: "EG.ELC.RNEW.ZS", date: "2012" },


			{ name: "CO2 emissions (metric tons per capita)", indicatorid: "EN.ATM.CO2E.PC", date: "2011" },
			{ name: "CO2 emissions (kt)", indicatorid: "EN.ATM.CO2E.KT", date: "2011" },

			{ name: "Total greenhouse gas emissions (kt of CO2 equivalent)", indicatorid: "EN.ATM.GHGT.KT.CE", date: "2012" },


			{ name: "Ease of doing business index (1=most business-friendly regulations)", indicatorid: "IC.BUS.EASE.XQ", date: "2015" },


			{ name: "Forest area (% of land area)", indicatorid: "AG.LND.FRST.ZS", date: "2015" },
			{ name: "Forest area (sq. km)", indicatorid: "AG.LND.FRST.K2", date: "2015" }




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