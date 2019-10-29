import { expect } from 'chai';
import ImmutableTree from './ImmutableTree';

describe('ImmutableTree basics', () => {
  let nodes; let
    tree;

  describe('Instantiation', () => {
    it('will throw an error when attempting to create a tree with no nodes', () => {
      expect(() => {
        tree = new ImmutableTree([], '1');
      }).to.throw('The tree must have at least 1 node');
    });

    it('will throw an error if no root is specified', () => {
      nodes = [
        {
          _id: '1',
          _parent: null,
          name: 'Root',
        },
      ];
      expect(() => {
        tree = new ImmutableTree(nodes);
      }).to.throw('The tree must have a root node as second parameter');
    });

    it('thows an error when the rootId does not exist', () => {
      expect(() => {
        nodes = [
          {
            _id: '1',
            _parent: null,
            name: 'Root',
          },
        ];
        tree = new ImmutableTree(nodes, 'x');
      }).to.throw('Could not find root ID "x"');
    });
  });

  describe('Tree with single node', () => {
    beforeEach(() => {
      nodes = [
        {
          _id: '1',
          _parent: null,
          name: 'Root',
        },
      ];
      tree = new ImmutableTree(nodes, '1');
    });

    it('has one node', () => {
      expect(tree.size).to.equal(1);
    });

    it('retrieves root node', () => {
      expect(tree.root).to.equal(nodes[0]);
    });
  });

  describe('Empty root with incorrect specified root', () => {
  });

  describe('Tree with multiple nodes and correctly specified root', () => {
    beforeEach(() => {
      nodes = [
        {
          _id: '2',
          _parent: '1',
          name: 'Child',
        },
        {
          _id: '1',
          _parent: null,
          name: 'Root',
          children: ['2'],
        },
      ];
      tree = new ImmutableTree(nodes, '1');
    });

    it('retrieves root node specified by root parameter', () => {
      expect(tree.root).to.equal(nodes[1]);
    });
  });

  // it("thows an error when the rootId does not exist", () => {
  //   expect(() => {
  //     new ImmutableTree([], "x");
  //   }).toThrow('Could not find root ID "x"');
  // });
});
