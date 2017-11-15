var descontoAplicado = 0;
var clientes = [];
var searchRowsCliente = $('#tableClientes tr');
$('#clienteMdl').on('shown.bs.modal', function () {
	$('#clienteNome').focus()
});

var vendedores = [];
var searchRowsVendedores = $('#tableVendedores tr');
$('#vendedorMdl').on('shown.bs.modal', function () {
	$('#vendedorNome').focus()
});
var itensDaVenda = [];
var pagamentos = [];
var searchRows = $('#tableProdutos tr');
searchRows.splice(0, 1);
$('#produto').keypress(function (e) {
	if (e.keyCode == 13) {
		$('#addProduto').click();
	}
});
$('#qtde').keypress(function (e) {
	if (e.keyCode == 13) {
		$('#addProduto').click();
	}
});

var selectedProd = undefined;
var selectedLoja = -1;
var selectedTabela = -1;


function showDescontoMdl() {
	$("#descontoMdl").modal();
}

function aplicarDesconto() {
	let tipoDesc = $("input[name='desconto']:checked").attr('id');
	let valorDesc = parseFloat($("#descontoInput").val());

	if (tipoDesc == 'descontoPct') {
		valorDesc = getTotal() * (valorDesc / 100);
	}
	descontoAplicado = valorDesc;
	$('#descontoTotal').text(valorDesc);
	$("#descontoMdl").modal('hide');
	sumTotal();
}

function showProdutos() {
	searchRows.on('click', function (e) {
		var row = $(this);
		if (selectedProd) {
			$('#' + selectedProd).removeClass('highlight');
		}
		row.addClass('highlight');
		selectedProd = row.attr('id');
	});
	$('#produtoNome').val('');
	search();
	$("#produtoNome").bind('keydown', search);
	$("#produtosMdl").modal();
}

function selecionarProduto() {
	$('#' + selectedProd).removeClass('highlight');
	selectedLoja = $('#loja option:selected').attr("id");
	selectedTabela = $('#tabelaPreco option:selected').attr("id");
	$('#lojaNome').val(getLojaNome(selectedLoja));
	getProduto(selectedProd, function (produto) {
		$("#produto").val(produto.descricao);
		$("#produtosMdl").modal('hide');
	});
}

