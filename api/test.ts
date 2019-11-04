
import { NowRequest, NowResponse } from '@now/node'

export default (req: NowRequest, res: NowResponse) => {
  res.json([
	{ "quantity": 1, "name": "cup" },
	{ "quantity": 2, "name": "phone" },
	{ "quantity": 3, "name": "zeit" }
  ])
}

