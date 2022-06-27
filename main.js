let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 850;
canvas.height = 850;
let canvasBounds = canvas.getBoundingClientRect();
let brg = 0;
let mouse = {
    x: 100,
    y: 100,
    clicked: false
};
let los = {
    x: 0,
    y: 0
};
let tbo = {
    x: 0,
    y: 0
};
let showOS = document.getElementById('os');
let showTGT = document.getElementById('tgt');
let lockButton = document.getElementById('lock');
let tgt1 = document.getElementById('tgt1');
let tgt2 = document.getElementById('tgt2');
let tgt3 = document.getElementById('tgt3');
let soundSpeed = 0;
let frqr = 0;
let zeroReferenceOpp = {
    x: 425,
    y: 850
};
let vectorSelect = 0;
let interval = 1000 * 60;
let expected = Date.now() + interval;
plot.checked = 'checked';
tgt1.checked = 'checked';

class Moboard {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedCircles = 40;
    }
    draw() {
        ctx.strokeStyle = 'white';
        ctx.setLineDash([5, 15]);
        for (let i = 1; i <= 10; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([2, 20]);
        for (let i = 1; i <= 9; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i + 20, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([10, 20]);
        for (let i = 0; i < 360; i += 10) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05, this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        ctx.fillStyle = 'white';
        ctx.font = '10pt serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Electronic MoBoard v2.0', 5, canvas.height)
    }
    numbers() {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '10pt serif';
        for (let i = 2; i <= 20; i += 2) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            let y1 = (-i * 20) + canvas.height / 2;
            let y2 = (i * 20) + canvas.height / 2 - 15;
            ctx.fillText(i + '', this.x + 2, y1);
            ctx.fillText(i + '', this.x + 2, y2);
            ctx.restore();
        }
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 360; i += 10) {
            let xCoord = (this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05);
            let yCoord = (this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            zeroReferenceOpp.x = (this.x + Math.cos((180 - 90 - brg) * Math.PI / 180) * canvas.width / 2.05);
            zeroReferenceOpp.y = (this.y + Math.sin((180 - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            let num = i;
            if (i.toString().length <= 2) {
                num = '0' + i;
            }
            if (i.toString().length <= 1) {
                num = '00' + i;
            }
            ctx.fillText(num, xCoord, yCoord);
        }
    }
}
let moboard = new Moboard()

class Vector {
    constructor(x, y, c, v, num) {
        this.pt1 = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.pt2 = {
            x: x,
            y: y
        };
        this.color = c;
        this.crs = 0;
        this.spd = 5;
        this.lla = 0;
        this.si = 0;
        this.sa = 0;
        this.vNum = v;
        this.srm = 0;
        this.num = num;
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.pt1.x, this.pt1.y);
        ctx.lineTo(this.pt2.x, this.pt2.y);
        ctx.closePath();
        ctx.stroke();
    }
    setSpeed() {
        let dx = this.pt1.x - this.pt2.x;
        let dy = this.pt1.y - this.pt2.y;
        let length = Math.hypot(dx, dy);
        this.spd = length / 10;
    }
    calcLla() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x, distBC_y;
        if (this.vNum === 1) {
            distBC_x = this.pt1.x - los.x;
            distBC_y = this.pt1.y - los.y;
        } else {
            distBC_x = this.pt1.x - tbo.x;
            distBC_y = this.pt1.y - tbo.y;
        }
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (a < 0) {
            a = a * -1;
        }
        this.lla = a * (180 / Math.PI);
    }
    calcLlaCpa() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x, distBC_y, tbo;
        tbo = Number(tboReadout.value);
        let oppX = canvas.width / 2 + 400 * Math.cos(degreesToRadians(tbo - 90));
        let oppY = canvas.height / 2 + 400 * Math.sin(degreesToRadians(tbo - 90));
        if (this.vNum === 1) {
            distBC_x = this.pt1.x - target[vectorSelect].x;
            distBC_y = this.pt1.y - target[vectorSelect].y;
        } else {
            distBC_x = this.pt1.x - oppX;
            distBC_y = this.pt1.y - oppY;
        }
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (a < 0) {
            a = a * -1;
        }
        this.lla = a * (180 / Math.PI);
    }
    calcCrs() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x = this.pt1.x - zeroReferenceOpp.x;
        let distBC_y = this.pt1.y - zeroReferenceOpp.y;
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        this.crs = 180 - a * (180 / Math.PI);
    }
    calcSiSa() {
        let a, tbo;
        if (plot.checked) {
            tbo = brg <= 180 ? brg + 180 : brg - 180
            this.vNum === 1 ? a = degreesToRadians(brg - this.crs) : a = degreesToRadians(tbo - this.crs);
        } else {
            this.vNum === 1 ? a = degreesToRadians(target[vectorSelect].currentBrg - this.crs) : a = degreesToRadians(target[vectorSelect].tbo - this.crs);
        }
        this.si = Math.cos(a) * this.spd;
        this.sa = Math.sin(a) * this.spd;
    }
    SRM() {
        if (this.vNum !== 1) this.srm = calcSRM(this.pt2);
    }
    update() {
        let dx = mouse.x - this.pt2.x;
        let dy = mouse.y - this.pt2.y;
        if (Math.hypot(dx, dy) < 15 && mouse.clicked) {
            this.pt2.x = mouse.x;
            this.pt2.y = mouse.y;
        }
        if (mouse.clicked) this.calcCrs();
        if (!mouse.clicked) {
            if (this.vNum === 1) {
                this.crs = Number(osCrsReadout.value)
                setOsCRS();
            } else {
                this.crs = Number(tgtCrsReadout.value)
                setTgtCRS();
            }
        }
        if (plot.checked) this.calcLla();
        if (cpa.checked) this.calcLlaCpa();
        this.calcSiSa();
        this.SRM();
    }

}
let vector = new Vector(389, 389, 'blue', 1);
let tgtVector = [new Vector(300, 550, 'red', 2), new Vector(500, 550, 'rgb(52, 156, 0)', 2), new Vector(450, 450, 'rgb(237, 131, 2)', 2)]

