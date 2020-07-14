/*######################################################################
Geekman's Basic Computer Simulator
######################################################################*/

var parser = {
	line_counter: 0,
	lines: [],
	
	is_float: function(value) {
		return (Math.abs(value) % 1.0 > 0);
	},
	
	is_number: function(value) {
	    return typeof Number(value) === "number" && isFinite(value);
	},

	is_var: function(value) {
		if (! value || typeof value !== "string") { return false; }
		var a = value.substr(0,1) !== "E";
		var b = value.substr(1).match(/\D+/);
		var c = ! this.is_number(value.substr(1));
		
		return !(a || b || c);
	}
};

var comp = {
    //Máximo de endereços
	MAX_ADDR: 20,
    
    //Faixa numérica:  xxx.x
	MAX_NUM: 999.9,
	
	out: function(value) {
        $("#output").val(value + "\n");
	},
    
    ula: function(value) {
        var val = $("#ula").html();
        if (value != "")
            $("#ula").html(val + value + "<br/>");
        else
            $("#ula").html("");
    },
	
	memget: function(addr) {
		var num = addr.substr(1);
        this.ula("Recuperei o valor do endereço " + addr);
		return Number($("#E" + parseInt(num, 10)).html());
	},
	
	memset: function(p1, p2) {
	    if (! parser.is_var(p1)) {
			this.out("Primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		
        if (parser.is_var(p2)) {
			p2 = this.memget(p2);
		} else if (parser.is_float(p2)){
			p2 = p2.toFixed(1);
        }
        this.ula("Atribuí o valor " + p2 + " ao endereço " + p1);
        
		$("#" + p1).html(p2);
		
		return true;
	}
};


var lang = {
    SET: function(params) {    
		return comp.memset(params[0], params[1]) ? true : false;
    },
    
    ADD: function(params) {        
		var sec;
		//first argument
		if (! parser.is_var(params[0])) {
			comp.out("ADD: primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		//second argument
		if (parser.is_var(params[1])) {
			sec = comp.memget(params[0]) + comp.memget(params[1]);
		} else if (parser.is_number(params[1])) {
			sec = comp.memget(params[0]) + Number(params[1]);
		} else {
			comp.out("ADD: segundo argumento deve ser uma variavel ou numero. Linha " + parser.line_counter);
			return false;
		}
		if (! sec) { return false; }
		comp.memset(params[0], sec);
		return true;
    },
    
    SUB: function(params) {
        var sec;
		//first argument
		if (! parser.is_var(params[0])) {
			comp.out("SUB: Primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		//second argument
		if (parser.is_var(params[1])) {
			sec = comp.memget(params[0]) - comp.memget(params[1]);
		} else if (parser.is_number(params[1])) {
			sec = comp.memget(params[0]) - Number(params[1]);
		} else {
			comp.out("SUB: segundo argumento deve ser uma variavel ou numero. Linha " + parser.line_counter);
			return false;
		}
		comp.memset(params[0], sec);
		return true;
    },
    
    MUL: function(params) {
        var sec;
		//first argument
		if (! parser.is_var(params[0])) {
			comp.out("MUL: Primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		//second argument
		if (parser.is_var(params[1])) {
			sec = comp.memget(params[0]) * comp.memget(params[1]);
		} else if (parser.is_number(params[1])) {
			sec = comp.memget(params[0]) * Number(params[1]);
		} else {
			comp.out("MUL: segundo argumento deve ser uma variavel ou numero. Linha " + parser.line_counter);
			return false;
		}
		comp.memset(params[0], sec);
		return true;
    },
    
    DIV: function(params) {
        var sec;
		//first argument
		if (! parser.is_var(params[0])) {
			comp.out("DIV: Primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		} 
		
		if (params[1] === "0" || comp.memget(params[1]) === "0") {
			comp.out("DIV: divizão por zero. Linha " + parser.line);
			return false;
		}
		
		//second argument
		if (parser.is_var(params[1])) {
			sec = comp.memget(params[0]) / comp.memget(params[1]);
		} else if (parser.is_number(params[1])) {
			sec = comp.memget(params[0]) / Number(params[1]);
		} else {
			comp.out("DIV: primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		comp.memset(params[0], sec);
		return true;
    },
    
    MOD: function(params) {
        var sec;
		//first argument
		if (! parser.is_var(params[0])) {
			comp.out("MOD: primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		} 
		
		if (params[1] === "0" || comp.memget(params[1]) === "0") {
			comp.out("MOD: divisão por zero. Linha " + parser.line);
			return false;
		}
		
		//second argument
		if (parser.is_var(params[1])) {
			sec = comp.memget(params[0]) % comp.memget(params[1]);
		} else if (parser.is_number(params[1])) {
			sec = comp.memget(params[0]) % Number(params[1]);
		} else {
			comp.out("MOD: segundo argumento deve ser uma variavel ou numero. Linha " + parser.line_counter);
			return false;
		}
		comp.memset(params[0], sec);
		return true;
    },
    
    PRINT: function(params) {
        if (parser.is_var(params[0])) {
			comp.out(comp.memget(params[0]));
		} else if (parser.is_number(params[0])) {
			comp.out(params[0]);
		} else {
			comp.out("PRINT: primeiro argumento deve ser uma variavel. Linha " + parser.line_counter);
			return false;
		}
		
		return true;
    },
    
    SWAP: function(params) {
        if (! parser.is_var(params[0]) || ! parser.is_var(params[1])) {
			comp.out("SWP: argumentos devem ser variaveis. Linha " + parser.line_counter);
			return false;
		}
		var tmp = comp.memget(params[0]);
		comp.memset(params[0], comp.memget(params[1]));
		comp.memset(params[1], tmp);
		return true;
    }
};

$("#execute").click(function() {
    comp.out("");
    comp.ula("");
	var lines = $("#input").val().toUpperCase().split(/\n|\r/);

    for (var i=0; i < lines.length; i++) {
		var params, cmd;
		
		parser.line_counter = i + 1;
		
		if(lines[i] === "") { continue; }
		
		lines[i] = $.trim(lines[i]);
		
		//linhas com comentarios
		if(lines[i].substr(0,1) === "#") { continue; }
		
		params = lines[i].split(/\s+/);
		lines[i] = params;
		cmd = params.shift();
		
		if(cmd.match(/SET|ADD|SUB|MUL|DIV|MOD|PRINT|SWAP/)) {
			if(! lang[cmd](params)) {
				break;
			}
		} else {
			comp.out(cmd + ": comando desconhecido na linha " + (i+1));
			break;
		}
	}
});

$("#exemplo").click(function(){
    $("#input").val("#media\nset e0 7\nset e1 8\nset e2 5\nmul e0 4\nmul e1 5\nmul e2 6\nadd e0 e1\nadd e0 e2\ndiv e0 15\nprint e0");
});
