$(function(){
	var canvas=$("#canvas").get(0);
	var ctx=canvas.getContext("2d");
	var sep=40;
	var sR=5;
	var bR=18;
	var qizi={};
	var flag=true;
	var AI=false;
	var kongbai={};
	var gamestate="pause";
	$('.time1').addClass('t1');
	var audio1=$("#audio1").get(0);
	var audio=$("#audio").get(0);
	audio1.play();
	function l(x){
		return (x+0.5)*sep+0.5;
	}
	function drawqipan(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
			ctx.moveTo(l(0),l(i));
			ctx.lineTo(l(14),l(i));
			ctx.moveTo(l(i),l(0));
			ctx.lineTo(l(i),l(14));
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		circle(3,3);
		circle(7,7);
		circle(11,3);
		circle(3,11);
		circle(11,11);
	}
	for (var i = 0; i <15; i++) {
			for (var j = 0; j <15; j++) {
				kongbai[m(i,j)]=true;
			}
		}
	   drawqipan();
	
	
	function circle(x,y){
		ctx.save();
		ctx.translate(0,0);
		ctx.beginPath();
		ctx.arc(l(x),l(y),sR,0,Math.PI*2);
		ctx.fill();
		ctx.closePath()
		ctx.restore();
	}
	
	function luozi(x,y,color){
		 gamestate="play";
		 ctx.save();
		 ctx.translate(l(x),l(y));
		 ctx.beginPath();
		 var g=ctx.createRadialGradient(-5,-5,0,0,0,18);
		  if(color==="black"){
        	 
        	 g.addColorStop(0.01,"#fff");
        	 g.addColorStop(0.01,"#eee");
        	 g.addColorStop(1,"#000");
        	 audio.play();
        	$('.time2').addClass('t1');
            $('.time1').removeClass('t1');
            
            
            
        	
       }else{
        	 g.addColorStop(0.1,"#fff");
        	 g.addColorStop(0.1,"#fff");
        	 g.addColorStop(1,"#ddd")
        	 audio.play();
        	 $('.time1').addClass('t1')
             $('.time2').removeClass('t1')
            
            
             
        }
         ctx.fillStyle=g;
         ctx.arc(0,0,bR,0,Math.PI*2);
         ctx.fill();
		 ctx.closePath();
		 ctx.restore();
		 qizi[x+"_"+y]=color;
		 delete kongbai[m(x,y)];
		 gamestate="play";
	}
	
    function intel(){
		var max=-Infinity;
		var max2=-Infinity;
		var pos={};
		var pos2={}
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"black");
			if (q>max) {
				max=q;
				pos={x:x,y:y};
			}
			
		}
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"white");
			if (q>max2) {
				max2=q;
				pos2={x:x,y:y};
			}
			
		}
		if (max>max2) {
			return pos;
		}else{
			return pos2;
		}
		
	}
	//生成棋谱
	var i=0;
	 chessmanual=function(){
	 	ctx.save();
	 	ctx.font='20px/1 微软雅黑';
	 	ctx.textAlign="center";
	 	ctx.textBaseline="middle";
	 	for(var k in qizi){
	 		
	 		var arr=k.split("_");
	 		if(qizi[k]=="black"){
	 			ctx.fillStyle="white";
	 		}else{
	 			ctx.fillStyle="black";
	 		}
	 		ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])));
	     }
	 	
	 	ctx.restore();
	 	  $(".box1").addClass("active");
	 	  if ($(".box1").find("img").length) {
		    $(".box1").find("img").attr("src",canvas.toDataURL());
	      }else{
		   $("<img>").attr("src",canvas.toDataURL()).appendTo(".box1");
	      }
	      if ($(".box1").find("a").length) {
		   $(".box1").find("a").attr("href",canvas.toDataURL());
	      }else{
		  $("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box1")
	      }
	 }
	 //点击生成棋谱
	$(".qipu").on("click",function(){
		location.reload();
	})
	$(".qipu1").on("click",function(){
		chessmanual();
	})
	//记录棋子的位置
	function handclick(e){
		 var x=Math.floor(e.offsetX/sep);
		 var y=Math.floor(e.offsetY/sep);
		 clearInterval(t);
		 clearInterval(t1);
		 if(qizi[x+"_"+y]){
		 	return ;
		 }
		 if (AI) {
			luozi(x,y,'black');
			if (panduan(x,y,"black")>=5) {
		     	$('.pan').find('.win').html('黑棋赢').end().addClass('active1');
            	$(canvas).off("click");
		     }
			var p=intel();
			luozi(p.x,p.y,"white");
			if (panduan(p.x,p.y,"white")>=5) {
		     	$('.pan').find('.win').html('白棋赢').end().addClass('active1');
            	$(canvas).off("click");
		     };
			return false;
		}
		
		 if(flag){
		 	luozi(x,y,"black")
		 	time1();
            $(".djs span").html("30");
            if(panduan(x,y,"black")>=5){
            	$(canvas).off("click");
            	$('.pan').find('.win').html('黑棋赢').end().addClass('active1');
            	
            }
          }else{
		 	 luozi(x,y,"white");
		 	 $(".djs1 span").html("30");
		 	 if(panduan(x,y,"white")>=5){
		 	 	$(canvas).off("click");
            	$('.pan').find('.win').html('白棋赢').end().addClass('active1');
            	
            }
		    time();
		 }
		 flag=!flag
	}
	
	function again(){    //重新开始
		qizi={};
        flag=true;
        $(canvas).off('click');
        $(canvas).on('click',handclick);
        drawqipan();
        gamestate="pause";
        
    }
	$(canvas).on("click",handclick);
	$(".again").on("click",function(){
		 $('.pan').removeClass('active1');
		  again();
		  clearInterval(t);
		  clearInterval(t1);
		  
    })
	//判断四个方向
	function m(x,y){
		return x +"_" +y;
	}
	function panduan(x,y,color){
		var row=1;
		var i;
		i=1;
		while(qizi[m(x+i,y)]==color){
			row++;
			i++;
		}
		i=1;
		while(qizi[m(x-i,y)]==color){
			row++;
			i++;
		}
		var lie=1;
		i=1;
		while(qizi[m(x,y-i)]==color){
			lie++;
			i++;
		}
		while(qizi[m(x,y+i)]==color){
			lie++;
			i++;
		}
		var zx=1;
		i=1;
		while(qizi[m(x+i,y+i)]==color){
			zx++;
			i++;
		}
		while(qizi[m(x-i,y-i)]==color){
			zx++;
			i++;
		}
		var yx=1;
		i=1;
		while(qizi[m(x+i,y-i)]==color){
			yx++;
			i++;
	    }
		while(qizi[m(x-i,y+i)]==color){
			yx++;
			i++;
		}
		return Math.max(row,lie,zx,yx);
	}
	//秒表计时
	  var t;
	  var t1;
	  function time() {
        var s=30;
        t=setInterval(function (){
            tx=s<30?"0"+s:s;
            s--;
            if(s<0){
              clearInterval(t);
            }
            $('.djs').find('span').text(tx);
        },1000)
    }
        function time1() {
        var s=30;
        t1=setInterval(function () {
            tx=s<30?"0"+s:s;
            s--;
            if(s<0){
               clearInterval(t1);
            }
            $('.djs1').find('span').text(tx);
        },1000)
      }
       $(".start1").on("click",function(){
           $(".startbox").addClass("up");
        })
       $(".she").on("click",function(){
       $(".set").show();
      }) 
       $(".cha").on("click",function(){
       $(".set").hide();
       })
	   $(".col").on("click",false);
	   $(".col1").on("click",function(){
	  if($(this).attr("id")){
	    $(this).removeAttr("id");
	    audio1.play();
	    
	  }else{
	    $(this).attr("id","huantu");
	    audio1.pause();
	  }
      })
	$(".col2").on("click",function(){
	  if($(this).attr("id")){
	    $(this).removeAttr("id");
	  }else{
	    $(this).attr("id","huantu");
	  }
	})
	$(".jt").on("click",function(){
	    $(".set1").show();
	    $(".set").hide();
	})
	$(".set1 .cha").on("click",function(){
	    $(".set1").hide();
	    $(".set").show();
	})
	$(".bat2").on("click",function(){
		  again();
		  clearInterval(t);
		  clearInterval(t1);
	})
	$(".close").on("click",function(){
		$(this).parent().removeClass('active');
		for(var k in qizi){
			console.log(qizi);
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			luozi(x,y,qizi[k]);
		}
	})
	$(".bat").on("click",function(){
		 if (gamestate==="play") {
		     return;
	    }
		else{
			AI=true;
		}
	  
	})
	$(".bat3").on("click",function(){
		if (gamestate==="play") {
		return;
	  }
		else{
			AI=false;
		}
	   
	})
	
})
