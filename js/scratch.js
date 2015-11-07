/*----------------------------------------------------------------
@ Name:   H5canvas刮刮卡效果，暂不支持PC
@ Author: 繁花落尽
@ QQ:     863139978
@ Time:   2015/9/7
*/
var ggk =  {
	hei: $(window).height(),
	flag: true,
	init: function(s,w,p){    //S 图片蒙层    W 笔触宽度    p 刮开百分比
		var ths = this;
		var scr = '';
		if($('#scratch').length>0){
			scr = $('#scratch').get(0);
		}else{
			scr = document.createElement('canvas');
			scr.id = 'scratch';
			scr.className = 'page scratch';
			scr.width = 640;
			scr.height = ths.hei+'px';
			document.body.appendChild(scr);
		}
		var can = scr.getContext('2d');
		var sty = '.scratch { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index:99; }';
		$('head').append('<style class="style-scratch">'+sty+'</style>');

		var img = new Image();
		img.src = s||'../../images/scratch.jpg';
		img.onload = function(){
			can.drawImage(img, (640-ths.wid())/2, 0 , ths.wid(), ths.hei);
			can.strokeStyle = 'gray';
			can.lineWidth = w||50;
			can.lineCap = 'round';
			can.globalCompositeOperation = 'destination-out';

			ths.slide($('#scratch'), can, p);
		}
	},
	slide: function(obj,can,per){
		var ths = this;
		obj.on('touchstart', function(e){
			//var tou = e.originalEvent.changedTouches[0];
			var tou = e.touches[0];
			var x = tou.pageX - $(this).offset().left;
			var y = tou.pageY - $(this).offset().top;
			if(ths.flag){
				ths.flag = false;
				can.moveTo(x,y);
				can.lineTo(x+1, y+1);
			}else{
				can.lineTo(x+1, y+1);
			}
			can.stroke();

			obj.on('touchmove.move', function(e){
				//var tou = e.originalEvent.changedTouches[0];
				var tou = e.changedTouches[0];
				var x = tou.pageX - $(this).offset().left;
				var y = tou.pageY - $(this).offset().top;
				can.lineTo(x, y);
				can.stroke();
			})

			obj.on('touchend.move', function(e){
				var imgData = can.getImageData(0, 0, ths.wid(), ths.hei);
				var aPx = imgData.width * imgData.height;
				var num = 0;
				for(var i=0; i<aPx; i++){
					if(imgData.data[4*i+3] == 0){
						num++;
					}
				}
				console.log(num+',,'+aPx*per)
				if(num > aPx*per){
					obj.animate({opacity: 0}, 1000, function(){
						$(this).remove();
						$('.style-scratch').remove();
						//$('.showLayer').show();
					})
					$('.showLayer').fadeIn().append('<div class="slIn"></div>');
					layer();
				}

				obj.off('.move');
			})

		})
	},
	wid: function(){
		var w = 640*this.hei/960;
		w = w > 640?w : 640;
		return w;
	}
}
ggk.init('images/mask.jpg', 80, 0.6);
