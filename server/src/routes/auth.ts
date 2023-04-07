import { Request, Response, Router } from 'express';

const router = Router();

const signup = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
};

router.post('/signup', signup);

export default router;
