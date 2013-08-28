var g_redZombieTemplate =
{
	transparentRGB  : [106,76,48],
	shadowRGB       : [39,27,17],
	gfxRoot: "gfx/redzombie",
	animSeqs : {attack : 11, walking: 8}
};

var g_knightTemplate=
{
	transparentRGB  : [90,93,57],
	shadowRGB       : [8,12,8],
	gfxRoot: "gfx/knight",
	animSeqs : {headshaking: 12, walking: 12}
};


var g_compass = [ "n", "ne", "e", "se", "s", "sw","w","nw"];


var GfxSprite = function (template) {
	this.template = template;
	this.imagesLoadedCount = 0;
	this.isReady = false;
	this.imagesToBeLoadedCount = 0;
	for (var seq in this.template.animSeqs) {
		this.imagesToBeLoadedCount += this.template.animSeqs[seq] * g_compass.length;

	}
	this.animSeqToDirFrames = {} ;
	for (var seq  in this.template.animSeqs) {
		var seqDirs = this.animSeqToDirFrames[seq] = {};

		for (var dir = 0; dir< g_compass.length; dir++) {
			seqDirs[g_compass[dir]] = [];

			for (var frame = 0; frame< this.template.animSeqs[seq]; frame++) {
				seqDirs[g_compass[dir] ].push(null);
			}
		}

	}

};


GfxSprite.prototype.loadImage = function (imageName, seq,dir,frame)
{
	var img = new Image();
	img._ctx = this;
	img._load = {seq: seq, dir: dir, frame: frame};


	img.onload = function ()
	{
		var workCanvas = document.createElement("canvas");
		workCanvas.width = this.width;
		workCanvas.height = this.height;
		
		var wctx = workCanvas.getContext("2d");
		wctx.drawImage(this, 0,0);
		
		var imageData= wctx.getImageData(0,0,this.width, this.height);
		var length  = imageData.data.length;
		
		for (var i=3; i < length; i+= 4) {
			if (imageData.data[i - 3] == this._ctx.template.transparentRGB[0] &&
			    imageData.data[i - 2] == this._ctx.template.transparentRGB[1] &&
			    imageData.data[i - 1] == this._ctx.template.transparentRGB[2]) {
				imageData.data[i] = 0;
			}
			else if (imageData.data[i - 3] == this._ctx.template.shadowRGB[0] &&
			    imageData.data[i - 2] == this._ctx.template.shadowRGB[1] &&
			    imageData.data[i - 1] == this._ctx.template.shadowRGB[2]) {
				imageData.data[i] = 128;
			}
		}
		wctx.putImageData(imageData, 0,0);

		img2 = new Image(); 
		
		img2._ctx = this._ctx;
		img2._load= this._load;

		img2.onload = function ()
		{
			this._ctx.animSeqToDirFrames[this._load.seq][this._load.dir][this._load.frame] = this;

			this._ctx.imagesLoadedCount++;
			if (this._ctx.imagesLoadedCount == this._ctx.imagesToBeLoadedCount)
			{
				this._ctx.isReady = true;
			}

		}
		img2.src = workCanvas.toDataURL();

	}

	img.src = this.template.gfxRoot + "/"+ imageName;

};


GfxSprite.prototype.load = function() {
	for (var seq  in this.template.animSeqs) {
		for (var dir = 0; dir< g_compass.length; dir++) {
			for (var frame = 0; frame< this.template.animSeqs[seq]; frame++)
			{
				var imageName = seq + " " + g_compass[dir] + "00";
				if (frame < 10 ) imageName +="0";
				imageName += frame + ".png";


				this.loadImage(imageName, seq, g_compass[dir], frame);
			}
		}

	}
};
