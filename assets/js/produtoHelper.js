var precos = precos || [];

var tabelasDePreco = tabelasDePreco || []; 


precos.forEach(function (item, index) {
	addPrecoHtml(item);
	for (var i = tabelasDePreco.length - 1; i >= 0; i--) {
		if (item.tabelaPreco == tabelasDePreco[i].id) {
			tabelasDePreco.splice(i, 1);
		}
	}
});


tabelasDePreco.forEach(function (item, index) {
	$('#tabelasPreco')
    	.append($("<option></option>")
        .attr("value",item.id)
        .text(item.descricao)); 
});

if ($('#tabelasPreco').has('option').length <= 0 ) {
	$('#newPreco').hide();
}

function addPrecoHtml(preco) {
	$('#tablePrecos tr:last').after('<tr><td>' + preco.tabelaNome + '</td><td>' + preco.valor + '</td></tr>');
	$("#tabelasPreco option[value='" + $("#tabelasPreco").val() + "']").remove();
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


function validateProduto(produto) {
	return true;
}


function getProduto() {
	return {
		codigo: $('#codigo').val(),
		descricao: $('#descricao').val(),
		quantidade: $('#quantidade').val(),
		custo: $('#custo').val(),
		venda: $('#venda').val(),
		precos: precos,
		categoria: selectedCategoria
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
		io.socket.post('/produto/createPost', { produto: produto }, function (resData) {
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
	if (selectedCategoria !== -1) {
		categoriaObj = getCategoria(selectedCategoria);
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