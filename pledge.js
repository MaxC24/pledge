'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise () {
	this.state = 'pending';
	this.value = '';
	this.handlerGroups = [];
}

$Promise.prototype.then = function(successCb, errorCb){
	// console.log('.then');
	if(typeof successCb !== 'function'){
		successCb = null;
	} 
	if(typeof errorCb !== 'function'){
		errorCb = null;
	}
	var objOfFunc = {
		successCb: successCb,
		errorCb : errorCb,
		forwarder: defer()
	} ;
	// console.log(objOfFunc);
	this.handlerGroups.push(objOfFunc);
	if (this.state === 'resolved' && successCb) {
		successCb(this.value);
	} else if(this.state === 'rejected' && errorCb) {
		errorCb(this.value);
	}
	//if not pending call callHandlers;
	// console.log('array of obj', this.handlerGroups);
	return objOfFunc.forwarder.$promise;
}
$Promise.prototype.callHandlers = function() {
	// console.log('callHandlers');
	var self = this;
	//console.log(this);

	this.handlerGroups.forEach(function(obj){
		console.log(obj);
		if(self.state === 'resolved'){
			if(obj.successCb){
				console.log('obj.forwarder ', obj.forwarder)
				obj.successCb(self.value);
			}
			obj.forwarder.resolve(self.value);
		} else if(self.state === 'rejected'){
			if(obj.errorCb){ 
				obj.errorCb(self.value);
			}
			obj.forwarder.reject(self.value);
		} 

	});
}

$Promise.prototype.catch = function(errFunc){
	this.then(null, errFunc);
	return this.handlerGroups[0].forwarder.$promise;
}

function Deferral() {
	this.$promise = new $Promise();
}

Deferral.prototype.resolve = function( data ) {
	if(this.$promise.state === 'pending'){
		this.$promise.value = data;
		this.$promise.state = 'resolved';
		this.$promise.callHandlers();
		this.$promise.handlerGroups = [];
	}
}
Deferral.prototype.reject = function( reason ) {
	if(this.$promise.state === 'pending'){
		this.$promise.value = reason;
		this.$promise.state = 'rejected';
		this.$promise.callHandlers();
		this.$promise.handlerGroups = [];
	}
}

function defer() {
	return new Deferral();
}





/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
