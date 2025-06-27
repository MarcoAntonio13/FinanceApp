import { PluggyClient } from 'pluggy-sdk'

// Avoid destructing based on nextjs:
// https://nextjs.org/docs/basic-features/environment-variables
const PLUGGY_CLIENT_ID = process.env.PLUGGY_CLIENT_ID
const PLUGGY_CLIENT_SECRET = process.env.PLUGGY_CLIENT_SECRET

const pluggyClient = new PluggyClient({
  clientId: PLUGGY_CLIENT_ID,
  clientSecret: PLUGGY_CLIENT_SECRET,
})

export default pluggyClient