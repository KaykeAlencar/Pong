class helper {
	constructor(){
		this.canvas = document.createElement("canvas")
		this.div = document.createElement("div")
		this.p = document.querySelector(".j1")
		this.p2 = document.querySelector(".j2")
		this.access = {}
		this.obj = undefined 
	}

	load(obj){
		this.obj = obj
		console.log(this.obj)
	}

	get pencil(){return this.canvas.getContext("2d")}

	LoadMusic(link){
		let audio = new Audio()
		audio.src = link
		audio.loop = true

		return audio
	}

	freeze(){
		cancelAnimationFrame(this.obj.request)
		clearInterval(this.obj.interval)

		this.access.y0 = this.obj.racket0.y
		this.access.y1 = this.obj.racket1.y
	} 

	unfreeze(){
		this.obj.racket0.y = this.access.y0
		this.obj.racket1.y = this.access.y1
	}

	StyleCanvas(w, h){
		document.body.appendChild(this.canvas)

		//css
		this.canvas.style.zIndex = "-1"
		this.canvas.style.width = w
		this.canvas.style.height = h
		this.canvas.style.position = "absolute"
		this.canvas.style.top = "50%"
		this.canvas.style.left = "50%"
		this.canvas.style.transform = "translate(-50%, -50%)"
		this.canvas.style.border = "solid 5px white"
		this.canvas.style.borderRadius = "10px"

		return this.canvas
	}

	ShowScore(j1, j2){
		document.body.appendChild(this.div)

		this.div.appendChild(this.p)
		this.div.appendChild(this.p2)

		this.p.textContent = j1
		this.p2.textContent = j2

		//css
		this.div.style.textAlign = "center"
		this.div.style.marginTop = "50px"

		this.p2.style.marginLeft = "40%"

		function style (el){
			el.style.color = "white"
			el.style.fontFamily = "cursive"
			el.style.fontSize = "60px"
			el.style.marginBottom = "0px"
			el.style.display = "inline"
		}

		style(this.p)
		style(this.p2)
	}
}

