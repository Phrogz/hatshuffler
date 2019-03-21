const util = require('util')

Object.defineProperties(Array.prototype, {
	eachSlice : {value:function(size, ƒ) {
		if (ƒ) {
			for (var i=0, l=this.length; i<l; i+=size) {
				ƒ.call(this, this.slice(i, i + size))
			}
		} else {
			const result = []
			for (var i=0, l=this.length; i<l; i+=size) {
				result[i/size] = this.slice(i, i+size)
			}
			return result
		}
	}},

	partition : {value:function(ƒ) {
		const result = [[],[]]
		this.forEach( o=>result[ƒ(o) ? 0 : 1].push(o))
		return result
	}},

	transpose : {value:function() {
		if (!this.length) return this.slice();
		if (!Array.isArray(this[0])) throw new Error('Cannot transpose: '+util.inspect(this));
		const cols=this[0].length, result=[];
		for (let i=0, rows=this.length; i<rows; ++i) {
			for (let j=0; j<cols; j++) {
				const row = result[j] || (result[j]=[])
				if (this[i][j]!==undefined) row[i] = this[i][j]
			};
		};
		return result;
	}},

	sample : {value:function() {
		return this[(this.length*Math.random())<<0]
	}},

	average : {value:function() {
		const sum = this.reduce((sum,n)=>sum+n, 0)
		return sum / this.length
	}},

	standardDeviation : {value:function() {
		const avg = this.average()
		return Math.sqrt(this.map(n=>(n-avg)**2).average())
	}},

	sortBy : {value:function(ƒ) {
		if (!ƒ) return this.sort()
		for (let i=this.length;i--;){
			const v = this[i]
			this[i] = [].concat(ƒ.call(v,v,i), v)
		 }
		 this.sort((a,b) => {
			for (var i=0,len=a.length;i<len;++i) if (a[i]!=b[i]) return a[i]<b[i]?-1:1
			return 0
		 })
		 for (var i=this.length;i--;) this[i]=this[i][this[i].length-1]
		 return this
	 }},
});

function pad(n) { return (n<10 ? '0' : '')+n }
Object.defineProperty(Date.prototype, 'toISOShort', {value:function(){
	return [this.getFullYear(), pad(this.getMonth()+1), pad(this.getDate()), 'T', pad(this.getHours()), pad(this.getMinutes()), pad(this.getSeconds())].join('')
}})

// Require a file, reloading it from disk each time
function rerequire(path) {
	delete require.cache[require.resolve(path)]
	return require(path)
}

module.exports = {rerequire:rerequire}