
const EDGE_RE = /^([A-Z])->([A-Z])$/;
function parseEntry(raw) {
  const entry = typeof raw === "string" ? raw.trim() : "";
  const match = entry.match(EDGE_RE);
  if (!match) return { valid: false, entry };
  const [, parent, child] = match;
  if (parent === child) return { valid: false, entry }; // self-loop
  return { valid: true, entry, parent, child };
}


function buildGraph(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const childParent = new Map(); 
  const adjacency = new Map();   
  const allNodes = new Set();

  for (const raw of data) {
    const parsed = parseEntry(raw);
    if (!parsed.valid) {
      invalidEntries.push(parsed.entry);
      continue;
    }

    const { entry, parent, child } = parsed;

    if (seenEdges.has(entry)) {
      if (!duplicateEdges.includes(entry)) duplicateEdges.push(entry);
      continue;
    }
    seenEdges.add(entry);

    if (childParent.has(child)) continue;

    childParent.set(child, parent);
    allNodes.add(parent);
    allNodes.add(child);

    if (!adjacency.has(parent)) adjacency.set(parent, []);
    adjacency.get(parent).push(child);
  }

  return { invalidEntries, duplicateEdges, adjacency, childParent, allNodes };
}

function getComponents(adjacency, childParent, allNodes) {
  const visited = new Set();
  const components = [];

  const undirected = new Map();
  for (const node of allNodes) undirected.set(node, new Set());

  for (const [parent, children] of adjacency) {
    for (const child of children) {
      undirected.get(parent).add(child);
      undirected.get(child).add(parent);
    }
  }

  for (const startNode of [...allNodes].sort()) {
    if (visited.has(startNode)) continue;
    const component = new Set();
    const queue = [startNode];
    while (queue.length) {
      const node = queue.shift();
      if (visited.has(node)) continue;
      visited.add(node);
      component.add(node);
      for (const neighbor of undirected.get(node) || []) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
    components.push(component);
  }

  return components;
}


function hasCycle(root, adjacency, componentNodes) {
  const visited = new Set();
  const stack = new Set();

  function dfs(node) {
    visited.add(node);
    stack.add(node);
    for (const child of adjacency.get(node) || []) {
      if (!componentNodes.has(child)) continue;
      if (!visited.has(child)) {
        if (dfs(child)) return true;
      } else if (stack.has(child)) {
        return true;
      }
    }
    stack.delete(node);
    return false;
  }

  return dfs(root);
}

function calcDepth(node, adjacency) {
  const children = adjacency.get(node) || [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map((c) => calcDepth(c, adjacency)));
}
function buildTree(node, adjacency) {
  const children = adjacency.get(node) || [];
  const obj = {};
  for (const child of children) {
    obj[child] = buildTree(child, adjacency);
  }
  return obj;
}


function processData(data) {
  const { invalidEntries, duplicateEdges, adjacency, childParent, allNodes } =
    buildGraph(data);

  const components = getComponents(adjacency, childParent, allNodes);

  const hierarchies = [];
  let totalCycles = 0;
  let largestDepth = -1;
  let largestRoot = null;

  for (const component of components) {
    const roots = [...component].filter((n) => {
      const parent = childParent.get(n);
      return !parent || !component.has(parent);
    });

    const root = roots.length > 0
      ? roots.sort()[0]
      : [...component].sort()[0];

    const cycleDetected = hasCycle(root, adjacency, component);

    if (cycleDetected) {
      totalCycles++;
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = { [root]: buildTree(root, adjacency) };
      const depth = calcDepth(root, adjacency);
      hierarchies.push({ root, tree, depth });

      if (
        depth > largestDepth ||
        (depth === largestDepth && root < largestRoot)
      ) {
        largestDepth = depth;
        largestRoot = root;
      }
    }
  }

  const totalTrees = hierarchies.filter((h) => !h.has_cycle).length;

  return {
    invalidEntries,
    duplicateEdges,
    hierarchies,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot ?? "",
    },
  };
}

module.exports = { processData };