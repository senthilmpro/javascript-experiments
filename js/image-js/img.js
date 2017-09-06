var Album = function(images){
    this.images = images || [];
    this.index = 0;
    this.count = images.count || 0;
}

Album.prototype.addImages = function(images){
    if(images){
        this.images = this.images.concat(images);
        this.count += images.count;
    }
}

Album.prototype.getNext = function(){
    if(this.index >= this.images.length - 1){
        this.index = 0;
    }
    return this.images[++this.index];
}

Album.prototype.getPrevious = function(){
    if(this.index <= 0){
        this.index = this.images.length;
    }
    return this.images[--this.index];
}

Album.prototype.getCount = function(){
    return this.count;
}

Album.prototype.getCurrentImage = function(){
    return this.images[this.index];
}

// Unit tests
var arr = [
    'a',
    'b'
];

var dp = new Album(arr);
console.log(dp.getNext());
