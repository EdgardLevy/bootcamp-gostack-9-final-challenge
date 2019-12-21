import Router from 'express';

import AnswerHelpOrderController from './app/controllers/AnswerHelpOrderController';
import CheckInController from './app/controllers/CheckInController';
import HelpOrderController from './app/controllers/HelpOrderController';
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import SubscriptionController from './app/controllers/SubscriptionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/students/:id', StudentController.show);
routes.get('/students/:student_id/checkins', CheckInController.index);
routes.post('/students/:student_id/checkins', CheckInController.store);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.index); // global usage of authMiddleware

routes.use(authMiddleware); // after this, all others routes above will be protected

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);

routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/subscriptions', SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);
routes.get('/subscriptions/:id', SubscriptionController.show);
routes.put('/subscriptions/:id', SubscriptionController.update);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

routes.post('/help-orders/:id/answer', AnswerHelpOrderController.store);
routes.get('/help-orders', AnswerHelpOrderController.index);

export default routes;
