class rect{
	constructor(x, y, width, height, color, v, vh){
		this.x = x
		this.y = y
		this.v = v
		this.vh = vh
		this.width = width
		this.height = height
		this.color = color
	}
	create(){
		preLoader.pencil.fillStyle = this.color
		preLoader.pencil.fillRect(this.x, this.y, this.width, this.height )
	}
}