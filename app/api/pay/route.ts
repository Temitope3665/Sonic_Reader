import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

export async function GET(request: NextRequest) {
  const account = request.nextUrl.searchParams.get('account') || '';

  try {
    if (!account) return NextResponse.json({ error: `Missing account` }, { status: 400 });

    const userPublicKey = new PublicKey(account.toString());
    const recipient = new PublicKey('89xLNouV7DKpS11fTQpyirhWQ8QT54Kat9QfAJ8arEHv');
    const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const connection = new Connection('https://api.devnet.solana.com');

    const userAta = await getAssociatedTokenAddress(usdcMint, userPublicKey);
    const recipientAta = await getAssociatedTokenAddress(usdcMint, recipient);

    const amount = 0.001 * 10 ** 6;

    const tx = new Transaction().add(
      createTransferCheckedInstruction(
        userAta,
        usdcMint,
        recipientAta,
        userPublicKey,
        amount,
        6 // decimals
      )
    );

    tx.feePayer = userPublicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const serializedTx = tx.serialize({ requireAllSignatures: false });

    return NextResponse.json({
      message: 'Validated successfully',
      transaction: serializedTx.toString('base64'),
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
