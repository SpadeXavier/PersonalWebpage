$(document).ready(function() {


  // PAGE 1 ANIMATIONS 

  // -- helper functions  
  var TxtRotate = function(el, toRotate, period) {
	  this.toRotate = toRotate;
	  this.el = el;
	  this.loopNum = 0;
	  this.period = parseInt(period, 10) || 2000;
	  this.txt = '';
	  this.tick();
	  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

  // -- logic 	
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // -- injecting css into page 
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);

   // PAGE 1 PAINTING FUNCTION 
   var canvas = document.getElementById("myCanvas"); 
   var ctx = canvas.getContext('2d'); 
   resize(); 
   
   function resize() {
   	   canvas.width = window.innerWidth; 
   	   canvas.height = window.innerHeight; 
   }
   window.addEventListener("resize", resize); 

   canvas.style.width = "100%"; 
   canvas.style.height = "100%"; 

   ctx.lineWidth = 3; 
   ctx.lineJoin = 'round'; 
   ctx.lineCap = 'round'; 
   ctx.strokeStyle = '#00CC99'; 


   var mouse = {x:0, y: 0}; 
   document.addEventListener('mousemove', function(e) {
	   	mouse.x = e.pageX; 
	   	mouse.y = e.pageY; 
   })

   document.addEventListener('touchmove', function(e) {
   		mouse.x = e.touches[0].pageX; 
   		mouse.y = e.touches[0].pageY; 
   })

	
   var Blotch = function(x, y) {
   	   this.x = x; 
   	   this.y = y; 
   	   this.radius = 0; 
   	   this.delta = 100;
   	   this.isRunning = false;  
   	   this.iteration = 0; 
   	   this.expand();
   	   //this.getRandomBlobPos(this.x, this.y);  
   }
 
   Blotch.prototype.expand = function() {
   		this.iteration++; 

   		if(this.iteration == 1) {
   			// -- set baseline attributse 
   			ctx.fillStyle = getRandomColor(); 
   			this.radius = Math.max(canvas.height, canvas.width) / 20; 
   		}
   		this.isRunning = true; 

   		var points = this.getRandomBlobPos(this.x, this.y); 

   		let cpath = `M${points[0].x},${points[1].y}`;
   		for(let point of points) {
   			cpath += `S${point.mx}, ${point.my},${point.x}, ${point.y}`; 
   		}
   		cpath += "Z"; 
   		let p = new Path2D(cpath); 
   		ctx.fill(p) 

   		this.radius += getRandomInt(5,10); 

   		let that = this; 

   		if(this.radius < Math.max(canvas.height, canvas.width) / 10) {
		  setTimeout(function() {
		   	that.expand(); 		  
		   }, this.delta);

   		}
   		else {
   			this.isRunning = false; 
   		}


   }

   Blotch.prototype.getRandomBlobPos = function(mouseX,mouseY) {
   		let angles = [0, 90, 180, 270]; 
   		angles = [
   			getRandomInt(0, 90-45), 
   			getRandomInt(90, 180-45), 
   			getRandomInt(180, 270-45), 
   			getRandomInt(270, 360-45)]

   		const positions = []; 
   		for (let a in angles) {
   			const angle = (angles[a] * Math.PI) / 180;
   			let ba = ((angles[a] - 20) * Math.PI) / 180; 
   			let rr = this.radius + getArbitraryRandomInt(40,100); 
   			positions.push({
   				x: mouseX + this.radius * Math.sin(angle), 
   				y: mouseY + this.radius * Math.cos(angle), 
   				mx: mouseX + rr * Math.sin(ba), 
   				my: mouseY + rr * Math.cos(ba)
   			})
   		} 
   		positions.push(positions[0]); // -- connect back to beggining? 
   		return positions; 

   }

   function getRandomColor() {
   		var letters = '0123456789ABCDEF';
   		var color = '#'; 
   		for(var i = 0; i < 6; i++) {
   			color += letters[getRandomInt(0,15)]
   		}
   		return color; 
   }

   function getRandomInt(min, max) {
   		min = Math.ceil(min); 
   		max = Math.floor(max);
   		return Math.floor(Math.random() * (max - min + 1)) + min; 
   }

   function getArbitraryRandomInt(min, max) {
   		const sign = Math.random() < .4 ? -1 : 1; 
   		return sign * getRandomInt(min, max); 
   }
   // class to manage blotches 
   class Blotches {
   		constructor() {
   			this.blotches = []; 
   		}

   		newBlotch(x,y) {
   			let blotch = new Blotch(x,y); 
   			this.blotches.push(blotch);
   			return blotch; 
   		}

   		isRunningBlotch() {
   			for(i = 0; i < this.blotches.length; i++) {
   				if(this.blotches[i].isRunning) {
   					return true; 
   				}
   			}
   			return false; 
   		}
   }


   let blotches = new Blotches(); 


	function is_touch_enabled() { 
	    return ( 'ontouchstart' in window ) ||  
	           ( navigator.maxTouchPoints > 0 ) ||  
	           ( navigator.msMaxTouchPoints > 0 ); 
	} 

   // -- paint options 

   // -- turning painting mode on 
   $("#paintbrush-option").on("click", function() {
   		console.log("Painting mode: on"); 

   		// -- register mouse down events 
   		document.addEventListener('mousedown', function(e) {

   		if(!blotches.isRunningBlotch()) {
   			ctx.moveTo(mouse.x, mouse.y); 
   			blotches.newBlotch(mouse.x, mouse.y); 
   		}

  		}, false); 

  		// -- or touch events if on mobile 
   		document.addEventListener('tap', function(e) {
   			
   			console.log("HIDE"); 
   			// -- after first tap hide touch-anywhere dialogue 
   			$("#touch-anywhere").hide(); 

	   		if(!blotches.isRunningBlotch()) {
	   			ctx.moveTo(mouse.x, mouse.y); 
	   			blotches.newBlotch(mouse.x, mouse.y); 
	   		}

  		}, false); 

  		// -- if touch enabled show the "touch anywhere" dialogue after they click brush 
  		if(is_touch_enabled()) {
  			$("#touch-anywhere").show(); 
  		}

  		// -- change cursor 
  		$("canvas, #page1").css({
  			cursor: 'url("images/CustomBrushLogo.png"), auto'
  		})

  		// -- remove paintbrush 
  		$("#paint-options").remove(); 

   })

})



