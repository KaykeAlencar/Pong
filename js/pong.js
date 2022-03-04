const preLoader = new helper()

const pong = {
			    // x,   y,  w,  h,   color,  v, vh
	ball: new rect(10, 120, 10, 10, "white", 4, 1 ),
	racket0:new rect(5, 45,  5, 55, "white", 8 ), // racket left
	racket1:new rect(290, 45, 5, 55, "white", 8 ), // racket rigt

	request: undefined, // id of "requestAnimationFrame()"
	interval: undefined, //id of "setInteval()"

	q:"blok", // vai definir se a tecla "q" vai pausar ou despausar ou estar vai estar bloqueada
	c:"start",// vai definir se a tecla "c" vai iniciar o jogo ou estar vai estar bloqueada

	//placar do jogo
	score:{
		j1:0,
		j2:0,
	},

	rackets:[],

	/////////////////////////////////////////////////////////////
	audios:[
		preLoader.LoadMusic("soundtrack/musica.wav"), 
		preLoader.LoadMusic("soundtrack/one.wav"),
		preLoader.LoadMusic("soundtrack/al-green.wav")
	],

	//musica:undefined,
	randomMusic(){ // seleciona uma musica da lista para tocar
		this.musica = parseInt(Math.random()*(this.audios.length-1))
		console.log(this.musica)
	},
	/////////////////////////////////////////////////////////////

	preview(){
		preLoader.ShowScore(pong.score.j1, pong.score.j2)
	},

	animationBall(){
		pong.ball.y += pong.ball.vh
		pong.ball.x += pong.ball.v
	},

	putInArray(){
		this.rackets.push(this.racket0)
		this.rackets.push(this.racket1)
	},

	keys_Of_Animation:{
		// racket left
		get w(){
			pong.racket0.y += -pong.racket0.v 
		},
		get s(){
			pong.racket0.y += pong.racket0.v
		},
		
		// racket right
		get o(){
			pong.racket1.y += -pong.racket1.v
		},
		get l(){
			pong.racket1.y += pong.racket1.v
		},

		get c(){
			let k = {
				get start(){
					pong.rules.updateDifficulty()
					pong.randomMusic()

					pong.audios[pong.musica].play()
					pong.q = "pause"
					pong.c = "blok"
					loop()
				}, 

				get blok(){
					throw new Error("a respectiva tecla esta bloqueada")
				},
			}
			k[pong.c]
		},

		// pause
		get q(){
			let k = {
				get blok(){
					throw new Error("a respectiva tecla esta bloqueada")
				},
				get pause(){
					preLoader.freeze()
					pong.audios[pong.musica].pause()
					pong.q = "despause"
				},
				get despause(){
					preLoader.unfreeze()

					loop()
					pong.rules.updateDifficulty()
					pong.audios[pong.musica].play()

					pong.q = "pause"
				},
			}
			
			if(pong.ball.x >= 0 && pong.ball.x <= preLoader.canvas.width){
				k[pong.q]
			}
		}
	},

	rules:{
		validateRackts(i){
			let upLimit = -3
			let dwonLimit = preLoader.canvas.height + 3

			let y = pong.rackets[i].y
			let yd = pong.rackets[i].y + pong.rackets[i].height // y for dwon

			if(y <= upLimit){
				pong.rackets[i].y += pong.rackets[i].v
			}

			if(yd >= dwonLimit){
				pong.rackets[i].y += -pong.rackets[i].v
			}
		},

		validateBall(){
			let upLimit = 0 
			let dwonLimit = preLoader.canvas.height - 10 

			if(pong.ball.y >= dwonLimit){
				pong.ball.vh = pong.ball.vh * -1
			}
			if(pong.ball.y <= upLimit){
				pong.ball.vh = pong.ball.vh * -1
			}
		},

		collision(){
			let xlimit = pong.racket1.x - pong.racket1.width
			let xminimum = pong.racket0.x + pong.racket0.width

			if(pong.ball.x >= xlimit && pong.ball.y >= pong.racket1.y - 3 && pong.ball.y <= pong.racket1.y + pong.racket1.height + 5 ){
				pong.ball.v = pong.ball.v * -1
			}
			if(pong.ball.x <=  xminimum && pong.ball.y >= pong.racket0.y - 3 && pong.ball.y <= pong.racket0.y + pong.racket0.height + 5 ){
				pong.ball.v = pong.ball.v * -1
			}
		},
		updateDifficulty(){
			pong.interval = setInterval(()=>{
				pong.ball.vh += 0.11
				pong.ball.v += 0.1111

				pong.racket0.height = pong.racket0.height - 5
				pong.racket1.height = pong.racket1.height - 5

				console.log("up")
			}, 5000*2)
		},

		restart(){
			setTimeout(()=>{
				pong.ball.x = 120
				pong.ball.y = 120
			}, 300)
		},

		updateScore(arg){
			preLoader.freeze()
			pong.q = "blok"
			setTimeout(()=>{
				preLoader.unfreeze()

			    pong.q = "pause"
				pong.score[arg] += 1

				pong.rules.updateDifficulty()
				loop() 
			},500)
		},

		checkpoints(){
			if(pong.ball.x >= preLoader.canvas.width){
				this.updateScore("j1")
				this.restart()
			}
			if(pong.ball.x <= -5){ 
				this.updateScore("j2")
				this.restart()
			}

			if(pong.score.j1 >= 7 || pong.score.j2 >= 7){
				preLoader.freeze()
				pong.q = "block"
				pong.audios[pong.musica].pause()

			}
		},
	},
}

function getEvents(){
	let get = window.addEventListener.bind(window)
	get("keydown",(event)=>pong.keys_Of_Animation[event.key])
	get("load", drawFrame())
}

function loadRules(){
	pong.putInArray()

	for(let i = 0; i < 2; i++){
		pong.rules.validateRackts(i)
	}

	pong.rules.validateBall()
	pong.rules.collision()
	pong.rules.checkpoints()
}

function renderField(){
	const screen = new rect(0,0,window.innerWidth-60,window.innerHeight-60,"black")
	preLoader.StyleCanvas(`${screen.width}px`, `${screen.height}px`)
	screen.create() 

	let y = 0
	let w = 2
	let x = preLoader.canvas.width/2 - w/2

	const line = new rect(x,y, w, screen.height, "white")
	line.create()
}

function drawBool(){
	pong.animationBall()
	pong.ball.create()
}

function drawRackets(){
	pong.racket0.create()
	pong.racket1.create()
}

function drawFrame(){
	pong.preview()

	loadRules()
	renderField()
	drawRackets()
	drawBool()
}

const loop = () => {
	pong.request = requestAnimationFrame(loop)
	drawFrame()
}

preLoader.load(pong)
getEvents()