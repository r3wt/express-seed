const watched=[];
var i=0;

class Watchable {
	constructor(obj){
		var t = this;
		t.i = i;
		watched[i]={
			$$watchers:{
			
			}
		};
		for(let prop in obj){
			watched[i][prop] = obj[prop];
			watched[i].$$watchers[prop] = [];
			Object.defineProperty(t,prop,{
				get: function(){
					return watched[i][prop];
				},
				set: function(v){
					for(let j=0;j<watched[this.i].$$watchers[prop].length;j++){
						watched[this.i].$$watchers[prop][j](watched[this.i][prop],v);
					}
					watched[this.i][prop] = v;
				}
			});
		}
		i++;
	}
	$on(k,f){
		var i = watched[this.i].$$watchers[k].push(f);
		--i;
		return ($unwatch=()=>{
			watched[this.i].$$watchers[k].splice(i,0);
		});	
	}
	static clean(){
		watched.length = 0;
		i=0;
	}
}

module.exports = Watchable;