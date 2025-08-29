const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const upload = require('../../middlewares/file');

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
  upload.single('image'),
  createWorkshop
);

workshopRouter.put('/:id', [isAuth], upload.single('image'), updateWorkshop);
workshopRouter.delete('/:id', [isAuth, checkUser()], deleteWorkshop);

module.exports = workshopRouter;
