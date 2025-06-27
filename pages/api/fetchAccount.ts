import type { NextApiRequest, NextApiResponse } from 'next'
import pluggyClient from './lib/pluggyClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { itemId } = req.body
   try {
    const accounts = await pluggyClient.fetchAccounts(itemId)
    console.log("Accounts:", accounts)
    res.status(200).json(accounts)
  } catch (error: any) {
    console.error("Erro ao buscar contas:", error)
    res.status(500).json({ error: error.message || 'Erro desconhecido' })
  }
}