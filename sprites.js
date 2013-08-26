var g_redZombieTemplate =
{
	gfxRoot: "gfx/redzombie",
	animSeqs : {attack : 11, walking: 8}
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
		this._ctx.animSeqToDirFrames[this._load.seq][this._load.dir][this._load.frame] = this;

		this._ctx.imagesLoadedCount++;
		if (this._ctx.imagesLoadedCount == this._ctx.imagesToBeLoadedCount)
		{
			this._ctx.isReady = true;
		}

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
