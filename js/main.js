$(document).ready(function() {

  // Text animation on cover of page
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


   // Scroll Down Indicator 
   let triangleDisplayDelay = 3000;
	setTimeout(function() {
		$('#page1').addClass('show-triangle');
	}, triangleDisplayDelay);

	// Hide the triangle when the user starts scrolling
	$(window).on('scroll', function() {
		$('#page1').removeClass('show-triangle');
	});
	

   // Painting Function on Cover of Page
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

	// Define an array of predefined colors

	// -- pastels 
	// const predefinedColors = ["#fbf8cc", "#fde4cf", "#ffcfd2", "#f1c0e8", "#cfbaf0", "#a3c4f3", "#90dbf4", "#8eecf5", "#98f5e1", "#b9fbc0"]
	// -- more pop 
	// const predefinedColors = ["#f94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1"]
	const predefinedColors = ["#ff7b00","#ffe300","#ff9500","#ffcc84","#ffaa00","#ffb700"]

	function getRandomColor() {
		// Select a random color from the predefined array
		const randomIndex = Math.floor(Math.random() * predefinedColors.length);
		return predefinedColors[randomIndex];
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
        this.maxBlotches = 10; // Maximum number of blotches before clearing
    }

    newBlotch(x, y) {
        let blotch = new Blotch(x, y);
        this.blotches.push(blotch);
        if (this.blotches.length >= this.maxBlotches) {
            this.clearCanvasAndRestart();
        }
        return blotch;
    }

    isRunningBlotch() {
        for (let i = 0; i < this.blotches.length; i++) {
            if (this.blotches[i].isRunning) {
                return true;
            }
        }
        return false;
    }

    clearCanvasAndRestart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        this.blotches = []; // Reset the blotches array
        // You can add any additional logic here if needed
    }
	}


   let blotches = new Blotches(); 


   // -- paint options 

   isOnTouch = false; 
   window.addEventListener('touchstart', function onFirstTouch() {
       isOnTouch = true; 

       // we only need to know once that a human touched the screen, so we can stop listening now
       window.removeEventListener('touchstart', onFirstTouch, false);
   }, false);

	let isPaintingModeOn = false;
   // -- turning painting mode on 
   $("#paintbrush-option").on("click", function() {
		isPaintingModeOn = true;
   		// -- register mouse down events 
   		document.addEventListener('mousedown', function(e) {
      // -- after first tap hide touch-anywhere dialogue 
      $("#touch-anywhere").remove(); 
        
   		if(!blotches.isRunningBlotch()) {
   			ctx.moveTo(mouse.x, mouse.y); 
   			blotches.newBlotch(mouse.x, mouse.y); 
   		}

  		}, false); 

  		// -- or touch events if on mobile 
   		document.addEventListener('tap', function(e) {
   			
   			// -- after first tap hide touch-anywhere dialogue 
   			$("#touch-anywhere").remove(); 

	   		if(!blotches.isRunningBlotch()) {
	   			ctx.moveTo(mouse.x, mouse.y); 
	   			blotches.newBlotch(mouse.x, mouse.y); 
	   		}

  		}, false); 

  		// -- if touch enabled show the "touch anywhere" dialogue after they click brush 
  		if(isOnTouch) {
  			$("#touch-anywhere").show(); 
  		}

  		// -- change cursor 
  		$("canvas, #page1").css({
  			cursor: 'url("images/CustomBrushLogo.png"), auto'
  		})

  		// -- remove paintbrush 
  		$("#paint-options").remove(); 

   })

// Function to generate a random blotch
function generateRandomBlotch() {
	if(!isPaintingModeOn) {
    // Get random positions within the canvas bounds
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    // Create a new blotch at the random position
    blotches.newBlotch(x, y);
	}
}

// Periodically generate random blotches
var blotchTimeInterval = 2000
// -- Start with one blotch immediately 
generateRandomBlotch();
// -- then set interval 
const blotchInterval = setInterval(generateRandomBlotch, blotchTimeInterval); // Adjust the 2000ms (2 seconds) interval as needed


})



