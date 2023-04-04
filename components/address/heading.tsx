import Image from 'next/image';

const Heading = ({ address, isAddress }: { address: string; isAddress: boolean }) => (
  <div className="flex items-center border-b border-gray-200 pb-5">
    {isAddress && (
      <Image
        className="mr-2 rounded-full"
        src={`https://effigy.im/a/${address}.png`}
        alt="Ethereum avatar"
        width={24}
        height={24}
      />
    )}

    <h1 className="text-base font-semibold leading-6 text-gray-900">
      {isAddress ? 'Address' : 'Not a valid address'}{' '}
      <span className="text-sm font-normal">{address}</span>
    </h1>
  </div>
);

export default Heading;
