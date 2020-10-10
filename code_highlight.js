


window.addEventListener('load', function() {
	
	// highlighting rules
	// (?<O>) is the captured group
	var rule_list = {
			c: [
			{name: 'whitespace', re: /^(?<O>\s+)/},
			{name: 'preproc', re:  /^(?<O>#[a-zA-Z]+.*)$/},
			{name: 'type', re:    /^(?<O>(int|float|char)\**)\W/},
			{name: 'keyword', re: /^(?<O>(if|for|while|do|switch|return|break|continue|default|case)\**)\W/},
			{name: 'punct', re:    /^(?<O>(&gt;|&lt;)+|[\(\)\[\]{}\|\.,\+=\-?&\/\\\*^%:;!~]+)/},
			{name: 'string', re:   /^(?<O>"([^\\]*|\\.)+")/},
			{name: 'number', re:   /^(?<O>[-+]?[0-9]*\.?[0-9]+e?[0-9]*)/},
			{name: 'ident', re:    /^((?<O>[a-zA-Z_][a-zA-Z_0-9]*)\W)/},
		],
	};

	
	// utility functions
	
	function min(a,b) {return a > b ? b : a }
	
	function leadingTabs(s) {
		for(var i = 0; i < s.length && s[i] == "\t"; i++);
		
		return i;
	}
	
	function processLine(s) {
		var k = {l: s};
		var j = 0;
		
		var ol = []
		while(k.l.length > 0) {
			
			var br = false;
			for(var r of rules) {
				if(eat(k, r.re, r.name, ol)) {
					br = true;
					break;
				}
			}
			
			if(br) continue;
			
			ol.push(k.l[0]);
			k.l = k.l.slice(1);
		}
		
		return ol;
	}
	
	
	
	// multiline pre's
	
	var pres = document.querySelectorAll('pre');
	
	for(var pre of pres) {
		var text = pre.innerHTML;
		var lines = text.split("\n");
		
		var rules = rule_list['c'];
		
		// find out how many tabs to trim on the left
		var least_tabs = 999999999;
		var trailing_empty = 0;
		for(var l of lines) {
			var n = leadingTabs(l);
			if(l[n] !== undefined) {
				least_tabs = min(least_tabs, n);
				if(l[n] != ' ') {
					trailing_empty = 0;
				}
			}
			
			trailing_empty++;
		}
		
		lines = lines.slice(0, -trailing_empty+1);
		
		function eat(s, re, cl, out_lines) {
			var m = s.l.match(re);
			if(m) {
//  				console.log(cl, m);
				out_lines.push('<span class="'+cl+'">'+m.groups.O+'</span>');
				s.l = s.l.slice(m.groups.O.length);
				return true;
			}
			return false;
		}
		
		
		var out_lines = [];
		for(var l of lines) { 
			l = l.slice(least_tabs);
			out_lines.push(processLine(l));
		}
		
		
		var parent = document.createElement('div');
		parent.classList.add('js-code-highlight-root');
		parent.classList.add('multiline');
		parent.style.display = "block";
		parent.style.position = "relative";
		var line_nums = document.createElement('pre');
// 		line_nums.style.position = "absolute";
		line_nums.style.display = "inline-block";
		for(var i = 1; i <= lines.length; i++) {
			var nl = document.createElement('span');
			nl.innerHTML = i + "\n";
			line_nums.appendChild(nl);
		}
		
		
		var code_block = document.createElement('pre');
		code_block.style.position = "absolute";
		code_block.style.display = "inline-block";
		code_block.style.left = "40px";
		for(var l of out_lines) {
			var nl = document.createElement('span');
			nl.innerHTML = l.join('') + "\n";
			code_block.appendChild(nl);
		}
		
		parent.appendChild(line_nums);
		parent.appendChild(code_block);
		pre.replaceWith(parent)
		
	} 
	
	
	
	// inline pre's
	
	var pres = document.querySelectorAll('ipre');
	for(var pre of pres) {
		
		var src = pre.innerHTML.replace(/^\s+/, '').replace(/\s+$/, '')
		console.log(src);
		var parent = document.createElement('pre');
		parent.style.display = "inline-block";
		parent.classList.add('js-code-highlight-root');
		parent.classList.add('inline');
		parent.innerHTML = processLine(src).join('');
		pre.replaceWith(parent);
	}

});
