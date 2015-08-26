function Staff(noteSize) {
    this.noteSize = noteSize || 1;
    this.lineThickness = 0.08;
    this.trebleY = 20;
    this.bassY = 10;
    this.accidentalPos = 0.88;

    this.geometry = node();
    this.treble = node();
    this.treble8ve = node();
    this.bass = node();
    this.bass8ve = node();
    this.geometry.add(this.treble);
    this.geometry.add(this.treble8ve);
    this.geometry.add(this.bass);
    this.geometry.add(this.bass8ve);


    var trebleClefTexture = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../data/treble.jpg')});
    this.trebleClef = cube(trebleClefTexture);
    this.trebleClef.scale.set(4, 4, 0.1);
    this.trebleClef.position.set((-keyboard.numKeys/2) * 0.95,
                                this.trebleY + 1.5*this.noteSize, -2);
    this.geometry.add(this.trebleClef);

    var bassClefTexture = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../data/bass.jpg')});
    this.bassClef = cube(bassClefTexture);
    this.bassClef.scale.set(4, 4, 0.1);
    this.bassClef.position.set((-keyboard.numKeys/2) * 0.95,
                                this.bassY + 3.3*this.noteSize, -3);
    this.geometry.add(this.bassClef);

    this.keySigTreble = node();
    this.keySigBass = node();
    this.geometry.add(this.keySigTreble);
    this.geometry.add(this.keySigBass);

    // var sharpTexture = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('data/flat.jpg')});
    // this.sharp = cube(sharpTexture);
    // this.sharp.scale.set(1, 1, 0.1);
    // this.sharp.position.set((-keyboard.numKeys/2) * this.accidentalPos,
    //                             this.trebleY + this.noteSize, -2);
    // this.geometry.add(this.sharp);
    //
    // this.sharp2 = cube(sharpTexture);
    // this.sharp2.scale.set(1, 1, 0.2);
    // this.sharp2.position.set((-keyboard.numKeys/2) * this.accidentalPos, this.bassY + this.noteSize, -2);
    // this.geometry.add(this.sharp2);

}
Staff.prototype.addToScene = function(material, darkMaterial, root) {
    root.add(this.geometry);
    this.geometry.position.x = keyboard.numKeys/2;

    this.treble.scale.x = keyboard.numKeys/2;
    makeStaff(this.treble, darkMaterial, this.lineThickness, this.noteSize, this.trebleY);

    this.bass.scale.x = keyboard.numKeys/2;
    makeStaff(this.bass, darkMaterial, this.lineThickness, this.noteSize, this.bassY);

    function makeStaff(parent, material, thickness, noteSize, y) {
        for (var i = 0; i < 5; i ++) {
            var line = cube(material);
            line.scale.set(1, thickness, thickness);
            line.position.y = y + i * noteSize;
            parent.add(line);
        }
    }
    this.setKeySignature(5);
}
Staff.prototype.setKeySignature = function(accidentals) {
    if (accidentals == 0)
        return;

    var sharpOrder = [4, 2.5, 4.5, 3, 1.5, 3.5, 2];
    var flatOrder = [2, 3.5, 1.5, 3, 1, 2.5, 0.5];

    this.keySigTreble.position.set((-keyboard.numKeys/2) * this.accidentalPos, this.trebleY, -2);
    this.keySigBass.position.set((-keyboard.numKeys/2) * this.accidentalPos, this.bassY, -2);

    var symbol, order;
    if (accidentals > 0) {
        symbol = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../data/sharp.jpg')});
        order = sharpOrder;
    }
    else {
        symbol = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../data/flat.jpg')});
        order = flatOrder;
        accidentals = - accidentals;
        this.keySigTreble.position.y += .5 * this.noteSize;
        this.keySigBass.position.y += .5 * this.noteSize;
    }

    makeKeySig(this.keySigTreble, accidentals, symbol, this.noteSize, order, false);
    makeKeySig(this.keySigBass, accidentals, symbol, this.noteSize, order, true)

    function makeKeySig(parent, accidentals, symbol, noteSize, order, bass) {
        for (var i = 0; i < accidentals; i++) {
            var treb_symbol = cube(symbol);
            parent.add(treb_symbol);
            treb_symbol.scale.set(1, 1, 0.1);
            treb_symbol.position.x = noteSize * i * 1.2;

            if (bass)
                treb_symbol.position.y = (order[i] - 1) * noteSize;
            else
                treb_symbol.position.y = order[i] * noteSize;
        }
    }
}
Staff.prototype.getNoteHeight = function(midi) {
    // hardcoded for now just to experiment :-P
    switch (midi) {
        case 62:
            return this.trebleY - this.noteSize/2;
            break;
        case 63:
            return this.trebleY - this.noteSize/2;
            break;
        case 64:
            return this.trebleY;
            break;
        case 65:
            return this.trebleY + this.noteSize * .5;
            break;
        case 66:
            return this.trebleY + this.noteSize * .5;
            break;
        case 67:
            return this.trebleY + this.noteSize * 1;
            break;
        case 68:
            return this.trebleY + this.noteSize * 1;
            break;
        case 69:
            return this.trebleY + this.noteSize * 1.5;
            break;
        case 70:
            return this.trebleY + this.noteSize * 1.5;
            break;
        case 71:
            return this.trebleY + this.noteSize * 2;
            break;
        case 72:
            return this.trebleY + this.noteSize * 2.5;
            break;
        case 73:
            return this.trebleY + this.noteSize * 2.5;
            break;
        case 74:
            return this.trebleY + this.noteSize * 3;
            break;
        case 75:
            return this.trebleY + this.noteSize * 3;
            break;
        case 76:
            return this.trebleY + this.noteSize * 3.5;
            break;
        default:
            return -1;
    }
}
