//scrubber.asynct
Scrubber = require('../lib/scrubber');

//two trivial tests
exports['test scrubber one num'] = function (test){
	s = new Scrubber();

	r = s.scrub([1]);
	
	test.deepEqual(r.callbacks,{});//empty callbacks
	test.deepEqual(r.arguments,[1]);//empty callbacks
	test.deepEqual(r,{
		arguments:[1]
	,	callbacks: {}
	,	links: {}
	});//empty callbacks
	test.finish();
}
exports['test scrubber one string'] = function (test){
	s = new Scrubber();
	
	r = s.scrub(["HELLO"]);
	
	test.deepEqual(r.callbacks,{});//empty callbacks
	test.deepEqual(r.arguments,["HELLO"]);//empty callbacks
	test.deepEqual(r,{
		arguments:["HELLO"]
	,	callbacks: {}
	,	links: {}
	});//empty callbacks
	test.finish();
}

//something slightly more interesting.


exports['test scrubber one function'] = function (test){
	s = new Scrubber();
	function a(){}
	
	r = s.scrub([a]);

	test.deepEqual(r,{
		arguments:["[Function]"]
	,	callbacks: {'0' : ['0']}
	,	links: {}
	});//empty callbacks
	test.finish();
}

exports['test scrubber two functions'] = function (test){
	s = new Scrubber();
	function a(){}
	function b(){}
	
	r = s.scrub([a,b]);

	test.deepEqual(r,{
		arguments:["[Function]","[Function]"]
	,	callbacks: {
			'0' : ['0']
		,	'1' : ['1']
		}
	,	links: {}
	});//empty callbacks
	test.finish();
}
exports['test scrubber complex functions'] = function (test){
	s = new Scrubber();
	function a(){}
	function b(){}
	function c(){}
	
	args = {
		o: 1
	,	a: a
	,	b: b
	,	c: {
			d: c
		,	e: "e"
		}
	}
		
	r = s.scrub([args]);

	test.deepEqual(r,{
		arguments:[{
			o: 1
		,	a: '[Function]'
		,	b: '[Function]'
		,	c: {
				d: '[Function]'
			,	e: "e"
			}
		}]
	,	callbacks: {
			'0' : ['0','a']
		,	'1' : ['0','b']
		,	'2' : ['0','c','d']
		}
	,	links: {}
	});//empty callbacks
	test.finish();
}
exports['test duplicate function'] = function (test){
	s = new Scrubber();
	function a(){}

//scrubber does not check whether a is the same function.
	r = s.scrub([a,a,a]);

	test.deepEqual(r,{
		arguments: ['[Function]','[Function]','[Function]']
	,	callbacks: {
			'0' : ['0']
		,	'1' : ['1']
		,	'2' : ['2']
		}
	,	links: {}
	});
	
	test.finish();

}
/*
 scrubber does not pass properties of functions
*/

exports['test function properties'] = function (test){
	s = new Scrubber();
	function a(){}
	function b(){}
	a.b = b
	//scrubber doesn't check if functions have properties.
	r = s.scrub([a]);

	test.deepEqual(r.callbacks,{'0':['0'],'1':['0','b']});
	test.deepEqual(r,{
		arguments: ['[Function]']
	,	callbacks: {
			'0' : ['0']
		,	'1' : ['0','b']
		}
	,	links: {}
	});
	
	test.finish();
}

/*
 scrubber cannot scrub self-referential arguments.
*/
exports['test self referential arguments'] = function (test){
	s = new Scrubber();

	args = [1,2,3]
	args.push(args);
	r = s.scrub([args]);

	test.deepEqual(r,{
		arguments: [args]
	,	callbacks: {}
	,	links: {}
	});
	
	test.finish();
}



if (module == require.main) {
  require('async_testing').run(__filename, process.ARGV);
}

