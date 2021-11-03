const fs = require('fs')

const BASE_YEAR = '2020'
const CURRENT_YEAR = '2021'

console.time('readFileSync')
const data = fs.readFileSync('./PFD_Names.csv')
console.timeEnd('readFileSync')

console.time('total')

console.time('makeMap')
const {nameMap, counts} = data.toString()
    .split('\n')
    .slice(1) // ignore the header line
    .reduce(
    ({counts, nameMap}, line) => {
        const [year, name, countString] = line.split(',')

        // handle the blank line at the end
        if (!year) return { counts, nameMap }

        const count = parseInt(countString)

        counts[year] = (counts[year] || 0) + count

        const nameData = nameMap.get(name) || {}
        nameData[year] = count
        nameMap.set(name, nameData)

        return { counts, nameMap }
    },
    {counts: {}, nameMap: new Map()}
)
console.timeEnd('makeMap')

console.time('diffs2')
const diffs = Array.from(nameMap.entries()).map(([name, data]) => {
    const currentCount = data[CURRENT_YEAR] || 0
    const baseCount = data[BASE_YEAR] || 0

    const currentPercentage = currentCount / counts[CURRENT_YEAR] * 100
    const basePercentage = baseCount / counts[BASE_YEAR] * 100

    return {
        name,
        differencePercentage: Math.abs(currentPercentage - basePercentage),
        increasePercentage: currentPercentage - basePercentage,
        absoluteIncrease: currentCount - baseCount,
        absoluteChange: Math.abs(currentCount - baseCount),
    }
})
console.timeEnd('diffs2')

console.timeEnd('total')


console.log('----------- winners -----------')
diffs.sort((a, b) => b.increasePercentage - a.increasePercentage)
console.log(diffs.slice(0, 10))

// console.log(diffs[0].name, nameMap.get(diffs[0].name))
// console.log(diffs[1].name, nameMap.get(diffs[1].name))
// console.log(diffs[2].name, nameMap.get(diffs[2].name))


console.log('----------- losers -----------')
diffs.sort((a, b) => a.increasePercentage - b.increasePercentage)
console.log(diffs.slice(0, 10))

// console.log(diffs[0].name, nameMap.get(diffs[0].name))
// console.log(diffs[1].name, nameMap.get(diffs[1].name))
// console.log(diffs[2].name, nameMap.get(diffs[2].name))


console.log('----------- biggest changes -----------')
diffs.sort((a, b) => b.absoluteChange - a.absoluteChange)
console.log(diffs.slice(0, 10))

// console.log(diffs[0].name, nameMap.get(diffs[0].name))
// console.log(diffs[1].name, nameMap.get(diffs[1].name))
// console.log(diffs[2].name, nameMap.get(diffs[2].name))
