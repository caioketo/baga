/**
	###CLIENTES###
*/

function validateCliente(cliente) {
	return true;
}


function getCliente() {
	return {
		nome: $('#nome').val()
	};
}

function editCliente() {
	var cliente = getCliente();
	if (validateCliente(cliente)) {
		io.socket.post('/cliente/editPost', { cliente: cliente, id: clienteID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/cliente';
			}
		});
	}
}


function createCliente() {
	var cliente = getCliente();

	if (validateCliente(cliente)) {
		io.socket.post('/cliente/createPost', { cliente: cliente }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/cliente';
			}
		});
	}
}

/**
	###PRODUTOS###
*/



/**
	###VENDEDORES###
*/


function validateVendedor(vendedor) {
	return true;
}


function getVendedor() {
	return {
		nome: $('#nome').val()
	};
}

function editVendedor() {
	var vendedor = getVendedor();
	if (validateVendedor(vendedor)) {
		io.socket.post('/vendedor/editPost', { vendedor: vendedor, id: vendedorID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/vendedor';
			}
		});
	}
}


function createVendedor() {
	var vendedor = getVendedor();

	if (validateVendedor(vendedor)) {
		io.socket.post('/vendedor/createPost', { vendedor: vendedor }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/vendedor';
			}
		});
	}
}


/**
	###FORMASPAGAMENTO###
*/


function validateFP(fp) {
	return true;
}


function getFP() {
	return {
		descricao: $('#descricao').val(),
		aVista: $("#aVista").is(':checked'),
		conta: selectedConta,
		moeda: selectedMoeda
	};
}

function editFormaPagamento() {
	var formaPagamento = getFP();
	if (validateFP(formaPagamento)) {
		io.socket.post('/formaPagamento/editPost', { formaPagamento: formaPagamento, id: formaPagamentoID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/formaPagamento';
			}
		});
	}
}


function createFormaPagamento() {
	var formaPagamento = getFP();

	if (validateFP(formaPagamento)) {
		io.socket.post('/formaPagamento/createPost', { formaPagamento: formaPagamento }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/formaPagamento';
			}
		});
	}
}

/**
	###CONTA###
*/


function validateConta(conta) {
	return true;
}


function getContaObj() {
	return {
		descricao: $('#descricao').val(),
		tipo: $('#tipo').val()
	};
}

function editConta() {
	var conta = getContaObj();
	if (validateConta(conta)) {
		io.socket.post('/conta/editPost', { conta: conta, id: contaID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/conta';
			}
		});
	}
}


function createConta() {
	var conta = getContaObj();

	if (validateConta(conta)) {
		io.socket.post('/conta/createPost', { conta: conta }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/conta';
			}
		});
	}
}


/*
	CATEGORIA
*/
function validateCategoria(fp) {
	return true;
}


function getCategoria() {
	return {
		descricao: $('#descricao').val()
	};
}

function editCategoria() {
	var categoria = getCategoria();
	if (validateCategoria(categoria)) {
		io.socket.post('/categoria/editPost', { categoria: categoria, id: categoriaID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/categoria';
			}
		});
	}
}


function createCategoria() {
	var categoria = getCategoria();

	if (validateCategoria(categoria)) {
		io.socket.post('/categoria/createPost', { categoria: categoria }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/categoria';
			}
		});
	}
}


/**
	###FORNECEDORES###
*/

function validateFornecedor(fornecedor) {
	return true;
}


function getFornecedor() {
	return {
		nome: $('#nome').val()
	};
}

function editFornecedor() {
	var fornecedor = getFornecedor();
	if (validateFornecedor(fornecedor)) {
		io.socket.post('/fornecedor/editPost', { fornecedor: fornecedor, id: fornecedorID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/fornecedor';
			}
		});
	}
}


