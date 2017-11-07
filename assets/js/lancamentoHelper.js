function getCliente(id) {
	for (var i = clientes.length - 1; i >= 0; i--) {
		if (clientes[i].id == id) {
			return clientes[i];
		}
	}
	return undefined;
}

function selecionarCliente() {
	if (selectedCliente !== -1) {
		clienteObj = getCliente(selectedCliente);
		$('#cliente').val(clienteObj.nome);
		$("cliente").prop('disabled', true);
		$('#clienteMdl').modal('hide');
		$('#vencimento').focus();
	}
}


function findCliente() {
	io.socket.get('/cliente/getAll', function (resData, jwres) {
		clientes = resData;
		$("#tbodyClientes").empty();

		for (var i = clientes.length - 1; i >= 0; i--) {
			$('#tableClientes > tbody:last-child').append('<tr id="' + clientes[i].id + '"><td>' + clientes[i].nome + '</td></tr>');
		}
		searchRows = $('#tableClientes tr');
		searchRows.splice(0, 1);
		searchRows.on('click', function (e) {
			var row = $(this);
			if (selectedCliente > -1) {
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
		searchRows.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};


function createCR() {
	var crObj = {
		cliente: clienteObj,
		vencimento: $('#vencimento').val(),
		descricao: $('#descricao').val(),
		valor: $('#valor').val(),
		moeda: moedaPadrao
	};
	io.socket.post('/lancamento/createCRPost', { lancamento: crObj }, function (resData) {
		if (resData.statusCode == 200) {
			document.location = '/lancamento/contasReceber';
		}
	});
}



function getFornecedor(id) {
	for (var i = fornecedores.length - 1; i >= 0; i--) {
		if (fornecedores[i].id == id) {
			return fornecedores[i];
		}
	}
	return undefined;
}

function selecionarFornecedor() {
	if (selectedFornecedor !== -1) {
		fornecedorObj = getFornecedor(selectedFornecedor);
		$('#fornecedor').val(fornecedorObj.nome);
		$("fornecedor").prop('disabled', true);
		$('#fornecedorMdl').modal('hide');
		$('#vencimento').focus();
	}
}


function findFornecedor() {
	io.socket.get('/fornecedor/getAll', function (resData, jwres) {
		fornecedores = resData;
		$("#tbodyFornecedores").empty();

		for (var i = fornecedores.length - 1; i >= 0; i--) {
			$('#tableFornecedores > tbody:last-child').append('<tr id="' + fornecedores[i].id + '"><td>' + fornecedores[i].nome + '</td></tr>');
		}
		searchRows = $('#tableFornecedores tr');
		searchRows.splice(0, 1);
		searchRows.on('click', function (e) {
			var row = $(this);
			if (selectedFornecedor > -1) {
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
		searchRows.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};


function createCP() {
	var cpObj = {
		fornecedor: fornecedorObj,
		vencimento: $('#vencimento').val(),
		descricao: $('#descricao').val(),
		valor: $('#valor').val(),
		moeda: moedaPadrao
	};
	io.socket.post('/lancamento/createCPPost', { lancamento: cpObj }, function (resData) {
		if (resData.statusCode == 200) {
			document.location = '/lancamento/contasPagar';
		}
	});
}

function baixarConta(id, valor, entrada, url) {
	pagamentos = [];
	valorConta = valor;
	$('#baixarMdl').modal({
	  backdrop: 'static',
	  keyboard: false
	})
	.one('click', '#confirm', function(e) {
		if (!entrada) {
			for (var i = pagamentos.length - 1; i >= 0; i--) {
				pagamentos[i].valor = pagamentos[i].valor * -1;
			}
		}
		io.socket.post('/lancamento/baixarConta', { id: id, pagamentos: pagamentos }, function (resData) {
			if (!resData) {

			}
			if (resData.statusCode == 200) {
				window.location = url; 
			}
		});
	});
}

function deleteRecord(deleteURL, id) {
	$('#confirmDelete').modal({
	  backdrop: 'static',
	  keyboard: false
	})
	.one('click', '#confirm', function(e) {
		io.socket.post(deleteURL, { id: id }, function (resData) {
			if (!resData) {

			}
			if (resData.statusCode == 200) {
				window.location.reload();
			}
		});
	});	
}

function getFP(id, cb) {
	formasPagamento.forEach(function (fp) {
		if (fp.id == id) {
			cb(fp);
		}
	});
}

function sumPagamentos() {
	var valorPags = 0;
	for (var i = pagamentos.length - 1; i >= 0; i--) {
		valorPags += (pagamentos[i].valor * pagamentos[i].cotacao);
	}
	return valorPags;
}

function addPagamento() {
	var fpID = $('#formaPagamentoSelect').find(":selected").val();
	var valor = $('#valorFP').val();

	getFP(fpID, function (fp) {
		var newPagamento = {
			formaPagamento: fp,
			valor: valor,
			cotacao: fp.cotacao
		};
		if ((sumPagamentos() + valor) > valorConta) {
			//PAGAMENTO MAIOR TROCO?
		}
		pagamentos.push(newPagamento);
		$('#tablePagamentos tr:last').after('<tr><td>' + fp.descricao + '</td><td>' + valor + '</td></tr>');
	});
}