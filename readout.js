let losReadout = document.getElementById('los');
let tboReadout = document.getElementById('tbo');
let osCrsReadout = document.getElementById('CRSo');
let spdoReadout = document.getElementById('SPDo');
let soiReadout = document.getElementById('soi');
let soaReadout = document.getElementById('soa');
let llaReadout = document.getElementById('lla');
let aobReadout = document.getElementById('aob');
let tgtCrsReadout = document.getElementById('CRSt');
let spdtReadout = document.getElementById('SPDt');
let stiReadout = document.getElementById('sti');
let staReadout = document.getElementById('sta');
let sriReadout = document.getElementById('sri');
let sraReadout = document.getElementById('sra');
let ssReadout = document.getElementById('ss');
let frqoReadout = document.getElementById('FRQo');
let frqrReadout = document.getElementById('FRQr');
let frqcReadout = document.getElementById('FRQc');
let cpaTgtBrgReadout = document.getElementById('brg');
let cpaRngReadout = document.getElementById('rng');
let cpaReadout = document.getElementById('cpaBrg');
let rngAtCpaReadout = document.getElementById('cpaRng');
let timeUntilCpaReadout = document.getElementById('cpaTime');
let exBrgReadout = document.getElementById('exbrg');
let expRngReadout0 = document.getElementById('rng1');
let expRngReadout1 = document.getElementById('rng2');
let expRngReadout2 = document.getElementById('rng3');
let expBrgRateReadout = [document.getElementById('brgRate1'), document.getElementById('brgRate2'), document.getElementById('brgRate3')];
let expBrgXingReadout = [document.getElementById('brgXing1'), document.getElementById('brgXing2'), document.getElementById('brgXing3')];
let currentBrg = document.getElementById('currentBrg');
let currentRng = document.getElementById('currentRng');
let timeLate = document.getElementById('timeLate');

function setReadout() {
    if (cpa.checked) {
        losReadout.value = 0;
        brg = 0;
        losReadout.setAttribute('readonly', 'readonly');
        losReadout.style.color = "black";
        if (lockButton.checked) {
            console.log(true)
            cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
            cpaRngReadout.setAttribute('readonly', 'readonly');
            cpaTgtBrgReadout.style.color = "black";
            cpaRngReadout.style.color = "black";
            timeLate.setAttribute('readonly', 'readonly');
            timeLate.style.color = 'black';
        } else {
            cpaTgtBrgReadout.removeAttribute('readonly');
            cpaRngReadout.removeAttribute('readonly');
            cpaTgtBrgReadout.style.color = "white";
            cpaRngReadout.style.color = "white";
            timeLate.style.color = "white";
            timeLate.removeAttribute('readonly');
        }
        drawCPA();
        updateReadout()
    }
    if (plot.checked) {
        losReadout.value = target[vectorSelect].currentBrg;
        brg = Number(losReadout.value);
        losReadout.removeAttribute('readonly');
        losReadout.style.color = "white";
        cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
        cpaRngReadout.setAttribute('readonly', 'readonly');
        cpaTgtBrgReadout.style.color = "black";
        cpaRngReadout.style.color = "black";
        timeLate.setAttribute('readonly', 'readonly');
        timeLate.style.color = 'black';
        drawPlot();
        updateReadout()
    }
}

function updateReadout() {
    vector.setSpeed();
    tgtVector[vectorSelect].setSpeed();
    aobReadout.value = tgtVector[vectorSelect].lla.toFixed(1);
    losReadout.value = brg.toFixed(1);
    if (plot.checked) tboReadout.value = brg <= 180 ? brg + 180 : brg - 180;
    if (cpa.checked) tboReadout.value = Number(target[vectorSelect].tbo).toFixed(1);
    osCrsReadout.value = vector.crs.toFixed(1);
    tgtCrsReadout.value = tgtVector[vectorSelect].crs.toFixed(1);
    llaReadout.value = vector.lla.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    spdtReadout.value = tgtVector[vectorSelect].spd.toFixed(2);
    soiReadout.value = vector.si.toFixed(3);
    stiReadout.value = tgtVector[vectorSelect].si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    staReadout.value = Math.abs(tgtVector[vectorSelect].sa.toFixed(3));
    sriReadout.value = calcSri().toFixed(2);
    sraReadout.value = calcSra().toFixed(2);
    cpaTgtBrgReadout.value = target[vectorSelect].brg.toFixed(1);
    cpaRngReadout.value = target[vectorSelect].rng.toFixed(2);
    currentRng.value = target[vectorSelect].currentRng;
    currentBrg.value = target[vectorSelect].currentBrg;
    timeLate.value = target[vectorSelect].timeLate;
    frqrReadout.value = target[vectorSelect].frqr;
    frqcReadout.value = target[vectorSelect].frqc;
    frqoReadout.value = target[vectorSelect].frqo;
    ssReadout.value = target[vectorSelect].ss;
}

losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (losReadout.value > 359.9) {
            losReadout.value = 0;
        }
        brg = Number(losReadout.value)
        if (plot.checked) {
            drawPlot();
            setOsCRS();
            setOsSPD();
            setTgtCRS();
            setTgtSPD();
        }
        updateReadout();
    }
})

spdoReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (spdoReadout.value > 30) spdoReadout.value = 30;
        setOsSPD();
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
        updateReadout();
    }
})

osCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (osCrsReadout.value > 359.9) osCrsReadout.value = 359.9;
        setOsCRS();
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
        updateReadout();
    }
})

tgtCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (tgtCrsReadout.value > 359.9) tgtCrsReadout.value = 359.9;
        setTgtCRS();
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
        updateReadout();
    }
})

spdtReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (spdtReadout.value > 30) spdtReadout.value = 30;
        setTgtSPD();
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
        updateReadout();
    }
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].ss = Number(ssReadout.value);
        updateReadout();
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].frqr = Number(frqrReadout.value);
        target[vectorSelect].frqc = calcFRQc(Number(target[vectorSelect].frqr), target[vectorSelect].ss, vector);
        target[vectorSelect].frqo = calcFRQo(Number(target[vectorSelect].frqc), target[vectorSelect].ss, tgtVector[vectorSelect]);
        updateReadout();
    }
})

//CPA CONTROLS
cpaTgtBrgReadout.addEventListener('keydown', e => {
    if (lockButton.checked) return
    if (e.code == 'Enter' || e.code === 'Tab' && cpa.checked) {
        if (cpaTgtBrgReadout.value > 359.9) {
            cpaTgtBrgReadout.value = 0;
        }
        target[vectorSelect].brg = Number(cpaTgtBrgReadout.value);
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        drawCPA();
        updateReadout();
    }
})

cpaRngReadout.addEventListener('keydown', e => {
    if (lockButton.checked) return
    if (e.code == 'Enter' || e.code === 'Tab' && cpa.checked) {
        target[vectorSelect].rng = Number(cpaRngReadout.value);
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        drawCPA();
        updateReadout();
    }
})

timeLate.addEventListener('keydown', e => {
    if (lockButton.checked) return
    if (e.code == 'Enter' || e.code === 'Tab' && cpa.checked) {
        target[vectorSelect].timeLate = Number(timeLate.value)
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        drawCPA();
        updateReadout();
    }
})

exBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (exBrgReadout.value > 359.9) exBrgReadout.value = 0;
    }
})

expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[0] = Number(expRngReadout0.value);
        expBrgRateReadout[0].value = calcExpectedBrgRate(target[vectorSelect].exRng[0], 0, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[0].value = calcExpectedBrgXing(0, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout1.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[1] = Number(expRngReadout1.value);
        expBrgRateReadout[1].value = calcExpectedBrgRate(target[vectorSelect].exRng[1], 1, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[1].value = calcExpectedBrgXing(1, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[2] = Number(expRngReadout2.value);
        expBrgRateReadout[2].value = calcExpectedBrgRate(target[vectorSelect].exRng[2], 2, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[2].value = calcExpectedBrgXing(2, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

function setOsCRS() {
    vector.crs = Number(osCrsReadout.value);
    let l = vector.spd * 10;
    let a = degreesToRadians(Number(osCrsReadout.value));
    let aOffset = degreesToRadians(90 + brg);
    vector.pt2.x = vector.pt1.x + l * Math.cos(a - aOffset);
    vector.pt2.y = vector.pt1.y + l * Math.sin(a - aOffset);
}

function setOsSPD() {
    vector.spd = Number(spdoReadout.value);
    let l = vector.spd * 10;
    let a = calcVectorAngle(vector.pt1, vector.pt2, vector);
    let aOffset = degreesToRadians(90);
    vector.pt2.x = vector.pt1.x + l * Math.cos(a + aOffset);
    vector.pt2.y = vector.pt1.y + l * Math.sin(a + aOffset);
}

function setTgtCRS() {
    tgtVector[vectorSelect].crs = Number(tgtCrsReadout.value);
    let l = tgtVector[vectorSelect].spd * 10;
    let a = degreesToRadians(Number(tgtCrsReadout.value));
    let aOffset = degreesToRadians(90 + brg);
    tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
    tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
}

function setTgtSPD() {
    tgtVector[vectorSelect].spd = Number(spdtReadout.value);
    let l = tgtVector[vectorSelect].spd * 10;
    let a = calcVectorAngle(tgtVector[vectorSelect].pt1, tgtVector[vectorSelect].pt2, tgtVector[vectorSelect]);
    let aOffset = degreesToRadians(90);
    tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
    tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
}

window.onload = load()