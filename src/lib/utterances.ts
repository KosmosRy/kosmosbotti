const utteranceGenerator = (source: string[]) => {
  if (!source.length) {
    throw new Error('Empty array provided')
  }

  const arr = [...source]

  const generator = (function* gen() {
    while (true) {
      yield arr[Math.floor(Math.random() * arr.length)]
    }
  })()

  return {
    next: () => generator.next().value,
    add: (line: string) => arr.push(line)
  }
}

export default utteranceGenerator
