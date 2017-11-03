var htmlparser = require("htmlparser2");
var http = require("http");
function isEmpty(str) {
    return (!str || 0 === str.length);
}
//CotacaoService.js
module.exports = {

	getCotacao: function (done) {
		let httpOptions = {
			port: 80,
			host: 'gales.com.uy',
			path: '/home',
			method: 'GET'
		};
	    http.get(httpOptions, function(result) {
	        //processResponse(result);
	        var data = "";
		    result.on("data", function(chunk) {
		        data += chunk;
		    });
		    var tags = [];
		    var tagsCount = {};
		    var tagsWithCount = [];
		    var getText = false;
		    var moedasText = [];
		    result.on("end", function(chunk) {
		        var parser = new htmlparser.Parser({
		            onopentag: function(name, attribs) {
		            	if (name == 'table') {
		            		if (attribs.class == 'monedas') {
		            			getText = true;
		            		}
		            	}
		            	if (attribs.class == 'cont_menu_izquierdo') {
		            		getText = false;
		            	}
		            },
		            ontext: function(text){
		            	text = text.trim();
		            	if (getText && text !== "\r\n" && !isEmpty(text)) {
		            		moedasText.push(text);
		            	}
			        }
		        }, {decodeEntities: true});
		        parser.write(data);
		        parser.end();
		        var moedas = [];
		        var curObj = {
		        	moeda: '',
		        	compra: 0,
		        	venda: 0
		        };
		        for (var i = 0; i < moedasText.length; i++) {
		        	if (moedasText[i] == 'D�lar') {
	        			if (curObj.moeda !== '') {
	        				moedas.push(curObj);
	        				curObj = {
					        	moeda: '',
					        	compra: 0,
					        	venda: 0
					        };
	        			}
	        			curObj.moeda = 'Dólar';
		        	}
		        	else if (moedasText[i] == 'Peso Argentino') {
		        		if (curObj.moeda !== '') {
	        				moedas.push(curObj);
	        				curObj = {
					        	moeda: '',
					        	compra: 0,
					        	venda: 0
					        };
	        			}
	        			curObj.moeda = 'Peso Argentino';
		        	}
		        	else if (moedasText[i] == 'Real') {
		        		if (curObj.moeda !== '') {
	        				moedas.push(curObj);
	        				curObj = {
					        	moeda: '',
					        	compra: 0,
					        	venda: 0
					        };
	        			}
	        			curObj.moeda = 'Real';
		        	}
		        	else if (moedasText[i] == 'Euro') {
		        		if (curObj.moeda !== '') {
	        				moedas.push(curObj);
	        				curObj = {
					        	moeda: '',
					        	compra: 0,
					        	venda: 0
					        };
	        			}
	        			curObj.moeda = 'Euro';
		        	}
		        	else {
		        		if (curObj.compra == 0) {
		        			curObj.compra = moedasText[i];
		        		}
		        		else {
		        			curObj.venda = moedasText[i];
		        		}
		        	}
		        }
		        moedas.push(curObj);
		        done(moedas);
		    });
	    }).on('error', function(e) {
	        //res.send({message: e.message});
	        done(e);
	    });
	}
};