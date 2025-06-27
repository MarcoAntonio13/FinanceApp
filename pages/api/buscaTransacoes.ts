import type { NextApiRequest, NextApiResponse } from 'next'
import pluggyClient from './lib/pluggyClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { accId } = req.body
  console.log("Account ID:", accId)

  try {
    const transactions = await pluggyClient.fetchAllTransactions(accId)
    res.status(200).json(transactions)
  } catch (error: any) {
    res.status(500).json({error: error.message })
  }

}