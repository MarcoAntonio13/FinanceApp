import type { NextApiRequest, NextApiResponse } from 'next'
import pluggyClient from './lib/pluggyClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { itemId } = req.body
  console.log("Item ID rendimentos:", itemId)

  try {
    const rendimentos = await pluggyClient.fetchLoans(itemId)
    res.status(200).json(rendimentos)
  } catch (error: any) {
    res.status(500).json({error: error.message })
  }

}