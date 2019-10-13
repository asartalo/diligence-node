class Chunky {
  constructor(chunkSize) {
    this.chunkSize = chunkSize;
    this.elements = [];
  }

  add(element) {
    this.elements.push(element);
  }

  get size() {
    return this.elements.length;
  }

  *chunks() {
    while (this.size > 0) {
      yield this.elements.splice(0, this.chunkSize);
    }
  }
}

export default Chunky;

