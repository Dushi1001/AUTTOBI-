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
import Sidebar from "@/components/layout/SidebarComponent";
import { formatCurrency, formatAddress } from "@/lib/utils";
import { connectWallet } from "@/store/slices/walletSlice";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiBinance, SiDogecoin, SiLitecoin } from "react-icons/si";

export default function Wallet() {
  const dispatch = useDispatch();
  const { address, balance, isConnected, transactions } = useSelector((state: RootState) => state.wallet);
  
  useEffect(() => {
    document.title = "Wallet | AUTTOBI Crypto";
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">AUTTOBI Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your crypto assets with gaming-inspired tools</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Bitcoin</CardTitle>
                  <CardDescription>BTC Balance</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <FaBitcoin className="h-6 w-6 text-amber-500" />
                </div>
              </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Ethereum</CardTitle>
                  <CardDescription>ETH Balance</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaEthereum className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.45 ETH</div>
              <div className="text-xs text-muted-foreground mt-1">≈ {formatCurrency(1.45 * 2850)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Binance Coin</CardTitle>
                  <CardDescription>BNB Balance</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <SiBinance className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5 BNB</div>
              <div className="text-xs text-muted-foreground mt-1">Value: {formatCurrency(8.5 * 475)}</div>
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
