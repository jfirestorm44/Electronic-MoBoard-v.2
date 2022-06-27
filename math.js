function calcAngleOfLine(pt1, pt2, v) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    let theta;
    if (v !== undefined && v.vNum === 1) {
        theta = Math.atan2(-dy, -dx);
    } else {
        theta = Math.atan2(dy, dx);
    }
    theta -= Math.PI / 2;
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;
    return theta;
}

function calcVectorAngle(v1, v2, v) {
    let theta = calcAngleOfLine(v1, v2, v);
    return degreesToRadians(theta);
}

function calcSra() {
    if (plot.checked) {
        if (determineLeadLag(Number(losReadout.value), vector, tgtVector[vectorSelect])) {
            return Math.abs(Math.abs(vector.sa) - Math.abs(tgtVector[vectorSelect].sa));
        }
        return Math.abs(Math.abs(vector.sa) + Math.abs(tgtVector[vectorSelect].sa));
    }
    if (determineLeadLag(target[vectorSelect].brg, vector, target[vectorSelect])) {
        return Math.abs(Math.abs(vector.sa) - Math.abs(tgtVector[vectorSelect].sa));
    }
    return Math.abs(Math.abs(vector.sa) + Math.abs(tgtVector[vectorSelect].sa));
}

function calcSri() {
    return vector.si + tgtVector[vectorSelect].si;
}

