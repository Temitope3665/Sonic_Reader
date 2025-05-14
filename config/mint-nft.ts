import { Metaplex, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

export const unlockAndMintNFT = async (userPublicKey: PublicKey) => {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);

    // Use a keypair as authority (backend or admin wallet)
    const mintingAuthority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.NEXT_PUBLIC_MINT_AUTHORITY_SECRET!)));
    metaplex.use(keypairIdentity(mintingAuthority));

    // Optionally, upload metadata to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: 'Audio Converter Badge',
      symbol: 'AUDX',
      description: 'Awarded for converting a PDF to audio',
      //   image: toMetaplexFile(new File([/* binary */], "badge.png")),
    });

    console.log(uri, '-> uri');

    // Mint the NFT
    // const { nft } = await metaplex.nfts().create({
    //   uri,
    //   name: 'Audio Converter Badge',
    //   sellerFeeBasisPoints: 0, // No royalties
    //   symbol: 'AUDX',
    //   maxSupply: 1,
    //   tokenOwner: userPublicKey,
    // });

    // console.log('✅ NFT Minted:', nft.address.toBase58());
    // return nft;
  } catch (error) {
    console.error('❌ Error minting NFT:', error);
    throw error;
  }
};
