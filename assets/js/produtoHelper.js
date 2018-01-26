var precos = precos || [];
var quantidades = quantidades || [];
var tabelasDePreco = tabelasDePreco || []; 
var estoques = estoques || [];
var atributos = atributos || [];
var valoresAtributos = valoresAtributos || [];
var fotos = fotos || [];
var uploadingFoto;
var fotosIndex = fotos.length || 0;


fotos.forEach(function (item, index) {
	item.image = new Image();
	item.image.onload = function() {
		//draw to canvas
		addFotoHtml(item, index);
	};
	item.image.src = item.foto64;
});

atributos.forEach(function (item, index) {
	item.valoresStr = '';
	for (var i = 0; i < valoresAtributos.length; i++) {
		if (valoresAtributos[i].atributo == item.id) {
			item.valoresStr = item.valoresStr + valoresAtributos[i].nome + ';';
		}
	}
	addAtributoHtml(item);
});

precos.forEach(function (item, index) {
	item.tabelaNome = getTabelaNome(item);
	addPrecoHtml(item);
	for (var i = tabelasDePreco.length - 1; i >= 0; i--) {
		if (item.tabelaPreco == tabelasDePreco[i].id) {
			tabelasDePreco.splice(i, 1);
		}
	}
});

quantidades.forEach(function (item, index) {
	item.estoqueNome = getEstoqueNome(item);
	addQuantidadeHtml(item);
	for (var i = estoques.length - 1; i >= 0; i--) {
		if (item.estoque == estoques[i].id) {
			estoques.splice(i, 1);
		}
	}
});

tabelasDePreco.forEach(function (item, index) {
	$('#tabelasPreco')
    	.append($("<option></option>")
        .attr("value",item.id)
        .text(item.descricao)); 
});

estoques.forEach(function (item, index) {
	$('#estoques')
    	.append($("<option></option>")
        .attr("value",item.id)
        .text(item.descricao)); 
});

if ($('#tabelasPreco').has('option').length <= 0 ) {
	$('#newPreco').hide();
}

if ($('#estoques').has('option').length <= 0 ) {
	$('#newQtde').hide();
}

if (typeof fornecedorObj !== 'undefined') {
	selecionarFornecedor(true);
}

function getTabelaNome(preco) {
	for (var i = tabelasDePreco.length - 1; i >= 0; i--) {
		if (preco.tabelaPreco == tabelasDePreco[i].id) {
			return tabelasDePreco[i].descricao;
		}
	}
}

function getEstoqueNome(qtde) {
	for (var i = estoques.length - 1; i >= 0; i--) {
		if (qtde.estoque == estoques[i].id) {
			return estoques[i].descricao;
		}
	}
}

function addPrecoHtml(preco) {
	$('#tablePrecos tr:last').after('<tr><td>' + preco.tabelaNome + '</td><td>' + preco.valor + '</td></tr>');
	$("#tabelasPreco option[value='" + $("#tabelasPreco").val() + "']").remove();
}

function addQuantidadeHtml(qtde) {
	$('#tableQtdes tr:last').after('<tr><td>' + qtde.estoqueNome + '</td><td>' + qtde.quantidade + '</td></tr>');
	$("#estoques option[value='" + $("#estoques").val() + "']").remove();
}

function addAtributoHtml(atributo) {
	$('#tableAtributos tr:last').after('<tr><td>' + atributo.nome + '</td><td>' + atributo.valoresStr + '</td>');
}

function addFotoHtml(foto, index) {
	var newCanvas = $('<canvas id="canvas' + index + '" />')
		.width(200)
		.height(150);
	newCanvas = newCanvas[0];
	$('#fotosDiv').append(newCanvas);
	var ctx = newCanvas.getContext("2d");
	ctx.drawImage(foto.image, 0, 0, 200, 150);
}

function addPreco() {
	var newPreco = {
		valor: $('#venda').val(),
		tabelaPreco: $("#tabelasPreco").val(),
		tabelaNome: $("#tabelasPreco option:selected").text()
	};


	addPrecoHtml(newPreco);
	precos.push(newPreco);	
	if ($('#tabelasPreco').has('option').length <= 0 ) {
		$('#newPreco').hide();
	}
}

function addQtde() {
	var newQtde = {
		quantidade: $('#quantidade').val(),
		estoque: $("#estoques").val(),
		estoqueNome: $("#estoques option:selected").text()
	};


	addQuantidadeHtml(newQtde);
	quantidades.push(newQtde);	
	if ($('#estoques').has('option').length <= 0 ) {
		$('#newQtde').hide();
	}
}

function addAtributo() {
	var newAtributo = {
		nome: $('#atributoNome').val(),
		valoresStr: $('#atributoValores').val()
	};

	addAtributoHtml(newAtributo);
	atributos.push(newAtributo);
}

