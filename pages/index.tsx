import Head from 'next/head'
import dynamic from 'next/dynamic'

import { useCallback, useEffect, useState } from 'react'
import type {
  ConnectEventPayload,
  PluggyConnect as PluggyConnectType,
} from 'react-pluggy-connect'
import type { Item } from 'pluggy-sdk'

import styles from '../styles/Home.module.css'

const PluggyConnect = dynamic(
  () =>
    (import('react-pluggy-connect') as any).then((mod) => mod.PluggyConnect),
  { ssr: false }
) as typeof PluggyConnectType

export default function Home() {
  const [withSandbox, setSandbox] = useState<boolean>(false)
  const [connectToken, setConnectToken] = useState<string>()
  const [connecting, setConnecting] = useState<boolean>(false)
  const [item, setItem] = useState<Item | null>(null)
  const itauId = 'c895104f-7d94-4ae6-b2ab-f579d8ca86d2'

  const generateToken = useCallback(async (itemId?: string) => {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // you can pass an itemId to generate a token to update that specific item or use
      // the same connect token that creates the item you want to update see https://docs.pluggy.ai/docs/updating-an-item
      body: JSON.stringify({ itemId }),
    })

    const { accessToken } = await response.json()
    setConnectToken(accessToken)
  }, [])

  const handleOpenConnectInUpdateMode = useCallback(async () => {
    /*
    if (!item) {
      // nothing to update -> just return
      return
    }
    */
    await generateToken(itauId)
    setConnecting(true)
  }, [item])

  const fetchAccounts = async () => {
    //if (!item) return
    console.log("XXConnect Token: ", connectToken)
    console.log("XXItem ID: ", itauId)
    const res = await fetch('/api/fetchAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: itauId }),
    })

    const data = await res.json()
    console.log("Contas:", data)
    if (data.results[0] != undefined) {
      console.log("Data Results!", data.results[1])
    fetchTransactions(data.results[0]?.id)
    console.log("Transactions OK!")
    }
    
  }

  const fetchTransactions = async (accId: string) => {
    console.log("Init transaction")
    const transactions = await fetch('/api/buscaTransacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accId }),
    })

    const dataTransactions = await transactions.json()
    console.log("Transacoes:", dataTransactions)
  }

  useEffect(() => {
    // generate a token to be used in the Pluggy Connect when component is mounted
    generateToken()
  }, [generateToken])

  const onSuccess = useCallback((itemData: { item: Item }) => {
    console.log('Yaaay, we got an item: ', itemData.item)
    setItem(itemData.item)
    console.log("Dados item:", item)
  }, [])

  const handleFindData = useCallback(async () => {
    console.log("H1")
    fetchAccounts(itauId)
    console.log("Fetch excutado!")
  }, [item])

  const onError = useCallback((error) => {
    console.log('Oops, there was an error: ', error)
  }, [])

  const handleEvent = useCallback((payload: ConnectEventPayload) => {
    const { event } = payload

    console.log('[event]', event)
  }, [])

  const handleCheckboxChange = useCallback((event) => {
    setSandbox((previous) => !previous)
  }, [])

  const handleClose = useCallback(() => {
    setConnecting(false)
  }, [])

  const handleOpenConnectInCreateMode = useCallback(async () => {
    // if there is an item, we remove it from the state
    // to be able to open the Pluggy Connect widget in create mode
    if (item) {
      setItem(undefined)
    }

    setConnecting(true)
  }, [item])

  return (
    <div className={styles.container}>
      <Head>
        <title>Pluggy - Next.js Example</title>
        <link rel="icon" sizes="96x96" href="/favicon-96x96.ico" />
        <link rel="icon" sizes="32x32" href="/favicon-32x32.ico" />
        <link rel="icon" sizes="16x16" href="/favicon-16x16.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pluggy Connect</h1>

        <p className={styles.description}>
          Quickstart application to run Pluggy Connect with{' '}
          <a
            href="https://github.com/vercel/next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
        </p>

        <div className={styles.sandboxCheckbox}>
          <label>
            <input
              type="checkbox"
              checked={withSandbox}
              onChange={handleCheckboxChange}
              className={styles.input}
            />
            Include{' '}
            <a
              href="https://docs.pluggy.ai/#sandbox"
              target="_blank"
              rel="noopener noreferrer"
            >
              sandbox connectors
            </a>
          </label>
        </div>

        <div className={styles.grid}>
          <button onClick={handleOpenConnectInCreateMode}>
            Connect an account
          </button>
          <button
            className={`secondary ${!item ? 'disabled' : ''}`}
            onClick={handleOpenConnectInUpdateMode}
          >
            Update last connection
          </button>
          <button
            className={`secondary ${!item ? 'disabled' : ''}`}
            onClick={handleFindData}
          >
            Search Data
          </button>
          {connecting && (
            <PluggyConnect
              updateItem={itauId}
              connectToken={connectToken}
              includeSandbox={withSandbox}
              onSuccess={onSuccess}
              onError={onError}
              onClose={handleClose}
              onEvent={handleEvent}
            />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/logo.png" alt="Pluggy Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}