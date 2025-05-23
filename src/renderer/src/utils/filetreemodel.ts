import TreeModel from "tree-model";

export type FileTreeNode = {
  name: string,
  path: string,
  type: 'file'|'directory',
  mtime: number,
  size?: number,
  hash?: string,
  children?: FileTreeNode[]
}

export type FileTreeModel = TreeModel.Node<FileTreeNode>|null;

export type FileDiffs = {
  upload: FileTreeModel[];
  remove: FileTreeModel[];
  localRemove: FileTreeModel[];
  download: FileTreeModel[];
  merged: FileTreeModel;
}

const treeModel = new TreeModel();

export function parseFileTreeModel(node: FileTreeNode|null): FileTreeModel {
  return node ? treeModel.parse(node) : null;
}

const parse = parseFileTreeModel; // shortcut

export function diffTrees(
  tree1: FileTreeModel,
  tree2: FileTreeModel,
  mergeMode: boolean = false
): FileDiffs {
  const upload: FileTreeModel[] = [];
  const remove: FileTreeModel[] = [];
  const localRemove: FileTreeModel[] = [];
  const download: FileTreeModel[] = [];
  let merged: TreeModel.Node<FileTreeNode> = treeModel.parse<TreeModel.Node<FileTreeNode>>(JSON.parse(JSON.stringify(tree2?.model||{}))); // deep copy of tree2

  function merge(node: TreeModel.Node<FileTreeNode>) {
    console.log('merge:', node);
    if (node.model.name === '/') { // root node
      merged = treeModel.parse<TreeModel.Node<FileTreeNode>>(JSON.parse(JSON.stringify(node.model)));
      return;
    }
    const parentPath = node.model.path.split('/').slice(0, -1).join('/');
    console.log('merge: parentPath', parentPath);
    const parentMerged = merged.first(n => n.model.path === parentPath);
    console.log('merge: parent', parentMerged);
    if(!parentMerged) {
      console.error('merge: Parent not found', parentPath);
      return;
    }
    const mergedNode = parentMerged.first(n => n.model.path === node.model.path);
    if (mergedNode) {
      mergedNode.drop();
      parentMerged.addChild(treeModel.parse<TreeModel.Node<FileTreeNode>>(JSON.parse(JSON.stringify(node.model))));
    } else {
      parentMerged.addChild(node);
    }
  }

  // Helper function to compare nodes recursively
  function compareNodes(node1: FileTreeModel, node2: FileTreeModel) {
    console.log('compareNodes', node1, node2);
    if (!node1 && node2) {
      // Node exists only in tree2
      const parentPath = node2.model.path.split('/').slice(0, -1).join('/');
      const parent2 = tree2?.first(n => n.model.path === parentPath);
      const parent1 = tree1?.first(n => n.model.path === parentPath);
      console.log('missed node1 case:', parentPath, parent1, parent2);
      if (parent1 && parent2 && parent1.model.mtime > parent2.model.mtime && !mergeMode) {
        remove.push(node2);
        merged.first(n => n.model.path === node2.model.path)?.drop();
      } else {
        download.push(node2);
      }
      return;
    }
    if (node1 && !node2) {
      // Node exists only in tree1
      const parentPath = node1.model.path.split('/').slice(0, -1).join('/');
      const parent1 = tree1?.first(n => n.model.path === parentPath);
      const parent2 = tree2?.first(n => n.model.path === parentPath);
      console.log('missed node2 case:', parentPath, parent1, parent2);
      if (parent1 && parent2 && parent1.model.mtime < parent2.model.mtime && !mergeMode) {
        localRemove.push(node1);
      } else {
        upload.push(node1);
        merge(node1);
      }
      return;
    }
    if (node1 && node2) {
      if (node1.model.type !== node2.model.type) {
        // Different types, file instead of directory, and vice versa, so remove and upload
        if (node1.model.mtime > node2.model.mtime) {
          remove.push(node2);
          upload.push(node1);
          merge(node1);
        } else {
          localRemove.push(node1);
          download.push(node2);
        }
        return;
      }

      if (node1.model.type === 'file') {
        if (node1.model.hash !== node2.model.hash) {
          // File content differs
          if (node1.model.mtime > node2.model.mtime) {
            upload.push(node1);
            merge(node1);
          } else {
            download.push(node2);
          }
        }
        return;
      } else if (node1.model.type === 'directory') {
        node1.model.children.forEach((child1, i) => {
          const child2 = node2.model.children.find(c => c.name === child1.name);
          compareNodes(parse(child1), parse(child2));
        });
        node2.model.children.forEach((child2, i) => {
          const child1 = node1.model.children.find(c => c.name === child2.name);
          if(!child1) { // if child1 exists it was compared in the previous loop, now we are searching for new children
            compareNodes(parse(child1), parse(child2));
          }
        });
      }
    }
  }

  compareNodes(tree1, tree2);

  return { upload, remove, localRemove, download, merged };
}
