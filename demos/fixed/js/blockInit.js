var maximoBloques = 32;
    var workspace = Blockly.inject('blocklyDiv', {
		media: '../../media/',
        toolbox: document.getElementById('toolbox'),
		trashcan: true,
		maxBlocks: maximoBloques
	});
	Blockly.Xml.domToWorkspace(workspace,
		document.getElementById('startBlocks'));
	
	var interprete = null;
	
	function updateLines(){
		Blockly.JavaScript.STATEMENT_PREFIX = "";
		var codigo = Blockly.JavaScript.workspaceToCode(workspace);
		codigo = codigo.replace(/\n+/g,"\n");
		var lineCount = document.getElementById("lines-count");
		lineCount.innerHTML = codigo.split(/\r\n|\r|\n/).length-1;
	}
	workspace.addChangeListener(updateLines);

	function initApi(interpreter, scope) {		
		var wrapper;		
		
		wrapper = function() {
			interpreter.createPrimitive(avanzar());
		};
		interpreter.setProperty(scope, "avanzar",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(girar_antihorario());
		};
		interpreter.setProperty(scope, "girar_antihorario",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(girar_horario());
		};
		interpreter.setProperty(scope, "girar_horario",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(no_mas_caca());
		};
		interpreter.setProperty(scope, "no_mas_caca",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(veo_caca_derecho());
		};
		interpreter.setProperty(scope, "veo_caca_derecho",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(veo_caca_antihorario());
		};
		interpreter.setProperty(scope, "veo_caca_antihorario",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function() {
			interpreter.createPrimitive(veo_caca_horario());
		};
		interpreter.setProperty(scope, "veo_caca_horario",
			interpreter.createNativeFunction(wrapper));
			
		wrapper = function(id) {
			id = id ? id.toString() : '';
			return interpreter.createPrimitive(highlightBlock(id));
		};
		interpreter.setProperty(scope, "highlightBlock",
			interpreter.createNativeFunction(wrapper));
	}
	
	var highlightPause = false;
	function highlightBlock(id) {
		workspace.highlightBlock(id);
		highlightPause = true;
	}
	
	function parseCode() {
		Blockly.JavaScript.STATEMENT_PREFIX = "";
		var codigo = Blockly.JavaScript.workspaceToCode(workspace);
		if (codigo == "") {
			$("#codigoVacioModal").modalDisplay();
			return "codigoVacio";
		}
		
		Blockly.JavaScript.STATEMENT_PREFIX = "highlightBlock(%1);\n";
		Blockly.JavaScript.addReservedWords("highlightBlock");
		codigo = Blockly.JavaScript.workspaceToCode(workspace);
		interprete = new Interpreter(codigo, initApi);
		
		//alert("Listo para ejecutar este c�digo:\n\n" + codigo);
		//document.getElementById('stepButton').disabled = '';
		highlightPause = false;
		workspace.traceOn(true);
		workspace.highlightBlock(null);
		
		return "success";
	}
	
	var gameRunning = false;
	var execbtn = document.getElementById('exec-button');
	function stepCode() {
		try {
			var ok = interprete.step();
		} finally {
			if (!ok) {
				//document.getElementById('stepButton').disabled = 'disabled';
				//personaje.estado == "muerto";
				gameRunning = false;
				execbtn.innerHTML = 'Reiniciar';
				execbtn.className = '';
				personaje.estado = "finalizando";
				return;
			}
			else{
				if(personaje.estado == "muerto"){
					gameRunning = false;
					execbtn.innerHTML = 'Reiniciar';
					execbtn.className = '';
					return;
				}
			}
		}
		if (highlightPause) {
			highlightPause = false;
		} else {
			//stepCode();
			//console.log("rec");
		}
	}
	
	function hay_bloques_sueltos() {
		return (Blockly.mainWorkspace.getTopBlocks().length >= 2);
	}
	
	function mostrar_javascript() {
		if (hay_bloques_sueltos()) {
			$("#errorModal").modalDisplay();
			return;
		}
		
		Blockly.JavaScript.STATEMENT_PREFIX = "";
		var codigo = Blockly.JavaScript.workspaceToCode(workspace);
		
		if (codigo == "") {
			$("#codigoVacioModal").modalDisplay();
			return;
		}
		
		var jsModal = $('#jsModal');
		jsModal.html(codigo);
		jsModal.modalCodeDisplay();
	}
	
	
	function ejecutar_javascript() {
		
          if (hay_bloques_sueltos()) {
			$("#errorModal").modalDisplay();
            return;
          }
		
          if(!gameRunning){
	    gameRunning = true;
	    
		if (parseCode() != "success")
			return;
		
		personaje.trigger("resetear");
	    personaje.estado = 'listo';
	    //document.getElementById('js-button').disabled = 'disabled';
	    execbtn.innerHTML = 'Detener';
	    execbtn.className = 'running';

            stepCode();
	    
	    //gameRunning = false;
	    //execbtn.innerHTML = 'Reiniciar';
	    //document.getElementById('js-button').disabled = '';
	  }
	  else{
	    gameRunning = false;
	    execbtn.innerHTML = 'Reiniciar';
	    execbtn.className = '';
	    personaje.estado = 'muerto';
	    
	  }
	}
