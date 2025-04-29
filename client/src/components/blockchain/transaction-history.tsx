import { formatAddress, formatDate, calculateTimeAgo, formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionType } from "@/types";

interface TransactionHistoryProps {
  transactions: TransactionType[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-20 w-20 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mt-4">No transactions yet</h3>
        <p className="text-muted-foreground mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex justify-between p-4 rounded-lg border border-border"
          >
            <div className="flex items-start space-x-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                tx.type === 'in' ? 'bg-green-500/20' : 'bg-destructive/20'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    tx.type === 'in' ? 'text-green-500' : 'text-destructive'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {tx.type === 'in' ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  )}
                </svg>
              </div>
              <div>
                <div className="font-medium">
                  {tx.type === 'in' ? 'Received' : 'Sent'} {formatCurrency(tx.amount)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {tx.type === 'in' ? 'From' : 'To'}: {formatAddress(tx.type === 'in' ? tx.from : tx.to)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(tx.date)} • {calculateTimeAgo(tx.date)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                <a
                  href={`https://etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  View on Etherscan
                </a>
              </div>
              <div className={`text-sm font-medium mt-1 ${
                tx.type === 'in' ? 'text-green-500' : 'text-destructive'
              }`}>
                {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
