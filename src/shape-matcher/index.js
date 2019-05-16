const ShapeMatcher = function ShapeMatcher(shape) {
  const keys = Object.keys(shape);

  // eslint-disable-next-line complexity, max-statements
  this.isMatch = (object) => {
    if (shape === object) {
      return true;
    }

    if (typeof object !== typeof shape) {
      return false;
    }

    if (typeof object !== 'object') {
      return false;
    }

    for (const key of keys) {
      const { [key]: shapeValue } = shape;
      const { [key]: objectValue } = object;

      const child = new ShapeMatcher(shapeValue);

      if (!child.isMatch(objectValue)) {
        return false;
      }
    }

    return true;
  };

  return this;
};

export default ShapeMatcher;
