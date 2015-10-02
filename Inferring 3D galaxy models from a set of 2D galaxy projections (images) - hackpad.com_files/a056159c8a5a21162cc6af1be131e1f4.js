function EtherpadWebSocket(U,u){var B=this;var N=this;var w=2;var J={};this.connectLite=false;this.onopen=function(){};
this.onclosed=function(){};this.onmessage=function(){};this.onhiccup=function(){};this.onlogmessage=function(){};
this.CONNECTING=0;this.OPEN=1;this.CLOSED=2;this.readyState=-1;this.getLastReceivedSeqNumber=function(){return E;
};var O="";if(u){O="&tag="+u;}var G=window.location.host;if((G.split(":").length>1&&G.split(":")[0].split(".").length==2)||(G.split(".").length==2)){G="."+G;
}G="comet"+G;var f=0;var AG=setInterval(function(){f=0;if(B.readyState==B.CLOSED){clearInterval(AG);}},60*1000);
var M=false;function C(AR){if(AR!=D&&AR!=B){return;}if(M){return;}A("hiccup: "+AR.name);if(f++>10){F({reconnect:true,reason:"Too many hiccups!"});
return;}n();var AQ;function AT(){if(AQ){AQ.onreadystatechange=function(){};AQ.abort();AQ=null;}}I(J,"hiccup",15000,function(){M=false;
J.singleHiccup();AT();F({reconnect:false,reason:"Couldn't contact server to hiccup.",reconnectLite:true});
});M=true;function AS(){if(B.readyState==B.CLOSED){return;}if(!M){return;}B.onhiccup({connected:false});
A("trying hiccup");I(J,"singleHiccup",5000,function(){AS();});AT();AQ=V("post",d(),true,[{key:"oob",value:"hiccup"}],function(AV,AU){if(!M||!AQ){return;
}AQ=null;J.singleHiccup();if(AU.substring(0,"restart-fail".length)=="restart-fail"){J.hiccup();F({reconnect:true,reason:"Server restarted or socket timed out on server."});
}else{if(AV!=200||AU.substring(0,2)!="ok"){A("Failed to hiccup with error: "+AV+" / "+AU);setTimeout(AS,500);
}else{M=false;J.hiccup();r();}}});}AS();}function n(){for(var AQ in K){if(K.hasOwnProperty(AQ)){K[AQ].disconnect();
}}D=undefined;}function F(AQ,AR,AS){A("disconnected: "+AQ.reason+" / "+(AQ.data!==undefined?"data: "+AQ.data:""));
AM();n();if(L&&L.div){L.div.innerHTML="";}if(B.readyState!=B.CLOSED){B.readyState=B.CLOSED;if(!AR){b(true,"kill:"+AQ.reason,AS,true);
}B.onclosed(AQ);}}this.disconnect=function(AQ){F({reason:"Closed by client."},false,AQ);};function AC(){var AQ=AP();
A("basic connect on type: "+AQ);var AR=K[AQ]=new x[AQ]();AR.connect(B.connectLite);}function AN(){var AS=AK();
var AT;var AQ;for(var AR=0;AR<AS.length;++AR){AQ=AS[AR];A("other connect on type: "+AQ);AT=K[AQ]=new x[AQ]();
AT.connect();}}function r(){A("doing connect!");I(J,"connect",15000,function(){F({reconnect:false,reason:"Timeout connecting to server: no channel type was able to connect.",reconnectLite:true});
});AC();}this.connect=function(){A("socket connecting: "+U);r();};function a(){return Math.floor((new Date()).valueOf()/100)%10000000;
}function A(AQ){B.onlogmessage("(comet @t: "+a()+") "+AQ);}function AM(){A(B.describe());}this.describe=function(){function AQ(){out=[];
for(var AR in K){if(K.hasOwnProperty(AR)){out.push(AR+": "+K[AR].describe());}}return"[ "+out.join(", ")+" ]";
}return("socket state: { id: "+U+", readyState: "+B.readyState+", isHiccuping: "+M+", timeouts: "+R(J)+", officialChannel: "+(D?D.name:"none")+", channels: "+AQ()+", isPosting: "+S+", lastReceivedSeqNumber: "+E+", lastPost: "+p+", postTimeouts: "+R(Y)+", channelSeq: "+m+" }");
};function AH(AQ,AR){return function(){var AT=[];for(var AS=0;AS<arguments.length;AS++){AT.push(arguments[AS]);
}AR.apply(AQ,AT);};}var H=AH;function V(AZ,Aa,AU,AS,AV,Ab){var AQ=(Ab||j)();AQ.open(AZ,Aa,AU);if(AU){AQ.onreadystatechange=function(){if(AQ.readyState!=4){return;
}var Ac;var Ad;try{Ac=AQ.status;Ad=AQ.responseText;}catch(Ae){}AV(Ac,Ad,AQ);};}var AR=null;if(AS){AR=[];
for(var AT=0;AT<AS.length;++AT){AR.push(encodeURIComponent(AS[AT].key)+"="+encodeURIComponent(AS[AT].value));
}AR=AR.join("&");AQ.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
}try{AQ.send(AR);}catch(AX){AQ.abort();AV(500,"Error sending data!",AQ);}if(!AU){var AW;var AY;try{AW=AQ.status;
AY=AQ.responseText;}catch(AX){}AV(AW,AY,AQ);}return AQ;}var t=function(){};function I(AR,AQ,AV,AU){function AT(AY,AX){if(AY[AX]){AY[AX]();
AY[AX]=t;}}var AW=setTimeout(function(){AT(AR,AQ);AU();},AV);var AS=function(){clearTimeout(AW);};AT(AR,AQ);
AR[AQ]=AS;return AS;}var E=0;function AE(AQ){if(AQ.seqNumber>E+1){A("bad sequence number. expecting: "+(E+1)+", got: "+AQ.seqNumber);
C(B);return false;}if(AQ.seqNumber<E+1){return true;}E=AQ.seqNumber;if(!AQ.isControl){B.onmessage({data:AQ.content});
return true;}else{if(AQ.content=="kill"){F({reconnect:false,reason:"Killed by server."});return false;
}}}var d=function(){return"/comet/post?r="+P()+"&v="+w+"&id="+U+"&seq="+E+O;};function AI(){var AQ=[];
var AR=0;var AS=0;this.offer=function(AT){AQ[AS++]=AT;};this.poll=function(){if(this.length()>0){var AT=AQ[AR];
delete AQ[AR++];return AT;}};this.clear=function(){AR=0;AS=0;var AT=AQ;AQ=[];return AT;};this.length=function(){return AS-AR;
};}var v=new AI();var S=false;var Y={};var p;function b(AR,AU,AS,AT,AQ){o([{oob:AR,data:AU,cb:AQ}],AS,AT);
}function o(AQ,AX,AV,AT){if(!AV&&B.readyState==B.CLOSED){return;}if(AQ.length==0){if(AT){AT();}return;
}var AU=[];var AS=[];for(var AR=0;AR<AQ.length;++AR){AU.push({key:(AQ[AR].oob?"oob":"m"),value:AQ[AR].data});
if(AQ[AR].cb){AS.push(AQ[AR].cb);}}function AY(Af,Ae,Ab,Ad){var Aa="";try{Aa=Af+": "+Ab.statusText+" - "+Ae+" ("+Ad+")";
}catch(Ac){}F({reconnect:true,reason:"Posting message failed.",data:Aa});for(var AZ=0;AZ<AS.length;++AZ){AS[AZ](false,Aa);
}}function AW(Ab,Aa,Ac){Y.post();if(Ab!=200||Aa.substring(0,2)!="ok"){AY(Ab,Aa,Ac,"1");}else{for(var AZ=0;
AZ<AS.length;++AZ){AS[AZ](true);}if(AT){AT();}}}I(Y,"post",15000,function(){F({reconnect:true,reason:"Posting message timed out."});
});V("post",d(),!AX,AU,AW);}function l(){if(S==true){return;}var AQ=v.clear();if(AQ.length==0){return;
}S=true;o(AQ,false,false,function(){S=false;setTimeout(l,0);});p=a();}this.postMessage=function(AR,AQ){if(B.readyState!=B.OPEN){return;
}v.offer({data:AR,cb:AQ});setTimeout(function(){l();},0);};function y(){var AS=[];for(var AR=0;AR<Z.length;
++AR){var AQ=Z[AR];var AV=($&&$.browser.msie&&parseInt($.browser.version)<9);var AT=($&&$.browser.msie&&parseInt($.browser.version)<10);
if((AV&&AQ=="longpolling")||(AT&&AQ=="streaming")||($&&$.browser.opera&&AQ!="shortpolling"&&AQ!="streaming")){continue;
}var AU=navigator.userAgent.match(/iPad/i)!=null;var AW=navigator.userAgent.match(/iPhone/i)!=null;if((AW||AU)&&AQ!="streaming"){continue;
}AS.push(AQ);}return AS;}function AP(){return y()[0];}function AK(){return y().slice(1);}var D;this.getTransportType=function(){return(D?D.name:"none");
};var Z=["shortpolling","longpolling","streaming"];var h=true;var K={};var x={shortpolling:c,longpolling:AD,streaming:AO};
function R(AQ){var AS=[];for(var AR in AQ){if(AQ.hasOwnProperty(AR)){AS.push(AR+": "+(AQ[AR]==t?"unset":"set"));
}}return"{ "+AS.join(", ")+" }";}var m=1;function q(AQ){J.connect();if(!D||AQ.weight>D.weight){A("switching to use channel: "+AQ.name);
var AR=D;D=AQ;setTimeout(function(){b(true,"useChannel:"+(m++)+":"+AQ.name,false,false,function(AT,AS){if(D!=AQ){A("ignoring useChannel response as officialChannel has changed from "+AQ.name);
return;}if(AT){if(AR){AR.disconnect();}if(B.readyState!=B.OPEN){B.readyState=B.OPEN;B.onopen({});}else{B.onhiccup({connected:true});
}if(!AR){AN();}}else{F({reconnect:true,reason:"Failed to select channel on server.",data:AS});}});},0);
return true;}else{return false;}}function P(){return String(Math.round(Math.random()*1000000000000));
}function T(){return"/comet/channel?v="+w+"&r="+P()+"&id="+U;}function j(){var AQ=false;var AS=false;
if($.browser.msie&&parseInt($.browser.version)>=9){AS=true;}if(!AS){try{AQ=(window.ActiveXObject&&new ActiveXObject("Msxml2.XMLHTTP"));
}catch(AR){try{AQ=(window.ActiveXObject&&new ActiveXObject("Microsoft.XMLHTTP"));}catch(AT){AQ=false;
}}}if(!AQ&&typeof XMLHttpRequest!="undefined"){try{AQ=new XMLHttpRequest();}catch(AR){AQ=false;}}if(!AQ&&window.createRequest){try{AQ=window.createRequest();
}catch(AR){AQ=false;}}return AQ;}function Q(AQ){this.message=AQ;}function W(AR,AS){if(!AS){AS=0;}var AQ=AR.indexOf(":",AS);
if(AQ<0){return;}var AT=Number(AR.substring(AS,AQ));if(isNaN(AT)){throw new Q("Bad length: "+AR.substring(AS,AQ));
}if(AR.length<AQ+1+AT){return;}var AU=AR.substr(AQ+1,AT);return{message:AU,lastConsumedChar:AQ+1+AT};
}function AL(AQ,AR){if(AR==0){return{message:AQ,lastConsumedChar:AQ.length};}}function AA(AZ,AU,Aa){if(!AU){AU=0;
}var AT=[];var AS=AU;while(true){var AR=(Aa||W)(AZ,AS);if(!AR){break;}AS=AR.lastConsumedChar;var AX=AR.message;
var AQ=AX.split(":");if(AQ[0]=="oob"){AT.push({oob:AQ.slice(1).join(":")});continue;}var AW=Number(AQ[0]);
if(isNaN(AW)){throw new Q("Bad sequence number: "+AQ[0]);}var AV=Number(AQ[1]);if(isNaN(AV)){throw new Q("Bad control: "+AQ[1]);
}var AY=AQ.slice(2).join(":");AT.push({seqNumber:AW,isControl:(AV==1),content:AY});}return{messages:AT,lastConsumedChar:AS};
}function X(AV,AW,AU,AT){try{messages=AA(AV,AW,AT);}catch(AQ){if(AQ instanceof Q){A("Data format error: "+AQ.message);
C(AU);return;}else{A(AQ.toString()+" on line: "+AQ.lineNumber);}}for(var AR=0;AR<messages.messages.length;
AR++){var AS=messages.messages[AR].oob;if(AS){if(AS=="restart-fail"){F({reconnect:true,reason:"Server restarted or socket timed out on server."});
return;}}else{if(!AE(messages.messages[AR])){break;}}}return messages.lastConsumedChar;}function c(){this.weight=0;
this.name="shortpolling";this.isConnected=false;this.isClosed=false;this.request;this.clearRequest=function(){if(this.request){this.request.onreadystatechange=function(){};
this.request.abort();this.request=null;}};this.connectLite=false;this.timeouts={};this.describe=function(){return"{ isConnected: "+this.isConnected+", isClosed: "+this.isClosed+", timeouts: "+R(this.timeouts)+", request: "+(this.request?"set":"not set")+" }";
};this.pollDataHandler=function(AR,AQ,AS){if(AS.readyState!=4){return;}if(this.timeouts.poll){this.timeouts.poll();
}var AV;if(!this.isConnected){this.timeouts.connectAttempt();if(AR!=200){if(this.connectLite){this.disconnect();
return;}A(this.name+" connect failed: "+AR+" / "+AQ);setTimeout(H(this,this.attemptConnect),500);return;
}this.connectLite=false;var AT=(AQ?W(AQ):undefined);if(AT&&AT.message=="oob:ok"){this.timeouts.initialConnect();
this.isConnected=true;A(this.name+" transport connected!");if(!q(this)){A(this.name+" transport not chosen for activation.");
this.disconnect();return;}this.doPoll();return;}else{A(this.name+" connect didn't get ok: "+AR+" / "+AQ);
setTimeout(H(this,this.attemptConnect),500);return;}}var AU=X(AS.responseText,0,this);if(AR!=200||((!AU)&&this.emptyResponseBad)){C(this);
}setTimeout(H(this,this.doPoll),this.pollDelay);this.clearRequest();};this.keepRetryingConnection=true;
this.cancelConnect=function(){this.clearRequest();this.keepRetryingConnection=false;};this.cancelPoll=function(){this.clearRequest();
A("poll timed out.");C(this);};this.doPoll=function(){if(this.isClosed){return;}I(this.timeouts,"poll",this.pollTimeout,H(this,this.cancelPoll));
this.request=V("GET",T()+"&channel="+this.name+"&seq="+E+this.pollParams()+O,true,undefined,H(this,this.pollDataHandler),this.xhrGenerator);
};this.pollParams=function(){return"";};this.pollTimeout=5000;this.pollDelay=500;this.attemptConnect=function(){if(!this.keepRetryingConnection){return;
}A(this.name+" attempting connect");this.clearRequest();I(this.timeouts,"connectAttempt",5000,H(this,this.attemptConnect));
this.request=V("GET",T()+"&channel="+this.name+"&new=yes&create="+(N.readyState==N.OPEN?"no":"yes")+"&seq="+E+O,true,undefined,H(this,this.pollDataHandler),this.xhrGenerator);
};this.connect=function(AQ){this.connectLite=AQ;this.attemptConnect();I(this.timeouts,"initialConnect",15000,H(this,this.cancelConnect));
};this.disconnect=function(){A(this.name+" disconnected");this.isClosed=true;this.clearRequest();};}function AO(){this.weight=2;
this.name="streaming";var AS=this;var AV=false;var AQ;function Aa(){if(AQ){AQ.onreadystatechange=function(){};
AQ.abort();AQ=null;if(AU.data){AU.data();}if(AR){AR=null;}if(AT){AT.innerHTML="";AT=null;}}}var AW=false;
var AU={};var AX=0;this.describe=function(){return"{ isConnected: "+AV+", isClosed: "+AW+", timeouts: "+R(AU)+", request: "+(AQ?"set":"not set")+", cursor: "+AX+" }";
};function Ac(){AV=true;AU.initialConnect();if(!q(AS)){A("streaming transport not chosen for activation");
AS.disconnect();return;}}function Ad(){if(AW){return;}try{if(!AQ.responseText){if(AQ.readyState==4){AS.disconnect();
if(AV){A("stream connection unexpectedly closed.");C(AS);}}return;}}catch(Ag){return;}if(!AV){var Af=W(AQ.responseText,AX);
if(!Af){return;}AX=Af.lastReceivedSeqNumber;if(Af.message=="oob:ok"){Ac();}else{A("stream: incorrect channel connect message:"+Af.message);
AS.disconnect();return;}}else{AX=X(AQ.responseText,AX,AS);}if(!AQ||AQ.readyState==4){Aa();if(AV){A("stream connection unexpectedly closed.");
C(AS);}}else{I(AU,"data",60*1000,function(){C(AS);});}}function Ab(Af){if(AW){return;}if(!AV){if(Af=="oob:ok"){Ac();
}else{A("iframe stream: unexpected data on connect - "+Af);}}else{X(Af,0,AS,AL);}}function Ae(){AW=true;
Aa();A("stream: failed to connect.");}var AR;var AT;var AY=0;function AZ(){var Af;try{Af=AT.firstChild.readyState;
}catch(Ag){C(AS);return;}if(Af=="interactive"||AY>10){try{var Ah=AT.firstChild.contentWindow.document.getElementById("thebody");
}catch(Ag){C(AS);}}else{AY++;setTimeout(AZ,500);}}this.connect=function(){I(AU,"initialConnect",15000,Ae);
if(h){var Af="//"+P()+G+T()+"&channel=streaming&type=iframe&new=yes&create="+(N.readyState==N.OPEN?"no":"yes")+"&seq="+E+O;
A("stream to: "+Af);if($&&$.browser.opera){AT=$('<div style="display: none;"></div>').get(0);$("body").append(AT);
window.comet={pass_data:Ab,disconnect:function(){C(AS);}};$(AT).append($("<iframe src='"+Af+"'></iframe>"));
AY=0;setTimeout(AZ,2000);A("stream connect sent!");return;}try{var Ah=$.browser.msie&&parseInt($.browser.version)>=9;
if(!Ah){AR=(window.ActiveXObject&&new ActiveXObject("htmlfile"));}if(AR){AR.open();AR.write("<html><head><title>f</title></head><body>");
AR.write("\x3cscript>document.domain='"+document.domain+"';\x3c/script>");AR.write("</body></html>");
AR.close();AT=AR.createElement("div");AR.body.appendChild(AT);AR.parentWindow.comet={pass_data:Ab,disconnect:function(){C(AS);
}};AT.innerHTML="<iframe src='"+Af+"'></iframe>";AY=0;setTimeout(AZ,2000);}}catch(Ag){AR=false;}}else{if($&&$.browser.opera){A("opera - not trying xhr");
return;}}if(!AR){AQ=j();var Ai=h&&"withCredentials" in AQ?"//"+P()+G:"";AQ.open("get",Ai+T()+"&channel=streaming&new=yes&create="+(N.readyState==N.OPEN?"no":"yes")+"&seq="+E+O);
if("withCredentials" in AQ){AQ.withCredentials=true;}AQ.onreadystatechange=Ad;try{AQ.send(null);}catch(Ag){}}A("stream connect sent!");
};this.disconnect=function(){A("stream disconnected");AW=true;Aa();};A("new streamchannel");}function s(AQ){return"//"+AQ+G+"/comet/xhrXdFrame";
}function AB(){if(!document.getElementById("newcomethidden")){var AQ=document.createElement("div");AQ.setAttribute("id","newcomethidden");
AQ.style.display="none";document.body.appendChild(AQ);}return document.getElementById("newcomethidden");
}function AJ(AQ){this.open=function(AU,AT,AS){this.method=AU;this.uri=AT;this.async=AS;};var AR={};this.setRequestHeader=function(AS,AT){AR[AS]=AT;
};this.send=function(AT){var AS=this;this.xhr=AQ.iframe.contentWindow.doAction(this.method,this.uri,this.async,AR,AT||null,function(AU,AV){AS.readyState=4;
AS.status=AU;AS.responseText=AV;AS.onreadystatechange();});};this.abort=function(){if(this.xhr){AQ.contentWindow.doAbort(this.xhr);
}};}function z(AU){var AS=P();try{var AQ=(window.ActiveXObject&&new ActiveXObject("htmlfile"));var AR;
if(AQ){AQ.open();AQ.write("<html><head><title>f</title></head><body>");AQ.write("\x3cscript>document.domain='"+document.domain+"';\x3c/script>");
AQ.write("</body></html>");AQ.close();AR=AQ.createElement("div");AQ.body.appendChild(AR);AQ.parentWindow["done_"+AS]=AU;
AR.innerHTML="<iframe src='"+s(AS)+"'></iframe>";return{iframe:AR.firstChild,axc:AQ,div:AR};}}catch(AV){AQ=false;
}A("Not using IE setup.");var AT=document.createElement("iframe");AB().appendChild(AT);window["done_"+AS]=function(){try{delete window["done_"+AS];
}catch(AW){}AU();};AT.src=s(AS);return{iframe:AT};}function AF(){if(!L){throw Error("WebSocket isn't properly set up!");
}return new AJ(L);}var L;function AD(){c.apply(this);this.weight=1;this.name="longpolling";this.pollDelay=0;
this.pollTimeout=15000;this.pollParams=function(){return"&timeout="+(this.pollTimeout-5000);};var AQ=this.connect;
this.connect=function(){if(!L){L=z(H(this,AQ));}else{AQ.apply(this);}};this.xhrGenerator=AF;this.emptyResponseBad=true;
}}$("html").removeClass("no-js");$.ajaxPrefilter(function(A,F,E){if(A.type.toLowerCase()=="get"||!A.contentType){return;
}var B;var C=$.grep(document.cookie.split(/;\s+/),function(G){return G.split("=")[0]=="TOK";})[0];if(C){B=C.split("=")[1];
}if(A.contentType.indexOf("json")!=-1){A.data=A.data||"{}";A.data=JSON.stringify($.extend(JSON.parse(A.data),{xsrf:B}));
}else{if(A.contentType.indexOf("application/x-www-form-urlencoded")!=-1){A.data=A.data||"";if(A.data.indexOf("xsrf=")==-1){A.data+=(A.data?"&":"")+"xsrf="+B;
}}}var D=0;});function throttle(G,I,C){var D,E,F;var B=null;var A=0;C||(C={});var H=function(){A=C.leading===false?0:new Date;
B=null;F=G.apply(D,E);};return function(){var J=new Date;if(!A&&C.leading===false){A=J;}var K=I-(J-A);
D=this;E=arguments;if(K<=0){clearTimeout(B);B=null;A=J;F=G.apply(D,E);}else{if(!B&&C.trailing!==false){B=setTimeout(H,K);
}}return F;};}function showGlobalMsg(B){var A=$(".global-msg");if(!A.length){A=$("<div>").addClass("global-msg").hide().appendTo($("body"));
}window.clearTimeout(A.data("fadeOutTimer"));A.fadeIn().text(B).data("fadeOutTimer",window.setTimeout(function(){A.fadeOut();
},3000));}var caps={};caps.hasLocalStorage=false;try{var mod="hackpad";localStorage.setItem(mod,mod);
localStorage.removeItem(mod);caps.hasLocalStorage=true;}catch(e){caps.hasLocalStorage=false;}caps.hidden="";
caps.visibilityChange="";if(typeof document.hidden!=="undefined"){caps.hidden="hidden";caps.visibilityChange="visibilitychange";
}else{if(typeof document.mozHidden!=="undefined"){caps.hidden="mozHidden";caps.visibilityChange="mozvisibilitychange";
}else{if(typeof document.msHidden!=="undefined"){caps.hidden="msHidden";caps.visibilityChange="msvisibilitychange";
}else{if(typeof document.webkitHidden!=="undefined"){caps.hidden="webkitHidden";caps.visibilityChange="webkitvisibilitychange";
}}}}function escapeRegExp(A){return A.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1");}if(!clientVars.isDogfood||!window.console){console={};
var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];
for(var i=0;i<names.length;++i){console[names[i]]=function(){};}}var allCookies={getItem:function(A){if(!A||!this.hasItem(A)){return null;
}return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(A).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"));
},setItem:function(C,G,A,E,D,F){if(!C||/^(?:expires|max\-age|path|domain|secure)$/i.test(C)){return;}var B="";
if(A){switch(A.constructor){case Number:B=A===Infinity?"; expires=Tue, 19 Jan 2038 03:14:07 GMT":"; max-age="+A;
break;case String:B="; expires="+A;break;case Date:B="; expires="+A.toGMTString();break;}}document.cookie=escape(C)+"="+escape(G)+B+(D?"; domain="+D:"")+(E?"; path="+E:"")+(F?"; secure":"");
},removeItem:function(A,B){if(!A||!this.hasItem(A)){return;}document.cookie=escape(A)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(B?"; path="+B:"");
},hasItem:function(A){return(new RegExp("(?:^|;\\s*)"+escape(A).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie);
},keys:function(){var A=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/);
for(var B=0;B<A.length;B++){A[B]=unescape(A[B]);}return A;}};if(typeof(clientVars)!="undefined"&&clientVars.padId){jQuery.ajaxPrefilter(function(A,C,B){if(A.url.indexOf("hackpad.com")>-1){A.url+=A.url.indexOf("?")>-1?"&tag="+clientVars.padId:"?tag="+clientVars.padId;
}});}var padtopbar=(function(){$(function(){var J=$("#createpadlink");var B=$("#createpadentry");if(B.autocomplete&&!B.hasClass("live")){var H=navigator.userAgent.toLowerCase().indexOf("iphone")!=-1;
if(window.location.pathname=="/"&&!H){B.focus();}function E(L){var K=padutils.escapeHtml(B.val());return[{data:["<span class='ac-results-see-all-prepended'>"+(L?Math.min(L,4)+" of "+L:"See all")+" results</span>","ep/search/?q="+encodeURIComponent(K)],value:K,result:K}];
}function C(O,M){var K=padutils.escapeHtml(B.val());var L=[];var N="ep/pad/newpad?title="+encodeURIComponent(K);
if(K){if(!O){L=L.concat(E());}L.push({data:["<span class='ac-results-see-all ac-results-extra'>See all "+(M?M:"")+" results <i class='icon-forward'></i></span>","ep/search/?q="+encodeURIComponent(K)],value:K,result:K});
L.push({data:["<span class='ac-results-create-val ac-results-extra'><span class='ac-results-create-val-newpad'><i class='icon-newpad'></i></span> "+K+"</span>",N],value:K,result:K});
}return L;}var D=4;function G(L){trackPageview("/virtual/search-results?q="+B.val());var P="";var Q=0;
if(L.success){P=L.data;Q=L.numFound;}else{modals.showHTMLModal(L.html);$("input").blur();return[];}var K=[];
K=K.concat(E(L.numFound));var O=P.split("\n");for(var N=0;N<O.length&&N<D;N++){var M=$.trim(O[N]);if(M){M=M.split("|");
K.push({data:M,value:M[0],result:M[0]});}}logSearchPerformed(B.val(),Q,"From pad");K=K.concat(C(true,L.numFound));
return K;}function I(K){return'<div class="ac-search-result">'+(K[2]?K[0]+'<div class="snippet">'+K[2]+"</div>":K[0])+"</div>";
}var F=B.length?Math.max($(window).width()-2*B.offset().left-27,B.width()+27):0;B.autocomplete("/ep/search/autocomplete",{max:D+4,scroll:false,parse:G,preparse:C,alwaysPreparse:true,delay:0,noCache:true,selectFirst:true,minCountForSelect:2,width:F+"px",formatItem:I}).result(function(O,K,P,M,N){if(K[1].indexOf("ep/pad/newpad")!=-1){window.open("/"+K[1]+"&r="+(M-1),"_blank");
}else{var L;if(K[1].indexOf("?")==-1){L="/"+K[1]+"?r="+(M-1);}else{L="/"+K[1]+"&r="+(M-1);}if(N&&(N.metaKey||N.ctrlKey)){window.open(L,"_blank");
B.val("");}else{location.href=L;}}});B.on("input",function(){if($.trim(B.val())==""){logSearchPerformed("");
}});if(B.val()){B.trigger(($.browser.opera?"keypress":"keydown")+".autocomplete");}}B.on("input",function(){$("#createpadentry-hidden").val(B.val());
});B.on("focus",function(){B.parent().addClass("search-focused");});B.on("blur",function(){B.parent().removeClass("search-focused");
});});$(document).ready(function(){$(".banner-close").on("click",function(){$("body").removeClass($(this).parent().attr("id"));
$(this).remove();});$("#guest-banner-msg a").on("click",function(){modals.showModal("#page-login-box",0);
return false;});var G=new Date();var E=new Date();G.setTime(G.valueOf()+7*24*60*60*1000);E.setTime(E.valueOf()+30*24*60*60*1000);
if(!padutils.getIsMobile()){padutils.tooltip("body > header [data-tooltip], #toolbar [data-tooltip], #site-toggle");
}trackLinks("#createpadlink","toolbarClick",{command:"newpad"});var B=176;if($("body").hasClass("hasBanner")){var F=$(window);
var D=$("#site-banner");var C=$("#padbar").outerHeight();F.scroll(throttle(function(J){var I=F.scrollTop();
var H=I/(B-C);if(H<1){D.css({height:B-I,opacity:1});}else{D.css({height:C,opacity:Math.max(0,2-H)});}},33/2));
if($("body").hasClass("propad")){setTimeout(function(){$(document).scrollTop(B/2);},0);}}});var A={};
return A;}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padutils={validUrlRe:new RegExp("^(?:https?|sftp|ftps?|ssh|ircs?|file|gopher|telnet|nntp|worldwind|chrome|chrome-extension|svn|git|mms|smb|afp|nfs|(x-)?man|gopher|txmt)://|^mailto:|^xmpp:|^sips?:|^tel:|^sms:|^news:|^bitcoin:|^magnet:|^urn:|^geo:|^/","i"),escapeHtml:function(B){var A=/[&<>'"]/g;
/']/;if(!A.MAP){A.MAP={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};}return B.replace(A,function(C){return A.MAP[C];
});},uniqueId:function(){function A(C,B){return(Array(B+1).join("0")+Number(C).toString(35)).slice(-B);
}return[pad.getClientIp(),A(+new Date,7),A(Math.floor(Math.random()*1000000000),4)].join(".");},getIsMobile:function(){return navigator.userAgent.toLowerCase().indexOf("iphone")!=-1||navigator.userAgent.toLowerCase().indexOf("ipad")!=-1||navigator.userAgent.toLowerCase().indexOf("android")!=-1||navigator.userAgent.toLowerCase().indexOf("ipod")!=-1;
},uaDisplay:function(B){var A;function D(G){var H=16;G=G.replace(/[^a-zA-Z0-9\.]/g,"");if(G.length>H){G=G.substr(0,H);
}return G;}function C(H){var G=B.match(RegExp(H+"\\/([\\d\\.]+)"));if(G&&G.length>1){return D(H+G[1]);
}return null;}if(C("Firefox")){return C("Firefox");}A=B.match(/compatible; ([^;]+);/);if(A&&A.length>1){return D(A[1]);
}if(B.match(/\(iPhone;/)){return"iPhone";}if(C("Chrome")){return C("Chrome");}A=B.match(/Safari\/[\d\.]+/);
if(A){var E="?";A=B.match(/Version\/([\d\.]+)/);if(A&&A.length>1){E=A[1];}return D("Safari"+E);}var F=B.split(" ")[0];
return D(F);},binarySearch:function(A,E){if(A<1){return 0;}if(E(0)){return 0;}if(!E(A-1)){return A;}var D=0;
var B=A-1;while((B-D)>1){var C=Math.floor((D+B)/2);if(E(C)){B=C;}else{D=C;}}return B;},simpleDateTime:function(C){var A=new Date(+C);
var B=(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])[A.getDay()];var F=(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])[A.getMonth()];
var E=A.getDate();var D=A.getFullYear();var G=A.getHours()+":"+("0"+A.getMinutes()).slice(-2);return B+" "+F+" "+E+" "+D+" "+G;
},findURLs:function(E){var D=/[\u0030-\u0039\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0100-\u1FFF\u3040-\u9FFF\uF900-\uFDFF\uFE70-\uFEFE\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDC]/;
var A=new RegExp("("+/[-:@a-zA-Z0-9_.,~%+\/?=&#;()$]/.source+"|"+D.source+")");var B=new RegExp(/(?:(?:https?|sftp|ftps?|ssh|ircs?|file|gopher|telnet|nntp|worldwind|chrome|chrome-extension|svn|git|mms|smb|afp|nfs|(x-)?man|gopher|txmt):\/\/|mailto:|xmpp:|sips?:|tel:|sms:|news:|bitcoin:|magnet:|urn:|geo:)/.source+A.source+"*(?![:.,;])"+A.source,"g");
function C(J){B.lastIndex=0;var F=null;var G;while((G=B.exec(J))){F=(F||[]);var I=G.index;var H=G[0];
F.push([I,H]);}return F;}return C(E);},isWhitelistUrlScheme:function(A){return padutils.validUrlRe.test(A);
},escapeHtmlWithClickableLinks:function(F,H){var E=0;var A=[];var C=padutils.findURLs(F);function D(J){if(J>E){A.push(padutils.escapeHtml(F.substring(E,J)));
E=J;}}if(C){for(var B=0;B<C.length;B++){var I=C[B][0];var G=C[B][1];D(I);A.push("<a ",(H?'target="'+H+'" ':""),'href="',G.replace(/\"/g,"&quot;"),'">');
D(I+G.length);A.push("</a>");}}D(F.length);return A.join("");},bindEnterAndEscape:function(B,A,C){if(A){B.keypress(function(D){if(D.which==13){A(D);
}});}if(C){B.keydown(function(D){if(D.which==27){C(D);}});}},timediff:function(A){function B(C,D){C=Math.round(C);
return(""+C+" "+D+(C!=1?"s":"")+" ago");}A=Math.max(0,(+(new Date)-(+A)-pad.clientTimeOffset)/1000);if(A<60){return B(A,"second");
}A/=60;if(A<60){return B(A,"minute");}A/=60;if(A<24){return B(A,"hour");}A/=24;return B(A,"day");},makeAnimationScheduler:function(E,D,A){if(A===undefined){A=1;
}var B=null;function C(){if(!B){B=window.setTimeout(function(){B=null;var G=A;var F=true;while(F&&G>0){F=E();
G--;}if(F){C();}},D*A);}}return{scheduleAnimation:C};},makeShowHideAnimator:function(B,F,H,J){var A=(F?0:-2);
var D=1000/H;var E=D/J;var C=padutils.makeAnimationScheduler(I,D).scheduleAnimation;function G(){A=-1;
B(A);C();}function K(){if(A<-1){A=-1;}else{if(A<=0){A=A;}else{A=Math.max(-1,Math.min(0,-A));}}B(A);C();
}function L(){if(A>=-1&&A<=0){A=0.000001;C();}}function I(){if(A<-1||A==0){return false;}else{if(A<0){A+=E;
if(A>=0){A=0;B(A);return false;}else{B(A);return true;}}else{if(A>0){A+=E;if(A>=1){A=1;B(A);A=-2;return false;
}else{B(A);return true;}}}}}return{show:G,hide:L,quickShow:K};},_nextActionId:1,uncanceledActions:{},getCancellableAction:function(B,D){var A=padutils.uncanceledActions[B];
if(!A){A={};padutils.uncanceledActions[B]=A;}var C=(padutils._nextActionId++);A[C]=true;return function(){var E=padutils.uncanceledActions[B];
if(E&&E[C]){D();}};},cancelActions:function(A){var B=padutils.uncanceledActions[A];if(B){delete padutils.uncanceledActions[A];
}},makeFieldLabeledWhenEmpty:function(A,C){A=$(A);function B(){A.addClass("editempty");A.val(C);}A.focus(function(){if(A.hasClass("editempty")){A.val("");
}A.removeClass("editempty");});A.blur(function(){if(!A.val()){B();}});return{clear:B};},getCheckbox:function(A){return $(A).is(":checked");
},setCheckbox:function(A,B){if(B){$(A).attr("checked","checked");}else{$(A).removeAttr("checked");}},bindCheckboxChange:function(B,A){$(B).bind("click change",A);
},encodeUserId:function(A){return A.replace(/[^a-y0-9]/g,function(B){if(B=="."){return"-";}return"z"+B.charCodeAt(0)+"z";
});},decodeUserId:function(A){return A.replace(/[a-y0-9]+|-|z.+?z/g,function(B){if(B=="-"){return".";
}else{if(B.charAt(0)=="z"){return String.fromCharCode(Number(B.slice(1,-1)));}else{return B;}}});},tooltip:function(A){if(padutils.getIsMobile()){return;
}$(A).mouseover(function(C){$("#tooltip").remove();if(!$(this).attr("data-tooltip")||$(this).hasClass("hp-ui-button-active")){return;
}var B=$("<div id='tooltip'>").text($(this).attr("data-tooltip")).prependTo($("body"));B.css({top:$(this).offset().top+$(this).outerHeight()+10,left:$(this).offset().left+$(this).outerWidth()/2-B.outerWidth()/2,zIndex:100000}).hide().fadeIn();
});$(A).mouseout(function(){$("#tooltip").remove();});}};function showSpaces(E){var I=$(".domain-item-overflow .hp-ui-button-list-ul");
var F=$("#domain-list");var D=$(".domain-item-overflow");for(var G in E){var A=E[G];var B=$("<li>").addClass("domain-item").attr({"data-domainid":A.id,"data-orgname":A.orgName,"data-subdomain":A.subDomain,"data-lastlogindate":A.lastLoginDate});
var H=$("<a/>").attr("href",A.url).text(A.id==1?"hackpad":A.subDomain);if(location.href.indexOf(A.url)==0){B.addClass("selected");
}B.append(H);var C=$(".domain-item[data-domainid="+A.id+"]");if(C.length){$(C).replaceWith(B);}else{D.before(B);
}}F.prepend($("#domain-list .domain-item.selected").detach());F.prepend($("#domain-list .domain-item[data-domainid=1]").detach());
D.hide();}$(function(){if(!$("#domain-list").length){return;}showSpaces(clientVars.initialSpaces||[]);
var B=$("#sitebar").height();$("body").removeClass("sitebar");$("input[name=name]").keyup(function(C){if(C.keyCode==13){return;
}if($(this).val()){$("input[name=shortname]").val($(this).val().replace(/\W/g,"").toLowerCase()).change().unplaceholder();
}});function A(){if($(this).val().indexOf(" ")>-1){$(this).val($(this).val().replace(" ",""));return false;
}if($(this).val()){$("#shortname").text($(this).val()).show();$("#shortname").parent().find("label.error").remove();
$("#shortname").removeClass().addClass("busy").show();$.get("/ep/api/subdomain-check",{subdomain:$(this).val()},function(C){if(C){$("#shortname").removeClass().addClass(C.exists?"taken":"available").show();
}});}else{}}$("input[name=shortname]").keyup(A).change(A);});var modals=(function(){var A=false;var B={showModal:function(C,E,D){if(navigator.userAgent.toLowerCase().indexOf("iphone")!=-1||navigator.userAgent.toLowerCase().indexOf("ipad")!=-1||navigator.userAgent.toLowerCase().indexOf("android")!=-1){$(window).scrollTop(0);
}$(C+" input[placeholder]").unplaceholder();$(".modaldialog").hide();$(C).css("display","block");setTimeout(function(){$(C).addClass("modal-ready");
},0);$(C+" input[placeholder]").placeholder();if(!$("#modaloverlay").length){$('<div id="modaloverlay"><div id="modaloverlay-inner"><!-- --></div></div>').appendTo("body");
}$("#modaloverlay").unbind("click");if(!D){$("#modaloverlay").click(function(){modals.hideModal(200);
});}A=document.activeElement.parentNode.id=="padeditor";$("#modaloverlay").stop(true,true).show().css({opacity:0}).animate({opacity:1},E);
document.activeElement.blur();$("input").blur();if($(C).find("input:visible").length){if(C!="#page-login-box"){$(C).find("input:visible")[0].focus();
}else{$(C).focus();}}else{$(C).focus();}trackEvent("showModal",C,null,{modalId:C,isPad:clientVars.padId?true:false,isEmbed:clientVars.isEmbed||false});
cspfixes.init();},showHTMLModal:function(E,F,D){var C=$(E);if(!$("#"+C.attr("id")).length){C.appendTo("body");
C.addClass("disposeUponHide");}else{C=$($("#"+C.attr("id"))[0]);}modals.showModal("#"+C.attr("id"),F,D);
},hideModal:function(D){var C=$(".modaldialog:visible").attr("id");trackEvent("hideModal",C,null,{modalId:C,isPad:clientVars.padId?true:false,isEmbed:clientVars.isEmbed||false});
$(".modaldialog").removeClass("modal-ready");setTimeout(function(){$(".modaldialog").css("display","none");
if($(this).hasClass("disposeUponHide")){$(this).remove();}},250);$("#modaloverlay").animate({opacity:0},D,function(){$("#modaloverlay").hide();
});if(A){padeditor.ace.focus();}},submitModal:function(C){if(!$(C).is(":visible")){return false;}var D=$(C).serialize();
$(C).parents().filter(".modaldialog").find(".error-message").remove();$("<div>").addClass("loading-indicator").css({position:"absolute",top:"10px",left:"10px"}).appendTo($(C).parents().filter(".modaldialog"));
$.post($(C).attr("action"),D,function(E){if(E.html){var F=$(E.html).appendTo("body");F.addClass("disposeUponHide");
$(C).trigger("closed");modals.showModal("#"+F.attr("id"),0);trackEvent("submitModalHtml",$(C).attr("action"));
}else{if(E.moreInfo){$(C).trigger("more-info");}else{if(E.error){showGlobalMsg(E.error);if(E.reset){$(C).trigger("reset");
C.reset();}trackEvent("submitModalError",$(C).attr("action"),E.error,{error:E.error});}else{if(E.success&&E.cont){trackEvent("submitModalSuccessCont",$(C).attr("action"),null,{cont:E.cont});
if(document.location.href==E.cont){document.location.reload();}else{document.location.href=E.cont;}}else{if(E.success){$(C).trigger("closed");
modals.hideModal(0);trackEvent("submitModalSuccess",$(C).attr("action"));}}}}}}).fail(function(E){$("<div/>").text("An error has occurred. We're looking into it.").addClass("error-message").appendTo($(C).parents().filter(".modaldialog"));
}).always(function(){$(C).parents().filter(".modaldialog").find(".loading-indicator").remove();});trackEvent("submitModal",$(C).attr("action"));
return false;}};return B;}());$(document).ready(function(){if($(".google-signin-button").length){trackLinks(".google-signin-button","google-signin");
}$(document).keydown(function(E){if(E.keyCode==27){modals.hideModal(0);}});$("#login-email").on("focus",function(){if(!$("#login-form").hasClass("active")){$("#login-email-go").fadeIn();
}});var C=function(){$("#login-form").find(".modal-more-info").show();$("#login-form").addClass("more-info-requested");
A();$("#login-forgot-password").hide();$("#login-form").attr("action","/ep/account/signup");$("#login-submit").text("Sign me up!");
};var D=function(){$("#login-form").find(".modal-more-info").hide();$("#login-form").removeClass("more-info-requested");
A();$("#login-forgot-password").show();$("#login-form").attr("action","/ep/account/signin");$("#login-submit").text("Start using Hackpad");
};$("#login-email").on("keypress",function(E){if(E.keyCode==13){$("#login-email-go").click();}});$("#login-email-go").on("click",function(){if(!$("#login-email").val()){return false;
}$("#login-email-go").fadeOut();$("<div>").addClass("loading-indicator").css({position:"absolute",top:"10px",left:"10px"}).appendTo($("#login-form").filter(".modaldialog"));
var E=function(G){if(!$("#login-form").hasClass("active")){var F=$("#login-email-wrapper").position().top;
$("#login-email-wrapper").css({position:"absolute",width:$("#login-email-wrapper").outerWidth(),top:$("#login-email-wrapper").position().top});
$("#login-email-wrapper").data("originalPositionTop",F);$("#login-google, #login-facebook, #login-or").fadeOut(400,function(){$("#login-email-wrapper").removeClass("no-transition").css("top","40px");
setTimeout(function(){$("#login-email-wrapper").addClass("no-transition").css({position:"relative",width:"100%",top:0});
$("#login-form").addClass("active");$("#login-email-secondary").fadeIn();$("#login-email-secondary .icon-back").fadeIn();
if(location.host!="stage.hackpad.com"){setTimeout(function(){$("#login-password").focus();},0);}if(G){C();
}else{D();}},200);});}};$.ajax({type:"post",url:"/ep/account/login-or-signup",data:{email:$("#login-email").val()},success:function(F){E(F.signup);
}}).always(function(){$("#login-form").filter(".modaldialog").find(".loading-indicator").remove();});
return false;});var B=function(){$("#login-email-secondary .icon-back").fadeOut();$("#login-email-secondary").fadeOut(400,function(){$("#login-form").removeClass("active");
$("#login-email-wrapper").css({position:"absolute",width:$("#login-email-wrapper").outerWidth(),top:"40px"});
setTimeout(function(){$("#login-email-wrapper").removeClass("no-transition").css("top",$("#login-email-wrapper").data("originalPositionTop"));
setTimeout(function(){$("#login-email-wrapper").addClass("no-transition").css({position:"relative",width:"100%",top:0});
$("#login-google, #login-facebook, #login-or").fadeIn();if($("#login-email").val()){$("#login-email-go").fadeIn();
}},200);},0);});};$("#login-email-secondary .icon-back").on("click",function(){B();});var A=function(){$("#login-submit").prop("disabled",!$("#login-email").val()||!$("#login-password").val()||($("#login-form").hasClass("more-info-requested")&&!$("#login-fullname").val()));
};$("#login-form").on("closed",function(E){B();});$("#login-form").on("reset",function(E){B();});$("#login-form").on("more-info",function(){C();
});$("#login-email, #login-password, #login-fullname").on("input",function(){A();});$("#login-form").validate({rules:{email:{required:true,email:true},password:{required:true}},errorPlacement:function(E,F){E.prependTo(F.parent().parent());
},submitHandler:function(E){modals.submitModal(E);}});});
/* TinySort 1.4.29
* Copyright (c) 2008-2012 Ron Valstar http://www.sjeiti.com/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
(function(A){var B=!1,C=null,H=parseFloat,J=Math.min,G=/(-?\d+\.?\d*)$/g,F=[],E=[];
A.tinysort={id:"TinySort",version:"1.4.29",copyright:"Copyright (c) 2008-2012 Ron Valstar",uri:"http://tinysort.sjeiti.com/",licensed:{MIT:"http://www.opensource.org/licenses/mit-license.php",GPL:"http://www.gnu.org/licenses/gpl.html"},plugin:function(K,L){F.push(K);
E.push(L);},defaults:{order:"asc",attr:C,data:C,useVal:B,place:"start",returns:B,cases:B,forceStrings:B,sortFunction:C}};
A.fn.extend({tinysort:function(L,V){if(L&&typeof(L)!="string"){V=L;L=C;}var K=A.extend({},A.tinysort.defaults,V),S,P=this,a=A(this).length,M={},Y=!(!L||L==""),d=!(K.attr===C||K.attr==""),h=K.data!==C,W=Y&&L[0]==":",c=W?P.filter(L):P,T=K.sortFunction,f=K.order=="asc"?1:-1,X=[];
A.each(F,function(l,j){j.call(j,K);});if(!T){T=K.order=="rand"?function(){return Math.random()<0.5?1:-1;
}:function(r,p){var q=B,l=!K.cases?D(r.s):r.s,j=!K.cases?D(p.s):p.s;if(!K.forceStrings){var n=l&&l.match(G),o=j&&j.match(G);
if(n&&o){var t=l.substr(0,l.length-n[0].length),s=j.substr(0,j.length-o[0].length);if(t==s){q=!B;l=H(n[0]);
j=H(o[0]);}}}var m=f*(l<j?-1:(l>j?1:0));A.each(E,function(v,u){m=u.call(u,q,l,j,m);});return m;};}P.each(function(n,o){var l=A(o),j=Y?(W?c.filter(o):l.find(L)):l,p=h?""+j.data(K.data):(d?j.attr(K.attr):(K.useVal?j.val():j.text())),m=l.parent();
if(!M[m]){M[m]={s:[],n:[]};}if(j.length>0){M[m].s.push({s:p,e:l,n:n});}else{M[m].n.push({e:l,n:n});}});
for(S in M){M[S].s.sort(T);}for(S in M){var N=M[S],b=[],Q=a,Z=[0,0],O;switch(K.place){case"first":A.each(N.s,function(l,j){Q=J(Q,j.n);
});break;case"org":A.each(N.s,function(l,j){b.push(j.n);});break;case"end":Q=N.n.length;break;default:Q=0;
}for(O=0;O<a;O++){var R=I(b,O)?!B:O>=Q&&O<Q+N.s.length,U=(R?N.s:N.n)[Z[R?0:1]].e;U.parent().append(U);
if(R||!K.returns){X.push(U.get(0));}Z[R?0:1]++;}}P.length=0;Array.prototype.push.apply(P,X);return P;
}});function D(K){return K&&K.toLowerCase?K.toLowerCase():K;}function I(L,N){for(var K=0,M=L.length;K<M;
K++){if(L[K]==N){return !B;}}return B;}A.fn.TinySort=A.fn.Tinysort=A.fn.tsort=A.fn.tinysort;})(jQuery);
/* Array.prototype.indexOf for IE (issue #26) */
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(C){var B=this.length,A=Number(arguments[1])||0;
A=A<0?Math.ceil(A):Math.floor(A);if(A<0){A+=B;}for(;A<B;A++){if(A in this&&this[A]===C){return A;}}return -1;
};}function hideIphoneToolbar(){if(window.pageYOffset==0){window.scrollTo(window.pageXOffset,1);window.setTimeout(hideIphoneToolbar,1000);
}}var lastPageXOffset=0;$(function(){$("#friend-picker").attr("placeholder","name / email");if((navigator.userAgent.toLowerCase().indexOf("iphone")!=-1||navigator.userAgent.toLowerCase().indexOf("ipad")!=-1)&&!$("body").hasClass("mobile-app")){$(".title a").bind("click",function(){if(this.href){location.href=this.href;
return false;}});if(window.screen.height==568){document.querySelector("meta[name=viewport]").content="width=320.1";
}$("img.list-button").attr("src","/static/img/list@2x.png");$("img.plus-button").attr("src","/static/img/plus@2x.png");
}});var cspfixes=(function(){function A(){$("*[data-click]").off("click.csp").on("click.csp",function(B){console.log("data-click handler:",this,B);
var G=$(this).attr("data-click");switch(G){case"connect-dropbox":document.location="/ep/dropbox/get-dropbox-auth-url";
return false;case"disconnect-dropbox":document.location="/ep/dropbox/disconnect";return false;case"showmodal":modals.showModal($(this).attr("data-modal"),500);
return false;case"hidemodal":modals.hideModal(0);return false;case"submitmodal":var F=$(this).attr("data-modal");
modals.submitModal(F);return false;case"highlight-pad-picker":$("#pad-picker").effect("pulsate",{times:1},300).focus();
return false;case"toggle-group-follow":toggleGroupFollow(this);return false;case"signin-account":var D=$(this).attr("data-id");
var C=$(this).attr("data-cont");var E="/ep/account/as?id="+D+"&cont="+C;$("<form/>").attr("action",E).attr("method","POST").appendTo(document.body).submit();
return false;case"highlight-input":$(this).find("input").select();return false;case"sitebar-open":$("body").toggleClass("sitebar-open");
return;case"preventdefault":B.preventDefault();return false;case"downloadpads":onDownloadPadsClick(B);
return false;case"cancelclick":if(!B.metaKey&&!B.ctrlKey&&B.button!=2){B.preventDefault();return false;
}break;case"pagereload":window.location.reload();return false;case"showembeddialog":pad.showEmbedDialog();
return false;case"deletepad":pad.deletePad();return false;case"deletegroup":deleteGroup();return false;
case"hideservermessage":pad.hideServerMessage();return false;}});$("*[data-submit]").off("submit.csp").on("submit.csp",function(C){var B=$(this).attr("data-submit");
if(B=="submitmodal"){return modals.submitModal(this);}});$("*[data-keyup]").off("keyup.csp").on("keyup.csp",function(C){var B=$(this).attr("data-keyup");
if(B=="maybecheckusedomain"){maybeCheckUseDomain();}});}return{init:A};})();$(document).ready(function(){cspfixes.init();
});
/*
 * jQuery Validation Plugin 1.8.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function(A){A.extend(A.fn,{validate:function(C){if(!this.length){C&&C.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing");
return;}var B=A.data(this[0],"validator");if(B){return B;}B=new A.validator(C,this[0]);A.data(this[0],"validator",B);
if(B.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){B.cancelSubmit=true;
});if(B.settings.submitHandler){this.find("input, button").filter(":submit").click(function(){B.submitButton=this;
});}this.submit(function(E){if(B.settings.debug){E.preventDefault();}function D(){if(B.settings.submitHandler){if(B.submitButton){var F=A("<input type='hidden'/>").attr("name",B.submitButton.name).val(B.submitButton.value).appendTo(B.currentForm);
}B.settings.submitHandler.call(B,B.currentForm);if(B.submitButton){F.remove();}return false;}return true;
}if(B.cancelSubmit){B.cancelSubmit=false;return D();}if(B.form()){if(B.pendingRequest){B.formSubmitted=true;
return false;}return D();}else{B.focusInvalid();return false;}});}return B;},valid:function(){if(A(this[0]).is("form")){return this.validate().form();
}else{var B=true;var C=A(this[0].form).validate();this.each(function(){B&=C.element(this);});return B;
}},removeAttrs:function(D){var B={},C=this;A.each(D.split(/\s/),function(F,E){B[E]=C.attr(E);C.removeAttr(E);
});return B;},rules:function(G,D){var B=this[0];if(G){var F=A.data(B.form,"validator").settings;var I=F.rules;
var E=A.validator.staticRules(B);switch(G){case"add":A.extend(E,A.validator.normalizeRule(D));I[B.name]=E;
if(D.messages){F.messages[B.name]=A.extend(F.messages[B.name],D.messages);}break;case"remove":if(!D){delete I[B.name];
return E;}var H={};A.each(D.split(/\s/),function(L,K){H[K]=E[K];delete E[K];});return H;}}var C=A.validator.normalizeRules(A.extend({},A.validator.metadataRules(B),A.validator.classRules(B),A.validator.attributeRules(B),A.validator.staticRules(B)),B);
if(C.required){var J=C.required;delete C.required;C=A.extend({required:J},C);}return C;}});A.extend(A.expr[":"],{blank:function(B){return !A.trim(""+B.value);
},filled:function(B){return !!A.trim(""+B.value);},unchecked:function(B){return !B.checked;}});A.validator=function(B,C){this.settings=A.extend(true,{},A.validator.defaults,B);
this.currentForm=C;this.init();};A.validator.format=function(C,B){if(arguments.length==1){return function(){var D=A.makeArray(arguments);
D.unshift(C);return A.validator.format.apply(this,D);};}if(arguments.length>2&&B.constructor!=Array){B=A.makeArray(arguments).slice(1);
}if(B.constructor!=Array){B=[B];}A.each(B,function(D,E){C=C.replace(new RegExp("\\{"+D+"\\}","g"),E);
});return C;};A.extend(A.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:A([]),errorLabelContainer:A([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(B){this.lastActive=B;
if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,B,this.settings.errorClass,this.settings.validClass);
this.addWrapper(this.errorsFor(B)).hide();}},onfocusout:function(B){if(!this.checkable(B)&&(B.name in this.submitted||!this.optional(B))){this.element(B);
}},onkeyup:function(B){if(B.name in this.submitted||B==this.lastElement){this.element(B);}},onclick:function(B){if(B.name in this.submitted){this.element(B);
}else{if(B.parentNode.name in this.submitted){this.element(B.parentNode);}}},highlight:function(D,B,C){A(D).addClass(B).removeClass(C);
},unhighlight:function(D,B,C){A(D).removeClass(B).addClass(C);}},setDefaults:function(B){A.extend(A.validator.defaults,B);
},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:A.validator.format("Please enter no more than {0} characters."),minlength:A.validator.format("Please enter at least {0} characters."),rangelength:A.validator.format("Please enter a value between {0} and {1} characters long."),range:A.validator.format("Please enter a value between {0} and {1}."),max:A.validator.format("Please enter a value less than or equal to {0}."),min:A.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=A(this.settings.errorLabelContainer);
this.errorContext=this.labelContainer.length&&this.labelContainer||A(this.currentForm);this.containers=A(this.settings.errorContainer).add(this.settings.errorLabelContainer);
this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();
var D=(this.groups={});A.each(this.settings.groups,function(E,F){A.each(F.split(/\s/),function(H,G){D[G]=E;
});});var C=this.settings.rules;A.each(C,function(E,F){C[E]=A.validator.normalizeRule(F);});function B(G){var E=A.data(this[0].form,"validator"),F="on"+G.type.replace(/^validate/,"");
E.settings[F]&&E.settings[F].call(E,this[0]);}A(this.currentForm).validateDelegate(":text, :password, :file, select, textarea","focusin focusout keyup",B).validateDelegate(":radio, :checkbox, select, option","click",B);
if(this.settings.invalidHandler){A(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler);
}},form:function(){this.checkForm();A.extend(this.submitted,this.errorMap);this.invalid=A.extend({},this.errorMap);
if(!this.valid()){A(this.currentForm).triggerHandler("invalid-form",[this]);}this.showErrors();return this.valid();
},checkForm:function(){this.prepareForm();for(var B=0,C=(this.currentElements=this.elements());C[B];B++){this.check(C[B]);
}return this.valid();},element:function(B){B=this.clean(B);this.lastElement=B;this.prepareElement(B);
this.currentElements=A(B);var C=this.check(B);if(C){delete this.invalid[B.name];}else{this.invalid[B.name]=true;
}if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers);}this.showErrors();return C;
},showErrors:function(B){if(B){A.extend(this.errorMap,B);this.errorList=[];for(var C in B){this.errorList.push({message:B[C],element:this.findByName(C)[0]});
}this.successList=A.grep(this.successList,function(D){return !(D.name in B);});}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors();
},resetForm:function(){if(A.fn.resetForm){A(this.currentForm).resetForm();}this.submitted={};this.prepareForm();
this.hideErrors();this.elements().removeClass(this.settings.errorClass);},numberOfInvalids:function(){return this.objectLength(this.invalid);
},objectLength:function(C){var B=0;for(var D in C){B++;}return B;},hideErrors:function(){this.addWrapper(this.toHide).hide();
},valid:function(){return this.size()==0;},size:function(){return this.errorList.length;},focusInvalid:function(){if(this.settings.focusInvalid){try{A(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin");
}catch(B){}}},findLastActive:function(){var B=this.lastActive;return B&&A.grep(this.errorList,function(C){return C.element.name==B.name;
}).length==1&&B;},elements:function(){var C=this,B={};return A([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&C.settings.debug&&window.console&&console.error("%o has no name assigned",this);
if(this.name in B||!C.objectLength(A(this).rules())){return false;}B[this.name]=true;return true;});},clean:function(B){return A(B)[0];
},errors:function(){return A(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext);
},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=A([]);this.toHide=A([]);
this.currentElements=A([]);},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers);
},prepareElement:function(B){this.reset();this.toHide=this.errorsFor(B);},check:function(B){B=this.clean(B);
if(this.checkable(B)){B=this.findByName(B.name).not(this.settings.ignore)[0];}var G=A(B).rules();var D=false;
for(var H in G){var F={method:H,parameters:G[H]};try{var C=A.validator.methods[H].call(this,B.value.replace(/\r/g,""),B,F.parameters);
if(C=="dependency-mismatch"){D=true;continue;}D=false;if(C=="pending"){this.toHide=this.toHide.not(this.errorsFor(B));
return;}if(!C){this.formatAndAdd(B,F);return false;}}catch(E){this.settings.debug&&window.console&&console.log("exception occured when checking element "+B.id+", check the '"+F.method+"' method",E);
throw E;}}if(D){return;}if(this.objectLength(G)){this.successList.push(B);}return true;},customMetaMessage:function(C,D){if(!A.metadata){return;
}var B=this.settings.meta?A(C).metadata()[this.settings.meta]:A(C).metadata();return B&&B.messages&&B.messages[D];
},customMessage:function(C,D){var B=this.settings.messages[C];return B&&(B.constructor==String?B:B[D]);
},findDefined:function(){for(var B=0;B<arguments.length;B++){if(arguments[B]!==undefined){return arguments[B];
}}return undefined;},defaultMessage:function(B,C){return this.findDefined(this.customMessage(B.name,C),this.customMetaMessage(B,C),!this.settings.ignoreTitle&&B.title||undefined,A.validator.messages[C],"<strong>Warning: No message defined for "+B.name+"</strong>");
},formatAndAdd:function(C,D){var B=this.defaultMessage(C,D.method),E=/\$?\{(\d+)\}/g;if(typeof B=="function"){B=B.call(this,D.parameters,C);
}else{if(E.test(B)){B=jQuery.format(B.replace(E,"{$1}"),D.parameters);}}this.errorList.push({message:B,element:C});
this.errorMap[C.name]=B;this.submitted[C.name]=B;},addWrapper:function(B){if(this.settings.wrapper){B=B.add(B.parent(this.settings.wrapper));
}return B;},defaultShowErrors:function(){for(var B=0;this.errorList[B];B++){var C=this.errorList[B];this.settings.highlight&&this.settings.highlight.call(this,C.element,this.settings.errorClass,this.settings.validClass);
this.showLabel(C.element,C.message);}if(this.errorList.length){this.toShow=this.toShow.add(this.containers);
}if(this.settings.success){for(var B=0;this.successList[B];B++){this.showLabel(this.successList[B]);}}if(this.settings.unhighlight){for(var B=0,D=this.validElements();
D[B];B++){this.settings.unhighlight.call(this,D[B],this.settings.errorClass,this.settings.validClass);
}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show();},validElements:function(){return this.currentElements.not(this.invalidElements());
},invalidElements:function(){return A(this.errorList).map(function(){return this.element;});},showLabel:function(C,D){var B=this.errorsFor(C);
if(B.length){B.removeClass().addClass(this.settings.errorClass);B.attr("generated")&&B.html(D);}else{B=A("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(C),generated:true}).addClass(this.settings.errorClass).html(D||"");
if(this.settings.wrapper){B=B.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();}if(!this.labelContainer.append(B).length){this.settings.errorPlacement?this.settings.errorPlacement(B,A(C)):B.insertAfter(C);
}}if(!D&&this.settings.success){B.text("");typeof this.settings.success=="string"?B.addClass(this.settings.success):this.settings.success(B);
}this.toShow=this.toShow.add(B);},errorsFor:function(C){var B=this.idOrName(C);return this.errors().filter(function(){return A(this).attr("for")==B;
});},idOrName:function(B){return this.groups[B.name]||(this.checkable(B)?B.name:B.id||B.name);},checkable:function(B){return/radio|checkbox/i.test(B.type);
},findByName:function(B){var C=this.currentForm;return A(document.getElementsByName(B)).map(function(E,D){return D.form==C&&D.name==B&&D||null;
});},getLength:function(C,B){switch(B.nodeName.toLowerCase()){case"select":return A("option:selected",B).length;
case"input":if(this.checkable(B)){return this.findByName(B.name).filter(":checked").length;}}return C.length;
},depend:function(B,C){return this.dependTypes[typeof B]?this.dependTypes[typeof B](B,C):true;},dependTypes:{"boolean":function(B,C){return B;
},string:function(C,B){return !!A(C,B.form).length;},"function":function(C,B){return C(B);}},optional:function(B){return !A.validator.methods.required.call(this,A.trim(B.value),B)&&"dependency-mismatch";
},startRequest:function(B){if(!this.pending[B.name]){this.pendingRequest++;this.pending[B.name]=true;
}},stopRequest:function(C,B){this.pendingRequest--;if(this.pendingRequest<0){this.pendingRequest=0;}delete this.pending[C.name];
if(B&&this.pendingRequest==0&&this.formSubmitted&&this.form()){A(this.currentForm).submit();this.formSubmitted=false;
}else{if(!B&&this.pendingRequest==0&&this.formSubmitted){A(this.currentForm).triggerHandler("invalid-form",[this]);
this.formSubmitted=false;}}},previousValue:function(B){return A.data(B,"previousValue")||A.data(B,"previousValue",{old:null,valid:true,message:this.defaultMessage(B,"remote")});
}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(B,C){B.constructor==String?this.classRuleSettings[B]=C:A.extend(this.classRuleSettings,B);
},classRules:function(D){var C={};var B=A(D).attr("class");B&&A.each(B.split(" "),function(){if(this in A.validator.classRuleSettings){A.extend(C,A.validator.classRuleSettings[this]);
}});return C;},attributeRules:function(F){var B={};var E=A(F);for(var D in A.validator.methods){var C=E.attr(D);
if(C){B[D]=C;}}if(B.maxlength&&/-1|2147483647|524288/.test(B.maxlength)){delete B.maxlength;}return B;
},metadataRules:function(B){if(!A.metadata){return{};}var C=A.data(B.form,"validator").settings.meta;
return C?A(B).metadata()[C]:A(B).metadata();},staticRules:function(C){var D={};var B=A.data(C.form,"validator");
if(B.settings.rules){D=A.validator.normalizeRule(B.settings.rules[C.name])||{};}return D;},normalizeRules:function(B,C){A.each(B,function(F,D){if(D===false){delete B[F];
return;}if(D.param||D.depends){var E=true;switch(typeof D.depends){case"string":E=!!A(D.depends,C.form).length;
break;case"function":E=D.depends.call(C,C);break;}if(E){B[F]=D.param!==undefined?D.param:true;}else{delete B[F];
}}});A.each(B,function(E,D){B[E]=A.isFunction(D)?D(C):D;});A.each(["minlength","maxlength","min","max"],function(){if(B[this]){B[this]=Number(B[this]);
}});A.each(["rangelength","range"],function(){if(B[this]){B[this]=[Number(B[this][0]),Number(B[this][1])];
}});if(A.validator.autoCreateRanges){if(B.min&&B.max){B.range=[B.min,B.max];delete B.min;delete B.max;
}if(B.minlength&&B.maxlength){B.rangelength=[B.minlength,B.maxlength];delete B.minlength;delete B.maxlength;
}}if(B.messages){delete B.messages;}return B;},normalizeRule:function(B){if(typeof B=="string"){var C={};
A.each(B.split(/\s/),function(){C[this]=true;});B=C;}return B;},addMethod:function(B,D,C){A.validator.methods[B]=D;
A.validator.messages[B]=C!=undefined?C:A.validator.messages[B];if(D.length<3){A.validator.addClassRules(B,A.validator.normalizeRule(B));
}},methods:{required:function(C,B,E){if(!this.depend(E,B)){return"dependency-mismatch";}switch(B.nodeName.toLowerCase()){case"select":var D=A(B).val();
return D&&D.length>0;case"input":if(this.checkable(B)){return this.getLength(C,B)>0;}default:return A.trim(C).length>0;
}},remote:function(F,B,E){if(this.optional(B)){return"dependency-mismatch";}var D=this.previousValue(B);
if(!this.settings.messages[B.name]){this.settings.messages[B.name]={};}D.originalMessage=this.settings.messages[B.name].remote;
this.settings.messages[B.name].remote=D.message;E=typeof E=="string"&&{url:E}||E;if(this.pending[B.name]){return"pending";
}if(D.old===F){return D.valid;}D.old=F;var C=this;this.startRequest(B);var G={};G[B.name]=F;A.ajax(A.extend(true,{url:E,mode:"abort",port:"validate"+B.name,dataType:"json",data:G,success:function(J){C.settings.messages[B.name].remote=D.originalMessage;
var I=J===true;if(I){var L=C.formSubmitted;C.prepareElement(B);C.formSubmitted=L;C.successList.push(B);
C.showErrors();}else{var K={};var H=J||C.defaultMessage(B,"remote");K[B.name]=D.message=A.isFunction(H)?H(F):H;
C.showErrors(K);}D.valid=I;C.stopRequest(B,I);}},E));return"pending";},minlength:function(C,B,D){return this.optional(B)||this.getLength(A.trim(C),B)>=D;
},maxlength:function(C,B,D){return this.optional(B)||this.getLength(A.trim(C),B)<=D;},rangelength:function(E,B,D){var C=this.getLength(A.trim(E),B);
return this.optional(B)||(C>=D[0]&&C<=D[1]);},min:function(C,B,D){return this.optional(B)||C>=D;},max:function(C,B,D){return this.optional(B)||C<=D;
},range:function(B,D,C){return this.optional(D)||(B>=C[0]&&B<=C[1]);},email:function(C,B){return this.optional(B)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(C);
},url:function(C,B){return this.optional(B)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(C);
},date:function(C,B){return this.optional(B)||!/Invalid|NaN/.test(new Date(C));},dateISO:function(C,B){return this.optional(B)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(C);
},number:function(C,B){return this.optional(B)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(C);},digits:function(C,B){return this.optional(B)||/^\d+$/.test(C);
},creditcard:function(B,G){if(this.optional(G)){return"dependency-mismatch";}if(/[^0-9-]+/.test(B)){return false;
}var F=0,D=0,C=false;B=B.replace(/\D/g,"");for(var E=B.length-1;E>=0;E--){var H=B.charAt(E);var D=parseInt(H,10);
if(C){if((D*=2)>9){D-=9;}}F+=D;C=!C;}return(F%10)==0;},accept:function(D,C,B){B=typeof B=="string"?B.replace(/,/g,"|"):"png|jpe?g|gif";
return this.optional(C)||D.match(new RegExp(".("+B+")$","i"));},equalTo:function(C,B,E){var D=A(E).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){A(B).valid();
});return C==D.val();}}});A.format=A.validator.format;})(jQuery);(function(B){var A={};if(B.ajaxPrefilter){B.ajaxPrefilter(function(E,G,F){var D=E.port;
if(E.mode=="abort"){if(A[D]){A[D].abort();}A[D]=F;}});}else{var C=B.ajax;B.ajax=function(D){var F=("mode" in D?D:B.ajaxSettings).mode,E=("port" in D?D:B.ajaxSettings).port;
if(F=="abort"){if(A[E]){A[E].abort();}return(A[E]=C.apply(this,arguments));}return C.apply(this,arguments);
};}})(jQuery);(function(A){if(!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener){A.each({focus:"focusin",blur:"focusout"},function(C,B){A.event.special[B]={setup:function(){this.addEventListener(C,D,true);
},teardown:function(){this.removeEventListener(C,D,true);},handler:function(E){arguments[0]=A.event.fix(E);
arguments[0].type=B;return A.event.handle.apply(this,arguments);}};function D(E){E=A.event.fix(E);E.type=B;
return A.event.handle.call(this,E);}});}A.extend(A.fn,{validateDelegate:function(D,C,B){return this.bind(C,function(F){var E=A(F.target);
if(E.is(D)){return B.apply(E,arguments);}});}});})(jQuery);
/*
jQuery Placeholder 1.1.1

Copyright (c) 2010 Michael J. Ryan (http://tracker1.info/)

Dual licensed under the MIT and GPL licenses:
	http://www.opensource.org/licenses/mit-license.php
	http://www.gnu.org/licenses/gpl.html

------------------------------------------------------------------------------

Sets up a watermark for inputted fields... this will create a LABEL.watermark 
tag immediately following the input tag, the positioning will be set absolute, 
and it will be positioned to match the input tag.

To activate on all tags with a 'data-watermark' attribute:

	$('input[placeholder],textarea[placeholder]').placeholder();


To style the tags as appropriate (you'll want to make sure the font matches):

	label.placeholder {
		cursor: text;				<--- display a cursor to match the text input

		padding: 4px 4px 4px 4px;   <--- this should match the border+padding 
											for the input field(s)
		color: #999999;				<--- this will display as faded
	}

You'll also want to have the color set for browsers with native support
	input:placeholder, textarea:placeholder {
		color: #999999;
	}
	input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
		color: #999999;
	}

------------------------------------------------------------------------------

Thanks to...
	http://www.alistapart.com/articles/makingcompactformsmoreaccessible
	http://plugins.jquery.com/project/overlabel

	This works similar to the overlabel, but creates the actual label tag
	based on a data-watermark attribute on the input tag, instead of 
	relying on the markup to provide it.

*****************************************************************************/
(function(A){var B="PLACEHOLDER-INPUT";
var C="PLACEHOLDER-LABEL";var G=false;var I={labelClass:"placeholder"};var F=document.createElement("input");
if("placeholder" in F){A.fn.placeholder=A.fn.unplaceholder=function(){};delete F;return;}delete F;A.fn.placeholder=function(K){H();
var J=A.extend(I,K);this.each(function(){var N=Math.random().toString(32).replace(/\./,""),L=A(this),M=A('<label style="position:absolute;display:none;top:0;left:0;"></label>');
if(!L.attr("placeholder")){return;}if(L.data(B)===B){D.call(this);E.call(this);return;}if(!L.attr("id")){L.attr("id","input_"+N);
}M.attr("id",L.attr("id")+"_placeholder").data(B,"#"+L.attr("id")).attr("for",L.attr("id")).css("fontSize",L.css("fontSize")).css("lineHeight",L.css("height")).addClass(J.labelClass).addClass(J.labelClass+"-for-"+this.tagName.toLowerCase()).addClass(C).text(L.attr("placeholder"));
M.click(function(){A(this).focus();});L.data(C,"#"+M.attr("id")).data(B,B).addClass(B).after(M);D.call(this);
E.call(this);});};A.fn.unplaceholder=function(){this.each(function(){var J=A(this),K=A(J.data(C));if(J.data(B)!==B){return;
}K.remove();J.removeData(B).removeData(C).removeClass(B);});};function H(){if(G){return;}A("."+B).live("keydown",D).live("focusout",E);
bound=true;G=true;}function D(){var J=A(this),K=A(J.data(C));K.css("display","none");}function E(){var J=this;
setTimeout(function(){var K=A(J);A(K.data(C)).css("top",K.position().top+"px").css("left",K.position().left+"px").css("display",!!K.val()?"none":"block");
},200);}}(jQuery));$(document).ready(function(){var A=true;$(".tab_content").show();$(".tab_content:first-child").show();
if($(".tab_content:first-child").find("input:visible").length){$(".tab_content:first-child").find("input:visible")[0].focus();
}$("ul.tabs li").click(function(){var B=$(this).parents(".tab_wrapper");$(this).parents("ul.tabs").find("li").removeClass("active");
$(this).addClass("active");B.find(".tab_content").hide();B.find(".tab_content").find("input").unplaceholder();
var C=$(this).find("a").attr("href");var D=function(){B.find("input[placeholder]:visible").placeholder();
if(B.find("input:visible").length){if(!A){B.find("input:visible")[0].focus();}}};B.find(C).fadeIn();D();
if(window[$(C).attr("id")+"_onactivate"]){window[$(C).attr("id")+"_onactivate"]();}return false;});$("ul.tabs li[selected]").click();
A=false;});function tab1_onactivate(){if(!$("#signin-form input[name=email]").val()){$("#signin-form input[name=email]").val($("#signup-form input[name=email]").val());
}if(!$("#signin-form input[name=password]").val()){$("#signin-form input[name=password]").val($("#signup-form input[name=password]").val());
}}var home=new (function(){this.initFriendPicker=function(){$("#friend-picker.invite-to-site").invite({target:"Site",dataURL:"/ep/invite/autocomplete?emailonly=1",inviteItemHandlers:{fb:{callback:function(A){}},"*":{callback:function(A){var D=$("#friend-picker.invite-to-site");
D.addClass("ac_loading");var B;var C;if(A[3]=="typedemail"){B=A[1];C=A[1];}else{if(A[3]=="email"){C=A[1].split("<span ")[0];
B=A[2];}}if(!B){alert("This does not look like a valid email address.");return;}if(!clientVars.isAdmin){var E=confirm("You are about to grant full site access to <"+B+">. An admin will be informed. Continue?");
if(!E){return;}}$.post("/ep/invite/invite",{email:B,fullName:C},function(F){if(typeof(F)=="object"&&"success" in F&&F.success==false){alert(F.message);
}else{$("#domain-members").refresh(function(){home.initFriendPicker();$("input[placeholder]").placeholder();
$("#friend-picker.invite-to-site").focus();});}}).fail(function(){alert("An error has occured. Please contact support@hackpad.com if this error persists.");
}).always(function(){D.removeClass("ac_loading");});},}}});};this.init=function(){$(".signup-form-toggle").click(function(){$("#nofacebooksignup").toggle();
$("input[placeholder]:visible").placeholder();$("#signup-form #name").focus();return false;});$("#signin-button, #features-signup-button, .signin-button").click(function(){$(".signin-tab").click();
modals.showModal("#page-login-box",0);$("input").blur();});$("#signup-button").click(function(){$(".signup-tab").click();
modals.showModal("#page-login-box",0);$("input").blur();});$("#get-started-button").click(function(){location.href="/REeiTgQKman";
});$("#featured-screenshot img").click(function(){location.href="/REeiTgQKman";});if($("#presslogos a").length){trackLinks("#presslogos a","presslogo");
}if(clientVars&&clientVars.experiment){trackEvent("splashpage",null,null,{experiment:clientVars.experiment});
}if($("#friend-picker.invite-to-site").length){this.initFriendPicker();}};return this;})();$(document).ready(function(){home.init();
});$.urlParam=function(B){var A=new RegExp("[\\?&]"+B+"=([^&#]*)").exec(window.location.href);return A&&decodeURIComponent(A[1])||null;
};var padfacebook=(function(){var A=$.urlParam("cont");function D(){if($("#connecting-to-facebook").length){$("#connecting-to-facebook .cancel").unbind("click");
$("#connecting-to-facebook .cancel").click(function(){document.location.href="/ep/account/sign-out";});
modals.showModal("#connecting-to-facebook",0);}}function B(E){if(E.authResponse){$.post("/ep/account/connect-fb-session",{access_token:E.authResponse.accessToken,cont:A},function(F){if(F.success&&F.cont){if(document.location.href==F.cont){document.location.reload();
}else{document.location.href="/ep/account/safe-redirect?cont="+encodeURIComponent(F.cont);}}else{if(F.html){$(F.html).appendTo("body").attr("id","response-html");
modals.hideModal(0);modals.showModal("#response-html");return;}}if($("#connecting-to-facebook").length){modals.hideModal();
}});}else{if($("#connecting-to-facebook").length){modals.hideModal();}}}$(function(){if(top==window){}else{$("body").addClass("fbcanvas");
}if(clientVars.disableFB){return;}$("body").prepend('<div id="fb-root" />');$.getScript("https://connect.facebook.net/en_US/all.js",function(){var E=clientVars.shouldGetFbLoginStatus;
if(!window.FB){return;}FB.init({appId:clientVars.facebookClientId,status:false,cookie:false,xfbml:false,channelUrl:location.protocol+"//"+location.host+"/static/fbchannel.html",oauth:true,frictionlessRequests:true});
if(E){FB.getLoginStatus(function(F){if(F.status=="connected"){B(F);}});}else{FB.getLoginStatus(function(F){if(F.status==="connected"){$("#facepile").show();
}else{if(F.status==="not_authorized"){$("#facepile").show();}else{}}});}if(top!=window&&!clientVars.isEmbed){FB.Canvas.setAutoGrow(true);
}});$(".fb-login-required").click(function(){A=A||$(this).attr("href");FB.Event.unsubscribe("auth.login",B);
var G=navigator.userAgent.match(/(iPod|iPhone|iPad)/);var E=null;function F(I){if(!G){B(I);}else{E=I;
}}if(clientVars.useFbChat){FB.login(F,{scope:"email,xmpp_login"});}else{FB.login(F,{scope:"email"});}var H=setInterval(function(){if(E){clearInterval(H);
B(E);}},100);D();return false;});$(".fb-logout").click(function(){A=A||$(this).attr("href");if(!(FB.getAccessToken&&FB.getAccessToken())){return true;
}FB.getLoginStatus(function(E){if(E.authResponse){FB.logout(function(F){location.href=A;});}else{location.href=A;
}});return false;});});var C={sharePad:function(){FB.ui({method:"stream.share",u:document.location.href});
},publishPad:function(G){function F(J){var I=location.protocol+"//"+location.host+location.pathname+"?invitingId="+clientVars.userId.substr(2)+location.hash;
FB.ui({method:"stream.publish",target_id:G,attachment:{name:pad.getTitle(),caption:"Edit now with {*actor*} in real-time",description:J||"Access to this Hackpad is by invitation only.",href:I,comments_xid:pad.getPadId()},action_links:[{text:"Edit now",href:I}]},function(K){if(K&&K.post_id){trackEvent("shareFacebook",{padId:clientVars.padId,post_id:K.post_id});
}});}if(pad.padOptions.guestPolicy=="deny"){F();}else{var H=padeditor.ace.exportText();var E=$.trim(H.substring(0,300));
E=$.trim(E.substring(E.indexOf("\n")+1));E=E.substring(0,E.lastIndexOf(".")+1)||E.substring(0,E.lastIndexOf("\n")+1)||E.substring(0,E.lastIndexOf(" ")+1)||E;
F(E);}},postGraphFollowPad:function(){if(!clientVars.facebookId){return;}FB.getLoginStatus(function(){var E=FB.getAccessToken();
if(!E){return;}FB.api("/me/hackpad:follow","post",{pad:location.href,access_token:E},function(){});FB.api("/me/hackpad:subscribe","post",{pad:location.href,access_token:E},function(){});
});},postGraphFollowCollection:function(){if(!clientVars.facebookId){return;}FB.getLoginStatus(function(){var E=FB.getAccessToken();
if(!E){return;}FB.api("/me/hackpad:follow","post",{collection:location.href,access_token:E},function(){});
FB.api("/me/hackpad:subscribe","post",{collection:location.href,access_token:E},function(){});});},postGraphEditTimestamp:null,postGraphEdit:function(E){if(!clientVars.facebookId){return;
}if(padfacebook.postGraphEditTimestamp){return;}padfacebook.postGraphEditTimestamp=new Date();FB.getLoginStatus(function(){var F=FB.getAccessToken();
if(F){FB.api("/me/hackpad:edit","post",{pad:location.href,access_token:F},function(){});}});}};return C;
}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(document).ready(function(){etherpad.deobfuscateEmails();
$("input[placeholder]").placeholder();if(padmodals){padmodals.initFeedback();}});etherpad={};etherpad.validEmail=function(A){return(A.length>0&&A.match(/^[\w\.\_\+\-]+\@[\w\_\-]+\.[\w\_\-\.]+$/));
};etherpad.doOnceCallbacks={};etherpad.doOnce=function(A,B){if(!etherpad.doOnceCallbacks[A]){etherpad.doOnceCallbacks[A]=true;
B();}};etherpad.deobfuscateEmails=function(){$("a.obfuscemail").each(function(){$(this).html($(this).html().replace("e***rp*d","hackpad"));
this.href=this.href.replace("e***rp*d","hackpad");});};var didLogError=false;etherpad.logError=function(F,D,B,E,A){if(didLogError){return;
}didLogError=true;var C=new Image();C.src="/ep/api/errors?"+$.param({random:Math.random(),context:navigator.userAgent,message:F,file:D,line:B,column:E,url:window.location.href,errorObj:A?A.stack:""});
};$.fn.refresh=function(A){return this.each(function(){$(this).load($(this).attr("src"),{},function(){$(this).children().unwrap();
if(A){return A();}});});};
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if(!this.JSON){JSON={};
}(function(){function C(J){return J<10?"0"+J:J;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(J){return this.getUTCFullYear()+"-"+C(this.getUTCMonth()+1)+"-"+C(this.getUTCDate())+"T"+C(this.getUTCHours())+":"+C(this.getUTCMinutes())+":"+C(this.getUTCSeconds())+"Z";
};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(J){return this.valueOf();
};}var G=/[\u0000-\u001f\u007f-\uffff]/g,H=/[\\\"\u0000-\u001f\u007f-\uffff]/g,A,D,I={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},B;
function F(J){H.lastIndex=0;return H.test(J)?'"'+J.replace(H,function(K){var L=I[K];if(typeof L==="string"){return L;
}return"\\u"+("0000"+K.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+J+'"';}function E(Q,R){var M,N,L,O,P=A,K,J=R[Q];
if(J&&typeof J==="object"&&typeof J.toJSON==="function"){J=J.toJSON(Q);}if(typeof B==="function"){J=B.call(R,Q,J);
}switch(typeof J){case"string":return F(J);case"number":return isFinite(J)?String(J):"null";case"boolean":case"null":return String(J);
case"object":if(!J){return"null";}A+=D;K=[];if(typeof J.length==="number"&&!J.propertyIsEnumerable("length")){O=J.length;
for(M=0;M<O;M+=1){K[M]=E(M,J)||"null";}L=K.length===0?"[]":A?"[\n"+A+K.join(",\n"+A)+"\n"+P+"]":"["+K.join(",")+"]";
A=P;return L;}if(B&&typeof B==="object"){O=B.length;for(M=0;M<O;M+=1){N=B[M];if(typeof N==="string"){L=E(N,J);
if(L){K.push(F(N)+(A?": ":":")+L);}}}}else{for(N in J){if(Object.hasOwnProperty.call(J,N)){L=E(N,J);if(L){K.push(F(N)+(A?": ":":")+L);
}}}}L=K.length===0?"{}":A?"{\n"+A+K.join(",\n"+A)+"\n"+P+"}":"{"+K.join(",")+"}";A=P;return L;}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(M,J,K){var L;
A="";D="";if(typeof K==="number"){for(L=0;L<K;L+=1){D+=" ";}}else{if(typeof K==="string"){D=K;}}B=J;if(J&&typeof J!=="function"&&(typeof J!=="object"||typeof J.length!=="number")){throw new Error("JSON.stringify");
}return E("",{"":M});};}if(typeof JSON.parse!=="function"){JSON.parse=function(J,L){var K;function M(R,Q){var O,P,N=R[Q];
if(N&&typeof N==="object"){for(O in N){if(Object.hasOwnProperty.call(N,O)){P=M(N,O);if(P!==undefined){N[O]=P;
}else{delete N[O];}}}}return L.call(R,Q,N);}G.lastIndex=0;if(G.test(J)){J=J.replace(G,function(N){return"\\u"+("0000"+N.charCodeAt(0).toString(16)).slice(-4);
});}if(/^[\],:{}\s]*$/.test(J.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){K=window["eval"]("("+J+")");
return typeof L==="function"?M({"":K},""):K;}throw new SyntaxError("JSON.parse");};}})();
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padmodals=(function(){var H=function(){};
function F(){H();$("#feedbackbox-topic").val("");$("#feedbackbox-subject").val("");$("#feedbackbox-message").val("");
}var D=false;function B(J){J=!!J;if(D!=J){D=J;if(J){$("#feedbackbox-send").css("opacity",0.75);}else{$("#feedbackbox-send").css("opacity",1);
}}}var C=false;function E(J){J=!!J;if(C!=J){C=J;if(J){$("#sharebox-send").css("opacity",0.75);}else{$("#sharebox-send").css("opacity",1);
}}}var G=function(){};function I(){G();}var A={init:function(){A.initFeedback();A.initShareBox();A.initModeration();
$(".modaldialog input[value=Cancel]").live("click",function(){modals.hideModal();});},initModeration:function(){$("#moderated-modal button[type=submit]").click(function(){pad.disableUnsavedPrompt();
document.location="/ep/pad/fork?padId="+clientVars.padId;});},initFeedback:function(){var J=$("#feedbackbox-email");
$("#feedbackbox-hide").click(function(){A.hideModal();});$("#feedbackbox-topic").on("change",function(){$("#feedbackbox-faq").hide();
$("#feedbackbox-feature-request").hide();$("#feedbackbox-subject").show();$("#feedbackbox-message").show();
if($("#feedbackbox-topic").val()=="howto"){$("#feedbackbox-faq").show();}else{if($("#feedbackbox-topic").val()=="feature"){$("#feedbackbox-feature-request").show();
$("#feedbackbox-subject").hide();$("#feedbackbox-message").hide();}}});$("#feedbackbox-send").click(function(){if($("#feedbackbox-email").is(":visible")){var K=$("#feedback-form").validate().element("#feedbackbox-email");
if(K){A.sendFeedbackEmail();}}else{A.sendFeedbackEmail();}});$("#feedbackbutton").click(function(){A.showFeedback();
});$("#footer-support-link").on("click",function(){A.showFeedback();return false;});$("#uservoicelinks a").click(function(){A.hideModal();
return true;});$("#feedbackemails a").each(function(){var K=$(this);K.attr("href","mailto:"+K.attr("href")+"@etherpad.com");
});if(J.length){$("#feedback-form").validate({rules:{"feedbackbox-email":{required:true,email:true}},errorPlacement:function(K,L){K.prependTo(L.parent());
},submitHandler:function(K){modals.submitModal(K);}});}},initShareBox:function(){$("#nootherusers a").click(A.showShareBox);
$("#sharebutton").click(padfacebook.publishPad);},getDefaultShareBoxMessageForName:function(J){return(J||"Somebody")+" has shared an EtherPad document with you.\n\nView it here:\n\n"+padutils.escapeHtml($("#sharebox-url").val()+"\n");
},getDefaultShareBoxSubjectForName:function(J){return(J||"Somebody")+" invited you to an EtherPad document";
},relayoutWithBottom:function(J){$("#modaloverlay").height(J);$("#sharebox").css("left",Math.floor(($(window).width()-$("#sharebox").outerWidth())/2));
$("#feedbackbox").css("left",Math.floor(($(window).width()-$("#feedbackbox").outerWidth())/2));},showFeedback:function(){A.showModal("#feedbackbox");
},showShareBox:function(){A.showModal("#sharebox",500);},showModal:function(J,L,K){modals.showModal(J,L,K);
},hideModal:function(J){padutils.cancelActions("hide-feedbackbox");padutils.cancelActions("hide-sharebox");
$("#sharebox-response").hide();modals.hideModal(J);},hideFeedbackLaterIfNoOtherInteraction:function(){return padutils.getCancellableAction("hide-feedbackbox",function(){A.hideModal();
});},hideShareboxLaterIfNoOtherInteraction:function(){return padutils.getCancellableAction("hide-sharebox",function(){A.hideModal();
});},sendFeedbackEmail:function(){if(D){return;}var L=$("#feedbackbox-message").val();var J=$("#feedbackbox-topic").val();
var K=$("#feedbackbox-subject").val();if(!L||!J||!K){$("#feedbackbox-response").text("Please choose out a topic and fill out all the fields.").get(0).className="badresponse";
$("#feedbackbox-response").show();return;}var O=($("#feedbackbox-email").hasClass("editempty")?"":$("#feedbackbox-email").val());
var R=typeof(pad)!="undefined"&&pad.getPadId();var M=typeof(pad)!="undefined"&&pad.getUserName();B(true);
$("#feedbackbox-response").text("Sending...").get(0).className="";$("#feedbackbox-response").show();$.ajax({type:"post",url:"/ep/pad/feedback",data:{feedback:L,padId:R,username:M,email:O,topic:J,subject:K},success:Q,error:P});
var N=A.hideFeedbackLaterIfNoOtherInteraction();function Q(S){B(false);F();$("#feedbackbox-response").text("Thanks for your feedback").get(0).className="goodresponse";
$("#feedbackbox-response").show();window.setTimeout(function(){$("#feedbackbox-response").fadeOut("slow",function(){N();
});},300);}function P(S){B(false);$("#feedbackbox-response").text("Could not send feedback.  Please email us at support@hackpad.com instead.").get(0).className="badresponse";
$("#feedbackbox-response").show();}},sendInvite:function(){if(C){return;}if(!pad.isFullyConnected()){J("Error: Connection to the server is down or flaky.");
return;}var O=$("#sharebox-message").val();if(!O){J("Please enter a message body before sending.");return;
}var Q=($("#sharebox-to").hasClass("editempty")?"":$("#sharebox-to").val())||"";var L=Q.match(/[^\s,:;<>\"\'\/\(\)\[\]{}]+/g)||[];
if(L.length==0){J('Please enter at least one "To:" address.');$("#sharebox-to").focus().select();return;
}for(var M=0;M<L.length;M++){var N=L[M];if(!N.match(/^[\w\.\_\+\-]+\@[\w\_\-]+\.[\w\_\-\.]+$/)){J('"'+padutils.escapeHtml(N)+'" does not appear to be a valid email address.');
return;}}var K=$("#sharebox-subject").val();if(!K){K=A.getDefaultShareBoxSubjectForName(pad.getUserName());
$("#sharebox-subject").val(K);}var U=pad.getPadId();var P=pad.getUserName();E(true);$("#sharebox-response").text("Sending...").get(0).className="";
$("#sharebox-response").show();$.ajax({type:"post",url:"/ep/pad/emailinvite",data:{message:O,toEmails:L.join(","),subject:K,username:P,padId:U},success:T,error:S});
var R=A.hideShareboxLaterIfNoOtherInteraction();function T(V){E(false);$("#sharebox-response").text("Email invitation sent!").get(0).className="goodresponse";
$("#sharebox-response").show();window.setTimeout(function(){$("#sharebox-response").fadeOut("slow",function(){R();
});},1500);}function S(V){B(false);$("#sharebox-response").text("An error occurred; no email was sent.").get(0).className="badresponse";
$("#sharebox-response").show();}function J(V){$("#sharebox-response").text(V).get(0).className="badresponse";
$("#sharebox-response").show();}}};return A;}());$(".hp-ui-button-menu-wrapper a").on("click",function(){if($(this).hasClass("hp-ui-button-menu-disabled")){return;
}var A=$(this).closest(".hp-ui-button");A.find(".hp-ui-button-menuitem-selected").removeClass("hp-ui-button-menuitem-selected");
buttonCloseMenu(A);});var buttonCloseMenu=function(A){$("body").off(".hp-ui-button-menu");A.find(".hp-ui-button-menu-wrapper").hide();
A.removeClass("hp-ui-button-active");A.find(".hp-ui-button-menuitem-selected").removeClass("hp-ui-button-menuitem-selected");
A.trigger("menu-closed");};$(".hp-ui-button-menu").on("click",function(){var A=$(this);if(A.attr("disabled")){return;
}$("#tooltip").remove();var G=A.hasClass("hp-ui-button-menu-reverse");var D=A.find(".hp-ui-button-menu-wrapper");
var B=A.find(".hp-ui-button-list-ul");var E=A.find(".hp-ui-button-list-ul li");var C=-1;A.data("close",buttonCloseMenu);
if(D.is(":visible")){buttonCloseMenu(A);}else{B.css("min-width",A.outerWidth()+"px");D.show();A.addClass("hp-ui-button-active");
var F=Math.max(200,Math.min($("body").height()-B.offset().top-50,435));B.css("max-height",F+"px");G&&B.css("top","-"+(B.outerHeight()+A.outerHeight()+10)+"px");
window.setTimeout(function(){$("body").on("keydown.hp-ui-button-menu",function(H){if(D.is(":hidden")){return true;
}var I=C;switch(H.keyCode){case 13:B.find("li.hp-ui-button-menuitem-selected > a").trigger("click");return false;
case 27:buttonCloseMenu(A);return false;case 38:C=C-1<0?E.length-1:C-1;break;case 40:C=(C+1)%E.length;
break;default:return true;}B.find("li:nth-child("+(I+1)+")").removeClass("hp-ui-button-menuitem-selected");
B.find("li:nth-child("+(C+1)+")").addClass("hp-ui-button-menuitem-selected");return false;}).on("click.hp-ui-button-menu",function(){buttonCloseMenu(A);
});},0);}});
/* jquery-textcomplete - v0.1.0 - 2013-11-22
 * https://github.com/yuku-t/jquery-textcomplete
 * Copyright (c) 2013-2014 Yuku Takahashi
 * Available via the MIT license.
 */
!function(A){var J=function(M){var L,K;
return L=function(){K=!1;},function(){var N;K||(K=!0,N=I(arguments),N.unshift(L),M.apply(this,N));};},I=function(L){var K;
return K=Array.prototype.slice.call(L);},B=function(K,L){return K.bind?K.bind(L):function(){K.apply(L,arguments);
};},H=function(){var K;return K=A("<div></div>").css(["color"]).color,"undefined"!=typeof K?function(M,L){return M.css(L);
}:function(M,N){var L;return L={},A.each(N,function(P,O){L[O]=M.css(O);}),L;};}(),G=function(K){return K;
},F=function(L){var K={};return function(M,N){K[M]?N(K[M]):L.call(this,M,function(O){K[M]=(K[M]||[]).concat(O),N.apply(null,arguments);
});};},E=function(K,M){var L,N;if(K.indexOf){return -1!=K.indexOf(M);}for(L=0,N=K.length;N>L;L++){if(K[L]===M){return !0;
}}return !1;},D=function(){function O(R,U){var T,Q,S;Q=M.clone(),this.el=R.get(0),this.$el=R,T=P(this.$el),S=this.el===document.activeElement,this.$el.wrap(T).before(Q),S&&this.el.focus(),this.listView=new C(Q,this),this.strategies=U,this.$el.on("keyup",B(this.onKeyup,this)),this.$el.on("keydown",B(this.listView.onKeydown,this.listView)),A(document).on("click",B(function(V){V.originalEvent&&!V.originalEvent.keepTextCompleteDropdown&&this.listView.deactivate();
},this));}var L,K,N,M;L={wrapper:'<div class="textcomplete-wrapper"></div>',list:'<ul class="dropdown-menu"></ul>'},K={wrapper:{position:"relative"},list:{position:"absolute",top:0,left:0,zIndex:"100",display:"none"}},N=A(L.wrapper).css(K.wrapper),M=A(L.list).css(K.list),A.extend(O.prototype,{renderList:function(Q){this.clearAtNext&&(this.listView.clear(),this.clearAtNext=!1),Q.length&&(this.listView.shown||(this.listView.setPosition(this.getCaretPosition()).clear().activate(),this.listView.strategy=this.strategy),Q=Q.slice(0,this.strategy.maxCount),this.listView.render(Q)),!this.listView.data.length&&this.listView.shown&&this.listView.deactivate();
},searchCallbackFactory:function(R){var Q=this;return function(T,S){Q.renderList(T),S||(R(),Q.clearAtNext=!0);
};},onKeyup:function(){var Q,R;if(Q=this.extractSearchQuery(this.getTextFromHeadToCaret()),Q.length){if(R=Q[1],this.term===R){return;
}this.term=R,this.search(Q);}else{this.term=null,this.listView.deactivate();}},onSelect:function(T){var R,S,Q;
R=this.getTextFromHeadToCaret(),S=this.el.value.substring(this.el.selectionEnd),Q=this.strategy.replace(T),A.isArray(Q)&&(S=Q[1]+S,Q=Q[0]),R=R.replace(this.strategy.match,Q),this.$el.val(R+S),this.el.focus(),this.el.selectionStart=this.el.selectionEnd=R.length;
},getCaretPosition:function(){if(0!==this.el.selectionEnd){var T,U,Q,S,R;return T=["border-width","font-family","font-size","font-style","font-variant","font-weight","height","letter-spacing","word-spacing","line-height","text-decoration","text-align","width","padding-top","padding-right","padding-bottom","padding-left","margin-top","margin-right","margin-bottom","margin-left"],U=A.extend({position:"absolute",overflow:"auto","white-space":"pre-wrap",top:0,left:-9999},H(this.$el,T)),Q=A("<div></div>").css(U).text(this.getTextFromHeadToCaret()),S=A("<span></span>").text("&nbsp;").appendTo(Q),this.$el.before(Q),R=S.position(),R.top+=S.height()-this.$el.scrollTop(),Q.remove(),R;
}},getTextFromHeadToCaret:function(){var S,R,Q;return R=this.el.selectionEnd,"number"==typeof R?S=this.el.value.substring(0,R):document.selection&&(Q=this.el.createTextRange(),Q.moveStart("character",0),Q.moveEnd("textedit"),S=Q.text),S;
},extractSearchQuery:function(U){var Q,T,R,S;for(Q=0,T=this.strategies.length;T>Q;Q++){if(R=this.strategies[Q],S=U.match(R.match)){return[R,S[R.index]];
}}return[];},search:J(function(S,Q){var R;this.strategy=Q[0],R=Q[1],this.strategy.search(R,this.searchCallbackFactory(S));
})});var P=function(Q){return N.clone().css("display",Q.css("display"));};return O;}(),C=function(){function K(M,L){this.$el=M,this.index=0,this.completer=L,this.$el.on("click","li.textcomplete-item",B(this.onClick,this));
}return A.extend(K.prototype,{shown:!1,render:function(O){var L,N,Q,P,M;for(L="",N=0,Q=O.length;Q>N&&(M=O[N],E(this.data,M)||(P=this.data.length,this.data.push(M),L+='<li class="textcomplete-item" data-index="'+P+'"><a>',L+=this.strategy.template(M),L+="</a></li>",this.data.length!==this.strategy.maxCount));
N++){}this.$el.append(L),this.data.length?this.activateIndexedItem():this.deactivate();},clear:function(){return this.data=[],this.$el.html(""),this.index=0,this;
},activateIndexedItem:function(){this.$el.find(".active").removeClass("active"),this.getActiveItem().addClass("active");
},getActiveItem:function(){return A(this.$el.children().get(this.index));},activate:function(){return this.shown||(this.$el.show(),this.shown=!0),this;
},deactivate:function(){return this.shown&&(this.$el.hide(),this.shown=!1,this.data=this.index=null),this;
},setPosition:function(L){return this.$el.css(L),this;},select:function(L){this.completer.onSelect(this.data[L]),this.deactivate();
},onKeydown:function(L){this.shown&&(27===L.keyCode?this.deactivate():38===L.keyCode?(L.preventDefault(),0===this.index?this.index=this.data.length-1:this.index-=1,this.activateIndexedItem()):40===L.keyCode?(L.preventDefault(),this.index===this.data.length-1?this.index=0:this.index+=1,this.activateIndexedItem()):(13===L.keyCode||9===L.keyCode)&&(L.preventDefault(),this.select(parseInt(this.getActiveItem().data("index")))));
},onClick:function(M){var L=A(M.target);M.originalEvent.keepTextCompleteDropdown=!0,L.hasClass("textcomplete-item")||(L=L.parents("li.textcomplete-item")),this.select(parseInt(L.data("index")));
}}),K;}();A.fn.textcomplete=function(M){var L,N,K;for(L=0,N=M.length;N>L;L++){K=M[L],K.template||(K.template=G),null==K.index&&(K.index=2),K.cache&&(K.search=F(K.search)),K.maxCount||(K.maxCount=10);
}return new D(this,M),this;};}(window.jQuery||window.Zepto);
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(window).bind("load",function(){getCollabClient.windowLoaded=true;
});function getCollabClient(AO,D,d,R,AV){var F=AO;var G=D.rev;var o=D.padId;var x=D.globalPadId;var E="IDLE";
var T;var AA;var J="CONNECTING";var Y=null;var f=false;var P=0;var v=0;var AF=0;var I=d.userId;var m;
var l;var B;var C={};var V={};var Q={};C[I]=d;Q[I]=d;var M=[];var j=0;var w=[];var AB=[];var AD=[];var N=[];
var r=0;AE(D.historicalAuthorData);c(d);var A={onUserJoin:function(){},onUserLeave:function(){},onUserKill:function(){},onUpdateUserInfo:function(){},onUserSiteJoin:function(){},onUpdateUserSiteInfo:function(){},onUserSiteLeave:function(){},onUserEdited:function(){},onGroupJoin:function(){},onGroupRemove:function(){},onUpdateGroupInfo:function(){},onChannelStateChange:function(){},onClientMessage:function(){},onInternalAction:function(){},onConnectionTrouble:function(){},onServerMessage:function(){},onSiteToClientMessage:function(){},onModeratedPadEdited:function(){}};
$(window).bind("unload",function(){if(B){B.onclosed=function(){};B.onhiccup=function(){};B.disconnect(true);
}});if($.browser.mozilla){$(window).bind("keydown",function(Af){if(Af.which==27){Af.preventDefault();
}});}F.setProperty("userAuthor",I);F.setBaseAttributedText({text:unescape(D.initialAttributedText.text),attribs:D.initialAttributedText.attribs},D.apool);
F.setUserChangeNotificationCallback(O("handleUserChanges",X));if(D.missedChanges){F.callWithAce(function(Ah){var Ai=Ah.getRep();
var Af;var Ag;if(D.missedChanges.committedChangeset){E="COMMITTING";l=D.missedChanges.committedChangesetSocketId;
Af=D.missedChanges.committedChangeset;Ag=(new AttribPool()).fromJsonable(D.missedChanges.committedChangesetAPool);
Af=Changeset.moveOpsToNewPool(Af,Ag,Ai.apool);Ah.performDocumentApplyChangeset(Af);AI();}if(D.missedChanges.furtherChangeset){Af=D.missedChanges.furtherChangeset;
Ag=(new AttribPool()).fromJsonable(D.missedChanges.furtherChangesetAPool);Af=Changeset.moveOpsToNewPool(Af,Ag,Ai.apool);
Ah.performDocumentApplyChangeset(Af);}},"applyMissedChanges",true);}function s(Af){H("abandoning connect "+Af);
if(B){B.onclosed=function(){};B.onhiccup=function(){};B.disconnect();}B=null;K("DISCONNECTED",Af);}function t(Af){H(Af);
window.onfreakout&&window.onfreakout(Af);}function H(Af){if(typeof window.ajlog=="string"){window.ajlog+=Af+"\n";
}N.push(Af);}var W=0;function U(Af){W=setTimeout(O("setTimeout(handleUserChanges)",X),Af);}function X(){H("handling user changes");
if(W){clearTimeout(W);W=0;}f=true;if(clientVars.userIsGuest){if(top.location.pathname=="/"){return;}if(!padutils.getIsMobile()&&clientVars.padId=="REeiTgQKman"){$("body").addClass("guestbanner");
$("#guestbanner #guest-banner-msg").html('Your changes are not being saved. <a href="#">Sign In</a> to start using Hackpad.').effect("pulsate",{times:1},500,function(){$(this).stop(true);
}).click(function(){modals.showModal("#page-login-box",0);return false;});}else{modals.showHTMLModal($("#page-login-box"));
}return;}if((!B)||J=="CONNECTING"){if(J=="CONNECTING"&&v&&(((+new Date())-v)>20000)){s("initsocketfail");
}else{if(E=="IDLE"){E="WAITING";A.onInternalAction("userChangesBeforeConnected");}U(1000);}return;}var Af=(+new Date());
if(E=="COMMITTING"){if(Af-P>45000){H("slow commit: disconnecting");Y="slowcommit";B.disconnect();}else{if(Af-P>5000){A.onConnectionTrouble("SLOW");
U(P+45000-Af);}else{U(3000);}}return;}if(!o){if(E=="IDLE"){E="WAITING";A.onInternalAction("userChangesBeforePadId");
}return;}f=false;var Ag=P+500;if(Af<Ag){U(Ag-Af);return;}H("performing commit");if(AI()){P=Af;AA=m;S(T);
A.onInternalAction("commitPerformed");U(3000);}}function AI(){var Af=F.prepareUserChangeset();if(!Af.changeset){return false;
}E="COMMITTING";T={type:"USER_CHANGES",baseRev:G,changeset:Af.changeset,apool:Af.apool};return true;}function AK(){var Af={};
Af.screen=[$(window).width(),$(window).height(),window.screen.availWidth,window.screen.availHeight,window.screen.width,window.screen.height].join(",");
Af.ip=D.clientIp;Af.useragent=D.clientAgent;return Af;}function AJ(){var Af={type:"CLIENT_READY",roomType:"padpage",roomName:"padpage/"+x,data:{lastRev:G,userInfo:C[I],stats:AK()}};
if(l){Af.data.isReconnectOf=l;Af.data.isCommitPending=(E=="COMMITTING");if(Af.data.isCommitPending){P=(+new Date())-1;
}}S(Af);AL();if(f){X();}}function a(Ag){var Af=false;if(AV){return;}Z("setUpSocket",function(){Y=null;
l=m;m=String(Math.floor(Math.random()*1000000000000));B=new EtherpadWebSocket(m,o);B.onmessage=O("socket.onmessage",AZ);
B.onclosed=O("socket.onclosed",AN);B.onopen=O("socket.onopen",function(){n=0;j=0;K("CONNECTED");if(o){AJ();
}});B.onhiccup=O("socket.onhiccup",Ae);B.onlogmessage=H;B.connectLite=Ag;B.connect();Af=true;});if(Af){v=+new Date();
}else{s("initsocketfail");}}function AG(){if(getCollabClient.windowLoaded){a();}else{setTimeout(AG,200);
}}setTimeout(AG,0);function AU(){if(J=="DISCONNECTED"){K("CONNECTING");a();}}function AX(Ag,Af){o=Ag;
x=Af;if(J=="CONNECTED"){AJ();}}var n=0;function Ae(Af){H("HICCUP (connected:"+(!!Af.connected)+")");var Ag=Af.connected;
if(!Ag){n++;if(n>1){K("RECONNECTING");}}else{n=0;K("CONNECTED");}}function S(Af){if(!B){H("Can't sendMessage without a socket!");
return;}B.postMessage(JSON.stringify({type:"COLLABROOM",data:Af}));AF=+(new Date());r=B.getLastReceivedSeqNumber();
}function O(Af,Ag){return function(){try{return Ag.apply(this,Array.prototype.slice.call(arguments));
}catch(Ah){w.push(Ah);AB.push(Af);AD.push(+new Date());throw Ah;}};}function Z(Af,Ag){try{O(Af,Ag)();
}catch(Ah){}}function AZ(Am){if(!B){return;}if(!Am.data){return;}var Al=JSON.parse(Am.data);if(Al.type!="COLLABROOM"){return;
}var Af=Al.data;if(Af.type=="NEW_CHANGES"){var Ai=Af.newRev;var An=Af.changeset;var Ak=(Af.author||"");
var Ao=Af.apool;if(Ai!=(G+1)){t("bad message revision on NEW_CHANGES: "+Ai+" not "+(G+1));B.disconnect();
return;}G=Ai;F.applyChangesToBase(An,Ak,Ao);if(Ak!=""){Z("onUserEdited",function(){A.onUserEdited(C[Ak],An);
});}}else{if(Af.type=="ACCEPT_COMMIT"){var Ai=Af.newRev;if(Ai!=(G+1)){t("bad message revision on ACCEPT_COMMIT: "+Ai+" not "+(G+1));
B.disconnect();return;}G=Ai;F.applyPreparedChangesetToBase();AC();Z("onInternalAction",function(){A.onInternalAction("commitAcceptedByServer");
});Z("onConnectionTrouble",function(){A.onConnectionTrouble("OK");});X();}else{if(Af.type=="NO_COMMIT_PENDING"){if(E=="COMMITTING"){AC();
X();}}else{if(Af.type=="USER_NEWINFO"){var Ag=Af.userInfo;var Ah=Ag.userId;if(C[Ah]){C[Ah]=Ag;A.onUpdateUserInfo(Ag);
L();}else{C[Ah]=Ag;A.onUserJoin(Ag);L();}c(Ag);}else{if(Af.type=="USER_SITE_NEWINFO"){var Ag=Af.userInfo;
var Ah=Ag.userId;if(Q[Ah]){Q[Ah]=Ag;A.onUpdateUserSiteInfo(Ag);}else{Q[Ah]=Ag;A.onUserSiteJoin(Ag);}}else{if(Af.type=="EDITOR_NEWINFO"){var Ag=Af.userInfo;
var Ah=Ag.userId;c(Ag);}else{if(Af.type=="USER_LEAVE"){var Ag=Af.userInfo;var Ah=Ag.userId;if(C[Ah]){delete C[Ag.userId];
AT(Ag);A.onUserLeave(Ag);L();}}else{if(Af.type=="USER_SITE_LEAVE"){var Ag=Af.userInfo;var Ah=Ag.userId;
if(Q[Ah]){delete Q[Ag.userId];A.onUserSiteLeave(Ag);}}else{if(Af.type=="USER_KILL"){var Ag=Af.userInfo;
delete C[Ag.userId];A.onUserKill(Ag);L();}else{if(Af.type=="GROUP_REMOVEPAD"){var Ag=Af.userInfo;var Aj=Ag.groupId;
if(V[Aj]){delete V[Aj];}A.onGroupRemove(Ag);L();}else{if(Af.type=="GROUP_NEWINFO"){var Ag=Af.userInfo;
var Aj=Ag.groupId;if(V[Aj]){V[Aj]=Ag;A.onUpdateGroupInfo(Ag);L();}else{V[Aj]=Ag;A.onGroupJoin(Ag);L();
}}else{if(Af.type=="DISCONNECT_REASON"){Y=Af.reason;switch(Y){case"unauth":modals.showModal("#page-login-box",0);
break;case"invalidrev":t("bad message revision on CLIENT_READY: "+G);break;default:break;}}else{if(Af.type=="MODERATION_MESSAGE"){A.onModeratedPadEdited();
}else{if(Af.type=="CLIENT_MESSAGE"){A.onClientMessage(Af.payload);}else{if(Af.type=="SERVER_MESSAGE"){A.onServerMessage(Af.payload);
}else{if(Af.type=="SITE_TO_CLIENT_MESSAGE"){A.onSiteToClientMessage(Af.payload);}else{if(Af.type=="SITE_MESSAGE"){A.onSiteMessage(Af.payload);
}}}}}}}}}}}}}}}}}}function AM(Af){Af.userId=I;C[I]=Af;c(Af);if(!B){return;}S({type:"USERINFO_UPDATE",userInfo:Af});
}function c(Af){u(Af.userId,Af.colorId,false,Af.name,Af.userLink);}function u(Ah,Af,Ak,Ag,Aj){if(Af||(typeof Af)=="number"){Af=Number(Af);
if(R&&R.colorPalette&&R.colorPalette[Af%R.colorPalette.length]){var Ai=R.colorPalette[Af%R.colorPalette.length];
if(Ak){F.setAuthorInfo(Ah,{bgcolor:Ai,name:Ag,userLink:Aj});}else{F.setAuthorInfo(Ah,{bgcolor:Ai,name:Ag,userLink:Aj});
}}}}function AT(Af){u(Af.userId,Af.colorId,true,Af.name,Af.userLink);}function AQ(){return Ac(C);}function AE(Ah){for(var Af in Ah){var Ag=Ah[Af];
if(!C[Af]){u(Af,Ag.colorId,true,Ag.name,Ag.userLink);}}}function L(){}function AN(Ag){B.onmessage=function(){};
B.onclosed=function(){};B.onopen=function(){};B.onhiccup=function(){};B.onlogmessage=function(An){H("(closed) "+An);
};B=null;$.each(AP(C),function(){var An=String(this);if(An!=I){var Ao=C[An];delete C[An];A.onUserLeave(Ao);
L();}});var Af=Y||Ag.reason;var Al=Ag.reconnect;if(Al){M.push(+new Date());var Ai=8;var Ak=10000;if(M.length>=Ai&&((+new Date())-M[M.length-Ai])<Ak){K("DISCONNECTED","looping");
}else{K("RECONNECTING",Af);a();}}else{M.push(+new Date());var Aj=100;if(f||!Ag.reconnectLite||j>Aj){K("DISCONNECTED",Af);
}else{j+=1;K("RECONNECTING",Af);var Ah=Math.min(30000,1000*Math.pow(2,j+1));var Am=p(Ah,0.4*Ah);setTimeout(function(){a(true);
},Am);M=M.slice(0,50);}}}function K(Af,Ag){H("Channel state being set to "+Af);if(Af!=J){J=Af;A.onChannelStateChange(J,Ag);
}}function AP(Ag){var Af=[];$.each(Ag,function(Ah,Ai){Af.push(Ah);});return Af;}function Ac(Ag){var Af=[];
$.each(Ag,function(Ai,Ah){Af.push(Ah);});return Af;}var h=[];function AW(Ag,Af){return function(){var Aj=this;
var Ai=arguments;function Ah(){Ag.apply(Aj,Ai);}Ah.tag=Af;if(J=="CONNECTING"){h.push(Ah);}else{Ah();}};
}function AL(Ai){var Ah=[];for(var Ag=0;Ag<h.length;Ag++){var Af=h[Ag];if((!Ai)||(Ai==Af.tag)){Af();}else{Ah.push(Af);
}}h=Ah;}function Ab(Af){S({type:"CLIENT_MESSAGE",payload:Af});}function AR(){return G;}function AS(){return E=="COMMITTING"||E=="WAITING"||W;
}function Ad(){var Ao=3;var Am=3;var Aj=50;var An=500;function Ah(Ap){return String(Ap).substring(0,An);
}var Af={errors:{length:0}};function Al(Ap,At,As){var Aq={catcher:At};if(As){Aq.time=As;}try{if(Ap.description){Aq.description=Ap.description;
}}catch(Ar){}try{if(Ap.fileName){Aq.fileName=Ap.fileName;}}catch(Ar){}try{if(Ap.lineNumber){Aq.lineNumber=Ap.lineNumber;
}}catch(Ar){}try{if(Ap.message){Aq.message=Ap.message;}}catch(Ar){}try{if(Ap.name){Aq.name=Ap.name;}}catch(Ar){}try{if(Ap.number){Aq.number=Ap.number;
}}catch(Ar){}try{if(Ap.stack){Aq.stack=Ah(Ap.stack);}}catch(Ar){}Af.errors[Af.errors.length]=Aq;Af.errors.length++;
}for(var Ag=0;((Ag<w.length)&&(Ag<Ao));Ag++){Al(w[Ag],AB[Ag],AD[Ag]);}if(F){var Ak=F.getUnhandledErrors();
for(var Ag=0;((Ag<Ak.length)&&(Ag<Am));Ag++){var Ai=Ak[Ag];Al(Ai.error,"ACE",Ai.time);}}Af.time=+new Date();
Af.collabState=E;Af.channelState=J;Af.lastCommitTime=P;Af.numSocketReconnects=M.length;Af.userId=I;Af.currentRev=G;
Af.participants=(function(){var Ap=[];for(var Aq in C){Ap.push(Aq);}return Ap.join(",");})();if(N.length>Aj){N=N.slice(N.length-Aj,N.length);
}Af.debugMessages={length:0};for(var Ag=0;Ag<N.length;Ag++){Af.debugMessages[Ag]=Ah(N[Ag]);Af.debugMessages.length++;
}return Af;}function AY(){var Af={};Af.userInfo=C[I];Af.baseRev=G;if(E=="COMMITTING"&&T){Af.committedChangeset=T.changeset;
Af.committedChangesetAPool=T.apool;Af.committedChangesetSocketId=AA;}var Ag=F.userChangesetForWire();
if(Ag.changeset){Af.furtherChangeset=Ag.changeset;Af.furtherChangesetAPool=Ag.apool;}return Af;}function AC(){E="IDLE";
A.onInternalAction("newlyIdle");z();}function y(Af){q.push(Af);z();}var q=[];function z(){setTimeout(function(){if(E=="IDLE"){while(q.length>0){var Af=q.shift();
Af();}}},0);}function p(Ag,Af){return Ag+Math.floor((Math.random()*(2*Af+1))-Af);}var b=p(1000*60*10,1000*60*2);
function AH(){var Af=B&&B.getLastReceivedSeqNumber()||0;var Ag=+(new Date());if((Af>r)&&((Ag-AF)>(b-1000))){y(function(){S({type:"FLUSH_MESSAGE"});
r=Af;});}b=p(1000*60*10,1000*60*2);window.setTimeout(AH,b);}window.setTimeout(AH,b);var Aa;return(Aa={setOnUserJoin:function(Af){A.onUserJoin=Af;
},setOnUserLeave:function(Af){A.onUserLeave=Af;},setOnUserKill:function(Af){A.onUserKill=Af;},setOnUpdateUserInfo:function(Af){A.onUpdateUserInfo=Af;
},setOnUserSiteJoin:function(Af){A.onUserSiteJoin=Af;},setOnUserSiteLeave:function(Af){A.onUserSiteLeave=Af;
},setOnUpdateUserSiteInfo:function(Af){A.onUpdateUserSiteInfo=Af;},setOnUserEdited:function(Af){A.onUserEdited=Af;
},setOnGroupJoin:function(Af){A.onGroupJoin=Af;},setOnGroupRemove:function(Af){A.onGroupRemove=Af;},setOnUpdateGroupInfo:function(Af){A.onUpdateGroupInfo=Af;
},setOnChannelStateChange:function(Af){A.onChannelStateChange=Af;},setOnClientMessage:function(Af){A.onClientMessage=Af;
},setOnModeratedPadEdited:function(Af){A.onModeratedPadEdited=Af;},setOnInternalAction:function(Af){A.onInternalAction=Af;
},setOnConnectionTrouble:function(Af){A.onConnectionTrouble=Af;},setOnServerMessage:function(Af){A.onServerMessage=Af;
},setOnSiteToClientMessage:function(Af){A.onSiteToClientMessage=Af;},setOnSiteMessage:function(Af){A.onSiteMessage=Af;
},updateUserInfo:AW(AM),getConnectedUsers:AQ,sendClientMessage:Ab,getCurrentRevisionNumber:AR,getDiagnosticInfo:Ad,hasUncommittedChanges:AS,getMissedChanges:AY,callWhenNotCommitting:y,addHistoricalAuthors:AE,reconnect:AU,pause:function(){A.onChannelStateChange=function(){};
s("paused");},setPadId:AX});}function selectElementContents(C){if($.browser.msie){var A=document.body.createTextRange();
A.moveToElementText(C);A.select();}else{if(window.getSelection){var B=window.getSelection();if(B){var A=document.createRange();
A.selectNodeContents(C);B.removeAllRanges();B.addRange(A);}}}}(function(A){A.fn.extend({customStyle:function(B){if(!A.browser.msie||(A.browser.msie&&A.browser.version>6)){return this.each(function(){var D=A(this).find(":selected");
A(this).after('<span class="customStyleSelectBox"><span class="customStyleSelectBoxInner">'+D.text()+"</span></span>").css({position:"absolute",opacity:0,fontSize:A(this).next().css("font-size")});
var C=A(this).next();var G=parseInt(A(this).width())-parseInt(C.css("padding-left"))-parseInt(C.css("padding-right"));
var F=C.find(":first-child");C.css({display:"inline-block"});var E=parseInt(C.height())+parseInt(C.css("padding-top"))+parseInt(C.css("padding-bottom"))+3;
A(this).height(E).change(function(){F.text(A(this).find(":selected").text()).parent().addClass("changed");
});});}}});})(jQuery);toISOString=function(A){function B(D){return D<10?"0"+D:D;}function C(D){if(D<100){D="0"+D;
}if(D<10){D="0"+D;}return D;}return A.getUTCFullYear()+"-"+B(A.getUTCMonth()+1)+"-"+B(A.getUTCDate())+"T"+B(A.getUTCHours())+":"+B(A.getUTCMinutes())+":"+B(A.getUTCSeconds())+"."+C(A.getUTCMilliseconds())+"Z";
};var hints=function(){function B(E,F,D){var C=D||2000;setTimeout(function(){A(E,F);},C);}function A(F,J){var D=$(F).offset();
if(!D){return;}var I='		  <div class="tip">		    <div class="arrow-top-left">		      <div class="arrow-up-border"></div>		      <div class="arrow-up"></div>		    </div>		    <div class="tip-box">'+J+"</div>		  </div>";
var C=$(I);$("body").append(C);var G=$(C).find(".arrow-top-left");C.css({top:D.top+$(F).height()+G.height()+2,left:D.left-G.position().left+5,display:"none"}).fadeIn();
function E(){H();}function H(){C.fadeOut(function(){C.remove();});$("body").unbind("click",E);}setTimeout(H,4000);
$("body").click(E);}return{showHint:B};}();(function(A){A.fn.invite=function(C){var B={target:"Pad",recentUsers:[],recentGroups:[],minChars:0,inviteItemHandlers:{},width:navigator.userAgent.match(/iPad/i)!=null?"120px":"177px",dataURL:"/ep/invite/autocomplete",prompt:undefined,createCollection:false};
return this.each(function(){if(C){A.extend(B,C);}var D=A(this);function E(H){if(!D.val()){var H=[];if(B.createCollection){this.resultsClass+=" ac-results-collections";
A("#collections-recent-list li").each(function(S,R){H.push({data:["<span>"+A(R).text()+"</span>","",A(R).attr("groupid"),"hpgroup"],result:"",value:""});
});}else{if(B.prompt){H=[{data:["<span style='font-style: italic; color: grey;' class='placeholder'>"+B.prompt+"</span>",null,null,null],value:"",result:""}];
}}if(B.recentUsers.length>0||B.recentGroups.length>0){H.push({data:["<hr class='placeholder'/>",null,null,null],value:"",result:""});
}H=H.concat(B.recentUsers.slice(0,3).map(function(R){return{data:["<span style=''>"+R.fullName+"</span>",null,R.id,"hp"],value:R.fullName,result:""};
}));var P=function(S,R){return R.timestamp-S.timestamp;};H=H.concat(B.recentGroups.sort(P).slice(0,3).map(function(R){return{data:["<span style=''>"+R.name+" <span style='color: grey;'>("+R.userCnt+")</span></span>",null,R.groupId,"hpgroup"],value:R.name,result:""};
}));return H;}else{if(D.val().indexOf("@")>-1){var I=[];var M=D.val().split(",");for(var K=0;K<M.length;
K++){var Q=/"?([^"]*)"?\s+<([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>/i;var J=M[K].match(Q);if(J){I.push(J[2]);
}else{var O=/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})\b/i;var J=M[K].match(O);if(J){I.push(J[1]);}}}var N=padutils.escapeHtml(D.val());
if(I.length>1){N=I.length+" people";}return[{data:["<img src='"+location.protocol+"//mail.google.com/favicon.ico' style='float: right;' width='16' height='16'/><span style=''>Invite "+N+"</span>",I.join(","),null,"typedemail"],value:D.val(),result:""}];
}else{if(B.createCollection){this.resultsClass+=" ac-results-collections";var L=D.val();var H=[];H.push({data:["<span><i class='icon-new ac-results-create-val-plus'></i> "+padutils.escapeHtml(L)+"</span>",L,null,"newgroup"],result:"",value:L});
return H;}}}return[];}function G(J){var L="";if(J.success){L=J.data;}else{modals.showHTMLModal(J.html);
A("input").blur();return[];}var I=[];var M=L.split("\n");var N={hp:"<img src='/favicon.ico' style='float: right;'/>",hpgroup:"",fb:"<img src='"+location.protocol+"//facebook.com/favicon.ico' style='float: right;'/>",email:"<img src='"+location.protocol+"//mail.google.com/favicon.ico' style='float: right;' width='16' height='16'/>"};
for(var K=0;K<M.length;K++){var H=A.trim(M[K]);if(H){H=H.split("|");I[I.length]={data:[N[H[2]]+'<span style="overflow: hidden; display: block; text-overflow: ellipsis;">'+H[0]+"</span>"].concat(H),value:H[0],result:""};
}}I=I.concat(E(L));return I;}D.closest("form").submit(function(H){H.preventDefault();return false;});
function F(L,I){var J={fb:"fbinvite",hp:"hpinvite",hpgroup:"groupinvite",email:"emailinviteautocomplete",typedemail:"emailinvite"};
if(I[3] in J){var K=1;if(I[3]=="typedemail"){K=I[1].split(",").length;}trackEvent("invited",null,null,{type:J[I[3]],count:K,target:B.target});
}var H=B.inviteItemHandlers[I[3]]||B.inviteItemHandlers["*"];if(!H){return;}if(H.callback){H.callback(I);
}else{if(H.url){D.addClass("ac_loading");A.post(H.url,H.argsCallback(I),function(M){D.removeClass("ac_loading");
if(typeof(M)=="object"&&"success" in M&&M.success==false){if(H.onFailure){H.onFailure(M);}}else{if(H.onSuccess){H.onSuccess(M);
}}});}}}D.autocomplete(B.dataURL,{max:50,parse:G,noCache:true,preparse:E,alwaysPreparse:true,minChars:B.minChars,width:B.width,selectFirst:true,extraParams:B.extraParams}).result(F);
});};})(jQuery);(function(F){var C=F.ajax,E={},A=[],B=[],D=[];F.ajax=function(G){G=jQuery.extend(G,jQuery.extend({},jQuery.ajaxSettings,G));
var H=G.port;switch(G.mode){case"abort":if(E[H]){E[H].abort();}return E[H]=C.apply(this,arguments);case"queue":var J=G.complete;
G.complete=function(){if(J){J.apply(this,arguments);}if(jQuery([C]).queue("ajax"+H).length>0){jQuery([C]).dequeue("ajax"+H);
}else{D[H]=false;}};jQuery([C]).queue("ajax"+H,function(){C(G);});if(jQuery([C]).queue("ajax"+H).length==1&&!D[H]){D[H]=true;
jQuery([C]).dequeue("ajax"+H);}return;case"sync":var I=A.length;A[I]={error:G.error,success:G.success,complete:G.complete,done:false};
B[I]={error:[],success:[],complete:[]};G.error=function(){B[I].error=arguments;};G.success=function(){B[I].success=arguments;
};G.complete=function(){B[I].complete=arguments;A[I].done=true;if(I==0||!A[I-1]){for(var K=I;K<A.length&&A[K].done;
K++){if(A[K].error){A[K].error.apply(jQuery,B[K].error);}if(A[K].success){A[K].success.apply(jQuery,B[K].success);
}if(A[K].complete){A[K].complete.apply(jQuery,B[K].complete);}A[K]=null;B[K]=null;}}};}return C.apply(this,arguments);
};})(jQuery);
/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */
(function(A){A.fn.extend({autocomplete:function(C,B){var D=typeof C=="string";
B=A.extend({},A.Autocompleter.defaults,{url:D?C:null,data:D?null:C,noCache:false,delay:D?A.Autocompleter.defaults.delay:10,max:B&&!B.scroll?10:150},B);
B.highlight=B.highlight||function(E){return E;};B.formatMatch=B.formatMatch||B.formatItem;return this.each(function(){new A.Autocompleter(this,B);
});},result:function(B){return this.bind("result",B);},enter:function(B){return this.bind("enter",B);
},search:function(B){return this.trigger("search",[B]);},flushCache:function(){return this.trigger("flushCache");
},setOptions:function(B){return this.trigger("setOptions",[B]);},unautocomplete:function(){return this.trigger("unautocomplete");
}});A.Autocompleter=function(F,B){var E={UP:38,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,COMMA:188,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8};
var D=A(F).attr("autocomplete","off").addClass(B.inputClass);var K;var I="";var M=A.Autocompleter.Cache(B);
var J=0;var Q;var U={mouseDownOnSelect:false};var C=A.Autocompleter.Select(B,F,S,U);var R;A.browser.opera&&A(F.form).bind("submit.autocomplete",function(){if(R){R=false;
return false;}});D.bind((A.browser.opera?"keypress":"keyup")+".autocomplete",function(Y){J=1;Q=Y.keyCode;
switch(Y.keyCode){case E.UP:Y.preventDefault();if(C.visible()){C.prev();}else{G(0,true);}break;case E.DOWN:Y.preventDefault();
if(C.visible()){C.next();}else{G(0,true);}break;case E.PAGEUP:Y.preventDefault();if(C.visible()){C.pageUp();
}else{G(0,true);}break;case E.PAGEDOWN:Y.preventDefault();if(C.visible()){C.pageDown();}else{G(0,true);
}break;case B.multiple&&A.trim(B.multipleSeparator)==","&&E.COMMA:case E.TAB:case E.RETURN:if(S()){Y.preventDefault();
R=true;return false;}else{D.trigger("enter",null);}break;case E.ESC:C.hide();break;default:clearTimeout(K);
if(B.preparse&&(!C.visible()||B.alwaysPreparse)){O(D.val(),B.preparse());}K=setTimeout(G,B.delay);break;
}}).focus(function(){J++;if(B.minChars==0){G(0,true);}}).blur(function(){J=0;if(!U.mouseDownOnSelect){X();
}}).click(function(){if(J++>1&&!C.visible()){G(0,true);}}).bind("search",function(){var Y=(arguments.length>1)?arguments[1]:null;
function Z(d,b){var a;if(b&&b.length){for(var c=0;c<b.length;c++){if(b[c].result.toLowerCase()==d.toLowerCase()){a=b[c];
break;}}}if(typeof Y=="function"){Y(a);}else{D.trigger("result",a&&[a.data,a.value]);}}A.each(H(D.val()),function(b,a){T(a,Z,Z);
});}).bind("flushCache",function(){M.flush();}).bind("setOptions",function(){A.extend(B,arguments[1]);
if("data" in arguments[1]){M.populate();}}).bind("unautocomplete",function(){C.unbind();D.unbind();A(F.form).unbind(".autocomplete");
});function S(j){var Y=C.selected();var f=Y.pos;var Y=Y.data;if(!Y){return false;}var Z=Y.result;I=Z;
if(B.multiple){var a=H(D.val());if(a.length>1){var d=B.multipleSeparator.length;var h=A(F).selection().start;
var c,b=0;A.each(a,function(l,m){b+=m.length;if(h<=b){c=l;return false;}b+=d;});a[c]=Z;Z=a.join(B.multipleSeparator);
}Z+=B.multipleSeparator;}D.val(Z);N();D.trigger("result",[Y.data,Y.value,f,j]);return true;}function G(a,Z){if(Q==E.DEL){C.hide();
return;}var Y=D.val();if(!Z&&Y==I){return;}I=Y;Y=L(Y);if(Y.length>=B.minChars){D.addClass(B.loadingClass);
if(!B.matchCase){Y=Y.toLowerCase();}if(B.preparse&&!C.visible()){O(Y,B.preparse());}T(Y,O,N);}else{P();
C.hide();}}function H(Y){if(!Y){return[""];}if(!B.multiple){return[A.trim(Y)];}return A.map(Y.split(B.multipleSeparator),function(Z){return A.trim(Y).length?A.trim(Z):null;
});}function L(Y){if(!B.multiple){return Y;}var Z=H(Y);if(Z.length==1){return Z[0];}var a=A(F).selection().start;
if(a==Y.length){Z=H(Y);}else{Z=H(Y.replace(Y.substring(a),""));}return Z[Z.length-1];}function W(Z,Y){if(B.autoFill&&(L(D.val()).toLowerCase()==Z.toLowerCase())&&Q!=E.BACKSPACE){D.val(D.val()+Y.substring(L(I).length));
A(F).selection(I.length,I.length+Y.length);}}function X(){clearTimeout(K);K=setTimeout(N,200);}function N(){var Y=C.visible();
C.hide();clearTimeout(K);P();if(B.mustMatch){D.search(function(a){if(!a){if(B.multiple){var Z=H(D.val()).slice(0,-1);
D.val(Z.join(B.multipleSeparator)+(Z.length?B.multipleSeparator:""));}else{D.val("");D.trigger("result",null);
}}});}}function O(Z,Y){if(Y&&Y.length&&J){P();C.display(Y,Z);W(Z,Y[0].value);C.show();}else{N();}}function T(Y,a,c){if(!Y){return;
}if(!B.matchCase){Y=Y.toLowerCase();}var Z=null;if(!B.noCache){Z=M.load(Y);}if(Z&&Z.length){a(Y,Z);}else{if((typeof B.url=="string")&&(B.url.length>0)){var b={timestamp:+new Date()};
A.each(B.extraParams,function(f,d){b[f]=typeof d=="function"?d():d;});A.ajax({mode:"abort",port:"autocomplete"+F.name,dataType:B.dataType,url:B.url,data:A.extend({q:L(Y),limit:B.max},b),success:function(f){var d=B.parse&&B.parse(f)||V(f);
M.add(Y,d);a(Y,d);}});}else{C.emptyList();c(Y);}}}function V(Z){if(Z.data){Z=Z.data;}var a=[];var c=Z.split("\n");
for(var b=0;b<c.length;b++){var Y=A.trim(c[b]);if(Y){Y=Y.split("|");a[a.length]={data:Y,value:Y[0],result:B.formatResult&&B.formatResult(Y,Y[0])||Y[0]};
}}return a;}function P(){D.removeClass(B.loadingClass);}};A.Autocompleter.defaults={inputClass:"ac_input",resultsClass:"ac_results",loadingClass:"ac_loading",minChars:1,delay:400,matchCase:false,minCountForSelect:1,matchSubset:true,matchContains:false,cacheLength:10,max:100,mustMatch:false,extraParams:{},selectFirst:true,formatItem:function(B){return B[0];
},formatMatch:null,autoFill:false,width:0,multiple:false,multipleSeparator:", ",highlight:function(C,B){return C.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+B.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>");
},scroll:true,scrollHeight:180};A.Autocompleter.Cache=function(B){var C={};var D=0;function I(J){return J.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");
}function H(J,L){if(!B.matchCase){J=J.toLowerCase();}var K=J.indexOf(L);if(B.matchContains=="word"){var M=I(L.toLowerCase());
K=J.toLowerCase().search("\\b"+M);}if(K==-1){return false;}return K==0||B.matchContains;}function G(J,K){if(D>B.cacheLength){E();
}if(!C[J]){D++;}C[J]=K;}function F(){if(!B.data){return false;}var K={},P=0;if(!B.url){B.cacheLength=1;
}K[""]=[];for(var L=0,Q=B.data.length;L<Q;L++){var J=B.data[L];J=(typeof J=="string")?[J]:J;var M=B.formatMatch(J,L+1,B.data.length);
if(M===false){continue;}var N=M.charAt(0).toLowerCase();if(!K[N]){K[N]=[];}var O={value:M,data:J,result:B.formatResult&&B.formatResult(J)||M};
K[N].push(O);if(P++<B.max){K[""].push(O);}}A.each(K,function(R,S){B.cacheLength++;G(R,S);});}setTimeout(F,25);
function E(){C={};D=0;}return{flush:E,add:G,populate:F,load:function(J){if(!B.cacheLength||!D){return null;
}if(!B.url&&B.matchContains){var K=[];for(var N in C){if(N.length>0){var M=C[N];A.each(M,function(P,O){if(H(O.value,J)){K.push(O);
}});}}return K;}else{if(C[J]){return C[J];}else{if(B.matchSubset){for(var L=J.length-1;L>=B.minChars;
L--){var M=C[J.substr(0,L)];if(M){var K=[];A.each(M,function(P,O){if(H(O.value,J)){K[K.length]=O;}});
return K;}}}}}return null;}};};A.Autocompleter.Select=function(B,K,R,M){var G={ACTIVE:"ac_over"};var C,D=-1,J,L="",N=true,F,E;
function S(){if(!N){return;}F=A("<div/>").hide().addClass(B.resultsClass).css("position","absolute").appendTo(document.body);
E=A("<ul/>").appendTo(F).mouseover(function(T){if(I(T).nodeName&&I(T).nodeName.toUpperCase()=="LI"){D=A("li",E).removeClass(G.ACTIVE).index(I(T));
if(!A(I(T)).children(".placeholder").length){A(I(T)).addClass(G.ACTIVE);}}}).click(function(T){A(I(T)).addClass(G.ACTIVE);
R(T);K.focus();return false;}).mousedown(function(){M.mouseDownOnSelect=true;}).mouseup(function(){M.mouseDownOnSelect=false;
});if(B.width>0){F.css("width",B.width);}N=false;}function I(U){var T=U.target;while(T&&T.tagName!="LI"){T=T.parentNode;
}if(!T){return[];}return T;}function H(V){C.slice(D,D+1).removeClass(G.ACTIVE);Q(V);var U=C.slice(D,D+1);
if(!U.children(".placeholder").length){U.addClass(G.ACTIVE);}if(B.scroll){var T=0;C.slice(0,D).each(function(){T+=this.offsetHeight;
});if((T+U[0].offsetHeight-E.scrollTop())>E[0].clientHeight){E.scrollTop(T+U[0].offsetHeight-E.innerHeight());
}else{if(T<E.scrollTop()){E.scrollTop(T);}}}}function Q(T){D+=T;if(D<0){D=C.size()-1;}else{if(D>=C.size()){D=0;
}}}function O(T){return B.max&&B.max<T?B.max:T;}function P(){E.empty();var U=O(J.length);for(var T=0;
T<U;T++){if(!J[T]){continue;}function Z(b){var a=/[&<>'"]/g;/']/;if(!a.MAP){a.MAP={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};
}return b.replace(a,function(d){return a.MAP[d];});}var V=Z(L);var W=B.formatItem(J[T].data,T+1,U,J[T].value,V);
if(W===false){continue;}var Y=A("<li/>").html(B.highlight(W,V)).addClass(T%2==0?"ac_even":"ac_odd").appendTo(E)[0];
A.data(Y,"ac_data",J[T]);}C=E.find("li");if(B.selectFirst&&B.minCountForSelect<=C.length){var X=C.slice(0,1);
if(!X.children(".placeholder").length){X.addClass(G.ACTIVE);D=0;}}if(A.fn.bgiframe){E.bgiframe();}}return{display:function(U,T){S();
J=U;L=T;P();},next:function(){H(1);},prev:function(){H(-1);},pageUp:function(){if(D!=0&&D-8<0){H(-D);
}else{H(-8);}},pageDown:function(){if(D!=C.size()-1&&D+8>C.size()){H(C.size()-1-D);}else{H(8);}},hide:function(){F&&F.hide();
C&&C.removeClass(G.ACTIVE);D=-1;},visible:function(){return F&&F.is(":visible");},current:function(){return this.visible()&&(C.filter("."+G.ACTIVE)[0]||B.selectFirst&&C.length>=B.minCountForSelect&&C[0]);
},show:function(U,X){if(U==undefined){var W=A(K).offset();F.css({width:typeof B.width=="string"||B.width>0?B.width:A(K).width(),top:W.top+K.offsetHeight,left:W.left}).show();
}else{F.css({width:typeof B.width=="string"||B.width>0?B.width:"200px",top:X,left:U}).show();}if(B.scroll){E.scrollTop(0);
E.css({maxHeight:B.scrollHeight,overflow:"auto"});if(A.browser.msie&&typeof document.body.style.maxHeight==="undefined"){var T=0;
C.each(function(){T+=this.offsetHeight;});var V=T>B.scrollHeight;E.css("height",V?B.scrollHeight:T);if(!V){C.width(E.width()-parseInt(C.css("padding-left"))-parseInt(C.css("padding-right")));
}}}},selected:function(){var T=C&&C.filter("."+G.ACTIVE).removeClass(G.ACTIVE);var U=A(T).index();return T&&T.length&&{data:A.data(T[0],"ac_data"),pos:U};
},emptyList:function(){E&&E.empty();},unbind:function(){F&&F.remove();}};};A.fn.selection=function(C,D){if(C!==undefined){return this.each(function(){if(this.createTextRange){var J=this.createTextRange();
if(D===undefined||C==D){J.move("character",C);J.select();}else{J.collapse(true);J.moveStart("character",C);
J.moveEnd("character",D);J.select();}}else{if(this.setSelectionRange){this.setSelectionRange(C,D);}else{if(this.selectionStart){this.selectionStart=C;
this.selectionEnd=D;}}}});}var B=this[0];if(B.createTextRange){var F=document.selection.createRange(),I=B.value,H="<->",G=F.text.length;
F.text=H;var E=B.value.indexOf(H);B.value=I;this.selection(E,E+G);return{start:E,end:E+G};}else{if(B.selectionStart!==undefined){return{start:B.selectionStart,end:B.selectionEnd};
}}};})(jQuery);
/*
 * jQuery Color Animations v@VERSION
 * http://jquery.org/
 *
 * Copyright 2011 John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function(A,F){var N="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor".split(" "),M=/^([\-+])=\s*(\d+\.?\d*)/,L=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(O){return[O[1],O[2],O[3],O[4]];
}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(O){return[2.55*O[1],2.55*O[2],2.55*O[3],O[4]];
}},{re:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(O){return[parseInt(O[1],16),parseInt(O[2],16),parseInt(O[3],16)];
}},{re:/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,parse:function(O){return[parseInt(O[1]+O[1],16),parseInt(O[2]+O[2],16),parseInt(O[3]+O[3],16)];
}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(O){return[O[1],O[2]/100,O[3]/100,O[4]];
}}],B=A.Color=function(P,Q,O,R){return new A.Color.fn.parse(P,Q,O,R);},D={rgba:{cache:"_rgba",props:{red:{idx:0,type:"byte",empty:true},green:{idx:1,type:"byte",empty:true},blue:{idx:2,type:"byte",empty:true},alpha:{idx:3,type:"percent",def:1}}},hsla:{cache:"_hsla",props:{hue:{idx:0,type:"degrees",empty:true},saturation:{idx:1,type:"percent",empty:true},lightness:{idx:2,type:"percent",empty:true}}}},K={"byte":{floor:true,min:0,max:255},percent:{min:0,max:1},degrees:{mod:360,floor:true}},I=D.rgba.props,J=B.support={},E,C=A.each;
D.hsla.props.alpha=I.alpha;function G(O,Q,R){var P=K[Q.type]||{},S=Q.empty||R;if(S&&O==null){return null;
}if(Q.def&&O==null){return Q.def;}if(P.floor){O=~~O;}else{O=parseFloat(O);}if(O==null||isNaN(O)){return Q.def;
}if(P.mod){O=O%P.mod;return O<0?P.mod+O:O;}return P.min>O?P.min:P.max<O?P.max:O;}B.fn=B.prototype={constructor:B,parse:function(O,R,T,U){if(O===F){this._rgba=[null,null,null,null];
return this;}if(O instanceof A||O.nodeType){O=O instanceof A?O.css(R):A(O).css(R);R=F;}var P=this,S=A.type(O),Q=this._rgba=[],V;
if(R!==F){O=[O,R,T,U];S="array";}if(S==="string"){O=O.toLowerCase();C(L,function(c,X){var b=X.re.exec(O),a=b&&X.parse(b),W,Z=X.space||"rgba",Y=D[Z].cache;
if(a){W=P[Z](a);P[Y]=W[Y];Q=P._rgba=W._rgba;return false;}});if(Q.length!==0){if(Math.max.apply(Math,Q)===0){A.extend(Q,E.transparent);
}return this;}O=E[O]||E._default;return this.parse(O);}if(S==="array"){C(I,function(X,W){Q[W.idx]=G(O[W.idx],W);
});return this;}if(S==="object"){if(O instanceof B){C(D,function(X,W){if(O[W.cache]){P[W.cache]=O[W.cache].slice();
}});}else{C(D,function(X,W){C(W.props,function(Z,a){var Y=W.cache;if(!P[Y]&&W.to){if(O[Z]==null||Z==="alpha"){return;
}P[Y]=W.to(P._rgba);}P[Y][a.idx]=G(O[Z],a,true);});});}return this;}},is:function(R){var Q=B(R),O=true,P=this;
C(D,function(V,S){var T=Q[S.cache],U;if(T){U=P[S.cache]||S.to&&S.to(P._rgba)||[];C(S.props,function(X,W){if(T[W.idx]!=null){O=(T[W.idx]==U[W.idx]);
return O;}});}return O;});return O;},_space:function(){var O=[],P=this;C(D,function(Q,R){if(P[R.cache]){O.push(Q);
}});return O.pop();},transition:function(T,U){var O=B(T),R=O._space(),P=D[R],S=this[P.cache]||P.to(this._rgba),Q=S.slice();
O=O[P.cache];C(P.props,function(a,Y){var Z=Y.idx,V=S[Z],W=O[Z],X=K[Y.type]||{};if(W===null){return;}if(V===null){Q[Z]=W;
}else{if(X.mod){if(W-V>X.mod/2){V+=X.mod;}else{if(V-W>X.mod/2){V-=X.mod;}}}Q[Y.idx]=G((W-V)*U+V,Y);}});
return this[R](Q);},blend:function(R){if(this._rgba[3]===1){return this;}var P=this._rgba.slice(),O=P.pop(),Q=B(R)._rgba;
return B(A.map(P,function(S,T){return(1-O)*Q[T]+O*S;}));},toRgbaString:function(){var P="rgba(",O=A.map(this._rgba,function(Q,R){return Q==null?(R>2?1:0):Q;
});if(O[3]===1){O.pop();P="rgb(";}return P+O.join(",")+")";},toHslaString:function(){var P="hsla(",O=A.map(this.hsla(),function(Q,R){if(Q==null){Q=R>2?1:0;
}if(R&&R<3){Q=Math.round(Q*100)+"%";}return Q;});if(O[3]==1){O.pop();P="hsl(";}return P+O.join(",")+")";
},toHexString:function(P){var O=this._rgba.slice(),Q=O.pop();if(P){O.push(~~(Q*255));}return"#"+A.map(O,function(R,S){R=(R||0).toString(16);
return R.length==1?"0"+R:R;}).join("");},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString();
}};B.fn.parse.prototype=B.fn;function H(P,Q,O){O=(O+1)%1;if(O*6<1){return P+(Q-P)*6*O;}if(O*2<1){return Q;
}if(O*3<2){return P+(Q-P)*((2/3)-O)*6;}return P;}D.hsla.to=function(O){if(O[0]==null||O[1]==null||O[2]==null){return[null,null,null,O[3]];
}var P=O[0]/255,S=O[1]/255,V=O[2]/255,Z=O[3],T=Math.max(P,S,V),X=Math.min(P,S,V),U=T-X,Y=T+X,Q=Y*0.5,R,W;
if(X===T){R=0;}else{if(P===T){R=(60*(S-V)/U)+360;}else{if(S===T){R=(60*(V-P)/U)+120;}else{R=(60*(P-S)/U)+240;
}}}if(Q===0||Q===1){W=Q;}else{if(Q<=0.5){W=U/Y;}else{W=U/(2-Y);}}return[Math.round(R)%360,W,Q,Z==null?1:Z];
};D.hsla.from=function(O){if(O[0]==null||O[1]==null||O[2]==null){return[null,null,null,O[3]];}var S=O[0]/360,T=O[1],P=O[2],U=O[3],Q=P<=0.5?P*(1+T):P+T-P*T,R=2*P-Q,V,W,X;
return[Math.round(H(R,Q,S+(1/3))*255),Math.round(H(R,Q,S)*255),Math.round(H(R,Q,S-(1/3))*255),U];};C(D,function(Q,P){var R=P.props,O=P.cache,T=P.to,S=P.from;
B.fn[Q]=function(X){if(T&&!this[O]){this[O]=T(this._rgba);}if(X===F){return this[O].slice();}var W=A.type(X),Y=(W==="array"||W==="object")?X:arguments,U=this[O].slice(),V;
C(R,function(b,Z){var a=Y[W==="object"?b:Z.idx];if(a==null){a=U[Z.idx];}U[Z.idx]=G(a,Z);});if(S){V=B(S(U));
V[O]=U;return V;}else{return B(U);}};C(R,function(U,V){if(B.fn[U]){return;}B.fn[U]=function(W){var Y=A.type(W),b=(U==="alpha"?(this._hsla?"hsla":"rgba"):Q),Z=this[b](),a=Z[V.idx],X;
if(Y==="undefined"){return a;}if(Y==="function"){W=W.call(this,a);Y=A.type(W);}if(W==null&&V.empty){return this;
}if(Y==="string"){X=M.exec(W);if(X){W=a+parseFloat(X[2])*(X[1]==="+"?1:-1);}}Z[V.idx]=W;return this[b](Z);
};});});C(N,function(P,O){A.cssHooks[O]={set:function(T,Q){Q=B(Q);if(!J.rgba&&Q._rgba[3]!==1){var R,S=O==="backgroundColor"?T.parentNode:T;
do{R=A.curCSS(S,"backgroundColor");}while((R===""||R==="transparent")&&(S=S.parentNode)&&S.style);Q=Q.blend(R&&R!=="transparent"?R:"_default");
}Q=Q.toRgbaString();T.style[O]=Q;}};A.fx.step[O]=function(Q){if(!Q.colorInit){Q.start=B(Q.elem,O);Q.end=B(Q.end);
Q.colorInit=true;}A.cssHooks[O].set(Q.elem,Q.start.transition(Q.end,Q.pos));};});A(function(){var P=document.createElement("div"),O=P.style;
O.cssText="background-color:rgba(1,1,1,.5)";J.rgba=O.backgroundColor.indexOf("rgba")>-1;});E=A.Color.names={aqua:"#00ffff",azure:"#f0ffff",beige:"#f5f5dc",black:"#000000",blue:"#0000ff",brown:"#a52a2a",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkviolet:"#9400d3",fuchsia:"#ff00ff",gold:"#ffd700",green:"#008000",indigo:"#4b0082",khaki:"#f0e68c",lightblue:"#add8e6",lightcyan:"#e0ffff",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightyellow:"#ffffe0",lime:"#00ff00",magenta:"#ff00ff",maroon:"#800000",navy:"#000080",olive:"#808000",orange:"#ffa500",pink:"#ffc0cb",purple:"#800080",violet:"#800080",red:"#ff0000",silver:"#c0c0c0",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"};
})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){function D(E,J){var G=E.nodeName.toLowerCase();
if("area"===G){var I=E.parentNode,H=I.name,F;return !E.href||!H||I.nodeName.toLowerCase()!=="map"?!1:(F=A("img[usemap=#"+H+"]")[0],!!F&&C(F));
}return(/input|select|textarea|button|object/.test(G)?!E.disabled:"a"==G?E.href||J:J)&&C(E);}function C(E){return !A(E).parents().andSelf().filter(function(){return A.curCSS(this,"visibility")==="hidden"||A.expr.filters.hidden(this);
}).length;}A.ui=A.ui||{};if(A.ui.version){return;}A.extend(A.ui,{version:"1.8.20",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),A.fn.extend({propAttr:A.fn.prop||A.fn.attr,_focus:A.fn.focus,focus:function(E,F){return typeof E=="number"?this.each(function(){var G=this;
setTimeout(function(){A(G).focus(),F&&F.call(G);},E);}):this._focus.apply(this,arguments);},scrollParent:function(){var E;
return A.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?E=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(A.curCSS(this,"position",1))&&/(auto|scroll)/.test(A.curCSS(this,"overflow",1)+A.curCSS(this,"overflow-y",1)+A.curCSS(this,"overflow-x",1));
}).eq(0):E=this.parents().filter(function(){return/(auto|scroll)/.test(A.curCSS(this,"overflow",1)+A.curCSS(this,"overflow-y",1)+A.curCSS(this,"overflow-x",1));
}).eq(0),/fixed/.test(this.css("position"))||!E.length?A(document):E;},zIndex:function(H){if(H!==B){return this.css("zIndex",H);
}if(this.length){var E=A(this[0]),G,F;while(E.length&&E[0]!==document){G=E.css("position");if(G==="absolute"||G==="relative"||G==="fixed"){F=parseInt(E.css("zIndex"),10);
if(!isNaN(F)&&F!==0){return F;}}E=E.parent();}}return 0;},disableSelection:function(){return this.bind((A.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(E){E.preventDefault();
});},enableSelection:function(){return this.unbind(".ui-disableSelection");}}),A.each(["Width","Height"],function(J,E){function F(L,K,N,M){return A.each(I,function(){K-=parseFloat(A.curCSS(L,"padding"+this,!0))||0,N&&(K-=parseFloat(A.curCSS(L,"border"+this+"Width",!0))||0),M&&(K-=parseFloat(A.curCSS(L,"margin"+this,!0))||0);
}),K;}var I=E==="Width"?["Left","Right"]:["Top","Bottom"],H=E.toLowerCase(),G={innerWidth:A.fn.innerWidth,innerHeight:A.fn.innerHeight,outerWidth:A.fn.outerWidth,outerHeight:A.fn.outerHeight};
A.fn["inner"+E]=function(K){return K===B?G["inner"+E].call(this):this.each(function(){A(this).css(H,F(this,K)+"px");
});},A.fn["outer"+E]=function(K,L){return typeof K!="number"?G["outer"+E].call(this,K):this.each(function(){A(this).css(H,F(this,K,!0,L)+"px");
});};}),A.extend(A.expr[":"],{data:function(E,G,F){return !!A.data(E,F[3]);},focusable:function(E){return D(E,!isNaN(A.attr(E,"tabindex")));
},tabbable:function(E){var G=A.attr(E,"tabindex"),F=isNaN(G);return(F||G>=0)&&D(E,!F);}}),A(function(){var F=document.body,E=F.appendChild(E=document.createElement("div"));
E.offsetHeight,A.extend(E.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),A.support.minHeight=E.offsetHeight===100,A.support.selectstart="onselectstart" in E,F.removeChild(E).style.display="none";
}),A.extend(A.ui,{plugin:{add:function(H,I,G){var F=A.ui[H].prototype;for(var E in G){F.plugins[E]=F.plugins[E]||[],F.plugins[E].push([I,G[E]]);
}},call:function(E,H,I){var G=E.plugins[H];if(!G||!E.element[0].parentNode){return;}for(var F=0;F<G.length;
F++){E.options[G[F][0]]&&G[F][1].apply(E.element,I);}}},contains:function(F,E){return document.compareDocumentPosition?F.compareDocumentPosition(E)&16:F!==E&&F.contains(E);
},hasScroll:function(E,H){if(A(E).css("overflow")==="hidden"){return !1;}var F=H&&H==="left"?"scrollLeft":"scrollTop",G=!1;
return E[F]>0?!0:(E[F]=1,G=E[F]>0,E[F]=0,G);},isOverAxis:function(F,E,G){return F>E&&F<E+G;},isOver:function(E,J,I,H,G,F){return A.ui.isOverAxis(E,I,G)&&A.ui.isOverAxis(J,H,F);
}});})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){if(A.cleanData){var D=A.cleanData;
A.cleanData=function(E){for(var G=0,F;(F=E[G])!=null;G++){try{A(F).triggerHandler("remove");}catch(H){}}D(E);
};}else{var C=A.fn.remove;A.fn.remove=function(E,F){return this.each(function(){return F||(!E||A.filter(E,[this]).length)&&A("*",this).add([this]).each(function(){try{A(this).triggerHandler("remove");
}catch(G){}}),C.call(A(this),E,F);});};}A.widget=function(E,J,I){var F=E.split(".")[0],H;E=E.split(".")[1],H=F+"-"+E,I||(I=J,J=A.Widget),A.expr[":"][H]=function(K){return !!A.data(K,E);
},A[F]=A[F]||{},A[F][E]=function(L,K){arguments.length&&this._createWidget(L,K);};var G=new J;G.options=A.extend(!0,{},G.options),A[F][E].prototype=A.extend(!0,G,{namespace:F,widgetName:E,widgetEventPrefix:A[F][E].prototype.widgetEventPrefix||E,widgetBaseClass:H},I),A.widget.bridge(E,A[F][E]);
},A.widget.bridge=function(E,F){A.fn[E]=function(G){var J=typeof G=="string",I=Array.prototype.slice.call(arguments,1),H=this;
return G=!J&&I.length?A.extend.apply(null,[!0,G].concat(I)):G,J&&G.charAt(0)==="_"?H:(J?this.each(function(){var K=A.data(this,E),L=K&&A.isFunction(K[G])?K[G].apply(K,I):K;
if(L!==K&&L!==B){return H=L,!1;}}):this.each(function(){var K=A.data(this,E);K?K.option(G||{})._init():A.data(this,E,new F(G,this));
}),H);};},A.Widget=function(F,E){arguments.length&&this._createWidget(F,E);},A.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(F,E){A.data(E,this.widgetName,this),this.element=A(E),this.options=A.extend(!0,{},this.options,this._getCreateOptions(),F);
var G=this;this.element.bind("remove."+this.widgetName,function(){G.destroy();}),this._create(),this._trigger("create"),this._init();
},_getCreateOptions:function(){return A.metadata&&A.metadata.get(this.element[0])[this.widgetName];},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled");
},widget:function(){return this.element;},option:function(E,G){var F=E;if(arguments.length===0){return A.extend({},this.options);
}if(typeof E=="string"){if(G===B){return this.options[E];}F={},F[E]=G;}return this._setOptions(F),this;
},_setOptions:function(E){var F=this;return A.each(E,function(H,G){F._setOption(H,G);}),this;},_setOption:function(F,E){return this.options[F]=E,F==="disabled"&&this.widget()[E?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",E),this;
},enable:function(){return this._setOption("disabled",!1);},disable:function(){return this._setOption("disabled",!0);
},_trigger:function(F,E,I){var H,G,J=this.options[F];I=I||{},E=A.Event(E),E.type=(F===this.widgetEventPrefix?F:this.widgetEventPrefix+F).toLowerCase(),E.target=this.element[0],G=E.originalEvent;
if(G){for(H in G){H in E||(E[H]=G[H]);}}return this.element.trigger(E,I),!(A.isFunction(J)&&J.call(this.element[0],E,I)===!1||E.isDefaultPrevented());
}};})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.mouse.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,C){var B=!1;
A(document).mouseup(function(D){B=!1;}),A.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var D=this;
this.element.bind("mousedown."+this.widgetName,function(E){return D._mouseDown(E);}).bind("click."+this.widgetName,function(E){if(!0===A.data(E.target,D.widgetName+".preventClickEvent")){return A.removeData(E.target,D.widgetName+".preventClickEvent"),E.stopImmediatePropagation(),!1;
}}),this.started=!1;},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),A(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
},_mouseDown:function(D){if(B){return;}this._mouseStarted&&this._mouseUp(D),this._mouseDownEvent=D;var E=this,G=D.which==1,F=typeof this.options.cancel=="string"&&D.target.nodeName?A(D.target).closest(this.options.cancel).length:!1;
if(!G||F||!this._mouseCapture(D)){return !0;}this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){E.mouseDelayMet=!0;
},this.options.delay));if(this._mouseDistanceMet(D)&&this._mouseDelayMet(D)){this._mouseStarted=this._mouseStart(D)!==!1;
if(!this._mouseStarted){return D.preventDefault(),!0;}}return !0===A.data(D.target,this.widgetName+".preventClickEvent")&&A.removeData(D.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(H){return E._mouseMove(H);
},this._mouseUpDelegate=function(H){return E._mouseUp(H);},A(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),D.preventDefault(),B=!0,!0;
},_mouseMove:function(D){return !A.browser.msie||document.documentMode>=9||!!D.button?this._mouseStarted?(this._mouseDrag(D),D.preventDefault()):(this._mouseDistanceMet(D)&&this._mouseDelayMet(D)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,D)!==!1,this._mouseStarted?this._mouseDrag(D):this._mouseUp(D)),!this._mouseStarted):this._mouseUp(D);
},_mouseUp:function(D){return A(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,D.target==this._mouseDownEvent.target&&A.data(D.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(D)),!1;
},_mouseDistanceMet:function(D){return Math.max(Math.abs(this._mouseDownEvent.pageX-D.pageX),Math.abs(this._mouseDownEvent.pageY-D.pageY))>=this.options.distance;
},_mouseDelayMet:function(D){return this.mouseDelayMet;},_mouseStart:function(D){},_mouseDrag:function(D){},_mouseStop:function(D){},_mouseCapture:function(D){return !0;
}});})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.sortable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){A.widget("ui.sortable",A.ui.mouse,{widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var C=this.options;
this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?C.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0;
},destroy:function(){A.Widget.prototype.destroy.call(this),this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();
for(var C=this.items.length-1;C>=0;C--){this.items[C].item.removeData(this.widgetName+"-item");}return this;
},_setOption:function(C,D){C==="disabled"?(this.options[C]=D,this.widget()[D?"addClass":"removeClass"]("ui-sortable-disabled")):A.Widget.prototype._setOption.apply(this,arguments);
},_mouseCapture:function(C,H){var G=this;if(this.reverting){return !1;}if(this.options.disabled||this.options.type=="static"){return !1;
}this._refreshItems(C);var D=null,F=this,I=A(C.target).parents().each(function(){if(A.data(this,G.widgetName+"-item")==F){return D=A(this),!1;
}});A.data(C.target,G.widgetName+"-item")==F&&(D=A(C.target));if(!D){return !1;}if(this.options.handle&&!H){var E=!1;
A(this.options.handle,D).find("*").andSelf().each(function(){this==C.target&&(E=!0);});if(!E){return !1;
}}return this.currentItem=D,this._removeCurrentsFromItems(),!0;},_mouseStart:function(C,H,G){var D=this.options,F=this;
this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(C),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),A.extend(this.offset,{click:{left:C.pageX-this.offset.left,top:C.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this._generatePosition(C),this.originalPageX=C.pageX,this.originalPageY=C.pageY,D.cursorAt&&this._adjustOffsetFromHelper(D.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),D.containment&&this._setContainment(),D.cursor&&(A("body").css("cursor")&&(this._storedCursor=A("body").css("cursor")),A("body").css("cursor",D.cursor)),D.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",D.opacity)),D.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",D.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",C,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();
if(!G){for(var E=this.containers.length-1;E>=0;E--){this.containers[E]._trigger("activate",C,F._uiHash(this));
}}return A.ui.ddmanager&&(A.ui.ddmanager.current=this),A.ui.ddmanager&&!D.dropBehaviour&&A.ui.ddmanager.prepareOffsets(this,C),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(C),!0;
},_mouseDrag:function(D){this.position=this._generatePosition(D),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);
if(this.options.scroll){var C=this.options,E=!1;this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-D.pageY<C.scrollSensitivity?this.scrollParent[0].scrollTop=E=this.scrollParent[0].scrollTop+C.scrollSpeed:D.pageY-this.overflowOffset.top<C.scrollSensitivity&&(this.scrollParent[0].scrollTop=E=this.scrollParent[0].scrollTop-C.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-D.pageX<C.scrollSensitivity?this.scrollParent[0].scrollLeft=E=this.scrollParent[0].scrollLeft+C.scrollSpeed:D.pageX-this.overflowOffset.left<C.scrollSensitivity&&(this.scrollParent[0].scrollLeft=E=this.scrollParent[0].scrollLeft-C.scrollSpeed)):(D.pageY-A(document).scrollTop()<C.scrollSensitivity?E=A(document).scrollTop(A(document).scrollTop()-C.scrollSpeed):A(window).height()-(D.pageY-A(document).scrollTop())<C.scrollSensitivity&&(E=A(document).scrollTop(A(document).scrollTop()+C.scrollSpeed)),D.pageX-A(document).scrollLeft()<C.scrollSensitivity?E=A(document).scrollLeft(A(document).scrollLeft()-C.scrollSpeed):A(window).width()-(D.pageX-A(document).scrollLeft())<C.scrollSensitivity&&(E=A(document).scrollLeft(A(document).scrollLeft()+C.scrollSpeed))),E!==!1&&A.ui.ddmanager&&!C.dropBehaviour&&A.ui.ddmanager.prepareOffsets(this,D);
}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";}for(var I=this.items.length-1;
I>=0;I--){var G=this.items[I],F=G.item[0],H=this._intersectsWithPointer(G);if(!H){continue;}if(F!=this.currentItem[0]&&this.placeholder[H==1?"next":"prev"]()[0]!=F&&!A.ui.contains(this.placeholder[0],F)&&(this.options.type=="semi-dynamic"?!A.ui.contains(this.element[0],F):!0)){this.direction=H==1?"down":"up";
if(this.options.tolerance=="pointer"||this._intersectsWithSides(G)){this._rearrange(D,G);}else{break;
}this._trigger("change",D,this._uiHash());break;}}return this._contactContainers(D),A.ui.ddmanager&&A.ui.ddmanager.drag(this,D),this._trigger("sort",D,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1;
},_mouseStop:function(D,F){if(!D){return;}A.ui.ddmanager&&!this.options.dropBehaviour&&A.ui.ddmanager.drop(this,D);
if(this.options.revert){var C=this,E=C.placeholder.offset();C.reverting=!0,A(this.helper).animate({left:E.left-this.offset.parent.left-C.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:E.top-this.offset.parent.top-C.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){C._clear(D);
});}else{this._clear(D,F);}return !1;},cancel:function(){var D=this;if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();
for(var C=this.containers.length-1;C>=0;C--){this.containers[C]._trigger("deactivate",null,D._uiHash(this)),this.containers[C].containerCache.over&&(this.containers[C]._trigger("out",null,D._uiHash(this)),this.containers[C].containerCache.over=0);
}}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),A.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?A(this.domPosition.prev).after(this.currentItem):A(this.domPosition.parent).prepend(this.currentItem)),this;
},serialize:function(C){var E=this._getItemsAsjQuery(C&&C.connected),D=[];return C=C||{},A(E).each(function(){var F=(A(C.item||this).attr(C.attribute||"id")||"").match(C.expression||/(.+)[-=_](.+)/);
F&&D.push((C.key||F[1]+"[]")+"="+(C.key&&C.expression?F[1]:F[2]));}),!D.length&&C.key&&D.push(C.key+"="),D.join("&");
},toArray:function(C){var E=this._getItemsAsjQuery(C&&C.connected),D=[];return C=C||{},E.each(function(){D.push(A(C.item||this).attr(C.attribute||"id")||"");
}),D;},_intersectsWith:function(C){var E=this.positionAbs.left,N=E+this.helperProportions.width,D=this.positionAbs.top,M=D+this.helperProportions.height,G=C.left,K=G+C.width,F=C.top,J=F+C.height,I=this.offset.click.top,H=this.offset.click.left,L=D+I>F&&D+I<J&&E+H>G&&E+H<K;
return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>C[this.floating?"width":"height"]?L:G<E+this.helperProportions.width/2&&N-this.helperProportions.width/2<K&&F<D+this.helperProportions.height/2&&M-this.helperProportions.height/2<J;
},_intersectsWithPointer:function(C){var H=this.options.axis==="x"||A.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,C.top,C.height),G=this.options.axis==="y"||A.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,C.left,C.width),F=H&&G,D=this._getDragVerticalDirection(),E=this._getDragHorizontalDirection();
return F?this.floating?E&&E=="right"||D=="down"?2:1:D&&(D=="down"?2:1):!1;},_intersectsWithSides:function(C){var G=A.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,C.top+C.height/2,C.height),F=A.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,C.left+C.width/2,C.width),E=this._getDragVerticalDirection(),D=this._getDragHorizontalDirection();
return this.floating&&D?D=="right"&&F||D=="left"&&!F:E&&(E=="down"&&G||E=="up"&&!G);},_getDragVerticalDirection:function(){var C=this.positionAbs.top-this.lastPositionAbs.top;
return C!=0&&(C>0?"down":"up");},_getDragHorizontalDirection:function(){var C=this.positionAbs.left-this.lastPositionAbs.left;
return C!=0&&(C>0?"right":"left");},refresh:function(C){return this._refreshItems(C),this.refreshPositions(),this;
},_connectWith:function(){var C=this.options;return C.connectWith.constructor==String?[C.connectWith]:C.connectWith;
},_getItemsAsjQuery:function(J){var K=this,I=[],E=[],G=this._connectWith();if(G&&J){for(var D=G.length-1;
D>=0;D--){var H=A(G[D]);for(var F=H.length-1;F>=0;F--){var C=A.data(H[F],this.widgetName);C&&C!=this&&!C.options.disabled&&E.push([A.isFunction(C.options.items)?C.options.items.call(C.element):A(C.options.items,C.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),C]);
}}}E.push([A.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):A(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);
for(var D=E.length-1;D>=0;D--){E[D][0].each(function(){I.push(this);});}return A(I);},_removeCurrentsFromItems:function(){var E=this.currentItem.find(":data("+this.widgetName+"-item)");
for(var C=0;C<this.items.length;C++){for(var D=0;D<E.length;D++){E[D]==this.items[C].item[0]&&this.items.splice(C,1);
}}},_refreshItems:function(L){this.items=[],this.containers=[this];var N=this.items,O=this,F=[[A.isFunction(this.options.items)?this.options.items.call(this.element[0],L,{item:this.currentItem}):A(this.options.items,this.element),this]],G=this._connectWith();
if(G&&this.ready){for(var D=G.length-1;D>=0;D--){var K=A(G[D]);for(var E=K.length-1;E>=0;E--){var C=A.data(K[E],this.widgetName);
C&&C!=this&&!C.options.disabled&&(F.push([A.isFunction(C.options.items)?C.options.items.call(C.element[0],L,{item:this.currentItem}):A(C.options.items,C.element),C]),this.containers.push(C));
}}}for(var D=F.length-1;D>=0;D--){var J=F[D][1],I=F[D][0];for(var E=0,M=I.length;E<M;E++){var H=A(I[E]);
H.data(this.widgetName+"-item",J),N.push({item:H,instance:J,width:0,height:0,left:0,top:0});}}},refreshPositions:function(G){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());
for(var C=this.items.length-1;C>=0;C--){var D=this.items[C];if(D.instance!=this.currentContainer&&this.currentContainer&&D.item[0]!=this.currentItem[0]){continue;
}var F=this.options.toleranceElement?A(this.options.toleranceElement,D.item):D.item;G||(D.width=F.outerWidth(),D.height=F.outerHeight());
var E=F.offset();D.left=E.left,D.top=E.top;}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this);
}else{for(var C=this.containers.length-1;C>=0;C--){var E=this.containers[C].element.offset();this.containers[C].containerCache.left=E.left,this.containers[C].containerCache.top=E.top,this.containers[C].containerCache.width=this.containers[C].element.outerWidth(),this.containers[C].containerCache.height=this.containers[C].element.outerHeight();
}}return this;},_createPlaceholder:function(F){var C=F||this,D=C.options;if(!D.placeholder||D.placeholder.constructor==String){var E=D.placeholder;
D.placeholder={element:function(){var G=A(document.createElement(C.currentItem[0].nodeName)).addClass(E||C.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
return E||(G.style.visibility="hidden"),G;},update:function(H,G){if(E&&!D.forcePlaceholderSize){return;
}G.height()||G.height(C.currentItem.innerHeight()-parseInt(C.currentItem.css("paddingTop")||0,10)-parseInt(C.currentItem.css("paddingBottom")||0,10)),G.width()||G.width(C.currentItem.innerWidth()-parseInt(C.currentItem.css("paddingLeft")||0,10)-parseInt(C.currentItem.css("paddingRight")||0,10));
}};}C.placeholder=A(D.placeholder.element.call(C.element,C.currentItem)),C.currentItem.after(C.placeholder),D.placeholder.update(C,C.placeholder);
},_contactContainers:function(E){var H=null,C=null;for(var D=this.containers.length-1;D>=0;D--){if(A.ui.contains(this.currentItem[0],this.containers[D].element[0])){continue;
}if(this._intersectsWith(this.containers[D].containerCache)){if(H&&A.ui.contains(this.containers[D].element[0],H.element[0])){continue;
}H=this.containers[D],C=D;}else{this.containers[D].containerCache.over&&(this.containers[D]._trigger("out",E,this._uiHash(this)),this.containers[D].containerCache.over=0);
}}if(!H){return;}if(this.containers.length===1){this.containers[C]._trigger("over",E,this._uiHash(this)),this.containers[C].containerCache.over=1;
}else{if(this.currentContainer!=this.containers[C]){var K=10000,G=null,J=this.positionAbs[this.containers[C].floating?"left":"top"];
for(var F=this.items.length-1;F>=0;F--){if(!A.ui.contains(this.containers[C].element[0],this.items[F].item[0])){continue;
}var I=this.items[F][this.containers[C].floating?"left":"top"];Math.abs(I-J)<K&&(K=Math.abs(I-J),G=this.items[F]);
}if(!G&&!this.options.dropOnEmpty){return;}this.currentContainer=this.containers[C],G?this._rearrange(E,G,null,!0):this._rearrange(E,null,this.containers[C].element,!0),this._trigger("change",E,this._uiHash()),this.containers[C]._trigger("change",E,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[C]._trigger("over",E,this._uiHash(this)),this.containers[C].containerCache.over=1;
}}},_createHelper:function(E){var D=this.options,C=A.isFunction(D.helper)?A(D.helper.apply(this.element[0],[E,this.currentItem])):D.helper=="clone"?this.currentItem.clone():this.currentItem;
return C.parents("body").length||A(D.appendTo!="parent"?D.appendTo:this.currentItem[0].parentNode)[0].appendChild(C[0]),C[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(C[0].style.width==""||D.forceHelperSize)&&C.width(this.currentItem.width()),(C[0].style.height==""||D.forceHelperSize)&&C.height(this.currentItem.height()),C;
},_adjustOffsetFromHelper:function(C){typeof C=="string"&&(C=C.split(" ")),A.isArray(C)&&(C={left:+C[0],top:+C[1]||0}),"left" in C&&(this.offset.click.left=C.left+this.margins.left),"right" in C&&(this.offset.click.left=this.helperProportions.width-C.right+this.margins.left),"top" in C&&(this.offset.click.top=C.top+this.margins.top),"bottom" in C&&(this.offset.click.top=this.helperProportions.height-C.bottom+this.margins.top);
},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var C=this.offsetParent.offset();
this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&A.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(C.left+=this.scrollParent.scrollLeft(),C.top+=this.scrollParent.scrollTop());
if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&A.browser.msie){C={top:0,left:0};
}return{top:C.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:C.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var C=this.currentItem.position();return{top:C.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:C.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}return{top:0,left:0};},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var D=this.options;D.containment=="parent"&&(D.containment=this.helper[0].parentNode);
if(D.containment=="document"||D.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,A(D.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(A(D.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(D.containment)){var C=A(D.containment)[0],E=A(D.containment).offset(),F=A(C).css("overflow")!="hidden";
this.containment=[E.left+(parseInt(A(C).css("borderLeftWidth"),10)||0)+(parseInt(A(C).css("paddingLeft"),10)||0)-this.margins.left,E.top+(parseInt(A(C).css("borderTopWidth"),10)||0)+(parseInt(A(C).css("paddingTop"),10)||0)-this.margins.top,E.left+(F?Math.max(C.scrollWidth,C.offsetWidth):C.offsetWidth)-(parseInt(A(C).css("borderLeftWidth"),10)||0)-(parseInt(A(C).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,E.top+(F?Math.max(C.scrollHeight,C.offsetHeight):C.offsetHeight)-(parseInt(A(C).css("borderTopWidth"),10)||0)-(parseInt(A(C).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top];
}},_convertPositionTo:function(G,D){D||(D=this.position);var C=G=="absolute"?1:-1,H=this.options,E=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!A.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,F=/(html|body)/i.test(E[0].tagName);
return{top:D.top+this.offset.relative.top*C+this.offset.parent.top*C-(A.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():F?0:E.scrollTop())*C),left:D.left+this.offset.relative.left*C+this.offset.parent.left*C-(A.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():F?0:E.scrollLeft())*C)};
},_generatePosition:function(F){var C=this.options,I=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!A.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,J=/(html|body)/i.test(I[0].tagName);
this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());
var H=F.pageX,G=F.pageY;if(this.originalPosition){this.containment&&(F.pageX-this.offset.click.left<this.containment[0]&&(H=this.containment[0]+this.offset.click.left),F.pageY-this.offset.click.top<this.containment[1]&&(G=this.containment[1]+this.offset.click.top),F.pageX-this.offset.click.left>this.containment[2]&&(H=this.containment[2]+this.offset.click.left),F.pageY-this.offset.click.top>this.containment[3]&&(G=this.containment[3]+this.offset.click.top));
if(C.grid){var E=this.originalPageY+Math.round((G-this.originalPageY)/C.grid[1])*C.grid[1];G=this.containment?E-this.offset.click.top<this.containment[1]||E-this.offset.click.top>this.containment[3]?E-this.offset.click.top<this.containment[1]?E+C.grid[1]:E-C.grid[1]:E:E;
var D=this.originalPageX+Math.round((H-this.originalPageX)/C.grid[0])*C.grid[0];H=this.containment?D-this.offset.click.left<this.containment[0]||D-this.offset.click.left>this.containment[2]?D-this.offset.click.left<this.containment[0]?D+C.grid[0]:D-C.grid[0]:D:D;
}}return{top:G-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(A.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():J?0:I.scrollTop()),left:H-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(A.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():J?0:I.scrollLeft())};
},_rearrange:function(H,C,E,G){E?E[0].appendChild(this.placeholder[0]):C.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?C.item[0]:C.item[0].nextSibling),this.counter=this.counter?++this.counter:1;
var D=this,F=this.counter;window.setTimeout(function(){F==D.counter&&D.refreshPositions(!G);},0);},_clear:function(F,E){this.reverting=!1;
var D=[],G=this;!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;
if(this.helper[0]==this.currentItem[0]){for(var C in this._storedCSS){if(this._storedCSS[C]=="auto"||this._storedCSS[C]=="static"){this._storedCSS[C]="";
}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");}else{this.currentItem.show();
}this.fromOutside&&!E&&D.push(function(H){this._trigger("receive",H,this._uiHash(this.fromOutside));}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!E&&D.push(function(H){this._trigger("update",H,this._uiHash());
});if(!A.ui.contains(this.element[0],this.currentItem[0])){E||D.push(function(H){this._trigger("remove",H,this._uiHash());
});for(var C=this.containers.length-1;C>=0;C--){A.ui.contains(this.containers[C].element[0],this.currentItem[0])&&!E&&(D.push(function(H){return function(I){H._trigger("receive",I,this._uiHash(this));
};}.call(this,this.containers[C])),D.push(function(H){return function(I){H._trigger("update",I,this._uiHash(this));
};}.call(this,this.containers[C])));}}for(var C=this.containers.length-1;C>=0;C--){E||D.push(function(H){return function(I){H._trigger("deactivate",I,this._uiHash(this));
};}.call(this,this.containers[C])),this.containers[C].containerCache.over&&(D.push(function(H){return function(I){H._trigger("out",I,this._uiHash(this));
};}.call(this,this.containers[C])),this.containers[C].containerCache.over=0);}this._storedCursor&&A("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;
if(this.cancelHelperRemoval){if(!E){this._trigger("beforeStop",F,this._uiHash());for(var C=0;C<D.length;
C++){D[C].call(this,F);}this._trigger("stop",F,this._uiHash());}return !1;}E||this._trigger("beforeStop",F,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;
if(!E){for(var C=0;C<D.length;C++){D[C].call(this,F);}this._trigger("stop",F,this._uiHash());}return this.fromOutside=!1,!0;
},_trigger:function(){A.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel();},_uiHash:function(D){var C=D||this;
return{helper:C.helper,placeholder:C.placeholder||A([]),position:C.position,originalPosition:C.originalPosition,offset:C.positionAbs,item:C.currentItem,sender:D?D.element:null};
}}),A.extend(A.ui.sortable,{version:"1.8.20"});})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.position.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,H){A.ui=A.ui||{};
var E=/left|center|right/,D=/top|center|bottom/,B="center",C={},G=A.fn.position,F=A.fn.offset;A.fn.position=function(I){if(!I||!I.of){return G.apply(this,arguments);
}I=A.extend({},I);var L=A(I.of),P=L[0],O=(I.collision||"flip").split(" "),K=I.offset?I.offset.split(" "):[0,0],N,M,J;
return P.nodeType===9?(N=L.width(),M=L.height(),J={top:0,left:0}):P.setTimeout?(N=L.width(),M=L.height(),J={top:L.scrollTop(),left:L.scrollLeft()}):P.preventDefault?(I.at="left top",N=M=0,J={top:I.of.pageY,left:I.of.pageX}):(N=L.outerWidth(),M=L.outerHeight(),J=L.offset()),A.each(["my","at"],function(){var Q=(I[this]||"").split(" ");
Q.length===1&&(Q=E.test(Q[0])?Q.concat([B]):D.test(Q[0])?[B].concat(Q):[B,B]),Q[0]=E.test(Q[0])?Q[0]:B,Q[1]=D.test(Q[1])?Q[1]:B,I[this]=Q;
}),O.length===1&&(O[1]=O[0]),K[0]=parseInt(K[0],10)||0,K.length===1&&(K[1]=K[0]),K[1]=parseInt(K[1],10)||0,I.at[0]==="right"?J.left+=N:I.at[0]===B&&(J.left+=N/2),I.at[1]==="bottom"?J.top+=M:I.at[1]===B&&(J.top+=M/2),J.left+=K[0],J.top+=K[1],this.each(function(){var T=A(this),S=T.outerWidth(),R=T.outerHeight(),W=parseInt(A.curCSS(this,"marginLeft",!0))||0,V=parseInt(A.curCSS(this,"marginTop",!0))||0,Y=S+W+(parseInt(A.curCSS(this,"marginRight",!0))||0),X=R+V+(parseInt(A.curCSS(this,"marginBottom",!0))||0),Q=A.extend({},J),U;
I.my[0]==="right"?Q.left-=S:I.my[0]===B&&(Q.left-=S/2),I.my[1]==="bottom"?Q.top-=R:I.my[1]===B&&(Q.top-=R/2),C.fractions||(Q.left=Math.round(Q.left),Q.top=Math.round(Q.top)),U={left:Q.left-W,top:Q.top-V},A.each(["left","top"],function(Z,a){A.ui.position[O[Z]]&&A.ui.position[O[Z]][a](Q,{targetWidth:N,targetHeight:M,elemWidth:S,elemHeight:R,collisionPosition:U,collisionWidth:Y,collisionHeight:X,offset:K,my:I.my,at:I.at});
}),A.fn.bgiframe&&T.bgiframe(),T.offset(A.extend(Q,{using:I.using}));});},A.ui.position={fit:{left:function(I,J){var L=A(window),K=J.collisionPosition.left+J.collisionWidth-L.width()-L.scrollLeft();
I.left=K>0?I.left-K:Math.max(I.left-J.collisionPosition.left,I.left);},top:function(I,J){var L=A(window),K=J.collisionPosition.top+J.collisionHeight-L.height()-L.scrollTop();
I.top=K>0?I.top-K:Math.max(I.top-J.collisionPosition.top,I.top);}},flip:{left:function(N,I){if(I.at[0]===B){return;
}var M=A(window),O=I.collisionPosition.left+I.collisionWidth-M.width()-M.scrollLeft(),L=I.my[0]==="left"?-I.elemWidth:I.my[0]==="right"?I.elemWidth:0,K=I.at[0]==="left"?I.targetWidth:-I.targetWidth,J=-2*I.offset[0];
N.left+=I.collisionPosition.left<0?L+K+J:O>0?L+K+J:0;},top:function(N,I){if(I.at[1]===B){return;}var M=A(window),O=I.collisionPosition.top+I.collisionHeight-M.height()-M.scrollTop(),L=I.my[1]==="top"?-I.elemHeight:I.my[1]==="bottom"?I.elemHeight:0,K=I.at[1]==="top"?I.targetHeight:-I.targetHeight,J=-2*I.offset[1];
N.top+=I.collisionPosition.top<0?L+K+J:O>0?L+K+J:0;}}},A.offset.setOffset||(A.offset.setOffset=function(I,J){/static/.test(A.curCSS(I,"position"))&&(I.style.position="relative");
var M=A(I),L=M.offset(),O=parseInt(A.curCSS(I,"top",!0),10)||0,N=parseInt(A.curCSS(I,"left",!0),10)||0,K={top:J.top-L.top+O,left:J.left-L.left+N};
"using" in J?J.using.call(I,K):M.css(K);},A.fn.offset=function(I){var J=this[0];return !J||!J.ownerDocument?null:I?this.each(function(){A.offset.setOffset(this,I);
}):F.call(this);}),function(){var J=document.getElementsByTagName("body")[0],O=document.createElement("div"),I,L,K,N,M;
I=document.createElement(J?"div":"body"),K={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},J&&A.extend(K,{position:"absolute",left:"-1000px",top:"-1000px"});
for(var P in K){I.style[P]=K[P];}I.appendChild(O),L=J||document.documentElement,L.insertBefore(I,L.firstChild),O.style.cssText="position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;",N=A(O).offset(function(R,Q){return Q;
}).offset(),I.innerHTML="",L.removeChild(I),M=N.top+N.left+(J?2000:0),C.fractions=M>21&&M<22;}();})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.draggable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){A.widget("ui.draggable",A.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit();
},destroy:function(){if(!this.element.data("draggable")){return;}return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this;
},_mouseCapture:function(D){var C=this.options;return this.helper||C.disabled||A(D.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(D),this.handle?(C.iframeFix&&A(C.iframeFix===!0?"iframe":C.iframeFix).each(function(){A('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(A(this).offset()).appendTo("body");
}),!0):!1);},_mouseStart:function(C){var D=this.options;return this.helper=this._createHelper(C),this._cacheHelperProportions(),A.ui.ddmanager&&(A.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},A.extend(this.offset,{click:{left:C.pageX-this.offset.left,top:C.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(C),this.originalPageX=C.pageX,this.originalPageY=C.pageY,D.cursorAt&&this._adjustOffsetFromHelper(D.cursorAt),D.containment&&this._setContainment(),this._trigger("start",C)===!1?(this._clear(),!1):(this._cacheHelperProportions(),A.ui.ddmanager&&!D.dropBehaviour&&A.ui.ddmanager.prepareOffsets(this,C),this.helper.addClass("ui-draggable-dragging"),this._mouseDrag(C,!0),A.ui.ddmanager&&A.ui.ddmanager.dragStart(this,C),!0);
},_mouseDrag:function(C,E){this.position=this._generatePosition(C),this.positionAbs=this._convertPositionTo("absolute");
if(!E){var D=this._uiHash();if(this._trigger("drag",C,D)===!1){return this._mouseUp({}),!1;}this.position=D.position;
}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px";}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px";
}return A.ui.ddmanager&&A.ui.ddmanager.drag(this,C),!1;},_mouseStop:function(E){var C=!1;A.ui.ddmanager&&!this.options.dropBehaviour&&(C=A.ui.ddmanager.drop(this,E)),this.dropped&&(C=this.dropped,this.dropped=!1);
var D=this.element[0],G=!1;while(D&&(D=D.parentNode)){D==document&&(G=!0);}if(!G&&this.options.helper==="original"){return !1;
}if(this.options.revert=="invalid"&&!C||this.options.revert=="valid"&&C||this.options.revert===!0||A.isFunction(this.options.revert)&&this.options.revert.call(this.element,C)){var F=this;
A(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){F._trigger("stop",E)!==!1&&F._clear();
});}else{this._trigger("stop",E)!==!1&&this._clear();}return !1;},_mouseUp:function(C){return this.options.iframeFix===!0&&A("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this);
}),A.ui.ddmanager&&A.ui.ddmanager.dragStop(this,C),A.ui.mouse.prototype._mouseUp.call(this,C);},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this;
},_getHandle:function(D){var C=!this.options.handle||!A(this.options.handle,this.element).length?!0:!1;
return A(this.options.handle,this.element).find("*").andSelf().each(function(){this==D.target&&(C=!0);
}),C;},_createHelper:function(E){var D=this.options,C=A.isFunction(D.helper)?A(D.helper.apply(this.element[0],[E])):D.helper=="clone"?this.element.clone().removeAttr("id"):this.element;
return C.parents("body").length||C.appendTo(D.appendTo=="parent"?this.element[0].parentNode:D.appendTo),C[0]!=this.element[0]&&!/(fixed|absolute)/.test(C.css("position"))&&C.css("position","absolute"),C;
},_adjustOffsetFromHelper:function(C){typeof C=="string"&&(C=C.split(" ")),A.isArray(C)&&(C={left:+C[0],top:+C[1]||0}),"left" in C&&(this.offset.click.left=C.left+this.margins.left),"right" in C&&(this.offset.click.left=this.helperProportions.width-C.right+this.margins.left),"top" in C&&(this.offset.click.top=C.top+this.margins.top),"bottom" in C&&(this.offset.click.top=this.helperProportions.height-C.bottom+this.margins.top);
},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var C=this.offsetParent.offset();
this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&A.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(C.left+=this.scrollParent.scrollLeft(),C.top+=this.scrollParent.scrollTop());
if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&A.browser.msie){C={top:0,left:0};
}return{top:C.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:C.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)};
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var C=this.element.position();return{top:C.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:C.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()};
}return{top:0,left:0};},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0};
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};
},_setContainment:function(){var D=this.options;D.containment=="parent"&&(D.containment=this.helper[0].parentNode);
if(D.containment=="document"||D.containment=="window"){this.containment=[D.containment=="document"?0:A(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,D.containment=="document"?0:A(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(D.containment=="document"?0:A(window).scrollLeft())+A(D.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(D.containment=="document"?0:A(window).scrollTop())+(A(D.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
}if(!/^(document|window|parent)$/.test(D.containment)&&D.containment.constructor!=Array){var E=A(D.containment),C=E[0];
if(!C){return;}var G=E.offset(),F=A(C).css("overflow")!="hidden";this.containment=[(parseInt(A(C).css("borderLeftWidth"),10)||0)+(parseInt(A(C).css("paddingLeft"),10)||0),(parseInt(A(C).css("borderTopWidth"),10)||0)+(parseInt(A(C).css("paddingTop"),10)||0),(F?Math.max(C.scrollWidth,C.offsetWidth):C.offsetWidth)-(parseInt(A(C).css("borderLeftWidth"),10)||0)-(parseInt(A(C).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(F?Math.max(C.scrollHeight,C.offsetHeight):C.offsetHeight)-(parseInt(A(C).css("borderTopWidth"),10)||0)-(parseInt(A(C).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=E;
}else{D.containment.constructor==Array&&(this.containment=D.containment);}},_convertPositionTo:function(G,D){D||(D=this.position);
var C=G=="absolute"?1:-1,H=this.options,E=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!A.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,F=/(html|body)/i.test(E[0].tagName);
return{top:D.top+this.offset.relative.top*C+this.offset.parent.top*C-(A.browser.safari&&A.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():F?0:E.scrollTop())*C),left:D.left+this.offset.relative.left*C+this.offset.parent.left*C-(A.browser.safari&&A.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():F?0:E.scrollLeft())*C)};
},_generatePosition:function(G){var D=this.options,K=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!A.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,L=/(html|body)/i.test(K[0].tagName),I=G.pageX,H=G.pageY;
if(this.originalPosition){var C;if(this.containment){if(this.relative_container){var J=this.relative_container.offset();
C=[this.containment[0]+J.left,this.containment[1]+J.top,this.containment[2]+J.left,this.containment[3]+J.top];
}else{C=this.containment;}G.pageX-this.offset.click.left<C[0]&&(I=C[0]+this.offset.click.left),G.pageY-this.offset.click.top<C[1]&&(H=C[1]+this.offset.click.top),G.pageX-this.offset.click.left>C[2]&&(I=C[2]+this.offset.click.left),G.pageY-this.offset.click.top>C[3]&&(H=C[3]+this.offset.click.top);
}if(D.grid){var F=D.grid[1]?this.originalPageY+Math.round((H-this.originalPageY)/D.grid[1])*D.grid[1]:this.originalPageY;
H=C?F-this.offset.click.top<C[1]||F-this.offset.click.top>C[3]?F-this.offset.click.top<C[1]?F+D.grid[1]:F-D.grid[1]:F:F;
var E=D.grid[0]?this.originalPageX+Math.round((I-this.originalPageX)/D.grid[0])*D.grid[0]:this.originalPageX;
I=C?E-this.offset.click.left<C[0]||E-this.offset.click.left>C[2]?E-this.offset.click.left<C[0]?E+D.grid[0]:E-D.grid[0]:E:E;
}}return{top:H-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(A.browser.safari&&A.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():L?0:K.scrollTop()),left:I-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(A.browser.safari&&A.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():L?0:K.scrollLeft())};
},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1;
},_trigger:function(D,E,C){return C=C||this._uiHash(),A.ui.plugin.call(this,D,[E,C]),D=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),A.Widget.prototype._trigger.call(this,D,E,C);
},plugins:{},_uiHash:function(C){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs};
}}),A.extend(A.ui.draggable,{version:"1.8.20"}),A.ui.plugin.add("draggable","connectToSortable",{start:function(D,G){var C=A(this).data("draggable"),F=C.options,E=A.extend({},G,{item:C.element});
C.sortables=[],A(F.connectToSortable).each(function(){var H=A.data(this,"sortable");H&&!H.options.disabled&&(C.sortables.push({instance:H,shouldRevert:H.options.revert}),H.refreshPositions(),H._trigger("activate",D,E));
});},stop:function(D,F){var C=A(this).data("draggable"),E=A.extend({},F,{item:C.element});A.each(C.sortables,function(){this.instance.isOver?(this.instance.isOver=0,C.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(D),this.instance.options.helper=this.instance.options._helper,C.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",D,E));
});},drag:function(D,F){var C=A(this).data("draggable"),E=this,G=function(H){var P=this.offset.click.top,O=this.offset.click.left,N=this.positionAbs.top,M=this.positionAbs.left,L=H.height,K=H.width,J=H.top,I=H.left;
return A.ui.isOver(N+P,M+O,J,I,L,K);};A.each(C.sortables,function(H){this.instance.positionAbs=C.positionAbs,this.instance.helperProportions=C.helperProportions,this.instance.offset.click=C.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=A(E).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return F.helper[0];
},D.target=this.instance.currentItem[0],this.instance._mouseCapture(D,!0),this.instance._mouseStart(D,!0,!0),this.instance.offset.click.top=C.offset.click.top,this.instance.offset.click.left=C.offset.click.left,this.instance.offset.parent.left-=C.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=C.offset.parent.top-this.instance.offset.parent.top,C._trigger("toSortable",D),C.dropped=this.instance.element,C.currentItem=C.element,this.instance.fromOutside=C),this.instance.currentItem&&this.instance._mouseDrag(D)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",D,this.instance._uiHash(this.instance)),this.instance._mouseStop(D,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),C._trigger("fromSortable",D),C.dropped=!1);
});}}),A.ui.plugin.add("draggable","cursor",{start:function(E,F){var C=A("body"),D=A(this).data("draggable").options;
C.css("cursor")&&(D._cursor=C.css("cursor")),C.css("cursor",D.cursor);},stop:function(D,E){var C=A(this).data("draggable").options;
C._cursor&&A("body").css("cursor",C._cursor);}}),A.ui.plugin.add("draggable","opacity",{start:function(F,E){var C=A(E.helper),D=A(this).data("draggable").options;
C.css("opacity")&&(D._opacity=C.css("opacity")),C.css("opacity",D.opacity);},stop:function(E,D){var C=A(this).data("draggable").options;
C._opacity&&A(D.helper).css("opacity",C._opacity);}}),A.ui.plugin.add("draggable","scroll",{start:function(D,E){var C=A(this).data("draggable");
C.scrollParent[0]!=document&&C.scrollParent[0].tagName!="HTML"&&(C.overflowOffset=C.scrollParent.offset());
},drag:function(E,G){var D=A(this).data("draggable"),C=D.options,F=!1;if(D.scrollParent[0]!=document&&D.scrollParent[0].tagName!="HTML"){if(!C.axis||C.axis!="x"){D.overflowOffset.top+D.scrollParent[0].offsetHeight-E.pageY<C.scrollSensitivity?D.scrollParent[0].scrollTop=F=D.scrollParent[0].scrollTop+C.scrollSpeed:E.pageY-D.overflowOffset.top<C.scrollSensitivity&&(D.scrollParent[0].scrollTop=F=D.scrollParent[0].scrollTop-C.scrollSpeed);
}if(!C.axis||C.axis!="y"){D.overflowOffset.left+D.scrollParent[0].offsetWidth-E.pageX<C.scrollSensitivity?D.scrollParent[0].scrollLeft=F=D.scrollParent[0].scrollLeft+C.scrollSpeed:E.pageX-D.overflowOffset.left<C.scrollSensitivity&&(D.scrollParent[0].scrollLeft=F=D.scrollParent[0].scrollLeft-C.scrollSpeed);
}}else{if(!C.axis||C.axis!="x"){E.pageY-A(document).scrollTop()<C.scrollSensitivity?F=A(document).scrollTop(A(document).scrollTop()-C.scrollSpeed):A(window).height()-(E.pageY-A(document).scrollTop())<C.scrollSensitivity&&(F=A(document).scrollTop(A(document).scrollTop()+C.scrollSpeed));
}if(!C.axis||C.axis!="y"){E.pageX-A(document).scrollLeft()<C.scrollSensitivity?F=A(document).scrollLeft(A(document).scrollLeft()-C.scrollSpeed):A(window).width()-(E.pageX-A(document).scrollLeft())<C.scrollSensitivity&&(F=A(document).scrollLeft(A(document).scrollLeft()+C.scrollSpeed));
}}F!==!1&&A.ui.ddmanager&&!C.dropBehaviour&&A.ui.ddmanager.prepareOffsets(D,E);}}),A.ui.plugin.add("draggable","snap",{start:function(E,F){var C=A(this).data("draggable"),D=C.options;
C.snapElements=[],A(D.snap.constructor!=String?D.snap.items||":data(draggable)":D.snap).each(function(){var G=A(this),H=G.offset();
this!=C.element[0]&&C.snapElements.push({item:this,width:G.outerWidth(),height:G.outerHeight(),top:H.top,left:H.left});
});},drag:function(U,F){var C=A(this).data("draggable"),S=C.options,D=S.snapTolerance,L=F.offset.left,N=L+C.helperProportions.width,K=F.offset.top,M=K+C.helperProportions.height;
for(var E=C.snapElements.length-1;E>=0;E--){var H=C.snapElements[E].left,J=H+C.snapElements[E].width,G=C.snapElements[E].top,I=G+C.snapElements[E].height;
if(!(H-D<L&&L<J+D&&G-D<K&&K<I+D||H-D<L&&L<J+D&&G-D<M&&M<I+D||H-D<N&&N<J+D&&G-D<K&&K<I+D||H-D<N&&N<J+D&&G-D<M&&M<I+D)){C.snapElements[E].snapping&&C.options.snap.release&&C.options.snap.release.call(C.element,U,A.extend(C._uiHash(),{snapItem:C.snapElements[E].item})),C.snapElements[E].snapping=!1;
continue;}if(S.snapMode!="inner"){var R=Math.abs(G-M)<=D,Q=Math.abs(I-K)<=D,P=Math.abs(H-N)<=D,O=Math.abs(J-L)<=D;
R&&(F.position.top=C._convertPositionTo("relative",{top:G-C.helperProportions.height,left:0}).top-C.margins.top),Q&&(F.position.top=C._convertPositionTo("relative",{top:I,left:0}).top-C.margins.top),P&&(F.position.left=C._convertPositionTo("relative",{top:0,left:H-C.helperProportions.width}).left-C.margins.left),O&&(F.position.left=C._convertPositionTo("relative",{top:0,left:J}).left-C.margins.left);
}var T=R||Q||P||O;if(S.snapMode!="outer"){var R=Math.abs(G-K)<=D,Q=Math.abs(I-M)<=D,P=Math.abs(H-L)<=D,O=Math.abs(J-N)<=D;
R&&(F.position.top=C._convertPositionTo("relative",{top:G,left:0}).top-C.margins.top),Q&&(F.position.top=C._convertPositionTo("relative",{top:I-C.helperProportions.height,left:0}).top-C.margins.top),P&&(F.position.left=C._convertPositionTo("relative",{top:0,left:H}).left-C.margins.left),O&&(F.position.left=C._convertPositionTo("relative",{top:0,left:J-C.helperProportions.width}).left-C.margins.left);
}!C.snapElements[E].snapping&&(R||Q||P||O||T)&&C.options.snap.snap&&C.options.snap.snap.call(C.element,U,A.extend(C._uiHash(),{snapItem:C.snapElements[E].item})),C.snapElements[E].snapping=R||Q||P||O||T;
}}}),A.ui.plugin.add("draggable","stack",{start:function(F,G){var E=A(this).data("draggable").options,C=A.makeArray(A(E.stack)).sort(function(H,I){return(parseInt(A(H).css("zIndex"),10)||0)-(parseInt(A(I).css("zIndex"),10)||0);
});if(!C.length){return;}var D=parseInt(C[0].style.zIndex)||0;A(C).each(function(H){this.style.zIndex=D+H;
}),this[0].style.zIndex=D+C.length;}}),A.ui.plugin.add("draggable","zIndex",{start:function(F,E){var C=A(E.helper),D=A(this).data("draggable").options;
C.css("zIndex")&&(D._zIndex=C.css("zIndex")),C.css("zIndex",D.zIndex);},stop:function(E,D){var C=A(this).data("draggable").options;
C._zIndex&&A(D.helper).css("zIndex",C._zIndex);}});})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.droppable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){A.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var C=this.options,D=C.accept;
this.isover=0,this.isout=1,this.accept=A.isFunction(D)?D:function(E){return E.is(D);},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},A.ui.ddmanager.droppables[C.scope]=A.ui.ddmanager.droppables[C.scope]||[],A.ui.ddmanager.droppables[C.scope].push(this),C.addClasses&&this.element.addClass("ui-droppable");
},destroy:function(){var D=A.ui.ddmanager.droppables[this.options.scope];for(var C=0;C<D.length;C++){D[C]==this&&D.splice(C,1);
}return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"),this;
},_setOption:function(D,C){D=="accept"&&(this.accept=A.isFunction(C)?C:function(E){return E.is(C);}),A.Widget.prototype._setOption.apply(this,arguments);
},_activate:function(D){var C=A.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),C&&this._trigger("activate",D,this.ui(C));
},_deactivate:function(D){var C=A.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),C&&this._trigger("deactivate",D,this.ui(C));
},_over:function(D){var C=A.ui.ddmanager.current;if(!C||(C.currentItem||C.element)[0]==this.element[0]){return;
}this.accept.call(this.element[0],C.currentItem||C.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",D,this.ui(C)));
},_out:function(D){var C=A.ui.ddmanager.current;if(!C||(C.currentItem||C.element)[0]==this.element[0]){return;
}this.accept.call(this.element[0],C.currentItem||C.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",D,this.ui(C)));
},_drop:function(E,F){var C=F||A.ui.ddmanager.current;if(!C||(C.currentItem||C.element)[0]==this.element[0]){return !1;
}var D=!1;return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var G=A.data(this,"droppable");
if(G.options.greedy&&!G.options.disabled&&G.options.scope==C.options.scope&&G.accept.call(G.element[0],C.currentItem||C.element)&&A.ui.intersect(C,A.extend(G,{offset:G.element.offset()}),G.options.tolerance)){return D=!0,!1;
}}),D?!1:this.accept.call(this.element[0],C.currentItem||C.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",E,this.ui(C)),this.element):!1;
},ui:function(C){return{draggable:C.currentItem||C.element,helper:C.helper,position:C.position,offset:C.positionAbs};
}}),A.extend(A.ui.droppable,{version:"1.8.20"}),A.ui.intersect=function(C,F,P){if(!F.offset){return !1;
}var H=(C.positionAbs||C.position.absolute).left,L=H+C.helperProportions.width,G=(C.positionAbs||C.position.absolute).top,K=G+C.helperProportions.height,E=F.offset.left,J=E+F.proportions.width,D=F.offset.top,I=D+F.proportions.height;
switch(P){case"fit":return E<=H&&L<=J&&D<=G&&K<=I;case"intersect":return E<H+C.helperProportions.width/2&&L-C.helperProportions.width/2<J&&D<G+C.helperProportions.height/2&&K-C.helperProportions.height/2<I;
case"pointer":var O=(C.positionAbs||C.position.absolute).left+(C.clickOffset||C.offset.click).left,N=(C.positionAbs||C.position.absolute).top+(C.clickOffset||C.offset.click).top,M=A.ui.isOver(N,O,D,E,F.proportions.height,F.proportions.width);
return M;case"touch":return(G>=D&&G<=I||K>=D&&K<=I||G<D&&K>I)&&(H>=E&&H<=J||L>=E&&L<=J||H<E&&L>J);default:return !1;
}},A.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(E,G){var D=A.ui.ddmanager.droppables[E.options.scope]||[],I=G?G.type:null,H=(E.currentItem||E.element).find(":data(droppable)").andSelf();
g:for(var C=0;C<D.length;C++){if(D[C].options.disabled||E&&!D[C].accept.call(D[C].element[0],E.currentItem||E.element)){continue;
}for(var F=0;F<H.length;F++){if(H[F]==D[C].element[0]){D[C].proportions.height=0;continue g;}}D[C].visible=D[C].element.css("display")!="none";
if(!D[C].visible){continue;}I=="mousedown"&&D[C]._activate.call(D[C],G),D[C].offset=D[C].element.offset(),D[C].proportions={width:D[C].element[0].offsetWidth,height:D[C].element[0].offsetHeight};
}},drop:function(C,E){var D=!1;return A.each(A.ui.ddmanager.droppables[C.options.scope]||[],function(){if(!this.options){return;
}!this.options.disabled&&this.visible&&A.ui.intersect(C,this,this.options.tolerance)&&(D=this._drop.call(this,E)||D),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],C.currentItem||C.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,E));
}),D;},dragStart:function(C,D){C.element.parents(":not(body,html)").bind("scroll.droppable",function(){C.options.refreshPositions||A.ui.ddmanager.prepareOffsets(C,D);
});},drag:function(C,D){C.options.refreshPositions&&A.ui.ddmanager.prepareOffsets(C,D),A.each(A.ui.ddmanager.droppables[C.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return;
}var H=A.ui.intersect(C,this,this.options.tolerance),F=!H&&this.isover==1?"isout":H&&this.isover==0?"isover":null;
if(!F){return;}var E;if(this.options.greedy){var G=this.element.parents(":data(droppable):eq(0)");G.length&&(E=A.data(G[0],"droppable"),E.greedyChild=F=="isover"?1:0);
}E&&F=="isover"&&(E.isover=0,E.isout=1,E._out.call(E,D)),this[F]=1,this[F=="isout"?"isover":"isout"]=0,this[F=="isover"?"_over":"_out"].call(this,D),E&&F=="isout"&&(E.isout=0,E.isover=1,E._over.call(E,D));
});},dragStop:function(C,D){C.element.parents(":not(body,html)").unbind("scroll.droppable"),C.options.refreshPositions||A.ui.ddmanager.prepareOffsets(C,D);
}};})(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
jQuery.effects||function(A,C){function I(N){var M;
return N&&N.constructor==Array&&N.length==3?N:(M=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(N))?[parseInt(M[1],10),parseInt(M[2],10),parseInt(M[3],10)]:(M=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(N))?[parseFloat(M[1])*2.55,parseFloat(M[2])*2.55,parseFloat(M[3])*2.55]:(M=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(N))?[parseInt(M[1],16),parseInt(M[2],16),parseInt(M[3],16)]:(M=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(N))?[parseInt(M[1]+M[1],16),parseInt(M[2]+M[2],16),parseInt(M[3]+M[3],16)]:(M=/rgba\(0, 0, 0, 0\)/.exec(N))?H.transparent:H[A.trim(N).toLowerCase()];
}function L(M,O){var N;do{N=A.curCSS(M,O);if(N!=""&&N!="transparent"||A.nodeName(M,"body")){break;}O="backgroundColor";
}while(M=M.parentNode);return I(N);}function F(){var M=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,O={},N,Q;
if(M&&M.length&&M[0]&&M[M[0]]){var P=M.length;while(P--){N=M[P],typeof M[N]=="string"&&(Q=N.replace(/\-(\w)/g,function(S,R){return R.toUpperCase();
}),O[Q]=M[N]);}}else{for(N in M){typeof M[N]=="string"&&(O[N]=M[N]);}}return O;}function E(N){var M,O;
for(M in N){O=N[M],(O==null||A.isFunction(O)||M in K||/scrollbar/.test(M)||!/color/i.test(M)&&isNaN(parseFloat(O)))&&delete N[M];
}return N;}function J(P,N){var O={_:0},M;for(M in N){P[M]!=N[M]&&(O[M]=N[M]);}return O;}function B(P,N,M,O){typeof P=="object"&&(O=N,M=null,N=P,P=N.effect),A.isFunction(N)&&(O=N,M=null,N={});
if(typeof N=="number"||A.fx.speeds[N]){O=M,M=N,N={};}return A.isFunction(M)&&(O=M,M=null),N=N||{},M=M||N.duration,M=A.fx.off?0:typeof M=="number"?M:M in A.fx.speeds?A.fx.speeds[M]:A.fx.speeds._default,O=O||N.complete,[P,N,M,O];
}function D(M){return !M||typeof M=="number"||A.fx.speeds[M]?!0:typeof M=="string"&&!A.effects[M]?!0:!1;
}A.effects={},A.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(N,M){A.fx.step[M]=function(O){O.colorInit||(O.start=L(O.elem,M),O.end=I(O.end),O.colorInit=!0),O.elem.style[M]="rgb("+Math.max(Math.min(parseInt(O.pos*(O.end[0]-O.start[0])+O.start[0],10),255),0)+","+Math.max(Math.min(parseInt(O.pos*(O.end[1]-O.start[1])+O.start[1],10),255),0)+","+Math.max(Math.min(parseInt(O.pos*(O.end[2]-O.start[2])+O.start[2],10),255),0)+")";
};});var H={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},G=["add","remove","toggle"],K={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};
A.effects.animateClass=function(M,P,N,O){return A.isFunction(N)&&(O=N,N=null),this.queue(function(){var Q=A(this),S=Q.attr("style")||" ",T=E(F.call(this)),R,U=Q.attr("class")||"";
A.each(G,function(W,V){M[V]&&Q[V+"Class"](M[V]);}),R=E(F.call(this)),Q.attr("class",U),Q.animate(J(T,R),{queue:!1,duration:P,easing:N,complete:function(){A.each(G,function(W,V){M[V]&&Q[V+"Class"](M[V]);
}),typeof Q.attr("style")=="object"?(Q.attr("style").cssText="",Q.attr("style").cssText=S):Q.attr("style",S),O&&O.apply(this,arguments),A.dequeue(this);
}});});},A.fn.extend({_addClass:A.fn.addClass,addClass:function(M,N,P,O){return N?A.effects.animateClass.apply(this,[{add:M},N,P,O]):this._addClass(M);
},_removeClass:A.fn.removeClass,removeClass:function(M,N,P,O){return N?A.effects.animateClass.apply(this,[{remove:M},N,P,O]):this._removeClass(M);
},_toggleClass:A.fn.toggleClass,toggleClass:function(N,M,O,P,Q){return typeof M=="boolean"||M===C?O?A.effects.animateClass.apply(this,[M?{add:N}:{remove:N},O,P,Q]):this._toggleClass(N,M):A.effects.animateClass.apply(this,[{toggle:N},M,O,P]);
},switchClass:function(M,Q,P,O,N){return A.effects.animateClass.apply(this,[{add:Q,remove:M},P,O,N]);
}}),A.extend(A.effects,{version:"1.8.20",save:function(O,N){for(var M=0;M<N.length;M++){N[M]!==null&&O.data("ec.storage."+N[M],O[0].style[N[M]]);
}},restore:function(O,N){for(var M=0;M<N.length;M++){N[M]!==null&&O.css(N[M],O.data("ec.storage."+N[M]));
}},setMode:function(N,M){return M=="toggle"&&(M=N.is(":hidden")?"show":"hide"),M;},getBaseline:function(O,P){var N,M;
switch(O[0]){case"top":N=0;break;case"middle":N=0.5;break;case"bottom":N=1;break;default:N=O[0]/P.height;
}switch(O[1]){case"left":M=0;break;case"center":M=0.5;break;case"right":M=1;break;default:M=O[1]/P.width;
}return{x:M,y:N};},createWrapper:function(M){if(M.parent().is(".ui-effects-wrapper")){return M.parent();
}var N={width:M.outerWidth(!0),height:M.outerHeight(!0),"float":M.css("float")},O=A("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),P=document.activeElement;
return M.wrap(O),(M[0]===P||A.contains(M[0],P))&&A(P).focus(),O=M.parent(),M.css("position")=="static"?(O.css({position:"relative"}),M.css({position:"relative"})):(A.extend(N,{position:M.css("position"),zIndex:M.css("z-index")}),A.each(["top","left","bottom","right"],function(R,Q){N[Q]=M.css(Q),isNaN(parseInt(N[Q],10))&&(N[Q]="auto");
}),M.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),O.css(N).show();},removeWrapper:function(M){var O,N=document.activeElement;
return M.parent().is(".ui-effects-wrapper")?(O=M.parent().replaceWith(M),(M[0]===N||A.contains(M[0],N))&&A(N).focus(),O):M;
},setTransition:function(N,P,O,M){return M=M||{},A.each(P,function(S,R){var Q=N.cssUnit(R);Q[0]>0&&(M[R]=Q[0]*O+Q[1]);
}),M;}}),A.fn.extend({effect:function(Q,T,S,R){var N=B.apply(this,arguments),M={options:N[1],duration:N[2],callback:N[3]},P=M.options.mode,O=A.effects[Q];
return A.fx.off||!O?P?this[P](M.duration,M.callback):this.each(function(){M.callback&&M.callback.call(this);
}):O.call(this,M);},_show:A.fn.show,show:function(N){if(D(N)){return this._show.apply(this,arguments);
}var M=B.apply(this,arguments);return M[1].mode="show",this.effect.apply(this,M);},_hide:A.fn.hide,hide:function(N){if(D(N)){return this._hide.apply(this,arguments);
}var M=B.apply(this,arguments);return M[1].mode="hide",this.effect.apply(this,M);},__toggle:A.fn.toggle,toggle:function(M){if(D(M)||typeof M=="boolean"||A.isFunction(M)){return this.__toggle.apply(this,arguments);
}var N=B.apply(this,arguments);return N[1].mode="toggle",this.effect.apply(this,N);},cssUnit:function(O){var N=this.css(O),M=[];
return A.each(["em","px","%","pt"],function(Q,P){N.indexOf(P)>0&&(M=[parseFloat(N),P]);}),M;}}),A.easing.jswing=A.easing.swing,A.extend(A.easing,{def:"easeOutQuad",swing:function(M,Q,P,O,N){return A.easing[A.easing.def](M,Q,P,O,N);
},easeInQuad:function(Q,M,P,O,N){return O*(M/=N)*M+P;},easeOutQuad:function(Q,M,P,O,N){return -O*(M/=N)*(M-2)+P;
},easeInOutQuad:function(Q,M,O,N,P){return(M/=P/2)<1?N/2*M*M+O:-N/2*(--M*(M-2)-1)+O;},easeInCubic:function(Q,M,P,O,N){return O*(M/=N)*M*M+P;
},easeOutCubic:function(Q,M,P,O,N){return O*((M=M/N-1)*M*M+1)+P;},easeInOutCubic:function(Q,M,O,N,P){return(M/=P/2)<1?N/2*M*M*M+O:N/2*((M-=2)*M*M+2)+O;
},easeInQuart:function(Q,M,P,O,N){return O*(M/=N)*M*M*M+P;},easeOutQuart:function(Q,M,P,O,N){return -O*((M=M/N-1)*M*M*M-1)+P;
},easeInOutQuart:function(Q,M,O,N,P){return(M/=P/2)<1?N/2*M*M*M*M+O:-N/2*((M-=2)*M*M*M-2)+O;},easeInQuint:function(Q,M,P,O,N){return O*(M/=N)*M*M*M*M+P;
},easeOutQuint:function(Q,M,P,O,N){return O*((M=M/N-1)*M*M*M*M+1)+P;},easeInOutQuint:function(Q,M,O,N,P){return(M/=P/2)<1?N/2*M*M*M*M*M+O:N/2*((M-=2)*M*M*M*M+2)+O;
},easeInSine:function(Q,N,P,M,O){return -M*Math.cos(N/O*(Math.PI/2))+M+P;},easeOutSine:function(Q,M,P,O,N){return O*Math.sin(M/N*(Math.PI/2))+P;
},easeInOutSine:function(Q,M,P,O,N){return -O/2*(Math.cos(Math.PI*M/N)-1)+P;},easeInExpo:function(Q,M,N,P,O){return M==0?N:P*Math.pow(2,10*(M/O-1))+N;
},easeOutExpo:function(Q,M,P,O,N){return M==N?P+O:O*(-Math.pow(2,-10*M/N)+1)+P;},easeInOutExpo:function(Q,M,N,O,P){return M==0?N:M==P?N+O:(M/=P/2)<1?O/2*Math.pow(2,10*(M-1))+N:O/2*(-Math.pow(2,-10*--M)+2)+N;
},easeInCirc:function(Q,M,P,O,N){return -O*(Math.sqrt(1-(M/=N)*M)-1)+P;},easeOutCirc:function(Q,M,P,O,N){return O*Math.sqrt(1-(M=M/N-1)*M)+P;
},easeInOutCirc:function(Q,M,O,N,P){return(M/=P/2)<1?-N/2*(Math.sqrt(1-M*M)-1)+O:N/2*(Math.sqrt(1-(M-=2)*M)+1)+O;
},easeInElastic:function(T,O,R,N,Q){var S=1.70158,M=0,P=N;if(O==0){return R;}if((O/=Q)==1){return R+N;
}M||(M=Q*0.3);if(P<Math.abs(N)){P=N;var S=M/4;}else{var S=M/(2*Math.PI)*Math.asin(N/P);}return -(P*Math.pow(2,10*(O-=1))*Math.sin((O*Q-S)*2*Math.PI/M))+R;
},easeOutElastic:function(T,O,R,M,Q){var S=1.70158,N=0,P=M;if(O==0){return R;}if((O/=Q)==1){return R+M;
}N||(N=Q*0.3);if(P<Math.abs(M)){P=M;var S=N/4;}else{var S=N/(2*Math.PI)*Math.asin(M/P);}return P*Math.pow(2,-10*O)*Math.sin((O*Q-S)*2*Math.PI/N)+M+R;
},easeInOutElastic:function(T,M,R,O,Q){var S=1.70158,N=0,P=O;if(M==0){return R;}if((M/=Q/2)==2){return R+O;
}N||(N=Q*0.3*1.5);if(P<Math.abs(O)){P=O;var S=N/4;}else{var S=N/(2*Math.PI)*Math.asin(O/P);}return M<1?-0.5*P*Math.pow(2,10*(M-=1))*Math.sin((M*Q-S)*2*Math.PI/N)+R:P*Math.pow(2,-10*(M-=1))*Math.sin((M*Q-S)*2*Math.PI/N)*0.5+O+R;
},easeInBack:function(R,N,Q,P,O,M){return M==C&&(M=1.70158),P*(N/=O)*N*((M+1)*N-M)+Q;},easeOutBack:function(R,N,Q,P,O,M){return M==C&&(M=1.70158),P*((N=N/O-1)*N*((M+1)*N+M)+1)+Q;
},easeInOutBack:function(R,M,P,O,Q,N){return N==C&&(N=1.70158),(M/=Q/2)<1?O/2*M*M*(((N*=1.525)+1)*M-N)+P:O/2*((M-=2)*M*(((N*=1.525)+1)*M+N)+2)+P;
},easeInBounce:function(O,Q,P,N,M){return N-A.easing.easeOutBounce(O,M-Q,0,N,M)+P;},easeOutBounce:function(Q,M,O,N,P){return(M/=P)<1/2.75?N*7.5625*M*M+O:M<2/2.75?N*(7.5625*(M-=1.5/2.75)*M+0.75)+O:M<2.5/2.75?N*(7.5625*(M-=2.25/2.75)*M+0.9375)+O:N*(7.5625*(M-=2.625/2.75)*M+0.984375)+O;
},easeInOutBounce:function(P,O,Q,N,M){return O<M/2?A.easing.easeInBounce(P,O*2,0,N,M)*0.5+Q:A.easing.easeOutBounce(P,O*2-M,0,N,M)*0.5+N*0.5+Q;
}});}(jQuery);
/* jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.pulsate.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(A,B){A.effects.pulsate=function(C){return this.queue(function(){var D=A(this),J=A.effects.setMode(D,C.options.mode||"show"),I=(C.options.times||5)*2-1,H=C.duration?C.duration/2:A.fx.speeds._default/2,F=D.is(":visible"),E=0;
F||(D.css("opacity",0).show(),E=1),(J=="hide"&&F||J=="show"&&!F)&&I--;for(var G=0;G<I;G++){D.animate({opacity:E},H,C.options.easing),E=(E+1)%2;
}D.animate({opacity:E},H,C.options.easing,function(){E==0&&D.hide(),C.callback&&C.callback.apply(this,arguments);
}),D.queue("fx",function(){D.dequeue();}).dequeue();});};})(jQuery);
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(B){B.support.touch="ontouchend" in document;
if(!B.support.touch){return;}var D=B.ui.mouse.prototype,E=D._mouseInit,C;function A(G,I){if(G.originalEvent.touches.length>1){return;
}G.preventDefault();var F=G.originalEvent.changedTouches[0],H=document.createEvent("MouseEvents");H.initMouseEvent(I,true,true,window,1,F.screenX,F.screenY,F.clientX,F.clientY,false,false,false,false,0,null);
G.target.dispatchEvent(H);}D._touchStart=function(F){var G=this;if(C||!G._mouseCapture(F.originalEvent.changedTouches[0])){return;
}C=true;G._touchMoved=false;A(F,"mouseover");A(F,"mousemove");A(F,"mousedown");};D._touchMove=function(F){if(!C){return;
}this._touchMoved=true;A(F,"mousemove");};D._touchEnd=function(F){if(!C){return;}A(F,"mouseup");A(F,"mouseout");
if(!this._touchMoved){A(F,"click");}C=false;};D._mouseInit=function(){var F=this;F.element.bind("touchstart",B.proxy(F,"_touchStart")).bind("touchmove",B.proxy(F,"_touchMove")).bind("touchend",B.proxy(F,"_touchEnd"));
E.call(F);};})(jQuery);var padautolink=(function(){var A=null;var B={init:function(){var C=$.extend({},$.Autocompleter.defaults,{width:"250px",formatMatch:function(w){return w[1];
},max:10,matchContains:"word",selectFirst:true,scroll:false,data:[],dataPeople:[],dataFiles:[],dataPads:[],dataTags:[]});
var L=null;var P={};var r=5;var N={};var T=null;var D=null;var I=null;var F=null;var O=null;var H=null;
var Y=null;var W=null;var b=pad.getPadId();var j=1000*60*60*1;var d=linestylefilter.REGEX_HASHTAG;var U=new RegExp(/:[-a-zA-Z0-9_+]+:?/g);
var E={AT:"at-linking",ATLESS:"atless-linking",HASHTAG:"hashtag",EMOJI:"emoji",};function M(){if(A&&F){A("finish");
}T=D=I=F=O=null;N={};P={};J.hide();}function R(y,x){var w;padeditor.ace.callWithAce(function(z){w=z.getTextInRange(y,x);
});return w;}function s(w,y){if($.browser.mozilla){var x=[w[0],w[1]+y.length];padeditor.ace.replaceRange(x,x," ");
}}function K(w,x,z,AA,y){if(y){var AB=R(w,x);if(AB!=y){return;}}padeditor.ace.replaceRange(w,x,z,AA);
s(w,z);}function V(w){$.ajax({mode:"abort",port:"preloadContacts",dataType:C.dataType,url:"/ep/invite/prefixes",data:{padid:b,excludefacebook:true},success:function(z){L=z.data;
var y=new Date().getTime();var x={timestamp:y,prefixDict:L};prefixDictJSON=JSON.stringify(x);if(localStorage){localStorage.setItem(w,prefixDictJSON);
}}});}function t(){var AB=clientVars.encryptedUserId;var w="hackpad.user."+AB+".contactsPrefixes";var y=localStorage?localStorage.getItem(w):null;
if(y){var x=JSON.parse(y);L=x.prefixDict;var AA=x.timestamp;var z=new Date().getTime();if(z-AA>j){V(w);
}}else{V(w);}}function n(x,y){var y;if(y==undefined){var y=4;}var w=x;if(x.length>y){w=x.substr(0,y);
}w=w.split(" ")[0];return w;}function Q(w,AC){if(typeof w=="undefined"&&typeof AC=="undefined"||w.data==null){var AG=J.current();
w=$.data(AG,"ac_data");AC=$(AG).index();}if(!w.data[1]){return;}var x="padlink";var AA="";var AI={selectedIndex:AC};
if(w.data[2]=="dropbox"){x="dropboxlink";}else{if(w.data[2]=="__AUTOCREATE__"){x="newpad";}else{if(w.data[2].indexOf("/ep/profile")==0){x="mention";
AA="hp";}else{if(w.data[3]=="email"){x="mention";AA="google";}else{if(w.data[3]=="hashtag"){x="hashtag";
AA=w.data[1];}else{if(w.data[3]=="emoji"){x="emoji";AA=w.data[1];}}}}}}trackEvent("autocompleted",x,AA,AI);
if(w.data[3]=="emoji"){var AJ=w.data[1];K(D,I,":"+AJ+": ");}else{if(w.data[3]=="hashtag"){var AE=w.data[1];
var AK="/ep/search/search?q="+encodeURIComponent(AE);K(D,I,AE,[["link",AK]]);}else{if(w.data[2]=="dropbox"){var y=D;
var z=I;var AB=w.data[1];var AH=("/ep/dropbox/redirect2?uid="+clientVars.encryptedUserId+"&path="+encodeURIComponent(AB));
K(y,z,AB,[["link",AH]]);}else{if(w.data[2]=="__AUTOCREATE__"){var AD=w.data[1];var AM=AD.replace(/ /g,"-");
var y=D;var z=I;var AF=R(y,z);$.post("/ep/pad/ajax_create",{title:AD,content:"",sourcePadId:pad.getPadId()},function(AN){var AP="/"+AN+"#"+AM;
var AO=w.data[1];K(y,z,AO,[["link",AP]],AF);});}else{if(w.data[3]=="email"){var AD=w.data[1];var AM=AD.replace(/ /g,"-");
var y=D;var z=I;var AF=R(y,z);$.post("/ep/pad/emailinvite",{padId:pad.getPadId(),toAddress:w.data[2]},function(AN){var AP=w.data[1].replace(/<.*>/g,"");
var AO=$.trim(AP);K(y,z,AO,[["link",AN]],AF);});}else{var AL=w.data[1].replace(/<.*>/g,"");var AB=$.trim(AL);
K(D,I,AB,[["link",w.data[2]]]);}}}}}M();}B.finish=Q;function a(AA,x,y,AC,AB){J.display(x,AA);if(A){A("autocomplete",x);
}else{var z=$("#editor").offset();var w={x:AB.x+z.left,y:AB.y+z.top};if(!D||y[0]!=D[0]||y[1]!=D[1]||!O||w.y!=O.y){J.show(w.x+"px",w.y+"px");
}}T=AA;D=y;I=AC;F=x&&x.length>0;O=w;}var J=$.Autocompleter.Select(C,padeditor.ace,Q,{});var G=$.Autocompleter.Cache(C);
t();function u(w){return"/ep/search/?q="+encodeURIComponent(w);}function h(w){if(!w.success||!w.data){return;
}w=w.data;var z=[];for(var x in w){var AB=u(x);var y=[x,x,AB,"hashtag"];y[0]='<div style="white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;">'+y[0]+"</div>";
z.push(y);}var AA={};$.each(C.dataTags,function(AD,AC){AA[AC[0]]=true;});$.each(z,function(AD,AC){if(!AA[AC[0]]){C.dataTags.push(AC);
}});C.data=C.dataTags;G.populate();}function l(AC){var AA=[];for(var w=0;w<AC.length;++w){var y=AC[w];
var z=[y,y,"","emoji"];z[0]='<div style="white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;"><span class="emoji-glyph" style="background-image:url('+clientVars.cdn+"/static/img/emoji/"+y+'.png)"></span>'+z[0]+"</div>";
AA.push(z);}var AB={};$.each(C.dataTags,function(AD,x){AB[x[0]]=true;});$.each(AA,function(AD,x){if(!AB[x[0]]){C.dataTags.push(x);
}});C.data=C.dataTags;G.populate();}function p(x,AD){if(!x.success||!x.data){return;}x=x.data;var AA={hp:"<img src='/static/favicon.png' style='float: left; padding-right: 4px;' width='16' height='16'/>",fb:"<img src='https://facebook.com/favicon.ico' style='float: left; padding-right: 4px;' width='16' height='16'/>",email:"<img src='https://mail.google.com/favicon.ico' style='float: left; padding-right: 4px;' width='16' height='16'/>"};
var AC=x.split("\n");var z=[];for(var y=0;y<AC.length;y++){var w=$.trim(AC[y]);if(w){w=w.split("|");if(w[2] in AA){w=[AA[w[2]]+w[0]].concat(w);
w[0]='<div style="white-space: nowrap;  overflow: hidden; text-overflow: ellipsis;">'+w[0]+"</div>";}z.push(w);
}}var AB={};$.each(C.dataPeople,function(AF,AE){AB[AE[0]]=true;});$.each(z,function(AF,AE){if(!AB[AE[0]]){C.dataPeople.push(AE);
}});C.data=C.dataPeople;if(AD==E.AT){C.data=C.data.concat(C.dataPads).concat(C.dataFiles);}G.populate();
}function o(AA,z){var y=[];var w=JSON.parse(AA);N[z]=w.length;for(var x=0;x<w.length;x++){y.push(["<img src='/static/img/dropbox.png' style='float: left; padding-right: 4px;' width='16' height='16'/>"+w[x].path,w[x].path,"dropbox"]);
}C.dataFiles=y;C.data=C.dataPeople.concat(C.dataPads).concat(C.dataFiles);G.populate();}function S(x){if(H){var w=H.query;
if(w&&x.indexOf(w)==0){var z=H.ajaxResults||H.numResults>0;if(z){var y=G.load(x.toLowerCase())||[];if(y.length==0){return true;
}}}}return false;}function X(w){d.lastIndex=0;return w=="#"||d.test(w);}function Z(w){U.lastIndex=0;return w==":"||U.test(w);
}function q(w,z){var y=w.data[1].toLowerCase();var x=y.indexOf(z);var AA=-x;w.score=AA;}function c(x){var w=x.data[3];
return(w=="hp"||w=="email"||w=="fb");}function m(w,x){w.forEach(function(y){q(y,x);});w.sort(function(z,y){var AC=c(z);
var AD=c(y);if(AC||AD){if(!AD){return -1;}if(!AC){return 1;}}if(z.score>y.score){return -1;}if(z.score<y.score){return 1;
}if(z.data[3]=="hp"&&y.data[3]!="hp"){return -1;}if(z.data[3]!="hp"&&y.data[3]=="hp"){return 1;}var AB=z.data[4]?parseInt(z.data[4]):null;
var AA=y.data[4]?parseInt(y.data[4]):null;if(AB||AA){if(!AA){return -1;}if(!AB){return 1;}if(AB>AA){return -1;
}if(AB<AA){return 1;}}var AF=z.data[1].toLowerCase();var AE=y.data[1].toLowerCase();return AF.localeCompare(AE);
});return w;}function v(w,x){if(!w){return false;}if(w[0]=="@"){return true;}if(X(w)||Z(w)){if(S(w.substr(1))){D=null;
return false;}D=x;return true;}var y=n(w);if(L){var z=y.length>3&&L[y];if(z){if(S(w)){D=null;return false;
}D=x;return true;}else{D=null;return false;}}if(w.length>3&&w[0].toUpperCase()==w[0]){if(S(w)){D=null;
return false;}D=x;return true;}return false;}function f(w,z,AB,AC,AA){if(!w||z=="cancel"||!AA){M();return F;
}var x;var AE;switch(w[0]){case"@":x=E.AT;AE="Link to Hackpads and People";break;case"#":x=E.HASHTAG;
if(!X(w)){M();return F;}break;case":":x=E.EMOJI;if(!Z(w)){M();return F;}break;default:x=E.ATLESS;}var AD=pad.getPadOptions().guestPolicy;
if((x!=Y)||(AD!=W)){G.flush();P={};}Y=x;W=AD;if(x==E.AT&&w.length==1){var AF=[{data:["<span style='font-style: italic; color: grey;' class='placeholder'>"+AE+"</span>"],result:null,value:null}];
a(w,AF,AB,AC,AA);return F;}if(x!=E.ATLESS){w=w.substr(1);}if(w==T){if(z=="up"){J.prev();return F;}else{if(z=="down"){J.next();
return F;}else{if(z=="enter"){if(A){M();return F;}var AH=F;Q();return AH;}}}}function y(AK){var AL=padutils.escapeHtml(AK);
var AJ=G.load(AK.toLowerCase())||[];if(x!=E.HASHTAG&&x!=E.EMOJI){AJ=m(AJ,AK.toLowerCase());}if(x==E.AT){AJ=AJ.slice(0,C.max-1);
AJ.push({data:["<span style='font-style: italic;'>Create pad "+AL+"</span>",AK,"__AUTOCREATE__"],result:null,value:null});
}if(AJ.length){a(AK,AJ,AB,AC,AA);}H={query:AK,numResults:AJ.length};}y(w);if(P[w.toLowerCase()]){return F;
}if(x==E.HASHTAG){$.ajax({mode:"abort",port:"autocompletehashtag",dataType:C.dataType,url:"/ep/search/hashtags",data:{q:w.toLowerCase(),},success:function(AJ){if(D==null){return;
}h(AJ);y(w);H.ajaxResults=true;}});}else{if(x==E.EMOJI){if(D==null){return;}l(linestylefilter.EMOJI_LIST);
y(w);H.ajaxResults=true;}else{$.ajax({mode:"abort",port:"autocompletemention",dataType:C.dataType,url:"/ep/invite/autocomplete",data:{padid:b,ismention:true,userlink:true,q:w.toLowerCase(),limit:C.max-1,excludefacebook:true,isatless:(x==E.ATLESS)},success:function(AJ){if(D==null){return;
}p(AJ,x);y(w);H.ajaxResults=true;}});}}if(x==E.AT){function AG(AJ){AJ=AJ&&AJ.data;if(!AJ||!AJ.length){return;
}AJ=AJ.split("\n");var AM=[];for(var AK=0;AK<AJ.length;AK++){var AL=AJ[AK].split("|");AM.push([AL[0],AL[0],"/"+AL[1]]);
}C.dataPads=AM;C.data=C.dataPeople.concat(C.dataPads).concat(C.dataFiles);G.populate();}$.ajax({mode:"abort",port:"searchautocomplete",dataType:C.dataType,url:"/ep/search/autocomplete",data:{userlink:true,q:w.toLowerCase(),limit:C.max-1},success:function(AJ){if(D==null){return;
}AG(AJ);y(w);}});if(clientVars.dropboxConnected&&false){var AI=N[w.toLowerCase()]&&N[w.toLowerCase()]<r;
if(!AI){$.ajax({mode:"abort",port:"autocompletedropbox",url:"/ep/dropbox/files",data:{q:w.toLowerCase()},success:function(AJ){if(D==null){return;
}o(AJ,w.toLowerCase());y(w);}});}}}P[w.toLowerCase()]=true;return F;}padeditor.ace.setTriggerLink(v);
padeditor.ace.setAutocompleteCallback(f);},setAutocompleteHandler:function(C){A=C;}};return B;}());padcollections=(function(){var F;
var C;var D;var E;var G=false;function J(){C.on("click",".group-link",function(Q){return;});F.on("click",".group-link .remove-group-btn",function(Q){L($(Q.target));
return false;});$("#add-to-collection").click(function(){$("#collection-picker").val("").focus();A(true);
trackEvent("collection.add_from_pad");});var P=false;$("#collection-picker").focus(function(Q){$("#collections-div").addClass("sticky");
}).click(function(Q){$("#collections-div").addClass("sticky");return false;});$("#collection-picker").blur(function(Q){if(!P){A(false);
$("#collections-div").removeClass("sticky");}});$("#collection-invite-list-item").on("click",function(){return false;
});E.on("mousedown",".add-group",function(R){P=true;var Q=R.target;$(window).one("mouseup",function(S){P=false;
if(S.target==Q){O($(Q));var T={selectedIndex:$(Q).index()};trackEvent("collection.add_from_list","","",T);
}else{A(false);}});});}function B(P){alert(P);}function O(Q){var P=Q;var R=P.attr("groupId");var S=pad.getPadId();
$.ajax({type:"post",url:"/ep/group/add-pad",data:{padId:pad.getPadId(),groupId:R},success:function(T){if(T.success){A(false);
P.remove();if(!E.find(".add-group").length){$("#collections-recent-label").hide();}}else{B(T.message);
}}}).fail(function(T,U){B("An error has occurred. We're looking into it.");});}function L(Q){var P=Q.parents(".group-link");
var R=P.attr("groupId");var S=pad.getPadId();$.ajax({type:"post",url:"/ep/group/removepad",data:{padId:pad.getPadId(),groupId:R},success:function(T){if(T.success){P.remove();
}else{B(T.error);}}}).fail(function(T,U){B("An error has occurred. Please contact support@hackpad.com if this error persists.");
});}function A(P){return;if(P){$("#add-to-collection").hide();$("#collection-picker-div").fadeIn(100);
$("#collection-picker").focus();}else{$("#collection-picker-div").fadeOut(150,function(){$("#add-to-collection").show();
});}}function H(){return clientVars.invitedGroupInfos.map(function(P){return P.groupId;}).join(",");}function K(){$("#collection-picker").invite({target:"Pad",minChars:0,createCollection:true,width:263,inviteItemHandlers:{hpgroup:{url:"/ep/group/add-pad",argsCallback:function(P){return{padId:pad.getPadId(),groupId:P[2]};
},onSuccess:function(){A(false);trackEvent("collection.add_autocompleted");},onFailure:function(P){B(P.message);
}},newgroup:{url:"/ep/group/create-with-pad",argsCallback:function(P){A(false);return{padId:pad.getPadId(),groupName:P[1]};
},onSuccess:function(){A(false);trackEvent("collection.create_with_pad");},onFailure:function(P){B(P.error);
trackEvent("collection.duplicate_alert");}}},dataURL:"/ep/invite/group_autocomplete",prompt:"Enter a collection name",noCache:true,extraParams:{excludeIds:H()}});
}function N(){D.toggle();}function I(){return;$.ajax({type:"get",url:"/ep/invite/recent-groups",data:{excludeIds:H()},success:function(Q){if(Q.success){var P=Q.html.replace(/^\s+|\s+$/g,"");
$("#collections-recent-list").empty().append(P);if($(P).length){$("#collections-recent-label").show();
}}}});}var M={init:function(Q){if(G){return;}var P=$.extend({$collectionsDivEl:$("#collections-div"),$collectionsListEl:$("#collection-list-div"),$collectionsListOverflowEl:$("#collection-list-overflow"),$recentCollectionsEl:$("#collections-recent-list-wrapper"),},Q);
F=P.$collectionsDivEl;C=P.$collectionsListEl;D=P.$collectionsListOverflowEl;E=P.$recentCollectionsEl;
J();K();I();G=true;},renderPadCollections:function(){F.find("div.group-link").remove();for(var P=0;P<clientVars.invitedGroupInfos.length;
P++){var Q=clientVars.invitedGroupInfos[P];var R=$("<div/>").addClass("group-link").attr("groupId",Q.groupId);
var T=$("<a/>").attr("href","/ep/group/"+Q.groupId).attr("title",Q.name).append(Q.name).appendTo(R);var S=$("<div/>").addClass("remove-group-btn").attr("title","Remove this pad from this collection.").append($('<i class="icon-x">')).appendTo(R);
if(P==2){C.append($("<div>").addClass("group-link").addClass("group-link-overflow").append($("<a>").on("click",N).text("...")));
}if(P>1){D.append(R);}else{C.append(R);}}$("#add-to-collection").toggleClass("no-collections",clientVars.invitedGroupInfos.length==0);
buttonCloseMenu($("#add-to-collection"));},loadCandidateCollections:I};return M;})();
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padconnectionstatus=(function(){var A={what:"connecting"};
var C;var B={init:function(){$("button#forcereconnect").click(function(){return pad.forceReconnect();
});$("#connectionbox .dialog-cancel-x").on("click",function(){$("#modaloverlay").hide();$("#connectionbox").addClass("compact");
$(".connection-status").hide();});$("#freakout-copy-first").on("click",function(){$("#modaloverlay").hide();
$("#freakout-dialog").addClass("compact");$("#freakout-copy-first").hide();$(".connection-status").hide();
});},connected:function(){B.clearReconnectTimer();A={what:"connected"};$("#connectionbox").removeClass("compact");
$(".connection-status").hide();},reconnecting:function(){B.clearReconnectTimer();A={what:"reconnecting"};
C=setTimeout(function(){$(".connection-status").show();},1500);},disconnected:function(E){B.clearReconnectTimer();
A={what:"disconnected",why:E};var D=String(E).toLowerCase();if(!(D=="userdup"||D=="looping"||D=="slowcommit"||D=="initsocketfail"||D=="unauth")){D="unknown";
}var F="modaldialog cboxdisconnected cboxdisconnected_"+D;$("#connectionbox").get(0).className=F;padmodals.showModal("#connectionbox",500,true);
},isFullyConnected:function(){return A.what=="connected";},getStatus:function(){return A;},clearReconnectTimer:function(){clearTimeout(C);
C=null;}};return B;}());var paddemo={demoModeOn:false,hpTeam:{colorId:1,name:"Julia Kuznetsov",status:"connected",userId:"p.76052",userLink:"/ep/profile/tbtk1T1g8Y5",userPic:"https://hackpad.imgix.net/http%3A%2F%2Fs3.amazonaws.com%2Fhackpad-profile-photos%2Fjulia.kuznetsov%40gmail.com%3F1385942605841"},script:[{text:"Julia from the Hackpad team here.  Try typing something below to work with me on this document.  \n\n\n\n\n\n\n\n\n\n\n",line:2},{text:"Great!  Now let's try some fun stuff.  Type // (followed by a space) at the beginning of a line to make a comment.  ",line:3},{text:"Thanks for the comment!  Try typing [ ] (followed by a space) at the beginning of a line.  ",line:4},{text:"You just made a checkbox to keep track of progress. Try copying this link and pasting it in the pad.  ",line:5,postText:function(){setTimeout(function(){$('<input id="demo-link" type="text" value="https://dchtm6r471mui.cloudfront.net/hackpad.com_jzlYee5r2gk_p.1_1386024406749_bmo-adventure-time.gif">').css({"font-size":"14px",width:"300px",position:"fixed",top:"300px",left:"500px","z-index":"100000",border:"1px solid #ccc",padding:"5px","box-shadow":"1px 1px #99e"}).on("click",function(){this.focus();
this.select();}).appendTo($("body"));},2500);}},{text:"I think you're getting the hang of it!  There's even more features like tables, lists, code highlighting.  Come sign in, take off your shoes.",line:6,preText:function(){$("#demo-link").remove();
},postText:function(){setTimeout(function(){modals.showHTMLModal($("#page-login-box"));},15000);}},],scriptPosition:0,start:function(){paddemo.demoModeOn=true;
padeditor.aceObserver.on("keypress",paddemo.onKeyPress);trackEvent("demo-init");pad.handleUserJoin(paddemo.hpTeam);
padeditor.ace.setAuthorInfo(paddemo.hpTeam.userId,{bgcolor:clientVars.colorPalette[paddemo.hpTeam.colorId%clientVars.colorPalette.length],name:paddemo.hpTeam.name,userLink:paddemo.hpTeam.userLink});
paddemo.type(paddemo.script[0].text,paddemo.script[0].line);setInterval(paddemo.checkProgress,1000);},type:function(B,C,A){function D(F,G){return Math.random()*(G-F)+F;
}A=A||0;try{setTimeout(function(){padeditor.ace.callWithAce(function(F){var I=F.getBaseAttributedText();
var G=0;for(var H=0;H<C;++H){G=I.text.indexOf("\n",G+1);}G++;F.applyChangesToBase(Changeset.makeSplice(I.text,G+A,0,B[A],[["author",paddemo.hpTeam.userId]],F.getRep().apool),paddemo.hpTeam.userId,F.getRep().apool);
},"demotext",false);++A;if(A<B.length){paddemo.type(B,C,A);}},D(10,33)+(B[A].match(/\s/)?D(25,50):0));
}catch(E){}if(!A){setTimeout(function(){var F=$($("."+linestylefilter.getAuthorClassName(paddemo.hpTeam.userId))[C-2]).parents(".ace-line");
var G=F.parent().children().index(F);pad.handleClientMessage({type:"caret",caret:G,changedBy:paddemo.hpTeam.userId});
},33);}},eventHandler:function(){var A=++paddemo.scriptPosition;setTimeout(function(){setTimeout(function(){paddemo.script[A].preText&&paddemo.script[A].preText();
paddemo.type(paddemo.script[A].text,paddemo.script[A].line);paddemo.script[A].postText&&paddemo.script[A].postText();
},2000);},250);},checkProgress:function(){var A="."+linestylefilter.getAuthorClassName(clientVars.userId);
if(paddemo.scriptPosition==0&&paddemo.everPressed||paddemo.scriptPosition==1&&$(".list-comment1 "+A).length||paddemo.scriptPosition==2&&$(".list-task1 "+A).length||paddemo.scriptPosition==3&&$(".ace-line "+A+" .inline-img").length){trackEvent("demo-"+paddemo.scriptPosition);
paddemo.eventHandler();}},everPressed:false,onKeyPress:function(A){if(!paddemo.demoModeOn){return;}if(!paddemo.everPressed){paddemo.everPressed=true;
}}};
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padeditbar=(function(){var A={init:function(){function B(C){return function(D){D.preventDefault();
A.toolbarClick(C);return false;};}$("#boldbutton").mousedown(B("bold"));$("#italicsbutton").mousedown(B("italic"));
$("#underlinebutton").mousedown(B("underline"));$("#strikebutton").mousedown(B("strikethrough"));$("#listbutton").click(function(){A.toolbarClick("insertunorderedlist");
});$("#numberedlistbutton").click(function(){A.toolbarClick("insertorderedlist");});$("#taskbutton").click(function(){A.toolbarClick("inserttasklist");
});$("#commentbutton").click(function(){A.toolbarClick("insertcomment");});$("#indentbutton").click(function(){A.toolbarClick("indent");
});$("#outdentbutton").click(function(){A.toolbarClick("outdent");});$("#codebutton").click(function(){A.toolbarClick("code");
});$("#attachbutton").click(function(){$("#toolbar-attach-group").toggleClass("open");});$("#editbutton").click(function(){$("#toolbar").toggleClass("open");
$("#editbutton").toggleClass("open");$("body").toggleClass("edit-mode");});$("body").on("click",A.editMode);
$("#createpadentry").on("focus",function(){$("body").addClass("search-focused");});$("#createpadentry").on("blur",function(){setTimeout(function(){$("body").removeClass("search-focused");
},100);});$(".toolbar-main").on("click",function(C){$("#toolbar [data-type!="+$(C.currentTarget).attr("data-type")+"]").removeClass("toolbar-show");
$("#toolbar [data-type="+$(C.currentTarget).attr("data-type")+"]").toggleClass("toolbar-show");});$("#editbar .editbarbutton").attr("unselectable","on");
$("#editbar").removeClass("disabledtoolbar").addClass("enabledtoolbar");$("#insertimage").click(A.insertImage);
$("#inserttable").click(function(){padeditbar.toolbarClick("tableinsert");return false;});$("#insertdropbox").click(A.insertDropbox);
$("#insertbutton").click(function(C){setTimeout(function(){padeditor.ace.focus();},0);});padeditor.aceObserver.on("create-page",padeditbar.displayPageCreationDialog);
},isEnabled:function(){return !$("#editbar").hasClass("disabledtoolbar");},disable:function(){$("#editbar").addClass("disabledtoolbar").removeClass("enabledtoolbar");
},toolbarClick:function(B){trackEvent("toolbarClick",null,null,{command:B});if(A.isEnabled()){if(B=="save"){}else{if(B=="tableinsert"){padeditor.ace.callWithAce(function(D){var E=D.getRep();
var C=[E.selStart[0],E.selStart[1]];var F=[E.selEnd[0],E.selEnd[1]];if(C[0]==0){C=[1,0];F=[1,0];D.replaceRange(C,C,"\n\n",[]);
}else{D.replaceRange(C,F,"\n\n",[]);C=[C[0]+1,0];}D.replaceRange(C,C,"*",[["table","123"]]);padeditor.ace.focus();
},B,true);return;}else{padeditor.ace.callWithAce(function(C){padeditor.ace.focus();if(B=="bold"||B=="italic"||B=="underline"||B=="strikethrough"){C.toggleAttributeOnSelection(B);
}else{if(B=="undo"||B=="redo"){C.doUndoRedo(B);}else{if(B=="insertunorderedlist"){C.doInsertUnorderedList();
}else{if(B=="insertorderedlist"){C.doInsertOrderedList();}else{if(B=="inserttasklist"){C.doInsertTaskList();
}else{if(B=="code"){C.doInsertCodeList();}else{if(B=="insertcomment"){C.doInsertComment();}else{if(B=="indent"){if(!C.doIndentOutdent(false)){C.doInsertUnorderedList();
}}else{if(B=="outdent"){C.doIndentOutdent(true);}else{if(B=="clearauthorship"){if((!(C.getRep().selStart&&C.getRep().selEnd))||C.isCaret()){if(window.confirm("Clear authorship colors on entire document?")){var D=C.getRep().lines;
C.performDocumentApplyAttributesToRange([0,0],[D.length,D[D.length-1]],[["author",""]]);}}else{C.setAttributeOnSelection("author","");
}}else{if(B=="header-1"||B=="header-2"){C.doSetHeadingLevel(B.split("-")[1]);}}}}}}}}}}}},B,true);}}}padeditor.ace.focus();
},editMode:function(B){if((!$(B.target).parents("body > header").length&&!$(B.target).parents("#padeditor").length&&!$(B.target).parents("#padsidebar").length&&!$(B.target).parents("#mainmodals").length&&!$(B.target).is("#modaloverlay")&&!$(B.target).parents("#modaloverlay").length&&!$(B.target).is(".lightbox-container")&&!$(B.target).parents(".lightbox-container").length)||$(B.target).is("#padeditor")||$(B.target).is("#createpadform2")||$(B.target).parents("#createpadform2").length){$("body").removeClass("edit-mode");
}else{if($(B.target).is("#editor")||$(B.target).parents("#editor").length){$("body").addClass("edit-mode");
}}},insertImage:function(){padmodals.showModal("#insertimagedialog",0);if(!!window.FileReader){$("#web-image-upload").off("change").on("change",function(){for(var B=0;
B<this.files.length;++B){padeditor.aceObserver.trigger("insert-image",[this.files[B]]);}padmodals.hideModal(0);
});}else{$("#web-image-upload, #web-image-upload-separator").hide();}$("#insert-image-form")[0].reset();
$("#insert-image-form").unbind("submit").submit(function(){var B=$("#web-image-url").val();if(!B.match(/^https?:\/\/.*/)){B="http://"+B;
}padeditor.ace.callWithAce(function(C){var D=C.getRep();C.replaceRange(D.selStart,D.selEnd,"*",[["img",B]]);
padeditor.ace.focus();padmodals.hideModal(0);},"insertimage",true);return false;});$(document).on("dragover","#insertimagedialog",function(B){B.preventDefault();
B.stopPropagation();padmodals.hideModal(0);});return false;},insertDropbox:function(){trackEvent("toolbarClick","dropbox",null,{command:"dropbox"});
Dropbox.choose({linkType:"preview",multiselect:true,success:function(D){function B(F,E){padeditor.ace.callWithAce(function(G){var H=G.getRep();
G.replaceRange(H.selStart,H.selEnd,F,E);},"insertdropbox",true);}var C=D.filter(function(E){if(E.thumbnails&&E.thumbnails["640x480"]){B("*",[["img",E.thumbnails["640x480"]]]);
return false;}return true;});if(C.length&&C.length<D.length){B("\n\n");}C.map(function(E){B(E.name,[["link",E.link]]);
B("\n");});padeditor.ace.focus();}});return false;},setSyncStatus:function(B){if(B=="done"){$("#last-saved-timestamp").attr("title",toISOString((new Date())));
$("#last-saved-timestamp").prettyDate();$("#last-edited-by").hide();$("#last-saved").show();}},_insertLink:function(B,C){padeditor.ace.callWithAce(function(E){var F=E.getRep();
var D=F.selStart;var H=[D[0],D[1]+B.length];E.replaceRange(F.selStart,F.selEnd,B);E.performDocumentApplyAttributesToRange(D,H,[["link",C]]);
if($.browser.mozilla){var G=[D[0],D[1]+B.length];E.replaceRange(G,G," ");}},"linkinsert",true);},displayPageCreationDialog:function(G,C,E,D){var B=C.text;
trackEvent("pageCreateDialogShow",null,null,{selection:B.length,lines:B.split("\n").length});var F=D.replace(/ /g,"-");
$.post("/ep/pad/ajax_create",{title:D,text:C.text,attribs:C.attribs,apool:JSON.stringify(E),sourcePadId:pad.getPadId()},function(I){var H="/"+I+"#"+F;
A._insertLink(D,H);trackEvent("pageCreateDialogDone",null,null,{selection:B,padUrl:H});});}};return A;
}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padeditor=(function(){var A={ace:null,aceObserver:null,init:function(D,E){A.aceObserver=new ace.observer();
A.ace=new ace.editor("#editor",A.aceObserver);$("#editorloadingbox").hide();$("#padeditor").addClass("loaded");
if(clientVars.isEmbed){A.ace.setProperty("min-height",360);}else{B();$(window).resize(B);}if(D){D();}if(clientVars.isEmbed||!padutils.getIsMobile()){$("#editorbottombox").show();
}A.ace.setProperty("notitle",pad.getTitleIsReadOnly());A.aceObserver.on("track",function(J,G,I,H,F){F=F||{};
F.isEmbed=!!clientVars.isEmbed;trackEvent("ace_"+G,I,H,F);});if(navigator.userAgent.toLowerCase().indexOf("iphone")!=-1||navigator.userAgent.toLowerCase().indexOf("android")!=-1){A.ace.setShortNames("initials");
}else{if(navigator.userAgent.toLowerCase().indexOf("ipad")!=-1){A.ace.setShortNames("firstname-lastinitial");
}}if(!padutils.getIsMobile()){if($("body").hasClass("embed")){A.ace.setShortNames("fullname");}else{if(clientVars.isDesktopApp){A.ace.setShortNames("initials");
}else{A.ace.setShortNames("firstname-lastinitial");}}}A.aceObserver.on("height-change",function(G,F){if(clientVars.isEmbed){top.postMessage("hackpad-"+encodeURIComponent(pad.getPadId())+":height:"+F,"*");
}});var C=-1;function B(){var F=$(window).height()-$("#editor").offset().top;if(padutils.getIsMobile()){F=Math.max(F,$(window).height()-$("#padbar").height()+45);
}else{F-=46;}if(clientVars.isDesktopApp){F-=5;}if(F!=C){A.ace.setProperty("min-height",F);C=F;}}if(pad.getIsDebugEnabled()){A.ace.setProperty("dmesg",pad.dmesg);
}A.setViewOptions(E);A.aceObserver.on("missing-authors",function(G,F){$.ajax({url:"/ep/pad/add-authors",type:"post",data:{list:F.join("|"),padId:pad.getPadId()},success:function(H){pad.addHistoricalAuthors(H);
}});});},setViewOptions:function(D){function C(G,F){var E=String(D[G]);if(E=="true"){return true;}if(E=="false"){return false;
}return F;}var B;B=C("showLineNumbers",false);A.ace.setProperty("showslinenumbers",B);B=C("showAuthorColors",true);
A.ace.setProperty("showsauthorcolors",B);B=C("useMonospaceFont",false);A.ace.setProperty("textface",(B?"monospace":clientVars.isDesktopApp?"Helvetica, Arial, sans-serif":"ProximaNova-Light, nova, arial, sans-serif"));
A.ace.setProperty("textsize",(B?"12":"14"));},dispose:function(){if(A.ace){A.ace.dispose();}},disable:function(){if(A.ace){A.ace.setProperty("grayedOut",true);
A.ace.setEditable(false);}},restoreRevNum:function(B){$.post("/ep/pad/saverevision",{padId:pad.getPadId(),savedBy:pad.getUserName()||"unnamed",savedById:pad.getUserId(),revNum:B},function(D){console.log(D);
for(var C=0;C<D.length;C++){if(D[C].revNum==String(B)){padeditor.restoreRevisionId(D[C].id);break;}}});
},restoreRevisionId:function(D){$.ajax({type:"get",url:"/ep/pad/getrevisionatext",data:{padId:pad.getPadId(),revId:D},success:C,error:B});
function C(F){var E=JSON.parse(F);padeditor.restoreRevisionText(E);}function B(E){alert("Oops!  There was an error retreiving the text (revNum= "+rev.revNum+"; padId="+pad.getPadId());
}},restoreRevisionText:function(B){pad.addHistoricalAuthors(B.historicalAuthorData);A.ace.importAText(B.atext,B.apool,true);
},setVisibleHeight:function(B){if(!B){return;}A.ace.setVisibleHeight(B);A.ace.callWithAce(function(C){if(C.scrollSelectionIntoView){C.scrollSelectionIntoView();
}});}};return A;}());var padguestpolicy=(function(){var A=false;function B(D){$("#padaccesslogo").removeClass().addClass(D);
if(clientVars.isProPad&&clientVars.isPadAdmin){$("#padaccess-menu").removeAttr("disabled");$("#padaccess-menu").parent().removeAttr("data-tooltip");
}$("#fb-share-container").show();$("#padusers").addClass("owner");}var C={init:function(){function D(E){var F=false;
if(!E&&!F){return false;}if(F){pad.changePadOption("groupId",F);}else{if(pad.getPadOptions().guestPolicy!=E){pad.changePadOption("guestPolicy",E);
}}if(E=="allow"||E=="friends"||E=="link"){$("#network-share-box").show();}else{if(F){padfacebook.publishPad(F);
}else{$("#network-share-box").hide();}}$("select.padaccess").blur();}padutils.tooltip("#padaccess-menu");
$("#padaccess-menu li a").on("click",function(F){var E=$(F.currentTarget).attr("id").split("-")[1];$("#padaccess-menu li a.selected").removeClass("selected");
$("#padaccess-menu li #padaccess-"+E).addClass("selected");$("#padaccess-menu .hp-ui-button-content").html($("#padaccess-menu li a.selected i").clone());
$("#padaccess-menu").attr("data-tooltip",$("#padaccess-menu li a.selected").text()+" can access");D(E);
return false;});},setGuestPolicy:function(D){if(A){return;}A=true;$("#padaccess-menu li a.selected").removeClass("selected");
$("#padaccess-menu li #padaccess-"+D).addClass("selected");$("#padaccess-menu .hp-ui-button-content").html($("#padaccess-menu li a.selected i").clone());
$("#padaccess-menu").attr("data-tooltip",$("#padaccess-menu li a.selected").text()+" can access");B(D);
A=false;},setGroupId:function(D){$('select.padaccess option[groupId="'+D+'"]').attr("selected","selected");
B("group");}};return C;}());var padguestprompt=(function(){var B={};var A=0;var D=padutils.makeAnimationScheduler(function(){var E=$("#guestprompts .guestprompt");
if(E.length==0){return false;}A=1-A;if(A){E.css("background","#ffa");}else{E.css("background","#ffe");
}return true;},1000);var C={showGuestPrompt:function(H,G){if(B[H]){return;}var E=padutils.encodeUserId(H);
var I="hide-guest-prompt-"+E;padutils.cancelActions(I);var F=$("#guestprompt-"+E);if(F.length==0){F=$('<div id="guestprompt-'+E+'" class="guestprompt"><div class="choices"><a class="deny" href="javascript:void(padguestprompt.answerGuestPrompt(\''+E+"',false))\"> </a> <a href=\"javascript:void(padguestprompt.answerGuestPrompt('"+E+'\',true))">Allow</a></div><div class="guestname">'+padutils.escapeHtml(G)+"</div></div>");
$("#guestprompts").append(F);}else{F.find(".guestname").text(G);}D.scheduleAnimation();},removeGuestPrompt:function(E){var F=$("#guestprompt-"+padutils.encodeUserId(E));
F.removeAttr("id").fadeOut("fast",function(){F.remove();});B[E]=true;window.setTimeout(function(){delete B[E];
},5000);},answerGuestPrompt:function(F,G){var E=padutils.decodeUserId(F);var H={type:"guestanswer",authId:pad.getUserId(),guestId:E,answer:(G?"approved":"denied")};
pad.sendClientMessage(H);C.removeGuestPrompt(E);}};return C;}());var padnotify=(function(){var F=10*1000;
var L=60*1000;var I=5*60*1000;var B=true;var D=null;var C=null;var A=null;function J(N,Q){var P=N.userPic||"/static/img/hackpad-logo.png";
var O=N.name;var M=new Notification(pad.getTitle(),{icon:P,body:"Edited by "+O});M.onclick=function(){window.focus();
padeditor.ace.focus();M.close();};M.onclose=function(){A=null;};setTimeout(function(){M.close();},F);
A=M;}function H(O){var N=clientVars.siteUserInfos[O.userId];var Q=N.userPic||"/static/img/hackpad-logo.png";
var P=N.name;var M=new Notification(P+" ("+clientVars.siteName+")",{icon:Q,body:O.lineText});M.onclick=function(){window.focus();
M.close();};M.onclose=function(){};setTimeout(function(){M.close();},F);}function E(){B=true;if(A){A.close();
}}function G(){if((clientVars.invitedGroupInfos&&clientVars.invitedGroupInfos.length>0)||(clientVars.invitedUserInfos&&clientVars.invitedUserInfos.filter(function(M){return M.userId!=clientVars.userId;
}).length>0)){return true;}return false;}var K={init:function(){if(!window.Notification){return;}if(Notification.permission!="granted"){padeditor.aceObserver.on("keypress",function(M){if(!D||new Date()-D>I){if(G()&&!clientVars.demoMode){D=new Date();
Notification.requestPermission();}}});}$(window).focus(E);padeditor.aceObserver.on("focus",E);},userEdited:function(M,N){if(!window.Notification){return;
}if(!M||M.userId==clientVars.userId){return;}if(B){if(!C||new Date()-C>L){C=new Date();B=false;J(M,N);
}}},userChat:function(M){if(!window.Notification){return;}H(M);}};return K;}());var padrelated=(function(){var A={init:function(){if(!$("#related-pads-div").length){return;
}$.get("/ep/pad/related",{padId:pad.getPadId()},function(H){var E=false;var C=H.split("\n");for(var D=0;
D<C.length;D++){var G=C[D];var B=G.split("|");if(B.length<2){return;}var F=$("<li>");var I=$("<a/>").attr("href","/"+B[1]).attr("title",B[0]).append(B[0]).appendTo(F);
$("#related-pads-menu .hp-ui-button-list-ul").append(F);E=true;}if(E){$("#related-pads-menu .hp-ui-button-content").text(C.length+" "+$("#related-pads-menu .hp-ui-button-content").text());
if(!$("#related-pads-menu .icon-privacy-link").length){$("#related-pads-menu .hp-ui-button-content").append($("<i>").addClass("icon-privacy-link"));
}$("#related-pads-div").show();}else{$("#related-pads-div").hide();}});}};return A;}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var pad={collabClient:null,myUserInfo:null,diagnosticInfo:{},initTime:0,clientTimeOffset:(+new Date())-clientVars.serverTimestamp,padOptions:{},title:clientVars.initialTitle,monospace:false,unsavedPromptDisabled:false,welcomePadId:"REeiTgQKman",newWelcomePadId:"5t9MCUvk32r",getPadId:function(){return clientVars.padId;
},getClientIp:function(){return clientVars.clientIp;},getIsProPad:function(){return clientVars.isProPad;
},getColorPalette:function(){return clientVars.colorPalette;},getDisplayUserAgent:function(){return padutils.uaDisplay(clientVars.userAgent);
},getIsDebugEnabled:function(){return clientVars.debugEnabled;},getPrivilege:function(A){return clientVars.accountPrivs[A];
},getUserIsGuest:function(){return clientVars.userIsGuest;},getTitleIsReadOnly:function(){return clientVars.titleIsReadOnly;
},getTitle:function(){return pad.title;},getUserId:function(){return pad.myUserInfo.userId;},getUserName:function(){return pad.myUserInfo.name;
},sendClientMessage:function(A){pad.collabClient.sendClientMessage(A);},init:function(){pad.diagnosticInfo.uniqueId=padutils.uniqueId();
pad.initTime=+(new Date());pad.padOptions=clientVars.initialOptions||{};clientVars.siteUserInfos={};if($.browser.msie){try{doc.execCommand("BackgroundImageCache",false,true);
}catch(G){}}var C=null;var B=document.location.toString().split("#")[1];if(B&&B.split(":").length>1){var E=B.split(":")[B.split(":").length-1];
if(E!=clientVars.padTitle.split(":")[clientVars.padTitle.split(":").length-1]){C=E;}}padeditor.init(F,pad.padOptions.view||{});
padconnectionstatus.init();padmodals.init();padguestpolicy.init();pad.addClientVars({});if(clientVars.chatEnabled&&window.padchat){padchat.init(clientVars.chatHistory,pad.myUserInfo);
}$("input[placeholder]").placeholder();pad.initInviteControl();pad.initFollowControl();pad.initModerationModeControl();
$(window).bind("message",pad.receiveMessage,false);function F(){padeditbar.init();padautolink.init();
padnotify.init();$(".hide-before-pad-load").removeClass("hide-before-pad-load");clientVars.demoMode=clientVars.padId==pad.newWelcomePadId&&clientVars.userIsGuest;
if(clientVars.newPad||C){setTimeout(function(){padeditor.ace.focus(C);},0);}if(clientVars.userIsGuest&&!pad.isPadPublic()&&!pad.isEmbed()&&(clientVars.padId!=pad.welcomePadId)&&!clientVars.isMobile){if(allCookies.getItem("inhibitLoginDialog")!="T"&&clientVars.padId!=pad.welcomePadId){modals.showModal("#page-login-box",0,true);
allCookies.setItem("inhibitLoginDialog","T",new Date(new Date().getTime()+(1000*60*5)));}}if(clientVars.demoMode&&window.paddemo){setTimeout(paddemo.start,0);
}}$("#last-saved-timestamp").prettyDate();setInterval(function(){$("#last-saved-timestamp").prettyDate();
},5000);pad.handleOptionsChange(pad.padOptions);$(".padaccess").customStyle();padutils.tooltip("#padsidebar [data-tooltip]");
$("#submit-changes").click(function(){var I="/ep/pad/request-merge?padId="+clientVars.padId;var H=$("#submit-changes").attr("value");
$("#submit-changes").attr("value","Submitting...").attr("disabled",true);$.post(I,{},function(J){if(J&&J.success){alert("Your changes have been sent for review");
document.location=J.padURL;return;}else{alert("Oops, an error has occured.  Please try again.");}$("#submit-changes").attr("value",H).removeAttr("disabled");
});});if(!clientVars.isMobile){var D=[["#friend-picker","Invite a collaborator!"],["#padaccess-menu","Change privacy settings"]];
for(var A=0;A<D.length;A++){if(allCookies.getItem("teach")==A){allCookies.setItem("teach",A+1);hints.showHint($(D[A][0]),D[A][1]);
break;}}}$(window).keydown(function(H){if((H.metaKey?!H.ctrlKey:H.ctrlKey)&&H.keyCode==65&&document.activeElement.nodeName=="BODY"){H.preventDefault();
padeditor.ace.focus();padeditor.ace.callWithAce(function(J){var K=J.getRep();var I=K.lines.length();var L=K.lines.atIndex(I-1).text.length;
J.performSelectionChange([0,0],[I-1,L],false);},true,true);return false;}if((H.metaKey?!H.ctrlKey:H.ctrlKey)&&H.keyCode==191&&document.activeElement.nodeName=="BODY"){H.preventDefault();
$("#createpadentry").focus();return false;}});trackEvent("pad-visit",null,null,{padId:clientVars.isPublicPad?clientVars.padId:"private",userIsGuest:clientVars.userIsGuest,isEmbed:pad.isEmbed()});
},addClientVars:function(A){$.extend(true,clientVars,A);$.extend(true,pad.padOptions,A.initialOptions);
pad.myUserInfo={userId:clientVars.userId,name:clientVars.userName,ip:pad.getClientIp(),colorId:clientVars.userColor||0,userAgent:pad.getDisplayUserAgent(),status:"connected",userLink:clientVars.userLink,userPic:clientVars.userPic};
if(!pad.initTime||!clientVars.collab_client_vars){return;}else{if(pad.collabClient){if(A.padId){padrelated.init();
pad.collabClient.setPadId(clientVars.padId,clientVars.globalPadId);$("#follow-container").attr("src","/ep/pad/pad-follow-button?"+$.param({padId:clientVars.padId}));
}if(A.padTitle){pad.handleNewTitle(clientVars.padTitle);}return;}}if(clientVars.specialKey){pad.myUserInfo.specialKey=clientVars.specialKey;
if(clientVars.specialKeyTranslation){$("#specialkeyarea").text("mode: "+String(clientVars.specialKeyTranslation).toUpperCase());
}}window.paduserlist&&paduserlist.init(pad.myUserInfo,clientVars.invitedUserInfos||[],[]);padcollections.init();
padcollections.renderPadCollections();if(pad.getPadId()){padrelated.init();if(typeof(padinvitelog)!="undefined"){padinvitelog.init();
}$("[name=padId]").val(pad.getPadId());}var B=((clientVars.padId==pad.welcomePadId||clientVars.padId==pad.newWelcomePadId||clientVars.padId=="m1Fne5A6Lzn"||clientVars.padId=="clJetHSqs4T")&&clientVars.userIsGuest)||clientVars.padId=="m1Fne5A6Lzn";
pad.collabClient=getCollabClient(padeditor.ace,clientVars.collab_client_vars,pad.myUserInfo,{colorPalette:pad.getColorPalette()},B);
pad.collabClient.setOnUserJoin(pad.handleUserJoin);pad.collabClient.setOnUpdateUserInfo(pad.handleUserUpdate);
pad.collabClient.setOnUserLeave(pad.handleUserLeave);pad.collabClient.setOnUserKill(pad.handleUserKill);
pad.collabClient.setOnUpdateUserSiteInfo(pad.handleUserSiteUpdate);pad.collabClient.setOnUserSiteJoin(pad.handleUserSiteJoin);
pad.collabClient.setOnUserSiteLeave(pad.handleUserSiteLeave);pad.collabClient.setOnUserEdited(pad.handleUserEdited);
pad.collabClient.setOnGroupJoin(pad.handleGroupJoin);pad.collabClient.setOnGroupRemove(pad.handleGroupRemove);
pad.collabClient.setOnUpdateGroupInfo(pad.handleGroupUpdate);pad.collabClient.setOnClientMessage(pad.handleClientMessage);
pad.collabClient.setOnModeratedPadEdited(pad.handleModeratedPadEdited);pad.collabClient.setOnServerMessage(pad.handleServerMessage);
pad.collabClient.setOnSiteToClientMessage(pad.handleSiteToClientMessage);pad.collabClient.setOnSiteMessage(pad.handleSiteMessage);
pad.collabClient.setOnChannelStateChange(pad.handleChannelStateChange);pad.collabClient.setOnInternalAction(pad.handleCollabAction);
pad.handleNewTitle(clientVars.padTitle||"");$("#pause-collab").on("click",function(){if(!$("#pause-collab").hasClass("paused")){pad.collabClient.pause();
$("#pause-collab").text("Resume collab").addClass("paused");}else{pad.collabClient.reconnect();$("#pause-collab").text("Pause collab").removeClass("paused");
}});},toggleFollow:function(B){$("#tooltip").remove();var A={followPref:$(B).hasClass("padfollow")?"2":"1",ajax:true};
$.post("/ep/pad/follow/"+clientVars.padId+"/",A,function(C){if(C&&!C.success){modals.showHTMLModal(C.html);
return;}$("#follow-container").refresh(function(){if($("#follow-container .padunfollow").is(":visible")){if(pad.isPadPublic()){padfacebook.postGraphFollowPad();
}}padutils.tooltip("#follow-container [data-tooltip]");});trackEvent("toggleFollow",null,null,{followPref:A.followPref});
});},dispose:function(){padeditor.dispose();},onbeforeunload:function(){if(pad.collabClient&&pad.collabClient.hasUncommittedChanges()&&!pad.unsavedPromptDisabled){return"This pad has unsaved changes.  Do you want to leave and discard your changes?";
}this.unloading=true;},disableUnsavedPrompt:function(){pad.unsavedPromptDisabled=true;},initModerationModeControl:function(){if(clientVars.isPadAdmin){var D=pad.padOptions.isModerated?"closed":"open";
var A=$("#toggle-readonly-button");A.attr("class",A.data("src"+D));A.attr("title",A.data("title"+D));
var C=$("#toggle-readonly-link");C.text(pad.padOptions.isModerated?"Unmoderate":"Moderate");$([C[0]]).unbind("click").click(function(){if(pad.padOptions.isModerated){pad.changePadOption("isModerated",false);
}else{pad.changePadOption("isModerated",true);}return false;});}else{if(pad.padOptions.isModerated){for(var E in clientVars.invitedUserInfos){var B=clientVars.invitedUserInfos[E];
if(B.userId=="p."+clientVars.creatorId){$("#pad-moderator-link").attr("href",B.userLink).text("Moderated by "+B.name);
$("#pad-moderator").show();$("#pad-moderator-link").css("display","inline-block");break;}}}}},initInviteControl:function(){var A=$("#friend-picker");
var B={fb:{callback:function(C){}},hp:{url:"/ep/pad/hackpadinvite",argsCallback:function(C){return{padId:pad.getPadId(),userId:C[2]};
}},email:{url:"/ep/pad/emailinvite",argsCallback:function(C){return{padId:pad.getPadId(),toAddress:C[2]};
}},typedemail:{callback:function(E){var D="/ep/pad/emailinvite";var C={padId:pad.getPadId(),toAddress:E[1]};
if(!C.toAddress){alert("This does not look like a valid email address.");return;}A.addClass("ac_loading");
$.post(D,C,function(F){A.removeClass("ac_loading");});}}};A.invite({target:"Pad",inviteItemHandlers:B});
},initFollowControl:function(){$("#mainbar").on("click","#follow-container .padfollow, #follow-container .padunfollow",function(){pad.toggleFollow(this);
});},receiveMessage:function(C){if(C.data=="wpSave"){var A=padeditor.ace.getAuthorNames().join(", ");
var B={comment:"Edited collaboratively by "+A+" using http://hackpad.com",content:padeditor.ace.exportText()};
window.parent.postMessage(JSON.stringify(B),"*");}},notifyUserCaretUpdate:function(A){pad.collabClient&&pad.collabClient.sendClientMessage({type:"caret",caret:A,changedBy:pad.myUserInfo.userId});
},changePadOption:function(B,C){var A={};A[B]=C;pad.handleOptionsChange(A);pad.collabClient.sendClientMessage({type:"padoptions",options:A,changedBy:pad.myUserInfo.name||"unnamed"});
},changeViewOption:function(B,C){var A={view:{}};A.view[B]=C;pad.handleOptionsChange(A);pad.collabClient.sendClientMessage({type:"padoptions",options:A,changedBy:pad.myUserInfo.name||"unnamed"});
},handleOptionsChange:function(A){if(A.view){if(!pad.padOptions.view){pad.padOptions.view={};}for(var B in A.view){pad.padOptions.view[B]=A.view[B];
}padeditor.setViewOptions(pad.padOptions.view);}if(A.guestPolicy){pad.padOptions.guestPolicy=A.guestPolicy;
delete pad.padOptions.groupId;padguestpolicy.setGuestPolicy(A.guestPolicy);}if(A.groupId){pad.padOptions.guestPolicy="deny";
pad.padOptions.groupId=A.groupId;padguestpolicy.setGroupId(A.groupId);}if("isModerated" in A){pad.padOptions.isModerated=A.isModerated;
pad.initModerationModeControl();}},getPadOptions:function(){return pad.padOptions;},isPadPublic:function(){return(!pad.getIsProPad())||(pad.getPadOptions().guestPolicy=="allow");
},isEmbed:function(){return clientVars.isEmbed;},isDesktopApp:function(){return clientVars.isDesktopApp;
},isMobileApp:function(){return clientVars.isMobileApp;},handleUserJoin:function(A){clientVars.invitedUserInfos.push(A);
window.paduserlist&&paduserlist.userJoinOrUpdate(A);if(clientVars.chatEnabled&&window.padchat){padchat.handleUserJoinOrUpdate(A);
}},handleUserUpdate:function(A){window.paduserlist&&paduserlist.userJoinOrUpdate(A);if(clientVars.chatEnabled&&window.padchat){padchat.handleUserJoinOrUpdate(A);
}},handleUserSiteJoin:function(A){if(clientVars.chatEnabled&&window.padchat){clientVars.siteUserInfos[A.userId]=A;
padchat.handleUserSiteJoinOrUpdate(A);}},handleUserSiteUpdate:function(A){if(clientVars.chatEnabled&&window.padchat){padchat.handleUserSiteJoinOrUpdate(A);
}},handleUserLeave:function(A){window.paduserlist&&paduserlist.userLeave(A);if(clientVars.chatEnabled&&window.padchat){padchat.handleUserLeave(A);
}padeditor.aceObserver.trigger("remove-user-caret",[A]);},handleUserSiteLeave:function(A){if(clientVars.chatEnabled&&window.padchat){padchat.handleUserSiteLeave(A);
}},handleUserKill:function(A){window.paduserlist&&paduserlist.userKill(A);padeditor.aceObserver.trigger("remove-user-caret",[A]);
},handleUserEdited:function(A,B){window.paduserlist&&paduserlist.userEdited(A.userId);padnotify.userEdited(A,B);
},handleGroupJoin:function(A){clientVars.invitedGroupInfos.push(A);padcollections.renderPadCollections();
if(clientVars.chatEnabled&&window.padchat){padchat.handleUserJoinOrUpdate(A);}},handleGroupRemove:function(A){var B=A.groupId;
clientVars.invitedGroupInfos=clientVars.invitedGroupInfos.filter(function(C){return B!=C.groupId;});padcollections.renderPadCollections();
padcollections.loadCandidateCollections();},handleGroupUpdate:function(A){if(clientVars.chatEnabled&&window.padchat){padchat.handleUserJoinOrUpdate(A);
}},handleNewTitle:function(A){pad.title=A;var D=["js","c","cpp","cxx","h","hpp","cs","vb","m","java","py","rb","css","html","htm","php","coffee","lua","pl","pm","r","sh","tcl","xml","sql","go","scala","textile","md","markdown","tex","json","txt"];
if(A&&A.indexOf(".")>-1&&D.indexOf($.trim(A).split(".").pop().toLowerCase())>-1){pad.monospace=true;padeditor.setViewOptions({useMonospaceFont:pad.monospace});
$.ajax({url:"/static/js/tok/require_all.js",dataType:"script",cache:true,success:function(){require(["helper"],function(E){padeditor.ace.setProperty("tokenizer",E(pad.title));
});}});}else{if(pad.monospace){pad.monospace=false;padeditor.setViewOptions({useMonospaceFont:pad.monospace});
padeditor.ace.setProperty("tokenizer",null);}}document.title=A+" - "+location.host;var B=A.replace(/[^\w\s-\.]/g,"").replace(/[\s-]+/g,"-");
if(pad.getPadId().length==11&&window.history&&window.history.replaceState&&!pad.isEmbed()&&(document.location.toString().indexOf("/ep/pad/summary/")==-1)){var C="#"+document.location.toString().split("#")[1];
if(C.indexOf("#:h")!=0){C="";}window.history.replaceState({},document.title,(B?B+"-"+pad.getPadId():pad.getPadId())+C);
}else{document.location.replace(document.location.toString().split("#")[0]+"#"+B);}window.padchat&&padchat.handleNewTitle(A);
},handleModeratedPadEdited:function(){modals.showHTMLModal($("#moderated-modal"),0,true);},handleClientMessage:function(A){if(A.type=="caret"){padeditor.aceObserver.trigger("update-user-caret",[A]);
}else{if(A.type=="chat"){if(!clientVars.chatEnabled||!window.padchat){return;}padchat.receiveChat(A);
}else{if(A.type=="padtitle"){pad.handleNewTitle(A.title);}else{if(A.type=="padoptions"){var B=A.options;
pad.handleOptionsChange(B);}else{if(A.type=="guestanswer"){padguestprompt.removeGuestPrompt(A.guestId);
}}}}}},editbarClick:function(A){if(padeditbar){padeditbar.toolbarClick(A);}},dmesg:function(B){if(pad.getIsDebugEnabled()){var A=$("#djs").get(0);
var C=(A.scrollTop-(A.scrollHeight-$(A).height())>=-20);$("#djs").append("<p>"+B+"</p>");if(C){A.scrollTop=A.scrollHeight;
}}},handleServerMessage:function(A){if(A.type==="HANDLE_DELETE"){this.handleDelete();}else{if(A.type==="RELOAD"){if(A.padUrl&&document.location==A.padUrl){document.location.reload(true);
}}else{if(A.type=="NOTICE"){if(A.text){alertBar.displayMessage(function(B){B.find("#servermsgdate").text(" ("+padutils.simpleDateTime(new Date)+")");
B.find("#servermsgtext").text(A.text);});}}else{if(A.type=="GUEST_PROMPT"){padguestprompt.showGuestPrompt(A.userId,A.displayName);
}}}}},handleSiteToClientMessage:function(A){if(!clientVars.chatEnabled||!window.padchat){return;}if(A.type=="mention"){padchat.receiveMention(A);
}else{if(A.type=="invite"){padchat.receiveInvite(A);}}},handleSiteMessage:function(A){if(!clientVars.chatEnabled){return;
}pad.handleClientMessage(A);},handleChannelStateChange:function(B,A){var E=!!padconnectionstatus.isFullyConnected();
var D=(padconnectionstatus.getStatus().what=="connecting");if(B=="CONNECTED"){padconnectionstatus.connected();
}else{if(B=="RECONNECTING"){if(this.unloading){return;}padconnectionstatus.reconnecting();}else{if(B=="DISCONNECTED"){pad.diagnosticInfo.disconnectedMessage=A;
pad.diagnosticInfo.padInitTime=pad.initTime;pad.asyncSendDiagnosticInfo();if(typeof window.ajlog=="string"){window.ajlog+=("Disconnected: "+A+"\n");
}padeditor.disable();padeditbar.disable();padconnectionstatus.disconnected(A);}}}var C=!!padconnectionstatus.isFullyConnected();
if(C!=E){pad.handleIsFullyConnected(C,D);}},handleIsFullyConnected:function(B,A){},handleCollabAction:function(A){if(A=="commitPerformed"){padeditbar.setSyncStatus("syncing");
if(pad.isPadPublic()){padfacebook.postGraphEdit();}etherpad.doOnce("trackeditstarted",function(){trackEvent("editstarted",clientVars.padId,null,{});
});}else{if(A=="commitAcceptedByServer"){etherpad.doOnce("trackedited",function(){trackEvent("edited",clientVars.padId,null,{});
setTimeout(function(){$("#follow-container").refresh();},1000);});}else{if(A=="newlyIdle"){padeditbar.setSyncStatus("done");
}}}},hideServerMessage:function(){alertBar.hideMessage();},asyncSendDiagnosticInfo:function(){pad.diagnosticInfo.collabDiagnosticInfo=pad.collabClient.getDiagnosticInfo();
window.setTimeout(function(){$.ajax({type:"post",url:"/ep/pad/connection-diagnostic-info",data:{padId:pad.getPadId(),diagnosticInfo:JSON.stringify(pad.diagnosticInfo)},success:function(){},error:function(){}});
},0);},forceReconnect:function(){if(!$("form#reconnectform input.padId").val()){$("form#reconnectform input.padId").val(pad.getPadId());
pad.diagnosticInfo.collabDiagnosticInfo=pad.collabClient.getDiagnosticInfo();$("form#reconnectform input.diagnosticInfo").val(JSON.stringify(pad.diagnosticInfo));
$("form#reconnectform input.missedChanges").val(JSON.stringify(pad.collabClient.getMissedChanges()));
}$("#reconnect_form .loading-indicator").show();$("#reconnect_form .failed-indicator").hide();var A=$("form#reconnectform").serialize();
$.post($("form#reconnectform").attr("action"),A,function(B,C){$(window).unbind("beforeunload");document.location.reload(true);
}).error(function(){$("#reconnect_form .loading-indicator").fadeOut(1000);$("#reconnect_form .failed-indicator").show(1000).delay(2000).fadeOut(1000);
});return false;},handleImportExportFrameCall:function(B,A){},callWhenNotCommitting:function(A){pad.collabClient.callWhenNotCommitting(A);
},getCollabRevisionNumber:function(){return pad.collabClient.getCurrentRevisionNumber();},isFullyConnected:function(){return padconnectionstatus.isFullyConnected();
},addHistoricalAuthors:function(A){if(!pad.collabClient){window.setTimeout(function(){pad.addHistoricalAuthors(A);
},1000);}else{pad.collabClient.addHistoricalAuthors(A);}},deletePad:function(){if(!confirm('Are you sure you want to delete the pad "'+pad.getTitle()+'"?')){return;
}pad.collabClient.setOnServerMessage(function(){});$.post("/ep/padlist/delete",{padIdToDelete:pad.getPadId(),returnPath:"/"},function(){if(history&&history.length>1){history.back();
}else{location.href="/";}});},handleDelete:function(){window.location=window.location;},updateEmbedCode:function(){var A=location.protocol+"//"+location.host+"/"+encodeURIComponent(pad.getPadId());
var B=A+".js";if($("#embedpad-type").val()){B+="?format="+$("#embedpad-type").val();}var C='\x3cscript src="'+B+'">\x3c/script><noscript><div>View <a href="'+A+'">'+this.getTitle()+"</a> on Hackpad.</div></noscript>";
$("#embedpad-code").val(C).select();},showEmbedDialog:function(){padmodals.showModal("#embedpaddialog",0);
pad.updateEmbedCode();}};var alertBar=(function(){var A=padutils.makeShowHideAnimator(C,false,25,400);
function C(D){if(D==-1){$("#alertbar").css("opacity",0).css("display","block");}else{if(D==0){$("#alertbar").css("opacity",1);
}else{if(D==1){$("#alertbar").css("opacity",0).css("display","none");}else{if(D<0){$("#alertbar").css("opacity",D+1);
}else{if(D>0){$("#alertbar").css("opacity",1-D);}}}}}}var B={displayMessage:function(D){A.show();D($("#alertbar"));
},hideMessage:function(){A.hide();}};return B;}());$(document).ready(function(){setTimeout(pad.init,0);
});$(window).unload(function(){pad.dispose();});$(window).bind("beforeunload",function(){return pad.onbeforeunload();
});
/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */
function prettyDate(C){var E=C?new Date(C):new Date();
var D=new Date();var B=((D.getTime()-E.getTime())/1000),A=Math.floor(B/86400);if(isNaN(A)||A<0){return;
}return A==0&&(B<60&&"just now"||B<120&&"1 minute ago"||B<3600&&Math.floor(B/60)+" minutes ago"||B<7200&&"1 hour ago"||B<86400&&Math.floor(B/3600)+" hours ago")||A==1&&"Yesterday"||A<7&&A+" days ago"||A<31&&Math.ceil(A/7)+" weeks ago"||A<365&&Math.ceil(A/31)+" months ago"||Math.ceil(A/365)+" years ago";
}if(typeof jQuery!="undefined"){jQuery.fn.prettyDate=function(){return this.each(function(){var A=prettyDate(this.title);
jQuery(this).text(A||"just now");});};}var imgshrink=(function(){function A(D){var C;if(D.split(",")[0].indexOf("base64")>=0){C=atob(D.split(",")[1]);
}else{C=unescape(D.split(",")[1]);}var G=D.split(",")[0].split(":")[1].split(";")[0];var F=new ArrayBuffer(C.length);
var H=new Uint8Array(F);for(var E=0;E<C.length;E++){H[E]=C.charCodeAt(E);}return new Blob([F],{type:G});
}var B={maybeShrinkImage:function(C,E,F,G){if(!window.FileReader||!window.Image||C.type.indexOf("image")==-1||C.type.indexOf("image/gif")==0||C.size<500000){E(C);
return;}var D=new FileReader();D.onloadend=function(){var H=new Image();H.onload=function(){var M=F||1280,L=G||3280,J=H.width,I=H.height;
if(J>I){if(J>M){I*=M/J;J=M;}}else{if(I>L){J*=L/I;I=L;}}var K=document.createElement("canvas");K.width=J;
K.height=I;var N=K.getContext("2d");N.drawImage(H,0,0,J,I);var P=K.toDataURL(C.type,0.8);var O=A(P);E(O);
};H.src=D.result;};D.readAsDataURL(C);}};return B;}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isNodeText(A){return(A.nodeType==3);
}function nodeText(A){if($(A).children()&&$(A).children()[0]&&$($(A).children()[0]).attr("faketext")){return $($(A).children()[0]).attr("faketext");
}return A.innerText||A.textContent||A.nodeValue||A.getAttribute("faketext")||"";}var _blockElems={div:1,p:1,pre:1,li:1,ol:1,ul:1};
function isBlockElement(A){return !!_blockElems[(A.tagName||"").toLowerCase()];}function object(B){var A=function(){};
A.prototype=B;return new A();}function extend(D,B,C){for(var A in B){if(typeof(C)=="undefined"||!(A in C)){D[A]=B[A];
}}return D;}function forEach(B,D){for(var A=0;A<B.length;A++){var C=D(B[A],A);if(C){break;}}}function decorate(B,C){for(var A in C){if(!B[A]){B[A]=C[A];
}}}function map(C,D){var B=[];for(var A=0;A<C.length;A++){if(D){B.push(D(C[A],A));}else{B.push(C[A]);
}}return B;}function filter(B,D){var C=[];for(var A=0;A<B.length;A++){if(D(B[A],A)){C.push(B[A]);}}return C;
}function isArray(A){return A&&typeof A==="object"&&!(A.propertyIsEnumerable("length"))&&typeof A.length==="number";
}var userAgent=navigator.userAgent.toLowerCase();var browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent),windows:/windows/.test(userAgent),mobile:/(iphone|ipad|android|ipod)/.test(userAgent),phone:/(iphone)/.test(userAgent),android:/(android)/.test(userAgent)};
var iOS=(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)?true:false);function getAssoc(B,A){return B["_magicdom_"+A];
}function setAssoc(C,A,B){C["_magicdom_"+A]=B;}function binarySearch(A,E){if(A<1){return 0;}if(E(0)){return 0;
}if(!E(A-1)){return A;}var D=0;var B=A-1;while((B-D)>1){var C=Math.floor((D+B)/2);if(E(C)){B=C;}else{D=C;
}}return B;}function binarySearchInfinite(C,B){var A=0;while(!B(A)){A+=C;}return binarySearch(A,B);}function htmlPrettyEscape(A){return A.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r?\n/g,"\\n");
}function getClassArray(B,A){if(!B.className){return[];}var C=[];B.className.replace(/\S+/g,function(D){if((!A)||(A(D))){C.push(D);
}});return C;}function hasClass(C,A){var B=getClassArray(C,function(D){return D==A;});return B.length;
}function setClassArray(A,B){A.className=B.join(" ");}function addClass(C,B){var A=false;var D=getClassArray(C,function(E){if(E==B){A=true;
}return true;});if(!A){D.push(B);setClassArray(C,D);}}function removeClass(B,C){var A=false;var D=getClassArray(B,function(E){if(E==C){A=true;
return false;}return true;});if(A){setClassArray(B,D);}}function setClassPresence(B,A,C){if(C){addClass(B,A);
}else{removeClass(B,A);}}function hasParent(A,B){while(A){if(A==B){return true;}A=A.parentNode;}return false;
}function nodeMaxIndex(A){if(isNodeText(A)){return A.nodeValue.length;}else{return 1;}}function childIndex(A){var B=0;
while(A.previousSibling){B++;A=A.previousSibling;}return B;}function getStyle(A,B){var C=function(D){return D.replace(/\-(\w)/g,function(F,E){return E.toUpperCase();
});};if(A.currentStyle){return A.currentStyle[C(B)];}else{if(document.defaultView&&document.defaultView.getComputedStyle){return document.defaultView.getComputedStyle(A,null).getPropertyValue(B);
}else{return A.style[C(B)];}}}function _contains(B,C){for(var A=0;A<B.length;A++){if(C===B[A]){return true;
}}return false;}function _hashCode(C){var A=0,B,D;if(C.length==0){return A;}for(B=0;B<C.length;B++){D=C.charCodeAt(B);
A=((A<<5)-A)+D;A=A&A;}return A;}function now(){return(new Date()).getTime();}function showContextMenu(A,D,C){var B=A.target;
if(A.target.nodeName!="DIV"){B=A.target.parentNode;}C.css({left:clientVars.isDesktopApp?"18px":"20px",top:String($(B).position().top+2)+"px"}).show().click();
}function userAgentInfo(){var A=navigator.userAgent.toLowerCase(),B="",C=0;$.browser.chrome=/chrome/.test(navigator.userAgent.toLowerCase());
if($.browser.msie){A=$.browser.version;A=A.substring(0,A.indexOf("."));C=A;B="Internet Explorer";}if($.browser.chrome){A=A.substring(A.indexOf("chrome/")+7);
A=A.substring(0,A.indexOf("."));C=A;$.browser.safari=false;B="Chrome";}if($.browser.safari){A=A.substring(A.indexOf("safari/")+7);
A=A.substring(0,A.indexOf("."));C=A;B="Safari";}if($.browser.mozilla){if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){A=A.substring(A.indexOf("firefox/")+8);
A=A.substring(0,A.indexOf("."));C=A;B="Firefox";}else{B="Mozilla (not Firefox)";}}if($.browser.opera){A=A.substring(A.indexOf("version/")+8);
A=A.substring(0,A.indexOf("."));C=A;B="Opera";}return{browser:B,version:C};}function noop(){}function identity(A){return A;
}
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function newSkipList(){var H=window.PROFILER;
if(!H){H=function(){return{start:G,mark:G,literal:G,end:G,cancel:G};};}function G(){}var B={key:null,levels:1,upPtrs:[null],downPtrs:[null],downSkips:[1],downSkipWidths:[0]};
var E={key:null,levels:1,upPtrs:[null],downPtrs:[null],downSkips:[null],downSkipWidths:[null]};var A=0;
var D=0;var I={};B.downPtrs[0]=E;E.upPtrs[0]=B;function J(Z){var W=B.levels;var T=W-1;var X=-1,b=0;var V=new Array(W);
var Y=new Array(W);var a=new Array(W);V[T]=B;Y[T]=-1;a[T]=0;while(T>=0){var U=V[T];while(U.downPtrs[T]&&(X+U.downSkips[T]<Z)){X+=U.downSkips[T];
b+=U.downSkipWidths[T];U=U.downPtrs[T];}V[T]=U;Y[T]=X;a[T]=b;T--;if(T>=0){V[T]=U;}}return{nodes:V,idxs:Y,loc:Z,widthSkips:a,toString:function(){return"getPoint("+Z+")";
}};}function P(W){var V=0;var T=B;var U=B.levels-1;while(U>=0&&T.downPtrs[U]){while(T.downPtrs[U]&&(V+T.downSkipWidths[U]<=W)){V+=T.downSkipWidths[U];
T=T.downPtrs[U];}U--;}if(T===B){return(B.downPtrs[0]||null);}else{if(T===E){return(W==D?(E.upPtrs[0]||null):null);
}}return T;}function K(T){return(T&&T.width)||0;}function N(V,h,l){var X=H("insertKey",false);var W={key:h,levels:0,upPtrs:[],downPtrs:[],downSkips:[],downSkipWidths:[]};
X.mark("donealloc");var Y=V.nodes;var f=V.idxs;var o=V.loc;var n=V.widthSkips[0]+V.nodes[0].downSkipWidths[0];
var a=K(l);X.mark("loop1");while(W.levels==0||Math.random()<0.01){var T=W.levels;W.levels++;if(T==Y.length){Y[T]=B;
f[T]=-1;B.levels++;E.levels++;B.downPtrs[T]=E;E.upPtrs[T]=B;B.downSkips[T]=A+1;B.downSkipWidths[T]=D;
V.widthSkips[T]=0;}var Z=W;var U=Y[T];var d=U.downPtrs[T];var b=o-f[T];var j=U.downSkips[T]+1-b;U.downSkips[T]=b;
U.downPtrs[T]=Z;Z.downSkips[T]=j;Z.upPtrs[T]=U;Z.downPtrs[T]=d;d.upPtrs[T]=Z;var c=n-V.widthSkips[T];
var m=U.downSkipWidths[T]+a-c;U.downSkipWidths[T]=c;Z.downSkipWidths[T]=m;}X.mark("loop2");X.literal(Y.length,"PNL");
for(var T=W.levels;T<Y.length;T++){var U=Y[T];U.downSkips[T]++;U.downSkipWidths[T]+=a;}X.mark("map");
I["$KEY$"+h]=W;A++;D+=a;X.end();}function O(T){return T.nodes[0].downPtrs[0];}function S(U){U.loc++;for(var T=0;
T<U.nodes.length;T++){if(U.idxs[T]+U.nodes[T].downSkips[T]<U.loc){U.idxs[T]+=U.nodes[T].downSkips[T];
U.widthSkips[T]+=U.nodes[T].downSkipWidths[T];U.nodes[T]=U.nodes[T].downPtrs[T];}}}function M(W){var V=W.nodes[0].downPtrs[0];
var X=K(V.entry);for(var T=0;T<W.nodes.length;T++){if(T<V.levels){var U=V.upPtrs[T];var Y=V.downPtrs[T];
var a=U.downSkips[T]+V.downSkips[T]-1;U.downPtrs[T]=Y;Y.upPtrs[T]=U;U.downSkips[T]=a;var Z=U.downSkipWidths[T]+V.downSkipWidths[T]-X;
U.downSkipWidths[T]=Z;}else{var U=W.nodes[T];var Y=U.downPtrs[T];U.downSkips[T]--;U.downSkipWidths[T]-=X;
}}delete I["$KEY$"+V.key];A--;D-=X;}function R(V){var X=V.downSkipWidths[0];var Y=K(V.entry);var W=Y-X;
var U=V;var T=0;while(T<U.levels){U.downSkipWidths[T]+=W;T++;while(T>=U.levels&&U.upPtrs[T-1]){U=U.upPtrs[T-1];
}}D+=W;}function L(X,W){var V=(W?0:-1);var T=X;while(T!==B){var U=T.levels-1;T=T.upPtrs[U];if(W){V+=T.downSkipWidths[U];
}else{V+=T.downSkips[U];}}return V;}function F(T){return I["$KEY$"+T];}function Q(Y){var U=B;var T=B.levels-1;
var W=-1;function X(Z){if(Z===B){return false;}else{if(Z===E){return true;}else{return Y(Z.entry);}}}while(T>=0){var V=U.downPtrs[T];
while(!X(V)){W+=U.downSkips[T];U=V;V=U.downPtrs[T];}T--;}return W+1;}var C={length:function(){return A;
},atIndex:function(T){if(T<0){console.warn("atIndex("+T+")");}if(T>=A){console.warn("atIndex("+T+">="+A+")");
}return O(J(T)).entry;},splice:function(T,W,V){if(T<0){console.warn("splice("+T+", ...)");}if(T+W>A){console.warn("splice("+T+", "+W+", ...), N="+A);
console.warn("%s %s %s",typeof T,typeof W,typeof A);console.trace();}if(!V){V=[];}var Y=J(T);for(var U=0;
U<W;U++){M(Y);}for(var U=(V.length-1);U>=0;U--){var X=V[U];N(Y,X.key,X);var Z=F(X.key);Z.entry=X;}},next:function(T){return F(T.key).downPtrs[0].entry||null;
},prev:function(T){return F(T.key).upPtrs[0].entry||null;},push:function(T){C.splice(A,0,[T]);},slice:function(T,U){if(T===undefined){T=0;
}else{if(T<0){T+=A;}}if(U===undefined){U=A;}else{if(U<0){U+=A;}}if(T<0){T=0;}if(T>A){T=A;}if(U<0){U=0;
}if(U>A){U=A;}dmesg(String([T,U,A]));if(U<=T){return[];}var V=C.atIndex(T);var X=[V];for(var W=1;W<(U-T);
W++){V=C.next(V);X.push(V);}return X;},atKey:function(T){return F(T).entry;},indexOfKey:function(T){return L(F(T));
},indexOfEntry:function(T){return C.indexOfKey(T.key);},containsKey:function(T){return !!(F(T));},atOffset:function(T){return P(T).entry;
},keyAtOffset:function(T){return C.atOffset(T).key;},offsetOfKey:function(T){return L(F(T),true);},offsetOfEntry:function(T){return C.offsetOfKey(T.key);
},setEntryWidth:function(T,U){T.width=U;R(F(T.key));},totalWidth:function(){return D;},offsetOfIndex:function(T){if(T<0){return 0;
}if(T>=A){return D;}return C.offsetOfEntry(C.atIndex(T));},indexOfOffset:function(T){if(T<=0){return 0;
}if(T>=D){return A;}return C.indexOfEntry(C.atOffset(T));},search:function(T){return Q(T);},debugGetPoint:J,debugDepth:function(){return B.levels;
}};return C;}
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function makeVirtualLineView(B){var E=20;
var D=null;function G(){return(B.textContent||B.innerText).length;}function F(){if(!D){var J=C();J.forwardByWhile(E);
D=J;}return D.getVirtualLine()+1;}function H(L){var J=C();J.forwardByWhile(E,null,L);var K=J.getVirtualLine();
J.backwardByWhile(8,function(){return J.getVirtualLine()==K;});J.forwardByWhile(1,function(){return J.getVirtualLine()!=K;
});var M=J.getOffset();return{vline:K,offset:(L-M)};}function I(Q,P){var J=C();J.binarySearch(function(){return J.getVirtualLine()>=Q;
});var M=J.getOffset();var L=J.getVirtualLine();J.forwardByWhile(E,null,M+P);J.backwardByWhile(1,function(){return J.getVirtualLine()!=L;
},M);var K=J.getOffset();var N=K-M;if(N<P&&L==(F()-1)){var O=G();N+=O-K;K=O;}return{vline:L,offset:N,lineChar:K};
}return{getNumVirtualLines:F,getVLineAndOffsetForChar:H,getCharForVLineAndOffset:I,makeCharSeeker:function(){return C();
}};function A(J){J=J.firstChild;while(J&&J.firstChild){J=J.firstChild;}if(J.data){return J;}return null;
}function C(){function T(a,b){var Z=a.parentNode;var h=(a.nodeValue.charAt(b)===" ");if(h){if(b==0){if(Z.previousSibling&&A(Z.previousSibling)){a=A(Z.previousSibling);
b=a.length-1;Z=a.parentNode;}else{return{top:Z.offsetTop,left:Z.offsetLeft};}}else{b--;}}var c=document.createElement("SPAN");
var f=a.nodeValue;var d=document.createDocumentFragment();d.appendChild(document.createTextNode(f.substring(0,b)));
c.appendChild(document.createTextNode(f.substr(b,1)));d.appendChild(c);d.appendChild(document.createTextNode(f.substring(b+1)));
Z.replaceChild(d,a);var j={top:c.offsetTop,left:c.offsetLeft+(h?c.offsetWidth:0),height:c.offsetHeight};
while(Z.firstChild){Z.removeChild(Z.firstChild);}Z.appendChild(a);return j;}var Y=(B.textContent||B.innerText);
var O=Y.length;var M=null;var J=0;var L=0;var P;var N;var V;var X=0;function Q(){var Z=M;if(!Z){Z=B.firstChild;
}else{Z=Z.nextSibling;}while(Z&&!A(Z)){Z=Z.nextSibling;}return Z;}function S(){var Z=M;if(!Z){Z=B.lastChild;
}else{Z=Z.previousSibling;}while(Z&&!A(Z)){Z=Z.previousSibling;}return Z;}var K;if(O>0){M=Q();var R=T(A(M),0);
V=R.height;P=R.top;N=R.left;function W(b,a){var Z=T(b,a);X+=Math.round((Z.top-P)/V);P=Z.top;N=Z.left;
}K={forward:function(f){var c=J;var Z=J+f;if(Z>(O-1)){Z=O-1;}while(J<Z){var d=A(M).length;var a=d-L;if(J+a>Z||!Q()){var b=Z-J;
if(b>=a){b=a-1;}J+=b;L+=b;break;}else{J+=a;L=0;M=Q();}}W(A(M),L);return J-c;},backward:function(c){var b=J;
var Z=J-c;if(Z<0){Z=0;}while(J>Z){if(J-L<=Z||!S()){var a=J-Z;if(a>L){a=L;}J-=a;L-=a;break;}else{J-=L+1;
M=S();L=A(M).length-1;}}W(A(M),L);return b-J;},getVirtualLine:function(){return X;},getLeftCoord:function(){return N;
}};}else{N=B.offsetLeft;K={forward:function(Z){return 0;},backward:function(Z){return 0;},getVirtualLine:function(){return 0;
},getLeftCoord:function(){return N;}};}K.getOffset=function(){return J;};K.getLineLength=function(){return O;
};K.toString=function(){return"seeker[curChar: "+J+"("+Y.charAt(J)+"), left: "+K.getLeftCoord()+", vline: "+K.getVirtualLine()+"]";
};function U(c,n,f,a){var b=null;var m=((typeof f)=="function");var l=f;var j=((typeof a)=="number");
var d=a;while(b!==0&&((!m)||l())){var Z=n;if(j){var h=(c?J-d:d-J);if(h<Z){Z=h;}}if(Z<0){break;}b=(c?K.backward(Z):K.forward(Z));
}}K.forwardByWhile=function(Z,b,a){U(false,Z,b,a);};K.backwardByWhile=function(Z,b,a){U(true,Z,b,a);};
K.binarySearch=function(Z){var b=Z;var a=function(){return !Z();};K.forwardByWhile(20,a);K.backwardByWhile(20,b);
K.forwardByWhile(10,a);K.backwardByWhile(5,b);K.forwardByWhile(1,a);return K.getOffset()+(Z()?0:1);};
return K;}}
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if(typeof(jimport)!="undefined"){jimport("com.etherpad.Easysync2Support");
}var _opt=null;function AttribPool(){var A={};A.numToAttrib={};A.attribToNum={};A.nextNum=0;A.putAttrib=function(C,E){var D=String(C);
if(D in A.attribToNum){return A.attribToNum[D];}if(E){return -1;}var B=A.nextNum++;A.attribToNum[D]=B;
A.numToAttrib[B]=[String(C[0]||""),String(C[1]||"")];return B;};A.getAttrib=function(C){var B=A.numToAttrib[C];
if(!B){return B;}return[B[0],B[1]];};A.getAttribKey=function(C){var B=A.numToAttrib[C];if(!B){return"";
}return B[0];};A.getAttribValue=function(C){var B=A.numToAttrib[C];if(!B){return"";}return B[1];};A.eachAttrib=function(C){for(var D in A.numToAttrib){var B=A.numToAttrib[D];
C(B[0],B[1]);}};A.copy=function(){var B=new AttribPool();A.eachAttrib(function(C,D){B.putAttrib([C,D]);
});return B;};A.modifyAttribs=function(H){for(var C=0;C<A.nextNum;C++){var D=C;var B=A.numToAttrib[D];
var G=String(B);var E=[B[0],H(B[0],B[1])];A.numToAttrib[D]=E;delete A.attribToNum[G];var F=String(E);
A.attribToNum[F]=D;}};A.toJsonable=function(){return{numToAttrib:A.numToAttrib,nextNum:A.nextNum};};A.fromJsonable=function(B){A.numToAttrib=B.numToAttrib;
A.nextNum=B.nextNum;A.attribToNum={};for(var C in A.numToAttrib){A.attribToNum[String(A.numToAttrib[C])]=Number(C);
}return A;};return A;}var Changeset={};Changeset.error=function error(B){typeof window!=="undefined"&&window.onfreakout&&window.onfreakout(B);
var A=new Error(B);A.easysync=true;throw A;};Changeset.assert=function assert(A,C){if(!A){var B=Array.prototype.slice.call(arguments,1).join("");
Changeset.error("Changeset: "+B);}};Changeset.parseNum=function(A){return parseInt(A,36);};Changeset.numToString=function(A){return A.toString(36).toLowerCase();
};Changeset.toBaseTen=function(A){var B=A.indexOf("$");var D=A.substring(0,B);var C=A.substring(B);return D.replace(/[0-9a-z]+/g,function(E){return String(Changeset.parseNum(E));
})+C;};Changeset.oldLen=function(A){return Changeset.unpack(A).oldLen;};Changeset.newLen=function(A){return Changeset.unpack(A).newLen;
};Changeset.isEmpty=function(C){var A=Changeset.opIterator(Changeset.unpack(C).ops);while(A.hasNext()){var B=A.next();
if(B.opcode!="="||B.attribs){return false;}}return true;};Changeset.opIterator=function(E,L){var D=/((?:\*[0-9a-z]+)*)(?:\|([0-9a-z]+))?([-+=])([0-9a-z]+)|\?|/g;
var M=(L||0);var B=M;var F=B;function C(){F=B;var N;if(_opt){N=_opt.nextOpInString(E,B);if(N){if(N.opcode()=="?"){Changeset.error("Hit error opcode in op stream");
}B=N.lastIndex();}}else{D.lastIndex=B;N=D.exec(E);B=D.lastIndex;if(N[0]=="?"){Changeset.error("Hit error opcode in op stream");
}}return N;}var A=C();var G=Changeset.newOp();function J(O){var N=(O||G);if(_opt&&A){N.attribs=A.attribs();
N.lines=A.lines();N.chars=A.chars();N.opcode=A.opcode();A=C();}else{if((!_opt)&&A[0]){N.attribs=A[1];
N.lines=Changeset.parseNum(A[2]||0);N.opcode=A[3];N.chars=Changeset.parseNum(A[4]);A=C();}else{Changeset.clearOp(N);
}}return N;}function H(){return !!(_opt?A:A[0]);}function I(){var N=G;if(_opt&&A){N.attribs=A.attribs();
N.lines=A.lines();N.chars=A.chars();N.opcode=A.opcode();}else{if((!_opt)&&A[0]){N.attribs=A[1];N.lines=Changeset.parseNum(A[2]||0);
N.opcode=A[3];N.chars=Changeset.parseNum(A[4]);}else{Changeset.clearOp(N);}}return N;}function K(){return F;
}return{next:J,hasNext:H,lastIndex:K,peekNext:I};};Changeset.clearOp=function(A){A.opcode="";A.chars=0;
A.lines=0;A.attribs="";};Changeset.newOp=function(A){return{opcode:(A||""),chars:0,lines:0,attribs:""};
};Changeset.cloneOp=function(A){return{opcode:A.opcode,chars:A.chars,lines:A.lines,attribs:A.attribs};
};Changeset.copyOp=function(B,A){A.opcode=B.opcode;A.chars=B.chars;A.lines=B.lines;A.attribs=B.attribs;
};Changeset.opString=function(B){if(!B.opcode){return"null";}var A=Changeset.opAssembler();A.append(B);
return A.toString();};Changeset.stringOp=function(A){return Changeset.opIterator(A).next();};Changeset.checkRep=function(C){var G=Changeset.unpack(C);
var F=G.oldLen;var J=G.newLen;var M=G.ops;var E=G.charBank;var I=Changeset.smartOpAssembler();var D=0;
var B=0;var H=0;var K=Changeset.opIterator(M);while(K.hasNext()){var A=K.next();switch(A.opcode){case"=":D+=A.chars;
B+=A.chars;break;case"-":D+=A.chars;Changeset.assert(D<F,D," >= ",F," in ",C);break;case"+":B+=A.chars;
H+=A.chars;Changeset.assert(B<J,B," >= ",J," in ",C);break;}I.append(A);}B+=F-D;E=E.substring(0,H);while(E.length<H){E+="?";
}I.endDocument();var L=Changeset.pack(F,B,I.toString(),E);Changeset.assert(L==C,L," != ",C);return C;
};Changeset.checkRepWithText=function(E,N){var G=Changeset.unpack(E);var F=G.oldLen;var P=G.newLen;var O=G.ops;
var D=G.charBank;var I=Changeset.smartOpAssembler();var C=0;var B=0;var H=0;function J(S,T,V,U){var R=T.slice(V,U);
var Q=R.split("\n");Changeset.assert(S.lines==(Q.length-1),S.lines," != ",Q.length-1," in ",R);if(Q.length-1){Changeset.assert(Q[Q.length-1]=="",Q[Q.length-1]," != ",""," in ",R);
}}var L=Changeset.opIterator(O);while(L.hasNext()){var A=L.next();switch(A.opcode){case"=":var K=B;C+=A.chars;
B+=A.chars;J(A,N,K,B);break;case"-":C+=A.chars;Changeset.assert(C<F,C," >= ",F," in ",E);break;case"+":var K=B;
B+=A.chars;H+=A.chars;J(A,N,K,B);}I.append(A);}B+=F-C;D=D.substring(0,H);while(D.length<H){D+="?";}I.endDocument();
var M=Changeset.pack(F,B,I.toString(),D);Changeset.assert(M==E,M," != ",E);return E;};Changeset.smartOpAssembler=function(){var G=Changeset.mergingOpAssembler();
var E=Changeset.mergingOpAssembler();var B=Changeset.mergingOpAssembler();var A=Changeset.stringAssembler();
var C="";var F=0;function H(){A.append(B.toString());B.clear();}function I(){A.append(G.toString());G.clear();
A.append(E.toString());E.clear();}function D(O){if(!O.opcode){return;}if(!O.chars){return;}if(O.opcode=="-"){if(C=="="){H();
}G.append(O);F-=O.chars;}else{if(O.opcode=="+"){if(C=="="){H();}E.append(O);F+=O.chars;}else{if(O.opcode=="="){if(C!="="){I();
}B.append(O);}}}C=O.opcode;}function M(R,P,T,S){var O=Changeset.newOp(R);O.attribs=Changeset.makeAttribsString(R,T,S);
var Q=P.lastIndexOf("\n");if(Q<0){O.chars=P.length;O.lines=0;D(O);}else{O.chars=Q+1;O.lines=P.match(/\n/g).length;
D(O);O.chars=P.length-(Q+1);O.lines=0;D(O);}}function K(){I();H();return A.toString();}function N(){G.clear();
E.clear();B.clear();A.clear();F=0;}function L(){B.endDocument();}function J(){return F;}return{append:D,toString:K,clear:N,endDocument:L,appendOpWithText:M,getLengthChange:J};
};if(_opt){Changeset.mergingOpAssembler=function(){var A=_opt.mergingOpAssembler();function C(F){A.append(F.opcode,F.chars,F.lines,F.attribs);
}function E(){return A.toString();}function B(){A.clear();}function D(){A.endDocument();}return{append:C,toString:E,clear:B,endDocument:D};
};}else{Changeset.mergingOpAssembler=function(){var C=Changeset.opAssembler();var A=Changeset.newOp();
var B=0;function D(I){if(A.opcode){if(I&&A.opcode=="="&&!A.attribs){}else{C.append(A);if(B){A.chars=B;
A.lines=0;C.append(A);B=0;}}A.opcode="";}}function F(I){if(I.chars>0){if(A.opcode==I.opcode&&A.attribs==I.attribs){if(I.lines>0){A.chars+=B+I.chars;
A.lines+=I.lines;B=0;}else{if(A.lines==0){A.chars+=I.chars;}else{B+=I.chars;}}}else{D();Changeset.copyOp(I,A);
}}}function G(){D(true);}function H(){D();return C.toString();}function E(){C.clear();Changeset.clearOp(A);
}return{append:F,toString:H,clear:E,endDocument:G};};}if(_opt){Changeset.opAssembler=function(){var A=_opt.opAssembler();
function C(E){A.append(E.opcode,E.chars,E.lines,E.attribs);}function D(){return A.toString();}function B(){A.clear();
}return{append:C,toString:D,clear:B};};}else{Changeset.opAssembler=function(){var A=[];function C(E){A.push(E.attribs);
if(E.lines){A.push("|",Changeset.numToString(E.lines));}A.push(E.opcode);A.push(Changeset.numToString(E.chars));
}function D(){return A.join("");}function B(){A.length=0;}return{append:C,toString:D,clear:B};};}Changeset.stringIterator=function(D){var A=0;
function B(H){Changeset.assert(H<=C(),"!(",H," <= ",C(),")");}function F(H){B(H);var I=D.substr(A,H);
A+=H;return I;}function E(H){B(H);var I=D.substr(A,H);return I;}function G(H){B(H);A+=H;}function C(){return D.length-A;
}return{take:F,skip:G,remaining:C,peek:E};};Changeset.stringAssembler=function(){var A=[];function B(D){A.push(String(D));
}function C(){return A.join("");}return{append:B,toString:C};};Changeset.textLinesMutator=function(C){var A=[0,0];
var D=false;var E=0,B=0;function O(X){C.splice.apply(C,X);}function S(){return C.toSource();}function J(X){if(C.get){return C.get(X);
}else{return C[X];}}function U(Y,X){if(C.slice){return C.slice(Y,X);}else{return[];}}function T(){if((typeof C.length)=="number"){return C.length;
}else{return C.length();}}function G(){A[0]=E;A[1]=0;if(B>0){F();}D=true;}function K(){O(A);A.length=2;
A[0]=A[1]=0;D=false;}function H(){return(E-A[0]<(A.length-2));}function W(X){print(X+": "+A.toSource()+" / "+E+","+B+" / "+S());
}function F(){if(!H()){A.push(J(A[0]+A[1]));A[1]++;}return 2+E-A[0];}function L(X,Z){if(X){if(Z){if(!D){G();
}for(var Y=0;Y<X;Y++){B=0;F();E++;}}else{if(D){if(X>1){K();}else{F();}}E+=X;B=0;}}}function R(Z,Y,X){if(Z){if(Y){L(Y,X);
}else{if(X&&!D){G();}if(D){F();}B+=Z;}}}function I(X){var Y="";if(X){if(!D){G();}function a(c){var b=A[0]+A[1];
return U(b,b+c).join("");}if(H()){if(B==0){Y=A[A.length-1];A.length--;Y+=a(X-1);A[1]+=X-1;}else{Y=a(X-1);
A[1]+=X-1;var Z=A.length-1;Y=A[Z].substring(B)+Y;A[Z]=A[Z].substring(0,B)+J(A[0]+A[1]);A[1]+=1;}}else{Y=a(X);
A[1]+=X;}}return Y;}function V(Y,Z){var a="";if(Y){if(Z){return I(Z);}else{if(!D){G();}var X=F();a=A[X].substring(B,B+Y);
A[X]=A[X].substring(0,B)+A[X].substring(B+Y);}}return a;}function M(Z,c){if(Z){if(!D){G();}if(c){var X=Changeset.splitTextLines(Z);
if(H()){var Y=A.length-1;var a=A[Y];var b=B;A[Y]=a.substring(0,b)+X[0];E++;X.splice(0,1);Array.prototype.push.apply(A,X);
E+=X.length;A.push(a.substring(b));B=0;}else{Array.prototype.push.apply(A,X);E+=X.length;}}else{var Y=F();
A[Y]=A[Y].substring(0,B)+Z+A[Y].substring(B);B+=Z.length;}}}function N(){var X=T();if(D){X+=A.length-2-A[1];
}return E<X;}function P(){if(D){K();}}var Q={skip:R,remove:V,insert:M,close:P,hasMore:N,removeLines:I,skipLines:L};
return Q;};Changeset.applyZip=function(I,K,H,J,G){var F=Changeset.opIterator(I,K);var E=Changeset.opIterator(H,J);
var D=Changeset.smartOpAssembler();var A=Changeset.newOp();var C=Changeset.newOp();var B=Changeset.newOp();
while(A.opcode||F.hasNext()||C.opcode||E.hasNext()){if((!A.opcode)&&F.hasNext()){F.next(A);}if((!C.opcode)&&E.hasNext()){E.next(C);
}G(A,C,B);if(B.opcode){D.append(B);B.opcode="";}}D.endDocument();return D.toString();};Changeset.unpack=function(B){var G=/Z:([0-9a-z]+)([><])([0-9a-z]+)|/;
var A=G.exec(B);if((!A)||(!A[0])){Changeset.error("Not a changeset: "+B);}var D=Changeset.parseNum(A[1]);
var E=(A[2]==">")?1:-1;var H=Changeset.parseNum(A[3]);var F=D+E*H;var I=A[0].length;var C=B.indexOf("$");
if(C<0){C=B.length;}return{oldLen:D,newLen:F,ops:B.substring(I,C),charBank:B.substring(C+1)};};Changeset.pack=function(C,G,F,D){var A=G-C;
var E=(A>=0?">"+Changeset.numToString(A):"<"+Changeset.numToString(-A));var B=[];B.push("Z:",Changeset.numToString(C),E,F,"$",D);
return B.join("");};Changeset.applyToText=function(H,E){var C=Changeset.unpack(H);Changeset.assert(E.length==C.oldLen,"mismatched apply: ",E.length," / ",C.oldLen);
var F=Changeset.opIterator(C.ops);var G=Changeset.stringIterator(C.charBank);var B=Changeset.stringIterator(E);
var A=Changeset.stringAssembler();while(F.hasNext()){var D=F.next();switch(D.opcode){case"+":A.append(G.take(D.chars));
break;case"-":B.skip(D.chars);break;case"=":A.append(B.take(D.chars));break;}}A.append(B.take(B.remaining()));
return A.toString();};Changeset.getNewlyMentionedEncryptedUserIds=function(G,H){var B=[];var F=Changeset.unpack(G);
var C=Changeset.opIterator(F.ops);while(C.hasNext()){var D=C.next();switch(D.opcode){case"+":var A=Changeset.attribsAttributeValue(D.attribs,"link",H);
if(A){var I=new RegExp(".*/ep/profile/(.*)");var E=A.match(I);if(E){B.push(E[1]);}}break;}}return B;};
function _trim(A){return A.replace(/^\s\s*/,"").replace(/\s\s*$/,"");}Changeset.convertToKeeps=function(E){var A=Changeset.mergingOpAssembler();
var C=Changeset.unpack(E);var D=Changeset.opIterator(C.ops);while(D.hasNext()){var F=D.next();var B=Changeset.newOp();
Changeset.copyOp(F,B);B.opcode="=";A.append(B);}A.endDocument();return Changeset.pack(C.newLen,C.newLen,A.toString(),"");
};Changeset.applyToTextAsDiff=function(Z,N,V,U,K,b){var D=Changeset.mergingOpAssembler();var P=Changeset.stringAssembler();
var Q=Changeset.unpack(Z);Changeset.assert(N.length==Q.oldLen,"mismatched apply: ",N.length," / ",Q.oldLen);
var T=Changeset.opIterator(Q.ops);var Y=Changeset.stringIterator(Q.charBank);var O=Changeset.stringIterator(N);
var H=true;var R=true;var S=false;var X=[];while(T.hasNext()){var E=T.next();var F=Changeset.newOp();
Changeset.copyOp(E,F);switch(E.opcode){case"+":S=false;var W=Y.take(E.chars);if(_trim(W)!=""){R=false;
}F.attribs+=("*"+Changeset.numToString(V));D.append(F);P.append(W);H=false;break;case"-":S=true;var a=O.take(E.chars);
if(_trim(a)!=""&&(E.attribs||b)){R=false;F.opcode="=";F.attribs+=("*"+Changeset.numToString(U));D.append(F);
}else{D.append(F);}H=false;if(E.lines==E.chars&&false){var M=Changeset.newOp();M.opcode="+";M.chars=1;
M.lines=0;M.attribs+=("*"+Changeset.numToString(U));P.append(" ");D.append(M);}break;case"=":var L=O.take(E.chars);
if(E.attribs){Changeset.eachAttribNumber(E.attribs,function(c){X.push(c);});F.attribs+=("*"+Changeset.numToString(V));
D.append(F);R=false;}else{var B=L.split("\n");if(B.length>4||(H&&B.length>3)){var J=B[0];var I=B[B.length-1];
if(!H){var G=Changeset.newOp();G.opcode="=";G.chars=J.length+1;G.lines=1;G.attribs+=("*"+Changeset.numToString(K));
D.append(G);}else{J="";}var A=Changeset.newOp();A.opcode="-";if(!H){A.chars=L.length-(J.length+1)-(I.length+1);
A.lines=B.length-3;}else{A.chars=L.length-(I.length+1);A.lines=B.length-2;}D.append(A);var C=Changeset.newOp();
C.opcode="=";C.chars=I.length+1;C.lines=1;C.attribs+=("*"+Changeset.numToString(K));D.append(C);}else{if(H&&B.length>1){var A=Changeset.newOp();
A.opcode="-";A.chars=B[0].length+1;A.lines=1;D.append(A);var C=Changeset.newOp();C.opcode="=";C.chars=E.chars-(B[0].length+1);
C.lines=E.lines-1;C.attribs+=("*"+Changeset.numToString(K));D.append(C);}else{D.append(F);}}}H=false;
break;}}var L=O.take(O.remaining());var B=L.split("\n");if(B.length>2){var J=B[0];var I=B[B.length-1];
if(!H){var G=Changeset.newOp();G.opcode="=";G.chars=J.length+1;G.lines=1;G.attribs+=("*"+Changeset.numToString(K));
D.append(G);}else{J="";}var A=Changeset.newOp();A.opcode="-";if(!H){A.chars=L.length-(J.length+1)-(I.length+1);
A.lines=B.length-3;}else{A.chars=L.length-(I.length+1);A.lines=B.length-2;}A.attribs+=("*"+Changeset.numToString(K));
D.append(A);var C=Changeset.newOp();C.opcode="=";C.chars=I.length+1;C.lines=1;C.attribs+=("*"+Changeset.numToString(K));
D.append(C);}else{}return[Changeset.pack(N.length,N.length+P.toString().length,D.toString(),P),R,X];};
Changeset.mutateTextLines=function(G,F){var C=Changeset.unpack(G);var D=Changeset.opIterator(C.ops);var E=Changeset.stringIterator(C.charBank);
var B=Changeset.textLinesMutator(F);while(D.hasNext()){var A=D.next();switch(A.opcode){case"+":B.insert(E.take(A.chars),A.lines);
break;case"-":B.remove(A.chars,A.lines);break;case"=":B.skip(A.chars,A.lines,(!!A.attribs));break;}}B.close();
};Changeset.composeAttributes=function(G,F,E,D){if((!G)&&E){return F;}if(!F){return G;}var A=[];G.replace(/\*([0-9a-z]+)/g,function(I,H){A.push(D.getAttrib(Changeset.parseNum(H)));
return"";});F.replace(/\*([0-9a-z]+)/g,function(M,L){var H=D.getAttrib(Changeset.parseNum(L));var K=false;
for(var I=0;I<A.length;I++){var J=A[I];if(J[0]==H[0]){if(H[1]||E){J[1]=H[1];}else{A.splice(I,1);}K=true;
break;}}if((!K)&&(H[1]||E)){A.push(H);}return"";});A.sort();var B=Changeset.stringAssembler();for(var C=0;
C<A.length;C++){B.append("*");B.append(Changeset.numToString(D.putAttrib(A[C])));}return B.toString();
};Changeset._slicerZipperFunc=function(A,B,C,D){if(A.opcode=="-"){Changeset.copyOp(A,C);A.opcode="";}else{if(!A.opcode){Changeset.copyOp(B,C);
B.opcode="";}else{switch(B.opcode){case"-":if(B.chars<=A.chars){if(A.opcode=="="){C.opcode="-";C.chars=B.chars;
C.lines=B.lines;C.attribs="";}A.chars-=B.chars;A.lines-=B.lines;B.opcode="";if(!A.chars){A.opcode="";
}}else{if(A.opcode=="="){C.opcode="-";C.chars=A.chars;C.lines=A.lines;C.attribs="";}B.chars-=A.chars;
B.lines-=A.lines;A.opcode="";}break;case"+":Changeset.copyOp(B,C);B.opcode="";break;case"=":if(B.chars<=A.chars){C.opcode=A.opcode;
C.chars=B.chars;C.lines=B.lines;C.attribs=Changeset.composeAttributes(A.attribs,B.attribs,A.opcode=="=",D);
B.opcode="";A.chars-=B.chars;A.lines-=B.lines;if(!A.chars){A.opcode="";}}else{C.opcode=A.opcode;C.chars=A.chars;
C.lines=A.lines;C.attribs=Changeset.composeAttributes(A.attribs,B.attribs,A.opcode=="=",D);A.opcode="";
B.chars-=A.chars;B.lines-=A.lines;}break;case"":Changeset.copyOp(A,C);A.opcode="";break;}}}};Changeset.applyToAttribution=function(D,C,B){var A=Changeset.unpack(D);
return Changeset.applyZip(C,0,A.ops,0,function(F,E,G){return Changeset._slicerZipperFunc(F,E,G,B);});
};Changeset.mutateAttributionLines=function(N,Q,O){var I=Changeset.unpack(N);var H=Changeset.opIterator(I.ops);
var M=I.charBank;var G=0;var F=Changeset.textLinesMutator(Q);var B=null;function L(){return(B&&B.hasNext())||F.hasMore();
}function P(R){if((!(B&&B.hasNext()))&&F.hasMore()){var S=F.removeLines(1);B=Changeset.opIterator(S);
}if(B&&B.hasNext()){B.next(R);}else{R.opcode="";}}var D=null;function J(R){if(!D){D=Changeset.mergingOpAssembler();
}D.append(R);if(R.lines>0){Changeset.assert(R.lines==1,"Can't have op.lines of ",R.lines," in attribution lines");
F.insert(D.toString(),1);D=null;}}var A=Changeset.newOp();var E=Changeset.newOp();var C=Changeset.newOp();
while(A.opcode||H.hasNext()||E.opcode||L()){if((!A.opcode)&&H.hasNext()){H.next(A);}if((!A.opcode)&&(!E.opcode)&&(!D)&&(!(B&&B.hasNext()))){break;
}else{if(A.opcode=="="&&A.lines>0&&(!A.attribs)&&(!E.opcode)&&(!D)&&(!(B&&B.hasNext()))){F.skipLines(A.lines);
A.opcode="";}else{if(A.opcode=="+"){if(A.lines>1){var K=M.indexOf("\n",G)+1-G;Changeset.copyOp(A,C);A.chars-=K;
A.lines--;C.lines=1;C.chars=K;}else{Changeset.copyOp(A,C);A.opcode="";}J(C);G+=C.chars;C.opcode="";}else{if((!E.opcode)&&L()){P(E);
}Changeset._slicerZipperFunc(E,A,C,O);if(C.opcode){J(C);C.opcode="";}}}}}Changeset.assert(!D,"line assembler not finished");
F.close();};Changeset.joinAttributionLines=function(D){var C=Changeset.mergingOpAssembler();for(var A=0;
A<D.length;A++){var E=D[A];var B=Changeset.opIterator(E);while(B.hasNext()){C.append(B.next());}}return C.toString();
};Changeset.splitAttributionLines=function(J,K){var G=Changeset.opIterator(J);var C=Changeset.mergingOpAssembler();
var I=[];var D=0;function E(L){C.append(L);if(L.lines>0){I.push(C.toString());C.clear();}D+=L.chars;}while(G.hasNext()){var A=G.next();
var F=A.chars;var B=A.lines;while(B>1){var H=K.indexOf("\n",D)+1;Changeset.assert(H>0,"newlineEnd <= 0 in splitAttributionLines");
A.chars=H-D;A.lines=1;E(A);F-=A.chars;B-=A.lines;}if(B==1){A.chars=F;A.lines=1;}E(A);}return I;};Changeset.splitTextLines=function(A){return A.match(/[^\n]*(?:\n|[^\n]$)/g);
};Changeset.compose=function(J,H,L){var B=Changeset.unpack(J);var A=Changeset.unpack(H);var K=B.oldLen;
var I=B.newLen;Changeset.assert(I==A.oldLen,"mismatched composition");var G=A.newLen;var D=Changeset.stringIterator(B.charBank);
var E=Changeset.stringIterator(A.charBank);var C=Changeset.stringAssembler();var F=Changeset.applyZip(B.ops,0,A.ops,0,function(O,N,M){var Q=O.opcode;
var P=N.opcode;if(Q=="+"&&P=="-"){D.skip(Math.min(O.chars,N.chars));}Changeset._slicerZipperFunc(O,N,M,L);
if(M.opcode=="+"){if(P=="+"){C.append(E.take(M.chars));}else{C.append(D.take(M.chars));}}});return Changeset.pack(K,G,F,C.toString());
};Changeset.attributeTester=function(D,B){if(!B){return C;}var A=B.putAttrib(D,true);if(A<0){return C;
}else{var E=new RegExp("\\*"+Changeset.numToString(A)+"(?!\\w)");return function(F){return E.test(F);
};}function C(F){return false;}};Changeset.identity=function(A){return Changeset.pack(A,A,"","");};Changeset.makeSplice=function(B,A,F,E,H,J){var D=B.length;
if(A>=D){A=D-1;}if(F>B.length-A-1){F=B.length-A-1;}var G=B.substring(A,A+F);var I=D+E.length-G.length;
var C=Changeset.smartOpAssembler();C.appendOpWithText("=",B.substring(0,A));C.appendOpWithText("-",G);
C.appendOpWithText("+",E,H,J);C.endDocument();return Changeset.pack(D,I,C.toString(),E);};Changeset.toSplices=function(G){var F=Changeset.unpack(G);
var B=[];var C=0;var E=Changeset.opIterator(F.ops);var H=Changeset.stringIterator(F.charBank);var D=false;
while(E.hasNext()){var A=E.next();if(A.opcode=="="){C+=A.chars;D=false;}else{if(!D){B.push([C,C,""]);
D=true;}if(A.opcode=="-"){C+=A.chars;B[B.length-1][1]+=A.chars;}else{if(A.opcode=="+"){B[B.length-1][2]+=H.take(A.chars);
}}}}return B;};Changeset.characterRangeFollow=function(M,N,L,K){var C=N;var A=L;var J=Changeset.toSplices(M);
var H=0;for(var G=0;G<J.length;G++){var F=J[G];var B=F[0]+H;var E=F[1]+H;var I=F[2].length;var D=I-(E-B);
if(B<=C&&E>=A){if(K){C=A=B;}else{C=A=B+I;}}else{if(E<=C){C+=D;A+=D;}else{if(B>=A){}else{if(B>=C&&E<=A){A+=D;
}else{if(E<A){C=B+I;A+=D;}else{A=B;}}}}}H+=D;}return[C,A];};Changeset.moveOpsToNewPool=function(A,F,C){var B=A.indexOf("$");
if(B<0){B=A.length;}var D=A.substring(0,B);var E=A.substring(B);return D.replace(/\*([0-9a-z]+)/g,function(K,H){var I=Changeset.parseNum(H);
var G=F.getAttrib(I);if(!G){return"";}var J=C.putAttrib(G);return"*"+Changeset.numToString(J);})+E;};
Changeset.makeAttribution=function(B){var A=Changeset.smartOpAssembler();A.appendOpWithText("+",B);return A.toString();
};Changeset.eachAttribNumber=function(A,D){var B=A.indexOf("$");if(B<0){B=A.length;}var C=A.substring(0,B);
C.replace(/\*([0-9a-z]+)/g,function(F,E){D(Changeset.parseNum(E));return"";});};Changeset.filterAttribNumbers=function(B,A){return Changeset.mapAttribNumbers(B,A);
};Changeset.mapAttribNumbers=function(A,E){var B=A.indexOf("$");if(B<0){B=A.length;}var D=A.substring(0,B);
var C=D.replace(/\*([0-9a-z]+)/g,function(H,G){var F=E(Changeset.parseNum(G));if(F===true){return H;}else{if((typeof F)==="number"){return"*"+Changeset.numToString(F);
}else{return"";}}});return C+A.substring(B);};Changeset.makeAText=function(A,B){return{text:A,attribs:(B||Changeset.makeAttribution(A))};
};Changeset.applyToAText=function(A,B,C){return{text:Changeset.applyToText(A,B.text),attribs:Changeset.applyToAttribution(A,B.attribs,C)};
};Changeset.applyToATextAsDiff=function(A,B,C){return{text:Changeset.applyToTextAsDiff(A,B.text),attribs:Changeset.applyToAttribution(A,B.attribs,C)};
};Changeset.cloneAText=function(A){return{text:A.text,attribs:A.attribs};};Changeset.copyAText=function(A,B){B.text=A.text;
B.attribs=A.attribs;};Changeset.appendATextToAssembler=function(C,B){var D=Changeset.opIterator(C.attribs);
var A=Changeset.newOp();while(D.hasNext()){D.next(A);if(!D.hasNext()){if(A.lines<=1){A.lines=0;A.chars--;
if(A.chars){B.append(A);}}else{var F=C.text.lastIndexOf("\n",C.text.length-2)+1;var E=C.text.length-F-1;
A.lines--;A.chars-=(E+1);B.append(A);A.lines=0;A.chars=E;if(A.chars){B.append(A);}}}else{B.append(A);
}}};Changeset.prepareForWire=function(C,B){var A=new AttribPool();var D=Changeset.moveOpsToNewPool(C,B,A);
return{translated:D,pool:A};};Changeset.isIdentity=function(B){var A=Changeset.unpack(B);return A.ops==""&&A.oldLen==A.newLen;
};Changeset.opAttributeValue=function(C,B,A){return Changeset.attribsAttributeValue(C.attribs,B,A);};
Changeset.attribsAttributeValue=function(C,D,A){var B="";if(C){Changeset.eachAttribNumber(C,function(E){if(A.getAttribKey(E)==D){B=A.getAttribValue(E);
}});}return B;};Changeset.builder=function(E){var B=Changeset.smartOpAssembler();var A=Changeset.newOp();
var D=Changeset.stringAssembler();var C={keep:function(I,G,F,H){A.opcode="=";A.attribs=(F&&Changeset.makeAttribsString("=",F,H))||"";
A.chars=I;A.lines=(G||0);B.append(A);return C;},keepText:function(H,G,F){B.appendOpWithText("=",H,G,F);
return C;},insert:function(F,H,G){B.appendOpWithText("+",F,H,G);D.append(F);return C;},remove:function(G,F){A.opcode="-";
A.attribs="";A.chars=G;A.lines=(F||0);B.append(A);return C;},insertAText:function(F){Changeset.appendATextToAssembler(F,B);
D.append(F.text);return C;},toString:function(){B.endDocument();var F=E+B.getLengthChange();return Changeset.pack(E,F,B.toString(),D.toString());
}};return C;};Changeset.makeAttribsString=function(E,A,D){if(!A){return"";}else{if((typeof A)=="string"){return A;
}else{if(D&&A&&A.length){if(A.length>1){A=A.slice();A.sort();}var C=[];for(var B=0;B<A.length;B++){var F=A[B];
if(E=="="||(E=="+"&&F[1])){C.push("*"+Changeset.numToString(D.putAttrib(F)));}}return C.join("");}}}};
Changeset.subattribution=function(I,F,H){var E=Changeset.opIterator(I,0);var D=Changeset.smartOpAssembler();
var A=Changeset.newOp();var B=Changeset.newOp();var C=Changeset.newOp();function G(){if(B.chars){while(B.opcode&&(A.opcode||E.hasNext())){if(!A.opcode){E.next(A);
}if(B.opcode&&A.opcode&&B.chars>=A.chars&&A.lines>0&&B.lines<=0){B.lines++;}Changeset._slicerZipperFunc(A,B,C,null);
if(C.opcode){D.append(C);C.opcode="";}}}}B.opcode="-";B.chars=F;G();if(H===undefined){if(A.opcode){D.append(A);
}while(E.hasNext()){E.next(A);D.append(A);}}else{B.opcode="=";B.chars=H-F;G();}return D.toString();};
Changeset.inverse=function(U,F,G,J){function P(a){if(F.get){return F.get(a);}else{return F[a];}}function Z(){if((typeof F.length)=="number"){return F.length;
}else{return F.length();}}function Q(a){if(G.get){return G.get(a);}else{return G[a];}}function Y(){if((typeof G.length)=="number"){return G.length;
}else{return G.length();}}var C=0;var E=0;var D=null;var I;var A=Changeset.newOp("+");var R=Changeset.unpack(U);
var N=Changeset.opIterator(R.ops);var H=Changeset.builder(R.newLen);function M(c,f){if((!D)||(I!=C)){D=Changeset.opIterator(Q(C));
I=C;var b=0;var d=false;while(!d){D.next(A);if(b+A.chars>=E){A.chars-=(E-b);d=true;}else{b+=A.chars;}}}while(c>0){if((!A.chars)&&(!D.hasNext())){C++;
E=0;I=C;A.chars=0;D=Changeset.opIterator(Q(C));}if(!A.chars){D.next(A);}var a=Math.min(c,A.chars);f(a,A.attribs,a==A.chars&&A.lines>0);
c-=a;A.chars-=a;E+=a;}if((!A.chars)&&(!D.hasNext())){C++;E=0;}}function X(b,a){if(a){C+=a;E=0;}else{if(D&&I==C){M(b,function(){});
}else{E+=b;}}}function S(f){var a=0;var b=Changeset.stringAssembler();var c=P(C).substring(E);a+=c.length;
b.append(c);var h=C+1;while(a<f){var d=P(h);a+=d.length;b.append(d);h++;}return b.toString().substring(0,f);
}function W(b){var a={};return function(c){if(!a[c]){a[c]=b(c);}return a[c];};}var K=[];var L=[];while(N.hasNext()){var B=N.next();
if(B.opcode=="="){if(B.attribs){K.length=0;L.length=0;Changeset.eachAttribNumber(B.attribs,function(a){K.push(J.getAttribKey(a));
L.push(J.getAttribValue(a));});var T=W(function(h){var d=[];for(var a=0;a<K.length;a++){var c=K[a];var f=L[a];
var b=Changeset.attribsAttributeValue(h,c,J);if(f!=b){d.push([c,b]);}}return Changeset.makeAttribsString("=",d,J);
});M(B.chars,function(a,c,b){H.keep(a,b?1:0,T(c));});}else{X(B.chars,B.lines);H.keep(B.chars,B.lines);
}}else{if(B.opcode=="+"){H.remove(B.chars,B.lines);}else{if(B.opcode=="-"){var V=S(B.chars);var O=0;M(B.chars,function(a,b,c){H.insert(V.substr(O,a),b);
O+=a;});}}}}return Changeset.checkRep(H.toString());};Changeset.follow=function(N,L,K,G){var C=Changeset.unpack(N);
var B=Changeset.unpack(L);var O=C.oldLen;var M=B.oldLen;Changeset.assert(O==M,"mismatched follow");var I=Changeset.stringIterator(C.charBank);
var H=Changeset.stringIterator(B.charBank);var F=C.newLen;var D=0;var A=0;var E=Changeset.attributeTester(["insertorder","first"],G);
var J=Changeset.applyZip(C.ops,0,B.ops,0,function(Q,P,R){if(Q.opcode=="+"||P.opcode=="+"){var S;if(P.opcode!="+"){S=1;
}else{if(Q.opcode!="+"){S=2;}else{var V=I.peek(1);var T=H.peek(1);var W=E(Q.attribs);var U=E(P.attribs);
if(W&&!U){S=1;}else{if(U&&!W){S=2;}else{if(V=="\n"&&T!="\n"){S=2;}else{if(V!="\n"&&T=="\n"){S=1;}else{if(K){S=2;
}else{S=1;}}}}}}}if(S==1){I.skip(Q.chars);R.opcode="=";R.lines=Q.lines;R.chars=Q.chars;R.attribs="";Q.opcode="";
}else{H.skip(P.chars);Changeset.copyOp(P,R);P.opcode="";}}else{if(Q.opcode=="-"){if(!P.opcode){Q.opcode="";
}else{if(Q.chars<=P.chars){P.chars-=Q.chars;P.lines-=Q.lines;Q.opcode="";if(!P.chars){P.opcode="";}}else{Q.chars-=P.chars;
Q.lines-=P.lines;P.opcode="";}}}else{if(P.opcode=="-"){Changeset.copyOp(P,R);if(!Q.opcode){P.opcode="";
}else{if(P.chars<=Q.chars){Q.chars-=P.chars;Q.lines-=P.lines;P.opcode="";if(!Q.chars){Q.opcode="";}}else{R.lines=Q.lines;
R.chars=Q.chars;P.lines-=Q.lines;P.chars-=Q.chars;Q.opcode="";}}}else{if(!Q.opcode){Changeset.copyOp(P,R);
P.opcode="";}else{if(!P.opcode){Q.opcode="";}else{R.opcode="=";R.attribs=Changeset.followAttributes(Q.attribs,P.attribs,G);
if(Q.chars<=P.chars){R.chars=Q.chars;R.lines=Q.lines;P.chars-=Q.chars;P.lines-=Q.lines;Q.opcode="";if(!P.chars){P.opcode="";
}}else{R.chars=P.chars;R.lines=P.lines;Q.chars-=P.chars;Q.lines-=P.lines;P.opcode="";}}}}}}switch(R.opcode){case"=":D+=R.chars;
A+=R.chars;break;case"-":D+=R.chars;break;case"+":A+=R.chars;break;}});A+=F-D;return Changeset.pack(F,A,J,B.charBank);
};Changeset.followAttributes=function(F,E,B){if((!E)||(!B)){return"";}if(!F){return E;}var A=[];E.replace(/\*([0-9a-z]+)/g,function(H,G){A.push(B.getAttrib(Changeset.parseNum(G)));
return"";});F.replace(/\*([0-9a-z]+)/g,function(K,J){var I=B.getAttrib(Changeset.parseNum(J));for(var G=0;
G<A.length;G++){var H=A[G];if(I[0]==H[0]){if(I[1]<=H[1]){A.splice(G,1);}break;}}return"";});var C=Changeset.stringAssembler();
for(var D=0;D<A.length;D++){C.append("*");C.append(Changeset.numToString(B.putAttrib(A[D])));}return C.toString();
};
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function makeCSSManager(O){var D=true;
function I(S){var R=document.styleSheets;for(var P=0;P<R.length;P++){var Q=R[P];if(Q.title==S){return Q;
}}return null;}var A=I(O);function F(){return(A.cssRules||A.rules);}function N(P){if(A.deleteRule){A.deleteRule(P);
}else{A.removeRule(P);}}function J(Q,P,R){if(!R){if(A.insertRule){A.insertRule(P+" {}",Q);}else{A.addRule(P,null,Q);
}}else{var S=P+" {"+(R||"")+"}";if(A.insertRule){A.insertRule(S,Q);}else{A.addRule(P,R,Q);}}}var C=[];
function G(Q){for(var P=0;P<C.length;P++){if(C[P]==Q){return P;}}return -1;}function E(P,R){if(D){var Q=G(P);
if(Q<0){J(0,P,R);C.splice(0,0,P);Q=0;}return F().item(Q).style;}else{B[P]={};return B[P];}}var B={};function L(){while(C.length){B[C[0]]=E(C[0]);
H(C[0]);}D=false;}function K(){return D;}function M(){D=true;for(var P in B){var Q=B[P].cssText;if(Q){E(P,String(Q));
}else{var R=E(P);for(k in B[P]){if(B[P][k]){R[k]=B[P][k];}}}delete B[P];}}function H(Q){if(D){var P=G(Q);
if(P>=0){N(P);C.splice(P,1);}}else{B[Q];}}return{selectorStyle:E,removeSelectorStyle:H,disable:L,enable:M,isEnabled:K,info:function(){return C.length+":"+F().length;
}};}
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var colorutils={};
colorutils.css2triple=function(C){var B=colorutils.css2sixhex(C);function A(D){return Number("0x"+D)/255;
}return[A(B.substr(0,2)),A(B.substr(2,2)),A(B.substr(4,2))];};colorutils.css2sixhex=function(E){var A=/[0-9a-fA-F]+/.exec(E)[0];
if(A.length!=6){var C=A.charAt(0);var B=A.charAt(1);var D=A.charAt(2);A=C+C+B+B+D+D;}return A;};colorutils.triple2css=function(B){function A(D){var C=colorutils.clamp(Math.round(D*255),0,255);
return("0"+C.toString(16)).slice(-2);}return"#"+A(B[0])+A(B[1])+A(B[2]);};colorutils.clamp=function(A,C,B){return A<C?C:(A>B?B:A);
};colorutils.min3=function(C,B,A){return(C<B)?(C<A?C:A):(B<A?B:A);};colorutils.max3=function(C,B,A){return(C>B)?(C>A?C:A):(B>A?B:A);
};colorutils.colorMin=function(A){return colorutils.min3(A[0],A[1],A[2]);};colorutils.colorMax=function(A){return colorutils.max3(A[0],A[1],A[2]);
};colorutils.scale=function(B,A,C){return colorutils.clamp(A+B*(C-A),0,1);};colorutils.unscale=function(B,A,C){return colorutils.clamp((B-A)/(C-A),0,1);
};colorutils.scaleColor=function(C,B,A){return[colorutils.scale(C[0],B,A),colorutils.scale(C[1],B,A),colorutils.scale(C[2],B,A)];
};colorutils.unscaleColor=function(C,B,A){return[colorutils.unscale(C[0],B,A),colorutils.unscale(C[1],B,A),colorutils.unscale(C[2],B,A)];
};colorutils.luminosity=function(A){return A[0]*0.3+A[1]*0.59+A[2]*0.11;};colorutils.saturate=function(A){var C=colorutils.colorMin(A);
var B=colorutils.colorMax(A);if(B-C<=0){return[1,1,1];}return colorutils.unscaleColor(A,C,B);};colorutils.blend=function(C,B,A){return[colorutils.scale(A,C[0],B[0]),colorutils.scale(A,C[1],B[1]),colorutils.scale(A,C[2],B[2])];
}
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;
undoModule=(function(){var A=(function(){var O=[];var Q=0;var S="undoableEvent";var P="externalChange";
function R(){O.length=0;O.push({elementType:S,eventType:"bottom"});Q=1;}R();function V(a){var Z=extend({},a);
Z.elementType=S;O.push(Z);Q++;}function W(a){var Z=O.length-1;if(O[Z].elementType==P){O[Z].changeset=Changeset.compose(O[Z].changeset,a,D());
}else{O.push({elementType:P,changeset:a});}}function T(j){var f=O.length-1-j;var Z=O.length-1;while(Z>f||O[Z].elementType==P){if(O[Z].elementType==P){var b=O[Z];
var a=O[Z-1];if(a.backset){var d=b.changeset;var h=a.backset;a.backset=Changeset.follow(d,a.backset,false,D());
b.changeset=Changeset.follow(h,b.changeset,true,D());if((typeof a.selStart)=="number"){var c=Changeset.characterRangeFollow(d,a.selStart,a.selEnd);
a.selStart=c[0];a.selEnd=c[1];if(a.selStart==a.selEnd){a.selFocusAtStart=false;}}}O[Z-1]=b;O[Z]=a;if(Z>=2&&O[Z-2].elementType==P){b.changeset=Changeset.compose(O[Z-2].changeset,b.changeset,D());
O.splice(Z-2,1);Z--;}}else{Z--;}}}function Y(Z){T(Z);return O[O.length-1-Z];}function X(){return Q;}function U(){T(0);
Q--;return O.pop();}return{numEvents:X,popEvent:U,pushEvent:V,pushExternalChange:W,clearStack:R,getNthFromTop:Y};
})();var B=0;function L(){A.clearStack();B=0;}function J(Q,R){var O=0;var P=0;while(O>=0&&O<Q.length){O=Q.indexOf(R,O);
if(O>=0){P++;O++;}}return P;}function C(O,P){return J(Changeset.unpack(O).ops,P);}function M(P,O){if(!P){return O;
}if(!O){return P;}var W=C(P,"+");var V=C(O,"+");var T=C(P,"-");var S=C(O,"-");if(W==1&&V==1&&T==0&&S==0){var Q=Changeset.compose(P,O,D());
var U=C(Q,"+");var R=C(Q,"-");if(U==1&&R==0){return Q;}}else{if(W==0&&V==0&&T==1&&S==1){var Q=Changeset.compose(P,O,D());
var U=C(Q,"+");var R=C(Q,"-");if(U==0&&R==1){return Q;}}}return null;}function K(O){var P=A.getNthFromTop(0);
function R(){if((typeof O.selStart)=="number"){P.selStart=O.selStart;P.selEnd=O.selEnd;P.selFocusAtStart=O.selFocusAtStart;
}}if((!O.backset)||Changeset.isIdentity(O.backset)){R();}else{var Q=false;if(P.eventType==O.eventType){var S=M(O.backset,P.backset);
if(S){P.backset=S;R();Q=true;}}var T=A.numEvents()-B;while(A.numEvents()>T){A.popEvent();}if(!Q){A.pushEvent(O);
}B=0;}}function I(O){if(O&&!Changeset.isIdentity(O)){A.pushExternalChange(O);}}function G(O){if((typeof O.selStart)!="number"){return null;
}else{return{selStart:O.selStart,selEnd:O.selEnd,selFocusAtStart:O.selFocusAtStart};}}function F(){return B<A.numEvents()-1;
}function H(O){if(F()){var Q=A.getNthFromTop(B);var P=A.getNthFromTop(B+1);var R=O(Q.backset,G(P));A.pushEvent(R);
B+=2;}else{O();}}function E(){return B>=2;}function N(O){if(E()){var Q=A.getNthFromTop(0);var P=A.getNthFromTop(1);
O(Q.backset,G(P));A.popEvent();B-=2;}else{O();}}function D(){return undoModule.apool;}return{clearHistory:L,reportEvent:K,reportExternalChange:I,performUndo:H,performRedo:N,enabled:true,canPerformUndo:F,canPerformRedo:E,apool:null};
})();
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if(typeof(server_side_import)!="undefined"){server_side_import("etherpad.collab.ace.easysync2.Changeset");
}var _MAX_LIST_LEVEL=8;var ZEROWIDTH_SPACE="\u200b";function sanitizeUnicode(A){return A.replace(/[\uffff\ufffe\ufeff\ufdd0-\ufdef\ud800-\udfff]/g,"?");
}function makeContentCollector(l,M,J,a,X){M=M||{};var D=a||{isNodeText:function(p){return(p.nodeType==3);
},nodeTagName:function(p){return p.tagName;},nodeValue:function(p){return p.nodeValue;},nodeNumChildren:function(p){return p.childNodes.length;
},nodeChild:function(q,p){return q.childNodes.item(p);},nodeProp:function(r,q){var s="http://www.w3.org/2000/svg";
if(q=="className"&&r.namespaceURI==s){return r[q].baseVal;}return r[q];},nodeAttr:function(p,q){return p.getAttribute&&p.getAttribute(q);
},optNodeInnerHTML:function(p){return p.innerHTML;}};var m={div:1,p:1,pre:1,li:1,table:1};function U(p){return !!m[(D.nodeTagName(p)||"").toLowerCase()];
}function L(p){return sanitizeUnicode(p.replace(/\u200b/g,"").replace(/[\n\r ]/g," ").replace(/\xa0/g," ").replace(/\t/g,"        "));
}function Z(p){return L(p).replace(/-/g," ");}function R(q,p){return D.nodeProp(q,"_magicdom_"+p);}var C=(function(){var p=[];
var t=[];var q=null;var s=Changeset.newOp("+");var r={length:function(){return p.length;},atColumnZero:function(){return p[p.length-1]==="";
},startNew:function(){p.push("");r.flush(true);q=Changeset.smartOpAssembler();},textOfLine:function(u){return p[u];
},appendText:function(u,v){p[p.length-1]+=u;s.attribs=v;s.chars=u.length;q.append(s);},textLines:function(){return p.slice();
},attribLines:function(){return t;},flush:function(u){if(q){t.push(q.toString());q=null;}}};r.startNew();
return r;}());var A={};function Q(p){if(!C.atColumnZero()){A.startNewLine(p);}}var P=[];var O,H,G;var F=[-1,-1],E=[-1,-1];
var o={div:1,p:1,pre:1};var S=false;var K=0;function V(p,q){if(D.nodeNumChildren(p)==0){return true;}if(D.nodeNumChildren(p)==1&&R(p,"shouldBeEmpty")&&D.optNodeInnerHTML(p)=="&nbsp;"&&!R(p,"unpasted")){if(q){var r=D.nodeChild(p,0);
N(r,0,q);N(r,1,q);}return true;}return false;}function I(s,r){var q=C.length()-1;var p=C.textOfLine(q).length;
if(p==0&&r.listType&&r.listType!="none"){p+=1;}p+=s;return[q,p];}function T(p,q,r){if(!D.isNodeText(p)){N(p,q,r);
}}function N(r,p,q){if(H&&r==H.node&&H.index==p){F=I(0,q);}if(G&&r==G.node&&G.index==p){E=I(0,q);}}A.incrementFlag=function(p,q){p.flags[q]=(p.flags[q]||0)+1;
};A.decrementFlag=function(p,q){p.flags[q]--;};A.incrementAttrib=function(p,q){if(!p.attribs[q]){p.attribs[q]=1;
}else{p.attribs[q]++;}B(p);};A.decrementAttrib=function(p,q){p.attribs[q]--;B(p);};function n(p){var q=p.savedFontAttribs;
p.savedFontAttribs=p.attribs;p.attribs={};B(p);}function d(p,q){p.attribs=p.savedFontAttribs;p.savedFontAttribs=q;
B(p);}function W(p,q,s){var r=p.listType;p.listLevel=(p.listLevel||0)+1;if(q!="none"){p.listNesting=(p.listNesting||0)+1;
}p.listType=q;p.listStart=s;B(p);return r;}function h(p,q){p.listLevel--;if(p.listType!="none"){p.listNesting--;
}p.listType=q;delete p.lang;delete p.listStart;B(p);}function f(p,r){var q=p.author;p.authorLevel=(p.authorLevel||0)+1;
p.author=r;B(p);return q;}function j(p,q){p.authorLevel--;p.author=q;B(p);}function B(p){var q=[];for(var t in p.attribs){if(p.attribs[t]&&!p.table){q.push([t,"true"]);
}}if(p.link){var z=["link",p.link];q.push(z);}if(p.img){var v=["img",p.img];q.push(v);}if(p.embed){var w=["embed",p.embed];
q.push(w);}if(p.table){for(var r=0;r<p.table.length;r++){var u=[p.table[r][0],p.table[r][1]];q.push(u);
}var y=["table",true];q.push(y);}if(p.tex){var x=["tex",p.tex];q.push(x);}if(p.authorLevel>0){var s=["author",p.author];
if(J.putAttrib(s,true)==-1){J.putAttrib(s,false);P.push(p.author);}q.push(s);}p.attribString=Changeset.makeAttribsString("+",q,J);
}function Y(p){var q=[["list",p.listType],["insertorder","first"]];if(p.listStart){q.push(["start",p.listStart]);
p.listStart=parseInt(p.listStart)+1;}if(p.lang){q.push(["lang",p.lang]);}if(p.author){var r=["author",p.author];
if(J.putAttrib(r,true)==-1){J.putAttrib(r,false);P.push(p.author);}q.push(r);}C.appendText("*",Changeset.makeAttribsString("+",q,J));
}A.startNewLine=function(p){if(p&&p.table){return;}if(K>1){S=true;}K=0;if(p){var q=C.textOfLine(C.length()-1).length==0;
if(q&&p.listType&&p.listType!="none"&&!p.table){Y(p);}}C.startNew();};A.notifySelection=function(p){if(p){O=p;
H=O.startPoint;G=O.endPoint;}};A.doAttrib=function(p,q){p.localAttribs=(p.localAttribs||[]);p.localAttribs.push(q);
A.incrementAttrib(p,q);};A.collectContent=function(r,p){function AH(x,Al,Ai,Ak,Ah){var Aj=(Al.length-Ai.length);
F[1]=F[1]-Aj;E[1]=E[1]-Aj;if(x&&x.length){C.appendText(L(x),p.attribString);}if(Ak){p.link=Ak;}B(p);C.appendText(Z(Ai),p.attribString);
p.link=null;B(p);if(Ah&&Ah.length){C.appendText(L(Ah),p.attribString);}y="";}if(!p){p={flags:{},localAttribs:null,link:null,columnId:null,rowId:null,attribs:{},attribString:""};
}var Ae=p.localAttribs;p.localAttribs=null;var AV=U(r);var AT=V(r,p);if(AV){Q(p);}var AE=true;var Ac=C.length()-1;
T(r,0,p);if(D.isNodeText(r)){var u=D.nodeValue(r);if(p.MsoNormal){u=u.replace(/\s+/g," ");}var AS="";
var AC=0;if(u.length==0){if(H&&r==H.node){F=I(0,p);}if(G&&r==G.node){E=I(0,p);}}while(u.length>0){var AM=0;
if(p.flags.preMode){var AW=u.split("\n",1)[0];AM=AW.length+1;AS=u.substring(AM);u=AW;}else{}if(H&&r==H.node&&H.index-AC<=u.length){F=I(H.index-AC,p);
}if(G&&r==G.node&&G.index-AC<=u.length){E=I(G.index-AC,p);}if(u[0]==ZEROWIDTH_SPACE){if(F[1]>-1){F[1]--;
}if(E[1]>-1){E[1]--;}}var y=u;if((!p.flags.preMode)&&/^[\r\n]*$/.exec(u)){y="";}var AR=C.textOfLine(C.length()-1).length==0;
if(AR){y=y.replace(/^\n*/,"");}if(AR&&p.listType&&p.listType!="none"&&!p.table){Y(p);}var Aa=new RegExp("^[\\s]*((http|https)://[^\\s]+.(png|jpg|jpeg|gif|svg)(\\?.*)?)[\\s]*$","i");
var AU=u.match(Aa);if(AU&&!p.link&&!u.match(/https:\/\/www.dropbox.com/)){p.img=AU[1];B(p);C.appendText("*",p.attribString);
p.img=null;B(p);A.startNewLine(p);F[0]++;F[1]=y.length;E[0]++;E[1]=y.length;}else{if(typeof(embedlyUrl)!="undefined"){var Af=new RegExp("^[\\s]*((http|https)://[^\\s]+)[\\s]*$","i");
var AO=u.match(Af);if(AO&&!p.link&&embedlyUrl(AO[1])){p.embed=AO[1];B(p);C.appendText("*",p.attribString);
p.embed=null;B(p);A.startNewLine(p);F[0]++;F[1]=y.length;E[0]++;E[1]=y.length;}}}if(typeof(location)!="undefined"){var AI=new RegExp("(.*)("+location.protocol+"//"+location.host+"/([^\\s]+)#([^:][^\\s]+))(.*)");
var s=u.match(AI);if(s){AH(s[1],s[2],s[4],"/"+s[3],s[5]);}else{AI=new RegExp("(.*)("+location.protocol+"//"+location.host+"/([^\\s#]+)-([a-zA-Z0-9]{11}))(#[^\\s]+)?(.*)");
s=u.match(AI);if(s){var Ag=s[5]?": "+s[5].replace(/#:h=/,""):"";AH(s[1],s[2],s[3]+Ag,"/"+s[4]+(s[5]||""),s[6]);
}}}var AI=new RegExp("(.*)(https://github.com/([^/]+)/([^/]+)/(issues|pull)/([\\d]+))(.*)");var s=u.match(AI);
if(s){AH(s[1],s[2],s[3]+"/"+s[4]+"#"+s[6],s[2],s[7]);}var Ad=new RegExp("(.*)(\ud83c\udccf|\ud83c\udc04|\ud83c[\udd70-\ude51][^\ud83c]|\ud83c[\udde6-\uddff]\ud83c[\udde6-\uddff]|\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]|[\u2000-\u3299]\ufe0f|[\u23e9-\u23f3]|\u26ce|[\u2705-\u27bf]|[\u0030-\u0039]\ufe0f\u20e3)(.*)");
var v=u.match(Ad);var AL=function(Ah,x){return((((v[2].charCodeAt(x?2:0)-55296)<<10)|(v[2].charCodeAt(x?3:1)-56320))+65536).toString(16);
};if(v){var AB;if(v[2].length==4){AB=AL(v[2]).toUpperCase()+"_"+AL(v[2],true).toUpperCase();}else{if(v[2].charCodeAt(0)>=8192&&v[2].charCodeAt(0)<=12953){AB=v[2].charCodeAt(0).toString(16).toUpperCase();
}else{if(v[2].charCodeAt(0)>=48&&v[2].charCodeAt(0)<=57){AB="00"+v[2].charCodeAt(0).toString(16)+"_"+v[2].charCodeAt(2).toString(16);
}else{AB=AL(v[2]);}}}AH(v[1],v[2],":emoji_"+AB+": ",undefined,v[3]);}if(p.table){p.table.push([p.rowId+":"+p.columnId,L(y)]);
}else{C.appendText(L(y),p.attribString);}AC+=AM;u=AS;if(u.length>0){A.startNewLine(p);}}}else{var q=(D.nodeTagName(r)||"").toLowerCase();
var t=D.nodeProp(r,"className");if(!t){t=D.nodeAttr(r,"class");}if(q=="br"){A.startNewLine(p);}else{if(q=="script"||q=="style"){}else{if(q=="img"&&(t&&/inline-img/.exec(t))){p.img=D.nodeAttr(r,"src");
if(p.img.indexOf("hackpad-attachments.imgix.net")>=0){var AN=p.img.replace("https://hackpad-attachments.imgix.net/","https://hackpad-attachments.s3.amazonaws.com/");
AN=AN.split("?")[0];p.img=AN;}B(p);C.appendText("*",p.attribString);p.img=null;B(p);}else{if((q=="span"&&(t&&/inline-embed/.exec(t)))){p.embed=D.nodeAttr(r,"embed");
B(p);C.appendText("*",p.attribString);p.embed=null;B(p);AE=false;}else{if((q=="span"&&(t&&/inline-tex/.exec(t)))){p.tex=D.nodeAttr(r,"tex");
B(p);C.appendText("*",p.attribString);p.tex=null;B(p);}else{if(AT&&p.table&&(q=="td"||q=="th")){p.columnId++;
}else{if(!AT){if(t&&/MsoNormal/.exec(t)){p.MsoNormal=true;}var w=D.nodeAttr(r,"style");var AA=(q=="pre");
if((!AA)&&M.safari){AA=(w&&/\bwhite-space:\s*pre\b/i.exec(w));}if(AA){A.incrementFlag(p,"preMode");}var AG=null;
var AK=null;var AP=null;if(l){if(w&&/\bfont-weight:\s*normal\b/i.exec(w)){AK=(n(p)||{});}if(q=="b"||(w&&/(?:[^-]|^)(font-weight:\s*bold\b)/i.exec(w))||q=="strong"){A.doAttrib(p,"bold");
}if(q=="i"||(w&&/\bfont-style:\s*italic\b/i.exec(w))||q=="em"){A.doAttrib(p,"italic");}if(q=="code"||q=="pre"){AG=(W(p,"code1")||"none");
if(!AA){AA=true;A.incrementFlag(p,"preMode");}}if(t&&t.match("highlight")){A.doAttrib(p,"highlight");
}if(q=="u"||(w&&/\btext-decoration:\s*underline\b/i.exec(w))||q=="ins"){A.doAttrib(p,"underline");}if(q=="s"||(w&&/\btext-decoration:\s*line-through\b/i.exec(w))||q=="del"||q=="strike"){A.doAttrib(p,"strikethrough");
}if(q=="sup"){A.doAttrib(p,"superscript");}if(q=="sub"){A.doAttrib(p,"subscript");}if(q=="a"&&D.nodeAttr(r,"href")){p.link=D.nodeAttr(r,"href");
B(p);}if(q=="ul"||q=="ol"){var AJ=t&&/(?:^| )lang-(([a-z]+))\b/.exec(t);if(AJ&&AJ[1]){p.lang=AJ[1];}var AQ;
var AF=t&&/(?:^| )list-(([a-z]+)[12345678]?)\b/.exec(t);AQ=AF&&AF[1]||"bullet"+String(Math.min(_MAX_LIST_LEVEL,(p.listNesting||0)+1));
var Ab=D.nodeAttr(r,"start");if(K>1&&AQ.indexOf("indent")>-1&&p.listType&&p.listType.indexOf("indent")==-1){}else{AG=(W(p,AQ,Ab)||"none");
}if(AF&&AF[1].indexOf("code")>-1){if(!AA){AA=true;A.incrementFlag(p,"preMode");}}}if((q=="div"||q=="p")&&t&&/gutter/.exec(t)){K=K+1;
}if((q=="div"||q=="p")&&t&&t.match(/(?:^| )ace-line\b/)){}if(p.table&&(q=="td"||q=="th")){p.columnId++;
}if(X&&t){var AD=t.match(/\S+/g);if(AD&&AD.length>0){for(var z=0;z<AD.length;z++){var AX=AD[z];var AY=X(AX);
if(AY){AP=(f(p,AY)||"none");break;}}}}}if(AE){var AZ=D.nodeNumChildren(r);var q=(D.nodeTagName(r)||"").toLowerCase();
if(q=="table"&&p.table){AE=false;}else{if(q=="table"&&r){p.table=[];p.rowId=-1;}if(q=="tr"){p.rowId++;
p.columnId=-1;}}if(AE){for(var z=0;z<AZ;z++){var AX=D.nodeChild(r,z);A.collectContent(AX,p);}if(p.table&&q=="table"){B(p);
C.appendText("*",p.attribString);p.table=null;B(p);}}}if(p.link){p.link=null;B(p);}if(AA){A.decrementFlag(p,"preMode");
}if(p.localAttribs){for(var z=0;z<p.localAttribs.length;z++){A.decrementAttrib(p,p.localAttribs[z]);}}if(AG){h(p,AG);
}if(AP){j(p,AP);}if(AK){d(p,AK);}p.MsoNormal=false;}}}}}}}}T(r,1,p);if(AV){if(C.length()-1==Ac){A.startNewLine(p);
}else{Q(p);}}p.localAttribs=Ae;};A.notifyNextNode=function(p){if((!p)||(U(p)&&!V(p))){Q(null);}};var c=function(){return F;
};var b=function(){return E;};A.getLines=function(){return C.textLines();};A.finish=function(){C.flush();
var q=C.attribLines();var p=A.getLines();p.length--;q.length--;var s=c();var t=b();function u(){var AA=2000;
var AE=10;var AC=0;var AB=0;for(var v=p.length-1;v>=0;v--){var x=p[v];var z=q[v];if(x.length>AA+AE){var w=[];
var y=[];while(x.length>AA){lengthToTake=AA;w.push(x.substring(0,lengthToTake));x=x.substring(lengthToTake);
y.push(Changeset.subattribution(z,0,lengthToTake));z=Changeset.subattribution(z,lengthToTake);}if(x.length>0){w.push(x);
y.push(z);}function AD(AF){if(AF[0]<0){return;}var AG=AF[0];var AI=AF[1];if(AG>v){AG+=(w.length-1);}else{if(AG==v){var AH=0;
while(AI>w[AH].length){AI-=w[AH].length;AH++;}AG+=AH;}}AF[0]=AG;AF[1]=AI;}AD(s);AD(t);AC++;AB+=w.length;
w.unshift(v,1);p.splice.apply(p,w);y.unshift(v,1);q.splice.apply(q,y);}}return{linesWrapped:AC,numLinesAfter:AB};
}var r=u();return{selStart:s,selEnd:t,linesWrapped:r.linesWrapped,numLinesAfter:r.numLinesAfter,lines:p,lineAttribs:q,newAuthors:P,nestedDomLines:S};
};return A;}
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function makeChangesetTracker(K,B,J){var D=Changeset.makeAText("\n");
var C=null;var A=Changeset.identity(1);var F=false;var E=false;var G=null;var H=null;function L(){if(G&&H===null){H=K.setTimeout(function(){try{G();
}catch(M){}finally{H=null;}},0);}}var I;return I={isTracking:function(){return F;},setBaseText:function(M){I.setBaseAttributedText(Changeset.makeAText(M),null);
},setBaseAttributedText:function(N,M){J.withCallbacks("setBaseText",function(Q){F=true;D=Changeset.cloneAText(N);
if(M){var O=(new AttribPool()).fromJsonable(M);D.attribs=Changeset.moveOpsToNewPool(D.attribs,O,B);}C=null;
A=Changeset.identity(D.text.length);E=true;try{Q.setDocumentAttributedText(D);}catch(P){}finally{E=false;
}});},getBaseAttributedText:function(){return Changeset.cloneAText(D);},composeUserChangeset:function(M){if(!F){return;
}if(E){return;}if(Changeset.isIdentity(M)){return;}A=Changeset.compose(A,M,B);L();},applyChangesToBase:function(M,O,N){if(!F){return;
}J.withCallbacks("applyChangesToBase",function(W){if(N){var V=(new AttribPool()).fromJsonable(N);M=Changeset.moveOpsToNewPool(M,V,B);
}D=Changeset.applyToAText(M,D,B);var P=M;if(C){var R=C;C=Changeset.follow(M,R,false,B);P=Changeset.follow(R,M,true,B);
}var S=true;var Q=A;A=Changeset.follow(P,Q,S,B);var U=Changeset.follow(Q,P,!S,B);var T=true;E=true;try{W.applyChangesetToDocument(U,T);
}catch(X){}finally{E=false;}});},prepareUserChangeset:function(){var M;if(C){M=Changeset.compose(C,A,B);
}else{if(Changeset.isIdentity(A)){M=null;}else{M=A;}}var N=null;if(M){C=M;A=Changeset.identity(Changeset.newLen(M));
N=M;}var P=null;if(N){var O=Changeset.prepareForWire(N,B);P=O.pool.toJsonable();N=O.translated;}var Q={changeset:N,apool:P};
return Q;},userChangesetForWire:function(){var N=null;var O=null;if(!Changeset.isIdentity(A)){var M=Changeset.prepareForWire(A,B);
N=M.pool.toJsonable();O=M.translated;}return{changeset:O,apool:N};},applyPreparedChangesetToBase:function(){if(!C){throw new Error("applySubmittedChangesToBase: no submitted changes to apply");
}D=Changeset.applyToAText(C,D,B);C=null;},setUserChangeNotificationCallback:function(M){G=M;},hasUncommittedChanges:function(){return !!(C||(!Changeset.isIdentity(A)));
}};}
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if(typeof(server_side_import)!="undefined"){server_side_import("etherpad.collab.ace.easysync2.Changeset");
}var linestylefilter={};linestylefilter.ATTRIB_CLASSES={bold:"tag:b",italic:"tag:i",underline:"tag:u",strikethrough:"tag:s",superscript:"tag:sup",subscript:"tag:sub",code:"line:code"};
linestylefilter.getAuthorClassName=function(A){return"author-"+A.replace(/[^a-y0-9]/g,function(B){if(B=="."){return"-";
}return"z"+B.charCodeAt(0)+"z";});};linestylefilter.className2Author=function(A){var B=A.replace(/^fa-author-|^author-|^gutter-author-/,"");
if(B!=A){return B.replace(/[a-y0-9]+|-|z.+?z/g,function(C){if(C=="-"){return".";}else{if(C.charAt(0)=="z"){return String.fromCharCode(Number(C.slice(1,-1)));
}else{return C;}}});}return null;};var RELATIVE_URL_RE=new RegExp("^(/|https?://[w.]*hackpad.com).*");
linestylefilter.getLineStyleFilter=function(D,E,A,C){if(D==0){A("","line:longKeep line:gutter-noauthor");
return A;}var B=A;var F=(function(){var T=D;var P=0;var K;var G;var M=null;var R=0;var I=null;var N=null;
var Q=false;var O=false;function V(Y,X){var W=[];Changeset.eachAttribNumber(Y,function(b){var Z=C.getAttribKey(b);
if(Z){var a=C.getAttribValue(b);if(a){if(Z=="author"){hasAuthor=true;var c=false;Changeset.eachAttribNumber(Y,function(h){var f=C.getAttribKey(h);
if(f&&f=="list"){c=true;}});if(X>R){M=a;R=X;}W.push(linestylefilter.getAuthorClassName(a));}else{if(Z=="link"){W.push("attrlink","url:"+encodeURIComponent(a));
if(a.match(RELATIVE_URL_RE)){W.push("internal");}}else{if(Z=="autolink"){W.push("tag:autolink");}else{if(Z=="img"){W.push("attrimg img:"+encodeURIComponent(a));
}else{if(Z=="attachmentPlaceholder"){W.push("placeholder-"+encodeURIComponent(a));}else{if(Z=="embed"){W.push("attrembed embed:"+encodeURIComponent(a));
}else{if(Z=="table"){W.push("attrtable table:"+encodeURIComponent(a));}else{if(Z=="tex"){W.push("attrtex tex:"+encodeURIComponent(a));
}else{if(Z=="last-col"){W.push("last-col");Q=true;}else{if(Z=="colname"){W.push("colname");O=true;}else{if(Z=="diff"&&a=="plus"){W.push("added");
I=false;}else{if(Z=="diff"&&a=="minus"){W.push("removed");I=false;}else{if(Z=="longkeep"){W.push("longkeep");
I=(I!=false);}else{if(Z=="list"&&/(\D+)(\d+)/.test(a)){W.push("list:"+a);var d=/(\D+)(\d+)/.exec(a);N=d[1];
}else{if(Z=="start"){W.push("start:"+a);}else{if(Z=="highlight"){W.push("highlight");}else{if(Z=="lang"){W.push("lang:"+a);
}else{if(linestylefilter.ATTRIB_CLASSES[Z]){W.push(linestylefilter.ATTRIB_CLASSES[Z]);}}}}}}}}}}}}}}}}}}}}});
return W.join(" ");}var U=Changeset.opIterator(E);var H,J;function L(){H=U.next();J=(H.opcode&&V(H.attribs,H.chars));
}L();function S(){if(P<T){K=J;G=H.chars;L();while(H.opcode&&J==K){G+=H.chars;L();}}}S();return function(X,Z){var b=true;
while(X.length>0){if(G<=0){return B(X,Z);}var Y=X.length;if(Y>G){Y=G;}var c=X.substring(0,Y);X=X.substring(Y);
var a=(Z&&Z+" ")+K;B(c,a);if(a.indexOf("added")==-1){b=false;}P+=Y;G-=Y;if(G==0){S();}}var W="";if(!O){W+=M?"line:gutter-"+linestylefilter.getAuthorClassName(M):"line:gutter-noauthor";
}W+=(I?" line:longKeep":"");W+=(Q?" line:lastCol":"");W+=(O?" line:aCol":"");W+=(N?" line:line-list-type-"+N:"");
W+=" line:emptyGutter";if(b){W+=" line:allAdd";}B("",W);};})();return F;};linestylefilter.getAtSignSplitterFilter=function(E,C){var B=/@/g;
B.lastIndex=0;var A=null;var D;while((D=B.exec(E))){if(!A){A=[];}A.push(D.index);}if(!A){return C;}return linestylefilter.textAndClassFuncSplitter(C,A);
};linestylefilter.getRegexpFilter=function(A,B,C){return function(L,I){A.lastIndex=0;var D=null;var F=null;
var E;while((E=A.exec(L))){if(!D){D=[];F=[];}var G=E.index;var H=E[0];D.push([G,H]);F.push(G,G+H.length);
}if(!D){return I;}function J(O){for(var N=0;N<D.length;N++){var M=D[N];if(O>=M[0]&&O<M[0]+M[1].length){return M[1];
}}return false;}var K=(function(){var M=0;return function(N,Q){var R=N.length;var O=Q;var P=J(M);if(P){O+=" "+B+(C?"":":"+encodeURIComponent(P));
}I(N,O);M+=R;};})();return linestylefilter.textAndClassFuncSplitter(K,F);};};linestylefilter.REGEX_WORDCHAR_WITHOUT_00DF=/[\u0030-\u0039\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00DE\u00E0-\u00F6\u00F8-\u00FF\u0100-\u1FFF\u3040-\u9FFF\uF900-\uFDFF\uFE70-\uFEFE\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDC]/;
linestylefilter.REGEX_WORDCHAR=/[\u0030-\u0039\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0100-\u1FFF\u3040-\u9FFF\uF900-\uFDFF\uFE70-\uFEFE\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDC]/;
linestylefilter.REGEX_URLCHAR=new RegExp("("+/[-:@a-zA-Z0-9_.,~%+\/\\?=&#;()!'$]/.source+"|"+linestylefilter.REGEX_WORDCHAR_WITHOUT_00DF.source+")");
linestylefilter.REGEX_URL=new RegExp(/(?:(?:https?|sftp|ftps?|ssh|ircs?|file|gopher|telnet|nntp|worldwind|chrome|chrome-extension|svn|git|mms|smb|afp|nfs|(x-)?man|gopher|txmt):\/\/|mailto:|xmpp:|sips?:|tel:|sms:|news:|bitcoin:|magnet:|urn:|geo:)/.source+linestylefilter.REGEX_URLCHAR.source+"*(?![:.,;\\)'])"+linestylefilter.REGEX_URLCHAR.source,"gi");
linestylefilter.getURLFilter=linestylefilter.getRegexpFilter(linestylefilter.REGEX_URL,"url");linestylefilter.getCodeSpanFilter=linestylefilter.getRegexpFilter(new RegExp(/`[^`]+`/g),"code",true);
linestylefilter.EMOJI_LIST=["+1","-1","100","1234","8ball","a","ab","abc","abcd","accept","aerial_tramway","airplane","alarm_clock","alien","ambulance","anchor","angel","anger","angry","anguished","ant","apple","aquarius","aries","arrow_backward","arrow_double_down","arrow_double_up","arrow_down","arrow_down_small","arrow_forward","arrow_heading_down","arrow_heading_up","arrow_left","arrow_lower_left","arrow_lower_right","arrow_right","arrow_right_hook","arrow_up","arrow_up_down","arrow_up_small","arrow_upper_left","arrow_upper_right","arrows_clockwise","arrows_counterclockwise","art","articulated_lorry","astonished","athletic_shoe","atm","b","baby","baby_bottle","baby_chick","baby_symbol","back","baggage_claim","balloon","ballot_box_with_check","bamboo","banana","bangbang","bank","bar_chart","barber","baseball","basketball","bath","bathtub","battery","bear","bee","beer","beers","beetle","beginner","bell","bento","bicyclist","bike","bikini","bird","birthday","black_circle","black_joker","black_large_square","black_medium_small_square","black_medium_square","black_nib","black_small_square","black_square_button","blossom","blowfish","blue_book","blue_car","blue_heart","blush","boar","boat","bomb","book","bookmark","bookmark_tabs","books","boom","boot","bouquet","bow","bowling","boy","bread","bride_with_veil","bridge_at_night","briefcase","broken_heart","bug","bulb","bullettrain_front","bullettrain_side","bus","busstop","bust_in_silhouette","busts_in_silhouette","cactus","cake","calendar","calling","camel","camera","cancer","candy","capital_abcd","capricorn","car","card_index","carousel_horse","cat","cat2","cd","chart","chart_with_downwards_trend","chart_with_upwards_trend","checkered_flag","cherries","cherry_blossom","chestnut","chicken","children_crossing","chocolate_bar","christmas_tree","church","cinema","circus_tent","city_sunrise","city_sunset","cl","clap","clapper","clipboard","clock1","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock130","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","closed_book","closed_lock_with_key","closed_umbrella","cloud","clubs","cn","cocktail","coffee","cold_sweat","collision","computer","confetti_ball","confounded","confused","congratulations","construction","construction_worker","convenience_store","cookie","cool","cop","copyright","corn","couple","couple_with_heart","couplekiss","cow","cow2","credit_card","crescent_moon","crocodile","crossed_flags","crown","cry","crying_cat_face","crystal_ball","cupid","curly_loop","currency_exchange","curry","custard","customs","cyclone","dancer","dancers","dango","dart","dash","date","de","deciduous_tree","department_store","diamond_shape_with_a_dot_inside","diamonds","disappointed","disappointed_relieved","dizzy","dizzy_face","do_not_litter","dog","dog2","dollar","dolls","dolphin","door","doughnut","dragon","dragon_face","dress","dromedary_camel","droplet","dvd","e-mail","ear","ear_of_rice","earth_africa","earth_americas","earth_asia","egg","eggplant","eight","eight_pointed_black_star","eight_spoked_asterisk","electric_plug","elephant","email","end","envelope","envelope_with_arrow","es","euro","european_castle","european_post_office","evergreen_tree","exclamation","expressionless","eyeglasses","eyes","facepunch","factory","fallen_leaf","family","fast_forward","fax","fearful","feet","ferris_wheel","file_folder","fire","fire_engine","fireworks","first_quarter_moon","first_quarter_moon_with_face","fish","fish_cake","fishing_pole_and_fish","fist","five","flags","flashlight","flipper","floppy_disk","flower_playing_cards","flushed","foggy","football","footprints","fork_and_knife","fountain","four","four_leaf_clover","fr","free","fried_shrimp","fries","frog","frowning","fuelpump","full_moon","full_moon_with_face","game_die","gb","gem","gemini","ghost","gift","gift_heart","girl","globe_with_meridians","goat","golf","grapes","green_apple","green_book","green_heart","grey_exclamation","grey_question","grimacing","grin","grinning","guardsman","guitar","gun","haircut","hamburger","hammer","hamster","hand","handbag","hankey","hash","hatched_chick","hatching_chick","headphones","hear_no_evil","heart","heart_decoration","heart_eyes","heart_eyes_cat","heartbeat","heartpulse","hearts","heavy_check_mark","heavy_division_sign","heavy_dollar_sign","heavy_exclamation_mark","heavy_minus_sign","heavy_multiplication_x","heavy_plus_sign","helicopter","herb","hibiscus","high_brightness","high_heel","hocho","honey_pot","honeybee","horse","horse_racing","hospital","hotel","hotsprings","hourglass","hourglass_flowing_sand","house","house_with_garden","hushed","ice_cream","icecream","id","ideograph_advantage","imp","inbox_tray","incoming_envelope","information_desk_person","information_source","innocent","interrobang","iphone","it","izakaya_lantern","jack_o_lantern","japan","japanese_castle","japanese_goblin","japanese_ogre","jeans","joy","joy_cat","jp","key","keycap_ten","kimono","kiss","kissing","kissing_cat","kissing_closed_eyes","kissing_heart","kissing_smiling_eyes","knife","koala","koko","kr","lantern","large_blue_circle","large_blue_diamond","large_orange_diamond","last_quarter_moon","last_quarter_moon_with_face","laughing","leaves","ledger","left_luggage","left_right_arrow","leftwards_arrow_with_hook","lemon","leo","leopard","libra","light_rail","link","lips","lipstick","lock","lock_with_ink_pen","lollipop","loop","loud_sound","loudspeaker","love_hotel","love_letter","low_brightness","m","mag","mag_right","mahjong","mailbox","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","man","man_with_gua_pi_mao","man_with_turban","mans_shoe","maple_leaf","mask","massage","meat_on_bone","mega","melon","memo","mens","metro","microphone","microscope","milky_way","minibus","minidisc","mobile_phone_off","money_with_wings","moneybag","monkey","monkey_face","monorail","moon","mortar_board","mount_fuji","mountain_bicyclist","mountain_cableway","mountain_railway","mouse","mouse2","movie_camera","moyai","muscle","mushroom","musical_keyboard","musical_note","musical_score","mute","nail_care","name_badge","necktie","negative_squared_cross_mark","neutral_face","new","new_moon","new_moon_with_face","newspaper","ng","night_with_stars","nine","no_bell","no_bicycles","no_entry","no_entry_sign","no_good","no_mobile_phones","no_mouth","no_pedestrians","no_smoking","non-potable_water","nose","notebook","notebook_with_decorative_cover","notes","nut_and_bolt","o","o2","ocean","octopus","oden","office","ok","ok_hand","ok_woman","older_man","older_woman","on","oncoming_automobile","oncoming_bus","oncoming_police_car","oncoming_taxi","one","open_book","open_file_folder","open_hands","open_mouth","ophiuchus","orange_book","outbox_tray","ox","package","page_facing_up","page_with_curl","pager","palm_tree","panda_face","paperclip","parking","part_alternation_mark","partly_sunny","passport_control","paw_prints","peach","pear","pencil","pencil2","penguin","pensive","performing_arts","persevere","person_frowning","person_with_blond_hair","person_with_pouting_face","phone","pig","pig2","pig_nose","pill","pineapple","pisces","pizza","point_down","point_left","point_right","point_up","point_up_2","police_car","poodle","poop","post_office","postal_horn","postbox","potable_water","pouch","poultry_leg","pound","pouting_cat","pray","princess","punch","purple_heart","purse","pushpin","put_litter_in_its_place","question","rabbit","rabbit2","racehorse","radio","radio_button","railway_car","rainbow","raised_hand","raised_hands","raising_hand","ram","ramen","rat","recycle","red_car","red_circle","registered","relaxed","relieved","repeat","repeat_one","restroom","revolving_hearts","rewind","ribbon","rice","rice_ball","rice_cracker","rice_scene","ring","rocket","roller_coaster","rooster","rose","rotating_light","round_pushpin","rowboat","ru","rugby_football","runner","running","running_shirt_with_sash","sa","sagittarius","sailboat","sake","sandal","santa","satellite","satisfied","saxophone","school","school_satchel","scissors","scorpius","scream","scream_cat","scroll","seat","secret","see_no_evil","seedling","seven","shaved_ice","sheep","shell","ship","shirt","shit","shoe","shower","signal_strength","six","six_pointed_star","ski","skull","sleeping","sleepy","slot_machine","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","smile","smile_cat","smiley","smiley_cat","smiling_imp","smirk","smirk_cat","smoking","snail","snake","snowboarder","snowflake","snowman","sob","soccer","soon","sos","sound","space_invader","spades","spaghetti","sparkle","sparkler","sparkles","sparkling_heart","speak_no_evil","speaker","speech_balloon","speedboat","star","star2","stars","station","statue_of_liberty","steam_locomotive","stew","straight_ruler","strawberry","stuck_out_tongue","stuck_out_tongue_closed_eyes","stuck_out_tongue_winking_eye","sun_with_face","sunflower","sunglasses","sunny","sunrise","sunrise_over_mountains","surfer","sushi","suspension_railway","sweat","sweat_drops","sweat_smile","sweet_potato","swimmer","symbols","syringe","tada","tanabata_tree","tangerine","taurus","taxi","tea","telephone","telephone_receiver","telescope","tennis","tent","thought_balloon","three","thumbsdown","thumbsup","ticket","tiger","tiger2","tired_face","tm","toilet","tokyo_tower","tomato","tongue","top","tophat","tractor","traffic_light","train","train2","tram","triangular_flag_on_post","triangular_ruler","trident","triumph","trolleybus","trophy","tropical_drink","tropical_fish","truck","trumpet","tshirt","tulip","turtle","tv","twisted_rightwards_arrows","two","two_hearts","two_men_holding_hands","two_women_holding_hands","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7981","u7a7a","uk","umbrella","unamused","underage","unlock","up","us","v","vertical_traffic_light","vhs","vibration_mode","video_camera","video_game","violin","virgo","volcano","vs","walking","waning_crescent_moon","waning_gibbous_moon","warning","watch","water_buffalo","watermelon","wave","wavy_dash","waxing_crescent_moon","waxing_gibbous_moon","wc","weary","wedding","whale","whale2","wheelchair","white_check_mark","white_circle","white_flower","white_large_square","white_medium_small_square","white_medium_square","white_small_square","white_square_button","wind_chime","wine_glass","wink","wolf","woman","womans_clothes","womans_hat","womens","worried","wrench","x","yellow_heart","yen","yum","zap","zero","zzz"];
linestylefilter.REGEX_EMOJI=new RegExp(":(\\"+linestylefilter.EMOJI_LIST.join("|")+"):","gi");linestylefilter.getEmojiSpanFilter=linestylefilter.getRegexpFilter(linestylefilter.REGEX_EMOJI,"emoji");
linestylefilter.REGEX_EMOJI_CODE=new RegExp(":emoji_[^:]+:","gi");linestylefilter.getEmojiCodeSpanFilter=linestylefilter.getRegexpFilter(linestylefilter.REGEX_EMOJI_CODE,"emoji-code");
linestylefilter.REGEX_TEX=/\$\$.+\$\$/g;linestylefilter.getTexFilter=linestylefilter.getRegexpFilter(linestylefilter.REGEX_TEX,"tex");
linestylefilter.REGEX_HASHTAG=RegExp("(^|.)(#(?:_|"+linestylefilter.REGEX_WORDCHAR.source+")+)","g");
linestylefilter.getHashtagFilter=function(H,D){var C=linestylefilter.REGEX_HASHTAG;var I="hashtag";C.lastIndex=0;
var A=null;var B=null;var E=RegExp("^#\\d+$");H.replace(C,function(M,K,J,N,O){if(E.test(J)||linestylefilter.REGEX_WORDCHAR.test(K)||/^&$/.test(K)){return M;
}if(!A){A=[];B=[];}var L=N+K.length;A.push([L,J]);B.push(L,L+J.length);return M;});if(!A){return D;}function F(L){for(var K=0;
K<A.length;K++){var J=A[K];if(L>=J[0]&&L<J[0]+J[1].length){return J[1];}}return false;}var G=(function(){var J=0;
return function(K,N){var O=K.length;var L=N;var M=F(J);if(M){L+=" "+I+":"+encodeURIComponent(M);}D(K,L);
J+=O;};})();return linestylefilter.textAndClassFuncSplitter(G,B);};linestylefilter.getTokenizerFilter=function(H,B,F,I){var A=I.getLineTokens(H,F||"start");
var E=A.state;A=A.tokens;var C=0;var D=[];forEach(A,function(J){if(J.type!="text"){D.push(C,C+J.value.length);
}C+=J.value.length;});var G=(function(){B("","line:lexer_"+E);return function(J,M){var N=false;for(var L=0;
L<A.length;L++){var K=A[L];if(K.value==J&&K.type!="text"){var O=M+" "+K.type.replace(/\./g," ");B(J,O);
N=true;break;}}if(!N){B(J,M);}};})();return linestylefilter.textAndClassFuncSplitter(G,D);};linestylefilter.textAndClassFuncSplitter=function(D,B){var A=0;
var C=0;while(B&&A<B.length&&B[A]==0){A++;}function E(F,H){if((!B)||A>=B.length){D(F,H);C+=F.length;}else{var J=B;
var G=J[A]-C;var I=F.length;if(G>=I){D(F,H);C+=F.length;if(G==I){A++;}}else{if(G>0){D(F.substring(0,G),H);
C+=G;}A++;E(F.substring(G),H);}}}return E;};linestylefilter.getFilterStack=function(B,F,E,G,D,C){var A=linestylefilter.getURLFilter(B,F);
if(!(C&&D)){A=linestylefilter.getHashtagFilter(B,A);}A=linestylefilter.getCodeSpanFilter(B,A);if(G){A=linestylefilter.getTexFilter(B,A);
}A=linestylefilter.getEmojiSpanFilter(B,A);A=linestylefilter.getEmojiCodeSpanFilter(B,A);if(C&&D){A=linestylefilter.getTokenizerFilter(B,A,D,C);
}if(E!==undefined&&E.msie){A=linestylefilter.getAtSignSplitterFilter(B,A);}return A;};linestylefilter.populateDomLine=function(F,D,E,H,G){var A=F;
if(A.slice(-1)=="\n"){A=A.substring(0,A.length-1);}function C(I,J){H.appendSpan(I,J,G);}var B=linestylefilter.getFilterStack(A,C);
B=linestylefilter.getLineStyleFilter(A.length,D,B,E);B(A,"");};
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _htmlEscaped(A){return String(A).replace(/\"/g,"&quot;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/&/g,"&amp;");
}var domline={};domline.noop=function(){};domline.identity=function(A){return A;};domline.embedhtml={};
domline.hashCode=function(B){var A=0;if(B.length==0){return A;}for(i=0;i<B.length;i++){var C=B.charCodeAt(i);
A=((A<<5)-A)+C;A=A&A;}return A;};domline.addToLineClass=function(A,B){B.replace(/\S+/g,function(C){if(C.indexOf("line:")==0){A=(A?A+" ":"")+C.substring(5);
}});return A;};domline.addTable=function(B,A){if(!A){return"<span class='inline-table'><div style='' contenteditable='false'></div></span>";
}else{return"<span class='inline-table'><div style='' contenteditable='false'><iframe id='sheet-id' src='/ep/sheet' width='100%' height='50px' style='border:0px' scrolling='no'></iframe></div></span>";
}};domline.addSurrogate=function(D,E,G,F,C){var A=domline.hashCode(D);content='<span class="inline-'+E+'" '+E+'="'+_htmlEscaped(D)+'"><div contenteditable="false" class="embed-'+A+'">';
var B=domline.embedhtml[A];if(B){content+=B;}else{content+='<img class="inline-img" src="/static/img/pixel.gif" contenteditable="false">';
}content+="</div></span>";if(B==undefined){domline.embedhtml[A]=false;F(D,function(J){J=J||"";domline.embedhtml[A]=J;
var L=G.querySelectorAll(".embed-"+A);for(var K=0;K<L.length;K++){var M=L[K];M.innerHTML=J;if(document&&C){var I=M.querySelectorAll("img, iframe");
for(var H=0;H<I.length;++H){if(I[H].addEventListener){I[H].addEventListener("load",C,false);}else{I[H].attachEvent("onload",C);
}}}}});}return content;};var validUrlRe=new RegExp("^(?:https?|sftp|ftps?|ssh|ircs?|file|gopher|telnet|nntp|worldwind|chrome|chrome-extension|svn|git|mms|smb|afp|nfs|(x-)?man|gopher|txmt|x-hackpad-image-upload)://|^mailto:|^xmpp:|^sips?:|^tel:|^sms:|^news:|^bitcoin:|^magnet:|^urn:|^geo:|^/","i");
domline.createDomLine=function(V,M,E,H,O,N,R,U,K,Q){var A={node:null,appendSpan:domline.noop,prepareForAdd:domline.noop,notifyAdded:domline.noop,clearSpans:domline.noop,finishUpdate:domline.noop,lineMarker:0};
var Y=(E||{});var J=H;if(J){A.node=J.createElement("div");}else{A.node={innerHTML:"",className:""};}var D=[];
var C,L;var I=null;function S(Z){return domline.processSpaces(Z,M);}var T=domline.identity;var W=(M?T:S);
var X=(M?S:T);var B="ace-line";var G=false;var F=null;A.appendSpan=function(u,Z,AA){if(Z.indexOf("list")>=0){var a=/(?:^| )list:(\S+)/.exec(Z);
var j=/(?:^| )lang:(\S+)/.exec(Z);if(j){j=j[1];}var r=/(?:^| )start:(\S+)/.exec(Z);if(a){a=a[1];r=r?'start="'+r[1]+'"':"";
if(a){var x=/(\D+)(\d+)/.exec(a);var l=x[1];var n=x[2];var AG=0;if(E=="email"){if(a.indexOf("indent")>-1){var AE=parseInt(a.substring("indent".length));
var AF=AE*1.5;C='<ul class="listtype-'+l+" listindent"+n+" list-"+a+'" style="list-style-type: none; margin: 0 0 0 '+AF+'em"><li>';
}if(a.indexOf("taskdone")>-1){C='<ul class="listtype-'+l+" listindent"+n+" list-"+a+'" style="list-style-type: none; margin: 0"><li><input type="checkbox" checked disabled>&nbsp;';
}else{if(a.indexOf("task")>-1){C='<ul class="listtype-'+l+" listindent"+n+" list-"+a+'" style="list-style-type: none; margin: 0"><li><input type="checkbox" disabled>&nbsp;';
}}}else{if(a.indexOf("number")<0){C='<ul class="listtype-'+l+" listindent"+n+" list-"+a+(j?" lang-"+j:"")+'" '+(j?'spellcheck="false"':"")+"><li>";
L="</li></ul>";}else{C="<ol "+r+' class="listtype-'+l+" listindent"+n+" list-"+a+'"><li>';L="</li></ol>";
}}}A.lineMarker+=u.length;return;}}var b=null;var y="";if(Z.indexOf("url")>=0){Z=Z.replace(/(^| )url:(\S+)/g,function(AK,AJ,AH){try{b=decodeURIComponent(AH);
}catch(AI){b=AH;}return AJ+"url";});if(Z.indexOf("attrlink")>=0){y=' class="attrlink"';}}var c=null;if(Z.indexOf("img")>=0){Z=Z.replace(/(^| )img:(\S+)/g,function(AJ,AI,AH){c=decodeURIComponent(AH);
return AI+"img";});}var h=null;if(Z.indexOf("emoji-code")>=0){Z=Z.replace(/(^| )emoji-code:(\S+)/g,function(AJ,AI,AH){h=decodeURIComponent(AH).replace(/:/g,"");
return AI+"emoji";});}var p=null;if(Z.indexOf("emoji")>=0){Z=Z.replace(/(^| )emoji:(\S+)/g,function(AJ,AI,AH){p=decodeURIComponent(AH).replace(/:/g,"");
return AI+"emoji";});}var q=null;if(Z.indexOf("embed")>=0){Z=Z.replace(/(^| )embed:(\S+)/g,function(AJ,AI,AH){q=decodeURIComponent(AH);
return AI+"embed";});}var t=null;if(Z.indexOf("table")>=0){Z=Z.replace(/(^| )table:(\S+)/g,function(AJ,AH,AI){t=AI;
return AH+"table";});}var v=null;if(Z.indexOf("tex")>=0){Z=Z.replace(/(^| )tex:(\S+)/g,function(AJ,AI,AH){v=decodeURIComponent(AH);
return AI+"tex";});}if(Z.indexOf("hashtag")>=0){Z=Z.replace(/(^| )hashtag:(\S+)/g,function(AJ,AI,AH){b="/ep/search/?q="+AH;
if(typeof clientVars==="object"&&clientVars.padId){b+="&via="+clientVars.padId;}return AI+"hashtag url internal";
});}var f=null;if(Z.indexOf("tag")>=0&&!t){Z=Z.replace(/(^| )tag:(\S+)/g,function(AJ,AI,AH){if(!f){f=[];
}f.push(AH.toLowerCase());return AI+AH;});}var m="";var o="";if((!u)&&Z){B=domline.addToLineClass(B,Z);
}else{if(u){if(b){if(O&&b.indexOf("/")==0){b=O+b;}if(!validUrlRe.test(b)){b="";}m=m+"<a"+y+' href="'+_htmlEscaped(b)+'">';
o="</a>"+o;}if(f){f.sort();m=m+"<"+f.join("><")+">";f.reverse();o="</"+f.join("></")+">"+o;}var z="";
if(AA){z=" style='"+AA(Z)+"'";}var d=null;var AB="";if(c){if(c.indexOf("hackpad-attachments")>=0){c=c.replace("https://hackpad-attachments.s3.amazonaws.com/","https://hackpad-attachments.imgix.net/");
c+="?fit=max&w=882";}if(!validUrlRe.test(c)){c="";}var AD=U?'style="max-width:100%; max-height:auto;" ':"";
d="<img "+AD+'class="inline-img" src="'+_htmlEscaped(c)+'" faketext="*" contenteditable="false"><div class="remove-media" contenteditable="false"></div>';
AB=" nodeValue='*'";F=K;}else{if(h){var s="";if(typeof clientVars==="object"&&clientVars.cdn){s=clientVars.cdn;
}var AC=h.split("_")[2]?"_"+h.split("_")[2]:"";var w=h.split("_")[1]+AC;w=w.replace("fe0f","").replace("_","-");
d='<span class="emoji-glyph" title=":'+h+':" style="background-image:url('+s+"/static/img/emoji/unicode/"+w+'.png)">:'+h+":</span><span></span>";
}else{if(p){var s="";if(typeof clientVars==="object"&&clientVars.cdn){s=clientVars.cdn;}d='<span class="emoji-glyph" title=":'+p+':" style="background-image:url('+s+"/static/img/emoji/"+p+'.png)">:'+p+":</span><span></span>";
}else{if(q&&N){if(E=="email"||E=="stream"){d=N(q);}else{d=domline.addSurrogate(q,"embed",H,N,K);}}else{if(t){d=domline.addTable(t,H);
F=K;}else{if(v&&R){d=domline.addSurrogate(v,"tex",H,R,K);}else{d=W(domline.escapeHTML(u));}}}}}}if(B.indexOf("aCol")>-1&&(Z.indexOf("colname")==-1&&!G)){G=true;
D.push("<span>","&#8203;","</span>");}D.push("<span",z,' class="',Z||"",'">',m,d,o,"</span>");}}};A.clearSpans=function(){D=[];
B="ace-line";G=false;A.lineMarker=0;};function P(){if(B.indexOf("aCol")>-1&&!G){D.push("<span>","&#8203;","</span>");
}var Z=X(D.join(""));if(!Z){if((!J)||(!E)){Z+="&nbsp;";}else{if(!Y.msie){Z+="<br/>";}}}if(V){Z=(C||"")+Z+(L||"");
}D=C=L=null;if(Z!==I){I=Z;A.node.innerHTML=I;if(J&&F){var b=A.node.querySelectorAll("img, iframe");for(var a=0;
a<b.length;++a){if(b[a].addEventListener){b[a].addEventListener("load",F,false);}else{b[a].attachEvent("onload",F);
}}}}if(B!==null){if(Q){function h(m){if(!m){return"";}var l=m.split(" ");if(l.length>=2){return l[0].substr(0,1)+l[l.length-1].substr(0,1);
}else{return m.substr(0,1);}}function j(m){if(!m){return"";}var l=m.split(" ");return l.length>=2?l[0]+" "+l[l.length-1].substr(0,1):m;
}var f=B.split(" ").filter(function(l){return l.match("^gutter-author-|^author-");});if(f){var d=map(f,linestylefilter.className2Author);
if(d.length){var c=Q[d[0]];if(c){A.node.setAttribute("data-author-initials",h(c.name));A.node.setAttribute("data-author-name",j(c.name));
A.node.setAttribute("data-author-link",c.userLink||"");}}}}A.node.className=B;}}A.prepareForAdd=P;A.finishUpdate=P;
A.getInnerHTML=function(){return I||"";};return A;};domline.escapeHTML=function(B){var A=/[&<>'"]/g;/']/;
if(!A.MAP){A.MAP={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};}return B.replace(A,function(C){return A.MAP[C];
});};domline.processSpaces=function(F,G){if(F.indexOf("<")<0&&!G){return F.replace(/ /g,"&nbsp;");}var B=[];
F.replace(/<[^>]*>?| |[^ <]+/g,function(H){B.push(H);});if(G){var D=true;var E=false;for(var A=B.length-1;
A>=0;A--){var C=B[A];if(C==" "){if(D||E){B[A]="&nbsp;";}D=false;E=true;}else{if(C.charAt(0)!="<"){D=false;
E=false;}}}for(var A=0;A<B.length;A++){var C=B[A];if(C==" "){B[A]="&nbsp;";break;}else{if(C.charAt(0)!="<"){break;
}}}}else{for(var A=0;A<B.length;A++){var C=B[A];if(C==" "){B[A]="&nbsp;";}}}return B.join("");};embedlyUrlMasks=["http:\\/\\/.*youtube\\.com\\/watch.*","http:\\/\\/.*\\.youtube\\.com\\/v\\/.*","https:\\/\\/.*youtube\\.com\\/watch.*","https:\\/\\/.*\\.youtube\\.com\\/v\\/.*","http:\\/\\/youtu\\.be\\/.*","http:\\/\\/.*\\.youtube\\.com\\/user\\/.*","http:\\/\\/.*\\.youtube\\.com\\/.*\\#.*\\/.*","http:\\/\\/m\\.youtube\\.com\\/watch.*","http:\\/\\/m\\.youtube\\.com\\/index.*","http:\\/\\/.*\\.youtube\\.com\\/profile.*","http:\\/\\/.*\\.youtube\\.com\\/view_play_list.*","http:\\/\\/.*\\.youtube\\.com\\/playlist.*","http:\\/\\/www\\.ustream\\.tv\\/recorded\\/.*","http:\\/\\/www\\.ustream\\.tv\\/channel\\/.*","http:\\/\\/www\\.ustream\\.tv\\/.*","https:\\/\\/.*\\.airbnb.*","http:\\/\\/.*twitvid\\.com\\/.*","http:\\/\\/video\\.google\\.com\\/videoplay\\?.*","http:\\/\\/www\\.xtranormal\\.com\\/watch\\/.*","http:\\/\\/socialcam\\.com\\/v\\/.*","http:\\/\\/www\\.socialcam\\.com\\/v\\/.*","http:\\/\\/www\\.whitehouse\\.gov\\/photos-and-video\\/video\\/.*","http:\\/\\/www\\.whitehouse\\.gov\\/video\\/.*","http:\\/\\/wh\\.gov\\/photos-and-video\\/video\\/.*","http:\\/\\/wh\\.gov\\/video\\/.*","http:\\/\\/www\\.hulu\\.com\\/watch.*","http:\\/\\/www\\.hulu\\.com\\/w\\/.*","http:\\/\\/www\\.hulu\\.com\\/embed\\/.*","http:\\/\\/hulu\\.com\\/watch.*","http:\\/\\/hulu\\.com\\/w\\/.*","http:\\/\\/www\\.vimeo\\.com\\/groups\\/.*\\/videos\\/.*","http:\\/\\/www\\.vimeo\\.com\\/.*","http:\\/\\/vimeo\\.com\\/groups\\/.*\\/videos\\/.*","http:\\/\\/vimeo\\.com\\/.*","http:\\/\\/vimeo\\.com\\/m\\/\\#\\/.*","http:\\/\\/www\\.ted\\.com\\/talks\\/.*\\.html.*","http:\\/\\/www\\.ted\\.com\\/talks\\/lang\\/.*\\/.*\\.html.*","http:\\/\\/www\\.ted\\.com\\/index\\.php\\/talks\\/.*\\.html.*","http:\\/\\/www\\.ted\\.com\\/index\\.php\\/talks\\/lang\\/.*\\/.*\\.html.*","http:\\/\\/fora\\.tv\\/.*\\/.*\\/.*\\/.*","http:\\/\\/video\\.pbs\\.org\\/video\\/.*","http:\\/\\/gist\\.github\\.com\\/.*","https:\\/\\/gist\\.github\\.com\\/.*","http:\\/\\/twitter\\.com\\/.*\\/status\\/.*","http:\\/\\/twitter\\.com\\/.*\\/statuses\\/.*","http:\\/\\/www\\.twitter\\.com\\/.*\\/status\\/.*","http:\\/\\/www\\.twitter\\.com\\/.*\\/statuses\\/.*","http:\\/\\/mobile\\.twitter\\.com\\/.*\\/status\\/.*","http:\\/\\/mobile\\.twitter\\.com\\/.*\\/statuses\\/.*","https:\\/\\/twitter\\.com\\/.*\\/status\\/.*","https:\\/\\/twitter\\.com\\/.*\\/statuses\\/.*","https:\\/\\/www\\.twitter\\.com\\/.*\\/status\\/.*","https:\\/\\/www\\.twitter\\.com\\/.*\\/statuses\\/.*","https:\\/\\/mobile\\.twitter\\.com\\/.*\\/status\\/.*","https:\\/\\/mobile\\.twitter\\.com\\/.*\\/statuses\\/.*","http:\\/\\/www\\.crunchbase\\.com\\/.*\\/.*","http:\\/\\/crunchbase\\.com\\/.*\\/.*","http:\\/\\/www\\.slideshare\\.net\\/.*\\/.*","http:\\/\\/www\\.slideshare\\.net\\/mobile\\/.*\\/.*","http:\\/\\/slidesha\\.re\\/.*","http:\\/\\/scribd\\.com\\/doc\\/.*","http:\\/\\/www\\.scribd\\.com\\/doc\\/.*","http:\\/\\/scribd\\.com\\/mobile\\/documents\\/.*","http:\\/\\/www\\.scribd\\.com\\/mobile\\/documents\\/.*","http:\\/\\/www\\.kickstarter\\.com\\/projects\\/.*\\/.*","http:\\/\\/foursquare\\.com\\/.*","http:\\/\\/www\\.foursquare\\.com\\/.*","https:\\/\\/foursquare\\.com\\/.*","https:\\/\\/www\\.foursquare\\.com\\/.*","http:\\/\\/4sq\\.com\\/.*","http:\\/\\/chart\\.ly\\/symbols\\/.*","http:\\/\\/chart\\.ly\\/.*","http:\\/\\/maps\\.google\\.com\\/maps\\?.*","http:\\/\\/maps\\.google\\.com\\/\\?.*","http:\\/\\/maps\\.google\\.com\\/maps\\/ms\\?.*","https:\\/\\/maps\\.google\\.com\\/maps\\?.*","https:\\/\\/maps\\.google\\.com\\/\\?.*","https:\\/\\/maps\\.google\\.com\\/maps\\/ms\\?.*","http:\\/\\/.*\\.craigslist\\.org\\/.*\\/.*","http:\\/\\/tumblr\\.com\\/.*","http:\\/\\/.*\\.tumblr\\.com\\/post\\/.*","http:\\/\\/www\\.quantcast\\.com\\/wd:.*","http:\\/\\/www\\.quantcast\\.com\\/.*","http:\\/\\/pastebin\\.com\\/.*","http:\\/\\/cl\\.ly\\/.*","http:\\/\\/cl\\.ly\\/.*\\/content","http:\\/\\/www\\.kiva\\.org\\/lend\\/.*","http:\\/\\/prezi\\.com\\/.*\\/.*","http:\\/\\/www\\.qwiki\\.com\\/q\\/.*","http:\\/\\/crocodoc\\.com\\/.*","http:\\/\\/.*\\.crocodoc\\.com\\/.*","https:\\/\\/crocodoc\\.com\\/.*","https:\\/\\/.*\\.crocodoc\\.com\\/.*","http:\\/\\/www\\.wikipedia\\.org\\/wiki\\/.*","http:\\/\\/www\\.wikimedia\\.org\\/wiki\\/File.*","http:\\/\\/.*yfrog\\..*\\/.*","http:\\/\\/twitter\\.com\\/.*\\/status\\/.*\\/photo\\/.*","http:\\/\\/twitter\\.com\\/.*\\/statuses\\/.*\\/photo","http:\\/\\/pic\\.twitter\\.com\\/.*","http:\\/\\/www\\.twitter\\.com\\/.*\\/statuses\\/.*\\/photo\\/.*","http:\\/\\/mobile\\.twitter\\.com\\/.*\\/status\\/.*\\/photo\\/.*","http:\\/\\/mobile\\.twitter\\.com\\/.*\\/statuses\\/.*\\/photo\\/.*","https:\\/\\/twitter\\.com\\/.*\\/status\\/.*\\/photo\\/.*","https:\\/\\/twitter\\.com\\/.*\\/statuses\\/.*\\/photo\\/.*","https:\\/\\/www\\.twitter\\.com\\/.*\\/status\\/.*\\/photo\\/.*","https:\\/\\/www\\.twitter\\.com\\/.*\\/statuses\\/.*\\/photo\\/.*","https:\\/\\/mobile\\.twitter\\.com\\/.*\\/status\\/.*\\/photo\\/.*","https:\\/\\/mobile\\.twitter\\.com\\/.*\\/statuses\\/.*\\/photo\\/.*","http:\\/\\/www\\.flickr\\.com\\/photos\\/.*","http:\\/\\/flic\\.kr\\/.*","http:\\/\\/twitpic\\.com\\/.*","http:\\/\\/www\\.twitpic\\.com\\/.*","http:\\/\\/twitpic\\.com\\/photos\\/.*","http:\\/\\/www\\.twitpic\\.com\\/photos\\/.*","http:\\/\\/.*imgur\\.com\\/.*","http:\\/\\/.*\\.posterous\\.com\\/.*","http:\\/\\/i.*\\.photobucket\\.com\\/albums\\/.*","http:\\/\\/s.*\\.photobucket\\.com\\/albums\\/.*","http:\\/\\/media\\.photobucket\\.com\\/image\\/.*","http:\\/\\/xkcd\\.com\\/.*","http:\\/\\/www\\.xkcd\\.com\\/.*","http:\\/\\/imgs\\.xkcd\\.com\\/.*","http:\\/\\/www\\.asofterworld\\.com\\/index\\.php\\?id=.*","http:\\/\\/www\\.asofterworld\\.com\\/.*\\.jpg","http:\\/\\/asofterworld\\.com\\/.*\\.jpg","http:\\/\\/www\\.qwantz\\.com\\/index\\.php\\?comic=.*","http:\\/\\/.*dribbble\\.com\\/shots\\/.*","http:\\/\\/drbl\\.in\\/.*","https:\\/\\/www.dropbox.com\\/s\\/.*.png","http:\\/\\/.*\\.smugmug\\.com\\/.*","http:\\/\\/.*\\.smugmug\\.com\\/.*\\#.*","http:\\/\\/emberapp\\.com\\/.*\\/images\\/.*","http:\\/\\/emberapp\\.com\\/.*\\/images\\/.*\\/sizes\\/.*","http:\\/\\/emberapp\\.com\\/.*\\/collections\\/.*\\/.*","http:\\/\\/emberapp\\.com\\/.*\\/categories\\/.*\\/.*\\/.*","http:\\/\\/embr\\.it\\/.*","http:\\/\\/picasaweb\\.google\\.com.*\\/.*\\/.*\\#.*","http:\\/\\/picasaweb\\.google\\.com.*\\/lh\\/photo\\/.*","http:\\/\\/picasaweb\\.google\\.com.*\\/.*\\/.*","http:\\/\\/dailybooth\\.com\\/.*\\/.*","http:\\/\\/img\\.ly\\/.*","http:\\/\\/www\\.tinypic\\.com\\/view\\.php.*","http:\\/\\/tinypic\\.com\\/view\\.php.*","http:\\/\\/www\\.tinypic\\.com\\/player\\.php.*","http:\\/\\/tinypic\\.com\\/player\\.php.*","http:\\/\\/www\\.tinypic\\.com\\/r\\/.*\\/.*","http:\\/\\/tinypic\\.com\\/r\\/.*\\/.*","http:\\/\\/.*\\.tinypic\\.com\\/.*\\.jpg","http:\\/\\/.*\\.tinypic\\.com\\/.*\\.png","http:\\/\\/.*\\.deviantart\\.com\\/art\\/.*","http:\\/\\/.*\\.deviantart\\.com\\/gallery\\/.*","http:\\/\\/.*\\.deviantart\\.com\\/\\#\\/.*","http:\\/\\/.*\\.deviantart\\.com","http:\\/\\/.*\\.deviantart\\.com\\/gallery","http:\\/\\/.*\\.deviantart\\.com\\/.*\\/.*\\.jpg","http:\\/\\/.*\\.deviantart\\.com\\/.*\\/.*\\.gif","http:\\/\\/.*\\.deviantart\\.net\\/.*\\/.*\\.jpg","http:\\/\\/.*\\.deviantart\\.net\\/.*\\/.*\\.gif","http:\\/\\/instagr\\.am\\/p\\/.*","http:\\/\\/instagram\\.com\\/p\\/.*","http:\\/\\/skitch\\.com\\/.*\\/.*\\/.*","http:\\/\\/img\\.skitch\\.com\\/.*","https:\\/\\/skitch\\.com\\/.*\\/.*\\/.*","https:\\/\\/img\\.skitch\\.com\\/.*","http:\\/\\/www\\.evernote\\.com\\/shard\\/.*","https:\\/\\/www\\.evernote\\.com\\/shard\\/.*","http:\\/\\/twitrpix\\.com\\/.*","http:\\/\\/.*\\.twitrpix\\.com\\/.*","http:\\/\\/ow\\.ly\\/i\\/.*","http:\\/\\/.*amazon\\..*\\/gp\\/product\\/.*","http:\\/\\/.*amazon\\..*\\/.*\\/dp\\/.*","http:\\/\\/.*amazon\\..*\\/dp\\/.*","http:\\/\\/.*amazon\\..*\\/o\\/ASIN\\/.*","http:\\/\\/.*amazon\\..*\\/gp\\/offer-listing\\/.*","http:\\/\\/.*amazon\\..*\\/.*\\/ASIN\\/.*","http:\\/\\/.*amazon\\..*\\/gp\\/product\\/images\\/.*","http:\\/\\/.*amazon\\..*\\/gp\\/aw\\/d\\/.*","http:\\/\\/www\\.amzn\\.com\\/.*","http:\\/\\/amzn\\.com\\/.*","http:\\/\\/itunes\\.apple\\.com\\/.*","https:\\/\\/itunes\\.apple\\.com\\/.*","https:\\/\\/soundcloud\\.com\\/.*","https:\\/\\/soundcloud\\.com\\/.*\\/.*","https:\\/\\/soundcloud\\.com\\/.*\\/sets\\/.*","https:\\/\\/soundcloud\\.com\\/groups\\/.*","http:\\/\\/snd\\.sc\\/.*","http:\\/\\/www\\.last\\.fm\\/music\\/.*","http:\\/\\/www\\.last\\.fm\\/music\\/+videos\\/.*","http:\\/\\/www\\.last\\.fm\\/music\\/+images\\/.*","http:\\/\\/www\\.last\\.fm\\/music\\/.*\\/_\\/.*","http:\\/\\/www\\.last\\.fm\\/music\\/.*\\/.*","http:\\/\\/www\\.rdio\\.com\\/\\#\\/artist\\/.*\\/album\\/.*","http:\\/\\/www\\.rdio\\.com\\/artist\\/.*\\/album\\/.*","http:\\/\\/www\\.npr\\.org\\/.*\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.npr\\.org\\/.*\\/.*\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.npr\\.org\\/.*\\/.*\\/.*\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.npr\\.org\\/templates\\/story\\/story\\.php.*","http:\\/\\/grooveshark\\.com\\/.*","http:\\/\\/espn\\.go\\.com\\/video\\/clip.*","http:\\/\\/espn\\.go\\.com\\/.*\\/story.*","http:\\/\\/abcnews\\.com\\/.*\\/video\\/.*","http:\\/\\/abcnews\\.com\\/video\\/playerIndex.*","http:\\/\\/abcnews\\.go\\.com\\/.*\\/video\\/.*","http:\\/\\/abcnews\\.go\\.com\\/video\\/playerIndex.*","http:\\/\\/washingtonpost\\.com\\/wp-dyn\\/.*\\/video\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.washingtonpost\\.com\\/wp-dyn\\/.*\\/video\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.boston\\.com\\/video.*","http:\\/\\/boston\\.com\\/video.*","http:\\/\\/www\\.boston\\.com\\/.*video.*","http:\\/\\/boston\\.com\\/.*video.*","http:\\/\\/www\\.facebook\\.com\\/photo\\.php.*","http:\\/\\/www\\.facebook\\.com\\/video\\/video\\.php.*","http:\\/\\/www\\.facebook\\.com\\/v\\/.*","https:\\/\\/www\\.facebook\\.com\\/photo\\.php.*","https:\\/\\/www\\.facebook\\.com\\/video\\/video\\.php.*","https:\\/\\/www\\.facebook\\.com\\/v\\/.*","http:\\/\\/cnbc\\.com\\/id\\/.*\\?.*video.*","http:\\/\\/www\\.cnbc\\.com\\/id\\/.*\\?.*video.*","http:\\/\\/cnbc\\.com\\/id\\/.*\\/play\\/1\\/video\\/.*","http:\\/\\/www\\.cnbc\\.com\\/id\\/.*\\/play\\/1\\/video\\/.*","http:\\/\\/cbsnews\\.com\\/video\\/watch\\/.*","http:\\/\\/www\\.google\\.com\\/profiles\\/.*","http:\\/\\/google\\.com\\/profiles\\/.*","http:\\/\\/www\\.cnn\\.com\\/video\\/.*","http:\\/\\/edition\\.cnn\\.com\\/video\\/.*","http:\\/\\/money\\.cnn\\.com\\/video\\/.*","http:\\/\\/today\\.msnbc\\.msn\\.com\\/id\\/.*\\/vp\\/.*","http:\\/\\/www\\.msnbc\\.msn\\.com\\/id\\/.*\\/vp\\/.*","http:\\/\\/www\\.msnbc\\.msn\\.com\\/id\\/.*\\/ns\\/.*","http:\\/\\/today\\.msnbc\\.msn\\.com\\/id\\/.*\\/ns\\/.*","http:\\/\\/guardian\\.co\\.uk\\/.*\\/video\\/.*\\/.*\\/.*\\/.*","http:\\/\\/www\\.guardian\\.co\\.uk\\/.*\\/video\\/.*\\/.*\\/.*\\/.*","http:\\/\\/bravotv\\.com\\/.*\\/.*\\/videos\\/.*","http:\\/\\/www\\.bravotv\\.com\\/.*\\/.*\\/videos\\/.*","http:\\/\\/video\\.nationalgeographic\\.com\\/.*\\/.*\\/.*\\.html","http:\\/\\/dsc\\.discovery\\.com\\/videos\\/.*","http:\\/\\/animal\\.discovery\\.com\\/videos\\/.*","http:\\/\\/health\\.discovery\\.com\\/videos\\/.*","http:\\/\\/investigation\\.discovery\\.com\\/videos\\/.*","http:\\/\\/military\\.discovery\\.com\\/videos\\/.*","http:\\/\\/planetgreen\\.discovery\\.com\\/videos\\/.*","http:\\/\\/science\\.discovery\\.com\\/videos\\/.*","http:\\/\\/tlc\\.discovery\\.com\\/videos\\/.*","http:\\/\\/video\\.forbes\\.com\\/fvn\\/.*","http:\\/\\/pinterest\\.com\\/pin\\/.*","https:\\/\\/speakerdeck\\.com\\/.*\\/.*"];
embedlyRegexps=null;embedlyUrl=function(B){if(!embedlyRegexps){embedlyRegexps=[];for(var A in embedlyUrlMasks){embedlyRegexps.push(new RegExp(embedlyUrlMasks[A],"i"));
}}for(var A in embedlyRegexps){if(embedlyRegexps[A].exec(B)){return true;}}return false;}
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;
var ace={};ace.ui={};ace.editor=function(t,E){var u=/\s/;var v=/[\u0030-\u0039\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0100-\u1FFF\u3040-\u9FFF\uF900-\uFDFF\uFE70-\uFEFE\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDC]/;
var x={bold:true,italic:true,underline:true,strikethrough:true,superscript:true,subscript:true,list:true,code:true};
var Z=[];var D=null;var d;var V=false;var n=null;var O=false;var I=true;var W=false;var z=1;var P;var B={lines:newSkipList(),selStart:null,selEnd:null,selFocusAtStart:false,alltext:"",alines:[],apool:new AttribPool()};
var C=$(t)[0];var A=this;var K="";var L="monospace";var m=12;A.getCurrentCallStack=function(){return D;
};A.getDynamicCSS=function(){return n;};A.getIdleWorkTimer=function(){return G;};A.getInInternationalComposition=function(){return O;
};A.getIsEditable=function(){return I;};function q(){return $(C).height();}function AF(){return $(C).width();
}A.getObserver=function(){return E;};A.getRep=function(){return B;};A.getRoot=function(){return C;};A.getRootSelector=function(){return t;
};A.getTextFace=function(){return L;};A.getThisAuthor=function(){return K;};A.textLineHeight=function(){return 20;
};A.setInInternationalComposition=function(AM){O=AM;};A.setIsScrolling=function(AM){W=AM;};function AG(AM){L=AM;
C.style.fontFamily=L;}function AL(AM){m=AM;C.style.fontSize=m+"px";C.style.lineHeight=A.textLineHeight()+"px";
}function AB(AM){setClassPresence(C,"mobile-app",AM);}function AC(AM){setClassPresence(C,"desktop-app",AM);
}if(undoModule.enabled){undoModule.apool=B.apool;}A.setProperty=function(AO,AN){var AM=AO.toLowerCase();
if(AM=="showsauthorcolors"){}else{if(AM=="showsuserselections"){setClassPresence(C,"userSelections",!!AN);
}else{if(AM=="showslinenumbers"){j();}else{if(AM=="grayedout"){setClassPresence(document.body,"grayedout",!!AN);
}else{if(AM=="dmesg"){M=AN;window.dmesg=AN;}else{if(AM=="userauthor"){K=String(AN);}else{if(AM=="shortnames"){A.setShortNames(AN);
}else{if(AM=="textface"){AG(AN);if(AN=="monospace"){$(C).attr("spellcheck","false");}else{if(ace.util.isValidBrowserForSpellcheck()){$(C).removeAttr("spellcheck");
}}}else{if(AM=="textsize"){}else{if(AM=="tokenizer"){A.setTokenizer(AN);}else{if(AM=="langtokenizer"){A.setTokenizer(AN[0],AN[1]);
}else{if(AM=="ismobileapp"){AB(AN);}else{if(AM=="isdesktopapp"){AC(AN);}else{if(AM=="notitle"){setClassPresence(C,"notitle",AN);
}else{if(AM=="min-height"){C.style.minHeight=AN+"px";}}}}}}}}}}}}}}}};function w(){decorate(A,new ace.selection(A));
decorate(A,new ace.lists(A));decorate(A,new ace.autolink(A));decorate(A,new ace.code(A));decorate(A,new ace.tables(A));
decorate(A,new ace.authors(A));decorate(A,makeChangesetTracker(window,B.apool,{withCallbacks:function(AM,AN){A.inCallStackIfNecessary(AM,function(){A.fastIncorp();
AN({setDocumentAttributedText:function(AO){A.setDocAText(AO);},applyChangesetToDocument:function(AQ,AP){var AO=D.editEvent.eventType;
D.startNewEvent("nonundoable");A.performDocumentApplyChangeset(AQ,AP);D.startNewEvent(AO);}});});}}));
E.attachEditor(A);A.inCallStack("setup",function(){if(browser.mozilla){addClass(C,"mozilla");}else{if(browser.safari){addClass(C,"safari");
}else{if(browser.msie){addClass(C,"msie");try{document.execCommand("BackgroundImageCache",false,true);
}catch(AN){}}}}setClassPresence(C,"doesWrap",true);n=makeCSSManager("dynamicsyntax");setClassPresence(C,"authorColors",false);
o();while(C.firstChild){C.removeChild(C.firstChild);}var AM=R("");S(0,B.lines.length(),[AM]);Q(null,[AM.domInfo],null);
B.alines=Changeset.splitAttributionLines(Changeset.makeAttribution("\n"),"\n");h();});if(!ace.util.isValidBrowserForSpellcheck()){$(C).attr("spellcheck","false");
}A.setupSelectionToolbar();setTimeout(function(){$(C).addClass("loaded");},0);}A.importAText=function(AM,AN,AP){AM=Changeset.cloneAText(AM);
if(AN){var AO=(new AttribPool()).fromJsonable(AN);AM.attribs=Changeset.moveOpsToNewPool(AM.attribs,AO,B.apool);
}A.inCallStackIfNecessary("importText"+(AP?"Undoable":""),function(){A.setDocAText(AM);});};A.setDocAText=function(AO){A.fastIncorp();
var AQ=B.lines.totalWidth();var AP=B.lines.length();var AS=B.lines.offsetOfIndex(AP-1);var AR=B.lines.atIndex(AP-1).text.length;
var AN=Changeset.smartOpAssembler();var AM=Changeset.newOp("-");AM.chars=AS;AM.lines=AP-1;AN.append(AM);
AM.chars=AR;AM.lines=0;AN.append(AM);Changeset.appendATextToAssembler(AO,AN);var AT=AQ+AN.getLengthChange();
var AU=Changeset.checkRep(Changeset.pack(AQ,AT,AN.toString(),AO.text.slice(0,-1)));A.performDocumentApplyChangeset(AU);
G.atMost(100);if(B.alltext!=AO.text){M(htmlPrettyEscape(B.alltext));M(htmlPrettyEscape(AO.text));throw new Error("mismatch error setting raw text in setDocAText");
}};A.dispose=function(){V=true;if(G){G.never();}f();};function f(){E&&E.detachEditor();E=null;}function h(){$(C).on("mousedown mouseout mouseover mouseup touchstart touchmove paste focus blur",function(AM){E.trigger(AM.type,[AM]);
});$(C).on("dragstart",function(AM){AM.preventDefault();});$(C).on("keydown keypress keyup",function(AM){E.trigger("key-event",[AM]);
});$(C).on("touchend click",function(AM){E.trigger("click",[AM]);});$(document).on("dragover drop",function(AM){E.trigger(AM.type,[AM]);
});$(window).on("scroll",throttle(function(AM){E.trigger("scroll-throttled",[AM]);},100));$(window).on("scroll",function(AM){E.trigger("scroll",[AM]);
});$(window).on("resize",throttle(function(AM){E.trigger("resize",[AM]);},100));if(browser.msie){$(C).on("click",function(AM){E.trigger("ie-click",[AM]);
});}else{if(document.documentElement){$(document.documentElement).on("compositionstart compositionend",function(AM){E.trigger(AM.type,[AM]);
});$(document.documentElement).on("click",function(AM){E.trigger("capture-click",[AM]);});}}$(window).on("unload",f);
}var M=window.dmesg=noop;var H=window.PROFILER;if(!H){H=function(){return{start:noop,mark:noop,literal:noop,end:noop,cancel:noop};
};}A.inCallStack=function(AO,AV){if(V){return;}if(D){console.error("Can't enter callstack "+AO+", already in "+D.type);
}var AR=false;function AU(){AR=true;console.profile();}function AP(AX){return{eventType:AX,backset:null};
}function AQ(AX){if(B.selStart&&B.selEnd){var Ab=B.lines.offsetOfIndex(B.selStart[0])+B.selStart[1];var AZ=B.lines.offsetOfIndex(B.selEnd[0])+B.selEnd[1];
AX.selStart=Ab;AX.selEnd=AZ;AX.selFocusAtStart=B.selFocusAtStart;}if(undoModule.enabled){var AY=false;
try{if(AX.eventType=="setup"||AX.eventType=="importText"||AX.eventType=="setBaseText"){undoModule.clearHistory();
}else{if(AX.eventType=="nonundoable"){if(AX.changeset){undoModule.reportExternalChange(AX.changeset);
}}else{undoModule.reportEvent(AX);}}AY=true;}catch(Aa){}finally{if(!AY){undoModule.enabled=false;}}}}function AW(AZ,AY){var AX=D.editEvent;
if(!AY){AQ(AX);}D.editEvent=AP(AZ);return AX;}D={type:AO,docTextChanged:false,selectionAffected:false,userChangedSelection:false,domClean:false,profileRest:AU,isUserChange:false,repChanged:false,editEvent:AP(AO),startNewEvent:AW};
var AS=false;var AT;try{AT=AV();AS=true;}catch(AN){Z.push({error:AN,time:+new Date()});M(AN.toString());
throw AN;}finally{var AM=D;if(AS){AQ(AM.editEvent);if(AM.domClean&&AM.type!="setup"){if(AM.selectionAffected){A.updateBrowserSelectionFromRep();
}if((AM.docTextChanged||AM.userChangedSelection)&&AM.type!="applyChangesToBase"){A.scrollSelectionIntoView();
E.trigger("caret");}if(AM.isUserChange&&AM.selectionAffected&&AM.repChanged&&!AM.isTriggeringAutocomplete){A.handleAutocomplete();
}if(AM.docTextChanged&&AM.type.indexOf("importText")<0){E.trigger("caret");}}}else{if(D.type=="idleWorkTimer"){G.atLeast(1000);
}}D=null;if(AR){console.profileEnd();}}return AT;};A.inCallStackIfNecessary=function(AN,AM){if(!D){A.inCallStack(AN,AM);
}else{AM();}};A.getUnhandledErrors=function(){return Z.slice();};A.callWithAce=function(AP,AN,AO){var AM=function(){return AP(A);
};if(AO!==undefined){var AQ=AM;AM=function(){A.fastIncorp();AQ();};}if(AN!==undefined){return A.inCallStack(AN,AM);
}else{return AM();}};var G=ace.util.makeIdleAction(function(){if(!I){return;}if(O){G.atLeast(500);return;
}A.inCallStack("idleWorkTimer",function(){var AM=ace.util.newTimeLimit(99);var AO=false;var AP=false;
try{T(AM);AO=true;if(AM()||W){return;}E.trigger("idlework",[AM]);if(AM()){return;}AP=true;}catch(AQ){}finally{if(AP){G.atMost(1000);
}else{if(AO){G.atMost(500);}else{var AN=Math.round(AM.elapsed()/2);if(AN<100){AN=100;}G.atMost(AN);}}}});
});A.getTextInRange=function(AN,AM){var AO=B.lines.offsetOfIndex(AN[0])+AN[1];var AP=B.lines.offsetOfIndex(AM[0])+AM[1];
return B.alltext.substring(AO,AP);};A.createChangesetFromRange=function(AN,AO){var AW=AN[0];var AV=AO[0];
var AM=Changeset.builder(B.lines.totalWidth());A.buildRemoveRange(AM,[0,0],AN);A.buildKeepRange(AM,AN,AO,[],B.apool);
var AR=B.lines.length()-1;var AS=B.lines.atIndex(AR).text.length;A.buildRemoveRange(AM,AO,[AR,AS+1]);
var AT=AM.toString();var AU={text:B.alltext,attribs:Changeset.joinAttributionLines(B.alines)};var AP=Changeset.applyToAText(AT,AU,B.apool);
var AQ=new AttribPool();AP.attribs=Changeset.moveOpsToNewPool(AP.attribs,B.apool,AQ);return{apool:AQ,atext:AP};
};A.replaceRange=function(AQ,AM,AP,AO,AN){A.inCallStackIfNecessary("replaceRange",function(){A.fastIncorp();
A.performDocumentReplaceRange(AQ,AM,AP,AO,AN);});};A.performDocumentReplaceRange=function(AN,AO,AR,AS,AP){if(AN==undefined){AN=B.selStart;
}if(AO==undefined){AO=B.selEnd;}var AM=Changeset.builder(B.lines.totalWidth());s(AM,AN);A.buildRemoveRange(AM,AN,AO);
AM.insert(AR,[["author",K]].concat(AS||[]),B.apool);var AQ=AM.toString();A.performDocumentApplyChangeset(AQ,AP);
};A.performDocumentReplaceCharRange=function(AO,AN,AM){if(AO==AN&&AM.length==0){return;}if(AN==B.alltext.length){if(AO==AN){AO--;
AN--;AM="\n"+AM.substring(0,AM.length-1);}else{if(AM.length==0){AO--;AN--;}else{AN--;AM=AM.substring(0,AM.length-1);
}}}A.performDocumentReplaceRange(A.lineAndColumnFromChar(AO),A.lineAndColumnFromChar(AN),AM);};A.performDocumentApplyAttributesToRange=function(AN,AO,AQ){var AM=Changeset.builder(B.lines.totalWidth());
s(AM,AN);A.buildKeepRange(AM,AN,AO,AQ,B.apool);var AP=AM.toString();A.performDocumentApplyChangeset(AP);
};function AK(AO,AM,AN){if(AM>=B.alltext.length){AM=B.alltext.length-1;}A.performDocumentApplyAttributesToRange(A.lineAndColumnFromChar(AO),A.lineAndColumnFromChar(AM),AN);
}function s(AN,AM){var AO=B.lines.offsetOfIndex(AM[0]);AN.keep(AO,AM[0]);AN.keep(AM[1]);}A.buildRemoveRange=function(AO,AN,AM){var AQ=B.lines.offsetOfIndex(AN[0]);
var AP=B.lines.offsetOfIndex(AM[0]);if(AM[0]>AN[0]){AO.remove(AP-AQ-AN[1],AM[0]-AN[0]);AO.remove(AM[1]);
}else{var AR=Math.min(AM[1],B.lines.atIndex(AM[0]).width-1);AO.remove(AR-AN[1]);}};A.buildKeepRange=function(AO,AN,AM,AQ,AP){var AS=B.lines.offsetOfIndex(AN[0]);
var AR=B.lines.offsetOfIndex(AM[0]);if(AM[0]>AN[0]){AO.keep(AR-AS-AN[1],AM[0]-AN[0],AQ,AP);AO.keep(AM[1],0,AQ,AP);
}else{var AT=Math.min(AM[1],B.lines.atIndex(AM[0]).width-1);AO.keep(AT-AN[1],0,AQ,AP);}};A.performDocumentReplaceSelection=function(AP,AO){if(!(B.selStart&&B.selEnd)){return;
}var AN=B.selStart;var AM=B.selEnd;if(!AO){if(AN[1]==B.lines.atIndex(AN[0]).lineMarker){AN=[AN[0],0];
}if(AM[1]==B.lines.atIndex(AM[0]).lineMarker){AM=[AM[0],0];}}A.performDocumentReplaceRange(AN,AM,AP);
};function r(){P={cleanNodesNearChanges:{}};}r();function N(AQ){var AM;var AS;if(!A.isNodeDirty(AQ)){AM=AQ;
var AR=AM.previousSibling;var AP=AM.nextSibling;AS=((AR&&A.isNodeDirty(AR))||(AP&&A.isNodeDirty(AP)));
}else{var AN=AQ.previousSibling;while(AN&&A.isNodeDirty(AN)){AN=AN.previousSibling;}if(AN){AM=AN;}else{var AO=AQ.nextSibling;
while(AO&&A.isNodeDirty(AO)){AO=AO.nextSibling;}if(AO){AM=AO;}}if(!AM){return;}AS=true;}if(AS){P.cleanNodesNearChanges["$"+F(AM)]=true;
}else{var AV=F(AM);var AR=AM.previousSibling;var AP=AM.nextSibling;var AZ=((AR&&F(AR))||null);var AY=((AP&&F(AP))||null);
var AT=B.lines.prev(B.lines.atKey(AV));var AU=B.lines.next(B.lines.atKey(AV));var AX=((AT&&AT.key)||null);
var AW=((AU&&AU.key)||null);if(AZ!=AX||AY!=AW){P.cleanNodesNearChanges["$"+F(AM)]=true;}}}A.observeChangesAroundSelection=function(){if(D.observedSelection){return;
}D.observedSelection=true;var AQ=H("getSelection",false);var AO=A.getSelection();AQ.end();if(AO){function AP(AR){if((!AR)||AR==C){return null;
}while(AR.parentNode!=C){AR=AR.parentNode;}return AR;}var AN=AP(AO.startPoint.node);var AM=AP(AO.endPoint.node);
if(AN){N(AN);}if(AM&&AN!=AM){N(AM);}}};function AE(){if(C.getElementsByTagName){var AO=C.getElementsByTagName("style");
for(var AN=0;AN<AO.length;AN++){var AM=AO[AN];while(AM.parentNode&&AM.parentNode!=C){AM=AM.parentNode;
}if(AM.parentNode==C){N(AM);}}}}function p(){var AM=H("getDirtyRanges",false);AM.forIndices=0;AM.consecutives=0;
AM.corrections=0;var AQ={};var AO=B.lines.length();function AS(Af){if(AQ[Af]===undefined){AM.forIndices++;
var Ag;if(Af<0||Af>=AO){Ag=true;}else{var Ah=B.lines.atIndex(Af).key;Ag=(J(Ah)||false);}AQ[Af]=Ag;}return AQ[Af];
}var AT={};function AU(Af){if(AT[Af]===undefined){AM.consecutives++;AT[Af]=(function(){var Ah=AS(Af-1);
var Ag=AS(Af);if((!Ah)||(!Ag)){return false;}if((Ah===true)&&(Ag===true)){return !C.firstChild;}if((Ah===true)&&Ag.previousSibling){return false;
}if((Ag===true)&&Ah.nextSibling){return false;}if((Ah===true)||(Ag===true)){return true;}return Ah.nextSibling==Ag;
})();}return AT[Af];}function AV(Af){return !!AS(Af);}var AN=[[-1,AO+1]];function Ac(Af){var Ag=-1;forEach(AN,function(Ah,Ai){if(Af>=Ah[1]){return false;
}if(Af<Ah[0]){return true;}Ag=Ai;return true;});return Ag;}function Ab(Af,Ag){var Ai=AN[Af][0];var Ah=AN[Af][1];
if((Ai+1)==Ah){AN.splice(Af,1);}else{if(Ag==Ai){AN[Af][0]++;}else{if(Ag==(Ah-1)){AN[Af][1]--;}else{AN.splice(Af,1,[Ai,Ag],[Ag+1,Ah]);
}}}}function AR(Af,Ag){var Ai=AN[Af][0];var Ah=AN[Af][1];AN.splice(Af,1,[Ai,Ag],[Ag,Ah]);}var AX={};function AZ(Af){if(AX[Af]){return true;
}AM.corrections++;AX[Af]=true;var Ag=Ac(Af);var Ai=AV(Af);if(Ag<0){if(Ai){console.log("somehow lost clean line");
}return true;}if(!Ai){Ab(Ag,Af);return false;}else{var Ak=AN[Ag][0];var Aj=AN[Ag][1];var Ah=false;if(Ak<Af&&AV(Af-1)&&!AU(Af)){AR(Ag,Af);
Ah=true;}if(Aj>(Af+1)&&AV(Af+1)&&!AU(Af+1)){AR(Ag,Af+1);Ah=true;}return !Ah;}}function AW(Ah,Ai){var Ag=0;
var Af=Ah;while(Ag<Ai&&Af>=0){if(AZ(Af)){Ag++;}else{Ag=0;}Af--;}Ag=0;Af=Ah;while(Ag<Ai&&Af<AO){if(AZ(Af)){Ag++;
}else{Ag=0;}Af++;}}if(AO==0){AM.cancel();if(!AU(0)){AR(0,0);}}else{AM.mark("topbot");AW(0,1);AW(AO-1,1);
AM.mark("obs");for(var Ae in P.cleanNodesNearChanges){var Aa=Ae.substring(1);if(B.lines.containsKey(Aa)){var Ad=B.lines.indexOfKey(Aa);
AW(Ad,2);}}AM.mark("stats&calc");AM.literal(AM.forIndices,"byidx");AM.literal(AM.consecutives,"cons");
AM.literal(AM.corrections,"corr");}var AY=[];for(var AP=0;AP<AN.length-1;AP++){AY.push([AN[AP][1],AN[AP+1][0]]);
}AM.end();return AY;}A.markNodeClean=function(AN){var AM={};AM.nodeId=F(AN);AM.knownHTML=AN.innerHTML;
if(browser.msie){AM.knownText=AN.innerText;}setAssoc(AN,"dirtiness",AM);};A.isNodeDirty=function(AM){var AO=H("cleanCheck",false);
if(AM.parentNode!=C){return true;}var AN=getAssoc(AM,"dirtiness");if(!AN){return true;}if(AM.id!==AN.nodeId){return true;
}if(browser.msie){if(AM.innerText!==AN.knownText){return true;}}if(AM.innerHTML!==AN.knownHTML){return true;
}AO.end();return false;};function T(Ah){if(D.domClean){return false;}O=false;D.isUserChange=true;Ah=(Ah||function(){return false;
});var AO=H("incorp",false);if(!C.firstChild){C.innerHTML="<div><!-- --></div>";}AO.mark("obs");A.observeChangesAroundSelection();
AE();AO.mark("dirty");var AX=p();var Av=true;var Ae=0;var AM,AR;while(Ae<AX.length){AM=AX[Ae][0];AR=AX[Ae][1];
if(!((AM==0||J(B.lines.atIndex(AM-1).key))&&(AR==B.lines.length()||J(B.lines.atIndex(AR).key)))){Av=false;
break;}Ae++;}if(!Av){var A0=C.childNodes.length;for(var AZ=0;AZ<A0;AZ++){var Ag=C.childNodes.item(AZ);
if((Ag.tagName)&&((!Ag.id)||(!B.lines.containsKey(Ag.id)))){N(Ag);}}AX=p();}r();AO.mark("getsel");var AQ=A.getSelection();
var AN,AP;var Am=0;var Af=[];var Ab=0;var AW=[];AO.mark("ranges");AO.literal(AX.length,"numdirt");var Al=[];
while(Am<AX.length){var Ap=AX[Am];AM=Ap[0];AR=Ap[1];var Aa=(((AM==0)&&C.firstChild)||J(B.lines.atIndex(AM-1).key).nextSibling);
Aa=(Aa&&A.isNodeDirty(Aa)&&Aa);var AS=(((AR==B.lines.length())&&C.lastChild)||J(B.lines.atIndex(AR).key).previousSibling);
AS=(AS&&A.isNodeDirty(AS)&&AS);if(Aa&&AS){var AY=makeContentCollector(true,browser,B.apool,null,linestylefilter.className2Author);
AY.notifySelection(AQ);var As=[];for(var AV=Aa;AV&&!(AV.previousSibling&&AV.previousSibling==AS);AV=AV.nextSibling){if(browser.msie){try{var Aq=document.body.createTextRange();
Aq.moveToElementText(AV);Aq.execCommand("unlink",false,null);}catch(Az){}}AY.collectContent(AV);As.push(AV);
}AY.notifyNextNode(AS.nextSibling);var AU=AY.getLines();if((AU.length<=1||AU[AU.length-1]!=="")&&AS.nextSibling){AR++;
var An=AS.nextSibling;AY.collectContent(An);AW.push(An);AY.notifyNextNode(An.nextSibling);}var AT=AY.finish();
var Ai=AT.selStart;var Aj=AT.selEnd;AU=AT.lines;var Ax=AT.lineAttribs;var Ak=AT.linesWrapped;if(AT.newAuthors.length){E.trigger("missing-authors",[AT.newAuthors]);
}if(Ak>0){ace.util.doAlert("Editor warning: "+Ak+" long line"+(Ak==1?" was":"s were")+" hard-wrapped into "+AT.numLinesAfter+" lines.");
}if(Ai[0]>=0){AN=[Ai[0]+AM+Ab,Ai[1]];}if(Aj[0]>=0){AP=[Aj[0]+AM+Ab,Aj[1]];}var Au=[];var Aw=AS;var Ar=new Array(AU.length);
for(var AZ=0;AZ<AU.length;AZ++){var Ay=AU[AZ];var At=R(Ay);Au.push(At);Ar[AZ]=At.domInfo;}Al.push([Aw,Ar]);
forEach(As,function(A1){AW.push(A1);});var Ad={};if(AN){Ad.selStart=AN;}if(AP){Ad.selEnd=AP;}Ad.preserveAuthorship=AT.nestedDomLines;
Af.push([AM+Ab,AR-AM,Au,Ax,Ad]);Ab+=(AU.length-(AR-AM));}else{if(AR>AM){Af.push([AM+Ab,AR-AM,[],[]]);
}}Am++;}var Ao=(Af.length>0);AO.mark("splice");forEach(Af,function(A1){AA(A1[0],A1[1],A1[2],A1[3],A1[4]);
});AO.mark("insert");forEach(Al,function(A2){Q(A2[0],A2[1],Ah);if(Al.length==1&&AW.length==1&&A2[0]==AW[0]){var A3=A2[1][0].node;
var A1=AW[0];A1.id=A3.id;if(A3.outerHTML==A1.outerHTML){AW=[A3];A.markNodeClean(A1);B.lines.atKey(A1.id).lineNode=A1;
B.lines.atKey(A1.id).domInfo.node=A1;}}});AO.mark("del");forEach(AW,function(A1){A1.parentNode.removeChild(A1);
});AO.mark("findsel");if(AQ&&!AN){AN=A.getLineAndCharForPoint(AQ.startPoint);}if(AQ&&!AP){AP=A.getLineAndCharForPoint(AQ.endPoint);
}var Ac=B.lines.length();if(AN&&AN[0]>=Ac){AN[0]=Ac-1;AN[1]=B.lines.atIndex(AN[0]).text.length;}if(AP&&AP[0]>=Ac){AP[0]=Ac-1;
AP[1]=B.lines.atIndex(AP[0]).text.length;}AO.mark("repsel");if(AQ){a(AN,AP,AQ&&AQ.focusAtStart);}AO.mark("browsel");
if(AQ&&(Ao||A.isCaret())){D.selectionAffected=true;if(Ao&&A.isCaret()&&iOS){A.renumberList(AN[0],true);
}}A.updateToolbarIfNecessary(AQ,A.isCaret(),AQ&&Math.abs(AP[0]-AN[0])>1);D.domClean=true;AO.mark("fixview");
j();AO.end("END");return Ao;}A.fastIncorp=function(){T(ace.util.newTimeLimit(0));};A.incorpIfQuick=function(){var AM=A.incorpIfQuick;
var AP=(AM.failures||0);if(AP<5){var AO=ace.util.newTimeLimit(40);var AQ=T(AO);if(AO()){AM.failures=AP+1;
}return true;}else{var AN=(AM.skipCount||0);AN++;if(AN==20){AN=0;AM.failures=0;}AM.skipCount=AN;}return false;
};function R(AO){function AQ(AR,AS){E.trigger("embed",[AR,AS]);}function AP(AS){U();var AR=A.findMagicDomNode(AS.target);
AR&&A.markNodeClean(AR);}var AN=domline.createDomLine(AO.length>0,true,browser,document,null,AQ,A.onMath,null,AP,A.getAuthorInfos());
var AM=AN.node;return{key:F(AM),text:AO,lineNode:AM,domInfo:AN,lineMarker:0};}function Q(AO,AM,AP){AP=(AP||function(){return false;
});var AN;var AQ;if(AM.length<1){return;}var AS=B.lines.atKey(F(AM[0].node));var AR=B.lines.atKey(F(AM[AM.length-1].node));
var AT=B.lines.offsetOfEntry(AS);var AU=B.lines.offsetOfEntry(AR)+AR.width;forEach(AM,function(AY){var AV=H("insertLine",false);
var AX=AY.node;var AZ=F(AX);var AW;AV.mark("findEntry");if(AN){var Aa=B.lines.next(AN);if(Aa&&Aa.key==AZ){AW=Aa;
AQ+=AN.width;}}if(!AW){AV.literal(1,"nonopt");AW=B.lines.atKey(AZ);AQ=B.lines.offsetOfKey(AZ);}else{AV.literal(0,"nonopt");
}AN=AW;AV.mark("spans");A.getSpansForLine(AW,function(Ab,Ac){AY.appendSpan(Ab,Ac);},AQ,AP());AV.mark("addLine");
AY.prepareForAdd();AW.lineMarker=AY.lineMarker;if(!AO){C.insertBefore(AX,C.firstChild);}else{C.insertBefore(AX,AO.nextSibling);
}AO=AX;AY.notifyAdded();AV.mark("markClean");A.markNodeClean(AX);AV.end();});}A.getSpansForLine=function(AN,AW){var AP=AN.text;
var Ab=AN.width;if(AP.length==0){var AY=linestylefilter.getLineStyleFilter(0,"",AW,B.apool);AY("","");
}else{var Ac=0;var AO=B.lines.indexOfEntry(AN);var AS=A.getLangForCodeLine(AO);var AR=null;if(AS||L=="monospace"){AR="start";
for(var AV=5,AM=B.lines.prev(AN);AV&&AM;AV--,AM=B.lines.prev(AM)){if(!AM.domInfo.node.children[0]){break;
}var AU=AM.domInfo.node.children[0].className.match(/list-code/);if(!AU||!AU.length){break;}var AT=AM.domInfo.node.className.match(/lexer_(\S+)/);
if(AT&&AT[1]){AR=AT[1];break;}}}var AX=A.getTokenizer(AS);var Aa=A.getLineListType(AO);var AQ=linestylefilter.getFilterStack(AP,AW,browser,L!="monospace"&&!AS&&Aa.indexOf("code")==-1,AR,(AO>0&&AX)?AX:null);
var AZ=B.alines[AO];AQ=linestylefilter.getLineStyleFilter(AP.length,AZ,AQ,B.apool);AQ(AP,"");}};function S(AM,AO,AN){forEach(AN,function(AV){AV.width=AV.text.length+1;
});var AQ=B.lines.offsetOfIndex(AM);var AR=B.lines.offsetOfIndex(AM+AO);var AS=B.lines.offsetOfIndex(AM);
var AU=B.lines.offsetOfIndex(AM+AO);B.lines.splice(AM,AO,AN);D.docTextChanged=true;D.repChanged=true;
var AT=B.lines.offsetOfIndex(AM+AN.length);var AP=map(AN,function(AV){return AV.text+"\n";}).join("");
B.alltext=B.alltext.substring(0,AQ)+AP+B.alltext.substring(AR,B.alltext.length);}function AA(AT,Ae,Am,Aw,AN){var An=B.lines.offsetOfIndex(AT);
var As=B.lines.offsetOfIndex(AT+Ae);var Ar=B.lines.offsetOfIndex(AT);var Aq,Au;if(AN&&AN.selStart){Aq=B.lines.offsetOfIndex(AN.selStart[0])+AN.selStart[1]-Ar;
}if(AN&&AN.selEnd){Au=B.lines.offsetOfIndex(AN.selEnd[0])+AN.selEnd[1]-Ar;}var AQ=map(Am,function(A2){return A2.text+"\n";
}).join("");var AZ=B.alltext.substring(An,As);var Ao=B.alines.slice(AT,AT+Ae).join("");var AY=Aw.join("|1+1")+"|1+1";
var Ak=AH(AZ,AQ,Ao,AY,Aq,Au);var AX=Ak[0];var AV=Ak[1];var AP=AZ.substring(AX,AZ.length-AV);var AM=AQ.substring(AX,AQ.length-AV);
var AO=An+AX;var AR=As-AV;var AU=false;if(AP.charAt(AP.length-1)=="\n"&&AM.charAt(AM.length-1)=="\n"){AP=AP.slice(0,-1);
AM=AM.slice(0,-1);AR--;AV++;}if(AP.length==0&&AO==B.alltext.length&&AM.length>0){AO--;AR--;AM="\n"+AM.slice(0,-1);
AU=true;}if(AR==B.alltext.length&&AP.length>0&&AM.length==0){if(B.alltext.charAt(AO-1)=="\n"){AO--;AR--;
}}if(!(AP.length==0&&AM.length==0)){var Az=B.alltext;var A1=Az.length;var Ac=B.lines.indexOfOffset(AO);
var Ai=B.lines.offsetOfIndex(Ac);function Ag(){var A2=Changeset.builder(A1);A2.keep(Ai,Ac);A2.keep(AO-Ai);
return A2;}function AW(A9,A8){var A4=Changeset.opIterator(A9);var A2=0;var A5=AX;var A7=AQ.length-AV-(AU?1:0);
while(A4.hasNext()){var A6=A4.next();var A3=A2+A6.chars;if(!(A3<=A5||A2>=A7)){A8(Math.max(A5,A2),Math.min(A7,A3),A6.attribs);
}A2=A3;}}var Ax=(AM==AP);var Ad;if(Ax){var Av=ace.util.cachedStrFunc(function(A2){return Changeset.mapAttribNumbers(A2,function(A4){var A3=B.apool.getAttribKey(A4);
if(c(A3)){return B.apool.putAttrib([A3,""]);}return false;});});var Ab=Ag();if(AU){Ab.keep(1,1);}AW(Ao,function(A4,A2,A3){Ab.keepText(AQ.substring(A4,A2),Av(A3));
});var A0=Ab.toString();var Aa=Ag();if(AU){Aa.keep(1,1);}AW(AY,function(A4,A2,A3){Aa.keepText(AQ.substring(A4,A2),A3);
});var Ay=Aa.toString();Ad=Changeset.compose(A0,Ay,B.apool);}else{var AS=Ag();var Ap=B.lines.indexOfOffset(AR);
var Ah=B.lines.offsetOfIndex(Ap);if(Ah>AO){AS.remove(Ah-AO,Ap-Ac);AS.remove(AR-Ah);}else{AS.remove(AR-AO);
}var At=false;var Al=Changeset.makeAttribsString("+",(K?[["author",K]]:[]),B.apool);var Aj=ace.util.cachedStrFunc(function(A2){var A3=AN&&AN.preserveAuthorship;
if(A3||At){return Changeset.composeAttributes(Al,A2,true,B.apool);}else{return Changeset.composeAttributes(A2,Al,true,B.apool);
}});var Af="";AW(AY,function(A5,A4,A3){var A2=Changeset.attribsAttributeValue(A3,"author",B.apool);if(A2&&A2!=Af){if(!Af){Af=A2;
}else{At=true;}}});if(AU){AS.insert("\n",Aj(""));}AW(AY,function(A4,A2,A3){AS.insert(AQ.substring(A4,A2),Aj(A3));
});Ad=AS.toString();}l(Ad);}S(AT,Ae,Am);}function AH(AT,AU,Ae,Af,Ai,AV){function AW(Aj){return c(B.apool.getAttribKey(Aj));
}function Ad(An){var Ak=[];var Am=[];var Aj=Changeset.opIterator(An);while(Aj.hasNext()){var Al=Aj.next();
Ak.push(Al.chars);Am.push(Al.attribs);}return[Ak,Am];}function AR(An,Am){var Al=An[0];var Ao=An[1];var Aj=(Am?Al.length-1:0);
var Ak=0;return function Ap(){while(Ak>=Al[Aj]){if(Am){Aj--;}else{Aj++;}Ak=0;}var Aq=Ao[Aj];Ak++;return Aq;
};}var AQ=AT.length;var AP=AU.length;var Aa=Math.min(AQ,AP);var Ab=Ad(Changeset.filterAttribNumbers(Ae,AW));
var AZ=Ad(Changeset.filterAttribNumbers(Af,AW));var AN=0;var Ah=AR(Ab,false);var Ag=AR(AZ,false);while(AN<Aa){if(AT.charAt(AN)==AU.charAt(AN)&&Ah()==Ag()){AN++;
}else{break;}}var AM=0;var AY=AR(Ab,true);var Ac=AR(AZ,true);while(AM<Aa){if(AM==0){AY();Ac();AM++;}else{if(AT.charAt(AQ-1-AM)==AU.charAt(AP-1-AM)&&AY()==Ac()){AM++;
}else{break;}}}var AO=-1;if((typeof AV)=="number"){AO=AP-AV;}if(AN+AM>AQ){var AS=AQ-AN;var AX=AM;if(AO>=AS&&AO<=AX){AM=AO;
}else{AM=AS;}AN=AQ-AM;}if(AN+AM>AP){var AS=AP-AN;var AX=AM;if(AO>=AS&&AO<=AX){AM=AO;}else{AM=AS;}AN=AP-AM;
}return[AN,AM];}function l(AM,AP){Changeset.checkRep(AM);if(Changeset.oldLen(AM)!=B.alltext.length){var AN="doRepApplyChangeset length mismatch: "+Changeset.oldLen(AM)+"/"+B.alltext.length;
window.onfreakout&&window.onfreakout(AN);throw new Error(AN);}(function AO(AR){var AQ=D.editEvent;if(AQ.eventType=="nonundoable"){if(!AQ.changeset){AQ.changeset=AR;
}else{AQ.changeset=Changeset.compose(AQ.changeset,AR,B.apool);}}else{var AS=Changeset.inverse(AR,{get:function(AT){return B.lines.atIndex(AT).text+"\n";
},length:function(){return B.lines.length();}},B.alines,B.apool);if(!AQ.backset){AQ.backset=AS;}else{AQ.backset=Changeset.compose(AS,AQ.backset,B.apool);
}}})(AM);Changeset.mutateAttributionLines(AM,B.alines,B.apool);if(A.isTracking()){A.composeUserChangeset(AM);
}}A.performDocumentApplyChangeset=function(AN,AP){l(AN,AP);var AM=null;if(B.selStart&&B.selEnd){var AT=B.lines.offsetOfIndex(B.selStart[0])+B.selStart[1];
var AQ=B.lines.offsetOfIndex(B.selEnd[0])+B.selEnd[1];var AO=Changeset.characterRangeFollow(AN,AT,AQ,AP);
AM=[AO[0],AO[1],B.selFocusAtStart];}var AS={splice:function(AV,AU,AW){AR(AV,AU,map(Array.prototype.slice.call(arguments,2),function(AX){return AX.slice(0,-1);
}),null);},get:function(AU){return B.lines.atIndex(AU).text+"\n";},length:function(){return B.lines.length();
},slice_notused:function(AV,AU){return map(B.lines.slice(AV,AU),function(AW){return AW.text+"\n";});}};
Changeset.mutateTextLines(AN,AS);if(AM){A.performSelectionChange(A.lineAndColumnFromChar(AM[0]),A.lineAndColumnFromChar(AM[1]),AM[2]);
}function AR(AU,AW,Ac,AZ){AZ=(AZ||ace.util.newTimeLimit(50));var AV=[];if(AW>0){var Aa=B.lines.atIndex(AU);
for(var Ab=0;Ab<AW;Ab++){AV.push(Aa.key);Aa=B.lines.next(Aa);}}var AX=map(Ac,R);S(AU,AW,AX);var AY;if(AU>0){AY=J(B.lines.atIndex(AU-1).key);
}else{AY=null;}Q(AY,map(AX,function(Ad){return Ad.domInfo;}),AZ);if(AX.length==1&&AV.length==1){AV=A.domAndRepSpliceToTable(AX,AV,AU);
}forEach(AV,function(Ae){var Ad=document.getElementById(Ae);Ad.parentNode.removeChild(Ad);});if((B.selStart&&B.selStart[0]>=AU&&B.selStart[0]<=AU+AW)||(B.selEnd&&B.selEnd[0]>=AU&&B.selEnd[0]<=AU+AW)){D.selectionAffected=true;
}}};A.setAttributeOnSelection=function(AM,AN){if(!(B.selStart&&B.selEnd)){return;}A.performDocumentApplyAttributesToRange(B.selStart,B.selEnd,[[AM,AN]]);
};A.setAttributeOnLine=function(AM,AO,AP){var AQ=[AM,0];var AN=[AM+1,0];A.performDocumentApplyAttributesToRange(AQ,AN,[[AO,AP?"true":""]]);
};A.toggleAttributeOnSelection=function(AN){if(document.activeElement.id=="sheet-id"){document.activeElement.triggerAttrToggle({bold:"b",italic:"i",underline:"u",strikethrough:"del"}[AN]);
return false;}if(!(B.selStart&&B.selEnd)){return;}if(A.isCaret()&&document.execCommand&&_contains(["bold","italic","underline","strikethrough"],AN)){document.execCommand(AN);
}var AO=true;var AZ=Changeset.makeAttribsString("+",[[AN,"true"]],B.apool);var Aa=new RegExp(AZ.replace(/\*/g,"\\*")+"(\\*|$)");
function AY(Ab){return Aa.test(Ab);}var AV=B.selStart[0];var AS=B.selEnd[0];for(var AM=AV;AM<=AS;AM++){var AQ=Changeset.opIterator(B.alines[AM]);
var AX=0;var AU=0;var AP=B.lines.atIndex(AM).text.length;if(AM==AV){AU=B.selStart[1];}if(AM==AS){AP=B.selEnd[1];
}while(AQ.hasNext()){var AT=AQ.next();var AW=AX;var AR=AW+AT.chars;if(!AY(AT.attribs)){if(!(AR<=AU||AW>=AP)){AO=false;
break;}}AX=AR;}if(!AO){break;}}if(AO){A.performDocumentApplyAttributesToRange(B.selStart,B.selEnd,[[AN,""]]);
}else{A.performDocumentApplyAttributesToRange(B.selStart,B.selEnd,[[AN,"true"]]);}};A.performSelectionChange=function(AO,AM,AN){if(a(AO,AM,AN)){D.selectionAffected=true;
}};function a(AN,AM,AO){AO=!!AO;var AP=(AO&&((!AN)||(!AM)||(AN[0]!=AM[0])||(AN[1]!=AM[1])));if(((!ace.util.equalLineAndChars(B.selStart,AN))||(!ace.util.equalLineAndChars(B.selEnd,AM))||(B.selFocusAtStart!=AP))){B.selStart=AN;
B.selEnd=AM;B.selFocusAtStart=AP;D.repChanged=true;return true;}return false;}A.doUndoRedo=function(AN){if(undoModule.enabled){var AM;
if(AN=="undo"){AM="performUndo";}if(AN=="redo"){AM="performRedo";}if(AM){var AO=D.editEvent.eventType;
D.startNewEvent(AN);undoModule[AM](function(AQ,AP){if(AQ){A.performDocumentApplyChangeset(AQ);}if(AP){A.performSelectionChange(A.lineAndColumnFromChar(AP.selStart),A.lineAndColumnFromChar(AP.selEnd),AP.selFocusAtStart);
}var AR=D.startNewEvent(AO,true);return AR;});}}};A.canUndoRedo=function(AM){if(!undoModule.enabled){return false;
}if(AM=="undo"){return undoModule.canPerformUndo();}if(AM=="redo"){return undoModule.canPerformRedo();
}return false;};function j(){if(AF()==0||q()==0){return;}function AN(AR,AS,AQ){if(AR[AS]!=AQ){AR[AS]=AQ;
return true;}return false;}for(var AO=0;AO<2;AO++){var AM=$(C).outerHeight();var AP=q();if(AM<AP){if(browser.msie){AN(document.documentElement.style,"overflowY","auto");
}}else{if(browser.msie){AN(document.documentElement.style,"overflowY","scroll");}}if(d!=AM){d=AM;E.trigger("height-change",[AM]);
}}if(browser.mozilla){AN(C.style,"height","");}o();}function o(){A.setEditable(I);}A.setEditable=function(AM){I=AM;
if(!I){Y(false);}else{Y(true);}if(browser.mozilla){try{document.execCommand("enableObjectResizing",false,false);
}catch(AN){}}else{if(browser.ie){$(document).on("onresizestart",function(AO){AO.data.preventDefault();
});}}setClassPresence(C,"static",!I);};function Y(AM){try{function AN(AQ,AS,AR){if(String(AQ[AS]).toLowerCase()!=AR){AQ[AS]=AR;
return true;}return false;}if(browser.msie||browser.safari||browser.mozilla){AN(C,"contentEditable",(AM?"true":"false"));
}else{var AO=AN(document,"designMode",(AM?"on":"off"));if(AO&&AM&&browser.opera){h();}}return true;}catch(AP){return false;
}}A.findMagicDomNode=function(AM){while(AM&&AM.parentNode!=C){AM=AM.parentNode;}return AM;};A.isWordChar=function(AM){return !!v.exec(AM);
};function X(AM){return !!u.exec(AM);}function AJ(AM,AN){return[AM,AN-B.lines.atIndex(AM).lineMarker];
}A.markerfulLineAndChar=function(AM,AN){return[AM,AN+B.lines.atIndex(AM).lineMarker];};function U(){E.trigger("invalidate-cache");
}function J(AO){var AM=H("getCleanNodeByKey",false);AM.extra=0;var AN=document.getElementById(AO);while(AN&&A.isNodeDirty(AN)){AM.extra++;
AN.id="";AN=document.getElementById(AO);}AM.literal(AM.extra,"extra");AM.end();return AN;}function F(AN){var AM=AN.id;
if(AM){return AM;}return(AN.id="magicdomid"+(z++));}function c(AM){return !!x[AM];}A.isCaret=function(){return(B.selStart&&B.selEnd&&B.selStart[0]==B.selEnd[0]&&B.selStart[1]==B.selEnd[1]);
};A.caretLine=function(){return B.selStart[0];};A.caretColumn=function(){return B.selStart[1];};A.caretDocChar=function(){return B.lines.offsetOfIndex(A.caretLine())+A.caretColumn();
};A.caretWord=function(){var AM=A.caretDocChar()-1;while(AM>0&&!X(B.alltext.charAt(AM))&&B.alltext.charAt(AM)!="*"){AM--;
}AM++;var AP=A.lineAndColumnFromChar(AM);var AN="";while(!X(B.alltext.charAt(AM))&&AM<B.alltext.length){AN+=B.alltext.charAt(AM);
AM++;}var AO=A.lineAndColumnFromChar(AM);return{word:AN,start:AP,end:AO};};A.lineAndColumnFromChar=function(AM){var AN=B.lines.atOffset(AM);
var AO=B.lines.offsetOfEntry(AN);var AP=B.lines.indexOfEntry(AN);return[AP,AM-AO];};A.charFromLineAndColumn=function(AM){var AP=AM[0];
var AO=B.lines.offsetOfIndex(AP);var AN=AM[1];return AO+AN;};function AD(AM){U();A.markNodeClean(A.findMagicDomNode(AM));
}window.onEmbedResize=AD;A.beginAppending=function AI(){var AM;AM=document.createRange();AM.selectNodeContents(document.body);
AM.collapse(false);var AN=window.getSelection();AN.removeAllRanges();AN.addRange(AM);};function y(){var AN=B.alltext;
var AM=AN.length;if(AM>0){AM--;}return AN.substring(0,AM);}A.exportText=function(){if(D&&!D.domClean){A.inCallStackIfNecessary("exportText",function(){A.fastIncorp();
});}return y();};var b=null;A.getVisibleHeight=function(){return b;};A.setVisibleHeight=function(AM){b=AM;
};w();A.ace_beginAppending=A.beginAppending;A.ace_doInsertImageBlob=function(AM){E.trigger("insert-image",[AM]);
};A.ace_canUndoRedo=A.canUndoRedo;A.ace_doUndoRedo=A.doUndoRedo;A.ace_performDocumentReplaceSelection=A.performDocumentReplaceSelection;
A.ace_doSetHeadingLevel=A.doSetHeadingLevel;A.ace_getBaseAttributedText=A.getBaseAttributedText;A.ace_getRep=A.getRep;
A.ace_scrollSelectionIntoView=A.scrollSelectionIntoView;A.ace_setProperty=A.setProperty;A.ace_exportText=A.exportText;
A.ace_setOnOpenLink=A.setOnOpenLink=function(AM){E.on("open-link",function(AP,AO,AN){AM(AO,AN);return false;
});};A.ace_setOnAttach=A.onAttach=function(AM){E.on("attach",function(AP,AN,AO){AM(AN,AO);return false;
});};A.ace_setAttachmentUrl=A.setAttachmentUrl=function(AO,AM,AN){E.trigger("set-attachment",[AO,AM,AN]);
};A.ace_doReturnKey=A.doReturnKey=function(){E.trigger("return-key");};A.ace_doDeleteKey=A.doDeleteKey=function(){E.trigger("delete-key");
};};ace.observer=function(){var C=null;var H=null;var B=null;var F=null;var G=null;var E=null;var D=null;
function l(u){C=u;H=new ace.keystrokes(C);B=new ace.mouse(C);F=new ace.ui.toc(C);G=new ace.ui.lineAnnotator(C);
E=new ace.ui.carets(C);D=new ace.media(C);S();}function n(){H=null;B=null;F=null;G=null;E=null;D=null;
$(C.getRoot()).off(".ace");C=null;}function S(){A("blur",V);A("capture-click",O);A("caret",U);A("click",X);
A("compositionend",J);A("compositionstart",J);A("dragover",s);A("drop",Y);A("embed",a);A("focus",b);A("idlework",Z);
A("ie-click",L);A("insert-image",d);A("invalidate-cache",c);A("key-event",P);A("mousedown",o);A("mouseout",K);
A("mouseover",W);A("mouseup",r);A("paste",f);A("remove-user-caret",N);A("resize",j);A("scroll",Q);A("scroll-finished",M);
A("scroll-throttled",T);A("touchmove",p);A("touchstart",m);A("update-user-caret",R);}function A(u,v){$(C.getRoot()).on("observer-"+u+".ace",v);
}function h(u){$(C.getRoot()).off("observer-"+u+".ace",func);}function I(v,u){$(C.getRoot()).trigger("observer-"+v,u);
}function q(v,u){return $(C.getRoot()).triggerHandler("observer-"+v,u);}function V(v,u){B.onBlur(u);}function O(v,u){B.captureClick(u);
}function U(w,v){var u=E.onCaretUpdate(v);if(u){pad.notifyUserCaretUpdate(E.getCurrentCaretPosition());
}}function X(w,u){var v=B.processClick(u);if(v){D.onClick(u);B.onClickMisc(u);}}function J(v,u){B.onCompositionEvent(u);
}function s(v,u){D.onDragOver(u.originalEvent);}function Y(v,u){D.onDrop(u.originalEvent);}function a(w,u,v){embed.onEmbed(u,v);
}function b(v,u){B.onFocus(u);}function L(v,u){B.handleIEOuterClick(u);}function Z(v,u){G.updateLineNumbers(ace.util.newTimeLimit(33));
if(u()){return;}F.updateTableOfContents(ace.util.newTimeLimit(33));}function c(u){F.invalidateCache();
G.invalidateCache();}function d(v,u){D.insertImage(u);}function P(v,u){H.onKeyEvent(u);}function o(v,u){D.onMouseDown(u);
}function t(v,u){B.onMouseEvent(u);}function K(v,u){B.handleMouseOut(u);}function W(v,u){B.handleMouseOver(u);
}function r(v,u){D.onMouseUp(u);}function f(v,u){D.onPaste(u);}function N(v,u){E.removeUserCaret(u);}function j(u){F.updateCurrentTOC();
E.updateAllCarets();I("invalidate-cache");}function Q(u){B.onScroll();}function M(u){F.updateCurrentTOC();
}function T(v,u){E.updateAllCarets();}function m(v,u){B.handleTouchStart(u);}function p(v,u){B.handleTouchMove(u);
}function R(w,v,u){E.updateUserCaret(v,u);}return{attachEditor:l,detachEditor:n,off:h,on:A,trigger:I,triggerHandler:q};
};ace.ui.toc=function(B){var A=[];var C=[];var D=0;var E={};function K(l){var R=B.getRep();var b=B.getRoot();
var O=[];var p=R.apool.attribToNum[["bold","true"]];var c=domline.escapeHTML(document.location.href.split("#")[0]);
if(!E["toc-div"]){E["toc-div"]=[];}var Y=false;for(var U=0;U<b.childNodes.length;++U){if(E["toc-div"][U]!=b.childNodes[U].id){Y=true;
E["toc-div"][U]=b.childNodes[U].id;}}if(!Y&&!C.length){return;}if(Y){C=[];D=0;}if(C.length){O=C;}var m=D?D:1;
for(var T=m;T<R.alines.length;T++){if(T%10==0&&l()){C=O;D=T;return;}var n=R.alines[T];var Z=0;var h=Changeset.opIterator(n);
var j=false;while(h.hasNext()){var W=h.next();Changeset.eachAttribNumber(W.attribs,function(o){if(o==p){Z+=W.chars;
}if(Changeset.opAttributeValue(W,"table",R.apool)||Changeset.opAttributeValue(W,"embed",R.apool)||Changeset.opAttributeValue(W,"img",R.apool)){j=true;
}});}if(j){continue;}var S=R.lines.atIndex(T);var Q=S.lineNode;var N=S.text;var a=N.length;var X=B.getLineListType(T);
var d=Q.offsetTop;if(X.indexOf("hone")>-1){N=N.substr(S.lineMarker);if(N&&_trim(N).length){O.push([d,N,-1,c+B.locationFragmentForHeading(N),Q.id]);
}}else{if(Z>0&&(!X||X.indexOf("indent")>-1)&&a>0&&(Z>=(S.lineMarker?a-S.lineMarker:a))){var q=0;if(S.lineMarker){var V=X;
if(V){V=/([a-z]+)([12345678])/.exec(V);if(V){var r=V[1];var q=Number(V[2]);}}N=N.substr(S.lineMarker);
}if(N&&_trim(N).length){O.push([d,N,q,c+B.locationFragmentForHeading(N),Q.id]);if(Q.className.indexOf("toc-entry")==-1){Q.className+=" toc-entry";
}}}else{if(Q.className.indexOf("toc-entry")>-1){Q.className=Q.className.replace("toc-entry","");}}}}C=[];
D=0;function f(){A=O;J(O);H();}if(A.length!=O.length){f();return;}for(var P in O){if(O[P][0]!=A[P][0]||O[P][1]!=A[P][1]||O[P][2]!=A[P][2]||O[P][3]!=A[P][3]||O[P][4]!=A[P][4]){f();
return;}}}function L(){E={};}function H(){var O;var T=$(window).scrollTop();var R=$("body > header").outerHeight();
var S=50;var Q=B.getRootSelector();$(Q+" .list-hone1, "+Q+" .toc-entry").each(function(W,U){var V=B.findMagicDomNode(U);
if($(U).offset().top>T+R+S){return false;}O=V;});var P=$("#toc-div .toc-entry.current");P.removeClass("current");
if(O){$("#toc-div .toc-entry[data-node-id="+O.id+"]").addClass("current");var N=$("#toc-div .toc-entry.current");
if(N.length&&P[0]!=N[0]){$("#toc-div").scrollTop(N.offset().top-$("#toc-div").offset().top-N.outerHeight(true)+$("#toc-div").scrollTop());
}}}function G(){var O=$("#padsidebar");var N=$("#toc-div");if(!N.length){return;}N.css({"max-height":Math.max(250,$(window).height()-N.position().top-150)});
}function J(O){$("#toc-div .toc-entry").remove();var N=0;for(;N<O.length;N++){var P=O[N][2];var Q=padutils.escapeHtml(O[N][1]);
var S=$("<a href='"+O[N][3]+"'/>").attr({tooltip:Q,title:Q,offset:O[N][0]}).html(Q);var R=$("<li class='toc-entry level"+(P+1)+"' data-node-id='"+O[N][4]+"'/>").append(S);
if(P!=-1){R.css("margin-left",P+"em");}$("#toc-div ul").append(R);}if(O.length>9){$("#toc-div ul").addClass("more-than-nine");
}else{$("#toc-div ul").removeClass("more-than-nine");}$("#toc-div .sidebarheading").toggle(N>0);var T=$("#padsidebar [data-tooltip]").filter(function(){return $(this).width()>=160;
});padutils.tooltip(T);G();}$(".toc-entry a").live("click",function(O){var N=parseInt($(this).attr("offset"))+$("#padpage")[0].offsetTop-$("#padbar").outerHeight();
$("html, body").animate({scrollTop:N},100);document.location.href=$(this).attr("href");return false;});
if(!padutils.getIsMobile()){var I=$("#padsidebar");var M=$("#toc-div");var F=function(){if($("body").hasClass("embed")){return;
}var N=$("body > header").height();I.css({top:N+"px",left:$("#editor").offset().left+$("#editor").outerWidth(true)+10}).addClass("fixed");
G();};$(window).scroll(throttle(F,33));F();$(window).resize(throttle(F,33));$(window).resize(function(){G();
});}return{invalidateCache:L,updateCurrentTOC:H,updateTableOfContents:K};};ace.ui.lineAnnotator=function(A){var C=1;
var K=document.getElementById("sidediv");var B={};var F=0;var M=document.createElement("div");var D=A.getRoot();
K.innerHTML='<table border="0" cellpadding="0" cellspacing="0" align="right"><tr><td id="sidedivinner"><div>&nbsp;</div></td></tr></table>';
var E=document.getElementById("sidedivinner");function J(P,N,O,R){if(O<1){O=1;}if(O!=N){while(N<O){N++;
var Q=document.createElement("DIV");Q.style.top="0";if(R){Q.appendChild(R(N));}P.appendChild(Q);}while(O<N){P.removeChild(P.lastChild);
N--;}}return N;}function G(Q,S,T,N){N=N||0;if(A.getCurrentCallStack()&&A.getCurrentCallStack().domClean){var P=Q.childNodes[N];
var O=D.childNodes[N];var R=false;if(!B[Q.id]){B[Q.id]=[];}while(P&&O){if(R||B[Q.id][N]!=O.id){B[Q.id][N]=O.id;
R=true;if(S(P,O)){$(P).css("top",$(O).offset().top-$(D).offset().top+2+"px");}}P=P.nextSibling;O=O.nextSibling;
if(N++%10==0&&N!=1&&T()){return N;}}}return 0;}function H(P){var Q=A.getRep();C=J(E,C,Q.lines.length());
var N=0;var O=false;function R(S,U){if(U.childNodes[0]&&hasClass(U.childNodes[0],"list-code1")){if(O==false){if(!S.previousSibling||!S.previousSibling.innerHTML){N=0;
}else{N=parseInt(S.previousSibling.innerHTML,10)||1;}}N=N+1;O=true;if(N==1){var T=document.createElement("A");
var W=A.getLineAndCharForPoint({node:U,index:0,maxIndex:0});T.innerHTML=A.getLangForCodeLine(W[0])||"txt";
if(T.innerHTML=="coffee"){T.innerHTML="coff";}else{if(T.innerHTML=="cpp"){T.innerHTML="c++";}}addClass(T,"lang-menu");
if(S.innerHTML!=T.outerHTML+"<span></span>"){var V=document.createElement("SPAN");V.innerHTML="";S.innerHTML="";
S.appendChild(T);S.appendChild(V);$(T).on("click",function(X){X.preventDefault();L(X,W[0]);return false;
});}return true;}else{if(S.innerHTML!=String(N)){S.innerHTML=N;}return true;}}else{O=false;if(S.innerHTML!=""){S.innerHTML="";
return false;}}return false;}F=G(E,R,P,F);}function L(N,O){$("#hp-editor-lang .hp-ui-button-menu-wrapper a").off(".hp-lang").on("click.hp-lang",function(Q){var P=$(this).text().replace(/^\s+|\s+$/g,"");
P=P=="c++"?"cpp":P;A.inCallStackIfNecessary("set-language",function(){var R=O;while(A.getLineListType(R).indexOf("code")>-1){A.performDocumentApplyAttributesToRange([R,0],[R,1],[["lang",P]]);
R=R+1;}});return false;});showContextMenu(N,"lang-menu",$("#hp-editor-lang"));}function I(){B={};}return{invalidateCache:I,updateLineNumbers:H};
};ace.util={};ace.util.newTimeLimit=function(E){var C=now();var F=0;var A=false;var D=false;var B=function(){if(A){if((!D)){D=true;
}return true;}var G=now()-C;if(G>E){A=true;return true;}else{F=G;return false;}};B.elapsed=function(){return now()-C;
};return B;};ace.util.doAlert=function(B){var A=$(".hp-editor-alert-msg");if(!A.length){A=$("<div>").addClass("global-msg hp-editor-alert-msg").hide().appendTo($("body"));
}window.clearTimeout(A.data("fadeOutTimer"));A.fadeIn().text(B).data("fadeOutTimer",window.setTimeout(function(){A.fadeOut();
},3000));};ace.util.makeIdleAction=function(E){var A=null;var B=0;function D(){if(A){window.clearTimeout(A);
A=null;}}function C(H){D();B=H;var G=H-now();if(G<0){G=0;}A=window.setTimeout(F,G);}function F(){A=null;
E();}return{atMost:function(H){var G=now()+H;if((!A)||B>G){C(G);}},atLeast:function(H){var G=now()+H;
if((!A)||B<G){C(G);}},never:function(){D();}};};ace.util.isValidBrowserForSpellcheck=function(){var A=userAgentInfo();
if((A.browser=="Chrome"&&A.version>=29)||(A.browser=="Firefox"&&A.version>=20)||(A.browser=="Internet Explorer"&&A.version>=8)){return true;
}return false;};ace.util.cachedStrFunc=function(B){var A={};return function(C){if(!A[C]){A[C]=B(C);}return A[C];
};};ace.util.equalLineAndChars=function(B,A){if(!B){return !A;}if(!A){return !B;}return(B[0]==A[0]&&B[1]==A[1]);
};ace.ui.carets=function(B){var A=null;var C=B.getRoot();var G=32;function K(){return A;}function J(O){var L=false;
var M=B.getRep();if((!clientVars.demoMode&&clientVars.userId.indexOf("g.")==0)||$(".user-caret").length>10){return L;
}if(M.selStart){var N=M.selStart[0];if(A!=N||O){A=N;L=true;}}var P=$(".user-caret").length>0;if((P||clientVars.demoMode)&&(L||!$("#user-caret-"+clientVars.userId.replace(".","-")).is(":visible"))){E({changedBy:clientVars.userId,caret:A},true);
}return L;}function E(L,h){var T=B.getRep();var N=B.getAuthorInfos();if(!N[L.changedBy]||L.caret==null){return;
}if(L.changedBy.indexOf("g.")==0&&!clientVars.demoMode){return;}if(!h&&L.changedBy==clientVars.userId){return;
}if(L.caret>=T.lines.length()){return;}var X="#user-caret-"+L.changedBy.replace(".","-");var M=$(X);var U=false;
if(!M.length){var R="/static/img/nophoto.png";var V="";if(L.changedBy==clientVars.userId){R=clientVars.userPic||"/static/img/nophoto.png";
V=clientVars.userLink;}else{for(var P=0;P<clientVars.invitedUserInfos.length;++P){if(clientVars.invitedUserInfos[P].userId==L.changedBy){R=clientVars.invitedUserInfos[P].userPic||"/static/img/nophoto.png";
V=clientVars.invitedUserInfos[P].userLink;break;}}}var W=$("<img>").attr("src",R);var a=N[L.changedBy].name.split(" ")[0];
var Z=$("<span>").addClass("user-caret-lbl").addClass("initials-shown").text(a);var Q=N[L.changedBy].name.split(" ");
var Y=$("<span>").addClass("user-caret-initials").text((Q[0][0]||"")+(Q.length>=2?(Q[Q.length-1][0]||""):"")).css("opacity","0");
M=$("<span>").attr("id",X.substring(1)).addClass("user-caret").addClass(linestylefilter.getAuthorClassName(L.changedBy)).data("name",a).data("userId",L.changedBy).attr("title",N[L.changedBy].name).append(W).append(Z).append(Y).appendTo("#padeditor");
W.css("border-color",N[L.changedBy].bgcolor);Z.css("background-color",N[L.changedBy].bgcolor);Y.css("background-color",N[L.changedBy].bgcolor);
U=true;window.setTimeout(function(){M.fadeIn();},300);}var d=$(C).offset();var S=T.lines.atIndex(L.caret);
var l=I();var c=H();if(S){var O=$(S.lineNode).offset().top+$(S.lineNode).height()/2+(browser.phone?-9:-19);
var b=d.left-G;var f=O<l;var j=O>c;M.show().data("theoreticalCaretTop",O).data("realCaretTop",O);if(!f&&!j){M.show().offset({top:O,left:b});
}M.find("img").css("margin-right",0);M.find(".user-caret-lbl").css("width","120px");}F();if(U){M.hide();
}}function I(){var L=clientVars.isDesktopApp?40:7;return $(window).scrollTop()+(browser.mobile?5:$("body > header").height()+L);
}function H(){var N=$(C).offset();var M=44;var L=$("body").hasClass("hasBanner")?200:100;return $(window).scrollTop()+$(window).height()-(browser.mobile?0:M)+N.top-(browser.mobile?(browser.phone?30:148):(clientVars.isDesktopApp?10:L));
}function F(){var O=$(C).offset();var N=I();var M=H();$.each($(".user-caret"),function(V,U){var P=$(U);
var Q=P.data("theoreticalCaretTop");var S=O.left-G;if(Q==undefined){return;}var R=Q<N;var T=Q>M;P.off(".user-caret");
if(P.data("userId")==clientVars.userId||!R){P.removeClass("user-caret-offscreen-top");}if(P.data("userId")==clientVars.userId||!T){P.removeClass("user-caret-offscreen-bottom");
}if(R||T){Q=R?N:M;P.data("realCaretTop",Q).show().addClass(R?"user-caret-offscreen-top":"user-caret-offscreen-bottom").addClass("user-caret-transition-off").offset({top:Q,left:S});
P.on("click.user-caret",function(){$(window).scrollTop(Math.max(0,P.data("theoreticalCaretTop")-O.top-75));
});}else{P.data("realCaretTop",P.data("theoreticalCaretTop")).show().offset({top:P.data("theoreticalCaretTop"),left:S});
window.setTimeout(function(){P.removeClass("user-caret-transition-off");},0);}});var L={};$.each($(".user-caret"),function(R,Q){Q=$(Q);
var P=Q.data("realCaretTop");if(P==undefined){return;}if(!L[P]){L[P]=[];}L[P].push(Q);});$.each(L,function(T,P){if(P.length>1){var S=browser.mobile?10:24;
var R=-1*S;for(var Q=0;Q<P.length;++Q){R+=S;P[Q].find("img").css("margin-right",R+"px");P[Q].find(".user-caret-initials").css("margin-right",R+"px").css("opacity","1");
}for(var Q=0;Q<P.length;++Q){P[Q].find(".user-caret-lbl").css("width",Math.max(0,120-R)+"px").addClass("initials-shown");
}}else{if(P.length==1){P[0].find("img").css("margin-right",0);P[0].find(".user-caret-lbl").css("width","120px");
P[0].find(".user-caret-lbl").removeClass("initials-shown");P[0].find(".user-caret-initials").css("margin-right",0).css("opacity","0");
}}});}function D(N){var M="#user-caret-"+N.userId.replace(".","-");var L=$(M);if(L.length){window.clearInterval(L.data("cursorEffect"));
L.fadeOut(undefined,function(){L.remove();if($(".user-caret").length==1&&$(".user-caret")[0].id=="user-caret-"+clientVars.userId.replace(".","-")&&!clientVars.demoMode){D({userId:clientVars.userId});
}});}}return{getCurrentCaretPosition:K,onCaretUpdate:J,removeUserCaret:D,updateAllCarets:F,updateUserCaret:E};
};ace.keystrokes=function(A){var J="    ";var E=false;var C=A.getObserver();var H=false;var G=[];var I=[{listType:"comment",text:"//",allowed:function(){return !A.isMonospace();
}},{text:"[]",listType:"task"},{text:"[ ]",listType:"task"},{text:"- ",listType:"bullet",allowed:function(){return !A.isMonospace();
}},{text:"# ",listType:"hone",allowed:function(){return !A.isMonospace();}},{text:"## ",listType:"htwo",allowed:function(){return !A.isMonospace();
}},{text:"### ",listType:"hthree",allowed:function(){return !A.isMonospace();}},{text:"* ",listType:"bullet",allowed:function(){return !A.isMonospace();
}},{charRegexp:[/\d/,/\./,/ /],regexp:/^\d\. /,listType:"number"},{charRegexp:[/\d/,/\d/,/\./,/ /],regexp:/^\d\d\. /,listType:"number"},{text:"    ",listType:"code",allowed:function(){return !A.isMonospace();
}}];var D={searchSet:I,nextCharIndex:0};function N(S){if(!A.getIsEditable()){return;}var Q=S.type;var U=S.charCode;
var R=S.keyCode;var T=S.which;var W=false;if(S.which==0&&browser.android){var V=A.getSelection();if(V&&V.startPoint&&V.startPoint.index>0){W=true;
var Z=V.startPoint.node.nodeValue[V.startPoint.index-1];T=U=R=Z.charCodeAt(0);if(T==160){T=32;}else{if(T==46){T=190;
}}}if(Q=="keyup"){G.push(T);}if(S.type!="keyup"&&String.fromCharCode(U)!="@"){return;}}else{if(Q=="keypress"){G.push(U);
}}if(Q=="keyup"&&H){setClassPresence(A.getRoot(),"authorColors",true);H=false;}var X=((!U)&&((Q=="keyup")||(Q=="keydown"))&&(R==16||R==17||R==18||R==20||R==224||R==91));
if(X){return;}var Y=((browser.msie||browser.safari)?(Q=="keydown"):(Q=="keypress"));var a=((browser.msie||browser.safari)?(Q=="keydown"):(Q=="keypress"));
A.inCallStack("handleKeyEvent",function(){var b=false;if(Q=="keypress"||(Y&&R==13)){C.trigger("keypress");
}b=O(S,Q,U,R,T,W);if(!b){b=M(S,Q,U,R,T,W);}if(Q=="keydown"){A.getIdleWorkTimer().atLeast(500);}else{if(Q=="keypress"){A.getIdleWorkTimer().atLeast(500);
}else{if(Q=="keyup"){var c=200;A.getIdleWorkTimer().atLeast(c);A.getIdleWorkTimer().atMost(c);}}}var f=(browser.mozilla&&S.altKey&&U==0&&R==0);
var d=(browser.safari&&S.altKey&&R==229);if(E||f||d){A.getIdleWorkTimer().atLeast(3000);E=true;}if((!b)&&(!E)&&(!A.getInInternationalComposition())){if(Q!="keyup"||!A.incorpIfQuick()){A.observeChangesAroundSelection();
}}if(Q=="keyup"){E=false;G.shift();}});}function O(R,S,s,Z,a,q){var Q=A.getRep();var h=((browser.msie||browser.safari)?(S=="keydown"):(S=="keypress"));
var X=((browser.msie||browser.safari)?(S=="keydown"):(S=="keypress"));var T=String.fromCharCode(a).toLowerCase();
if(X&&(R.metaKey||R.ctrlKey||R.altKey)){C.trigger("track",["keyboard-shortcuts-new",null,null,{ch:T,shiftKey:R.shiftKey,altKey:R.altKey,metaKey:R.metaKey,ctrlKey:R.ctrlKey}]);
}var l=null;function f(){if(l==null&&A.isCaret()){var x=A.getLineListType(A.caretLine());l=A.isMonospace()||x.indexOf("code")==0;
}return l;}var U=A.findAutolinkStartPosition();if(U&&S==(browser.mozilla?"keypress":"keydown")){var b={9:"enter",13:"enter",27:"cancel",38:"up",40:"down"}[Z];
if(b){var W=A.isValidLinkStart(U)?A.linkWord(U):A.caretWord();var w=A.caretWordPopupPosition();var v=A.autocompleteCallback(W.word,b,W.start,W.end,w);
if(v){A.fastIncorp();R.preventDefault();return true;}else{if(b=="cancel"){A.fastIncorp();A.clearAutolink(U);
return true;}}}}if(S==(browser.mozilla?"keypress":"keydown")&&R.altKey){var b={38:"up",40:"down"}[Z];
if(b){var V=Changeset.builder(Q.lines.totalWidth());var Y=((Q.selStart[0]!=Q.selEnd[0])&&(Q.selEnd[1]==0))?Q.selEnd[0]-1:Q.selEnd[0];
var j=false;if(b=="up"&&Q.selStart[0]>0&&Y<Q.lines.length()-1){V.keep(Q.lines.offsetOfIndex(Q.selStart[0]-1),Q.selStart[0]-1);
V.remove(Q.lines.atIndex(Q.selStart[0]-1).text.length+1,1);for(var c=Q.selStart[0];c<=Y;c++){V.keep(Q.lines.atIndex(c).text.length+1,1);
}V.insertAText({text:Q.lines.atIndex(Q.selStart[0]-1).text,attribs:Q.alines[Q.selStart[0]-1]});V.insert("\n",[[]],Q.apool);
j=true;}else{if(b=="down"&&Y<Q.lines.length()-2){V.keep(Q.lines.offsetOfIndex(Q.selStart[0]),Q.selStart[0]);
V.insertAText({text:Q.lines.atIndex(Y+1).text,attribs:Q.alines[Y+1]});V.insert("\n",[[]],Q.apool);for(var c=Q.selStart[0];
c<=Y;c++){V.keep(Q.lines.atIndex(c).text.length+1,1);}V.remove(Q.lines.atIndex(Y+1).text.length+1,1);
j=true;}}if(j){A.fastIncorp();Q=A.getRep();var m=V.toString();if(!Changeset.isIdentity(m)){A.performDocumentApplyChangeset(m);
}A.performSelectionChange([Q.selStart[0],Q.selStart[1]],[Q.selEnd[0],Q.selEnd[1]],Q.selFocusAtStart);
R.preventDefault();return true;}}}if(T=="@"&&(S=="keydown"||S=="keypress")&&(!f())){var p=A.caretDocChar()-1;
var o=Q.alltext.charAt(p);if(/\s/.test(o)){A.fastIncorp();Q=A.getRep();C.trigger("track",["at-linking"]);
R.preventDefault();A.performDocumentReplaceRange(q?[Q.selStart[0],Q.selStart[1]-1]:Q.selStart,Q.selEnd,"@",[["autolink","true"]]);
return true;}}if(T=="#"&&String.fromCharCode(s).toLowerCase()=="#"&&(S=="keydown"||S=="keypress")&&(!f())){A.fastIncorp();
Q=A.getRep();C.trigger("track",["hashtag"]);R.preventDefault();A.performDocumentReplaceRange(Q.selStart,Q.selEnd,"#",[["autolink","true"]]);
return true;}if(!U&&T==":"&&(S=="keydown"||S=="keypress")&&(!f())){var p=A.caretDocChar()-1;var o=Q.alltext.charAt(p);
if(/\s/.test(o)){A.fastIncorp();Q=A.getRep();C.trigger("track",["emoji"]);R.preventDefault();A.performDocumentReplaceRange(Q.selStart,Q.selEnd,":",[["autolink","true"]]);
return true;}}if((U||A.isWordChar(T))&&(S=="keypress"||((S=="keyup"||S=="keydown")&&(a==8||a==37||a==39)))&&(!f())){A.fastIncorp();
var W;if(A.isCaret()){if(A.isValidLinkStart(U)){W=A.linkWord(U);}else{W=A.caretWord();}var d=W.word;if(S=="keypress"){d+=String.fromCharCode(a);
}var n=A.shouldTriggerLink(d,W.start);if(!U&&n&&d[0]!=":"){C.trigger("track",["atless-linking"]);A.setAutolink(W.start,d);
A.getCurrentCallStack().isTriggeringAutocomplete=true;return true;}else{if(U){if(!n||U[0]!=W.start[0]||U[1]!=W.start[1]){A.clearAutolink(U);
A.autocompleteCallback(null);return true;}}}}}if(h&&Z==8){var t=(A.isCaret()&&Q.selStart[1]==Q.lines.atIndex(Q.selStart[0]).lineMarker);
if(t){A.fastIncorp();R.preventDefault();F(R);return true;}}if(h&&Z==13){A.fastIncorp();R.preventDefault();
L(R);window.setTimeout(function(){window.scrollBy(-100,0);},0);return true;}if(X&&T=="e"&&B(R)){A.fastIncorp();
R.preventDefault();A.toggleAttributeOnSelection("highlight");return true;}if(h&&Z==9&&!B(R)){A.fastIncorp();
R.preventDefault();P(R.shiftKey);return true;}if(S=="keydown"&&(T=="c"||T=="x")&&B(R)){setClassPresence(A.getRoot(),"authorColors",false);
H=true;}if(X&&T=="z"&&B(R)){A.fastIncorp();R.preventDefault();if(R.shiftKey){A.doUndoRedo("redo");}else{A.doUndoRedo("undo");
}return true;}if(X&&T=="y"&&B(R)){A.fastIncorp();R.preventDefault();A.doUndoRedo("redo");return true;
}if(X&&_contains(["b","i","u"],T)&&B(R)){var u={b:{command:"bold"},i:{command:"italic"},u:{command:"underline"}};
var r=u[T].command;A.fastIncorp();R.preventDefault();A.toggleAttributeOnSelection(r);return true;}if(X&&(a==220||T=="\\")&&B(R)){A.fastIncorp();
R.preventDefault();A.doInsertTaskList();return true;}if(X&&Z==187&&B(R)&&!A.isCaret()){A.fastIncorp();
Q=A.getRep();R.preventDefault();A.performDocumentApplyAttributesToRange(Q.selStart,Q.selEnd,[[R.shiftKey?"subscript":"superscript",""]]);
A.toggleAttributeOnSelection(R.shiftKey?"superscript":"subscript");return true;}if(X&&T=="h"&&B(R)){A.fastIncorp();
R.preventDefault();F();return true;}if(X&&T=="s"&&B(R)){R.preventDefault();ace.util.doAlert("No worries! Hackpad auto-saves your work. ^_^");
return true;}return false;}function M(h,f,m,o,p,l){var c=false;if(f!="keyup"){return;}var T=A.getRep();
var a=false;var X=D.nextCharIndex;var R=D.searchSet;D.searchSet=[];var V=G[0];for(var Q=0;Q<R.length;
Q++){if(!R[Q]||("allowed" in R[Q]&&!R[Q].allowed())||!V){continue;}var n=T.selStart[1];var S=T.selStart[0];
var Y=T.lines.atIndex(S);var Z=Y.lineMarker;function q(r,s){if(typeof(r)=="number"){return r==s;}else{return(r[0]<=s)&&(r[1]>=s);
}}if((R[Q].text&&R[Q].text.charCodeAt(X)==V)||(R[Q].charRegexp&&String.fromCharCode(V).match(R[Q].charRegexp[X]))){var U=R[Q].text?R[Q].text.length:R[Q].charRegexp.length;
if(U==X+1){A.fastIncorp();T=A.getRep();Y=T.lines.atIndex(S);function j(r,t){var s;if(r.text){var u=r.text.length;
s=t.text.substr(t.lineMarker,u);return s==r.text?s:null;}else{if(r.regexp){s=t.text;return s.match(r.regexp)?s.match(r.regexp)[0]:null;
}}}var b=j(R[Q],Y);if(b){h.preventDefault();c=true;var W=A.getLineListType(S);if(W.indexOf("code")>-1){}else{var d=1;
if(W){d=Number(/([a-z]+)([12345678])/.exec(W)[2])+1;}if(R[Q].listType=="htwo"){A.performDocumentReplaceRange([S,0],[S,U+Z]," ");
A.performSelectionChange(A.markerfulLineAndChar(S,0),A.markerfulLineAndChar(S,1),true);A.setAttributeOnLine(S,"bold",true);
}else{if(R[Q].listType=="table"){A.performDocumentReplaceRange([S,0],[S,U+Z],"*",[["table","123"]]);A.performSelectionChange(A.markerfulLineAndChar(S+1,0),A.markerfulLineAndChar(S+1,0),true);
}else{A.performDocumentReplaceRange([S,0],[S,U+Z],"");A.setLineListType(S,R[Q].listType+d);}}}}a=true;
C.trigger("track",["keyboard-macros-newest",null,null,{macro:b}]);}else{D.searchSet.push(R[Q]);}}}if(!a&&D.searchSet.length){D.nextCharIndex++;
}else{D.searchSet=I;D.nextCharIndex=0;}return c;}function B(Q){if(navigator.platform.match(/(ipod touch)|(ipad)|(iphone)|(mac)/i)){return Q.metaKey&&!Q.altKey;
}return Q.ctrlKey&&!Q.altKey;}function K(){var Q=A.getRep();if(A.isCaret()&&A.caretLine()>0){var R=A.caretLine();
var U=Q.lines.atIndex(R);var S=Q.lines.prev(U);if(A.caretColumn()==S.lineMarker){var W=S.text.substr(S.lineMarker);
var T=/^ *(?:)/.exec(W)[0];var V=Changeset.builder(Q.lines.totalWidth()).keep(Q.lines.offsetOfIndex(R),R).keep(S.lineMarker,0).insert(T,[["author",A.getThisAuthor()]],Q.apool).toString();
A.performDocumentApplyChangeset(V);A.performSelectionChange([R,T.length+U.lineMarker],[R,T.length+U.lineMarker]);
}}}function L(b){var S=A.getRep();if(!(S.selStart&&S.selEnd)){return;}function a(d){return d.indexOf("hone")>-1||d.indexOf("htwo")>-1||d.indexOf("hthree")>-1;
}var Q=S.selStart[0];var R=A.getLineListType(Q);if(R&&!a(R)){if(Q+1<S.lines.length()){var X=R.indexOf("code")==0;
var T=(Q>0&&S.lines.atIndex(Q));var V=(Q-1>0&&S.lines.atIndex(Q-1));var Z=(V&&V.text.length==V.lineMarker);
var Y=(T&&T.text.length==T.lineMarker);var c=(T&&A.isCaret()&&(S.selStart[1]==T.lineMarker));if(b.shiftKey){A.performDocumentReplaceSelection("\n");
var U=R.match(/[2-9]$/);U=U?Number(U[0]):null;A.setLineListType(Q+1,U?"indent"+U:null);}else{if(X?Z&&Y:Y){if(R.indexOf("indent")==0){F();
}else{A.doIndentOutdent(true,true);}}else{if(c){A.performDocumentReplaceSelection("\n");R=R.replace("taskdone","task");
A.setLineListType(Q,R);}else{A.performDocumentReplaceSelection("\n");R=R.replace("taskdone","task");A.setLineListType(Q+1,R);
}}}}if(X){var W=A.getLangForCodeLine(Q);if(W){A.performDocumentApplyAttributesToRange([Q+1,0],[Q+1,1],[["lang",W]]);
}K();}}else{A.performDocumentReplaceSelection("\n");K();}}function P(Q){var R=A.getRep();var T=R.lines.atIndex(A.caretLine()).text;
var S=A.getLineListType(A.caretLine()).indexOf("code")==0;if((!Q&&(A.isMonospace()||S))||(!A.doIndentOutdent(Q)&&!Q)){A.performDocumentReplaceSelection(J,true);
}}function F(m){var R=A.getRep();var Y=m||{};var a=false;if(R.selStart){if(A.isCaret()){var Z=A.caretLine();
var V=A.caretColumn();var W=R.lines.atIndex(Z);var h=W.text;var c=W.lineMarker;if(/^ +$/.exec(h.substring(c,V))){var l=V-c;
var j=J.length;var f=((l-1)%j)+1;A.performDocumentReplaceRange([Z,V-f],[Z,V],"");a=true;}}if(!a){if(A.isCaret()){var Q=A.caretLine();
var W=R.lines.atIndex(Q);if(A.caretColumn()<=W.lineMarker){var n="delete_newline";var o=(Q>0?A.getLineListType(Q-1):"");
var d=A.getLineListType(Q);var b=(Q>0&&R.lines.atIndex(Q-1));if(d){var S=d.match(/[2-9]$/);S=S?Number(S[0])-1:null;
A.setLineListType(Q,S?"indent"+S:null);}else{if(Q>0){if(b.text=="*"&&A.getLineHasMagicObject(Q-1)){A.performDocumentReplaceRange([Q-1,0],[Q,0],"");
}else{A.performDocumentReplaceRange([Q-1,b.text.length],[Q,0],"");}}}}else{var T=A.caretDocChar();if(T>0){if(Y.metaKey||Y.ctrlKey||Y.altKey){var U=T-1;
while(U>W.lineMarker&&A.isWordChar(R.alltext.charAt(U-1))){U--;}A.performDocumentReplaceCharRange(U,T,"");
}else{A.performDocumentReplaceCharRange(T-1,T,"");}}}}else{A.performDocumentReplaceSelection("");}}}var X=A.caretLine();
if(X!=-1&&A.renumberList(X+1)==null){A.renumberList(X);}}C.on("return-key",function(Q){L({});});C.on("delete-key",function(Q){F({});
});return{onKeyEvent:N};};ace.mouse=function(A){var C=[];var I=null;var L=null;var K=A.getRoot();var E=false;
var D=false;var G;var F;var H;function a(h,j){C.push(h,j);setTimeout(b,300);}function b(){C.splice(0,2);
}function V(h){D=false;G=h.originalEvent.touches[0].clientX;F=h.originalEvent.touches[0].clientY;}function Z(h){if(Math.abs(h.originalEvent.touches[0].clientX-G)<10&&Math.abs(h.originalEvent.touches[0].clientY-F)<10){return;
}D=true;}function c(h){for(var j=0;j<C.length;j+=2){var l=C[j];var m=C[j+1];if(Math.abs(h.clientX-l)>25||Math.abs(h.clientY-m)>25){continue;
}h.stopPropagation();h.preventDefault();return;}}function P(h){A.inCallStack("handleClick",function(){A.getIdleWorkTimer().atMost(200);
});var j=h.type=="touchend";if(j){if(D){h.preventDefault();return false;}a(G,F);}else{if(h.ctrlKey||h.button>1){return false;
}}if(j){window.focus();}return true;}function J(h){if(!h||h.nodeName!="SPAN"){return false;}return getClassArray(h,function(j){return j.match("^author-");
}).length;}function U(j){var l=[];for(var h=0;h<j.childNodes.length;h++){if(j.childNodes[h].nodeType===1){l.push(j.childNodes[h]);
}}return l;}function T(h,j){while(h&&h!=j){h=h.parentNode;}if(h==j){return true;}return false;}var B={};
function Y(){if(B.tooltip){return;}B.tooltip=document.createElement("DIV");B.tooltip.innerHTML='<div></div><div class="body"></div><div class="url"></div>';
B.tooltip.id="tooltip";A.getRoot().parentNode.appendChild(B.tooltip);}function f(q){var h=q.target;while(h&&!J(h)&&h!=m){h=h.parentNode;
}if(!J(h)||B.target==h){return;}if(getStyle(h,"border-bottom-width")=="0px"){return;}Y();var j=A.getAuthorInfos();
var m=A.getRoot();var p=getClassArray(h,function(r){return r.match("^author-");});var l=map(p,linestylefilter.className2Author);
var o=j[l[0]].name;B.target=h;var n=$(m).offset();U(B.tooltip)[0].innerHTML=domline.escapeHTML(o);B.tooltip.style.display="block";
B.tooltip.style.left=String($(h).offset().left+$(h).outerWidth()/2-n.left-$("#tooltip").outerWidth()/2)+"px";
B.tooltip.style.right="auto";B.tooltip.style.backgroundColor=j[l[0]].bgcolor;A.getDynamicCSS().selectorStyle("#padbody #tooltip:before").borderBottomColor=j[l[0]].bgcolor;
B.tooltip.style.top=String($(h).offset().top+$(h).outerHeight()-n.top+10)+"px";B.tooltip.style.position="absolute";
}function M(h){if(B.tooltip){if(!h.relatedTarget||!T(h.relatedTarget,B.target)){B.target=null;A.getDynamicCSS().selectorStyle("#padbody #tooltip:before").borderBottomColor="rgba(59, 58, 60, 0.95)";
B.tooltip.style.display="none";}}}function X(h){if((h.target.tagName||"").toLowerCase()!="html"){return;
}var j=A.getRoot();if(!(h.pageY>j.clientHeight)){return;}A.inCallStack("handleOuterClick",function(){A.fastIncorp();
var n=A.getRep();if(A.isCaret()){var l=n.lines.length()-1;var m=n.lines.atIndex(l).text.length;A.performSelectionChange([l,m],[l,m]);
}});}function S(j){var w=A.getRoot();var s=A.getLastAutolinkPosition();if(s){var v=A.findAutolinkStartPosition(s[0]);
if(v){A.inCallStack("removeAutolink",function(){A.fastIncorp();A.clearAutolink(v);A.setLastAutolinkPosition(null);
});}}function u(AC){return(AC.tagName||"").toLowerCase()=="div"&&AC.className.indexOf("ace-line")>-1;
}h=j.target;while(h&&h.parentNode&&!u(h)){if(h.tagName.toLowerCase()!="div"){h=h.parentNode;}else{break;
}}if(h&&(j.clientX<$(w).offset().left)&&u(h)&&!browser.mobile&&!clientVars.isDesktopApp){if(h.getAttribute("data-author-link")){window.open(h.getAttribute("data-author-link"),"_blank");
}j.preventDefault();return false;}function t(AC){return(AC.tagName||"").toLowerCase()=="a"&&AC.href;}var h=j.target;
while(h&&h.parentNode&&!t(h)){h=h.parentNode;}if(h&&t(h)){try{var x=!j.metaKey&&hasClass(h.parentNode,"internal");
var AA=A.getObserver().triggerHandler("open-link",[h.href,x]);if(AA===undefined){if(browser.mobile||x){window.top.location=h.href;
}else{var l=window.open("","_blank");if(l){l.opener=null;l.location=h.href;l.focus();}}}}catch(z){}j.preventDefault();
j.stopPropagation();return;}function y(AC){return(AC.tagName||"").toLowerCase()=="ul"&&AC.className.indexOf("list-task")>-1;
}h=j.target;while(h&&h.parentNode&&!y(h)){if(h.tagName.toLowerCase()=="li"){h=h.parentNode;}else{break;
}}var m=j.clientX||(j.originalEvent.changedTouches[0].pageX-j.target.offsetLeft);m-=$(w).offset().left;
var AB=10;if(h&&(j.offsetX<0||m<(h.offsetLeft-AB))&&y(h)){if(h.className.indexOf("list-taskdone")>-1){h.className=h.className.replace("list-taskdone","list-task").replace("listtype-taskdone","listtype-task");
}else{if(h.className.indexOf("list-task")>-1){h.className=h.className.replace("list-task","list-taskdone").replace("listtype-task","listtype-taskdone");
}}j.preventDefault();j.stopPropagation();return;}function p(AC){return(AC.tagName||"").toLowerCase()=="ul"&&AC.className.indexOf("list-h")>-1;
}h=j.target;while(h&&h.parentNode&&!p(h)){if(h.tagName.toLowerCase()=="li"){h=h.parentNode;}else{break;
}}var o=clientVars.isDesktopApp?30:0;if(h&&(j.offsetX<0||m-20-o<h.offsetLeft)&&p(h)&&!browser.mobile){A.showHeadingsMenu(j);
j.preventDefault();return;}function r(AC){return(AC.tagName||"").toLowerCase()=="div"&&AC.className.indexOf("toc-entry")>-1;
}h=j.target;while(h&&h.parentNode&&!r(h)){if(h.tagName.toLowerCase()!="div"){h=h.parentNode;}else{break;
}}if(h&&(j.offsetX<57+o||m<57+o)&&r(h)&&!browser.mobile){A.showHeadingsMenu(j);j.preventDefault();return false;
}function q(AC){return(AC.tagName||"").toLowerCase()=="span"&&AC.className.indexOf("inline-tex")>-1;}h=j.target;
while(h&&h.parentNode&&!q(h)){h=h.parentNode;}if(h&&q(h)){h.parentNode.className=h.parentNode.className.replace("tex","");
h.parentNode.innerHTML=h.getAttribute("tex").replace(/\$\$$/,"$");}}function N(h){if(h.type=="compositionstart"){A.setInInternationalComposition(true);
}else{if(h.type=="compositionend"){A.setInInternationalComposition(false);}}}function R(){A.setIsScrolling(true);
window.clearTimeout(H);H=window.setTimeout(function(){A.getObserver().trigger("scroll-finished");A.setIsScrolling(false);
},100);}function Q(h){A.restoreSelection();$("body").addClass("ace-focused");$("body").addClass("edit-mode");
if(!browser.msie){O();}if(clientVars.demoMode){A.getObserver().trigger("track",["demofocus"]);}}function W(h){setTimeout(function(){$("body").removeClass("ace-focused");
},33);if(!browser.msie){d();}if(browser.msie){A.setSelection(null);}}function d(){clearTimeout(L);I=setTimeout(function(){E=document.hidden||document.mozHidden||document.msHidden||document.webkitHidden;
if(!E){setClassPresence(K,"authorColors",false);}},100);}function O(){clearTimeout(I);L=setTimeout(function(){if(!E){setClassPresence(K,"authorColors",true);
}},100);}return{captureClick:c,handleIEOuterClick:X,handleMouseOut:M,handleMouseOver:f,handleTouchMove:Z,handleTouchStart:V,onBlur:W,onClickMisc:S,onCompositionEvent:N,onFocus:Q,onScroll:R,processClick:P};
};ace.media=function(A){var C=A.getObserver();var B=null;function K(Q,R){imgshrink.maybeShrinkImage(Q,function(W){var V=clientVars.s3PolicyAndSig;
var a=JSON.parse(atob(V.s3Policy));var Y=a.conditions;var T={};Y.forEach(function(b){if(!(b instanceof Array)){var c=Object.getOwnPropertyNames(b)[0];
T[c]=b[c];}});var Z=T.bucket;var X="https://"+Z+"."+clientVars.s3BucketRoot+"/";var U=location.hostname+"_"+pad.getPadId()+"_"+clientVars.userId+"_"+(+new Date())+"_"+Q.name;
var S=new FormData();S.append("key",U);S.append("acl",T.acl);S.append("Content-Type",W.type);S.append("X-Amz-Credential",T["x-amz-credential"]);
S.append("X-Amz-Algorithm",T["x-amz-algorithm"]);S.append("X-Amz-Date",T["x-amz-date"]);S.append("Policy",V.s3Policy);
S.append("X-Amz-Signature",V.s3PolicySig);S.append("file",W);$.ajax({xhr:function(){var b=new window.XMLHttpRequest();
b.upload.addEventListener("progress",function(c){if(c.lengthComputable){var d=c.loaded/c.total;A.callWithAce(function(f){I(R,d);
});}},false);return b;},url:X,data:S,processData:false,contentType:false,type:"POST",success:function(){setTimeout(function(){A.callWithAce(function(b){F(R,X+U,U);
});C.trigger("track",["file-attach",null,null,{success:true,padId:clientVars.padId,userId:clientVars.userId,type:Q.type,path:U,size:Q.size,uploadSize:W.size}]);
},500);}}).error(function(){A.callWithAce(function(b){F(R);});C.trigger("track",["file-attach",null,null,{success:false,padId:clientVars.padId,userId:clientVars.userId,type:Q.type,path:U,size:Q.size}]);
});});}function D(Q){while(Q){Q=Q.childNodes[0];if(Q&&Q.tagName=="IMG"){return Q;}}return null;}function E(R){var Q="attachment-"+(+new Date());
A.inCallStackIfNecessary("dropImageData",function(){var T=A.getRep();var V=T.selStart;var U=T.selEnd;
if(!T.selStart||!T.selEnd||V[0]==0||U[0]==0){V=U=[1,0];}A.performDocumentReplaceRange(V,U,"*",[["img","/static/img/pixel.gif"],["attachmentPlaceholder",Q]]);
});var S=C.triggerHandler("attach",[R,Q]);if(S===undefined){K(R,Q);}}function G(W){if(browser.phone){return;
}$(".lightbox-container").remove();var Q=$("<div>").addClass("lightbox-container");$("body").append(Q);
var T=$('<button class="hp-ui-button dialog-cancel-x"><span class="hp-ui-button-content icon-x"></span></button>');
T.on("click",S);function S(){$(".lightbox-container").remove();$(document).off("keydown",U);}function R(Z){if(Z){$("#lightbox-prev img").addClass("arrow-clicked");
}else{$("#lightbox-next img").addClass("arrow-clicked");}$(".lightbox-container img").bind("animationEnd oAnimationEnd mozAnimationEnd webkitAnimationEnd",function(){$(".lightbox-container img").removeClass("arrow-clicked");
});var Y=J(Z);if(Y){$("#lightbox-img").hide(0);$("#lightbox-img").attr("src",Y);return false;}return true;
}function U(a){var Z=a.keyCode||a.which;var Y={left:37,up:38,right:39,down:40};if(Z==Y.left||Z==Y.up){R(true);
}else{if(Z==Y.down||Z==Y.right){R();}}if(a.keyCode==27){S();}return false;}$(document).keydown(U);var V=$("<div>").addClass("lightbox-inner").addClass("center-content").append($("<img id='lightbox-img'>").click(function(){return R(false);
}).attr("src",W)).append(T);var X=$("<div>").addClass("center-wrap").append(V);Q.append(X);Q.append($("<button id='lightbox-next'><img src='/static/img/lightbox-right.png'/></button>").click(function(){return R(false);
}));Q.append($("<button id='lightbox-prev'><img src='/static/img/lightbox-left.png'/></button>").click(function(){return R(true);
}));Q.css("z-index",1000).click(S);$("#lightbox-img").bind("load",function(){$(this).stop(true,true).fadeIn();
});}function J(S){var Q=B;while(Q&&!(Q.tagName&&Q.tagName.toLowerCase()=="span"&&(hasClass(Q,"attrimg")||hasClass(Q,"attrembed")))){Q=Q.parentNode;
}do{Q=(S?Q.previousSibling:Q.nextSibling);}while(Q&&!(Q.tagName&&Q.tagName.toLowerCase()=="span"&&hasClass(Q,"attrimg")));
if(Q){B=D(Q);return B.src;}else{Q=B;}while(Q&&!(Q.tagName&&Q.tagName.toLowerCase()=="div"&&hasClass(Q,"ace-line"))){Q=Q.parentNode;
}if(!Q){return null;}var R=S?Q.previousSibling:Q.nextSibling;while(R){if(D(R)){B=D(R);return B.src;}R=S?R.previousSibling:R.nextSibling;
}}function O(Q){return;if(Q.target.nodeName.toLowerCase()=="img"){if($(Q.target).attr("contenteditable")=="false"){$(Q.target).attr("contenteditable",true);
}if($(Q.target).parent().attr("contenteditable")=="false"){$(Q.target).parent().attr("contenteditable",true);
}}}function M(Q){return;setTimeout(function(){if(Q.target.nodeName.toLowerCase()=="img"){if($(Q.target).attr("contenteditable")=="true"){$(Q.target).attr("contenteditable",false);
}if($(Q.target).parent().attr("contenteditable")=="true"){$(Q.target).parent().attr("contenteditable",false);
}}},0);}function N(Q){if(Q.target.className=="inline-img"){B=Q.target;G(Q.target.src);return;}if(Q.target.className=="remove-media"){var S={node:Q.target,index:0,maxIndex:0};
var R=A.getLineAndCharForPoint(S);A.inCallStack("removeMedia",function(){A.performDocumentReplaceRange([R[0],R[1]-1],[R[0],R[1]],"");
});}}function L(Q){if(Q&&Q.dataTransfer&&Q.dataTransfer.items&&Q.dataTransfer.items.length&&Q.dataTransfer.items[0].kind=="file"){Q.preventDefault();
}}function H(Q){if(!Q.dataTransfer){return;}if(!Q.dataTransfer.files.length){return;}Q.preventDefault();
Q.stopPropagation();var T=false;for(var R=0;R<Q.dataTransfer.files.length;R++){var S=Q.dataTransfer.files[R];
if(S.type.indexOf("image/")==0){E(S);T=true;}}if(!T){alert("Sorry, only image attachments are supported!");
}}function P(T){var S=T.originalEvent.clipboardData;if(!S){return;}if(S.getData){var X=false;var Y=null;
if(/text\/plain/.test(S.types)){Y=S.getData("text/plain");}if(Y){var b=Y.split(/[\r|\n]+/);var R=[];for(var Q=0;
Q<b.length;Q++){var W=b[Q].split("\t");if(W.length>1&&(R.length==0||R[0].length==W.length)){R.push(W);
}else{X=false;break;}if(R[Q][0]!=""){X=true;}}if(X){T.stopPropagation();T.preventDefault();var a=[["table",true]];
for(var Q=0;Q<R.length;Q++){for(var U=0;U<R[Q].length;U++){a.push([Q+":"+U,R[Q][U]]);}}A.inCallStackIfNecessary("insertPastedTable",function(){var c=A.getRep();
if(c.selStart[1]!=0||c.selStart[0]==0){A.performDocumentReplaceRange(c.selStart,c.selEnd,"\n",[]);}A.performDocumentReplaceRange(c.selStart,c.selEnd,"*",a);
if(c.selEnd[1]!=0){A.performDocumentReplaceRange(c.selStart,c.selEnd,"\n",[]);}});}return;}}var V=S.items||[];
for(var Q=0;Q<V.length;Q++){if(V[Q].kind=="file"&&V[Q].type.indexOf("image/")==0){var Z=V[Q].getAsFile();
if(Z){T.stopPropagation();T.preventDefault();E(Z);return;}}}}function F(S,Q,R){A.inCallStackIfNecessary("nonundoable",function(){var W=A.getRep();
var Z=W.apool.attribToNum[["attachmentPlaceholder",S]];for(var T=0;T<W.alines.length;T++){var Y=W.alines[T];
var X=Changeset.opIterator(Y);var U=0;while(X.hasNext()){var V=X.next();Changeset.eachAttribNumber(V.attribs,function(a){if(a==Z){if(Q){A.performDocumentApplyAttributesToRange([T,U],[T,U+V.chars],[["img",Q],["attachmentKey",R],["attachmentPlaceholder",R?null:S]]);
}else{A.performDocumentReplaceRange([T,U],[T,U+V.chars],"");}}});U+=V.chars;}}});}function I(R,Q){A.getDynamicCSS().selectorStyle(".placeholder-"+R).background="#3da440 linear-gradient(to right, #ccc 100%, #3da440 0%) no-repeat "+$(A.getRootSelector()+" .ace-line").width()*Q+"px 0px";
}C.on("set-attachment",function(T,S,Q,R){F(S,Q,R);});return{insertImage:E,onClick:N,onDragOver:L,onDrop:H,onMouseDown:O,onMouseUp:M,onPaste:P,zoom:G};
};embed={};embed.resizeTwitterEmbed=function(A){var C=false;var B=window.setInterval(function(){var D=$(A.contentDocument).find("iframe");
if(D.hasClass("twitter-tweet-rendered")&&D.height()){window.clearInterval(B);setTimeout(function(){$(A).height($(A.contentDocument).height());
if(window.onEmbedResize){window.onEmbedResize(A);}},1000);}},1000);};embed.resizeOembedScript=function(A){var C=false;
var B=window.setInterval(function(){var D;D=$(A.contentDocument).find("body > .gist");if(!D.length){D=$(A.contentDocument).find("body");
}if(D.height()){window.clearInterval(B);$(A).height(D.height()+25);if(window.onEmbedResize){window.onEmbedResize(A);
}}},1000);};embed.onEmbed=function(C,A){var B=580;if(padutils.getIsMobile()){B=Math.min(B,$(window).width()-65);
}$.get("/ep/api/embed",{url:C,maxwidth:B},function(D){if(!D){A();}else{if(D.html){if((D.provider_name=="CrunchBase"||D.provider_name=="Amazon")&&D.thumbnail_url){A('<img class="inline-img" src="'+D.thumbnail_url+'">');
return;}var E=$("<div/>").append(D.html);if(!padutils.getIsMobile()){E=E.append('<div class="remove-media"></div>');
}E.find("object").append('<param name="wmode" value="opaque"/>');E.find("embed").attr("wmode","opaque");
A(E.html());}else{if(D.type=="photo"&&D.url){A('<img class="inline-img" src="'+D.url+'"><div class="remove-media"></div>');
}else{if(D.type=="link"&&D.thumbnail_url){A('<img class="inline-img" src="'+D.thumbnail_url+'"><div class="remove-media"></div>');
}else{A();}}}}}).error(function(){A();});};ace.selection=function(A){var E="\u200b";var G={selStart:[],selEnd:[]};
var C=null;var B=A.getRoot();function M(){var W=window.getSelection();if(W&&W.type!="None"&&W.rangeCount!==0){var V=W.getRangeAt(0);
function Z(a){while(a&&!(a.tagName&&a.tagName.toLowerCase()=="body")){a=a.parentNode;}return !!a;}function Y(h,f){if(!Z(h)){return{node:B,index:0,maxIndex:1};
}var a=h;var d=a.childNodes.length;if(isNodeText(a)||a.getAttribute("faketext")){return{node:a,index:f,maxIndex:(a.nodeValue||a.getAttribute("faketext")).length};
}else{if(d==0){return{node:a,index:0,maxIndex:1};}else{if(f==d){var b=a.childNodes.item(d-1);var c=nodeMaxIndex(b);
return{node:b,index:c,maxIndex:c};}else{var b=a.childNodes.item(f);var c=nodeMaxIndex(b);return{node:b,index:0,maxIndex:c};
}}}}var X={};if(!hasParent(V.startContainer,B)||!hasParent(V.endContainer,B)){return null;}X.startPoint=Y(V.startContainer,V.startOffset);
X.endPoint=Y(V.endContainer,V.endOffset);X.focusAtStart=(((V.startContainer!=V.endContainer)||(V.startOffset!=V.endOffset))&&W.anchorNode&&(W.anchorNode==V.endContainer)&&(W.anchorOffset==V.endOffset));
C=X;return X;}else{return null;}}function D(Y){function c(f){return{node:f.node,index:f.index,maxIndex:f.maxIndex};
}var a;function b(l){var f=c(l);if(a){function j(){while(f.node.childNodes.length>0){if(f.index==0){f.node=f.node.firstChild;
f.maxIndex=nodeMaxIndex(f.node);}else{if(f.index==f.maxIndex){f.node=f.node.lastChild;f.maxIndex=nodeMaxIndex(f.node);
f.index=f.maxIndex;}else{break;}}}}if(isNodeText(f.node)&&f.index==f.maxIndex){var h=f.node;while((!h.nextSibling)&&(h!=B)&&(h.parentNode!=B)&&h.parentNode!=null){h=h.parentNode;
}if(h.nextSibling&&(!((typeof h.nextSibling.tagName)=="string"&&h.nextSibling.tagName.toLowerCase()=="br"))&&(h!=f.node)&&(h!=B)&&(h.parentNode!=B)){f.node=h.nextSibling;
f.maxIndex=nodeMaxIndex(f.node);f.index=0;j();}}if(!isNodeText(f.node)){j();}}if(isNodeText(f.node)){return{container:f.node,offset:f.index};
}else{return{container:f.node.parentNode,offset:childIndex(f.node)+f.index};}}var W=window.getSelection();
if(W&&Y){a=(Y.startPoint.node===Y.endPoint.node&&Y.startPoint.index===Y.endPoint.index);var V=b(Y.startPoint);
var X=b(Y.endPoint);if((!a)&&Y.focusAtStart&&W.collapse&&W.extend){W.removeAllRanges();W.collapse(X.container,X.offset);
W.extend(V.container,V.offset);}else{if(Y&&W.rangeCount&&W.getRangeAt(0).startContainer===V.container&&W.getRangeAt(0).endContainer===X.container&&W.getRangeAt(0).startOffset===V.offset&&W.getRangeAt(0).endOffset===X.offset){return;
}if(V.container&&hasClass(V.container.parentNode,"emoji-glyph")){V.container=V.container.parentNode.parentNode;
X.container=X.container.parentNode.parentNode;}var Z=document.createRange();try{Z.setStart(V.container,V.offset);
}catch(d){V.offset=1;X.offset=1;Z.setStart(V.container,V.offset);}Z.setEnd(X.container,X.offset);W.removeAllRanges();
W.addRange(Z);}}}function J(){var V=A.getRep();var W=C&&C.startPoint?C.startPoint.node:null;if(W&&S(W)){C&&D(C);
}else{if(V.selStart){if(A.getLineHasMagicObject(V.selStart[0])){if(V.selStart[0]<V.lines.length()-1){V.selStart[0]=V.selStart[0]+1;
V.selEnd[0]=V.selStart[0];}}else{V.selStart[1]=V.selStart[1]+1;V.selEnd[1]=V.selStart[1];}if(V.selStart[0]>=V.lines.length()){V.selStart[0]=V.lines.length()-1;
V.selEnd[0]=V.selStart[0];}L();}}}function L(){var X=A.getRep();var Y=X.selStart,W=X.selEnd;if(!(Y&&W)){D(null);
return;}if(B.ownerDocument.activeElement!=B){return;}var V={};var Z=[Y[0],Y[1]];V.startPoint=H(Z);var a=[W[0],W[1]];
V.endPoint=H(a);V.focusAtStart=!!X.selFocusAtStart;D(V);A.getObserver().trigger("caret");}function U(d){var W=d.node;
var a=d.index;function X(l){return l.offsetLeft;}function Y(l){return l.offsetLeft+l.offsetWidth;}if(!isNodeText(W)){if(a==0){return X(W);
}else{return Y(W);}}else{var Z=a;var c=W.nodeValue.length-a;var V;for(V=W.previousSibling;V&&isNodeText(V);
V=V.previousSibling){Z+=V.nodeValue;}var b=(V?Y(V):X(W.parentNode));for(V=W.nextSibling;V&&isNodeText(V);
V=V.nextSibling){c+=V.nodeValue;}var j=(V?X(V):Y(W.parentNode));var f=(Z/(Z+c));var h=b+f*(j-b);return Math.round(h);
}}function F(Y,Z){var V=Y.offsetTop+50;if(Z){var X=(window.screen&&window.screen.availHeight)||200;V+=X/2;
}var W=A.getVisibleHeight();if(!W){W=$(window).height();if(padutils.getIsMobile()){W/=2;}}if(V<$("#padeditor").offset().top){$("html, body").animate({scrollTop:0},100);
}else{if(V>$(window).scrollTop()+W){$("html, body").animate({scrollTop:V-W},100);}else{if(V<$(window).scrollTop()){$("html, body").animate({scrollTop:V-13},100);
}}}}function R(){var V=A.getRep();if(!V.selStart){return;}var W=(V.selFocusAtStart?V.selStart[0]:V.selEnd[0]);
F(V.lines.atIndex(W).lineNode);}function S(V){if(browser.msie){return B.contains(V)&&V.constructor!=window.HTMLUnknownElement;
}else{return B.contains(V);}}function I(X){var Y=A.getRep();if(X.node==B){if(X.index==0){return[0,0];
}else{var b=Y.lines.length();var f=Y.lines.atIndex(b-1);return[b-1,f.text.length];}}else{var V=X.node;
var W=0;if(isNodeText(V)){W=X.index;if(nodeText(V)[0]==E){W=Math.max(W-1,0);}}else{if(X.index>0){W=nodeText(V).length;
}}var Z,a;while((Z=V.parentNode)!=B){if((a=V.previousSibling)){V=a;W+=nodeText(V).length;if(nodeText(V)[0]==E){W=Math.max(W-1,0);
}}else{V=Z;}}if(V.id==""){console.log("BAD");}if(V.firstChild&&isBlockElement(V.firstChild)){W+=1;}var c=Y.lines.atKey(V.id);
var d=Y.lines.indexOfEntry(c);return[d,W];}}function H(h){var f=A.getRep();var j=h[0];var W=h[1];var c=f.lines.atIndex(j);
W-=c.lineMarker;if(W<0){W=0;}var X=c.lineNode;var V=X;var Y=false;if(W==0){var a=0;if(browser.msie&&j==(f.lines.length()-1)&&X.childNodes.length==0){a=1;
}if(browser.msie&&X.childNodes.length==0){a=1;}return{node:X,index:a,maxIndex:1};}while(!(V==X&&Y)){if(Y){if(V.nextSibling){V=V.nextSibling;
Y=false;}else{V=V.parentNode;}}else{if(isNodeText(V)||V.getAttribute("faketext")){var Z=(V.nodeValue||V.getAttribute("faketext")).length;
if(V.nodeValue&&V.nodeValue[0]==E){W+=1;}var d=(W<=Z);if(W==Z){var b=V.parentNode.nextSibling&&V.parentNode.nextSibling.firstChild;
if(b&&isNodeText(b)&&b.nodeValue[0]==E){d=false;}}if(d){return{node:V,index:W,maxIndex:Z};}W-=Z;Y=true;
}else{if(V.firstChild){V=V.firstChild;}else{Y=true;}}}}return{node:X,index:1,maxIndex:1};}function N(a,Z,b){var W=A.getRep();
if(!(W.selStart&&W.selEnd)){return;}var V=$("#hp-editor-selection-wrapper");if(a&&!Z){var Y=$(B).offset();
if(V.is(":visible")&&G.selStart.join(",")==W.selStart.join(",")&&G.selEnd.join(",")==W.selEnd.join(",")){return;
}V.removeClass("link-mode").removeClass("link-hover-mode").removeClass("newpad-mode");var X=O();V.css({top:X.y+(X.height/2)+20-Y.top+$(window).scrollTop(),left:X.x+(X.width/2)-V.width()/2-Y.left-4});
G={selStart:W.selStart.slice(0),selEnd:W.selEnd.slice(0)};if(V.is(":visible")){return;}window.setTimeout(function(){V.addClass("hp-editor-selection-shown");
},0);}else{V.removeClass("hp-editor-selection-shown");if($("body").hasClass("ace-focused")){V.removeClass("link-mode").removeClass("newpad-mode");
}}}function O(){var X=document.selection,V;var Z=0,b=0;var a=0,Y=0;if(X){if(X.type!="Control"){V=X.createRange();
Z=V.boundingLeft;b=V.boundingTop;a=V.boundingWidth;Y=V.boundingHeight;}}else{if(window.getSelection){X=window.getSelection();
if(X.rangeCount){V=X.getRangeAt(0).cloneRange();if(V.getBoundingClientRect){var W=V.getBoundingClientRect();
Z=W.left;b=W.top;a=W.right-W.left;Y=W.bottom-W.top;}}}}return{x:Z,y:b,width:a,height:Y};}function K(W){var Y={node:W,index:0,maxIndex:0};
var V=I(Y);var X=[V[0],V[1]+$(W).text().length];return{ss:V,se:X};}function Q(){var W;var V=$("#hp-editor-selection-wrapper");
padutils.tooltip("#hp-editor-selection-link, #hp-editor-selection-newpad");V.off(".hp-editor-selection").on("click.hp-editor-selection",function(){if(!V.hasClass("link-mode")&&!V.hasClass("link-hover-mode")&&!V.hasClass("newpad-mode")){J();
}return false;}).on("mouseover.hp-editor-selection",function(){window.clearTimeout(W);}).on("mouseout",function(){if(V.hasClass("link-hover-mode")){W=window.setTimeout(function(){if(!$("#hp-editor-selection-link-url").is(":focus")){V.removeClass("link-hover-mode");
}},500);}});$("#hp-editor-selection-link").off(".hp-editor-selection").on("click.hp-editor-selection",function(a){V.addClass("link-mode");
$("#tooltip").remove();$("#hp-editor-selection-link-url").val("");setTimeout(function(){$("#hp-editor-selection-link-url").focus();
},100);A.getObserver().trigger("track",["createLinkStart"]);return false;});var Z=function(){var c=A.getRep();
if(V.hasClass("link-hover-mode")){var d=K($("#hp-editor-selection-link-url").data("link-hover-target"));
A.inCallStack("linkHover",function(){A.performSelectionChange(d.ss,d.se);});}var a=$("#hp-editor-selection-link-url").val();
if(!a){return false;}if(!padutils.isWhitelistUrlScheme(a)){a=window.location.protocol+"//"+a;}var b=window.location.protocol+"//"+window.location.host;
if(a.indexOf(b)==0){a=a.substring(b.length);if(a[0]!="/"){a="/"+a;}}var f=A.createChangesetFromRange(c.selStart,c.selEnd);
T(f.atext.text.replace("\n",""),a);V.removeClass("link-mode");V.removeClass("link-hover-mode");A.getObserver().trigger("track",["createLinkDone",null,null,{url:a}]);
return false;};$("#hp-editor-selection-link-confirm").off(".hp-editor-selection").on("click.hp-editor-selection",function(a){Z();
});$("#hp-editor-selection-link-url").off(".hp-editor-selection").on("keydown.hp-editor-selection",function(a){if(a.keyCode==13){Z();
}}).on("blur.hp-editor-selection",function(){window.setTimeout(function(){V.removeClass("link-hover-mode");
},100);});$("#hp-editor-selection-link-delete").off(".hp-editor-selection").on("click.hp-editor-selection",function(b){var a=K($("#hp-editor-selection-link-url").data("link-hover-target"));
A.inCallStack("linkHover",function(){A.performDocumentApplyAttributesToRange(a.ss,a.se,[["link",""]]);
});V.removeClass("link-hover-mode");});var Y=function(a){var a=a||$("#hp-editor-selection-newpad-title").val();
if(!a){return;}var b=A.getRep();A.getObserver().trigger("track",["popup-pagecreate"]);var c=A.createChangesetFromRange(b.selStart,b.selEnd);
A.getObserver().trigger("create-page",[c.atext,c.apool.toJsonable(),a]);V.removeClass("newpad-mode");
};$("#hp-editor-selection-newpad").off(".hp-editor-selection").on("click.hp-editor-selection",function(f){V.addClass("newpad-mode");
$("#tooltip").remove();var b=A.getRep();var d=A.createChangesetFromRange(b.selStart,b.selEnd);var a=d.atext.text;
var c=a.split("\n").length==1||(a.split("\n").length==2&&a.split("\n")[1]=="");if(c){$("#hp-editor-selection-newpad-title").val(a.replace("\n",""));
setTimeout(function(){$("#hp-editor-selection-newpad-title").focus();},100);}else{$("#hp-editor-selection-newpad-title").val("");
setTimeout(function(){$("#hp-editor-selection-newpad-title").focus();},100);}return false;});$("#hp-editor-selection-newpad-confirm").off(".hp-editor-selection").on("click.hp-editor-selection",function(a){Y();
});$("#hp-editor-selection-newpad-title").off(".hp-editor-selection").on("keydown.hp-editor-selection",function(a){if(a.keyCode==13){Y();
}});var X;$(document).on("mouseover",".ace-line .attrlink a",function(a){X=window.setTimeout(function(){if((V.is(":visible")&&!V.hasClass("link-hover-mode"))||V.hasClass("link-mode")||V.hasClass("newpad-mode")){return;
}window.clearTimeout(W);var c=$(B).offset();V.addClass("link-hover-mode");V.css({top:$(a.currentTarget).offset().top+$(a.currentTarget).height()+10-c.top,left:$(a.currentTarget).offset().left+($(a.currentTarget).width()/2)-V.outerWidth(true)/2-((V.outerWidth(true)-V.outerWidth())/2)-c.left-4});
var b=$(a.currentTarget).attr("href");if(b.charAt(0)=="/"){b=window.location.protocol+"//"+window.location.host+b;
}$("#hp-editor-selection-link-url").val(b).data("link-hover-target",a.currentTarget);if(V.is(":visible")){return;
}window.setTimeout(function(){V.addClass("hp-editor-selection-shown");},0);},500);});$(document).on("mouseout",".ace-line .attrlink a",function(a){window.clearTimeout(X);
W=window.setTimeout(function(){if(!$("#hp-editor-selection-link-url").is(":focus")){V.removeClass("link-hover-mode");
}},500);});}function T(V,X){var W=A.getRep();if(!(W.selStart&&W.selEnd)){return;}A.inCallStack("linkinsert",function(){A.fastIncorp();
var Z=A.getRep();var Y=Z.selStart;var b=[Y[0],Y[1]+V.length];A.replaceRange(Z.selStart,Z.selEnd,V);A.performDocumentApplyAttributesToRange(Y,b,[["link",X]]);
if($.browser.mozilla){var a=[Y[0],Y[1]+V.length];A.replaceRange(a,a," ");}});}function P(V){window.focus();
B.focus();if(V){var W=null;if(V.split("h=")[1]){W=_trim(V.split("h=")[1]);}A.inCallStackIfNecessary("gotoline",function(){A.fastIncorp();
var Y=A.getRep();var a=0;for(var X=0;X<Y.lines.length();X++){var Z=Y.lines.atIndex(X);var b=_trim(Z.text.substring(Z.lineMarker));
if(_hashCode(b)===parseInt(V)){V=X+1;break;}if(W&&W==b.substring(0,W.length).replace(/ /g,"-")){V=X+1;
break;}}if(V<Y.lines.length()){A.performSelectionChange([V-1,a],[V-1,a]);F(Y.lines.atIndex(V).lineNode,true);
}});}}return{focus:P,getLineAndCharForPoint:I,getSelection:M,restoreSelection:J,scrollNodeVerticallyIntoView:F,scrollSelectionIntoView:R,setSelection:D,setupSelectionToolbar:Q,updateBrowserSelectionFromRep:L,updateToolbarIfNecessary:N};
};ace.lists=function(A){var L=8;var P=A.getRoot();function B(W){var V=A.getRep();var U=V.alines[W];if(U){var T=Changeset.opIterator(U);
if(T.hasNext()){return Changeset.opAttributeValue(T.next(),"list",V.apool)||"";}}return"";}function J(X){var T=A.getRep();
var W=T.alines[X];if(W){var V=Changeset.opIterator(W);if(V.hasNext()){var U=V.next();return(Changeset.opAttributeValue(U,"table",T.apool)||Changeset.opAttributeValue(U,"embed",T.apool)||Changeset.opAttributeValue(U,"img",T.apool))||false;
}}return"";}function H(W){var V=A.getRep();var U=V.alines[W];if(U){var T=Changeset.opIterator(U);if(T.hasNext()){return Changeset.opAttributeValue(T.next(),"start",V.apool)||"";
}}return"";}function S(Z,f){var V=A.getRep();if(!(V.selStart&&V.selEnd)){return false;}var a,c;a=V.selStart[0];
c=Math.max(a,V.selEnd[0]-((V.selEnd[1]==0)?1:0));var W=[];var X=false;for(var T=a;T<=c;T++){var U=B(T);
if(U){U=/([a-z]+)([12345678])/.exec(U);if(U){X=true;var d=U[1];var Y=Number(U[2]);if((d=="indent"||f)&&Y==1&&Z){W.push([T,null]);
}else{var b=Math.max(1,Math.min(L,Y+(Z?-1:1)));if(Y!=b){W.push([T,d+b]);}}}}else{if(!Z){W.push([T,"indent1"]);
X=true;}}}if(W.length>0){D(W);}return X;}function G(U,Z){var Y=A.getRep();var T=B(U);if(!T){return null;
}T=/([a-z]+)[12345678]/.exec(T);if(!T||T[1]!="number"){return null;}if(Z){var a=H(U);if(a){return;}}while(U-1>=0&&(T=B(U-1))){T=/([a-z]+)([12345678])/.exec(T);
curLevel=Number(T[2]);if(!T){break;}U--;}var V=Changeset.builder(Y.lines.totalWidth());loc=[0,0];function X(b,f){var h=1;
var d=f;var c;while(c=B(b)){c=/([a-z]+)([12345678])/.exec(c);d=Number(c[2]);if(isNaN(d)){return b;}else{if(c[1]!="number"){b++;
}else{if(d==f){var j=H(b);A.buildKeepRange(V,loc,(loc=[b,0]));if(j!=h){A.buildKeepRange(V,loc,(loc=[b,1]),[["start",h]],Y.apool);
}else{A.buildKeepRange(V,loc,(loc=[b,1]));}h++;b++;}else{if(d<f){return b;}else{b=X(b,f+1);}}}}}return b;
}X(U,1);var W=V.toString();if(!Changeset.isIdentity(W)){A.performDocumentApplyChangeset(W);}}function F(U,T){D([[U,T]]);
}function D(b){var Y=A.getRep();var U=[0,0];var W=Changeset.builder(Y.lines.totalWidth());for(var X=0;
X<b.length;X++){var Z=b[X];var T=Z[0];var V=Z[1];A.buildKeepRange(W,U,(U=[T,0]));if(J(T)){}else{if(B(T)){var c=V&&V.indexOf("indent")==0&&B(T).indexOf("indent")==-1;
if(V&&!c){A.buildKeepRange(W,U,(U=[T,1]),[["list",V]],Y.apool);}else{A.buildRemoveRange(W,U,(U=[T,1]));
}}else{if(V){W.insert("*",[["author",A.getThisAuthor()],["insertorder","first"],["list",V]],Y.apool);
}}}}var a=W.toString();if(!Changeset.isIdentity(a)){A.performDocumentApplyChangeset(a);}if(G(T+1)==null){G(T);
}}function R(){E("bullet");}function Q(){E("number");}function M(){E("code");}function O(){E("comment");
}function E(Y){var U=A.getRep();if(!(U.selStart&&U.selEnd)){return;}var V,X;V=U.selStart[0];X=Math.max(V,U.selEnd[0]-((U.selEnd[1]<=U.lines.atIndex(U.selEnd[0]).lineMarker)?1:0));
var a=true;for(var T=V;T<=X;T++){if(B(T).indexOf(Y)<0){a=false;break;}}var b=[];for(var T=V;T<=X;T++){var c=B(T);
var W=1;var Z=/[a-z]+([12345678])/.exec(c);if(Z){W=Number(Z[1]);}b.push([T,a?"indent"+W:Y+W]);}D(b);}function K(){var U=A.getRep();
if(!(U.selStart&&U.selEnd)){return;}var V,X;V=U.selStart[0];X=Math.max(V,U.selEnd[0]-((U.selEnd[1]<=U.lines.atIndex(U.selEnd[0]).lineMarker)?1:0));
var a=true;for(var T=V;T<=X;T++){if(B(T).indexOf("task")<0){a=false;break;}}var b=[];for(var T=V;T<=X;
T++){if(U.lines.atIndex(T).text.length==0&&X>V){continue;}var Z="task";var Y=1;var W=/([a-z]+)([12345678])/.exec(B(T));
if(W){Z=W[1].indexOf("task")>-1?W[1]:Z;Y=Number(W[2]);}b.push([T,a?"indent"+Y:Z+Y]);}D(b);}function I(T){return"#:h="+T.substring(0,30).replace(/ /g,"-");
}function C(T){A.inCallStackIfNecessary("headingChange",function(){var U=A.caretLine();var Y=B(U);var X=1;
var W=/[a-z]+([12345678])/.exec(Y);if(W){X=Number(W[1]);}var V={"1":"hone","2":"indent","3":"hthree","0":"indent"}[T];
if(V=="indent"){F(U,"");}else{F(U,V+X);}if(T==0){A.setAttributeOnLine(U,"bold",false);}else{if(T==2){A.setAttributeOnLine(U,"bold",true);
}}A.getObserver().trigger("track",["heading-menu-action","change-heading",T]);});}function N(U){if(clientVars.isMobile){return;
}function T(){$("#hp-editor-headings").hide();P.focus();}$("#hp-editor-headings").off(".hp-headings").on("menu-closed.hp-headings",function(){$("#hp-editor-headings").hide();
});$("#hp-editor-headings-1").off(".hp-headings").on("click.hp-headings",function(){C(1);T();return false;
});$("#hp-editor-headings-2").off(".hp-headings").on("click.hp-headings",function(){C(2);T();return false;
});$("#hp-editor-headings-3").off(".hp-headings").on("click.hp-headings",function(){C(3);T();return false;
});$("#hp-editor-headings-normal").off(".hp-headings").on("click.hp-headings",function(){C(0);T();return false;
});$("#hp-editor-headings-link").off(".hp-headings").on("click.hp-headings",function(){var Y=A.getRep();
var V=Y.lines.atIndex(A.caretLine());var W=_trim(V.text.substring(V.lineMarker));var Z=_hashCode(W);var X=window.top.location.href.split("#")[0];
A.getObserver().trigger("track",["heading-menu-action","get link"]);prompt("Copy this link to your clipboard",X+I(W));
T();return false;});showContextMenu(U,"headings-menu",$("#hp-editor-headings"));}return{doInsertCodeList:M,doInsertComment:O,doInsertOrderedList:Q,doIndentOutdent:S,doInsertTaskList:K,doInsertUnorderedList:R,doSetHeadingLevel:C,getLineHasMagicObject:J,getLineListType:B,locationFragmentForHeading:I,renumberList:G,setLineListType:F,showHeadingsMenu:N};
};ace.autolink=function(A){var C=null;function L(){return C;}var B=function(V,U,W,T,S){};function P(V,U,W,T,S){return B(V,U,W,T,S);
}function Q(S){B=S;}var D=function(S,T){return S[0]=="@";};function N(S,T){return D(S,T);}function J(S){D=S;
}function K(S,T){console.log("Set marker at",S);A.performDocumentApplyAttributesToRange(S,[S[0],S[1]+1],[["autolink","true"]]);
}function M(S){C=S;}function I(S){console.log("Clear marker at",S);C=null;S=E(S[0]);if(!S){console.log("No autolink marker found!");
return;}A.performDocumentApplyAttributesToRange(S,[S[0],S[1]+1],[["autolink",null]]);}function E(a){if(!A.isCaret()){return;
}var W=A.getRep();var Y=W.apool.attribToNum[["autolink","true"]];var S=a||A.caretLine();var Z=W.alines[S];
var V=Changeset.opIterator(Z);var X;var U=0;while(V.hasNext()){var T=V.next();Changeset.eachAttribNumber(T.attribs,function(b){if(b==Y){X=[S,U];
}});U+=T.chars;}return X;}function R(){var U=A.getCurrentCallStack();console.log("type="+U.type);var W=O();
var T=E();C=T;var S=H(T)?F(T):A.caretWord();if(!W&&T&&S&&D(S.word,S.start)){if(U.docTextChanged){var V=G();
B(S.word,null,S.start,S.end,V);}}else{if(T&&U.docTextChanged){if(!D(S.word,S.start)){B(null);}}else{B(null);
}}}function H(S){var U=A.caretLine();var T=A.caretColumn();if(S){if(S[0]==U&&S[1]<T){return true;}}return false;
}function F(T){var S=A.charFromLineAndColumn(T);var U="";var W=A.getRep();while(S<A.caretDocChar()){U+=W.alltext.charAt(S);
S++;}var V=A.lineAndColumnFromChar(S);return{word:U,start:T,end:V};}function G(){var T=A.getSelection();
var V=(T.focusAtStart?T.startPoint:T.endPoint);var S=V.node;while(S&&S.parentNode&&S.tagName!="SPAN"){S=S.parentNode;
}while(S&&S.previousSibling&&!hasClass(S,"autolink")){S=S.previousSibling;}if(!S){return null;}if(!hasClass(S,"autolink")&&S.tagName!="AUTOLINK"){return null;
}var U=S.offsetLeft;var W=S.offsetTop+A.textLineHeight()+3;return{x:U,y:W};}function O(){var S=A.getSelection();
if(!S){return false;}var T=(S.focusAtStart?S.startPoint:S.endPoint);var U=T.node.parentNode;return hasClass(U,"attrlink");
}return{autocompleteCallback:P,caretWordPopupPosition:G,clearAutolink:I,findAutolinkStartPosition:E,handleAutocomplete:R,isValidLinkStart:H,getLastAutolinkPosition:L,linkWord:F,setAutocompleteCallback:Q,setAutolink:K,setLastAutolinkPosition:M,setTriggerLink:J,shouldTriggerLink:N};
};ace.code=function(A){var K=A.getRoot();var B=[];var E=false;var D=false;var C={};var F=null;function J(P,O){$.post("/ep/api/latex",{formula:P},function(R){if(R.length){var U=/^([-]?\d+)\r\n(\S+)\s([-]?\d+)\s(\d+)\s(\d+)\r?\n?([\s\S]*)/;
var Q=R.match(U);var S=Q[1];var V=Q[2];var X=Q[3];var W=Q[4];var Y=Q[5];var T=Q[6];if(S=="0"){O('<img class="" src="'+V+'">');
}else{O("<pre>"+T+"</pre>");}}}).error(function(){O();});}function I(O){var P=C["default"];if(O){if(!C[O]){G(O);
}else{P=C[O];}}return P;}function G(P){var O=function(){require(["helper"],function(Q){A.setProperty("langtokenizer",[Q("foo."+P),P]);
});};if(!D){$.ajax({url:"/static/js/tok/require_all.js",dataType:"script",cache:true,success:function(){E=true;
O();if(B.length){for(var Q=0;Q<B.length;++Q){B[Q]();}B=[];}}});D=true;}else{if(E){O();}else{B.push(O);
}}}function L(){return A.getTextFace()=="monospace";}function M(P,O){if(userAgentInfo()=="Firefox"){$(K).attr("spellcheck","false");
}C[O||"default"]=P;window.clearTimeout(F);F=window.setTimeout(function(){A.inCallStackIfNecessary("setTokenizer",function(){A.fastIncorp();
var Q=A.getRep();N(0,Q.alltext.length);});},0);}function H(R){var Q=A.getRep();var P=Q.alines[R];if(P){var O=Changeset.opIterator(P);
if(O.hasNext()){lang=Changeset.opAttributeValue(O.next(),"lang",Q.apool)||"";lang=lang=="c++"?"cpp":lang;
return lang;}}return"";}function N(S,Y,T,W){var P=A.getRep();if(Y<=S){return;}if(S<0||S>=P.lines.totalWidth()){return;
}var O=P.lines.atOffset(S);var Q=P.lines.offsetOfEntry(O);var R=P.lines.indexOfEntry(O);var X=false;var Z=null;
var c=null;T=(T||noop);var V;var U=function(d,f){O.domInfo.appendSpan(d,f);};if(W){var b=U;U=function(d,f){W(d,f,b,V);
V+=d.length;};}while(O&&Q<Y&&!T()){var a=Q+O.width;V=Q;O.domInfo.clearSpans();A.getSpansForLine(O,U,Q);
O.domInfo.finishUpdate();A.markNodeClean(O.lineNode);if(P.selStart&&P.selStart[0]==R||P.selEnd&&P.selEnd[0]==R){X=true;
}if(Z===null){Z=R;}c=R;Q=a;O=P.lines.next(O);R++;}if(X){A.getCurrentCallStack().selectionAffected=true;
}}return{getLangForCodeLine:H,getTokenizer:I,isMonospace:L,onMath:J,setTokenizer:M};};ace.tables=function(A){window.handleTableChange=function(P,F){var O={node:P,index:0,maxIndex:0};
var K=A.getLineAndCharForPoint(O);var H=[];for(var E=0;E<F.length;E++){var J=F[E][0];var I=F[E][1];var Q=F[E][2];
var N=F[E][3];var L=F[E][4];var M=F[E][5];H.push([J+":"+I,N]);for(var G=0;G<L.length;G++){H.push([J+":"+I+":"+L[G],true]);
}for(var G=0;G<M.length;G++){H.push([J+":"+I+":"+M[G]]);}}A.inCallStackIfNecessary("tableChanges",function(){A.performDocumentApplyAttributesToRange(K,[K[0],K[1]+1],H);
});};function D(L,G,O){var E=document.getElementById(G[0]);var F=L[0].domInfo.node;var I=E.children.length&&hasClass(E.children[0],"table");
var M=F.children.length&&hasClass(F.children[0],"table");if(I&&M){G=[];F.parentNode.removeChild(F);E.id=F.id;
E.className=F.className;var N=A.getRep();var K=Changeset.opIterator(N.alines[O]);var H=E.children[0].children[0].children[0].children[0];
C(H,K);var J=H.onAfterEdit();B(H,J);A.markNodeClean(E);}return G;}function B(E,I){var G=E.nextSibling;
if(G){E.parentNode.removeChild(G);}var H=I.cloneNode(true);var F=document.createElement("div");addClass(F,"shadow-table");
F.appendChild(H);E.parentNode.appendChild(F);}function C(H,G){var F=[];while(G.hasNext()){var I=G.next();
Changeset.eachAttribNumber(I.attribs,function(N){var L=A.getRep();var J=L.apool.getAttribKey(N).split(":");
var P=L.apool.getAttribValue(N);var M=J[0];var K=J[1];if(J.length==2){H.setDataAtCell(M,K,P);}if(J.length==3){var O=J[2];
F.push([M,K,O]);}});}for(var E=0;E<F.length;E++){H.setAttribAtCell(F[E][0],F[E][1],F[E][2]);}}window.fillTable=function(E){var F={node:E.parentNode.parentNode.parentNode.parentNode,index:0,maxIndex:0};
if(!A.isNodeDirty(F.node)){var J=A.getRep();var I=A.getLineAndCharForPoint(F);var G=Changeset.opIterator(J.alines[I[0]]);
C(E,G);var H=E.onAfterEdit();B(E,H);A.markNodeClean(F.node);}else{console.log(F.node);}};window.deleteTable=function(F){var H={node:F,index:0,maxIndex:0};
var E=A.getLineAndCharForPoint(H);var G=[E[0],E[1]+1];A.inCallStack("deleteTable",function(){A.performDocumentReplaceRange(E,G,"");
});};return{domAndRepSpliceToTable:D};};ace.authors=function(C){var A={};var B=false;function M(){return B;
}function N(O){B=O;}function H(){return A;}function L(O,R){if((typeof O)!="string"){throw new Error("setAuthorInfo: author ("+O+") is not a string");
}var P=C.getDynamicCSS();if(!R){delete A[O];if(P){P.removeSelectorStyle(F("gutter-"+linestylefilter.getAuthorClassName(O)));
P.removeSelectorStyle(E(linestylefilter.getAuthorClassName(O)));}}else{A[O]=R;C.getObserver().trigger("invalidate-cache");
C.getObserver().trigger("caret",[true]);if(R.bgcolor){if(P){var S=R.bgcolor;var U=clientVars.isDesktopApp?2:4;
S=D(R.bgcolor,0.4);name_bgcolor=D(R.bgcolor,0.2);var T=F("gutter-"+linestylefilter.getAuthorClassName(O));
var Q=P.selectorStyle(T);if(!browser.msie){if(!clientVars.isDesktopApp&&B=="initials"){Q.borderLeft=U+"px solid white";
Q.paddingLeft="19px";Q.paddingRight="10px";}else{Q.borderLeft=U+"px solid "+S;Q.paddingLeft="54px";Q.paddingRight="60px";
}}else{Q.paddingLeft="55px";Q.paddingRight="60px";}P.selectorStyle(K(linestylefilter.getAuthorClassName(O))).color=name_bgcolor;
P.selectorStyle(J(linestylefilter.getAuthorClassName(O))).display="none";P.selectorStyle(E(linestylefilter.getAuthorClassName(O))).borderBottom="2px dotted "+S;
var T=I("gutter-"+linestylefilter.getAuthorClassName(O),linestylefilter.getAuthorClassName(O));P.selectorStyle(T).borderBottom="0px solid "+S;
}}}}function G(){var O=[];for(var P in A){O.push(A[P].name);}return O;}function K(O){return"#editor .ace-line.gutter-"+O+":before";
}function J(O){return".gutter-"+O+":not(.line-list-type-comment) + .gutter-"+O+":not(.line-list-type-comment):before, .gutter-"+O+":not(.line-list-type-comment) + .gutter-noauthor + .gutter-"+O+":not(.line-list-type-comment):before, .line-list-type-comment.gutter-"+O+" + .line-list-type-comment.gutter-"+O+":before";
}function F(O){return".edit-mode ."+O;}function E(O){return".authorColors ."+O;}function I(O,P){return".authorColors ."+O+" ."+P;
}function D(P,Q){var O=colorutils.css2triple(P);O=colorutils.blend(O,[1,1,1],Q);return colorutils.triple2css(O);
}return{getAuthorInfos:H,getAuthorNames:G,getShortNames:M,setAuthorInfo:L,setShortNames:N};};
/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var padchat=(function(){var R=[""];
var J=[null];var L={};var E={};var F={};var I=false;var Z=50;var C="site";function H(f,j){if((typeof L[f])=="number"){return L[f];
}else{if(j){return -1;}else{var h=R.length;R.push(f);L[f]=h;return h;}}}function B(f){return'.chatlines[data-room="'+(f||C)+'"] ';
}function P(l){var f=new Date(+l);var j=String(f.getFullYear());var m=("0"+String(f.getMonth()+1)).slice(-2);
var h=("0"+String(f.getDate())).slice(-2);return j+"-"+m+"-"+h;}function U(l){var f=new Date(+l);var h=(["January","February","March","April","May","June","July","August","September","October","November","December"])[f.getMonth()];
var m=f.getDate();var j=f.getFullYear();return h+" "+m+", "+j;}function M(n,o){var f=o||C;var j=P(n);
var h=padutils.binarySearch(E[f].length,function(p){return E[f][p].day>=j;});if(h>=E[f].length||E[f][h].day!=j){E[f].splice(h,0,{day:j,lines:[]});
var l='<div class="chatday chatday'+j+'"><h2 class="dayheader">'+U(n)+"</h2></div>";var m=$(B(f)+".chatday");
if(h==m.length){$(B(f)).append(l);}else{m.eq(h).before(l);}}return h;}function O(h,j,p,m,y,n,t){var AA=M(j,n);
var x=$(B(n)+".chatday"+P(j));var w=new Date(+j);var z=w.getHours()+":"+("0"+w.getMinutes()).slice(-2);
var o;if(p){o=padutils.escapeHtml(A.nameToInitials(p));}var q="chatline";if(h){var AB=H(h);q+=" chatauthor"+AB;
}var f=t?m:padutils.escapeHtmlWithClickableLinks(m,"_blank");var r=f.indexOf("/me ")==0;if(r){f=f.substring("/me ".length);
}f=f.replace(new RegExp("(^|\\s)(@"+escapeRegExp(A.nameToMention(clientVars.userName))+")(\\W|$)","gi"),'$1<span class="chat-at-tag-me">$2</span>$3').replace(/(^|\s)(@\S+)(\W|$)/g,'$1<span class="chat-at-tag">$2</span>$3');
var l=$('<div class="'+q+(t?" chatline-special  ":"")+(r?" chatline-irc-action ":"")+'"><span class="chatlinetime">'+z+" </span>"+(o?'<span class="chatlinename">'+o+'<span class="chatlinename-separator">:</span> </span>':"")+'<span class="chatlinetext">'+f+"</span></div>");
var v=E[n][AA].lines;var s={userId:h,time:j,name:p,lineText:m};if(y){x.find("h2").after(l);v.splice(0,0,s);
}else{x.append(l);v.push(s);}if(h){var u=S(h);if(u){l.css("border-left","5px solid "+u);}}return{lineNode:l};
}function N(h){for(var m in h.historicalAuthorData){var p=h.historicalAuthorData[m];var o=H(m);if(!J[o]){J[o]={colorId:p.colorId,faded:true};
}}F[C]=h.start;var l=h.lines;for(var j=l.length-1;j>=0;j--){var f=l[j];O(f.userId,f.time,f.name,f.lineText,true,C);
}if(F[C]>0){$(B()+"a.chatloadmore").css("display","block");}else{$(B()+"a.chatloadmore").css("display","none");
}}function a(h){var f=colorutils.css2triple(h);f=colorutils.blend(f,[1,1,1],0.5);return colorutils.triple2css(f);
}function S(l){var j=H(l,true);if(j<0){return"";}else{var f=J[j];if(!f){return"";}else{var h=pad.getColorPalette()[f.colorId%pad.getColorPalette().length];
if(f.faded){h=a(h);}return h;}}}function T(f,l){var j=H(f);J[j]=l;var h=S(f);if(h){$("#padchat .chatauthor"+j).css("border-left","5px solid "+h);
}}function V(){var h=$("#chatentrybox").val().replace(/^\s+|\s+$/gm,"");if(h){setTimeout(function(){$("#chatentrybox").val("").focus();
},0);var f={type:"chat",userId:pad.getUserId(),chatroom:C!="site"&&C!="pad"?pad.getUserId():C,chatroom_to:C,lineText:h,senderName:pad.getUserName(),authId:pad.getUserId()};
pad.sendClientMessage(f);f.chatroom=C;if(C!=pad.getUserId()){A.receiveChat(f);}A.scrollToBottom();}}var Q={};
function Y(){if(caps.hasLocalStorage){$("#padchat-users li").each(function(n,f){f=$(f);var h=f.attr("data-room");
var l=Q[h];var j=localStorage["chatLastTimeReadMessages_"+h];if(j&&l&&parseInt(j/1000)>=parseInt(l/1000)){var m=+(f.attr("data-notification-count")||0);
f.removeAttr("data-notification-count");A.totalUnreadChats-=m;if(A.totalUnreadChats==0){$("#padchat").removeClass("chat-has-unread").removeAttr("data-notification-count");
}else{$("#padchat").attr("data-notification-count",A.totalUnreadChats);}if($("#padchat").hasClass("chat-open")&&f.hasClass("selected")){localStorage["chatLastTimeReadMessages_"+h]=Date.now();
}}});}}var G=Date.now();function b(){if(!document[caps.hidden]){G=Date.now();if(caps.hasLocalStorage){localStorage.chatLastTimeFocused=G;
Y();}}}if(typeof document.addEventListener!=="undefined"&&typeof caps.hidden!=="undefined"){document.addEventListener(caps.visibilityChange,b,false);
}var c=null;window.AudioContext=window.AudioContext||window.webkitAudioContext;var D=null;var d;function W(){if(!window.AudioContext||allCookies.getItem("chat-sound")=="F"){return;
}else{if(!D){D=new AudioContext();}}var f=D.createOscillator();if(!f.start){return;}f.type=0;f.frequency.value=400;
var h=D.createGainNode();f.connect(h);h.connect(D.destination);var j=0.2;var l=0.05;h.gain.linearRampToValueAtTime(0,D.currentTime);
h.gain.linearRampToValueAtTime(0.25,D.currentTime+l);h.gain.linearRampToValueAtTime(0.25,D.currentTime+j-l);
h.gain.linearRampToValueAtTime(0,D.currentTime+j);f.start(D.currentTime);f.stop(D.currentTime+j);}function X(f){if(caps.hasLocalStorage){if(localStorage.chatLastTimeFocused==G&&document[caps.hidden]){padnotify.userChat(f);
W();}}}var K=[];var A={init:function(f,h){A.setupChatRoom();G=Date.now();if(caps.hasLocalStorage){localStorage.chatLastTimeFocused=G;
}A.handleUserJoinOrUpdate(h);if(f){N(f);}$("#padchat-wrapper > header").click(function(j){if($(j.target).is("#chat-settings")||$(j.target).parents("#chat-settings").length){return;
}$("#padchat").toggleClass("chat-open");if($("#padchat").is(":visible")){A.scrollToBottom();$("#chatentrybox").focus();
if(caps.hasLocalStorage){localStorage["chatLastTimeReadMessages_"+C]=Date.now();}A.totalUnreadChats=0;
$("#padchat").removeClass("chat-has-unread").removeAttr("data-notification-count");}});$("#chat-settings-sound").click(function(){$("#chat-settings-sound").toggleClass("chat-sound-enabled");
allCookies.setItem("chat-sound",$("#chat-settings-sound").hasClass("chat-sound-enabled")?"T":"F");return false;
});$("#chat-settings-sound").toggleClass("chat-sound-enabled",allCookies.getItem("chat-sound")!="F");
$("#chatentrybox").textcomplete([{match:/\B@([\-+\w]*)$/,search:function(j,l){l($.map(K,function(m){return m.toLowerCase().indexOf(j.toLowerCase())===0?m:null;
}));},replace:function(j){return["@"+j+" ",""];},index:1,maxCount:5}]);padutils.bindEnterAndEscape($("#chatentrybox"),function(j){V();
},null);A.handleUserSiteJoinOrUpdate({userId:clientVars.userId,name:clientVars.userName,userPic:clientVars.userPic});
$("#padchat-users").append($("<li>").addClass("chat-site").addClass("selected").attr("title",clientVars.siteName).attr("data-room","site").append($("<img>").attr("src","https://hackpad.com/static/favicon.ico")).append($("<span>").text(clientVars.siteName)));
$(document).on("click","#padchat-users li",function(j){padchat.handleRoomClick($(j.currentTarget));});
A.scrollToBottom();},setupChatRoom:function(f){f=f||C;if(!E[f]){E[f]=[];}M(+new Date,f);$(B(f)+"a.chatloadmore").click(A.loadMoreHistory);
$(B(f)).on("scroll",throttle(function(){if($(B(f)).scrollTop()<100){$(B(f)+"a.chatloadmore").click();
}},33));},handleNewTitle:function(f){$("#padchat-users .chat-pad").attr("title",f).find("span").text(f);
padChatEl=$("#padchat-users .chat-pad.selected");if(padChatEl.length){$("#chat-room-name").text(padChatEl.attr("title")+" chat");
}},handleRoomClick:function(f){if(I){return;}$("#padchat-users li.selected").removeClass("selected");
f.addClass("selected").removeAttr("data-notification-count");f.attr("data-author")?$("#chat-room-name").text("Chat with "+f.attr("title")):$("#chat-room-name").text(f.attr("title")+" chat");
$(B()).removeClass("selected");var h=f.attr("data-room");C=h;if(!$(B()).length){A.createChatRoom(h);A.loadMoreHistory();
}$(B()).addClass("selected");if(caps.hasLocalStorage){localStorage["chatLastTimeReadMessages_"+C]=Date.now();
}A.scrollToBottom();$("#chatentrybox").focus();},createChatRoom:function(f){$("#chat-body").append($("<div>").addClass("chatlines").attr("data-room",f).append($('<a class="chatloadmore" href="#load-more">load more</a>')).append($('<div class="chatloadingmore">loading...</div>')));
A.setupChatRoom(f);},totalUnreadChats:0,receiveChat:function(f){f.chatroom=f.chatroom;var h=$(B(f.chatroom));
if(!h.length){A.createChatRoom(f.chatroom);h=$(B(f.chatroom));}var j=h.get(0);var o=(j.scrollTop-(j.scrollHeight-$(j).height())>=-5);
O(f.userId,+new Date,f.senderName,f.lineText,false,f.chatroom,!!f.special);if(o&&h.hasClass("selected")){window.setTimeout(function(){A.scrollToBottom();
},0);}if(f.userId!=clientVars.userId&&!f.dontNotify){var m=Date.now();if(!$("#padchat").hasClass("chat-open")){A.totalUnreadChats++;
$("#padchat").addClass("chat-has-unread").attr("data-notification-count",A.totalUnreadChats);}else{A.totalUnreadChats=0;
$("#padchat").removeClass("chat-has-unread").removeAttr("data-notification-count");}if(!h.hasClass("selected")){var l=$('#padchat-users li[data-room="'+f.chatroom+'"]');
var n=+(l.attr("data-notification-count")||0);l.attr("data-notification-count",n+1);}Q[f.chatroom]=m;
if($("#padchat").hasClass("chat-open")&&h.hasClass("selected")){if(caps.hasLocalStorage){localStorage["chatLastTimeReadMessages_"+f.chatroom]=m;
}}X(f);}},receiveMention:function(f){A.receiveChat(f);},receiveInvite:function(f){f.lineText=f.inviter+' invited you to <a href="'+window.location.protocol+"//"+window.location.host+"/"+f.padId+'" target="_blank">'+padutils.escapeHtml(f.title)+"</a>";
f.special=true;f.chatroom="site";A.receiveChat(f);},handleUserJoinOrUpdate:function(f){K.push(A.nameToMention(f.name));
T(f.userId,{colorId:f.colorId,faded:false});},handleUserLeave:function(f){T(f.userId,{colorId:f.colorId,faded:true});
},updateUserCount:function(){var f=$("#padchat-users li[data-author]").length;$("#chat-num-online").text(f<=1?"":"("+f+" online)");
},nameToInitials:function(h){var f=h.split(" ");return(f[0]||"")+(f.length>=2?" "+(f[f.length-1][0]||""):"");
},nameToMention:function(f){return A.nameToInitials(f).replace(/\s/g,"");},handleUserSiteJoinOrUpdate:function(f){K.push(A.nameToMention(f.name));
var j=$('#padchat-users li[data-author="'+f.userId+'"]').hasClass("selected");$('#padchat-users li[data-author="'+f.userId+'"]').remove();
$("#padchat-users").append($("<li>").attr("data-author",f.userId).attr("data-room",f.userId).attr("title",f.name).toggleClass("selected",j).append($("<img>").attr("src",f.userPic)).append($("<span>").text(A.nameToInitials(f.name))));
$("#padchat-users li[data-author]").tsort();A.updateUserCount();if(E[f.userId]){var h={};h.lineText=f.name+" is online.";
h.special=true;h.dontNotify=true;h.chatroom=f.userId;A.receiveChat(h);}},handleUserSiteLeave:function(h){$('#padchat-users li[data-author="'+h.userId+'"]').addClass("offline");
A.updateUserCount();var f={};f.lineText=h.name+" is offline.";f.special=true;f.dontNotify=true;f.chatroom=h.userId;
A.receiveChat(f);},scrollToBottom:function(){var f=$(B()).get(0);f.scrollTop=f.scrollHeight;},scrollToTop:function(){var f=$(B()).get(0);
f.scrollTop=0;},loadMoreHistory:function(){if(I){return false;}if(F[C]==0){return;}var f=F[C]==undefined;
if(f){F[C]=-1;}var h=F[C];var o=Math.max(0,h-Z);var m=pad.getPadId();I=true;$(B()+".chatloadmore").css("display","none");
$(B()+".chatloadingmore").css("display","block");$.ajax({type:"get",url:"/ep/pad/chathistory",data:{padId:m,start:o,end:h,chatroom:C},success:n,error:l});
function n(v){j();var s=JSON.parse(v);var p=$(B()).get(0);var r=function(){return 0;};var q=$(B()+".chatday:first .chatline:first").children().eq(0);
if(q.length>0){var t=q.position().top;var u=p.scrollTop;r=function(){var w=q.position().top;return w+(u-t);
};}N(s);if(f){A.scrollToBottom();}else{p.scrollTop=Math.max(0,Math.min(p.scrollHeight,r()));}}function l(){j();
}function j(){I=false;$(B()+".chatloadmore").css("display","block");$(B()+".chatloadingmore").css("display","none");
}return false;}};return A;}());var padinvitelog=(function(){var A={init:function(){if(!$("#inviteLog").length){return;
}$.get("/ep/api/pad-invite-info",{padId:pad.getPadId()},function(E){if(!E||!E.length){return;}var F=$("<div>").addClass("inviteLog-overflow").hide();
var G=$("<div>").addClass("inviteLog-extra").text("...").on("click",function(){G.hide();F.show();});for(var D=0;
D<E.length;D++){var C=E[D];var B;var H=E.length>20&&(D>9&&D<E.length-10);if(H&&D==10){$("#inviteLog").append(G).append(F);
}if(C.group){B=$($("#template-invite-group-entry").html());B.find(".collection").attr("href","/ep/group/"+C.group.groupId).text(C.group.name);
}else{if(C.user){B=$($("#template-invite-user-entry").html());B.find(".user").attr("href",C.user.userLink).text(C.user.name);
if(C.lastAccessedTimestamp){B.find(".lastAccessedTimestamp").attr("title",C.lastAccessedTimestamp).prettyDate();
B.find(".lastAccessed").show();}}else{B=$($("#template-user-create-entry").html());}}B.find("img").attr("src",C.host.userPic);
B.find(".host").attr("href",C.host.userLink).text(C.host.name);B.find(".timestamp").attr("title",C.timestamp).prettyDate();
if(H){F.append(B);}else{$("#inviteLog").append(B);}}$("#inviteLog").show();});}};return A;}());
/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var paduserlist=(function(){var C={};
var F=false;var D={};var E={};var B={};var G=false;function H(J){var K=J.name||"Guest";var N=[K,J.status].join(" \n");
var M=J.status=="connected";var L=J.userId!=C.userId;var I=$($("#template-user-list").html());$(I).attr({id:"user"+J.userId.replace(".","-"),title:""});
if(J.userLink){$(I).find("figure a").attr("href",J.userLink);if(clientVars.isEmbed){$(I).find("figure a").attr("target","_blank");
}}else{$(I).find("figure a").attr("name","guest");}$(I).find("figure .user-image img").attr({"data-src":J.userPic||"/static/img/nophoto.png",alt:""});
if(!M){$(I).find("span.connected").remove();}$(I).find("figcaption span").text(K);if(L){$(I).find("figcaption img").attr({"data-userId":J.userId,"data-name":K});
}else{$(I).find("figcaption img").remove();}return I;}var A={init:function(J,L,K,M){A.setMyUserInfo(J);
F=M;$("#otheruserstable li").remove();for(var I=0;I<K.length;I++){A.groupJoinOrUpdate(K[I]);}for(var I=0;
I<L.length;I++){A.userJoinOrUpdate(L[I]);}A.userJoinOrUpdate(J);G=true;A.updateUserList();window.setInterval(A.updateUserList,1000);
var N=function(){if($("#otheruserstable").hasClass("open")){$("#otheruserstable, #otheruserstable-wrapper").removeClass("open").scrollTop(0);
A.updateShareSummary();}else{$("#otheruserstable, #otheruserstable-wrapper").addClass("open");$("#otheruserstable img[data-src]").each(function(O){$(this).attr("src",$(this).attr("data-src")).removeAttr("data-src");
});}};$("#otherusers-facepile, #sharesummary").on("click",function(O){N();return false;});$("body").on("click",function(O){if($(O.target).is("#otherusers")||$(O.target).parents("#otherusers").length||$(O.target).is("#killuser")||$(O.target).parents("#killuser").length){return;
}$("#otheruserstable, #otheruserstable-wrapper").removeClass("open").scrollTop(0);});$(".killuser").live("click",function(S){S.preventDefault();
var R=$(this).attr("data-userId");var Q=$(this).attr("data-name");var O=typeof(pad)!="undefined"?pad.getPadOptions().guestPolicy:"deny";
var P=$("select.padaccess option[value="+O+"]").text();$("#killuser span.name").text(Q);$("#killuser span.access").text(P);
$("#killuser-access").toggle(O=="link"||O=="allow");$("#killuser-form input#userId").val(R);modals.showHTMLModal("#killuser");
return true;});},setMyUserInfo:function(I){C=$.extend({},I);},userEdited:function(I){if(I&&I!=C.userId){D[I]=new Date();
}},userListQueue:[],userListHighlight:false,userJoinOrUpdate:function(I){if(!$("#otheruserstable").length){return;
}A.userListHighlight=false;if(G&&!B[I.userId]){A.userListHighlight=true;}B[I.userId]=I;if(I.status=="editor"||I.status=="invited"){D[I.userId]=true;
}function L(M,O){if(typeof(M)=="object"){for(var N=0;N<M.length;N++){if(M[N]<O[N]){return true;}}}else{return M<O;
}return false;}function J(P){var N=P.attr("id").slice(4).replace("-",".");var M=B[N];if(!M){return[true,true,true,""];
}var O=clientVars.friendUserIds.indexOf(parseInt(N.slice(2)))>-1;return[M.status!="connected"&&N==clientVars.userId,N!=clientVars.userId,M.userPic==null,!O,M.name?M.name.toLowerCase():""];
}function K(O,M){M=$(M);var P=O.find("li");for(var N=0;N<P.length;N++){var Q=$(P[N]);if(L(J(M),J(Q))){Q.before(M);
return;}}O.append(M);}A.userListQueue.push(function(){$("#otheruserstable #user"+I.userId.replace(".","-")).remove();
var M=H(I);K($("#otheruserstable"),M);window.setTimeout(function(){var O=$("#otheruserstable");var N=M.find("img[data-src]");
if(N.length&&N.offset().top-O.offset().top<O.height()){N.attr("src",N.attr("data-src")).removeAttr("data-src");
}$("#otherusers-facepile").attr("src",$("#otheruserstable li:first-child img").attr("src"));},0);});},updateUserList:function(){if(!A.userListQueue.length||!$("#otheruserstable").length){return;
}$("#otheruserstable").hide();for(var I=0;I<A.userListQueue.length;++I){A.userListQueue[I]();}$("#otheruserstable").show();
A.userListQueue=[];if($("#otheruserstable li").length>=2){$("#sharesummarywrapper").show();}A.updateShareSummary(A.userListHighlight);
A.userListHighlight=false;},userLeave:function(I){if(I.userId==C.userId){return;}if(!D[I.userId]){$("#user"+I.userId.replace(".","-")).remove();
delete B[I.userId];A.updateShareSummary();}else{I.status="disconnected";A.userJoinOrUpdate(I);}},userKill:function(I){delete D[I.userId];
delete B[I.userId];$("#user"+I.userId.replace(".","-")).remove();A.updateShareSummary();},updateShareSummary:function(N){var I=[];
function J(Q){return $("<span class='sharesummarypart'/>").text(Q);}for(var O in E){I.push(J(E[O].name));
}var P=0;var L=0;for(var M in B){if(M==C.userId){continue;}if(I.length<2){I.push(J(B[M].name));}else{L++;
}P++;}if(F){I.push(J(C.name));}if(L){I.push(J("and "+L+" others"));}$("#sharesummary").empty();if(!I.length){$("#sharesummary").append(J("nobody"));
}for(var K=0;K<I.length;K++){$("#sharesummary").append(I[K]);if(K<I.length-1){$("#sharesummary").append(J(", "));
}}if(N){$("#sharesummary").css("background-color","#FCFFB3").animate({"background-color":"transparent"},1000);
}$("#otherusers-facepile").toggleClass("multiple",$("#otheruserstable li").length>=2);window.setTimeout(function(){var Q=$("#otheruserstable");
if($("#otheruserstable").hasClass("open")){return;}Q.find("li").each(function(T,S){S=$(S);var R=S.find("img[data-src]");
if(R.length&&R.offset().top-Q.offset().top<Q.height()){R.attr("src",R.attr("data-src")).removeAttr("data-src");
}else{if(R.length){return false;}}});},0);},groupJoinOrUpdate:function(I){$("#sharesummarywrapper").show();
E[I.groupId]=I;A.updateShareSummary();}};return A;}());
/*
 * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
 * http://benalman.com/projects/jquery-dotimeout-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(A){var B={},D="doTimeout",C=Array.prototype.slice;
A[D]=function(){return E.apply(window,[0].concat(C.call(arguments)));};A.fn[D]=function(){var F=C.call(arguments),G=E.apply(this,[D+F[0]].concat(F));
return typeof F[0]==="number"||typeof F[1]==="number"?this:G;};function E(G){var O=this,L,F={},Q=G?A.fn:A,J=arguments,P=4,H=J[1],K=J[2],I=J[3];
if(typeof H!=="string"){P--;H=G=0;K=J[1];I=J[2];}if(G){L=O.eq(0);L.data(G,F=L.data(G)||{});}else{if(H){F=B[H]||(B[H]={});
}}F.id&&clearTimeout(F.id);delete F.id;function M(){if(G){L.removeData(G);}else{if(H){delete B[H];}}}function N(){F.id=setTimeout(function(){F.fn();
},K);}if(I){F.fn=function(R){if(typeof I==="string"){I=Q[I];}I.apply(O,C.call(J,P))===true&&!R?N():M();
};N();}else{if(F.fn){K===undefined?M():F.fn(K===false);return true;}else{M();}}}})(jQuery);