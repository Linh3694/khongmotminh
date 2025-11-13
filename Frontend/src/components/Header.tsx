import headerIcon from '/header.svg'

const Header = () => {
  return (
    <header className="bg-[#3500E0] py-3 px-[10%] flex items-center justify-between">
      <div className="flex-1"></div>
      <img
        src={headerIcon}
        alt="Header Icon"
        className="h-12 w-auto"
      />
    </header>
  );
};

export default Header
