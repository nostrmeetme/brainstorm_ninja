export const convertInputToCertainty = (input, rigor) => {
  console.log('convertInputToCertainty; input: ' + input + '; rigor: ' + rigor)
  const rigority = -Math.log(rigor)
  const fooB = -input * rigority
  const fooA = Math.exp(fooB)
  const certainty = 1 - fooA
  console.log(
    'convertInputToCertainty; input: ' +
      input +
      '; rigor: ' +
      rigor +
      '; rigority: ' +
      rigority +
      '; fooB: ' +
      fooB +
      '; fooA: ' +
      fooA +
      '; certainty: ' +
      certainty,
  )
  return certainty.toPrecision(4)
}
