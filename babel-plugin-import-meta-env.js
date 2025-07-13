module.exports = function() {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
          path.replaceWithSourceString(`{
            env: {
              VITE_MORALIS_API_KEY: 'test-api-key',
              VITE_LOCAL_SERVER: 'false',
              GOLDRUSH_API_KEY: 'test-goldrush-key'
            }
          }`);
        }
      }
    }
  };
};
