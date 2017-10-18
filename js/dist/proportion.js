let propGraphParams={regions:[],propWidth:null,propHeight:null,squareOuterLength:null,columnLength:null,squares:[],canvases:[]},getSquareOuterLengthHelper=function(a,b,c){var d=Math.ceil;let e=d(Math.sqrt(c*b/a));return Math.floor(e*a/b)*e<c?a/d(e*a/b):b/e},getSquareOuterLength=function(a,b,c){let d=getSquareOuterLengthHelper(b,a,c),e=getSquareOuterLengthHelper(a,b,c);return Math.floor(Math.max(d,e))},initPropGraph=function(a){allRegionsDrawn=!1,propGraphParams.regions=comparisonData[a]},updatePropGraphParams=function(){let a=$('.proportion-graph-wrapper').width(),b=$('.proportion-graph-wrapper').height(),c=propGraphParams.regions[0].numSquares;squareOuterLength=getSquareOuterLength(a,b,c),columnLength=Math.floor(b/squareOuterLength),squares=getGridSquares(c,squareOuterLength,columnLength),propGraphParams.propWidth=a,propGraphParams.propHeight=b,propGraphParams.numSquares=c,propGraphParams.squareOuterLength=squareOuterLength,propGraphParams.columnLength=columnLength,propGraphParams.squares=squares},getGridSquares=function(a,b,c){return d3.range(0,a).map(function(a){return{id:a,x:b*Math.floor(a/c),y:b*(a%c)}})},updatePropGraph=function(a=!0){if(0!=propGraphParams.regions.length)return updatePropGraphParams(),Promise.all([setAllRegionSquares(),getHoverMap(),createCanvases()]).then(function(){return drawAllCanvases(a)})},drawAllCanvases=function(a){let b=propGraphParams.regions,c=Promise.resolve();for(let d in b)addCanvas(d),a?0==d?c=c.then(function(){return Promise.all([showCanvas(d,1e3),drawRegion(d),showHoverText(d,2e3)])}):c=c.then(function(){return Promise.all([showCanvas(d,1e3)])}).then(function(){return Promise.all([showHoverText(d,2e3),drawRegion(d,a)])}):(showCanvas(d,0),drawRegion(d));return c=c.then(function(){let a=propGraphParams.regions[0].unit;return updateStoryText(2e3,'Each square is the equivalent of <b>$'+a+'</b>')}).then(function(){allRegionsDrawn=!0}),c},shuffleArray=function(b){for(let a,c=b.length;c;c--)a=Math.floor(Math.random()*c),[b[c-1],b[a]]=[b[a],b[c-1]];return b},createCanvases=function(){return new Promise(function(a){let b=propGraphParams.regions,c=propGraphParams.propWidth,d=propGraphParams.propHeight,e=propGraphParams.canvases=[],f=propGraphParams.regions[0].unit;updateStoryText(2e3,'Each square is the equivalent of <b>$'+f+'</b>');let g;for(let f in b){let a=document.createElement('canvas');e.push(a),g=d3.select(a).attr('class',function(){return 1==f?'animated':'non-animated'}).attr('width',c).attr('height',d)}g.call(addMouseEvent),d3.selectAll('canvas').transition().duration(500).style('opacity',0).remove().end(a)})},addMouseEvent=function(a){var b=Math.floor;let c=propGraphParams.hoverMap,d=propGraphParams.regions,e=propGraphParams.numSquares;a.on('mousemove',function(){if(allRegionsDrawn){let a=d3.event.offsetX,c=d3.event.offsetY,d=b(a/squareOuterLength),e=b(c/squareOuterLength),f=d*columnLength+e;f in propGraphParams.hoverMap?showProperRegion(f):showAllRegions()}}).on('mouseout',function(){allRegionsDrawn&&showAllRegions()})},getHoverMap=function(){let a=propGraphParams.hoverMap={},b=propGraphParams.regions;for(let c=b.length-1;-1<c;c--){let d=b[c],e=d.squares;for(let b in e){let d=e[b],f=d.id;a.hasOwnProperty(f)||(a[f]=c)}}},showHoverText=function(a,b){let c=propGraphParams.regions[a],d=c.text+' <b>$'+c.money+'</b>';return $('.dynamic-text').html()==d?Promise.resolve():updateStoryText(b,d)},showProperRegion=function(a){let b=propGraphParams.hoverMap,c=b[a];showHoverText(c,2e3),0==c?showOuterMainRegion():1==c?showInnerMainRegion():showComparisonRegion(c)},showAllRegions=function(){let a=propGraphParams.canvases,b=propGraphParams.regions[0].unit;updateStoryText(2e3,'Each square is the equivalent of <b>$'+b+'</b>');for(let b=0;b<a.length;b++)showCanvas(b)},showOuterMainRegion=function(){let a=propGraphParams.canvases;showCanvas(0);for(let b=1;b<a.length;b++)hideCanvas(b)},showInnerMainRegion=function(){let a=propGraphParams.canvases;showCanvas(1),makeCanvasOpaque(0,0.3);for(let b=2;b<a.length;b++)hideCanvas(b)},showComparisonRegion=function(a){let b=propGraphParams.canvases;for(let c=0;c<b.length;c++)c==a?showCanvas(c):makeCanvasOpaque(c)},addCanvas=function(a){let b=propGraphParams.canvases,c=b[a];d3.select(c).style('opacity','0'),$('.proportion-graph-wrapper').append(c)},showCanvas=function(a,b=100){return new Promise(function(c){let d=propGraphParams.canvases,e=d[a];d3.select(e).transition().duration(b).style('opacity','1').end(c)})},hideCanvas=function(a){let b=propGraphParams.canvases,c=b[a];d3.select(c).transition().duration(100).style('opacity','0')},makeCanvasOpaque=function(a){let b=propGraphParams.canvases,c=b[a];d3.select(c).transition().duration(100).style('opacity','0.3')},changeOpacity=function(a,b){return a.replace(/[\d\.]+\)$/g,b+')')},drawRegion=function(a,b=!1){return new Promise(function(c){let d,e,f,g=propGraphParams.canvases[a],h=propGraphParams.regions[a],i=propGraphParams.squareOuterLength,j=h.squares,k=h.numSquares,l=g.getContext('2d');d=Math.floor(i/9),0==d&&(d=0.5),e=i-d,b&&(j=shuffleArray(j),f=800/j.length),l.fillStyle=h.color;for(let a=0;a<k;++a){const c=j[a];b?setTimeout(function(){l.fillRect(c.x,c.y,e,e)},f*a):l.fillRect(c.x,c.y,e,e)}b?setTimeout(function(){c()},f*(k-1)):c()})},drawRegionByColumn=function(a){let b,c,d=propGraphParams.canvases[a],e=propGraphParams.regions[a],f=propGraphParams.squareOuterLength,g=e.squares,h=e.numSquares,k=d.getContext('2d'),j=propGraphParams.columnLength;b=Math.floor(f/9),0==b&&(b=0.5),c=f-b,k.fillStyle=e.color;let l=h;for(let b,d=0;d<h;d+=j)b=0<l-j?j:l,setTimeout(function(){for(let a=0;a<b;++a){const b=g[d+a];k.fillRect(b.x,b.y,c,c)}},10*d),l-=j},setAllRegionSquares=function(){let a=1,b=propGraphParams.regions,c=propGraphParams.squareOuterLength,d=propGraphParams.columnLength,e=b[1].numSquares;'Tax breaks totaled '==b[0].text&&(e=0);for(let c=0;c<b.length;c++){let d=b[c],f=d.numSquares;2>c?a=setSubregionSquares(d,f,0,1):('Tax breaks totaled '==b[0].text&&2==c&&(a=1),a=setSubregionSquares(d,f,e,a)),1<c&&(e+=f)}},setSubregionSquares=function(a,b,c,d){a.squares=[];let e=propGraphParams.squares,f=propGraphParams.columnLength,g=a.squares;for(let e,h=0;h<b;h++)if(e=c+h,1==d){let a=getSquareObject(e);g.push(a),0==(e+1)%f&&(d=2)}else{let a=(Math.floor(e/f)+1)*f-e%f-1,b=getSquareObject(a);g.push(b),0==(e+1)%f&&(d=1)}return d},getSquareObject=function(a){let b=propGraphParams.squareOuterLength,c=propGraphParams.columnLength;return{id:a,x:b*Math.floor(a/c),y:b*(a%c)}};