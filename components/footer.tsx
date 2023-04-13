const Footer = () => {
  return (
    <footer className="mx-4 flex justify-between border-t border-gray-200 py-5">
      <p className="text-xs text-gray-900">Escrow dApp © {new Date().getFullYear()}</p>
      <p className="text-xs text-gray-900">Made with ❤️</p>
    </footer>
  );
};

export default Footer;