class Target {
    constructor(b, c, num) {
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.num = num;
        this.rng = 50;
        this.brg = b;
        this.crs = tgtVector[vectorSelect].crs;
        this.spd = tgtVector[vectorSelect].spd;
        this.exRng = [0, 0, 0];
        this.exBrgR = [0, 0, 0];
        this.exBrgX = [0, 0, 0];
        this.currentBrg = 0;
        this.tbo = this.currentBrg <= 180 ? this.currentBrg + 180 : this.currentBrg - 180; //here
        this.currentRng = 0;
        this.srm = 0;
        this.frqr = 0;
        this.frqc = 0;
        this.frqo = 0;
        this.ss = 0;
        this.timeLate = 0;
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.c;
        if (this.rng <= 80) {
            ctx.beginPath();
            ctx.moveTo(this.x - 12, this.y - 5)
            ctx.lineTo(this.x, this.y + 10)
            ctx.lineTo(this.x + 12, this.y - 5)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + 20 * Math.cos(degreesToRadians(this.crs - 90)), this.y + 20 * Math.sin(degreesToRadians(this.crs - 90)));
            ctx.stroke();
        } else {
            let a = degreesToRadians(this.currentBrg - 90);
            let x = canvas.width / 2 + 400 * Math.cos(a);
            let y = canvas.height / 2 + 400 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(x - 12, y - 5)
            ctx.lineTo(x, y + 10)
            ctx.lineTo(x + 12, y - 5)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y)
            ctx.lineTo(x + 20 * Math.cos(degreesToRadians(this.crs - 90)), y + 20 * Math.sin(degreesToRadians(this.crs - 90)));
            ctx.stroke();
        }
    }
    update() {
        this.crs = tgtVector[vectorSelect].crs;
        this.spd = tgtVector[vectorSelect].spd;
    }
    setPosition() {
        let l = this.rng * 5;
        let a = degreesToRadians(this.brg - 90);
        this.x = canvas.width / 2 + l * Math.cos(a);
        this.y = canvas.height / 2 + l * Math.sin(a);
        let pt1 = {
            x: this.x,
            y: this.y
        }
        let pt2;
        let t = this.timeLate / 60;
        if (this.timeLate > 0) {
            let d = 5 * (this.spd * t);
            let a;
            if (this.num === 0) {
                a = tgtVector[0].srm - degreesToRadians(90);
            } else if (this.num === 1) {
                a = tgtVector[1].srm - degreesToRadians(90);
            } else {
                a = tgtVector[2].srm - degreesToRadians(90);
            }
            let x = this.x;
            let y = this.y;
            this.x = x + d * Math.cos(a);
            this.y = y + d * Math.sin(a);
        }
    }
    updatePosition() {
        let distPerHour = this.spd * 5;
        let distPerMin = distPerHour / 60;
        let a;
        if (this.num === 0) {
            a = tgtVector[0].srm - degreesToRadians(90);
        } else if (this.num === 1) {
            a = tgtVector[1].srm - degreesToRadians(90);
        } else {
            a = tgtVector[2].srm - degreesToRadians(90);
        }
        let x = this.x;
        let y = this.y;
        this.x = x + distPerMin * Math.cos(a);
        this.y = y + distPerMin * Math.sin(a);
        this.updateCurrentInfo()
    }
    updateExpecteds() {
        expRngReadout0.value = this.exRng[0];
        expRngReadout1.value = this.exRng[1];
        expRngReadout2.value = this.exRng[2];
        expBrgRateReadout[0].value = this.exBrgR[0].toFixed(3);
        expBrgRateReadout[1].value = this.exBrgR[1].toFixed(3);
        expBrgRateReadout[2].value = this.exBrgR[2].toFixed(3);
        expBrgXingReadout[0].value = this.exBrgX[0].toFixed(1);
        expBrgXingReadout[1].value = this.exBrgX[1].toFixed(1);
        expBrgXingReadout[2].value = this.exBrgX[2].toFixed(1);
    }
    updateCurrentInfo() {
        let cb = calcAngleOfLine({
            x: canvas.width / 2,
            y: canvas.height / 2
        }, {
            x: this.x,
            y: this.y
        });
        this.currentBrg = cb.toFixed(1);
        this.tbo = Number(this.currentBrg) + 180;
        if (this.tbo >= 360) this.tbo -= 360;
        let dx = Math.abs(canvas.width / 2 - this.x);
        let dy = Math.abs(canvas.height / 2 - this.y);
        let dist = Math.hypot(dx, dy) / 5;
        this.currentRng = dist.toFixed(1);
    }
}
let target = [new Target(345, 'red', 0), new Target(0, 'rgb(52, 156, 0)', 1), new Target(15, 'rgb(237, 131, 2)', 2)]

