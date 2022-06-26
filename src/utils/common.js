const isInPage = (node) => (node === document.body) ? false : document.body.contains(node);

export {isInPage};