function calcCPA(check) {
    let a = calcAngleOfLine(vector.pt2, tgtVector[vectorSelect].pt2, tgtVector[vectorSelect])
    if (check === 0) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === -1) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === 1) {
        let val = (a + 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
}

function calcSRM(t) {
    let theta;
    if (cpa.checked) {
        theta = calcAngleOfLine(vector.pt2, t)
    }
    if (plot.checked) {
        theta = calcAngleOfLine(vector.pt2, t) + Number(losReadout.value);
        if (theta > 360) theta -= 360
    }
    CalcSC()
    return degreesToRadians(theta);
}

function CPA(speed1, course1, speed2, course2, range, bearing) {
    let DTR = Math.PI / 180;
    let x, y, xVel, yVel, dot, a, b, cpa;

    x = range * Math.cos(DTR * bearing);
    y = range * Math.sin(DTR * bearing);
    xVel = speed2 * Math.cos(DTR * course2) - speed1 * Math.cos(DTR * course1);
    yVel = speed2 * Math.sin(DTR * course2) - speed1 * Math.sin(DTR * course1);
    dot = x * xVel + y * yVel;
    if (dot >= 0.0) {
        rngAtCpaReadout.value = "PAST";
        timeUntilCpaReadout.value = "PAST";
        return
    }
    a = xVel * xVel + yVel * yVel;
    b = 2 * dot;
    cpa = range * range - ((b * b) / (4 * a));
    if (cpa <= 0.0) {
        rngAtCpaReadout.value = "PAST";
        timeUntilCpaReadout.value = "PAST";
        return
    }
    cpa = Math.sqrt(cpa);
    rngAtCpaReadout.value = cpa.toFixed(1);
    timeUntilCpaReadout.value = numToTime(60 * (-b / (2 * a)))
}

function CalcSC() {
    CPA(vector.spd, vector.crs, tgtVector[vectorSelect].spd, tgtVector[vectorSelect].crs, currentRng.value, currentBrg.value);
}

function numToTime(num) {
    let hours = Math.floor(num / 60);
    let minutes = Math.trunc(num % 60);
    if (minutes.toString().length < 2) {
        minutes = '0' + minutes;
    }
    return hours + ":" + minutes;
}

function exSa(brg, vec) {
    return Math.abs(Math.sin(degreesToRadians(brg - vec.crs)) * vec.spd);
}

function exSra(osVec, tgtVec, brg) {
    if (determineLeadLag(brg, osVec, tgtVec)) {
        return Math.abs(exSa(brg, osVec) - exSa(brg, tgtVec));
    }
    return Math.abs(exSa(brg, osVec) + exSa(brg, tgtVec));
}

function calcExpectedBrgRate(val, num, osVec, tgtVec, brg) {
    let sra = exSra(osVec, tgtVec, brg);
    let b = sra * (0.95 / val);
    tgtVec.exBrgR[num] = b;
    return b.toFixed(3);
}

function calcExpectedBrgXing(num, osVec, tgtVec, brg) {
    let ts = exSa(brg, tgtVec);
    let os = exSa(brg, osVec);
    if (ts >= os && determineLeadLag(brg, osVec, tgtVec)) {
        tgtVec.exBrgX[num] = 0;
        return tgtVec.exBrgX[num];
    } else {
        let x = Math.abs(vector.sa) * (0.95 / tgtVec.exBrgR[num]);
        tgtVec.exBrgX[num] = x;
        return tgtVec.exBrgX[num].toFixed(1);
    }
}

function calcFRQc(fr, ss, vec) {
    let osDopp = Math.abs(vec.si) * ss;
    if (vec.lla < 90) {
        return (fr - osDopp).toFixed(3)
    }
    return (fr + osDopp).toFixed(3)
}

function calcFRQo(fc, ss, vec) {
    let tgtDopp = Math.abs(vec.si) * ss;
    if (vec.lla < 90) {
        return (fc - tgtDopp).toFixed(3)
    }
    return (fc + tgtDopp).toFixed(3)
}

function calcCrsFromFo(fr, ss, fo) {
    let frqc = calcFRQc(fr, ss, tOS);
    let rad = Math.acos(((frqc - fo) * ss) * tTarget.spd);
    let crs1 = Math.abs(tTarget.tbo - radiansToDegrees(rad));
    let crs2 = Math.abs(tTarget.tbo + radiansToDegrees(rad));
    return crs1.toFixed(0) + "/" + crs2.toFixed(0)
}

function calcCrsFromSPDti(brg, spdti, spd) {
    let crs1 = radiansToDegrees(Math.acos(spdti / spd)) - brg
    let crs2 = radiansToDegrees(Math.acos(spdti / spd)) + brg
    if (crs1 > 360) crs1 -= 360
    if (crs2 > 360) crs2 -= 360
    return Math.abs(crs1.toFixed(0)) + '/' + Math.abs(crs2.toFixed(0))
}

function determineLeadLag(brg, os, tgt) {
    //sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let a1 = degreesToRadians(Number(os.crs));
    let a2 = degreesToRadians(Number(tgt.crs));
    let los = {
        x1: x + 100 * Math.cos(degreesToRadians(brg)),
        y1: y + 100 * Math.sin(degreesToRadians(brg))
    }
    let x1 = x + os.spd * Math.cos(a1);
    let y1 = y + os.spd * Math.sin(a1);
    let x2 = x + tgt.spd * Math.cos(a2);
    let y2 = y + tgt.spd * Math.sin(a2);
    let a = Math.sign((x - los.x1) * (y2 - los.y1) - (y - los.y1) * (x2 - los.x1))
    let b = Math.sign((x - los.x1) * (y1 - los.y1) - (y - los.y1) * (x1 - los.x1))
    return a === b
}

function intersectLines(coord1, coord2, coord3, coord4) {
    let x1 = coord1.x;
    let x2 = coord2.x;
    let y1 = coord1.y;
    let y2 = coord2.y;

    let x3 = coord3.x;
    let x4 = coord4.x;
    let y3 = coord3.y;
    let y4 = coord4.y;

    let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (d == 0) {
        return;
    }
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    let u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;

    if (t > 0 && t < 1 && u > 0) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    return;
}

/*
function calcFrqO() {
    //fr(v + vs)/(v + vr) = fo
    let src, rcvr;
    src = tgtVector[vectorSelect].si >= 0 ? soundSpeed - tgtVector[vectorSelect].si : soundSpeed + tgtVector[vectorSelect].si;
    rcvr = vector.si >= 0 ? soundSpeed + vector.si : soundSpeed - vector.si;

    let fo = frqr * ((src) / (rcvr))
    return fo
}

function doesLineInterceptCircle(A, B, C, radius) {
    var dist;
    const v1x = B.x - A.x;
    const v1y = B.y - A.y;
    const v2x = C.x - A.x;
    const v2y = C.y - A.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);


    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if (u >= 0 && u <= 1) {
        dist = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
    } else {
        // if closest point not on the line segment
        // use the unit distance to determine which end is closest
        // and get dist square to circle
        dist = u < 0 ?
            (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
            (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
    }
    //console.log(dist < radius * radius);
    //console.log((B.x - C.x) ** 2 + (B.y - C.y) ** 2)
}
*/


/*
function calcTgtDistToCPA(pt, spd) {
    if (pt === undefined) {
        timeUntilCpaReadout.value = 'PAST';
        return
    }
    let dx = pt.x - target[vectorSelect].x;
    let dy = pt.y - target[vectorSelect].y;
    let dist = Math.hypot(dx, dy);
    CalcSC()
    //calcTimeToCPA((dist / 5), tgtVector[vectorSelect].spd);
}

function calcTgtDistAtCPA(pt) {
    if (pt === undefined) {
        rngAtCpaReadout.value = 'PAST';
        return
    }
    let dx = pt.x - tgtVector[vectorSelect].pt1.x;
    let dy = pt.y - tgtVector[vectorSelect].pt1.y;
    let dist = Math.hypot(dx, dy);
    rngAtCpaReadout.value = (dist / 5).toFixed(1);
}

function calcTimeToCPA(dist, spd) {
    console.log('s '+spd)
    console.log('d '+dist)
    
    let t = 60 * (dist / spd);
    let time = numToTime(t);
    timeUntilCpaReadout.value = time;
}

function CPABearing(r1,b1,r2,b2)
{
  var DTR = Math.PI / 180;
	return Math.atan((r2*Math.cos(DTR*b2) - r1*Math.cos(DTR*b1))/
                   	(r1*Math.sin(DTR*b1) - r2*Math.sin(DTR*b2)));
}


function Dist(r1,a1,r2,a2)
{
  var DTR = Math.PI / 180;
  var x1,x2,y1,y2;
  x1 = r1 * Math.cos(a1*DTR);
  x2 = r2 * Math.cos(a2*DTR);
  y1 = r1 * Math.sin(a1*DTR);
  y2 = r2 * Math.sin(a2*DTR);
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}


function CalcRB(f)
{
  var DTR = Math.PI / 180;
  var bearing = CPABearing(f.range1.value,f.bearing1.value,f.range2.value,f.bearing2.value);
  var range = f.range2.value * Math.cos(bearing - f.bearing2.value*DTR);
	var distance = Dist(f.range1.value,f.bearing1.value,f.range2.value,f.bearing2.value);
	var speed = distance/(f.time2.value - f.time1.value)*60;
  f.bearing.value = bearing + " degrees";
  f.range.value = range + " nmi";
  f.speed.value = speed + " knots";
}
*/