
var LOADABLE_DATASETS = [

	{ name: "기본",

		datasets: [
			{ name: "국내총생산 (GDP)", index: 0 },
			{ name: "인구", index: 1 }
		]

	},

	{ name: "The World Bank",

		datasets: [ //from http://data.worldbank.org/indicator

			{ name: "총 인구", indicatorid: "SP.POP.TOTL", date: "2015" },
			{ name: "인구 증가율", indicatorid: "SP.POP.GROW", date: "2015" },
			
			{ name: "농촌 인구", indicatorid: "SP.RUR.TOTL", date: "2015" },
			{ name: "농촌 인구 비율 (%)", indicatorid: "SP.RUR.TOTL.ZS", date: "2015" },

			{ name: "도시 인구", indicatorid: "SP.URB.TOTL", date: "2015" },
			{ name: "도시 인구 비율 (%)", indicatorid: "SP.URB.TOTL.IN.ZS", date: "2015" },
			

			{ name: "전체 인구 중 0-14세 인구 비율 (%)", indicatorid: "SP.POP.0014.TO.ZS", date: "2015" },
			{ name: "전체 인구 중 15-64세 인구 비율 (%)", indicatorid: "SP.POP.1564.TO.ZS", date: "2015" },
			{ name: "전체 인구 중 65세 이상 인구 비율 (%)", indicatorid: "SP.POP.65UP.TO.ZS", date: "2015" },


			{ name: "순 인구 이동", indicatorid: "SM.POP.NETM", date: "2012" },



			{ name: "GDP (미국 달러)", indicatorid: "NY.GDP.MKTP.CD", date: "2015" },
			{ name: "1인당 GDP (미국 달러)", indicatorid: "NY.GDP.PCAP.CD", date: "2015" },

			{ name: "GDP 성장률 (전년 대비 %)", indicatorid: "NY.GDP.MKTP.KD.ZG", date: "2015" },
			{ name: "1인당 GDP 성장률 (전년 대비 %)", indicatorid: "NY.GDP.PCAP.KD.ZG", date: "2015" },
			
			{ name: "GDP 대비 지출 (%)", indicatorid: "GC.XPN.TOTL.GD.ZS", date: "2013" },


			{ name: "소비자 물가 지수로 측정한 인플레이션 (%)", indicatorid: "FP.CPI.TOTL.ZG", date: "2015" },


			{ name: "경제 활동 인구", indicatorid: "SL.TLF.TOTL.IN", date: "2015" },

			//(sectors)

			{ name: "1차 산업(농업 등)의 비중 (%) Agriculture, value added (% of GDP)", indicatorid: "NV.AGR.TOTL.ZS", date: "2014" },
			{ name: "2차 산업(공업)의 비중 (%) Industry, value added (% of GDP)", indicatorid: "NV.IND.TOTL.ZS", date: "2014" },
			{ name: "3차 산업(서비스업)의 비중 (%) Services, etc., value added (% of GDP)", indicatorid: "NV.SRV.TETC.ZS", date: "2014" },


			//Aid Effectiveness

			{ name: "출생아 1000명 당 5세 이하 사망아", indicatorid: "SH.DYN.MORT", date: "2015" },
			{ name: "모성사망률 (출산 100000건 당)", indicatorid: "SH.STA.MMRT", date: "2015" },


			//Climate Change

			{ name: "전체 인구 중 전기 사용 가능 인구 (%)", indicatorid: "EG.ELC.ACCS.ZS", date: "2012" },
			{ name: "1인당 전력 소비량 (kWh)", indicatorid: "EG.USE.ELEC.KH.PC", date: "2013" },


			{ name: "에너지 수입 의존도 (%)", indicatorid: "EG.IMP.CONS.ZS", date: "2015" },

			{ name: "발전량 중 신재생 에너지 비율 (%)", indicatorid: "EG.ELC.RNEW.ZS", date: "2012" },


			{ name: "1인당 이산화탄소 배출량 (톤)", indicatorid: "EN.ATM.CO2E.PC", date: "2011" },
			{ name: "이산화탄소 배출량 (kt(킬로톤))", indicatorid: "EN.ATM.CO2E.KT", date: "2011" },

			{ name: "온실가스 총 배출량 (이산화탄소 kt(킬로톤))", indicatorid: "EN.ATM.GHGT.KT.CE", date: "2012" },


			{ name: "전체 영토 중 숲 면적 (%)", indicatorid: "AG.LND.FRST.ZS", date: "2015" },
			{ name: "숲 면적 (km²)", indicatorid: "AG.LND.FRST.K2", date: "2015" }




			/*

			//copy and fill in below for new World Bank datasets:
			
			{ name: "GDP", indicatorid: "asdf", date: "2015" },

			*/

		]

	}

];



var MATERIAL_INDICIES = [
	"MeshNormalMaterial",
	"국기",
	"어두움"
];