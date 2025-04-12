export const calculateGrid = (size, count) => {
    const initX = -1.0 * (count.x / 2) * size.x
    const initY = 0.0
    const initZ = -1.0 * (count.z / 2) * size.z
    const pointsList = []
    const linesList = []
    let lines = []
    for (let i = 0; i <= count.x; i++) {
      for (let j = 0; j <= count.y; j++) {
        for (let k = 0; k <= count.z; k++) {
          if (k !== 0) {
            lines = []
            lines.push(initX + i * size.x, initY + j * size.y, initZ + (k - 1) * size.z, initX + i * size.x, initY + j * size.y, initZ + k * size.z)
            linesList.push(lines)
          }
          if (j !== 0) {
            lines = []
            lines.push(initX + i * size.x, initY + (j - 1) * size.y, initZ + k * size.z, initX + i * size.x, initY + j * size.y, initZ + k * size.z)
            linesList.push(lines)
          }
          if (i !== 0) {
            lines = []
            lines.push(initX + (i - 1) * size.x, initY + j * size.y, initZ + k * size.z, initX + i * size.x, initY + j * size.y, initZ + k * size.z)
            linesList.push(lines)
          }
          pointsList.push(initX + i * size.x, initY + j * size.y, initZ + k * size.z)
        }
      }
    }
    return [pointsList, linesList];
}