import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { connectWallet, disconnectWallet } from "@/store/slices/walletSlice";
import { formatAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isConnected, address } = useSelector((state: RootState) => state.wallet);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!window.ethereum) {
      toast({
        title: "Ethereum provider not found",
        description: "Please install MetaMask or another Ethereum wallet extension",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const balance = await provider.getBalance(accounts[0]);
        const formattedBalance = Number(ethers.formatEther(balance));
        
        dispatch(connectWallet({
          address: accounts[0],
          balance: formattedBalance,
          isConnected: true,
        }));
        
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${formatAddress(accounts[0])}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to your wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Connected Wallet</div>
            <div className="text-sm text-muted-foreground">{formatAddress(address)}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <Button onClick={handleDisconnect} variant="outline" className="w-full">
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="space-y-2 text-center py-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Connect to AUTTOBI</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Ethereum wallet to access AUTTOBI features
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
        {isConnecting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </>
        )}
      </Button>
    </div>
  );
}
