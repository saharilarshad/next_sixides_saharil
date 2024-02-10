'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { WrapAppType } from "@/types"

const queryClient = new QueryClient()

// type Props = {
//     children: React.ReactNode
// }

const QueryProvider = ({ children }: WrapAppType) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider