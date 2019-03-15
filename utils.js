Object.defineProperties(Array.prototype, {
    eachSlice : {value:function(size, ƒ) {
        if (ƒ) {
            for (var i=0, l=this.length; i<l; i+=size) {
                ƒ.call(this, this.slice(i, i + size));
            }
        } else {
            const result = [];
            for (var i=0, l=this.length; i<l; i+=size) {
                result[i/size] = this.slice(i, i+size);
            }
            return result;        
        }
    }},

    partition : {value:function(ƒ) {
        const result = [[],[]];
        this.forEach( o=>result[ƒ(o) ? 0 : 1].push(o));
        return result;
    }},

    transpose : {value:function() {
        const cols=this[0].length, result=[];
        for (let i=0, rows=this.length; i<rows; ++i) {
            for (let j=0; j<cols; j++) {
                const row = result[j] || (result[j]=[]);
                if (this[i][j]!==undefined) row[i] = this[i][j];
            };
        };
        return result;
    }},

    sample : {value:function() {
        return this[(this.length*Math.random())<<0];
    }},
});