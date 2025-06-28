import type { NextApiRequest, NextApiResponse } from 'next'
import pluggyClient from './lib/pluggyClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { itemId } = req.body
  console.log("Item ID investimentos:", itemId)

  try {
    const investimentos = await pluggyClient.fetchInvestments(itemId)
    res.status(200).json(investimentos)
  } catch (error: any) {
    res.status(500).json({error: error.message })
  }

}