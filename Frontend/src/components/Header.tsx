import headerIcon from '/header.svg'

const Header = () => {
  return (
    <header className="bg-[#3500E0] lg:py-3 py-2 px-[10%] flex items-center justify-between">
      <div className="flex-1"></div>
      <img
        src={headerIcon}
        alt="Header Icon"
        className="h-8 lg:h-12 w-auto"
      />
    </header>
  );
};

export default Header
