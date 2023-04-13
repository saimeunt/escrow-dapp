import { ImageResponse } from 'next/server';

export const size = { width: 1200, height: 630 };
export const alt = 'Escrow dApp';
export const contentType = 'image/png';

const handler = () => {
  // const scheme = `http${process.env.NODE_ENV !== 'production' ? '' : 's'}`;
  // const iconUrl = `${scheme}://${process.env.VERCEL_URL}/icon.svg`;
  return new ImageResponse(
    (
      <div
        tw={`flex flex-col justify-center items-center w-[${size.width}px] h-[${size.height}px]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://escrow-dapp-sepolia.vercel.app/icon.svg"
          alt={alt}
          width={320}
          height={320}
        />
        <h1 tw="text-8xl font-bold tracking-tight">Escrow dApp</h1>
      </div>
    ),
    size,
  );
};

export default handler;
