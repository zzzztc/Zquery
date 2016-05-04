function getEle(str){
	//把str变数组[#div1,ul,li, .box]	
	var arr=str.match(/\S+/g);
	var aParent=aParent||[document];
	var aChild=[];
	
	//抓		i		父		子			
	//		i=0		doc		#div1
	//		i=1		oDiv	[ul,ul,ul]
	//		i=2		aUl		[li,li,li,li]
	//		i=3		aLi		[div,li,..,..]
	for(var i=0;i<arr.length;i++){
		aChild = getByStr(aParent,arr[i]);	
		aParent = aChild;
	}
	
	//丢出去的是子
	return aChild;	
}

function getByStr(aParent,str){
	var aChild=[];
	
	//向aChild去推数据
	for(var j=0;j<aParent.length;j++){
		//#div1/ul/li/.box
		switch(str.charAt(0)){
			case '#':		//id
				var obj = document.getElementById(str.substring(1));
				obj && aChild.push(obj);
				break;
			case '.':		//class
				var aEle = getByclass(aParent[j],str.substring(1));
				for(var i=0;i<aEle.length;i++){
					aChild.push(aEle[i]);	
				}
				break;
			default:	//tagname
				//div#div1 li.box div[title=bmw] li:eq(3) li:first li:odd  li:lt()
				if(/\w+#\w+/.test(str)){//	div#div1
					var arr=str.split('#')//[tagname,id]
					var aEle = aParent[j].getElementsByTagName(arr[0]);
					for(var i=0;i<aEle.length;i++){
						if(aEle[i].id==arr[1]){
							aChild.push(aEle[i]);	
						}
					}
				}else if(/\w+\.\w+/.test(str)){//li.box
					var arr=str.split('.');	//[li,box]
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					var re = new RegExp('\\b'+arr[1]+'\\b');
					for(var i=0;i<aEle.length;i++){
						if(re.test(aEle[i].className)){
							aChild.push(aEle[i]);
						}	
					}	
				}else if(/\w+\[\w+=\]/.test(str)){
					var arr=str.split(/\[|\]|=/)
					var aEle=aParent[j].getElementsByTagName(arr[0])
					for (var i = 0; i < aEle.length; i++) {
						if (aEle[i].getAttribute(arr[1])==arr[2]) {
							aChild.push(aEle[i])
						}
					}
				}else if(/\w+:\w+(\(\w+\))?/.test(str)){
					var arr=str.split(/:|\(|\)/)
					var aEle=aParent[j].getElementsByTagName(arr[0])
					if (aEle.length==0) return aChild;
					switch(arr[1]){
						case 'first':
							aChild.push(aEle[0])
							break;
						case 'last':
							aChild.push(aEle[aEle.length-1])
							break;
						case 'eq':
							aChild.push(aEle[arr[2]])
							break;
						case 'lt'://xiaoyu
							for (var i = 0; i < arr[2]; i++) {
								aChild.push(aEle[i])
							}
							break;
						case 'gt'://dayu
							for (var i = parseInt(arr[2])+1; i < aEle.length; i++) {
								aChild.push(aEle[i])
							}
							break;
						case 'odd'://danshu
							for (var i = 0; i < aEle.length; i++) {
								if (i%2==1) {
									aChild.push(aEle[i])
								}
							}
							break;
						case 'even'://oushu
							for (var i = 0; i < aEle.length; i++) {
								if (i%2==0) {
									aChild.push(aEle[i])
								}
							}
							break;		
					}
				}else{
					var aEle = aParent[j].getElementsByTagName(str);
					for(var i=0;i<aEle.length;i++){
						aChild.push(aEle[i]);	
					}
				}
				
		}
	}
	return aChild;
}

function getByclass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);	
	}
	
	var aEle=oParent.getElementsByTagName('*');
	var result=[];
	var re = new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<aEle.length;i++){
		if(re.test(aEle[i].className)){
			result.push(aEle[i]);	
		}
	}
	return result;
}

function ready(fn){
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded',function(){
			fn&&fn()
		},false);	
	}else{
		document.attachEvent('onreadystatechange',function(){
			if (document.readyState=='complete') {
				fn&&fn()
			}
		})
	}
}
function zquery(arg){
	this.elements=[]
	switch(typeof arg){
		case 'function':
			ready(arg)
			break;
		case 'string':
			this.elements=getEle(arg);
			break;
		case 'object':
			if (length in arg) {
				for (var i = 0; i < arg.length; i++) {
					this.elements.push(arg[i])
				}
			}else{
				this.elements.push(arg)
			}
			
			break;
	}
}

