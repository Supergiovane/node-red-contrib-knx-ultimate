module.exports = {
  /**
        * Calculate XY color points for a given RGB value.
        * @param {number} red RGB red value (0-255)
        * @param {number} green RGB green value (0-255)
        * @param {number} blue RGB blue value (0-255)
        * @param {object} lampGamut Hue bulb gamut range (the lamp provides a gamut object red:{x:1,y:1}, etc)
        * @returns {number[]}
        */
  calculateXYFromRGB (red, green, blue, lampGamut) {
    red /= 255
    green /= 255
    blue /= 255
    const r = red > 0.04045 ? ((red + 0.055) / 1.055) ** 2.4000000953674316 : red / 12.92
    const g = green > 0.04045 ? ((green + 0.055) / 1.055) ** 2.4000000953674316 : green / 12.92
    const b = blue > 0.04045 ? ((blue + 0.055) / 1.055) ** 2.4000000953674316 : blue / 12.92
    const x = r * 0.664511 + g * 0.154324 + b * 0.162028
    const y = r * 0.283881 + g * 0.668433 + b * 0.047685
    const z = r * 8.8E-5 + g * 0.07231 + b * 0.986039
    const xy = [x / (x + y + z), y / (x + y + z)]
    if (isNaN(xy[0])) {
      xy[0] = 0.0
    }

    if (isNaN(xy[1])) {
      xy[1] = 0.0
    }

    if (lampGamut !== null && lampGamut !== undefined) {
      const colorPoints = [[lampGamut.red.x, lampGamut.red.y], [lampGamut.green.x, lampGamut.green.y], [lampGamut.blue.x, lampGamut.blue.y]]
      const inReachOfLamps = checkPointInLampsReach(xy, lampGamut)
      if (!inReachOfLamps) {
        const pAB = getClosestPointToPoints(colorPoints[0], colorPoints[1], xy)
        const pAC = getClosestPointToPoints(colorPoints[2], colorPoints[0], xy)
        const pBC = getClosestPointToPoints(colorPoints[1], colorPoints[2], xy)
        const dAB = getDistanceBetweenTwoPoints(xy, pAB)
        const dAC = getDistanceBetweenTwoPoints(xy, pAC)
        const dBC = getDistanceBetweenTwoPoints(xy, pBC)
        let lowest = dAB
        let closestPoint = pAB
        if (dAC < dAB) {
          lowest = dAC
          closestPoint = pAC
        }

        if (dBC < lowest) {
          closestPoint = pBC
        }

        xy[0] = closestPoint[0]
        xy[1] = closestPoint[1]
      }
    }
    xy[0] = precision(xy[0])
    xy[1] = precision(xy[1])

    // Check boundary (min 0, max 1)
    xy[0] = xy[0] < 0 ? 0 : xy[0]
    xy[0] = xy[0] > 1 ? 1 : xy[0]
    xy[1] = xy[1] < 0 ? 0 : xy[1]
    xy[1] = xy[1] > 1 ? 1 : xy[1]

    return { x: xy[0], y: xy[1] }
  }
}

function crossProduct (point1, point2) {
  return point1[0] * point2[1] - point1[1] * point2[0]
}

function checkPointInLampsReach (point, lampGamutObject) {
  if (point != null && lampGamutObject != null) {
    const { red } = lampGamutObject
    const { green } = lampGamutObject
    const { blue } = lampGamutObject
    const v1 = [green.x - red.x, green.y - red.y]
    const v2 = [blue.x - red.x, blue.y - red.y]
    const q = [point[0] - red.x, point[1] - red.y]
    const s = crossProduct(q, v2) / crossProduct(v1, v2)
    const t = crossProduct(v1, q) / crossProduct(v1, v2)
    return s >= 0.0 && t >= 0.0 && s + t <= 1.0
  }
  return false
}

function getClosestPointToPoints (pointA, pointB, pointP) {
  if (pointA != null && pointB != null && pointP != null) {
    const pointAP = [pointP[0] - pointA[0], pointP[1] - pointA[1]]
    const pointAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]]
    const ab2 = pointAB[0] * pointAB[0] + pointAB[1] * pointAB[1]
    const apAb = pointAP[0] * pointAB[0] + pointAP[1] * pointAB[1]
    let t = apAb / ab2
    if (t < 0.0) {
      t = 0.0
    } else if (t > 1.0) {
      t = 1.0
    }

    return [pointA[0] + pointAB[0] * t, pointA[1] + pointAB[1] * t]
  }
  return null
}

function getDistanceBetweenTwoPoints (pointA, pointB) {
  const dx = pointA[0] - pointB[0]
  const dy = pointA[1] - pointB[1]
  const dist = Math.sqrt(dx * dx + dy * dy)
  return dist
}

function precision (d) {
  return Math.round(10000.0 * d) / 10000.0
}
