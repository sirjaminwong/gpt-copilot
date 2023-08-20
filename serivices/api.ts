import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import superjson from "superjson"

export const api = createTRPCProxyClient<any>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc"
    })
  ]
})
