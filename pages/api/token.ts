import { NextApiRequest, NextApiResponse } from 'next'
import pluggyClient from './lib/pluggyClient'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  // itemId we want to update (if defined)
  const { itemId } = req.body
  try {
    const data = await pluggyClient.createConnectToken(itemId)
    res.status(201).json(data)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'There was an error during connect token creation.' })
  }
}