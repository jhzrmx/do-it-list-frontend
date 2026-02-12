import InputField from "@/components/InputField";
import { MdMenu, MdOutlineSearch } from "react-icons/md";
import Logo from "../assets/logo.svg";

const Todos = () => {
  return (
    <div className="h-dvh bg-primary flex flex-col">
      <div className="px-4 h-32 flex items-center">
        <button className="text-white">
          <MdMenu size={24} />
        </button>

        <div className="px-4 text-white">
          <h1 className="text-3xl">Hello!</h1>
          <h1 className="text-3xl font-bold">Username!</h1>
        </div>

        <div className="ml-auto">
          <img src={Logo} className="w-24" />
        </div>
      </div>
      <div className="px-4 pb-6">
        <InputField
          type="search"
          icon={<MdOutlineSearch size={24} />}
          placeholder="Search Todos"
        />
      </div>
      <div className="bg-secondary rounded-t-4xl flex flex-1 flex-col items-center">
        <p>No content</p>
      </div>
    </div>
  );
};

export default Todos;
