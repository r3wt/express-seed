const watched=[];
const watchers=[];
var i=0;

class Watchable {

	constructor(obj,overwrite=true){
		this.i = i;
		i++;
		watched[this.i]=watched[this.i]||{};
		watchers[this.i]=watchers[this.i]||{};
		for(let prop in obj){
			watched[this.i][prop] = obj[prop];
			watchers[this.i][prop] = [];
			Object.defineProperty(this,prop,{
				get: function(){
					return watched[this.i][prop];
				},
				set: function(v){
					for(let j=0;j<watchers[this.i][prop].length;j++){
						watchers[this.i][prop][j](watched[this.i][prop],v);
					}
					watched[this.i][prop] = v;
				}
			});
		}
		if(overwrite){
			obj = this;//overwrite orginal object with the watchable.
		}
	}

	watch(k,f){
		var ii = watchers[this.i][k].push(f);
		return ()=>watchers[this.i][prop].splice(ii-1,0);//return the unwatch() function
	}

	static clean(){
		watchers.length = 0;
		i=0;
	}

}

module.exports = Watchable;