function search() {
	var text = $('#produtoNome').val();
	var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();

	searchRows.show().filter(function() {
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

function getFP(id, cb) {
	formasPagamento.forEach(function (fp) {
		if (fp.id == id) {
			cb(fp);
		}
	});
}

function getTotal() {
	var subTotal = 0;
	itensDaVenda.forEach(function (item) {
		subTotal += item.total;
	});
	return subTotal;
}

function getTotalPagto() {
	var totalPag = 0;
	pagamentos.forEach(function (pagamento) {
		totalPag += (parseInt(pagamento.valor) * pagamento.cotacao);
	});
	return totalPag;
}

function sumTotal() {
	var sumTotal = getTotal();
	$('#subTotal').text(sumTotal);
	$('#total').text(sumTotal - descontoAplicado);
	$('#descontoTotal').text(descontoAplicado);
}

function addPagamento() {
	var fpID = $('#formaPagamentoSelect').find(":selected").val();
	var valor = parseInt($('#valorFP').val());

	getFP(fpID, function (fp) {
		var newPagamento = {
			condicaoPagamento: fp.condicaoPagamento,
			formaPagamento: fp.formaPagamento,
			valor: valor,
			cotacao: fp.cotacao
		};
		pagamentos.push(newPagamento);
		$('#tablePagamentos tr:last').after('<tr><td>' + fp.descricao + '</td><td>' + valor + '</td></tr>');
		$('#totalPago').text(getTotalPagto());
	});
}

function getLojaNome(id) {
	for (var i = lojas.length - 1; i >= 0; i--) {
		if (lojas[i].id == id) {
			return lojas[i].nome;
		}
	}
}

function getPrecoVenda(_produto) {
	for (var i = 0; i < _produto.precos.length; i++) {
		if (_produto.precos[i].tabelaPreco == selectedTabela) {
			return _produto.precos[i].valor;
		}
	}
	return 0;
}

function addProduto() {
	getProduto(selectedProd, function (produto) {
		var valorProd = getPrecoVenda(produto);
		var newItem = {
			produto: produto,
			qtde: $('#qtde').val(),
			venda: valorProd,
			custo: produto.custo,
			total: (valorProd * $('#qtde').val()),
			loja: selectedLoja
		};
		itensDaVenda.push(newItem);
		$('#tableItens tr:last').after('<tr><td>' + getLojaNome(newItem.loja) + '</td><td>' + produto.descricao + '</td><td>' + newItem.venda + '</td><td>' + newItem.qtde + '</td><td>' + newItem.total + '</td></tr>');
		sumTotal();
		$('#produto').val('');
		$('#lojaNome').val('');
		$('#qtde').val('1');
	});
}

function getItensForPost(_itens) {
	let itensFP = [];
	for (var i = _itens.length - 1; i >= 0; i--) {
		itensFP.push({
			produto: _itens[i].produto.id,
			quantidade: _itens[i].qtde,
			custo: _itens[i].custo,
			preco: _itens[i].venda,
			loja: _itens[i].loja
		});
	}
	return itensFP;
}

function getPagamentosForPost(_pagamentos) {
	let pagamentosFP = [];

	for (var i = _pagamentos.length - 1; i >= 0; i--) {
		pagamentosFP.push({
			formaPagamento: _pagamentos[i].formaPagamento.id,
			valor: _pagamentos[i].valor
		});
	}

	return pagamentosFP;
}


function getCliente(id) {
	for (var i = clientes.length - 1; i >= 0; i--) {
		if (clientes[i].id == id) {
			return clientes[i];
		}
	}
	return undefined;
}

function selecionarCliente(_fromView) {
	_fromView = _fromView || false;
	if (selectedCliente) {
		if (!_fromView) {
			clienteObj = getCliente(selectedCliente);
		}
		$('#cliente').val(clienteObj.nome);
		$('#clienteMdl').modal('hide');
		if (clienteObj.tabelaPreco) {
			$('#tabelaPreco').val(clienteObj.tabelaPreco);
		}
	}
}


function findCliente() {
	io.socket.get('/cliente/getAll', function (resData, jwres) {
		clientes = resData;
		$("#tbodyClientes").empty();

		for (var i = clientes.length - 1; i >= 0; i--) {
			$('#tableClientes > tbody:last-child').append('<tr id="' + clientes[i].id + '"><td>' + clientes[i].nome + '</td></tr>');
		}
		searchRowsCliente = $('#tableClientes tr');
		searchRowsCliente.splice(0, 1);
		searchRowsCliente.on('click', function (e) {
			var row = $(this);
			if (selectedCliente) {
				$('#' + selectedCliente).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedCliente = row.attr('id');
		});
		$("#clienteNome").bind('keydown', filtrarClientes);
		$("#clienteMdl").modal();
	});
};

function filtrarClientes(e) {
	setTimeout(function () {
		var text = $("#clienteNome").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		searchRowsCliente.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};


function getVendedor(id) {
	for (var i = vendedores.length - 1; i >= 0; i--) {
		if (vendedores[i].id == id) {
			return vendedores[i];
		}
	}
	return undefined;
}

function selecionarVendedor(_fromView) {
	_fromView = _fromView || false;
	if (selectedVendedor) {
		if (!_fromView) {
			vendedorObj = getVendedor(selectedVendedor);
		}
		$('#vendedor').val(vendedorObj.nome);
		$('#vendedorMdl').modal('hide');
	}
}


function findVendedor() {
	io.socket.get('/vendedor/getAll', function (resData, jwres) {
		vendedores = resData;
		$("#tbodyVendedores").empty();

		for (var i = vendedores.length - 1; i >= 0; i--) {
			$('#tableVendedores > tbody:last-child').append('<tr id="' + vendedores[i].id + '"><td>' + vendedores[i].nome + '</td></tr>');
		}
		searchRowsVendedores = $('#tableVendedores tr');
		searchRowsVendedores.splice(0, 1);
		searchRowsVendedores.on('click', function (e) {
			var row = $(this);
			if (selectedVendedor) {
				$('#' + selectedVendedor).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedVendedor = row.attr('id');
		});
		$("#vendedorNome").bind('keydown', filtrarVendedores);
		$("#vendedorMdl").modal();
	});
};

function filtrarVendedores(e) {
	setTimeout(function () {
		var text = $("#vendedorNome").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		searchRowsVendedores.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};


function finalizarVenda() {
	var totalItens = getTotal();
	var totalVenda = totalItens - descontoAplicado;
	var totalPagto = getTotalPagto();
	if (totalPagto < totalVenda) {
		alert('Pagamento insuficiente!');
		return;
	}

	io.socket.post('/venda/createPost', { venda: {
		itens: getItensForPost(itensDaVenda),
		pagamentos: pagamentos,
		total: totalVenda,
		cliente: selectedCliente,
		vendedor: selectedVendedor,
		desconto: descontoAplicado
	}}, function (resData) {
		if (resData.statusCode == 200) {
			document.location = '/venda';
		}
	});
}