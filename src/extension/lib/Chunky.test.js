import Chunky from "./Chunky";
import { expect } from 'chai';

describe("Chunky", () => {
  let chunky;
  beforeEach(() => {
    chunky = new Chunky(3);
  });

  it("has no elements yet", () => {
    expect(chunky.size).to.equal(0);
  });

  it("can tell you its chunk size", () => {
    expect(chunky.chunkSize).to.equal(3);
  });

  it("#chunks() does nothing on an empty chunky", () => {
    let result;
    result = [];
    for (let chunk of chunky.chunks()) {
      result.push(chunk.join(""));
    }

    expect(result.join(" ")).to.equal("");
  });

  describe("when we add elements", () => {
    beforeEach(() => {
      for (let i = 0; i < 10; i++) {
        chunky.add(i);
      }
    });

    it("size reflects number of elements added", () => {
      expect(chunky.size).to.equal(10);
    });

    describe("#chunks()", () => {
      let result;
      beforeEach(() => {
        result = [];
        for (let chunk of chunky.chunks()) {
          result.push(chunk.join(""));
        }
      });

      it("returns the values in chunks", () => {
        expect(result.join(" ")).to.equal("012 345 678 9");
      });

      it("removes elements", () => {
        expect(chunky.size).to.equal(0);
      });
    });
  });
});

