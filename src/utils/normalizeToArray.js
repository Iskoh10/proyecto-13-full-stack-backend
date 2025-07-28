const normalizeToArray = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return [field];
};

module.exports = { normalizeToArray };
