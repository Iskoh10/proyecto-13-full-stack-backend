const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const uploadPDF = require('../../middlewares/uploadPdf');
const {
  filterWorkshops,
  getWorkshopById,
  getWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
} = require('../controllers/workshop');

const workshopRouter = require('express').Router();

workshopRouter.get('/filter/:title', filterWorkshops);
workshopRouter.get('/:id', [isAuth, isAdmin], getWorkshopById);
workshopRouter.get('/', getWorkshops);
workshopRouter.post(
  '/',
  [isAuth, isAdmin],
  uploadPDF.single('fileUrl'),
  createWorkshop
);
workshopRouter.put(
  '/:id',
  [isAuth],
  uploadPDF.single('fileUrl'),
  updateWorkshop
);
workshopRouter.delete('/:id', [isAuth, checkUser()], deleteWorkshop);

module.exports = workshopRouter;
