function findEstoqueES(entradaSaida) {
	entradaOuSaida = entradaSaida;
	findEstoque();
}


function addProduto() {
	if (selectedProduto) {
		var quantidade = $("#quantidade").val();
		addProdutoHtml({descricao: produtoObj.descricao, quantidade: quantidade});
		items.push({
			produto: selectedProduto,
			quantidade: quantidade
		});

		$("#produto").val('');
		$("#quantidade").val('');
		$("#produto").focus();
	}
}


function addProdutoHtml(produto) {
	$('#tableProdutos tr:last').after('<tr><td>' + produto.descricao + '</td><td>' + produto.quantidade + '</td></tr>');
}


function findProduto() {
	produtosSR.on('click', function (e) {
		var row = $(this);
		if (selectedProduto) {
			$('#' + selectedProduto).removeClass('highlight');
		}
		row.addClass('highlight');
		selectedProduto = row.attr('id');
	});
	$('#produtoNome').val('');
	search();
	$("#produtoNome").bind('keydown', search);
	$("#produtosMdl").modal();
}

function search() {
	var text = $('#produtoNome').val();
	var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();

	produtosSR.show().filter(function() {
		var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
		return !~text.indexOf(val);
	}).hide();
}


function getProduto(id, cb) {
	produtos.forEach(function (produto) {
		if (produto.id == id) {
			cb(produto);
		}
	});
}

function selecionarProduto() {
	$('#' + selectedProduto).removeClass('highlight');
	
	getProduto(selectedProduto, function (produto) {
		produtoObj = produto;
		$("#produto").val(produto.descricao);
		$("#produtosMdl").modal('hide');
		$("#quantidade").focus();
	});
}

function createMovimentacao(cb) {
	var movimentacao = {
		items: items,
		descricao: $("#descricao").val(),
		observacao: $("#observacao").val()
	};
	if (typeof estoqueEntrada !== 'undefined') {
		movimentacao.estoqueEntrada = estoqueEntrada.id;
	}
	if (typeof estoqueSaida !== 'undefined') {
		movimentacao.estoqueSaida = estoqueSaida.id;
	}
	io.socket.post('/movimentacao/createPost', { movimentacao: movimentacao }, function (resData) {
		cb(resData);
	});
}