function drawLOS(brg) {
    los.x = (canvas.width / 2 + Math.cos((-90) * Math.PI / 180) * canvas.width / 2);
    los.y = (canvas.height / 2 + Math.sin((-90) * Math.PI / 180) * canvas.height / 2);
    tbo.x = (canvas.width / 2 + Math.cos((90) * Math.PI / 180) * canvas.width / 2);
    tbo.y = (canvas.height / 2 + Math.sin((90) * Math.PI / 180) * canvas.height / 2);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(los.x, los.y);
    ctx.lineTo(tbo.x, tbo.y);
    ctx.closePath();
    ctx.stroke();
}

function drawLeftRight() {
    let x1 = vector.pt2.x;
    let y1 = los.y;
    let x2 = vector.pt2.x;
    let y2 = tbo.y;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawOpenCloseLine() {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(0, vector.pt2.y);
    ctx.lineTo(canvas.width, vector.pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawSRM() {
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(vector.pt2.x, vector.pt2.y);
    ctx.lineTo(tgtVector[vectorSelect].pt2.x, tgtVector[vectorSelect].pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawDRM() {
    let a = tgtVector[vectorSelect].srm - degreesToRadians(90);
    let c = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    let x2 = target[vectorSelect].x + 800 * Math.cos(a);
    let y2 = target[vectorSelect].y + 800 * Math.sin(a);
    let x3 = c.x + 100 * Math.cos(a);
    let y3 = c.y + 100 * Math.sin(a);
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(target[vectorSelect].x, target[vectorSelect].y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    //position = sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    let check = Math.sign((x3 - c.x) * (target[vectorSelect].y - c.y) - (y3 - c.y) * (target[vectorSelect].x - c.x));
    calcCPA(check)
}

canvas.addEventListener("mousemove", e => {
    mouse.x = e.x - canvasBounds.x;
    mouse.y = e.y - canvasBounds.y;
})

canvas.addEventListener("mousedown", () => {
    canvasBounds = canvas.getBoundingClientRect();
    mouse.clicked = true;
    animate();
})

canvas.addEventListener("mouseup", () => {
    mouse.clicked = false;
    cancelAnimationFrame(draw);
    updateReadout()
})

showOS.addEventListener('change', () => {
    if (plot.checked) drawPlot();
    if (cpa.checked) drawCPA();
})

showTGT.addEventListener('change', () => {
    if (plot.checked) drawPlot();
    if (cpa.checked) drawCPA();
})

lockButton.addEventListener('change', () => {
    setReadout()
})

tgt1.addEventListener('change', () => {
    vectorSelect = 0;
    target[vectorSelect].updateExpecteds()
    updateReadout()
    if (plot.checked) {
        updateReadout()
        drawPlot();
    } else {
        updateReadout()
        drawCPA();
    }

});

tgt2.addEventListener('change', () => {
    vectorSelect = 1;
    target[vectorSelect].updateExpecteds()
    updateReadout()
    if (plot.checked) {
        drawPlot();
        updateReadout()
    } else {
        drawCPA();
        updateReadout()
    }
});

tgt3.addEventListener('change', () => {
    vectorSelect = 2;
    target[vectorSelect].updateExpecteds()
    updateReadout()
    if (plot.checked) {
        updateReadout()
        drawPlot();
    } else {
        updateReadout()
        drawCPA();
    }
});

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
}

function drawPlot() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLOS(brg);
    moboard.numbers();
    moboard.draw();
    vector.update();
    tgtVector[vectorSelect].update();
    target[vectorSelect].update();
    if (showOS.checked) {
        vector.draw();
        drawOpenCloseLine();
        drawLeftRight();
    }
    if (showTGT.checked) {
        tgtVector[vectorSelect].draw();
    }
}

function drawCPA() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    moboard.numbers();
    moboard.draw();
    vector.update();
    tgtVector[vectorSelect].update();
    target[vectorSelect].update();
    target[0].draw();
    target[1].draw();
    target[2].draw();
    drawSRM();
    if (target[vectorSelect].rng < 80.1) drawDRM();
    if (showOS.checked) {
        vector.draw();
    }
    if (showTGT.checked) {
        tgtVector[vectorSelect].draw()
    }
}

function step() {
    var dt = Date.now() - expected;
    if (dt > interval) {
        expected += dt;
    }
    target[0].updatePosition();
    target[1].updatePosition();
    target[2].updatePosition();
    if (cpa.checked) {
        drawCPA();

    }
    updateReadout(); //here
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt));
}
setTimeout(step, interval);

function load() {
    target[0].setPosition();
    target[1].setPosition();
    target[2].setPosition();
    drawPlot();
    setReadout();
    updateReadout();
}

function animate() {
    updateReadout()
    if (plot.checked) {
        drawPlot();
    }
    if (cpa.checked) {
        drawCPA();
    }
    draw = requestAnimationFrame(animate);
}