function $(arg){
	return new zquery(arg)
}
function getstyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
zquery.prototype.attr= function(name,value) {
	if (arguments.length==2) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].setAttribute(name,value)
		}
	}else{
		if (typeof name=='string') {
			return this.elements[0].getAttribute(name)
		}else if(typeof name=='object'){
			for (var i = 0; i < this.elements.length; i++) {
				for(var key in name){
					this.elements[i].setAttribute(key,name[key])
				}
			}
		}
	}
};
zquery.prototype.css = function(attr,value) {
	if (arguments.length==2) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].style[attr]=value;
		}
	}else{
		if (typeof attr=='string') {
			return this.elements[0].getstyle(this.elements[0],attr)
		}else if (typeof attr=='object') {
			for (var i = 0; i < this.elements.length; i++) {
				for (var key in attr){
					this.elements[i].style[key]=attr[key]
				}
			}
		}
	}
};
// $(function(){
// 	$('li:eq(5)').css('background','red')
// })
function addEvent(obj,sEvt,fn){
	if (obj.addEventListener) {
		obj.addEventListener(sEvt,function(ev){
			if (fn.call(obj,event)==false) {
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		},false);	
	}else{
		obj.attachEvent('on'+sEvt,function(event){
			if (fn.call(obj,event)==false) {
				event.cancelBubble=true;
				return false;
			}
		})
	}
}

zquery.prototype.toggle=function(){
	var args=arguments;
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].index=0;
		addEvent(this.elements[i],'click',function(ev){
		if (args[this.index%args.length].call(this,ev)==false) {
			this.index++;
			return false;
		}else{
			this.index++;
		}
	})
	}
	
}
zquery.prototype.mouseseenter=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i],'mouseover',function(ev){
			var oFrom=ev.fromElement||ev.releateTarget;
			if (oFrom&&this.contains(oFrom)) return;
			fn.call(this,ev);
		})
	}
}

zquery.prototype.mouseleave=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i],'mouseover',function(ev){
			var oTo=ev.toElement||ev.releateTarget;
			if (oTo&&this.contains(oTo)) return;
			fn.call(this,ev);
		})
	}
}

zquery.prototype.hover=function(fn1,fn2){
	this.mouseenter(fn1);	
	this.mouseleave(fn2);	
};
zquery.prototype.eq=function(index){
	return $(this.elements[index]);
}
zquery.prototype.get=function(index){
	return this.elements[index];
}
zquery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='inline-block';	
	}
};
zquery.prototype.index=function(){
	//var oParent=this.elements[0].parentNode;
	var oParent=this.get(0).parentNode;
	var aChild=oParent.children;
	for(var i=0;i<aChild.length;i++){
		if(aChild[i]==this.get(0)){
			return i;
		}
	}
};

zquery.prototype.find=function(str){
	return $(getEle(str,this.elements))
}
zquery.prototype.hasClass=function(str){
	var re=new RegExp('\\b'+sClass+'\\b');
	for (var i = 0; i < this.elements.length; i++) {
		if (!re.test(this.elements[i].className)) {
			return false;
		}
		return true
	}
}
zquery.prototype.addClass=function(sClass){
	var re=new RegExp('\\b'+sClass+'\\b')
	for (var i = 0; i < this.elements.length; i++) {
		if (!this.elements[i].className) {
			this.elements[i].className=sClass;
		}else if(!re.test(this.elements[i].className)){
			this.elements[i].className=this.elements[i].className+' '+ sClass;
		}
	}
}
zquery.prototype.removeClass=function(sClass){
	var re = new RegExp('\\b'+sClass+'\\b');
	for (var i = 0; i < this.elements.length; i++) {
		if(re.test(this.elements[i].className)){
		this.elements[i].className=this.elements[i].className.replace(re,'');
		}
		this.elements[i].className=this.elements[i].className.match(/\S+/g).join(' ');
	}
}
zquery.prototype.toggleClass=function(sClass){
	var re = new RegExp('\\b'+sClass+'\\b');
	for (var i = 0; i < this.elements.length; i++) {
		if ($(this.elements[i]).hasClass(sClass)) {
			$(this.elements[i]).removeClass(sClass);
		}else{
			$(this.elements[i]).addClass(sClass);
		}	
	}
}
zquery.prototype.each=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		fn.call(this.elements,i,this.elements[i])
	}
}
'click|mouseover|mouseout|contextmenu'.replace(/\w+/g,function(sEvt){
	zquery.prototype[sEvt]=function(fn){
		for (var i = 0; i < this.elements.length; i++) {
			addEvent(this.elements[i],sEvt,fn)
		}
	}
})