function createFornecedor() {
	var fornecedor = getFornecedor();

	if (validateFornecedor(fornecedor)) {
		io.socket.post('/fornecedor/createPost', { fornecedor: fornecedor }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/fornecedor';
			}
		});
	}
}




function getConta(id) {
	for (var i = contas.length - 1; i >= 0; i--) {
		if (contas[i].id == id) {
			return contas[i];
		}
	}
	return undefined;
}

function selecionarConta() {
	if (selectedConta !== -1) {
		contaObj = getConta(selectedConta);
		$('#conta').val(contaObj.descricao);
		//$("#categoria").prop('disabled', true);
		$('#contaMdl').modal('hide');
	}
}


function findConta() {
	io.socket.get('/conta/getAll', function (resData, jwres) {
		contas = resData;
		$("#tbodyContas").empty();

		for (var i = contas.length - 1; i >= 0; i--) {
			$('#tableContas > tbody:last-child').append('<tr id="' + contas[i].id + '"><td>' + contas[i].descricao + '</td></tr>');
		}
		searchRows = $('#tableContas tr');
		searchRows.splice(0, 1);
		searchRows.on('click', function (e) {
			var row = $(this);
			if (selectedConta > -1) {
				$('#' + selectedConta).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedConta = row.attr('id');
		});
		$("#contaInput").bind('keydown', filtrarContas);
		$("#contaMdl").modal();
	});
};

function filtrarContas(e) {
	setTimeout(function () {
		var text = $("#contaInput").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		searchRows.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};

/**
	###MOEDA###
*/


function validateMoeda(moeda) {
	return true;
}


function getMoedaObj() {
	return {
		descricao: $('#descricao').val(),
		simbolo: $('#simbolo').val(),
		moedaSite: $('#moedaSite option:selected').text()
	};
}

function editMoeda() {
	var moeda = getMoedaObj();
	if (validateMoeda(moeda)) {
		io.socket.post('/moeda/editPost', { moeda: moeda, id: moedaID }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/moeda';
			}
		});
	}
}


function createMoeda() {
	var moeda = getMoedaObj();

	if (validateConta(moeda)) {
		io.socket.post('/moeda/createPost', { moeda: moeda }, function (resData) {
			if (resData.statusCode == 200) {
				document.location = '/moeda';
			}
		});
	}
}

function getMoeda(id) {
	for (var i = moedas.length - 1; i >= 0; i--) {
		if (moedas[i].id == id) {
			return moedas[i];
		}
	}
	return undefined;
}

function selecionarMoeda() {
	if (selectedMoeda !== -1) {
		moedaObj = getMoeda(selectedMoeda);
		$('#moeda').val(moedaObj.simbolo);
		//$("#categoria").prop('disabled', true);
		$('#moedaMdl').modal('hide');
	}
}


function findMoeda() {
	io.socket.get('/moeda/getAll', function (resData, jwres) {
		moedas = resData;
		$("#tbodyMoedas").empty();

		for (var i = moedas.length - 1; i >= 0; i--) {
			$('#tableMoedas > tbody:last-child').append('<tr id="' + moedas[i].id + '"><td>' + moedas[i].descricao + '</td></tr>');
		}
		searchRowsMoeda = $('#tableMoedas tr');
		searchRowsMoeda.splice(0, 1);
		searchRowsMoeda.on('click', function (e) {
			var row = $(this);
			if (selectedMoeda > -1) {
				$('#' + selectedMoeda).removeClass('highlight');
			}
			row.addClass('highlight');
			selectedMoeda = row.attr('id');
		});
		$("#moedaInput").bind('keydown', filtrarMoedas);
		$("#moedaMdl").modal();
	});
};

function filtrarMoedas(e) {
	setTimeout(function () {
		var text = $("#moedaInput").val();
		var val = $.trim(text).replace(/ +/g, ' ').toLowerCase();
		searchRowsMoeda.show().filter(function() {
			var text = $(this).text().replace(/\s+/g, ' ').	toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	}, 200);
};