import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { useCallback } from 'react';

const YOUR_WALLET = new PublicKey('5D1DzPHnjkDi3Ayn3UPxPxRRBusmrgc7b1GFSJdSwGcC'); // 🔁 Replace with your wallet

export const useSendSol = () => {
  const { publicKey, signTransaction, connected } = useWallet();

  const sendSolFromUser = useCallback(
    async (amountInSol: number) => {
      if (!connected || !publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        const lamports = amountInSol * 1_000_000_000;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: YOUR_WALLET,
            lamports,
          })
        );

        transaction.feePayer = publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        const signedTx = await signTransaction(transaction);
        const txId = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txId);

        console.log('✅ Transaction successful with ID:', txId);
        return txId;
      } catch (error) {
        console.error('❌ Transaction failed:', error);
        throw error;
      }
    },
    [publicKey, signTransaction, connected]
  );

  return { sendSolFromUser };
};
