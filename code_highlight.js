
// global function to set global options. see below.
var JSCodeHighlight;

(function(){
// Options
var gopts = {
	rootClass: 'js-code-highlight-root',
	inlineRootClass: 'inline',
	multilineRootClass: 'multiline',
	lineClass: 'line',
	gutterClass: 'line-nums',
	font: "Courier New",
};

JSCodeHighlight = function(o) {
	for(var k in o) {
		gopts[k] = o[k];
	}
};


// Highlighting Rules
// (?<O>) is the captured group.
// name: "foo" will be added as a css class to the element.
var rule_list = {
	c: [
		{name: 'whitespace', re: /^(?<O>\s+)/},
		{name: 'preproc', re:  /^(?<O>#[a-zA-Z]+.*)\n/},
		{name: 'comment', re:  /^(?<O>\/\/.*)\n/},
		{name: 'comment', re:  /^(?<O>\/\*.*\*\/)/ms},
		{name: 'type', re:    /^(?<O>(const|extern|int|inline|restrict|void|volatile|float|char|double|unsigned|signed|short|long|static|struct|union|enum|auto|register|[a-z_0-9]+_t)\**)\W/},
		{name: 'keyword', re: /^(?<O>if|for|else|while|do|switch|return|break|continue|default|case|goto|typedef|sizeof|offsetof)\W/},
		{name: 'string', re:   /^(?<O>"([^\\]*|\\.)+")/},
		{name: 'charlit', re:   /^(?<O>'([^\\]*|\\.)+')/},
		{name: 'number', re:   /^(?<O>[-+]?[0-9]*\.?[0-9]+e?[0-9]*)/},
		{name: 'punct', re:    /^(?<O>(&gt;|&lt;)+|[\(\)\[\]{}\|\.,\+=\-?&\/\\\*^%:;!~]+)/},
		{name: 'ident', re:    /^((?<O>[a-zA-Z_][a-zA-Z_0-9]*)\W)/},
	],
};

window.addEventListener('load', function() {
	
	
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
				var t = m.groups.O;
				out_lines.push(
					t.split('\n')
						.map(function(x) { return '<span class="'+cl+'">'+x+'</span>'})
						.join('\n')
				);
				s.l = s.l.slice(t.length);
				return true;
			}
			return false;
		}
		
		var out_lines = [];
		for(var l of lines) { 
			l = l.slice(least_tabs);
			out_lines.push(l);
		}
		// all this messy joining and splitting is to handle multi-line matches like comments
		//   but also put each code line inside its own span
		var txt = out_lines.join("\n");
		var hl = processLine(txt);
		
		out_lines = hl.join("").split("\n");
		
		
		var parent = document.createElement('div');
		parent.classList.add(gopts.rootClass);
		parent.classList.add(gopts.multilineRootClass);
		parent.style.display = "block";
		parent.style.position = "relative";
		var line_nums = document.createElement('span');
		line_nums.classList.add(gopts.gutterClass);
		line_nums.style.display = "inline-block";
		line_nums.style.fontFamily = gopts.font;
		line_nums.style.whiteSpace = "pre";
		line_nums.style.userSelect = "none";
		for(var i = 1; i <= lines.length; i++) {
			var nl = document.createElement('span');
			nl.classList.add(gopts.lineClass);
			nl.innerHTML = i + "\n";
			line_nums.appendChild(nl);
		}
		
		
		var code_block = document.createElement('div');
		code_block.style.position = "absolute";
		code_block.style.display = "inline-block";
		code_block.style.left = "40px";
		code_block.style.fontFamily = gopts.font;
		code_block.style.whiteSpace = "pre";
		for(var l of out_lines) {
			var nl = document.createElement('span');
			nl.classList.add(gopts.lineClass);
			nl.innerHTML = l + "\n";
			code_block.appendChild(nl);
		}
		
		parent.appendChild(line_nums);
		parent.appendChild(code_block);
		pre.replaceWith(parent)
		
	} 
	
	
	
	// inline pre's
	
	var pres = document.querySelectorAll('ipre');
	for(var pre of pres) {
		var extra = "";
		var src = pre.innerHTML.replace(/^\s+/, '').replace(/\s+$/, '')
		
		var line_num = pre.getAttribute('ln');
		if(line_num) {
			extra = '<span class="line-nums">'+line_num+'</span>';
		}
		
		var parent = document.createElement('span');
		parent.style.display = "inline-block";
		parent.style.whiteSpace = "pre";
		parent.style.fontFamily = gopts.font;
		parent.classList.add(gopts.rootClass);
		parent.classList.add(gopts.inlineRootClass);
		parent.innerHTML = extra + processLine(src).join('');
		
		pre.replaceWith(parent);
	}

});
})();
