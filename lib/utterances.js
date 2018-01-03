const UtteranceGenerator = source => {
    if (!Array.isArray(source) || !source.length) {
        throw new Error("No array or empty array provided");
    }

    const arr = source.slice(0);

    const generator = (function* gen () {
        while (true) {
            yield source[Math.floor(Math.random() * arr.length)];
        }
    })();

    return {
        next: () => generator.next().value,
        add: line => arr.push(line)
    }
};



module.exports = UtteranceGenerator;