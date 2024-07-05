async function paginate(model, cursor, options) {
  const {
    cursorField = "createdAt",
    sort = { createdAt: -1 },
    limit = 10,
    populateOptions = [],
  } = options;
  const cursorQuery =
    cursorField && cursor
      ? {
          [cursorField]: { $lt: cursor },
        }
      : {};
  const items = await model
    .find(cursorQuery)
    .populate(populateOptions)
    .sort(sort)
    .limit(limit + 1);
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  const nextCursor = results.length
    ? results[results.length - 1].createdAt
    : null;

  return {
    data: results,
    cursor: nextCursor,
    hasMore,
  };
}

module.exports = paginate;
