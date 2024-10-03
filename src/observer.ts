const containsAOSNode = (nodes: any) => {
  return [...nodes].some((node) => {
    return (
      node.dataset?.aos || (node.children && containsAOSNode(node.children))
    );
  });
};

const observe = (fn: () => void): MutationObserver => {
  const observer = new MutationObserver((mutations) => {
    if (
      mutations?.some(({ addedNodes, removedNodes }) =>
        containsAOSNode([...addedNodes, ...removedNodes])
      )
    ) {
      fn();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
};

export default observe;