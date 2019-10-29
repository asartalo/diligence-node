class ImmutableTree {
  constructor(nodes, root = null) {
    if (nodes.length === 0) {
      throw Error('The tree must have at least 1 node');
    }

    if (!root) {
      throw Error('The tree must have a root node as second parameter');
    }

    this.nodes = new Map(nodes.map(node => [node._id, node]));

    if (!this.nodes.has(root)) {
      throw Error(`Could not find root ID "${root}"`);
    }

    this.rootId = root;
  }

  get size() {
    return this.nodes.size;
  }

  get root() {
    return this.nodes.get(this.rootId);
  }
}

export default ImmutableTree;
