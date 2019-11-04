
import { NowRequest, NowResponse } from '@now/node'

export default (req: NowRequest, res: NowResponse) => {
  res.json([
	{ "quantity": 1, "name": "cup" },
	{ "quantity": 0, "name": "water" },
	{ "quantity": 2, "name": "phone" }
  ])
}