function validateProduto(produto) {
	return true;
}


function getProduto() {
	return {
		codigo: $('#codigo').val(),
		descricao: $('#descricao').val(),
		custo: $('#custo').val(),
		precos: precos,
		categoria: selectedCategoria,
		estoques: quantidades,
		fornecedor: selectedFornecedor,
		fiscal: $("#fiscal").is(':checked'),
		peso: $('#peso').val(),
		altura: $('#altura').val(),
		largura: $('#largura').val(),
		profundidade: $('#profundidade').val(),
		descricaoCompleta: $('#descricaoCompleta').val()
	};
}

function editProduto() {
	var produto = getProduto();
	if (validateProduto(produto)) {
		io.socket.post('/produto/editPost', { produto: produto, id: produtoID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/produto';
			}
		});
	}
}


function createProduto() {
	var produto = getProduto();

	if (validateProduto(produto)) {
		io.socket.post('/produto/createPost', { produto: produto, fotos: fotos, atributos: atributos }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/produto';
			}
		});
	}
}

function getCategoria(id) {
	for (var i = categorias.length - 1; i >= 0; i--) {
		if (categorias[i].id == id) {
			return categorias[i];
		}
	}
	return undefined;
}

function selecionarCategoria() {
	if (selectedCategoria) {
		if (!categoriaObj || categoriaObj.id !== selectedCategoria) {
			categoriaObj = getCategoria(selectedCategoria);
		}
		$('#categoria').val(categoriaObj.descricao);
		//$("#categoria").prop('disabled', true);
		$('#categoriaMdl').modal('hide');
		$('#quantidade').focus();
	}
}


function findCategoria() {
	io.socket.get('/categoria/getAll', function (resData, jwres) {
		categorias = resData;
		$("#tbodyCategorias").empty();

		for (var i = categorias.length - 1; i >= 0; i--) {
			$('#tableCategorias > tbody:last-child').append('<tr id="' + categorias[i].id + '"><td>' + categorias[i].descricao + '</td></tr>');
		}
		searchRows = $('#tableCategorias tr');
		searchRows.splice(0, 1);
		searchRows.on('click', function (e) {
			var row = $(this);
			if (selectedCategoria) {
				$('#' + selectedCategoria).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedCategoria = row.attr('id');
		});
		$("#categoriaInput").bind('keydown', filtrarCategorias);
		$("#categoriaMdl").modal();
	});
};

function filtrarCategorias(e) {
	setTimeout(function () {
		var text = $("#categoriaInput").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		searchRows.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};



function getFornecedor(id) {
	for (var i = fornecedores.length - 1; i >= 0; i--) {
		if (fornecedores[i].id == id) {
			return fornecedores[i];
		}
	}
	return undefined;
}

function selecionarFornecedor(view) {
	if (selectedFornecedor !== -1) {
		if (!view) {
			fornecedorObj = getFornecedor(selectedFornecedor);
		}		
		$('#fornecedor').val(fornecedorObj.nome);
		$("fornecedor").prop('disabled', true);
		$('#fornecedorMdl').modal('hide');
	}
}


function findFornecedor() {
	io.socket.get('/fornecedor/getAll', function (resData, jwres) {
		fornecedores = resData;
		$("#tbodyFornecedores").empty();

		for (var i = fornecedores.length - 1; i >= 0; i--) {
			$('#tableFornecedores > tbody:last-child').append('<tr id="' + fornecedores[i].id + '"><td>' + fornecedores[i].nome + '</td></tr>');
		}
		fornecedorSR = $('#tableFornecedores tr');
		fornecedorSR.splice(0, 1);
		fornecedorSR.on('click', function (e) {
			var row = $(this);
			if (selectedFornecedor) {
				$('#' + selectedFornecedor).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedFornecedor = row.attr('id');
		});
		$("#fornecedorNome").bind('keydown', filtrarFornecedores);
		$("#fornecedorMdl").modal();
	});
};

function filtrarFornecedores(e) {
	setTimeout(function () {
		var text = $("#fornecedorNome").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		fornecedorSR.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};

function readImage() {
	if (this.files && this.files[0]) {    
		var FR= new FileReader();
    
		FR.addEventListener("load", function(e) {
			loadImageToHtml({
				foto64: e.target.result
			});
		});

		FR.readAsDataURL( this.files[0] );
	}
};

function loadImageToHtml(item) {
	item.image = new Image();
	item.image.onload = function() {
		//draw to canvas
		fotos.push({
			foto64: item.foto64
		});
		addFotoHtml(item, 1);
	};
	item.image.src = item.foto64;
}

$("#newFotoUpload").on("change", readImage);