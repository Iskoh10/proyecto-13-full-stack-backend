const { dataPerPage } = require('./variables/dataPerPage');

const getPaginationInfo = async (Model) => {
  const total = await Model.countDocuments();
  let lastPage = Math.floor(total / dataPerPage) + 1;

  return {
    total,
    lastPage
  };
};

module.exports = { getPaginationInfo };
