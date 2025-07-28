const getInfo = (total, page, lastPage, endpoint) => {
  return {
    count: total,
    pages: lastPage,
    next:
      page + 1 > lastPage
        ? null
        : `http://localhost:3000/api/v1/${endpoint}?page=${page + 1}`,
    prev:
      page - 1 <= 0
        ? null
        : `http://localhost:3000/api/v1/${endpoint}?page=${
            page > lastPage ? lastPage : page - 1
          }`
  };
};

module.exports = { getInfo };
