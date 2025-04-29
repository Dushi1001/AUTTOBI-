import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/store/store";
import { WalletConnect } from "@/components/blockchain/wallet-connect";
import { TransactionHistory } from "@/components/blockchain/transaction-history";
import Sidebar from "@/components/layout/sidebar";
import { formatCurrency, formatAddress } from "@/lib/utils";
import { connectWallet } from "@/store/slices/walletSlice";

export default function Wallet() {
  const dispatch = useDispatch();
  const { address, balance, isConnected, transactions } = useSelector((state: RootState) => state.wallet);
  
  useEffect(() => {
    document.title = "Wallet | Gaming App";
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">Blockchain Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your digital assets</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Wallet Balance</CardTitle>
              <CardDescription>Available funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              {isConnected && (
                <div className="text-xs text-muted-foreground mt-1">
                  Connected: {formatAddress(address)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Game Tokens</CardTitle>
              <CardDescription>In-game currency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250 GTK</div>
              <div className="text-xs text-muted-foreground mt-1">≈ {formatCurrency(1250 * 0.012)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">NFT Items</CardTitle>
              <CardDescription>Collectibles owned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs text-muted-foreground mt-1">Value: {formatCurrency(1425)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Send Funds</CardTitle>
                <CardDescription>Transfer to another address</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" placeholder="0x..." className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" className="mt-1" />
                  </div>
                  
                  <Button type="submit" disabled={!isConnected}>
                    Send Transaction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect Wallet</CardTitle>
                <CardDescription>Link your blockchain wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnect />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
                <CardDescription>Current blockchain info</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-medium">Ethereum Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Price</span>
                    <span className="font-medium">12 Gwei</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Height</span>
                    <span className="font-medium">18,245,672</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
