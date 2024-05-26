import {OK} from 'http-status';
import {Request, Response} from 'express';

async function ping(_: Request, res: Response) {
  res.status(OK).send(`Server is running`);
}

export default ping;
