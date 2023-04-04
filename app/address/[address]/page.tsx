import Address from '../../../components/address';

const AddressPage = ({ params: { address } }: { params: { address: string } }) => (
  /* @ts-expect-error Async Server Component */
  <Address address={address} />
);

export default AddressPage;
